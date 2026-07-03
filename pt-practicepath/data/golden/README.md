# Golden Set

Hand-built expected-values sets used to audit KB seeding accuracy (Phase 0
exit criterion: ≥ 99% fact-level accuracy — PRD §13, issue #2).

Each file is one jurisdiction. Every entry states an expected fact, the
primary-source URL it was hand-verified against, and the verification date.
Facts carried over from PRD research that could not be confirmed against a
live primary page are marked `"status": "unverified"` and MUST be manually
re-confirmed before the audit treats them as ground truth.

Phase 0 target: ~10 states — **reached** (10 jurisdictions, 2026-07-03):

- `tx.json`, `ca.json`, `fl.json`, `ny.json` — from the PRD §15.3 deep-dive research
- `wa.json`, `in.json`, `la.json`, `mn.json`, `nv.json`, `sc.json` — dedicated golden-set research pass

Notable per-state caveats live in each file's entry notes and `omitted` list.
Cross-cutting: compact remote-state fees are largely un-indexable on official
domains (ptcompact.org 403s automated access), so several were omitted or
marked unverified — a data relationship with the Compact Commission (PRD
§9.3.3) resolves this class wholesale.

Audit procedure: run the seeding agents for a golden jurisdiction, then diff
seeded `Fact` rows against the golden entries by `(requirementId, factClass)`.
Every mismatch is triaged as either a seeding defect or a real-world change
(in which case the golden entry is updated with a new verification date).
