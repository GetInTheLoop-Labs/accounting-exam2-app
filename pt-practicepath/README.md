# PT PracticePath — Phase 0: Foundation

Implements [issue #2](../../issues/2) per [the PRD](../docs/PRD.md) (§8.2 knowledge
base, §9.3 source access strategy, §13 Phase 0).

## What's here

| Path | Purpose |
|------|---------|
| `db/schema.sql` | Postgres DDL for the requirements knowledge base: Jurisdiction, Issuer, Requirement, Fact (with per-fact freshness windows, citations, evidence snapshots), PositionTemplate, ChangeLog, and the Source Registry (PRD §8.2, §9.3.1) |
| `src/kb/types.ts` | TypeScript entity types mirroring the schema |
| `src/kb/freshness.ts` | Per-fact-class freshness windows and the fresh/stale classifier (FR-23) |
| `src/sources/registry.ts` | Source Registry: all 53 jurisdictions, national issuers (FSBPT, PT Compact, ABPTS, AHA, FCCPT, NPPES), and every located fact-bearing page. Composes deep-dive pages (CA/TX/FL/NY, from PRD research) with the enumeration pass in `boards.ts` |
| `src/sources/boards.ts` | Enumeration output (2026-07-03): board name/URL + fee, application, endorsement, and processing-time pages for the other 49 jurisdictions, located via official-domain web research with per-entry confidence and notes. URLs are search-index-confirmed; the production census probe live-verifies each before rung assignment |
| `src/census/probe.ts` | The access census (PRD §9.3.1): probes every located source, records robots policy / HTTP status / bot-protection signals, writes `census/access-matrix.{json,md}` with per-source escalation-ladder classifications |
| `src/seeding/` | **Seeding agents + human review tooling**: polite fetcher with evidence snapshots (`fetcher.ts`), schema-constrained Claude extraction (`extractor.ts`, structured outputs on `claude-opus-4-8`), canonical requirement ids (`requirements.ts`), review decisions and markdown reports (`review.ts`), golden-set accuracy audit (`audit.ts`), and the CLI (`cli.ts`) |
| `data/golden/` | Golden set for the seeding-accuracy audit (Phase 0 exit: ≥ 99%). Texas seeded; ~9 states to go |
| `test/` | Registry integrity, freshness-window, and seeding-pipeline tests |

## Usage

```sh
npm install
npm test          # registry integrity + freshness windows + seeding pipeline
npm run typecheck
CENSUS_ENV="describe your egress here" npm run census   # writes census/access-matrix.{json,md}

# Seeding pipeline (needs Anthropic credentials + production-realistic egress):
npm run seed -- tx                       # fetch sources, extract → data/seeds/tx.json (pending review)
npm run seed-review -- tx report         # human review report → data/seeds/tx-review.md
npm run seed-review -- tx approve 0 2 5  # or: reject 3 --note "wrong fee row"
npm run seed-audit -- tx                 # diff approved facts vs data/golden/tx.json (exit 1 below 99%)
```

**Seeding pipeline invariants:** the extractor may only emit facts tied to the
canonical requirement ids, each with a verbatim evidence quote and confidence
score (below 0.8 is flagged ⚠️ in review); every fetched page is snapshotted to
`data/evidence/` (NFR-9); nothing counts toward the KB or the audit until a
human approves it; blocked sources are skipped and named, not silently dropped
(they need a rung B–E channel per PRD §9.3.2).

**Census caveat (PRD §9.3.1):** results are only meaningful from
production-realistic egress. Runs from sandboxes/datacenter proxies overstate
blocking; the report header records the environment via `CENSUS_ENV`.

## Phase 0 remaining work

- [x] Locate fee/application/processing-time pages for the 49 backlog jurisdictions (census enumeration — see `src/sources/boards.ts`)
- [ ] Probe all located pages from production egress; assign escalation-ladder rungs from that census run
- [ ] FSBPT / PT Compact Commission partnership outreach (PRD §9.3.3 — human task, starts now)
- [x] Seeding agents (LLM extraction constrained to the `Fact` schema) + human review tooling (`src/seeding/`)
- [ ] Run the seeding pipeline from production egress with Anthropic credentials; review + audit Texas for real
- [ ] Re-verify all `[verify]`-flagged facts from PRD §15; flip golden-set entries from `unverified` to `verified`
- [ ] Golden sets for ~9 more states; run the seeding-accuracy audit
