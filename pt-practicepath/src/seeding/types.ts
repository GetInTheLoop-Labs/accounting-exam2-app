// Seeding pipeline types (PRD §8.2 seeding agents + human review tooling).
//
// The pipeline turns a Source Registry page into ProposedFacts:
//   fetch (evidence snapshot) → extract (LLM, schema-constrained) → review
//   (human approve/reject) → audit (diff against the golden set).
// Nothing enters the KB without passing review — the LLM proposes, a human
// disposes (Phase 0 exit criterion: ≥ 99% accuracy vs the golden set).

import type { FactClass } from '../kb/types.js';

export type ReviewStatus = 'pending_review' | 'approved' | 'rejected';

export interface ProposedFact {
  /** KB requirement this fact belongs to, e.g. 'tx-jurisprudence-jam'. */
  requirementId: string;
  factClass: FactClass;
  value: string;
  unit?: 'usd' | 'days' | 'weeks';
  sourceUrl: string;
  sourceId: string;
  /** Verbatim quote from the page supporting the value. */
  evidenceQuote: string;
  /** Extractor confidence 0..1 — below threshold routes to mandatory review flagging. */
  confidence: number;
  extractedAt: string; // ISO timestamp
  /** Object key / relative path of the fetched-page snapshot (NFR-9). */
  evidenceSnapshot: string;
  status: ReviewStatus;
  reviewNote?: string;
}

export interface SeedFile {
  jurisdiction: string;
  model: string;
  seededAt: string;
  facts: ProposedFact[];
}

/** One extraction result as returned by the model (pre-review envelope). */
export interface ExtractionResult {
  facts: Array<{
    requirementId: string;
    factClass: FactClass;
    value: string;
    unit: 'usd' | 'days' | 'weeks' | null;
    evidenceQuote: string;
    confidence: number;
  }>;
  /** Model's note when the page did not contain an expected fact class. */
  missing: Array<{ factClass: FactClass; note: string }>;
}
