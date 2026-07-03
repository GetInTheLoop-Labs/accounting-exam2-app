// HTTP API (PRD §8.6), dependency-free on node:http.
//
//   POST /v1/parse                 {location:{state,city?}} → parsed position (Mode C)
//                                  {text} | {url} → 501 until Phase 2 (position intelligence)
//   POST /v1/reports               {position:{jurisdiction}, profile?} → {id, report}
//   GET  /v1/reports/{id}          stored report
//   POST /v1/reports/{id}/reverify re-assembles from current facts; updates in place
//   GET  /v1/jurisdictions         coverage map + compact status
//
// Reports are held in memory — persistence is a production concern layered
// under the same handlers. Errors follow {error:{type,message}}.

import { createServer as createHttpServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JURISDICTIONS, SOURCES } from '../sources/registry.js';
import { assembleReport, type PositionContext, type Report } from '../engine/report.js';
import { UnknownJurisdictionError, type TherapistProfile } from '../engine/paths.js';
import { NotAPtPositionError, parsePositionText, parsePositionUrl, type MessagesClient } from '../position/extract.js';
import { FetchBlockedError } from '../seeding/fetcher.js';
import type { PracticeSetting } from '../position/types.js';
import { GoldenFactStore, type FactStore } from './facts.js';
import { FileReportStore, MemoryReportStore, type ReportStore } from './store.js';

export interface ApiOptions {
  factStore?: FactStore;
  /** Injectable LLM client for /v1/parse Modes A/B (tests use a stub). */
  parseClient?: MessagesClient;
  /** Report persistence; defaults to in-memory. Deployments use FileReportStore. */
  reportStore?: ReportStore;
}

function llmCredentialsPresent(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
}

interface ParsedPosition {
  role: 'PT';
  jurisdiction: string;
  city?: string;
  /** Always ask the user to confirm the parse before generating (FR-4). */
  needsConfirmation: true;
}

const DEFAULT_PROFILE: TherapistProfile = { licensedIn: [], nptePassed: false };

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body, null, 2);
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(payload);
}

function sendError(res: ServerResponse, status: number, type: string, message: string): void {
  sendJson(res, status, { error: { type, message } });
}

async function readBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (raw.trim() === '') return {};
  return JSON.parse(raw);
}

function normalizeProfile(input: unknown): TherapistProfile {
  if (input === undefined || input === null) return DEFAULT_PROFILE;
  const p = input as Partial<TherapistProfile>;
  return {
    licensedIn: Array.isArray(p.licensedIn) ? p.licensedIn.map(String) : [],
    ...(typeof p.homeState === 'string' ? { homeState: p.homeState } : {}),
    nptePassed: Boolean(p.nptePassed ?? (Array.isArray(p.licensedIn) && p.licensedIn.length > 0)),
    disciplineWithin2Years: Boolean(p.disciplineWithin2Years),
  };
}

