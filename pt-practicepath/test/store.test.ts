import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import type { AddressInfo } from 'node:net';
import { afterAll, describe, expect, it } from 'vitest';
import { FileReportStore } from '../src/api/store.js';
import { createApiServer } from '../src/api/server.js';

const dir = mkdtempSync(path.join(tmpdir(), 'ptpp-store-'));
afterAll(() => rmSync(dir, { recursive: true, force: true }));

describe('FileReportStore', () => {
  it('round-trips reports and misses cleanly', async () => {
    const store = new FileReportStore(dir);
    const entry = {
      id: '11111111-1111-1111-1111-111111111111',
      jurisdiction: 'la',
      profile: { licensedIn: ['tx'], homeState: 'tx', nptePassed: true },
      report: { fake: true } as never,
    };
    await store.put(entry);
    expect(await store.get(entry.id)).toEqual(entry);
    expect(await store.get('22222222-2222-2222-2222-222222222222')).toBeUndefined();
  });

  it('rejects path-traversal ids', async () => {
    const store = new FileReportStore(dir);
    expect(await store.get('../../etc/passwd')).toBeUndefined();
    await expect(
      store.put({ id: '../evil', jurisdiction: 'x', profile: { licensedIn: [] }, report: {} as never }),
    ).rejects.toThrow(/Invalid report id/);
  });

  it('reports survive a server restart (persistence end-to-end)', async () => {
    const store = new FileReportStore(dir);
    const s1 = createApiServer({ reportStore: store });
    await new Promise<void>((r) => s1.listen(0, r));
    const base1 = `http://127.0.0.1:${(s1.address() as AddressInfo).port}`;
    const created = (await (
      await fetch(`${base1}/v1/reports`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ position: { jurisdiction: 'tx' } }),
      })
    ).json()) as any;
    await new Promise<void>((r) => s1.close(() => r()));

    const s2 = createApiServer({ reportStore: new FileReportStore(dir) });
    await new Promise<void>((r) => s2.listen(0, r));
    const base2 = `http://127.0.0.1:${(s2.address() as AddressInfo).port}`;
    try {
      const res = await fetch(`${base2}/v1/reports/${created.id}`);
      expect(res.status).toBe(200);
      const json = (await res.json()) as any;
      expect(json.report.jurisdiction).toBe('tx');
    } finally {
      await new Promise<void>((r) => s2.close(() => r()));
    }
  });
});
