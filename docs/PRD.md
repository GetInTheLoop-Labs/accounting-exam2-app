# Product Requirements Document: PT PracticePath

**Product name (working title):** PT PracticePath — Physical Therapy Licensure & Practice Requirements Navigator
**Version:** 1.0 (Draft)
**Date:** July 3, 2026
**Status:** Draft for review

---

## 1. Executive Summary

PT PracticePath is a web application that gives any physical therapist (PT) or physical therapist assistant (PTA) a complete, current, and verified picture of everything required to practice in any position, in any city and state in the United States.

A user provides one of three inputs — a pasted job/position description, a link to a job posting, or a target city and state — and receives a **Practice Requirements Report**: an itemized, personalized checklist of every requirement standing between them and legally practicing in that role. For each requirement, the report specifies:

- **What** the requirement is and **why** it applies to this position
- **Where** to obtain it (issuing organization, with direct links)
- **How** to obtain it (step-by-step process)
- **How long** the process takes (standard timeline)
- **Current wait times** (live processing-time data, verified at request time)
- **What it costs** (itemized fees, with a running total)

The defining product commitment is **freshness through per-request validation**: licensure fees, processing times, compact membership, and board rules change continuously across 50+ jurisdictions. Every report is validated against authoritative primary sources (state licensing boards, FSBPT, PT Compact Commission) at the time it is generated, and every fact carries a citation and a "verified as of" timestamp. Where a fact cannot be re-verified live, the report says so explicitly rather than presenting stale data as current.

Today this information is fragmented across dozens of state board websites, PDF applications, the FSBPT, the PT Compact, and outdated blog posts. Assembling it takes a therapist hours to days, and errors cost weeks of licensure delay or lost job offers. PT PracticePath collapses that work into a single validated report generated in minutes.

---

## 2. Problem Statement & Opportunity

### 2.1 The problem

1. **Fragmentation.** PT licensure in the United States is regulated independently by 53+ jurisdictions (50 states, DC, and territories). Each jurisdiction has its own board, application process, fees, jurisprudence exam rules, background-check procedures, continuing-education rules, and renewal cycles. There is no single authoritative aggregation of this information oriented toward the practitioner.

2. **Staleness.** The information that does exist — board websites, FSBPT summaries, staffing-agency "state license guides" — goes stale quickly. Fees change with legislative cycles, processing times swing with board staffing, and PT Compact membership grows over time. A guide written last year can be materially wrong today, and the reader has no way to tell.

3. **Position-specific complexity.** The state license is necessary but rarely sufficient. Real positions layer on employer, setting, and payer requirements: BLS/CPR certification, specialty certifications, home-health background clearances, school-based clearances, TB tests and immunization records, drug screening, NPI/Medicare enrollment for some roles, and more. Job postings state these requirements inconsistently, and no tool maps a specific posting to a complete requirements list.

4. **Cost and timeline opacity.** Even when a therapist finds all the requirements, they cannot easily answer the two questions that matter most: *how much will this cost me in total* and *how long until I can start work*. Current processing/wait times are the most volatile data of all and are almost never aggregated.

### 2.2 Who feels the pain

- **New graduates** navigating initial licensure while job hunting across state lines.
- **Relocating PTs** who must obtain licensure by endorsement or a compact privilege in a new state, often on a deadline tied to a job offer or a family move.
- **Travel PTs**, who repeat this process several times per year and for whom licensure lead time directly determines income.
- **Foreign-educated PTs**, who face the longest and most complex path (credential evaluation, English proficiency, visa considerations) with the least reliable guidance.
- **Recruiters and staffing agencies** (secondary), who currently maintain internal state-guide spreadsheets that go stale.

### 2.3 Why now

- The **PT Compact** has changed the decision space: for many multi-state scenarios, a compact privilege is faster and cheaper than endorsement — but only for eligible therapists between member states, and the membership map keeps changing. Practitioners need current, situation-specific guidance.
- **LLM-based research and extraction** now make it feasible to (a) parse an arbitrary job description into structured position attributes and (b) agentically verify facts against primary sources at request time — the two capabilities this product depends on.
- Travel and mobile healthcare staffing remain structurally large post-pandemic, and licensure velocity is a competitive factor for both therapists and staffing agencies.

