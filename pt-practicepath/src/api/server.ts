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
import { assembleReport, type Report } from '../engine/report.js';
import { UnknownJurisdictionError, type TherapistProfile } from '../engine/paths.js';
import { GoldenFactStore, type FactStore } from './facts.js';

interface StoredReport {
  id: string;
  jurisdiction: string;
  profile: TherapistProfile;
  report: Report;
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

export function createApiServer(factStore: FactStore = new GoldenFactStore()): Server {
  const reports = new Map<string, StoredReport>();

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
        sendError(
          res,
          501,
          'not_implemented',
          'Position-description and URL parsing (Modes A/B) arrive in Phase 2; use {"location": {"state": "..."}} for now',
        );
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
      const position = body.position as { jurisdiction?: string } | undefined;
      const jurisdiction = position?.jurisdiction?.toLowerCase();
      if (!jurisdiction) {
        sendError(res, 400, 'invalid_request', 'Provide {"position": {"jurisdiction": "<code>"}}');
        return;
      }
      const profile = normalizeProfile(body.profile);
      const facts = await factStore.factsFor(jurisdiction);
      const report = assembleReport(jurisdiction, profile, facts);
      const id = randomUUID();
      reports.set(id, { id, jurisdiction, profile, report });
      sendJson(res, 201, { id, report });
      return;
    }

    const reportMatch = url.pathname.match(/^\/v1\/reports\/([0-9a-f-]{36})(\/reverify)?$/);
    if (reportMatch) {
      const stored = reports.get(reportMatch[1]!);
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
        stored.report = assembleReport(stored.jurisdiction, stored.profile, facts);
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
  createApiServer().listen(port, () => {
    console.log(`PT PracticePath API listening on :${port}`);
  });
}
