import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import { createApiServer } from '../src/api/server.js';

let server: Server;
let base: string;

beforeAll(async () => {
  server = createApiServer();
  await new Promise<void>((resolve) => server.listen(0, resolve));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

afterAll(() => new Promise<void>((resolve) => server.close(() => resolve())));

async function post(path: string, body: unknown): Promise<{ status: number; json: any }> {
  const res = await fetch(`${base}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { status: res.status, json: await res.json() };
}

describe('GET /', () => {
  it('serves the web UI', async () => {
    const res = await fetch(`${base}/`);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/html');
    const html = await res.text();
    expect(html).toContain('PracticePath');
    expect(html).toContain('/v1/reports'); // UI talks to the API
    expect(html).toContain('data-theme'); // both themes wired
  });
});

describe('GET /v1/jurisdictions', () => {
  it('returns the coverage map with compact status', async () => {
    const res = await fetch(`${base}/v1/jurisdictions`);
    const { jurisdictions } = (await res.json()) as any;
    expect(res.status).toBe(200);
    expect(jurisdictions).toHaveLength(53);
    const nv = jurisdictions.find((j: any) => j.id === 'nv');
    expect(nv.compact).toEqual({ member: true, active: true, activeAsOf: '2026-01-20' });
    const mn = jurisdictions.find((j: any) => j.id === 'mn');
    expect(mn.notes).toMatch(/CONFLICT/);
    const tx = jurisdictions.find((j: any) => j.id === 'tx');
    expect(tx.locatedSources).toBeGreaterThan(0);
  });
});

describe('POST /v1/parse', () => {
  it('parses Mode C locations and always requires confirmation (FR-4)', async () => {
    const { status, json } = await post('/v1/parse', { location: { state: 'LA', city: 'New Orleans' } });
    expect(status).toBe(200);
    expect(json.position).toEqual({
      role: 'PT',
      jurisdiction: 'la',
      city: 'New Orleans',
      needsConfirmation: true,
    });
  });

  it('rejects unknown states and empty bodies', async () => {
    expect((await post('/v1/parse', { location: { state: 'zz' } })).status).toBe(400);
    expect((await post('/v1/parse', {})).status).toBe(400);
  });

  it('returns typed 503 for Modes A/B when no LLM credentials are configured', async () => {
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.ANTHROPIC_AUTH_TOKEN;
    const { status, json } = await post('/v1/parse', { text: 'Outpatient PT, Austin TX...' });
    expect(status).toBe(503);
    expect(json.error.type).toBe('llm_unavailable');
  });
});

describe('POST /v1/parse — Mode A with injected client', () => {
  it('parses postings and normalizes stated requirements', async () => {
    const stub = {
      messages: {
        create: async () => ({
          stop_reason: 'end_turn',
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                role: 'PT',
                state: 'la',
                city: 'New Orleans',
                setting: 'home_health',
                specialty: null,
                employer: 'Bayou Home Care',
                statedRequirements: ['BLS', "driver's license"],
                evidence: ['Home Health PT — New Orleans, LA'],
              }),
            },
          ],
        }),
      },
    };
    const local = createApiServer({ parseClient: stub });
    await new Promise<void>((resolve) => local.listen(0, resolve));
    const port = (local.address() as AddressInfo).port;
    try {
      const res = await fetch(`http://127.0.0.1:${port}/v1/parse`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text: 'Home Health PT — New Orleans, LA. BLS required.' }),
      });
      const json = (await res.json()) as any;
      expect(res.status).toBe(200);
      expect(json.position).toMatchObject({
        role: 'PT',
        jurisdiction: 'la',
        setting: 'home_health',
        needsConfirmation: true,
      });
      expect(json.position.statedRequirements).toContain('bls-cpr');
    } finally {
      await new Promise<void>((resolve) => local.close(() => resolve()));
    }
  });
});

describe('reports lifecycle', () => {
  it('creates, fetches, and reverifies a report', async () => {
    const created = await post('/v1/reports', {
      position: { jurisdiction: 'la' },
      profile: { licensedIn: ['tx'], homeState: 'tx' },
    });
    expect(created.status).toBe(201);
    expect(created.json.report.recommended.path.kind).toBe('compact');
    expect(created.json.report.recommended.cost.knownUsd).toBe(50); // golden LA facts

    const fetched = await fetch(`${base}/v1/reports/${created.json.id}`);
    expect(fetched.status).toBe(200);
    const fetchedJson = (await fetched.json()) as any;
    expect(fetchedJson.report.generatedAt).toBe(created.json.report.generatedAt);

    const reverified = await post(`/v1/reports/${created.json.id}/reverify`, {});
    expect(reverified.status).toBe(200);
    expect(Date.parse(reverified.json.report.generatedAt)).toBeGreaterThanOrEqual(
      Date.parse(created.json.report.generatedAt),
    );
  });

  it('includes the position layer with gap analysis when setting given (FR-12/FR-17)', async () => {
    const { status, json } = await post('/v1/reports', {
      position: { jurisdiction: 'la', setting: 'home_health', statedRequirements: ['BLS'] },
      profile: { licensedIn: ['tx'], homeState: 'tx', certifications: ['bls'] },
    });
    expect(status).toBe(201);
    const reqs = json.report.position.requirements;
    const bls = reqs.find((r: any) => r.id === 'bls-cpr');
    expect(bls.basis).toBe('employer_stated');
    expect(bls.status).toBe('satisfied');
    expect(reqs[0].basis).toBe('legal'); // authority ordering
    expect(reqs.find((r: any) => r.id === 'home-health-background').status).toBe('needed');
  });

  it('omits the position layer without setting or stated requirements', async () => {
    const { json } = await post('/v1/reports', {
      position: { jurisdiction: 'la' },
      profile: { licensedIn: ['tx'], homeState: 'tx' },
    });
    expect(json.report.position).toBeUndefined();
  });

  it('new-grad profile gets initial licensure recommended', async () => {
    const { json } = await post('/v1/reports', { position: { jurisdiction: 'tx' } });
    expect(json.report.recommended.path.kind).toBe('initial');
    expect(
      json.report.recommended.requirements.map((r: any) => r.requirementId),
    ).toContain('npte-registration');
  });

  it('404s unknown report ids, 400s bad requests', async () => {
    const missing = await fetch(`${base}/v1/reports/00000000-0000-0000-0000-000000000000`);
    expect(missing.status).toBe(404);
    expect((await post('/v1/reports', {})).status).toBe(400);
    const already = await post('/v1/reports', {
      position: { jurisdiction: 'tx' },
      profile: { licensedIn: ['tx'], homeState: 'tx' },
    });
    expect(already.status).toBe(400);
    expect(already.json.error.message).toMatch(/Already licensed/);
  });

  it('rejects malformed JSON with a typed error', async () => {
    const res = await fetch(`${base}/v1/reports`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{not json',
    });
    expect(res.status).toBe(400);
    expect(((await res.json()) as any).error.type).toBe('invalid_request');
  });
});
