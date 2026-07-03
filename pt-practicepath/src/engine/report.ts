// Practice Requirements Report assembler (FR-14/16/22/30).
//
// Composes the path engine, the sequencer, and KB Facts into the report
// structure of PRD §5.3: per-requirement detail with citations and
// freshness states, a sequenced plan with critical path, and honest cost
// totals that count what is unknown instead of hiding it.
//
// Freshness presentation (FR-22): every fact is classified against its
// class's freshness window — 'fresh' facts present as verified; 'stale'
// facts present as could-not-verify with the last-known-good value and its
// date. The assembler never drops a stale fact silently and never presents
// one as current.

import { FRESHNESS_WINDOW_MS, freshnessOf } from '../kb/freshness.js';
import type { Fact } from '../kb/types.js';
import { positionLayer } from '../position/templates.js';
import type { PositionRequirement, PracticeSetting } from '../position/types.js';
import { evaluatePaths, type PathOption, type TherapistProfile } from './paths.js';
import { planForPath, type DurationRange, type Plan } from './sequence.js';

export interface PresentedFact {
  factClass: Fact['factClass'];
  value: string;
  unit?: string;
  sourceUrl: string;
  verifiedAt: string;
  presentation: 'verified' | 'stale_last_known_good';
}

export interface ReportRequirement {
  requirementId: string;
  applicability: 'always' | 'jurisdiction_dependent';
  note?: string;
  facts: PresentedFact[];
}

export interface CostSummary {
  /** Sum of fresh + stale known fee facts, in USD. */
  knownUsd: number;
  /** Portion of knownUsd backed only by stale facts. */
  staleUsd: number;
  /** Requirements on this path with no fee fact at all. */
  requirementsWithUnknownCost: string[];
}

export interface PathReport {
  path: PathOption;
  requirements: ReportRequirement[];
  plan: Plan;
  cost: CostSummary;
}

export interface PositionContext {
  setting?: PracticeSetting;
  statedRequirements?: string[];
  /** Credentials the therapist already holds (FR-17 gap analysis). */
  heldCredentials?: string[];
}

export interface Report {
  jurisdiction: string;
  generatedAt: string;
  recommended: PathReport;
  alternatives: PathReport[];
  blocked: PathOption[];
  /** FR-12 position-specific layer, present when a setting or stated requirements were given. */
  position?: { setting?: PracticeSetting; requirements: PositionRequirement[] };
  /** True when any presented fact is stale or any duration is an estimate. */
  containsUnverifiedData: boolean;
}

/**
 * Parse a wait_time fact value into a day range. Conservative: returns null
 * for anything it cannot read confidently — the sequencer's flagged fallback
 * is better than a wrong parse. Business days are widened by 1.4 to
 * calendar days (5-day week), rounding outward.
 */
export function parseDurationRange(value: string): DurationRange | null {
  const text = value.toLowerCase();
  const range = text.match(/(\d+)\s*(?:-|–|to)\s*(\d+)\s*(business\s+)?(day|week)/);
  const single = text.match(/(?:within|approximately|about|allow)?\s*(\d+)\s*(business\s+)?(day|week)/);
  let min: number;
  let max: number;
  let business: boolean;
  let unit: string;
  if (range) {
    min = Number(range[1]);
    max = Number(range[2]);
    business = range[3] !== undefined;
    unit = range[4]!;
  } else if (single) {
    min = 0;
    max = Number(single[1]);
    business = single[2] !== undefined;
    unit = single[3]!;
  } else {
    return null;
  }
  if (min > max) return null;
  const scale = (unit === 'week' ? 7 : 1) * (business ? 1.4 : 1);
  return { minDays: Math.floor(min * scale), maxDays: Math.ceil(max * scale) };
}

function present(fact: Fact, now: Date): PresentedFact {
  const state = freshnessOf(fact.factClass, new Date(fact.verifiedAt), now);
  return {
    factClass: fact.factClass,
    value: fact.value,
    ...(fact.unit ? { unit: fact.unit } : {}),
    sourceUrl: fact.sourceUrl,
    verifiedAt: fact.verifiedAt,
    presentation: state === 'fresh' ? 'verified' : 'stale_last_known_good',
  };
}

