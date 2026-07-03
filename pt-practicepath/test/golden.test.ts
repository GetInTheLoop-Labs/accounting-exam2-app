import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import type { GoldenFile } from '../src/seeding/audit.js';
import { jurisdictionRequirementIds } from '../src/seeding/requirements.js';

const GOLDEN_DIR = path.join(__dirname, '../data/golden');
const FACT_CLASSES = new Set(['fee', 'wait_time', 'rule', 'url', 'date']);

const goldenFiles = readdirSync(GOLDEN_DIR)
  .filter((f) => f.endsWith('.json'))
  .map((f) => ({
    name: f,
    golden: JSON.parse(readFileSync(path.join(GOLDEN_DIR, f), 'utf8')) as GoldenFile,
  }));

describe('golden set integrity', () => {
  it('has at least the researched jurisdictions', () => {
    const jurs = goldenFiles.map((g) => g.golden.jurisdiction);
    for (const required of ['tx', 'ca', 'fl', 'ny']) expect(jurs).toContain(required);
  });

  it.each(goldenFiles.map((g) => [g.name, g.golden] as const))(
    '%s is well-formed',
    (name, golden) => {
      expect(name).toBe(`${golden.jurisdiction}.json`);
      expect(golden.entries.length).toBeGreaterThan(0);
      const validIds = new Set(jurisdictionRequirementIds(golden.jurisdiction));
      for (const entry of golden.entries) {
        expect(validIds, `${name}: unknown requirementId ${entry.requirementId}`).toContain(
          entry.requirementId,
        );
        expect(FACT_CLASSES, `${name}: bad factClass`).toContain(entry.factClass);
        expect(['verified', 'unverified'], `${name}: bad status`).toContain(entry.status);
        expect(entry.expected.length, `${name}: empty expected value`).toBeGreaterThan(0);
        expect(new URL(entry.sourceUrl).protocol, `${name}: ${entry.sourceUrl}`).toBe('https:');
        if (entry.factClass === 'fee') {
          expect(entry.expected, `${name}: fee not numeric: ${entry.expected}`).toMatch(
            /^\d+(\.\d+)?$/,
          );
          expect(entry.unit, `${name}: fee missing usd unit`).toBe('usd');
        }
      }
    },
  );

  it('every golden file carries at least one verified entry (audit needs a denominator)', () => {
    for (const { name, golden } of goldenFiles) {
      const verified = golden.entries.filter((e) => e.status === 'verified');
      expect(verified.length, `${name} has no verified entries`).toBeGreaterThan(0);
    }
  });
});