---

## 3. Goals & Non-Goals

### 3.1 Goals

| # | Goal |
|---|------|
| G1 | Let any PT/PTA generate a complete, position-specific requirements report for any US jurisdiction from a job description, a job-posting URL, or a city+state. |
| G2 | For every requirement, provide: issuer, step-by-step acquisition process, standard timeline, current wait time, itemized cost, and direct links. |
| G3 | Validate report contents against authoritative primary sources at request time; timestamp and cite every fact; disclose explicitly when live verification was not possible. |
| G4 | Present accurate totals: full cost estimate and critical-path timeline estimate ("you could plausibly start work by ~date X"). |
| G5 | Cover the three licensure paths — initial licensure by examination, licensure by endorsement, and PT Compact privilege — and recommend the optimal path for the user's situation. |
| G6 | Be trustworthy enough that a therapist acts on the report without independently re-verifying each item. |

### 3.2 Non-goals (v1)

| # | Non-goal | Rationale |
|---|----------|-----------|
| N1 | Filing applications on the user's behalf | We navigate; we do not act as an application-filing agent or credentialing service in v1. |
| N2 | Legal advice | Reports are informational with citations to primary sources; we do not interpret law beyond what boards publish. |
| N3 | Professions beyond PT/PTA | Architecture should not preclude expansion (OT, SLP, nursing), but v1 scope is PT/PTA only. |
| N4 | Job search / job matching | We consume job postings; we do not source or rank them. |
| N5 | International practice destinations | US states, DC, and US territories only. |
| N6 | CE course marketplace | We state CE requirements and link to approved-provider lists; we do not sell or host courses. |

---

## 4. Target Users & Personas

### P1 — "New Grad Nadia" (initial licensure)
DPT student graduating in May, interviewing for jobs in two states. Needs: which state to take the NPTE under, what the total cost is, how to sequence graduation → exam → license → start date, and what her chosen employer will additionally require. Success = a single sequenced checklist with dates and costs.

### P2 — "Relocating Ravi" (endorsement / compact)
Licensed 6 years in one state; spouse's job is moving the family to another state in 10 weeks. Needs: fastest legal path to practice in the new state — endorsement vs. compact privilege — with current processing times driving the decision. Success = a recommended path with a defensible "you can start by" date.

### P3 — "Travel Tara" (serial multi-state)
Travel PT taking 3–4 contracts per year. Compact privileges where possible, endorsement where not. Needs: per-assignment requirement reports generated from the staffing agency's job posting URL, plus tracking of which licenses/privileges/certifications she holds and when they expire. Success = minutes-not-hours per new assignment, and no surprise blockers at credentialing.

### P4 — "Foreign-educated Farah"
Educated abroad, seeking first US licensure. Needs: the full extended path — credential evaluation, English proficiency testing, jurisdiction selection (requirements differ), NPTE, visa-adjacent documentation awareness. Success = a realistic end-to-end plan with the long-lead items surfaced first.

### P5 — "PTA Paolo"
Licensed PTA; same product flows as PTs with PTA-specific requirements (NPTE-PTA, PTA-specific state rules, supervision rules affecting what positions he can accept). The product treats PTA as a first-class credential type, not an afterthought.

### P6 — "Recruiter Renée" (secondary persona)
Staffing-agency recruiter placing dozens of therapists. Needs: shareable requirement reports for candidates, and confidence the information is current (her spreadsheet is not). Success = fewer placements delayed by licensure surprises. (Drives the B2B monetization path; not required for MVP.)

---

## 5. User Journeys & Core Flows

### 5.1 Input modes (all three are v1 requirements)

**Mode A — Paste a position description.** User pastes the full text of a job posting or position description. The system extracts: role (PT/PTA), city/state(s), practice setting (outpatient, acute, SNF, home health, schools, etc.), specialty expectations, employer type, and any explicitly stated requirements (e.g., "OCS preferred," "BLS required," "home health experience").