export function createApiServer(options: FactStore | ApiOptions = {}): Server {
  // Back-compat: a bare FactStore may be passed directly.
  const opts: ApiOptions = 'factsFor' in options ? { factStore: options } : options;
  const factStore = opts.factStore ?? new GoldenFactStore();
  const reports = opts.reportStore ?? new MemoryReportStore();

  async function handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const url = new URL(req.url ?? '/', 'http://localhost');
    const route = `${req.method} ${url.pathname}`;

    if (route === 'GET /' || route === 'GET /index.html') {
      const webDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../web');
      const html = await readFile(path.join(webDir, 'index.html'), 'utf8');
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      res.end(html);
      return;
    }

    if (route === 'GET /v1/jurisdictions') {
      sendJson(res, 200, {
        jurisdictions: JURISDICTIONS.map((j) => ({
          id: j.id,
          name: j.name,
          compact: {
            member: j.compactMember,
            active: j.compactActiveDate !== undefined,
            ...(j.compactActiveDate ? { activeAsOf: j.compactActiveDate } : {}),
          },
          locatedSources: SOURCES.filter(
            (s) => s.issuerId === j.boardIssuerId && s.url !== undefined,
          ).length,
          ...(j.notes ? { notes: j.notes } : {}),
        })),
      });
      return;
    }

    if (route === 'POST /v1/parse') {
      const body = (await readBody(req)) as Record<string, unknown>;
      if (typeof body.text === 'string' || typeof body.url === 'string') {
        if (!opts.parseClient && !llmCredentialsPresent()) {
          sendError(
            res,
            503,
            'llm_unavailable',
            'Position parsing needs Anthropic credentials (set ANTHROPIC_API_KEY); use {"location": {"state": "..."}} meanwhile',
          );
          return;
        }
        try {
          const position =
            typeof body.text === 'string'
              ? await parsePositionText(body.text, opts.parseClient)
              : await parsePositionUrl(body.url as string, opts.parseClient);
          sendJson(res, 200, { position });
        } catch (err) {
          if (err instanceof NotAPtPositionError) {
            sendError(res, 422, 'not_pt_position', err.message);
          } else if (err instanceof FetchBlockedError) {
            sendError(res, 422, 'fetch_blocked', err.message);
          } else {
            throw err;
          }
        }
        return;
      }
      const location = body.location as { state?: string; city?: string } | undefined;
      const state = location?.state?.toLowerCase();
      if (!state) {
        sendError(res, 400, 'invalid_request', 'Provide {"location": {"state": "<code>"}}');
        return;
      }
      if (!JURISDICTIONS.some((j) => j.id === state)) {
        sendError(res, 400, 'invalid_request', `Unknown jurisdiction: ${state}`);
        return;
      }
      const parsed: ParsedPosition = {
        role: 'PT',
        jurisdiction: state,
        ...(location?.city ? { city: location.city } : {}),
        needsConfirmation: true,
      };
      sendJson(res, 200, { position: parsed });
      return;
    }

    if (route === 'POST /v1/reports') {
      const body = (await readBody(req)) as Record<string, unknown>;
      const position = body.position as
        | { jurisdiction?: string; setting?: PracticeSetting; statedRequirements?: string[] }
        | undefined;
      const jurisdiction = position?.jurisdiction?.toLowerCase();
      if (!jurisdiction) {
        sendError(res, 400, 'invalid_request', 'Provide {"position": {"jurisdiction": "<code>"}}');
        return;
      }
      const profile = normalizeProfile(body.profile);
      const heldCredentials = Array.isArray((body.profile as Record<string, unknown> | undefined)?.certifications)
        ? ((body.profile as Record<string, unknown>).certifications as unknown[]).map(String)
        : [];
      const positionContext: PositionContext = {
        ...(position?.setting ? { setting: position.setting } : {}),
        ...(Array.isArray(position?.statedRequirements)
          ? { statedRequirements: position.statedRequirements.map(String) }
          : {}),
        heldCredentials,
      };
      const facts = await factStore.factsFor(jurisdiction);
      const report = assembleReport(jurisdiction, profile, facts, new Date(), positionContext);
      const id = randomUUID();
      await reports.put({ id, jurisdiction, profile, position: positionContext, report });
      sendJson(res, 201, { id, report });
      return;
    }

    const reportMatch = url.pathname.match(/^\/v1\/reports\/([0-9a-f-]{36})(\/reverify)?$/);
    if (reportMatch) {
      const stored = await reports.get(reportMatch[1]!);
      if (!stored) {
        sendError(res, 404, 'not_found', 'No such report');
        return;
      }
      if (req.method === 'GET' && !reportMatch[2]) {
        sendJson(res, 200, { id: stored.id, report: stored.report });
        return;
      }
      if (req.method === 'POST' && reportMatch[2]) {
        const facts = await factStore.factsFor(stored.jurisdiction);
        stored.report = assembleReport(stored.jurisdiction, stored.profile, facts, new Date(), stored.position);
        await reports.put(stored);
        sendJson(res, 200, { id: stored.id, report: stored.report });
        return;
      }
    }

    sendError(res, 404, 'not_found', `No route: ${route}`);
  }

  return createHttpServer((req, res) => {
    handle(req, res).catch((err) => {
      if (err instanceof SyntaxError) {
        sendError(res, 400, 'invalid_request', 'Body is not valid JSON');
      } else if (err instanceof UnknownJurisdictionError) {
        sendError(res, 400, 'invalid_request', err.message);
      } else if (err instanceof Error && /Already licensed/.test(err.message)) {
        sendError(res, 400, 'invalid_request', err.message);
      } else {
        sendError(res, 500, 'api_error', err instanceof Error ? err.message : 'Internal error');
      }
    });
  });
}

// Direct execution: npm run api [PORT]
const invokedDirectly = process.argv[1]?.endsWith('server.ts') || process.argv[1]?.endsWith('server.js');
if (invokedDirectly) {
  const port = Number(process.argv[2] ?? process.env.PORT ?? 3000);
  createApiServer({ reportStore: new FileReportStore() }).listen(port, () => {
    console.log(`PT PracticePath API listening on :${port} (reports persisted to data/reports/)`);
  });
}
