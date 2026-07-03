# PT PracticePath — Phase 0: Foundation

Implements [issue #2](../../issues/2) per [the PRD](../docs/PRD.md) (§8.2 knowledge
base, §9.3 source access strategy, §13 Phase 0).

## What's here

| Path | Purpose |
|------|---------|
| `db/schema.sql` | Postgres DDL for the requirements knowledge base: Jurisdiction, Issuer, Requirement, Fact (with per-fact freshness windows, citations, evidence snapshots), PositionTemplate, ChangeLog, and the Source Registry (PRD §8.2, §9.3.1) |
| `src/kb/types.ts` | TypeScript entity types mirroring the schema |
| `src/kb/freshness.ts` | Per-fact-class freshness windows and the fresh/stale classifier (FR-23) |
| `src/sources/registry.ts` | Source Registry seed: all 53 jurisdictions, national issuers (FSBPT, PT Compact, ABPTS, AHA, FCCPT, NPPES), and every fact-bearing page verified during PRD research. Boards beyond CA/TX/FL/NY are enumerated without URLs — the census locates them; **unverified URLs are never seeded** |
| `src/census/probe.ts` | The access census (PRD §9.3.1): probes every located source, records robots policy / HTTP status / bot-protection signals, writes `census/access-matrix.{json,md}` with per-source escalation-ladder classifications |
| `data/golden/` | Golden set for the seeding-accuracy audit (Phase 0 exit: ≥ 99%). Texas seeded; ~9 states to go |
| `test/` | Registry integrity + freshness-window tests |

## Usage

```sh
npm install
npm test          # registry integrity + freshness windows
npm run typecheck
CENSUS_ENV="describe your egress here" npm run census   # writes census/access-matrix.{json,md}
```

**Census caveat (PRD §9.3.1):** results are only meaningful from
production-realistic egress. Runs from sandboxes/datacenter proxies overstate
blocking; the report header records the environment via `CENSUS_ENV`.

## Phase 0 remaining work

- [ ] Locate + probe fee/application/processing-time pages for the 49 backlog jurisdictions (census enumeration)
- [ ] Assign escalation-ladder rungs from a production-egress census run
- [ ] FSBPT / PT Compact Commission partnership outreach (PRD §9.3.3 — human task, starts now)
- [ ] Seeding agents (LLM extraction constrained to the `Fact` schema) + human review tooling
- [ ] Re-verify all `[verify]`-flagged facts from PRD §15; flip golden-set entries from `unverified` to `verified`
- [ ] Golden sets for ~9 more states; run the seeding-accuracy audit