function buildPathReport(path: PathOption, facts: Fact[], now: Date): PathReport {
  const byRequirement = new Map<string, Fact[]>();
  for (const f of facts) {
    byRequirement.set(f.requirementId, [...(byRequirement.get(f.requirementId) ?? []), f]);
  }

  const requirements: ReportRequirement[] = path.requirements.map((r) => ({
    requirementId: r.requirementId,
    applicability: r.applicability,
    ...(r.note !== undefined ? { note: r.note } : {}),
    facts: (byRequirement.get(r.requirementId) ?? []).map((f) => present(f, now)),
  }));

  // Durations for the sequencer from wait_time facts (parseable ones only).
  const durations: Record<string, DurationRange> = {};
  for (const r of requirements) {
    const wait = r.facts.find((f) => f.factClass === 'wait_time');
    if (wait) {
      const parsed = parseDurationRange(wait.value);
      if (parsed) durations[r.requirementId] = parsed;
    }
  }
  const plan = planForPath(path, durations);

  // Cost: fee facts per requirement; first fee fact per requirement counts.
  let knownUsd = 0;
  let staleUsd = 0;
  const unknown: string[] = [];
  for (const r of requirements) {
    const fee = r.facts.find((f) => f.factClass === 'fee');
    if (!fee) {
      unknown.push(r.requirementId);
      continue;
    }
    const amount = Number(fee.value.replace(/[$,]/g, ''));
    if (Number.isNaN(amount)) {
      unknown.push(r.requirementId);
      continue;
    }
    knownUsd += amount;
    if (fee.presentation === 'stale_last_known_good') staleUsd += amount;
  }

  return {
    path,
    requirements,
    plan,
    cost: { knownUsd, staleUsd, requirementsWithUnknownCost: unknown },
  };
}

export function assembleReport(
  targetId: string,
  profile: TherapistProfile,
  facts: Fact[],
  now: Date = new Date(),
  position?: PositionContext,
): Report {
  const paths = evaluatePaths(targetId, profile);
  const viable = paths.filter((p) => p.viable);
  const blocked = paths.filter((p) => !p.viable);
  const reports = viable.map((p) => buildPathReport(p, facts, now));
  const [recommended, ...alternatives] = reports;
  if (!recommended) throw new Error('No viable path — initial licensure should always be viable');

  const containsUnverifiedData = reports.some(
    (r) =>
      r.plan.containsEstimates ||
      r.requirements.some((req) => req.facts.some((f) => f.presentation === 'stale_last_known_good')),
  );

  const positionRequirements =
    position && (position.setting || (position.statedRequirements?.length ?? 0) > 0)
      ? positionLayer(position.setting, position.statedRequirements, position.heldCredentials)
      : undefined;

  return {
    jurisdiction: targetId.toLowerCase(),
    generatedAt: now.toISOString(),
    recommended,
    alternatives,
    blocked,
    ...(positionRequirements
      ? {
          position: {
            ...(position?.setting ? { setting: position.setting } : {}),
            requirements: positionRequirements,
          },
        }
      : {}),
    containsUnverifiedData,
  };
}

const DISCLAIMER =
  'This report is informational and not legal advice. Requirements are set by state licensing boards; confirm with the board before acting. Every fact links to its official source.';

export function renderReportMarkdown(report: Report): string {
  const lines: string[] = [
    `# Practice Requirements Report — ${report.jurisdiction.toUpperCase()}`,
    '',
    `Generated ${report.generatedAt}${report.containsUnverifiedData ? ' — ⚠️ contains estimates or stale facts (marked below)' : ''}`,
    '',
  ];

  const renderPath = (pr: PathReport, heading: string): void => {
    lines.push(
      `## ${heading}: ${pr.path.kind}`,
      '',
      `Known cost: $${pr.cost.knownUsd.toFixed(2)}` +
        (pr.cost.staleUsd > 0 ? ` (of which $${pr.cost.staleUsd.toFixed(2)} from stale facts ⚠️)` : '') +
        (pr.cost.requirementsWithUnknownCost.length > 0
          ? ` + ${pr.cost.requirementsWithUnknownCost.length} requirement(s) with unknown cost`
          : ''),
      `Projected timeline: ${pr.plan.totalMinDays}–${pr.plan.totalMaxDays} days${pr.plan.containsEstimates ? ' (contains estimates ⚠️)' : ''}; critical path: ${pr.plan.criticalPath.join(' → ')}`,
      '',
    );
    for (const req of pr.requirements) {
      const critical = pr.plan.criticalPath.includes(req.requirementId) ? ' ★' : '';
      lines.push(`### ${req.requirementId}${critical}`);
      if (req.note) lines.push(`_${req.note}_`);
      if (req.facts.length === 0) {
        lines.push('- No verified facts yet — resolved from the KB at report time');
      }
      for (const f of req.facts) {
        const flag =
          f.presentation === 'verified'
            ? `✅ verified ${f.verifiedAt.slice(0, 10)}`
            : `⚠️ could not re-verify — last confirmed ${f.verifiedAt.slice(0, 10)}`;
        lines.push(`- **${f.factClass}**: ${f.value}${f.unit ? ` ${f.unit}` : ''} (${flag}, [source](${f.sourceUrl}))`);
      }
      lines.push('');
    }
  };

  renderPath(report.recommended, 'Recommended path');
  for (const alt of report.alternatives) renderPath(alt, 'Alternative');
  if (report.blocked.length > 0) {
    lines.push('## Not available');
    for (const b of report.blocked) lines.push(`- **${b.kind}**: ${b.blockedBecause}`);
    lines.push('');
  }
  lines.push('---', DISCLAIMER, '');
  return lines.join('\n');
}

export { FRESHNESS_WINDOW_MS };
