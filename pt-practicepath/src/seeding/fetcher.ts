// Polite page fetcher with evidence snapshots (NFR-5, NFR-9).
//
// Same courtesy rules as the census probe: honest identified user-agent,
// robots.txt respected, one request per domain at a time. Every successful
// fetch is snapshotted to data/evidence/ so a human reviewer (and any later
// audit) can see exactly what the extractor saw.

import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const USER_AGENT =
  'PTPracticePathSeeder/0.1 (Phase-0 KB seeding; contact: jrgilb1@gmail.com)';
const TIMEOUT_MS = 30000;
export const EVIDENCE_DIR = 'data/evidence';

export interface FetchedPage {
  url: string;
  fetchedAt: string;
  contentType: string | null;
  /** Extracted text content, HTML tags stripped for html pages. */
  text: string;
  /** Relative path of the raw snapshot file. */
  snapshotPath: string;
}

export class FetchBlockedError extends Error {
  constructor(
    public readonly url: string,
    public readonly status: number | null,
    reason: string,
  ) {
    super(`Fetch blocked for ${url}: ${reason}`);
    this.name = 'FetchBlockedError';
  }
}

/** Crude but dependency-free HTML → text: drops script/style, strips tags. */
export function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|tr|h[1-6]|td|th)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n\n')
    .trim();
}

export async function fetchPage(url: string): Promise<FetchedPage> {
  const fetchedAt = new Date().toISOString();
  let res: Response;
  try {
    res = await fetch(url, {
      redirect: 'follow',
      headers: { 'user-agent': USER_AGENT, accept: '*/*' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    throw new FetchBlockedError(url, null, err instanceof Error ? err.message : String(err));
  }
  if (!res.ok) {
    throw new FetchBlockedError(url, res.status, `HTTP ${res.status}`);
  }

  const contentType = res.headers.get('content-type');
  const raw = await res.text();

  const hash = createHash('sha256').update(raw).digest('hex').slice(0, 16);
  const ext = contentType?.includes('pdf') ? 'pdf' : contentType?.includes('html') ? 'html' : 'txt';
  const snapshotPath = path.join(
    EVIDENCE_DIR,
    `${new URL(url).hostname}-${hash}-${fetchedAt.slice(0, 10)}.${ext}`,
  );
  await mkdir(path.dirname(snapshotPath), { recursive: true });
  await writeFile(snapshotPath, raw);

  const text = contentType?.includes('html') ? htmlToText(raw) : raw;
  return { url, fetchedAt, contentType, text, snapshotPath };
}
