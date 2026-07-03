import { describe, expect, it } from 'vitest';
import { ALL_ISSUERS, JURISDICTIONS, SOURCES } from '../src/sources/registry.js';
import { FRESHNESS_WINDOW_MS, freshnessOf } from '../src/kb/freshness.js';

describe('source registry integrity', () => {
  it('covers all 53 jurisdictions (50 states + DC + PR + USVI)', () => {
    expect(JURISDICTIONS).toHaveLength(53);
    const ids = new Set(JURISDICTIONS.map((j) => j.id));
    expect(ids.size).toBe(53);
    for (const required of ['ca', 'tx', 'fl', 'ny', 'dc', 'pr', 'vi']) {
      expect(ids).toContain(required);
    }
  });

  it('has unique source and issuer ids', () => {
    expect(new Set(SOURCES.map((s) => s.id)).size).toBe(SOURCES.length);
    expect(new Set(ALL_ISSUERS.map((i) => i.id)).size).toBe(ALL_ISSUERS.length);
  });

  it('every source references a known issuer', () => {
    const issuerIds = new Set(ALL_ISSUERS.map((i) => i.id));
    for (const s of SOURCES) expect(issuerIds).toContain(s.issuerId);
  });

  it('every jurisdiction has fee, application, and processing-time sources enumerated', () => {
    for (const j of JURISDICTIONS) {
      const forBoard = SOURCES.filter((s) => s.issuerId === j.boardIssuerId);
      const classes = new Set(forBoard.flatMap((s) => s.factClasses));
      expect(classes, `${j.id} missing fee source`).toContain('fee');
      expect(classes, `${j.id} missing wait_time source`).toContain('wait_time');
    }
  });

  it('located source URLs are valid https URLs', () => {
    for (const s of SOURCES) {
      if (s.url === undefined) continue;
      const parsed = new URL(s.url);
      expect(parsed.protocol, s.id).toBe('https:');
    }
  });

  it('matches the researched compact roster: 36 active + 3 enacted-not-active', () => {
    const active = JURISDICTIONS.filter((j) => j.compactActiveDate !== undefined);
    const enactedOnly = JURISDICTIONS.filter(
      (j) => j.compactMember && j.compactActiveDate === undefined,
    );
    expect(active).toHaveLength(36);
    expect(enactedOnly.map((j) => j.id).sort()).toEqual(['ct', 'me', 'ri']);
    for (const nonMember of ['ca', 'fl', 'ny', 'hi', 'wy', 'pr', 'vi']) {
      expect(JURISDICTIONS.find((j) => j.id === nonMember)?.compactMember).toBe(false);
    }
  });
});

describe('freshness windows (FR-23)', () => {
  it('wait times are the tightest class', () => {
    const min = Math.min(...Object.values(FRESHNESS_WINDOW_MS));
    expect(FRESHNESS_WINDOW_MS.wait_time).toBe(min);
  });

  it('classifies fresh vs stale around the window boundary', () => {
    const now = new Date('2026-07-03T12:00:00Z');
    expect(freshnessOf('fee', new Date('2026-06-30T12:00:00Z'), now)).toBe('fresh');
    expect(freshnessOf('fee', new Date('2026-06-25T11:00:00Z'), now)).toBe('stale');
    expect(freshnessOf('wait_time', new Date('2026-07-03T00:00:00Z'), now)).toBe('fresh');
    expect(freshnessOf('wait_time', new Date('2026-07-01T12:00:00Z'), now)).toBe('stale');
  });
});
