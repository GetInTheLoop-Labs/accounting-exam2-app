# Operations runbook

What to run, in what order, once PT PracticePath is deployed on
production-realistic infrastructure. Everything here is blocked in
development sandboxes (egress proxies 403 the primary sources) — that is the
expected result there, not a bug.

## 0. Deploy

```sh
docker build -t pt-practicepath .
docker run -p 3000:3000 \
  -e ANTHROPIC_API_KEY=sk-ant-... \
  -v ptpp-data:/app/data \
  pt-practicepath
```

Any small host works — the app is one Node process, in-memory + file state
under `/app/data`. Verify: `GET /` serves the UI, `GET /v1/jurisdictions`
returns 53 entries, and the paste-a-posting flow parses (needs the API key).

## 1. Census — the source access matrix (PRD §9.3.1)

```sh
CENSUS_ENV="describe the egress (provider, region, IP type)" npm run census
```

Reads every located source URL, writes `census/access-matrix.{json,md}`.
Expected on production egress: most sources open (the sandbox's uniform 403s
were the proxy, not the sites). For each source still blocked:
assign an escalation-ladder rung (§9.3.2) — statutory/administrative-code
channel (rung B), licensed vendor (D), or human verification (E) — and record
it in `src/sources/registry.ts` (`accessRung`).

**Exit check (issue #2):** ≥ 80% of fact classes reachable via rungs A–C, or
an explicit D/E plan for the rest.

## 2. Seeding — populate and audit the golden jurisdictions

Per jurisdiction (start with the 10 golden states — tx ca fl ny wa in la mn nv sc):

```sh
npm run seed -- tx                    # fetch + extract → data/seeds/tx.json
npm run seed-review -- tx report      # human review → data/seeds/tx-review.md
npm run seed-review -- tx approve 0 2 5   # review every fact; ⚠️ = low confidence, check the evidence snapshot
npm run seed-audit -- tx              # vs data/golden/tx.json; exit 1 below 99%
```

Before auditing, resolve golden entries marked `"status": "unverified"` by
hand-checking their source URLs in a browser (each file's notes say exactly
what to check — priority list: WA application fee, IN fingerprint + compact
fees, MN CBC fee discrepancy, FL processing times, NPTE $485).

**Exit check (issue #2):** ≥ 99% fact-level accuracy across the golden set.

## 3. Resolve flagged data conflicts

- **Minnesota compact status**: registry note says the researched roster
  conflicts with Minn. Stat. §148.699 — check ptcompact.org/compact-map in a
  browser and correct `COMPACT_ACTIVE` / notes in `src/sources/registry.ts`.
- **PRD §15 `[verify]` flags**: fees and rosters that were
  secondary-corroborated during research — confirm each against the live
  primary page and update the PRD appendix + golden files.

## 4. Wire live facts into reports

The API's `FactStore` (src/api/facts.ts) is the seam: replace/augment
`GoldenFactStore` with a store that reads approved seeds and re-verifies
volatile classes per request using the seeding fetcher + extractor
(freshness windows in `src/kb/freshness.ts` decide what must be live).
This is the remaining Phase 1 engineering item (issue #3: live validation
pipeline + streaming).

## 5. Keep it fresh

Schedule background sweeps on the freshness windows (wait_time daily; fees
weekly; rules/compact monthly): re-run `npm run seed` per jurisdiction and
diff against approved facts; changes go back through review. A cron on the
deploy host is sufficient to start.

## Partnership track (human, start immediately)

Compact remote-state fees are effectively un-indexable and several boards
bot-block — the durable fix is official data access. Outreach drafts:
`docs/outreach/fsbpt.md`, `docs/outreach/pt-compact.md` (PRD §9.3.3).

## Standalone repository

The product should move to its own repo. Repo creation isn't possible from
the coding-agent integration (403) — create an empty repo in the GitHub UI
(e.g. `GetInTheLoop-Labs/pt-practicepath`), then:

```sh
./scripts/export-standalone.sh git@github.com:GetInTheLoop-Labs/pt-practicepath.git
```
