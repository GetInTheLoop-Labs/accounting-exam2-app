// Fact store abstraction for the API layer.
//
// The engine consumes plain Fact[] — where they come from is swappable:
// production uses the KB + live validation pipeline (PRD §8.3); this
// golden-backed store serves development and demos, presenting verified
// golden entries as manually-verified facts dated to the research pass
// (so freshness flags render honestly).

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Fact } from '../kb/types.js';
import type { GoldenFile } from '../seeding/audit.js';

export interface FactStore {
  /** Facts for a jurisdiction plus applicable national facts. */
  factsFor(jurisdiction: string): Promise<Fact[]>;
}

export class GoldenFactStore implements FactStore {
  constructor(private readonly goldenDir = 'data/golden') {}

  async factsFor(jurisdiction: string): Promise<Fact[]> {
    let golden: GoldenFile;
    try {
      golden = JSON.parse(
        await readFile(path.join(this.goldenDir, `${jurisdiction.toLowerCase()}.json`), 'utf8'),
      ) as GoldenFile;
    } catch {
      return []; // no golden coverage → report renders structure with unknowns
    }
    return golden.entries
      .filter((e) => e.status === 'verified')
      .map(
        (e) =>
          ({
            requirementId: e.requirementId,
            factClass: e.factClass as Fact['factClass'],
            value: e.expected,
            ...(e.unit === 'usd' ? { unit: 'usd' as const } : {}),
            sourceUrl: e.sourceUrl,
            verifiedAt: `${golden.verifiedAt}T00:00:00Z`,
            verificationMethod: 'manual' as const,
            confidence: 1,
          }) satisfies Fact,
      );
  }
}
