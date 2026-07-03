// Per-fact-class freshness windows (PRD FR-23, §9.2).
// A fact whose verified_at is within its window may be served from the KB;
// outside it, live re-verification is mandatory before serving.

import type { FactClass } from './types.js';

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

/** Milliseconds a verification stays servable, by fact class. */
export const FRESHNESS_WINDOW_MS: Record<FactClass, number> = {
  // Current processing/wait times are the most volatile class: live-only,
  // served from cache for at most a day when the source cannot be reached.
  wait_time: 1 * DAY_MS,
  fee: 7 * DAY_MS,
  url: 7 * DAY_MS,
  date: 30 * DAY_MS,
  rule: 30 * DAY_MS,
};

export type FreshnessState = 'fresh' | 'stale';

export function freshnessOf(
  factClass: FactClass,
  verifiedAt: Date,
  now: Date = new Date(),
): FreshnessState {
  const age = now.getTime() - verifiedAt.getTime();
  return age <= FRESHNESS_WINDOW_MS[factClass] ? 'fresh' : 'stale';
}
