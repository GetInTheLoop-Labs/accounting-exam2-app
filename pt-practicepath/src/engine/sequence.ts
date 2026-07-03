// Action-plan sequencer (FR-15): dependency-ordered steps with a projected
// schedule and critical path.
//
// The scheduler itself is a generic longest-path computation over a DAG.
// Domain knowledge enters in exactly two places, both replaceable by KB data
// at report time: DEFAULT_DEPENDENCIES (which steps gate which) and the
// caller-supplied duration table (from wait_time Facts). Durations default to
// wide, explicitly-estimated ranges rather than fabricated precision.

import type { PathOption } from './paths.js';

export interface Step {
  id: string;
  dependsOn: string[];
  /** Working-day range this step takes once its dependencies finish. */
  minDays: number;
  maxDays: number;
  /** True when the duration came from the fallback, not a verified Fact. */
  estimated: boolean;
}

export interface ScheduledStep extends Step {
  /** Earliest start/finish in days from plan start, under min durations. */
  earliestStartMin: number;
  earliestFinishMin: number;
  /** Same under max durations — the honest "could take until" bound. */
  earliestStartMax: number;
  earliestFinishMax: number;
  onCriticalPath: boolean;
}

export interface Plan {
  steps: ScheduledStep[];
  /** Step ids on the longest (max-duration) chain, in order. */
  criticalPath: string[];
  totalMinDays: number;
  totalMaxDays: number;
  /** True if any step duration was a fallback estimate. */
  containsEstimates: boolean;
}

export class CycleError extends Error {
  constructor(ids: string[]) {
    super(`Dependency cycle involving: ${ids.join(', ')}`);
    this.name = 'CycleError';
  }
}

export interface DurationRange {
  minDays: number;
  maxDays: number;
}

/** Wide fallback until a verified wait_time/standard-timeline Fact exists. */
export const FALLBACK_DURATION: DurationRange = { minDays: 1, maxDays: 42 };

/**
 * Structural gating relationships among canonical requirement ids
 * (suffix-matched per jurisdiction). Conservative: only edges that hold
 * broadly are encoded; jurisdiction-specific quirks override via KB data.
 */
export const DEFAULT_DEPENDENCIES: Array<{ step: string; after: string }> = [
  // NPTE registration needs jurisdiction approval of the application.
  { step: 'npte-registration', after: '-application-initial' },
  // Jurisprudence exams commonly unlock after the application is on file
  // (e.g. CAL-JAM's Authorization to Test).
  { step: '-jurisprudence', after: '-application-initial' },
  { step: '-jurisprudence', after: '-application-endorsement' },
  // Score transfer accompanies the endorsement application.
  { step: 'npte-score-transfer', after: '-application-endorsement' },
  // A compact privilege purchase happens through the commission.
  { step: '-compact-privilege', after: 'compact-privilege-commission' },
  // Issuance gates on everything; handled structurally below.
];

function matches(id: string, pattern: string): boolean {
  return pattern.startsWith('-') ? id.endsWith(pattern) : id === pattern;
}

/** Build Steps for a viable PathOption, wiring default dependencies. */
export function stepsForPath(
  path: PathOption,
  durations: Record<string, DurationRange> = {},
): Step[] {
  if (!path.viable) throw new Error(`Cannot plan a non-viable path (${path.kind}): ${path.blockedBecause}`);
  const ids = path.requirements.map((r) => r.requirementId);

  const steps: Step[] = ids.map((id) => {
    const duration = durations[id];
    const dependsOn = DEFAULT_DEPENDENCIES.filter(
      (d) => matches(id, d.step) && ids.some((other) => other !== id && matches(other, d.after)),
    ).flatMap((d) => ids.filter((other) => other !== id && matches(other, d.after)));
    return {
      id,
      dependsOn: [...new Set(dependsOn)],
      minDays: (duration ?? FALLBACK_DURATION).minDays,
      maxDays: (duration ?? FALLBACK_DURATION).maxDays,
      estimated: duration === undefined,
    };
  });

  // License issuance, when present, gates on every other step.
  const issuance = steps.find((s) => s.id.endsWith('-license-issuance'));
  if (issuance) {
    issuance.dependsOn = steps.filter((s) => s !== issuance).map((s) => s.id);
  }
  return steps;
}

/** Topologically order steps and compute earliest start/finish + critical path. */
export function schedule(steps: Step[]): Plan {
  const byId = new Map(steps.map((s) => [s.id, s]));
  for (const s of steps) {
    for (const dep of s.dependsOn) {
      if (!byId.has(dep)) throw new Error(`Step ${s.id} depends on unknown step ${dep}`);
    }
  }

  // Kahn topological sort with cycle detection.
  const indegree = new Map(steps.map((s) => [s.id, s.dependsOn.length]));
  const dependents = new Map<string, string[]>();
  for (const s of steps) {
    for (const dep of s.dependsOn) {
      dependents.set(dep, [...(dependents.get(dep) ?? []), s.id]);
    }
  }
  const queue = steps.filter((s) => s.dependsOn.length === 0).map((s) => s.id);
  const order: string[] = [];
  while (queue.length > 0) {
    const id = queue.shift()!;
    order.push(id);
    for (const next of dependents.get(id) ?? []) {
      const left = indegree.get(next)! - 1;
      indegree.set(next, left);
      if (left === 0) queue.push(next);
    }
  }
  if (order.length !== steps.length) {
    throw new CycleError(steps.map((s) => s.id).filter((id) => !order.includes(id)));
  }

  const scheduled = new Map<string, ScheduledStep>();
  const criticalPred = new Map<string, string | null>();
  for (const id of order) {
    const s = byId.get(id)!;
    let startMin = 0;
    let startMax = 0;
    let pred: string | null = null;
    for (const dep of s.dependsOn) {
      const d = scheduled.get(dep)!;
      startMin = Math.max(startMin, d.earliestFinishMin);
      if (d.earliestFinishMax > startMax) {
        startMax = d.earliestFinishMax;
        pred = dep;
      }
    }
    criticalPred.set(id, pred);
    scheduled.set(id, {
      ...s,
      earliestStartMin: startMin,
      earliestFinishMin: startMin + s.minDays,
      earliestStartMax: startMax,
      earliestFinishMax: startMax + s.maxDays,
      onCriticalPath: false,
    });
  }

  const all = order.map((id) => scheduled.get(id)!);
  const totalMinDays = Math.max(0, ...all.map((s) => s.earliestFinishMin));
  const totalMaxDays = Math.max(0, ...all.map((s) => s.earliestFinishMax));

  // Walk back from the max-finish step to mark the critical path.
  const criticalPath: string[] = [];
  let cursor: string | null =
    all.reduce<ScheduledStep | null>(
      (best, s) => (best === null || s.earliestFinishMax > best.earliestFinishMax ? s : best),
      null,
    )?.id ?? null;
  while (cursor !== null) {
    criticalPath.unshift(cursor);
    scheduled.get(cursor)!.onCriticalPath = true;
    cursor = criticalPred.get(cursor) ?? null;
  }

  return {
    steps: all,
    criticalPath,
    totalMinDays,
    totalMaxDays,
    containsEstimates: all.some((s) => s.estimated),
  };
}

/** Convenience: PathOption → scheduled plan. */
export function planForPath(
  path: PathOption,
  durations: Record<string, DurationRange> = {},
): Plan {
  return schedule(stepsForPath(path, durations));
}