**Mode B — Provide a link.** User pastes a URL to a job posting. The system fetches the page, extracts the posting content, and proceeds as in Mode A. If the page cannot be fetched (login wall, robots restrictions, expired posting), the user is told why and prompted to paste the text instead (graceful degradation to Mode A).

**Mode C — City + state (or state only).** User selects a target location and role (PT/PTA), optionally a practice setting. The system produces the location-based report without position-specific extras, clearly noting which requirement categories may be added by a specific employer.

### 5.2 Profile context (optional but transformative)

Before or after the first report, the user can supply their situation, which turns a generic report into a personalized gap analysis:

- Current licensure status: student / NPTE-passed / licensed (which state(s), license standing)
- Whether their home state is a PT Compact member (derived automatically from their license state)
- Education origin: US-accredited (CAPTE) vs. foreign-educated
- Certifications already held (BLS, specialty certs) and expiration dates

With profile context, the report distinguishes: ✅ already satisfied / 🟡 in progress or expiring / ❌ needed — and the cost/timeline totals reflect only the gap.

### 5.3 The Practice Requirements Report (core output)

Report sections, in order:

1. **Summary header** — position/location parsed, recommended licensure path, total estimated cost, critical-path timeline, "report generated & verified" timestamp.
2. **Licensure path decision** — initial exam vs. endorsement vs. compact privilege for this user & jurisdiction, with the reasoning and a comparison table (cost, time, prerequisites) when more than one path is viable.
3. **State licensure requirements** — itemized: application, NPTE (if applicable), jurisprudence exam, background check/fingerprinting, supervised practice (if any), fees. Each item: issuer, process steps, standard timeline, **current wait time**, cost, links, citation + verified-at timestamp.
4. **Position-specific requirements** — extracted from the job description: certifications (BLS, specialty), setting-mandated clearances (home health, schools/pediatrics), health documentation (TB, immunizations, drug screen), payer-driven items (NPI, Medicare enrollment where relevant). Same per-item detail structure. Items are labeled by confidence: *required by law*, *required by this employer (stated in posting)*, *commonly required in this setting (not stated)*.
5. **Sequenced action plan** — dependency-ordered checklist (e.g., fingerprinting before application; application approval before jurisprudence exam in some states) with a projected calendar and the critical path highlighted.
6. **Cost summary** — itemized table with total; one-time vs. recurring (renewals, CE) separated.
7. **Verification appendix** — every fact's source URL, what was verified live vs. served from recent verification, and any items where live verification failed (flagged, with last-known-good data and its date).

### 5.4 Flow: report generation (user's view)

