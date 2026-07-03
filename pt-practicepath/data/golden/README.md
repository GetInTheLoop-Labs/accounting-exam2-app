# Golden Set

Hand-built expected-values sets used to audit KB seeding accuracy (Phase 0
exit criterion: ≥ 99% fact-level accuracy — PRD §13, issue #2).

Each file is one jurisdiction. Every entry states an expected fact, the
primary-source URL it was hand-verified against, and the verification date.
Facts carried over from PRD research that could not be confirmed against a
live primary page are marked `"status": "unverified"` and MUST be manually
re-confirmed before the audit treats them as ground truth.

Phase 0 target: ~10 states. Seeded so far:

- `tx.json` — Texas (from PRD §15.3 research, 2026-07-03; re-verify flagged items)

Audit procedure: run the seeding agents for a golden jurisdiction, then diff
seeded `Fact` rows against the golden entries by `(requirementId, factClass)`.
Every mismatch is triaged as either a seeding defect or a real-world change
(in which case the golden entry is updated with a new verification date).
