// Golden-set audit (Phase 0 exit criterion: ≥ 99% fact-level accuracy).
//
// Joins seeded facts against golden entries on (requirementId, factClass)
// and compares values: numerically for fees, normalized-containment for text
// classes. Golden entries still marked "unverified" are excluded from the
// accuracy denominator — they must be re-confirmed against a live primary
// source before they count as ground truth (see data/golden/README.md).

import type { SeedFile } from './types.js';

export interface GoldenEntry {
  requirementId: string;
  factClass: string;
  expected: string;
  unit?: string;
  sourceUrl: string;
  status: 'verified' | 'unverified';
  note?: string;
}

export interface GoldenFile {
  jurisdiction: string;
  verifiedAt: string;
  entries: GoldenEntry[];
}

export type Verdict = 'match' | 'mismatch' | 'missing' | 'excluded_unverified';

export interface AuditRow {
  requirementId: string;
  factClass: string;
  expected: string;
  actual: string | null;
  verdict: Verdict;
}

export interface AuditReport {
  jurisdiction: string;
  rows: AuditRow[];
  matches: number;
  mismatches: number;
  missing: number;
  excluded: number;
  /** matches / (matches + mismatches + missing) over verified golden entries. */
  accuracy: number;
}

function normalizeText(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9%]+/g, ' ').trim();
}

function normalizeNumber(s: string): number | null {
  const m = s.replace(/[$,]/g, '').match(/-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : null;
}

export function valuesMatch(factClass: string, expected: string, actual: string): boolean {
  if (factClass === 'fee') {
    const e = normalizeNumber(expected);
    const a = normalizeNumber(actual);
    return e !== null && a !== null && e === a;
  }
  const e = normalizeText(expected);
  const a = normalizeText(actual);
  return e === a || e.includes(a) || a.includes(e);
}

export function auditSeed(seed: SeedFile, golden: GoldenFile): AuditReport {
  const rows: AuditRow[] = golden.entries.map((entry) => {
    if (entry.status === 'unverified') {
      return {
        requirementId: entry.requirementId,
        factClass: entry.factClass,
        expected: entry.expected,
        actual: null,
        verdict: 'excluded_unverified' as const,
      };
    }
    // Only approved facts count — the audit measures what would enter the KB.
    const candidates = seed.facts.filter(
      (f) =>
        f.status === 'approved' &&
        f.requirementId === entry.requirementId &&
        f.factClass === entry.factClass,
    );
    if (candidates.length === 0) {
      return {
        requirementId: entry.requirementId,
        factClass: entry.factClass,
        expected: entry.expected,
        actual: null,
        verdict: 'missing' as const,
      };
    }
    const hit = candidates.find((f) => valuesMatch(entry.factClass, entry.expected, f.value));
    return {
      requirementId: entry.requirementId,
      factClass: entry.factClass,
      expected: entry.expected,
      actual: (hit ?? candidates[0])!.value,
      verdict: hit ? ('match' as const) : ('mismatch' as const),
    };
  });

  const matches = rows.filter((r) => r.verdict === 'match').length;
  const mismatches = rows.filter((r) => r.verdict === 'mismatch').length;
  const missing = rows.filter((r) => r.verdict === 'missing').length;
  const excluded = rows.filter((r) => r.verdict === 'excluded_unverified').length;
  const denominator = matches + mismatches + missing;

  return {
    jurisdiction: golden.jurisdiction,
    rows,
    matches,
    mismatches,
    missing,
    excluded,
    accuracy: denominator === 0 ? 0 : matches / denominator,
  };
}

export function renderAuditReport(report: AuditReport): string {
  const lines = [
    `# Seeding accuracy audit — ${report.jurisdiction}`,
    '',
    `Accuracy: ${(report.accuracy * 100).toFixed(1)}% (target ≥ 99%) — ${report.matches} match / ${report.mismatches} mismatch / ${report.missing} missing / ${report.excluded} excluded (unverified golden)`,
    '',
    '| Requirement | Class | Expected | Seeded | Verdict |',
    '|-------------|-------|----------|--------|---------|',
    ...report.rows.map(
      (r) => `| ${r.requirementId} | ${r.factClass} | ${r.expected.replace(/\|/g, '\\|')} | ${r.actual?.replace(/\|/g, '\\|') ?? '—'} | ${r.verdict} |`,
    ),
  ];
  return lines.join('\n') + '\n';
}
