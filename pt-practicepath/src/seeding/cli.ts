// Seeding pipeline CLI.
//
//   npm run seed -- <jur>                          fetch + extract → data/seeds/<jur>.json
//   npm run seed-review -- <jur> report            → data/seeds/<jur>-review.md
//   npm run seed-review -- <jur> approve 0 2 5     approve facts by index
//   npm run seed-review -- <jur> reject 3 --note "wrong fee row"
//   npm run seed-audit -- <jur>                    diff approved facts vs data/golden/<jur>.json
//
// Seeding needs Anthropic credentials (ANTHROPIC_API_KEY or an `ant auth
// login` profile) and network egress that primary sources accept — the same
// production-realistic infrastructure caveat as the census (PRD §9.3.1).

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { JURISDICTIONS, SOURCES } from '../sources/registry.js';
import { fetchPage, FetchBlockedError } from './fetcher.js';
import { extractFacts, toProposedFacts, EXTRACTION_MODEL } from './extractor.js';
import { jurisdictionRequirementIds } from './requirements.js';
import { applyDecisions, renderReviewReport, type Decision } from './review.js';
import { auditSeed, renderAuditReport, type GoldenFile } from './audit.js';
import type { SeedFile } from './types.js';

const SEEDS_DIR = 'data/seeds';
const PER_DOMAIN_DELAY_MS = 3000;

function seedPath(jur: string): string {
  return path.join(SEEDS_DIR, `${jur}.json`);
}

async function loadSeed(jur: string): Promise<SeedFile> {
  return JSON.parse(await readFile(seedPath(jur), 'utf8')) as SeedFile;
}

async function saveSeed(seed: SeedFile): Promise<void> {
  await mkdir(SEEDS_DIR, { recursive: true });
  await writeFile(seedPath(seed.jurisdiction), JSON.stringify(seed, null, 2) + '\n');
}

async function cmdSeed(jur: string): Promise<void> {
  const jurisdiction = JURISDICTIONS.find((j) => j.id === jur);
  if (!jurisdiction) throw new Error(`Unknown jurisdiction: ${jur}`);

  const sources = SOURCES.filter(
    (s): s is typeof s & { url: string } =>
      s.issuerId === jurisdiction.boardIssuerId && typeof s.url === 'string',
  );
  if (sources.length === 0) throw new Error(`No located sources for ${jur} — run the census/enumeration first`);

  const requirementIds = jurisdictionRequirementIds(jur);
  const seed: SeedFile = {
    jurisdiction: jur,
    model: EXTRACTION_MODEL,
    seededAt: new Date().toISOString(),
    facts: [],
  };
  const skipped: string[] = [];

  for (const source of sources) {
    console.log(`Fetching ${source.id} (${source.url})…`);
    let page;
    try {
      page = await fetchPage(source.url);
    } catch (err) {
      if (err instanceof FetchBlockedError) {
        console.warn(`  blocked (${err.status ?? 'network'}) — skipping; rung B–E channel needed`);
        skipped.push(source.id);
        continue;
      }
      throw err;
    }
    console.log(`  extracting (${page.text.length} chars)…`);
    const result = await extractFacts(source, page, requirementIds);
    const facts = toProposedFacts(result, source, page);
    seed.facts.push(...facts);
    console.log(`  +${facts.length} facts, ${result.missing.length} noted missing`);
    await new Promise((r) => setTimeout(r, PER_DOMAIN_DELAY_MS));
  }

  await saveSeed(seed);
  console.log(
    `\nWrote ${seedPath(jur)}: ${seed.facts.length} facts pending review` +
      (skipped.length ? `; ${skipped.length} sources blocked: ${skipped.join(', ')}` : ''),
  );
  console.log(`Next: npm run seed-review -- ${jur} report`);
}

async function cmdReview(jur: string, args: string[]): Promise<void> {
  const seed = await loadSeed(jur);
  const [action = 'report', ...rest] = args;

  if (action === 'report') {
    const reportPath = path.join(SEEDS_DIR, `${jur}-review.md`);
    await writeFile(reportPath, renderReviewReport(seed));
    console.log(`Wrote ${reportPath}`);
    return;
  }
  if (action === 'approve' || action === 'reject') {
    const noteIdx = rest.indexOf('--note');
    const note = noteIdx >= 0 ? rest[noteIdx + 1] : undefined;
    const indexes = (noteIdx >= 0 ? rest.slice(0, noteIdx) : rest).map(Number);
    if (indexes.length === 0 || indexes.some(Number.isNaN)) {
      throw new Error(`Usage: seed-review -- ${jur} ${action} <index...> [--note "..."]`);
    }
    const decisions: Decision[] = indexes.map((index) => ({
      index,
      action,
      ...(note !== undefined ? { note } : {}),
    }));
    await saveSeed(applyDecisions(seed, decisions));
    console.log(`${action}d ${indexes.length} fact(s) in ${seedPath(jur)}`);
    return;
  }
  throw new Error(`Unknown review action: ${action}`);
}

async function cmdAudit(jur: string): Promise<void> {
  const seed = await loadSeed(jur);
  const golden = JSON.parse(
    await readFile(path.join('data/golden', `${jur}.json`), 'utf8'),
  ) as GoldenFile;
  const report = auditSeed(seed, golden);
  const out = renderAuditReport(report);
  const reportPath = path.join(SEEDS_DIR, `${jur}-audit.md`);
  await writeFile(reportPath, out);
  console.log(out);
  console.log(`Wrote ${reportPath}`);
  if (report.accuracy < 0.99 && report.matches + report.mismatches + report.missing > 0) {
    process.exitCode = 1;
  }
}

async function main(): Promise<void> {
  const [mode, jur, ...rest] = process.argv.slice(2);
  if (!mode || !jur) {
    console.error('Usage: cli.ts <seed|review|audit> <jurisdiction> [args...]');
    process.exitCode = 2;
    return;
  }
  if (mode === 'seed') await cmdSeed(jur);
  else if (mode === 'review') await cmdReview(jur, rest);
  else if (mode === 'audit') await cmdAudit(jur);
  else {
    console.error(`Unknown mode: ${mode}`);
    process.exitCode = 2;
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