1. User lands → chooses input mode → submits input.
2. System shows parse results for confirmation ("We read this as: PT, outpatient ortho, Austin, TX — correct?"). User confirms or corrects. *(Trust checkpoint #1)*
3. System generates the report with a live progress indicator that names what it is doing ("Verifying current processing times with the Texas board… Checking PT Compact status…"). Target: interactive results begin streaming < 30s; full verified report < 2–3 min. *(The progress transparency is a feature, not a spinner: it shows the validation promise being kept.)*
4. Report delivered → user can save it (account), export PDF, share a link, or re-verify on demand later.

### 5.5 Later-phase flows (post-MVP, specified for architectural awareness)

- **Progress tracking:** check off requirements; the timeline re-projects.
- **Change alerts:** "The fee/processing time/rule in your saved report changed" notifications.
- **Expiration tracking:** licenses, privileges, BLS, and cert renewal reminders.

---

## 6. Functional Requirements

Priorities: **P0** = MVP-blocking, **P1** = fast-follow, **P2** = later phase.

### 6.1 Input & parsing

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1 | Accept pasted position-description text up to 20,000 characters and extract structured position attributes: role (PT/PTA), location(s), setting, specialty, employer type, explicitly stated requirements. | P0 |
| FR-2 | Accept a job-posting URL; fetch and extract the posting content; proceed as FR-1. On fetch failure, explain the failure and offer paste fallback. | P0 |
| FR-3 | Accept direct city + state (or state-only) + role input with optional practice-setting selection. | P0 |
| FR-4 | Present the parsed interpretation to the user for confirmation/correction before generating the report. | P0 |
| FR-5 | Handle postings that list multiple locations: user selects the target location, or generates one report per location. | P1 |
| FR-6 | Detect non-PT/PTA postings and inform the user the product covers PT/PTA only. | P0 |

### 6.2 Requirements engine

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-10 | Determine every applicable **state licensure** requirement for the target jurisdiction and role: application, examination (NPTE/NPTE-PTA), jurisprudence exam, background check/fingerprinting, education verification, supervised-practice rules, and all associated fees. | P0 |
| FR-11 | Determine the applicable **licensure path(s)** — initial by examination, endorsement, PT Compact privilege — based on user profile (license state/status), and recommend the optimal path with a cost/time comparison when multiple are viable. | P0 |
| FR-12 | Determine **position-specific** requirements from parsed posting attributes: certifications (BLS, ACLS, specialty), setting-driven clearances (home health, school-based), health documentation, payer/administrative items (NPI, Medicare enrollment where indicated). Label each as *legally required* / *stated by employer* / *commonly required in setting*. | P0 |
| FR-13 | Support the foreign-educated path: credential evaluation, English-proficiency testing, and jurisdiction-specific foreign-educated rules, integrated into the same report structure. | P1 |
| FR-14 | For each requirement, output: name; why it applies; issuing organization with link; step-by-step acquisition process; standard timeline; current wait time; itemized cost; renewal cycle (if recurring). | P0 |
| FR-15 | Produce the sequenced action plan: dependency-ordered steps with projected dates and critical path identified. | P0 |
| FR-16 | Produce cost totals (one-time vs. recurring separated) and a critical-path timeline estimate. | P0 |
| FR-17 | With profile context, mark each requirement satisfied / in-progress / needed and compute gap-only totals. | P1 |

### 6.3 Validation & freshness (the core differentiator)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-20 | On every report request, validate volatile facts (fees, current processing/wait times, compact membership status, application URLs) against their authoritative primary sources before presenting them. | P0 |
| FR-21 | Every fact in a report carries a citation (source URL) and a verified-at timestamp. | P0 |
| FR-22 | Distinguish in the UI between: verified live this request; verified recently (within the fact class's freshness window); and could-not-verify (shown with last-known-good value, its date, and an explicit staleness warning). Never present unverifiable data as current. | P0 |
| FR-23 | Maintain per-fact-class freshness windows (e.g., statutory requirements: 30 days; fees: 7 days; processing/wait times: 24 hours or live-only) that govern when cached verification is acceptable versus when live re-verification is mandatory. | P0 |
| FR-24 | When live verification detects a change from the knowledge base (fee changed, wait time moved, state joined the compact), update the knowledge base and log the change with before/after values. | P0 |
| FR-25 | Users can trigger on-demand re-verification of a saved report. | P1 |
| FR-26 | Change alerts: notify users when a fact in their saved report changes. | P2 |

### 6.4 Reports & accounts

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-30 | Render the full Practice Requirements Report per §5.3, streaming progressively as verification completes. | P0 |
| FR-31 | Export report to PDF; generate a shareable read-only link. | P1 |
| FR-32 | Accounts: save reports, profile (license status, held certifications), and report history. | P1 |
| FR-33 | Progress tracking: check off requirements; timeline re-projects. | P2 |
| FR-34 | Expiration tracking and renewal reminders for licenses, privileges, and certifications. | P2 |
| FR-35 | Recruiter/B2B: multi-candidate workspaces and shareable candidate reports. | P2 |

---

## 7. Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-1 | **Accuracy.** Verified facts must match the primary source at verification time. Target: ≥ 99% fact-level accuracy on audited reports; every inaccuracy triaged as an incident. |
| NFR-2 | **Citation completeness.** 100% of presented facts carry a resolvable primary-source citation and timestamp. |
| NFR-3 | **Latency.** First useful content streams < 30 seconds; complete verified report ≤ 3 minutes at p90. Verification progress is always visible. |
| NFR-4 | **Availability.** 99.5% for report generation. Source-site outages must degrade gracefully (FR-22), not fail the report. |
| NFR-5 | **Source courtesy/compliance.** Verification agents respect robots.txt, rate-limit per source domain, identify themselves via user-agent, and prefer official APIs/data feeds where boards offer them. |
| NFR-6 | **Privacy.** Profile data (license status, certifications) is personal; encrypt at rest, no sale of user data, deletion on request. Job-posting inputs may reveal the user's job search — treat as confidential. |
| NFR-7 | **Accessibility.** WCAG 2.2 AA. |
| NFR-8 | **Disclaimers.** Every report carries a clear informational-purpose disclaimer directing users to confirm with the licensing board before acting; disclaimer approach reviewed by counsel. |
| NFR-9 | **Auditability.** Every report is reproducible: store the facts, sources, timestamps, and knowledge-base version used to generate it. |

---

## 8. System Architecture

### 8.1 Overview

Three cooperating subsystems behind a web app + API:

```
┌────────────────────────────────────────────────────────────┐
│                        Web App (SPA)                        │
│   input modes · parse confirmation · streaming report UI    │
└──────────────────────────┬─────────────────────────────────┘
                           │ HTTPS / SSE
┌──────────────────────────▼─────────────────────────────────┐
│                       API / Orchestrator                    │
│  session & accounts · report assembly · streaming           │
└───────┬──────────────────┬─────────────────────┬───────────┘
        │                  │                     │
┌───────▼───────┐  ┌───────▼────────┐  ┌─────────▼─────────┐
│ Input Under-  │  │ Requirements    │  │ Live Validation   │
│ standing      │  │ Knowledge Base  │  │ Pipeline          │
│ (LLM extract) │  │ (structured DB) │  │ (agentic verify)  │
└───────────────┘  └───────┬────────┘  └─────────┬─────────┘
                           │      change feedback │
                           └──────────◄───────────┘
                                      │
                        Primary sources: state boards,
                        FSBPT, PT Compact, cert issuers
```

**Design principle:** the knowledge base makes reports *fast and complete*; the validation pipeline makes them *current and trustworthy*. Neither alone is sufficient: pure-LLM live research is too slow/unreliable for a complete report, and a pure database is stale by definition. The KB is the skeleton; validation re-confirms the volatile flesh on every request.

### 8.2 Requirements Knowledge Base (KB)

Structured, versioned store of requirements per jurisdiction × role × path, plus position-level requirement templates per setting.

Core entities (sketch):

```
Jurisdiction(id, name, board_name, board_url, compact_member,
             compact_active_date, notes)

Requirement(id, jurisdiction_id | null,          -- null = national (e.g., NPTE)
            role,                                 -- PT | PTA | both
            path,                                 -- initial | endorsement | compact | all
            category,                             -- exam | application | background |
                                                  -- jurisprudence | education | clearance |
                                                  -- certification | health | administrative
            name, description, issuer_id,
            process_steps[], depends_on[],        -- drives sequencing (FR-15)
            standard_timeline, renewal_cycle)

Fact(id, requirement_id, fact_class,              -- fee | wait_time | rule | url | date
     value, unit, source_url,
     verified_at, verification_method,            -- live_fetch | api | manual
     freshness_window, confidence)

Issuer(id, name, type,                            -- state_board | fsbpt | compact_commission |
       url, contact)                              -- cert_body | federal

PositionTemplate(id, setting,                     -- home_health | schools | snf | acute | ...
                 requirement_refs[],              -- commonly-required items for the setting
                 legal_basis | employer_norm)

ChangeLog(id, fact_id, old_value, new_value, detected_at, source_url)
```

Every volatile datum is a `Fact` with its own `fact_class`, `freshness_window`, `source_url`, and `verified_at` — this is what makes per-request validation tractable and auditable (NFR-9).

Seeding: the KB is initially populated by a supervised agentic research pass over all 50+ jurisdictions (same agents as the validation pipeline, run in bulk, human-reviewed before launch), then maintained continuously by the change-feedback loop (FR-24) plus scheduled background sweeps.

### 8.3 Live Validation Pipeline

Per report request:

1. **Plan** — the orchestrator assembles the candidate requirement set from the KB, then partitions facts into: fresh-enough (within freshness window) vs. must-verify-now (stale or live-only classes like current wait times).
2. **Verify (fan-out)** — parallel verification agents, one per source domain, each: fetches the authoritative page (or API), extracts the target fact with an LLM extractor constrained to the fact schema, and compares against the KB value. Domain-level rate limiting and robots compliance (NFR-5). Per-source adapters encapsulate quirks (some boards publish processing times as HTML tables, some as PDFs, some not at all).
3. **Score** — each verification returns {value, source_url, confidence, evidence_snippet}. Low-confidence extractions (ambiguous page, conflicting values on one page) are flagged rather than silently accepted; the report shows the last-known-good value with a warning (FR-22).
4. **Reconcile** — changed facts update the KB + ChangeLog; the report is assembled from post-verification values and streamed to the client as sections complete.
5. **Fallback** — source unreachable → serve last-known-good with explicit staleness disclosure; never block the whole report on one source.

Current-wait-time strategy (the hardest data): (a) boards that publish processing times → live extraction each request; (b) boards that don't → clearly labeled estimate from the board's stated standard timeline, optionally augmented later (P2) by anonymized user-reported actuals ("community-verified: license issued in 23 days, reported 2026-06-12") kept visually distinct from official data.

### 8.4 Input Understanding

- LLM extraction (structured-output/tool-call constrained to the position schema) from pasted text or fetched URL content.
- URL fetching through a server-side fetcher with readability extraction; login-walled/blocked pages degrade to paste flow (FR-2).
- Extraction output is always confirmed by the user before the (more expensive) validation pipeline runs (FR-4) — this both builds trust and prevents wasted verification cycles.

### 8.5 Tech stack recommendation

| Layer | Recommendation | Notes |
|-------|----------------|-------|
| Frontend | Next.js (React, TypeScript), SSE for streaming report sections | Streaming-first UI is a product requirement (NFR-3) |
| API/orchestrator | Node.js (TypeScript) or Python (FastAPI); job queue (e.g., Temporal or BullMQ) for verification fan-out | Verification is a fan-out/fan-in workflow with retries — use a workflow engine, not ad-hoc async |
| LLM | Claude (latest) for extraction, verification reading, and report narrative; structured outputs everywhere | Two distinct uses: *extraction* (schema-constrained, low temperature) and *narrative* (report prose grounded only in verified facts) |
| KB store | Postgres (facts, entities, changelog) + object storage for fetched-page evidence snapshots | Evidence snapshots make NFR-9 auditability real |
| Fetching | Headless-capable fetcher pool with per-domain rate limits, robots compliance, caching proxy | Per-source adapters live here |
| Search/monitoring | Scheduled background sweeps re-verify all facts on their freshness windows independent of user traffic | Keeps p90 latency down: most facts are fresh when a user arrives |

### 8.6 API surface (sketch)

```
POST /v1/parse            {text | url | location}        → parsed position (for confirmation)
POST /v1/reports          {parsed position, profile?}    → report id, SSE stream URL
GET  /v1/reports/{id}     → report JSON (facts + citations + verification metadata)
POST /v1/reports/{id}/reverify                           → re-run validation on saved report
GET  /v1/jurisdictions    → coverage map, compact status
POST /v1/profile          → license status, held certifications
```

---

## 9. Data Sources & Validation Strategy

### 9.1 Source hierarchy

| Tier | Sources | Use |
|------|---------|-----|
| 1 — Authoritative | State licensing board websites & official fee schedules; FSBPT (NPTE, score transfer, jurisdiction licensure reference); PT Compact Commission (membership, privilege fees); certification issuers (AHA for BLS, ABPTS for specialties); federal (NPPES for NPI, CMS/PECOS for Medicare enrollment) | The only tier that can mark a fact *verified* |
| 2 — Corroborating | APTA resources; state statute/regulation text | Cross-checks; statutory grounding for "legally required" labels |
| 3 — Contextual | Staffing-agency guides, forums, user-reported actuals | Never presented as verified; may inform estimates, always labeled as unofficial |

Conflicts resolve upward: a Tier-1 source always beats lower tiers; conflicting Tier-1 data (e.g., a board's fee page disagreeing with its application PDF) is flagged for human review and shown with both values.

### 9.2 Verification cadence

- **Live-only fact classes** (current processing/wait times): verified on every request where the source permits.
- **Short-window classes** (fees, application URLs): 7-day windows + verification on request when stale.
- **Slow-moving classes** (statutory requirements, CE rules, compact membership): 30-day background sweeps + event monitoring (compact commission announcements, board news pages).
- **Background sweeps** run on freshness schedules independent of user traffic, so most user requests hit fresh facts and live verification concentrates on the truly volatile classes (keeps NFR-3 latency achievable).

### 9.3 Trust presentation & legal posture

- Verification status is a first-class UI element: ✅ *verified today at source* / 🕐 *verified N days ago* / ⚠️ *could not re-verify — last confirmed [date]*.
- Every report: "This report is informational and not legal advice. Requirements are set by state licensing boards; confirm with the board before acting. Every fact above links to its official source." Exact language via counsel review (NFR-8).
- Evidence snapshots (stored fetched pages) back every verification for internal audit and dispute resolution (NFR-9).

---

## 10. Business

> Figures and competitor specifics in this section are grounded in the research appendix (§15).

### 10.1 Competitive landscape

| Alternative | What it offers | Gap PT PracticePath fills |
|-------------|----------------|---------------------------|
| FSBPT licensure reference | Per-jurisdiction requirement summaries | Not position-specific; no wait times; no cost totals; no action sequencing |
| PT Compact site | Compact membership + privilege purchase | Only covers the compact path; assumes you already know it's your best path |
| State board websites | Authoritative per-state detail | 53+ separate sites; navigation burden is the core problem |
| APTA resources | Career/licensure guidance | General guidance, not a per-situation report |
| Staffing-agency state guides | Readable summaries per state | Frequently stale; marketing artifacts; no verification, no position tailoring |
| Credentialing platforms (B2B) | Employer-side credential verification | Serve employers post-hire; nothing practitioner-facing pre-hire |

No existing product does per-request-validated, position-specific, cost-and-timeline-complete reports for practitioners. The defensible moat is the maintained KB + validation infrastructure + change history, which compounds over time.

### 10.2 Monetization

| Model | Target | Sketch |
|-------|--------|--------|
| Freemium consumer | P1/P2/P4/P5 | Free: state-level summary report. Paid per-report ($15–29): full verified report with wait times, cost totals, sequenced plan, PDF export. |
| Subscription | P3 (travel PTs) | $10–20/mo: unlimited reports, saved profiles, expiration tracking, change alerts. Travel PTs generate 3–6 reports/year and have direct income sensitivity to licensure speed. |
| B2B | P6 (staffing agencies, health systems) | Per-seat or per-candidate API/workspace pricing; agencies replace internal stale spreadsheets. Likely the largest long-term revenue line. |

MVP launches with the freemium consumer model; B2B follows once accuracy metrics (NFR-1) are proven.

### 10.3 Go-to-market

1. **SEO/content:** per-state, per-path landing pages ("PT license in Texas by endorsement — cost, wait time, steps — verified [date]") generated from the KB itself; freshness is a ranking and trust advantage.
2. **Travel PT community:** the highest-frequency, highest-pain users; targeted presence in travel-PT communities and partnerships with travel-PT influencers/educators.
3. **DPT programs:** career-services partnerships for graduating cohorts (P1 acquisition at the moment of need).
4. **Staffing agencies:** design-partner program with 2–3 agencies during P1/P2 phases to shape the B2B product.

---

## 11. Success Metrics

| Metric | Target (12 mo post-launch) |
|--------|---------------------------|
| Fact-level accuracy on audited sample reports | ≥ 99% (NFR-1) |
| % facts presented with live/current verification (vs. stale-flagged) | ≥ 90% |
| Report generation p90 latency | ≤ 3 min (NFR-3) |
| Report completion rate (input → viewed full report) | ≥ 75% |
| User-confirmed parse accuracy (FR-4 confirmations without correction) | ≥ 85% |
| Repeat usage among travel PTs (P3) | ≥ 2 reports/user/6 mo |
| Free → paid conversion | ≥ 5% |
| NPS | ≥ 50 |
| Corrections reported by users per 100 reports | ≤ 1, trending down |

---

## 12. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Source volatility/breakage** — board sites restructure; extraction adapters break silently | Wrong or missing facts | Per-source adapters with extraction-confidence monitoring; canary sweeps; alert on extraction anomaly; fall back to stale-flagged data, never silent failure (FR-22) |
| **Scraping/ToS constraints** — a board objects to automated access | Loss of a Tier-1 source | Robots compliance + identified user-agent + polite rates from day one (NFR-5); pursue official data relationships with FSBPT/boards; manual-verification fallback workflow |
| **LLM hallucination** in extraction or narrative | Trust-destroying inaccuracies | Narrative generation constrained to verified `Fact` records only; schema-constrained extraction with evidence snippets; confidence thresholds route ambiguity to human review; report-level audit sampling |
| **Liability** — user acts on wrong info, suffers licensure delay/denial | Legal + reputational | NFR-8 disclaimers via counsel; citations to primary sources on every fact; accuracy incident process; E&O insurance |
| **Wait-time data unavailable** for boards that don't publish it | Weakest link in the core promise | Tiered honesty: official published times where available; labeled estimates otherwise; community-reported actuals (P2) clearly separated from official data |
| **Cold-start KB cost** — 53+ jurisdictions × paths × facts is a large seeding effort | Launch delay | Agentic bulk seeding with human review; launch state-by-state if needed (travel-PT-heavy states first), with explicit coverage map (API `/v1/jurisdictions`) |
| **Cost per report** — heavy LLM + fetching per request | Unit economics | Freshness windows + background sweeps concentrate live work on truly volatile facts; per-domain caching; free tier serves KB-fresh data with lighter live verification |

---

## 13. Release Plan / Phasing

### Phase 0 — Foundation (KB seeding)
Schema + seeding agents + human review tooling. Seed all jurisdictions for PT/PTA licensure paths (initial, endorsement, compact). Internal accuracy audit against a hand-built golden set for ~10 states. **Exit:** ≥ 99% accuracy on golden set.

### Phase 1 — MVP: Location reports (Mode C)
City/state + role → full verified Practice Requirements Report with all three licensure paths, live wait-time verification, cost/timeline totals, citations, PDF export. No accounts required (email capture for report delivery). **Exit:** public launch, latency + accuracy targets met.

### Phase 2 — Position intelligence (Modes A & B)
Job-description paste + URL ingestion, parse-confirmation flow, position-specific requirement layers, profile-aware gap analysis (FR-17). Accounts + saved reports. Paid tier on. **Exit:** parse-confirmation accuracy ≥ 85%; conversion funnel live.

### Phase 3 — Continuity: tracking & alerts
Progress tracking, expiration tracking, change alerts on saved reports, on-demand re-verification, community-reported actuals (clearly labeled). Subscription tier. **Exit:** repeat-usage target trending.

### Phase 4 — B2B & expansion
Recruiter workspaces, API access for staffing agencies, design-partner conversions. Evaluate adjacent professions (OT, SLP) using the same architecture (N3 lifts here if validated).

---

## 14. Open Questions

1. **Data partnerships:** Will FSBPT and/or the PT Compact Commission offer official data access? A partnership would materially de-risk the validation pipeline; outreach should begin during Phase 0.
2. **Community wait-time data:** What moderation/validation bar makes user-reported actuals trustworthy enough to show (even labeled)?
3. **Jurisprudence exam prep:** Users will ask for it (adjacent monetizable content). In scope for Phase 3+, or partner instead?
4. **Territory coverage:** Puerto Rico/Guam/USVI in MVP or fast-follow? (Data availability is spottier.)
5. **PDF applications:** Several boards publish fees/rules only inside application PDFs — confirm extraction reliability during Phase 0 and budget adapter work accordingly.
6. **Pricing validation:** Per-report price point ($15–29 hypothesis) needs testing against travel-PT willingness-to-pay before Phase 2 paywall placement.

---

## 15. Appendix — Verified Domain Facts (Research Baseline)

*This appendix grounds the PRD's examples in facts verified during PRD research. Product reports must re-verify all of this live — that is the product's core function. Verification dates as noted.*

<!-- RESEARCH APPENDIX: populated from live research -->
