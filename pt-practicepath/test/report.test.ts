import { describe, expect, it } from 'vitest';
import { assembleReport, parseDurationRange, renderReportMarkdown } from '../src/engine/report.js';
import type { TherapistProfile } from '../src/engine/paths.js';
import type { Fact } from '../src/kb/types.js';

const NOW = new Date('2026-07-03T12:00:00Z');

const TX_LICENSED: TherapistProfile = {
  licensedIn: ['tx'],
  homeState: 'tx',
  nptePassed: true,
  disciplineWithin2Years: false,
};

function fact(overrides: Partial<Fact> & Pick<Fact, 'requirementId' | 'factClass' | 'value'>): Fact {
  return {
    ...(overrides.factClass === 'fee' ? { unit: 'usd' } : {}),
    sourceUrl: 'https://example.gov/x',
    verifiedAt: '2026-07-03T09:00:00Z', // fresh for every class at NOW
    verificationMethod: 'live_fetch',
    confidence: 0.95,
    ...overrides,
  } as Fact;
}

// Facts for a compact privilege into Louisiana, mirroring golden la.json.
const LA_FACTS: Fact[] = [
  fact({ requirementId: 'compact-privilege-commission', factClass: 'fee', value: '45' }),
  fact({ requirementId: 'la-compact-privilege', factClass: 'fee', value: '50' }),
  fact({ requirementId: 'la-jurisprudence', factClass: 'fee', value: '0' }),
  fact({
    requirementId: 'la-jurisprudence',
    factClass: 'rule',
    value: '40 questions, 75% to pass',
  }),
];

describe('duration parsing', () => {
  it('parses ranges, single bounds, weeks, and business days', () => {
    expect(parseDurationRange('1-4 days once complete')).toEqual({ minDays: 1, maxDays: 4 });
    expect(parseDurationRange('approximately 3-4 weeks')).toEqual({ minDays: 21, maxDays: 28 });
    expect(parseDurationRange('allow 5-7 business days')).toEqual({ minDays: 7, maxDays: 10 });
    expect(parseDurationRange('within 45 days')).toEqual({ minDays: 0, maxDays: 45 });
  });

  it('returns null rather than guessing', () => {
    expect(parseDurationRange('varies by board meeting schedule')).toBeNull();
    expect(parseDurationRange('')).toBeNull();
  });
});

describe('report assembly', () => {
  it('recommends compact for an eligible profile and totals its cost', () => {
    const report = assembleReport('la', TX_LICENSED, LA_FACTS, NOW);
    expect(report.recommended.path.kind).toBe('compact');
    expect(report.recommended.cost.knownUsd).toBe(95); // 45 + 50 + 0
    expect(report.recommended.cost.staleUsd).toBe(0);
    expect(report.recommended.cost.requirementsWithUnknownCost).toEqual([]);
    expect(report.alternatives.map((a) => a.path.kind)).toEqual(['endorsement', 'initial']);
  });

  it('marks stale facts as last-known-good and taints the report', () => {
    const staleFacts = LA_FACTS.map((f) =>
      f.factClass === 'fee' ? { ...f, verifiedAt: '2026-05-01T00:00:00Z' } : f, // > 7-day fee window
    );
    const report = assembleReport('la', TX_LICENSED, staleFacts, NOW);
    const commission = report.recommended.requirements.find(
      (r) => r.requirementId === 'compact-privilege-commission',
    )!;
    expect(commission.facts[0]?.presentation).toBe('stale_last_known_good');
    expect(report.recommended.cost.staleUsd).toBe(95);
    expect(report.containsUnverifiedData).toBe(true);
  });

  it('counts requirements with no fee fact instead of hiding them', () => {
    const report = assembleReport('la', TX_LICENSED, [], NOW);
    expect(report.recommended.cost.knownUsd).toBe(0);
    expect(report.recommended.cost.requirementsWithUnknownCost.length).toBeGreaterThan(0);
  });

  it('feeds parsed wait_time facts into the plan; unparseable ones stay estimates', () => {
    const facts = [
      ...LA_FACTS,
      fact({
        requirementId: 'la-compact-privilege',
        factClass: 'wait_time',
        value: '1-2 days',
      }),
    ];
    const report = assembleReport('la', TX_LICENSED, facts, NOW);
    const step = report.recommended.plan.steps.find((s) => s.id === 'la-compact-privilege')!;
    expect(step.estimated).toBe(false);
    expect(step.maxDays).toBe(2);
    expect(report.recommended.plan.containsEstimates).toBe(true); // others still fallback
  });

  it('surfaces blocked paths with reasons', () => {
    const report = assembleReport('ca', TX_LICENSED, [], NOW);
    expect(report.recommended.path.kind).toBe('endorsement');
    expect(report.blocked.map((b) => b.kind)).toContain('compact');
  });

  it('renders markdown with citations, freshness flags, and the disclaimer', () => {
    const md = renderReportMarkdown(assembleReport('la', TX_LICENSED, LA_FACTS, NOW));
    expect(md).toContain('Recommended path: compact');
    expect(md).toContain('✅ verified 2026-07-03');
    expect(md).toContain('[source](https://example.gov/x)');
    expect(md).toContain('not legal advice');
    expect(md).toContain('critical path');
  });

  it('stale rendering shows last-confirmed date, never presents as current', () => {
    const staleFacts = LA_FACTS.map((f) => ({ ...f, verifiedAt: '2026-01-01T00:00:00Z' }));
    const md = renderReportMarkdown(assembleReport('la', TX_LICENSED, staleFacts, NOW));
    expect(md).toContain('⚠️ could not re-verify — last confirmed 2026-01-01');
    expect(md).toContain('contains estimates or stale facts');
  });
});
