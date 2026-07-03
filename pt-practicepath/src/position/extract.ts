// Modes A/B: position-description and URL parsing (FR-1, FR-2).
//
// Same discipline as the seeding extractor: schema-constrained structured
// outputs, evidence quotes, no outside-knowledge inference. The Anthropic
// client is injectable so the parse pipeline is testable without
// credentials; the API layer reports a typed error when no credentials are
// configured rather than failing obscurely.

import Anthropic from '@anthropic-ai/sdk';
import { JURISDICTIONS } from '../sources/registry.js';
import { fetchPage, FetchBlockedError, htmlToText } from '../seeding/fetcher.js';
import { normalizeStatedRequirement } from './templates.js';
import type { ParsedPosition, PracticeSetting } from './types.js';

export const PARSE_MODEL = 'claude-opus-4-8';
const MAX_POSTING_CHARS = 60_000;

const SETTINGS: PracticeSetting[] = [
  'outpatient', 'acute_care', 'snf', 'home_health', 'schools', 'private_practice', 'travel',
];

const PARSE_SCHEMA = {
  type: 'object',
  properties: {
    role: { type: 'string', enum: ['PT', 'PTA', 'other'] },
    state: {
      type: ['string', 'null'],
      description: 'Two-letter USPS code of the US state/jurisdiction the position is in, lowercase, or null if not stated',
    },
    city: { type: ['string', 'null'] },
    setting: { type: ['string', 'null'], enum: [...SETTINGS, null] },
    specialty: { type: ['string', 'null'] },
    employer: { type: ['string', 'null'] },
    statedRequirements: {
      type: 'array',
      items: { type: 'string' },
      description: 'Requirements the posting explicitly states (certifications, clearances, licenses) — short phrases, verbatim-faithful',
    },
    evidence: {
      type: 'array',
      items: { type: 'string' },
      description: 'Up to 5 verbatim snippets supporting role/location/setting, for user confirmation',
    },
  },
  required: ['role', 'state', 'city', 'setting', 'specialty', 'employer', 'statedRequirements', 'evidence'],
  additionalProperties: false,
} as const;

const SYSTEM_PROMPT = `You parse physical-therapy job postings into structured attributes for a licensure-requirements product.

Rules:
- Only extract what the posting states. Never infer location, setting, or requirements from outside knowledge of the employer.
- role: "PT" for physical therapist positions, "PTA" for physical therapist assistant, "other" for anything else (including OT, SLP, aides).
- statedRequirements: every credential/clearance the posting explicitly requires or prefers, as short phrases (e.g. "BLS", "OCS preferred", "driver's license").
- evidence: short verbatim snippets a user can read to confirm the parse.`;

/** Minimal client surface so tests can inject a stub. */
export interface MessagesClient {
  messages: { create(params: Record<string, unknown>): Promise<{ stop_reason: string | null; content: Array<{ type: string; text?: string }> }> };
}

export class NotAPtPositionError extends Error {
  constructor() {
    super('This posting does not appear to be a PT/PTA position — the product covers PT and PTA only (FR-6)');
    this.name = 'NotAPtPositionError';
  }
}

export async function parsePositionText(
  text: string,
  client: MessagesClient = new Anthropic() as unknown as MessagesClient,
): Promise<ParsedPosition> {
  const truncated = text.length > MAX_POSTING_CHARS;
  const body = truncated ? text.slice(0, MAX_POSTING_CHARS) : text;

  const response = await client.messages.create({
    model: PARSE_MODEL,
    max_tokens: 4096,
    thinking: { type: 'adaptive' },
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    output_config: { format: { type: 'json_schema', schema: PARSE_SCHEMA as unknown as Record<string, unknown> } },
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: (truncated ? `NOTE: posting truncated to ${MAX_POSTING_CHARS} chars.\n\n` : '') + body,
          },
        ],
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock?.text) throw new Error(`Position parse returned no text (stop_reason=${response.stop_reason})`);
  const raw = JSON.parse(textBlock.text) as {
    role: 'PT' | 'PTA' | 'other';
    state: string | null;
    city: string | null;
    setting: PracticeSetting | null;
    specialty: string | null;
    employer: string | null;
    statedRequirements: string[];
    evidence: string[];
  };

  if (raw.role === 'other') throw new NotAPtPositionError();

  const state = raw.state?.toLowerCase();
  const jurisdiction = state && JURISDICTIONS.some((j) => j.id === state) ? state : undefined;

  return {
    role: raw.role,
    ...(jurisdiction ? { jurisdiction } : {}),
    ...(raw.city ? { city: raw.city } : {}),
    ...(raw.setting ? { setting: raw.setting } : {}),
    ...(raw.specialty ? { specialty: raw.specialty } : {}),
    ...(raw.employer ? { employer: raw.employer } : {}),
    statedRequirements: raw.statedRequirements.map(normalizeStatedRequirement),
    evidence: raw.evidence.slice(0, 5),
    needsConfirmation: true,
  };
}

/** Mode B: fetch a posting URL, then parse as Mode A (FR-2 degradation on failure). */
export async function parsePositionUrl(
  url: string,
  client?: MessagesClient,
): Promise<ParsedPosition> {
  let page;
  try {
    page = await fetchPage(url);
  } catch (err) {
    if (err instanceof FetchBlockedError) {
      throw new FetchBlockedError(
        url,
        err.status,
        'The posting could not be fetched (login wall, bot protection, or expired posting) — paste the description text instead',
      );
    }
    throw err;
  }
  const text = page.contentType?.includes('html') ? page.text : htmlToText(page.text);
  return parsePositionText(text, client);
}
