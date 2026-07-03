// Human review tooling (Phase 0: "seeding agents with human review tooling").
//
// Pure decision logic lives here; the CLI wrapper is in cli.ts. A fact enters
// the KB only after an explicit human decision — there is no auto-approve,
// and low-confidence facts are called out prominently in the review report.

import { REVIEW_ATTENTION_THRESHOLD } from './extractor.js';
import type { ProposedFact, SeedFile } from './types.js';

export interface Decision {
  index: number;
  action: 'approve' | 'reject';
  note?: string;
}

export class ReviewError extends Error {}

/** Apply reviewer decisions immutably; throws on bad indexes or re-review. */
export function applyDecisions(seed: SeedFile, decisions: Decision[]): SeedFile {
  const facts = [...seed.facts];
  for (const d of decisions) {
    const fact = facts[d.index];
    if (!fact) throw new ReviewError(`No fact at index ${d.index}`);
    if (fact.status !== 'pending_review') {
      throw new ReviewError(`Fact ${d.index} already ${fact.status}; re-review is not allowed`);
    }
    facts[d.index] = {
      ...fact,
      status: d.action === 'approve' ? 'approved' : 'rejected',
      ...(d.note !== undefined ? { reviewNote: d.note } : {}),
    };
  }
  return { ...seed, facts };
}

export function reviewCounts(seed: SeedFile): Record<ProposedFact['status'], number> {
  const counts = { pending_review: 0, approved: 0, rejected: 0 };
  for (const f of seed.facts) counts[f.status] += 1;
  return counts;
}

/** Render the seed file as a markdown review report for a human. */
export function renderReviewReport(seed: SeedFile): string {
  const counts = reviewCounts(seed);
  const lines = [
    `# Seed review — ${seed.jurisdiction}`,
    '',
    `- Seeded: ${seed.seededAt} (model: ${seed.model})`,
    `- Facts: ${seed.facts.length} (pending: ${counts.pending_review}, approved: ${counts.approved}, rejected: ${counts.rejected})`,
    '',
    '| # | Status | Requirement | Class | Value | Conf | Source | Evidence quote |',
    '|---|--------|-------------|-------|-------|------|--------|----------------|',
  ];
  seed.facts.forEach((f, i) => {
    const flag = f.confidence < REVIEW_ATTENTION_THRESHOLD ? ' ⚠️' : '';
    const quote = f.evidenceQuote.length > 120 ? `${f.evidenceQuote.slice(0, 117)}…` : f.evidenceQuote;
    lines.push(
      `| ${i} | ${f.status}${flag} | ${f.requirementId} | ${f.factClass} | ${f.value}${f.unit ? ` ${f.unit}` : ''} | ${f.confidence.toFixed(2)} | [${f.sourceId}](${f.sourceUrl}) | ${quote.replace(/\|/g, '\\|').replace(/\n/g, ' ')} |`,
    );
  });
  lines.push(
    '',
    `⚠️ = extractor confidence below ${REVIEW_ATTENTION_THRESHOLD} — verify against the evidence snapshot before approving.`,
    '',
    'Decide with: `npm run seed-review -- <jur> approve <index...>` / `reject <index...> --note "..."`',
  );
  return lines.join('\n') + '\n';
}
