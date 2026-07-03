// Demo report CLI: exercises the full engine chain with golden-set facts.
//
//   npm run report -- la --licensed-in tx --home tx
//   npm run report -- ca                       (new-grad profile)
//
// Golden entries stand in for KB Facts here — verified entries present as
// facts verified on the golden file's date, which will typically render as
// STALE against the freshness windows. That is correct behavior, not a bug:
// this CLI demonstrates report structure and honest staleness disclosure;
// live-verified facts come from the validation pipeline in production.

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Fact } from '../kb/types.js';
import type { GoldenFile } from '../seeding/audit.js';
import { assembleReport, renderReportMarkdown } from './report.js';
import type { TherapistProfile } from './paths.js';

function goldenToFacts(golden: GoldenFile): Fact[] {
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

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const target = args[0];
  if (!target) {
    console.error('Usage: report-cli.ts <jurisdiction> [--licensed-in st[,st]] [--home st]');
    process.exitCode = 2;
    return;
  }
  const licensedIdx = args.indexOf('--licensed-in');
  const homeIdx = args.indexOf('--home');
  const profile: TherapistProfile = {
    licensedIn: licensedIdx >= 0 ? args[licensedIdx + 1]!.split(',') : [],
    ...(homeIdx >= 0 ? { homeState: args[homeIdx + 1]! } : {}),
    nptePassed: licensedIdx >= 0,
    disciplineWithin2Years: false,
  };

  let facts: Fact[] = [];
  try {
    const golden = JSON.parse(
      await readFile(path.join('data/golden', `${target}.json`), 'utf8'),
    ) as GoldenFile;
    facts = goldenToFacts(golden);
    console.error(`(using ${facts.length} verified golden entries as facts — dated ${golden.verifiedAt}, so staleness flags are expected)`);
  } catch {
    console.error(`(no golden file for ${target} — report renders structure only)`);
  }

  const report = assembleReport(target, profile, facts);
  const md = renderReportMarkdown(report);
  const outPath = path.join('data', `report-${target}.md`);
  await writeFile(outPath, md);
  console.log(md);
  console.error(`Wrote ${outPath}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
