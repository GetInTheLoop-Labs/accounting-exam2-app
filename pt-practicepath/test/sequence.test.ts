import { describe, expect, it } from 'vitest';
import { evaluatePaths, type TherapistProfile } from '../src/engine/paths.js';
import {
  CycleError,
  FALLBACK_DURATION,
  planForPath,
  schedule,
  stepsForPath,
  type Step,
} from '../src/engine/sequence.js';

const TX_LICENSED: TherapistProfile = {
  licensedIn: ['tx'],
  homeState: 'tx',
  nptePassed: true,
  disciplineWithin2Years: false,
};

function step(id: string, dependsOn: string[], min: number, max: number): Step {
  return { id, dependsOn, minDays: min, maxDays: max, estimated: false };
}

describe('scheduler', () => {
  it('computes earliest start/finish and totals over parallel branches', () => {
    const plan = schedule([
      step('a', [], 2, 4),
      step('b', ['a'], 1, 2),
      step('c', ['a'], 5, 10),
      step('d', ['b', 'c'], 1, 1),
    ]);
    expect(plan.totalMinDays).toBe(8); // a(2) → c(5) → d(1)
    expect(plan.totalMaxDays).toBe(15); // a(4) → c(10) → d(1)
    expect(plan.criticalPath).toEqual(['a', 'c', 'd']);
    const b = plan.steps.find((s) => s.id === 'b')!;
    expect(b.earliestStartMin).toBe(2);
    expect(b.onCriticalPath).toBe(false);
  });

  it('parallel steps are cheaper than their sum', () => {
    const plan = schedule([step('x', [], 10, 10), step('y', [], 10, 10)]);
    expect(plan.totalMaxDays).toBe(10);
  });

  it('detects cycles', () => {
    expect(() =>
      schedule([step('a', ['b'], 1, 1), step('b', ['a'], 1, 1)]),
    ).toThrow(CycleError);
  });

  it('rejects unknown dependencies', () => {
    expect(() => schedule([step('a', ['ghost'], 1, 1)])).toThrow(/unknown step/);
  });
});

describe('path → plan assembly (FR-15)', () => {
  it('endorsement plan gates jurisprudence and score transfer on the application', () => {
    const endorsement = evaluatePaths('ca', TX_LICENSED).find((p) => p.kind === 'endorsement')!;
    const steps = stepsForPath(endorsement);
    const jurisprudence = steps.find((s) => s.id === 'ca-jurisprudence')!;
    const transfer = steps.find((s) => s.id === 'npte-score-transfer')!;
    expect(jurisprudence.dependsOn).toContain('ca-application-endorsement');
    expect(transfer.dependsOn).toContain('ca-application-endorsement');
  });

  it('compact plan: privilege purchase follows the commission step', () => {
    const compact = evaluatePaths('wa', TX_LICENSED).find((p) => p.kind === 'compact')!;
    const steps = stepsForPath(compact);
    expect(steps.find((s) => s.id === 'wa-compact-privilege')!.dependsOn).toContain(
      'compact-privilege-commission',
    );
  });

  it('refuses to plan a blocked path', () => {
    const blocked = evaluatePaths('ca', TX_LICENSED).find((p) => p.kind === 'compact')!;
    expect(() => stepsForPath(blocked)).toThrow(/non-viable/);
  });

  it('uses verified durations when given, fallback (flagged) otherwise', () => {
    const compact = evaluatePaths('wa', TX_LICENSED).find((p) => p.kind === 'compact')!;
    const plan = planForPath(compact, {
      'compact-privilege-commission': { minDays: 0, maxDays: 1 },
      'wa-compact-privilege': { minDays: 0, maxDays: 1 },
    });
    expect(plan.containsEstimates).toBe(true); // wa-jurisprudence still fallback
    const jurisprudence = plan.steps.find((s) => s.id === 'wa-jurisprudence')!;
    expect(jurisprudence.estimated).toBe(true);
    expect(jurisprudence.maxDays).toBe(FALLBACK_DURATION.maxDays);
    const commission = plan.steps.find((s) => s.id === 'compact-privilege-commission')!;
    expect(commission.estimated).toBe(false);
  });

  it('fully-specified compact plan is near-instant, matching the researched reality', () => {
    const compact = evaluatePaths('nv', TX_LICENSED).find((p) => p.kind === 'compact')!;
    const plan = planForPath(compact, {
      'compact-privilege-commission': { minDays: 0, maxDays: 1 },
      'nv-compact-privilege': { minDays: 0, maxDays: 1 },
      'nv-jurisprudence': { minDays: 0, maxDays: 2 }, // NVJAM before privilege
    });
    expect(plan.containsEstimates).toBe(false);
    expect(plan.totalMaxDays).toBeLessThanOrEqual(4);
  });
});
