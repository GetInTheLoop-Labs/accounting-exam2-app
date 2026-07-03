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
| FSBPT Jurisdiction Licensure Reference Guide | Per-jurisdiction requirement comparison tables (exam, CE, jurisprudence, foreign-educated) | Quarterly board self-report, not live-validated; stale topic PDFs (some dated 2010–2014) remain in circulation; not position-specific; no wait times; no cost totals; no action sequencing |
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
| **Scraping/ToS constraints & bot protection** — a board objects to automated access, or bot-protection blocks fetches. *Confirmed real during PRD research: fsbpt.org, ptcompact.org, apta.org, and several state board domains returned 403 to automated fetching.* | Loss of a Tier-1 source | Robots compliance + identified user-agent + polite rates from day one (NFR-5); pursue official data relationships with FSBPT/boards; residential-grade fetch infrastructure evaluated against ToS; evidence snapshots + manual-verification fallback workflow; treat this as a Phase-0 spike, not an assumption |
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

*This appendix grounds the PRD's examples in facts gathered via live web research on **July 3, 2026**. Product reports must re-verify all of this at request time — that is the product's core function, and this appendix will be stale by launch. Facts marked **[verify]** could not be confirmed against a live primary page during research (see §15.9) and must be re-confirmed before being seeded into the knowledge base.*

### 15.1 National examination (NPTE) — FSBPT

| Fact | Value | Source |
|------|-------|--------|
| Exam versions | NPTE-PT and NPTE-PTA; required by all US jurisdictions; administered at Prometric centers | https://www.fsbpt.org/Secondary-Pages/Exam-Candidates/National-Exam-NPTE |
| Registration fee | $485 per attempt (PT and PTA) **[verify — secondary-corroborated]** | https://www.fsbpt.org/Our-Services/Candidate-Services/Exam-Registration-Payment |
| Prometric test-center fee | ~$82–$112 additional (varies) | https://npte101.com/npte-exam-cost/ |
| Exam calendar | Fixed dates, 4×/year per exam type (2026 PT: Jan 27–28, Apr 28–29, Jul 28–29, Oct 27–28) | https://www.fsbpt.org/Secondary-Pages/Exam-Candidates/National-Exam-NPTE/Dates-and-Deadlines |
| Registration lead time | Register 8–10 weeks before test date; jurisdiction (state board) approval is a separate, board-controlled step with its own deadline (~4–5 weeks out) | https://www.fsbpt.org/Free-Resources/NPTE-Candidate-Handbook/Exam-Registration-and-Scheduling |
| Score release | ~5 business days after exam | https://www.fsbpt.org/Secondary-Pages/Exam-Candidates/National-Exam-NPTE/After-Exam |
| Retake limits | 6 lifetime attempts; max 3 per 12 months; two scores below 400 = permanent ineligibility; states may be stricter | https://www.fsbpt.org/Secondary-Pages/Exam-Candidates/National-Exam-NPTE/Retake-Exam/Important-Retake-Information |
| Score transfer | $90 per receiving jurisdiction (+1.6% card fee); ~2 business days processing | https://www.fsbpt.org/Secondary-Pages/Licensees/Getting-Licensed/Score-Transfer-Service |
| Other FSBPT services | ELDD (exam/license/discipline database used by boards); aPTitude (free CE tracking); Coursework Tools (CWT) for foreign-educated equivalency; Jurisdiction Licensure Reference Guide | https://www.fsbpt.org/Free-Resources |

### 15.2 PT Compact

| Fact | Value | Source |
|------|-------|--------|
| Mechanism | Home-state license in an active member state → purchase per-state "compact privilege" for remote member states; issuance typically within minutes; privilege expires with home-state license | https://ptcompact.org/process-and-requirements/ |
| Membership (as reported 2026-04-29) | 37 jurisdictions active (incl. DC) **[verify roster — Nevada inferred as 37th]**; enacted-not-active: CT, ME, RI; introduced: IL, MA, MI; no legislation: CA, FL, HI, ID, MN, NM, NY, PR, USVI, WY | https://ptcompact.org/compact-map/ |
| Fees | $45 Commission fee + remote-state fee $0–$300 per privilege (e.g., AZ/SC $45 total; TX +$50; WA +$45+$2; MS $195 total) | https://ptcompact.org/Compact-Privilege-Fee-Jurisprudence-and-Waiver-Table |
| Jurisprudence for privileges | Some remote states require their jurisprudence exam before privilege issuance (e.g., AZ AZLAW, WA, TX JAM) | https://ptcompact.org/process-and-requirements/ |
| Eligibility | Home-state residency (driver's license as proof; military exceptions); no license encumbrance; no discipline within prior 2 years | https://ptcompact.org/am-i-eligible/ |
| Strategic significance | Privilege = minutes and ~$45–$345 vs. endorsement = 2–12+ weeks and ~$200–$500 — the core path-comparison the product automates (FR-11) | synthesis of above + §15.4 |

### 15.3 State examples (deep-dive: CA, TX, FL, NY)

| | California | Texas | Florida | New York |
|---|---|---|---|---|
| Board | PT Board of California (DCA) — ptbc.ca.gov | TX Board of PT Examiners (ECPTOTE) — ptot.texas.gov | FL Board of Physical Therapy (DOH) — floridasphysicaltherapy.gov | NYSED Office of the Professions — op.nysed.gov |
| Initial fees | $300 application + $150 initial license **[verify split]** | ~$190 application **[verify — 22 TAC §651.2]** | $180 ($100 app + $75 license + $5) | $294 license + first registration; $70 limited permit |
| Jurisprudence | CAL-JAM: online, 50 Q / 90 min, $50, 80% pass (since Jul 2024) | TX JAM: online open-book, 75 Q / 140 min, free initial / $48 renewal | FL Laws & Rules Exam: $65 (FSBPT-administered) | None |
| Background check | DOJ/FBI: Live Scan in-state; $49 hard card out-of-state | IdentoGO fingerprints, $38.25 | Level 2 screening required since Jul 2025 (~$50–$90; $43.25 FDLE retention/renewal) | None published **[verify negative finding]** |
| Endorsement | Same fees + CAL-JAM + all-state license verification | Online app + fingerprints + TX JAM + score transfer; temp license available | Endorsement (no reciprocity) + Laws & Rules exam; MOBILE Act path since Jul 2024 (fee ≤ $175) | Form 1 + $294 + Form 3 per prior state + Form 4 |
| Processing time | 30 days to acknowledge + up to 45 days to issue (~6–11 wks in practice) | **1–4 days** once complete; may practice on online verification | 15-day initial review commitment | Not published; reputed slow |
| CE / renewal | 30 hrs / 2 yrs (incl. 4 hrs BLS, 2 hrs ethics/laws) | 30 CCUs / 2 yrs (incl. TX JAM + human-trafficking course); renewal ~$248 **[verify]** | 24 hrs / 2-yr biennium (incl. 2 hrs medical errors) | 36 hrs / 3 yrs; $224 triennial registration |
| PT Compact | Not a member | Active member since Jan 2019 (privilege +$50) | Not a member (MOBILE Act as alternative) | Not a member |

Sources: ptbc.ca.gov (fees, CAL-JAM, endorsement, processing, CE pages); ptot.texas.gov (apply-by-exam/endorsement, pt-jam, compact, processing FAQ); floridasphysicaltherapy.gov (application PDF, laws-and-rules exam, licensing-renewals) + flhealthsource.gov (screening); op.nysed.gov (license-requirements, application forms, CE FAQs). All accessed/indexed 2026-07-03.

### 15.4 Cross-state variation (drives the data model)

- **Jurisprudence exams:** ~30 jurisdictions require one **[verify current count]**; formats range from FSBPT-run online JAM modules to state-run exams; fees $0–$65 (https://www.fsbpt.org/lrg; https://www.fsbpt.org/Our-Services/Jurisprudence-Assessment-Module-JAM-Services)
- **Initial state fees:** ~$100 (CO, IN) to $294 (NY) / $450 combined (CA) — plus the uniform $485 NPTE + Prometric fee (https://triagestaff.com/pt-pta-licensure-applications-fees-by-state/; board pages above)
- **Processing/wait times:** 1–4 days (TX) → 15-day review (FL) → ~6–11 weeks (CA) → unpublished (NY); national range ~1–8+ weeks; compact privileges near-instant (board pages above; https://trailsofatravelpt.com/licensing-time-frame/; https://www.coremedicalgroup.com/traveler-tools/resources/pt-licensure/)
- **Renewal cycles:** annual (WA, $100/yr) / biennial (CA, TX, FL) / triennial (NY); CE 20–36 hrs per cycle with state-mandated topics (BLS, ethics, medical errors, human trafficking, HIV/AIDS) varying by state
- **Supervised practice (mainly foreign-educated):** CA 9-month supervised clinical service; KY 3 months; LA provisional license (https://www.ptbc.ca.gov/applicants/foreign_pt/clinical.shtml; 201 KAR 22:070; https://www.laptboard.org/page/Initial-Examination-Foreign-Grad)
- **Recent-change evidence (why per-request validation matters):** CAL-JAM replaced the CA law exam Jul 2024; FL MOBILE Act endorsement path Jul 2024; FL Level 2 screening mandate Jul 2025; TX new licensing system Mar 2025 — four material changes in four researched states within ~24 months

### 15.5 Foreign-educated path

- Credential evaluation: FCCPT Type 1/Comprehensive review (also serves as the immigration Healthcare Worker Certificate); processing ≈ 23–25 weeks; fee ~$900–$1,000 **[verify current — last confirmed schedule $890 (2018)]** (https://www.fccpt.org/; https://www.fccpt.org/Requirements/How-to-Apply/Application-Fee-Schedule)
- Equivalency instrument: FSBPT Coursework Tool (CWT), version keyed to graduation year; some states designate additional evaluators (https://www.fsbpt.org/Free-Resources/Foreign-Educated-PTs-and-PT-Assistants)
- English proficiency: TOEFL iBT with state minimums (model rule: Writing 22 / Speaking 24 / Reading 22 / Listening 21); exemptions for US/UK/IE/AU/NZ/CA-except-Quebec degrees; scores valid 5 years at FCCPT (https://www.fsbpt.org/lrg/Home/EnglishLanguageRequirement; https://www.fccpt.org/Requirements/How-to-Apply/TOEFL-Requirements)
- Net effect vs. US-educated: roughly +6–12 months and +$1,200–$2,500 before state fees and NPTE (synthesized from components above)

### 15.6 Position-level requirements (beyond the license)

- **BLS/CPR:** near-universal employer requirement; AHA and Red Cross dominant (many systems AHA-only); 2-year validity; ~$34–36 AHA online portion + $45–$100 skills session (blended total commonly ~$120); obtainable same-day-to-days (https://cpr.heart.org/en/courses/basic-life-support-course-options; https://shopcpr.heart.org/courses/bls)
- **ABPTS specialist certifications** — 10 areas: Cardiovascular & Pulmonary (CCS), Clinical Electrophysiology (ECS), Geriatrics (GCS), Neurology (NCS), Oncology, Orthopaedics (OCS), Pediatrics (PCS), Sports (SCS), Pelvic & Women's Health (WCS), Wound Management. 2026 fees: application $535 member / $880 non-member; exam $810 / $1,535 (member total ≈ $1,345). Annual application cycle with fall/spring exam windows by specialty group; valid 10 years **[verify fees at build time]** (https://specialization.apta.org/become-a-specialist/fees-deadlines; https://www.apta.org/your-career/career-advancement/specialist-certification)
- **Home health:** driver's license + vehicle + auto insurance; current TB screening (skin test, IGRA, or chest X-ray); criminal background check + HHS-OIG LEIE exclusion screening (pre-hire and recurring, per Medicare participation rules); state fingerprint checks under the National Background Check Program in participating states (https://oig.hhs.gov/oei/reports/oei-07-14-00131.pdf)
- **School-based/pediatrics:** some states require a separate school credential on top of the PT license — e.g., WA ESA School Physical Therapist certificate; NJ School Physical Therapist Standard Certificate; PA requires child-abuse-recognition training for licensure + the PA clearance set (child abuse history, state police, FBI) for work with children (https://ospi.k12.wa.us/certification/...school-physical-therapist-first-time; https://www.nj.gov/education/certification/edsrvs/endorsementsedsrvs/2920S.shtml; https://www.pa.gov/agencies/dhs/resources/keep-kids-safe/child-abuse-clearances)
- **Billing/administrative:** NPI Type 1 — free, 1–10 business days online (https://nppes.cms.hhs.gov); Medicare enrollment (PECOS/CMS-855I) applies to PTs in private practice, ~60-day processing — facility-based PTs bill under the facility (https://medicare.fcso.com/enrollment/physical-therapist-pt-private-practice)
- **Cross-setting onboarding norms:** pre-employment drug screen; immunization set (Hep B series — OSHA-mandated employer offer, MMR, varicella, Tdap, annual flu) + TB + physical; professional liability insurance $1M/$3M typically $100–$400/yr (effectively required for private practice/contract/travel; usually employer-covered for employees) (https://www.osha.gov/publications/bbfact05; https://www.hpso.com/Insurance-for-you/Individual-Practitioners/Physical-Therapists)
- **Direct access:** all 50 states + DC + USVI have some form; APTA classifies 21 states unrestricted, 29 + DC + USVI provisional (limits/conditions) — affects scope and referral workflow in outpatient roles (https://www.apta.org/advocacy/issues/direct-access-advocacy/direct-access-by-state, per 2025 APTA report **[verify]**)
- **Requirement tiering confirmed by the evidence** (adopted in FR-12): (a) legally required to practice; (b) payer/regulator-required for the setting (NPI, PECOS, OIG screening, TB/immunizations per state law); (c) employer-required (BLS, drug screen, driver's license); (d) preferred/differentiator (ABPTS certs, liability insurance for employees)

### 15.7 Competitive landscape sources

- FSBPT Jurisdiction Licensure Reference Guide — quarterly board self-report; stale topic PDFs from 2010–2014 still circulating (https://www.fsbpt.org/Free-Resources/Regulatory-Resources/Licensure-Reference-Guide)
- PT Compact site — compact path only (https://ptcompact.org/)
- APTA licensure hub & direct-access PDFs — static, annual-or-worse snapshots; multiple dated versions live simultaneously (https://www.apta.org/your-practice/licensure)
- Staffing-agency/travel guides — TravelTherapyLicensure.com, CoreMedical (processing timeframes), Triage (fees by state), Trusted Health, Vivian, Trails of a Travel PT — readable but unverified, no position tailoring
- B2B credentialing platforms — Medallion, Verifiable, CertifyOS, MedTrainer — employer/payer-facing; none clinician-facing, none parses a posting into a requirements checklist
- **Gap confirmed:** no product does per-request-validated, position-specific, cost-and-timeline-complete reports for practitioners (§10.1)

### 15.8 Market context

- Licensed workforce (FSBPT 2025 census, data as of Dec 2024): **322,992 PTs and 134,457 PTAs** with ≥1 active US license — up from 238,256 / 111,317 in 2021 (https://www.fsbpt.org/Portals/0/documents/2025%20for%20FSBPT%20Census%20of%20Licensed%20PTs%20and%20PTAs%20in%20the%20USA.pdf)
- BLS projections 2024–2034: PT employment +11% (~13,200 openings/yr), median pay $101,020 (May 2024); PTA +16%, median $65,510 (https://www.bls.gov/ooh/healthcare/physical-therapists.htm)
- Allied healthcare staffing market ~$8.8B (2025) → ~$9.3B (2026), ~5.8% CAGR; ~60% of hospitals use temporary allied professionals (https://www.grandviewresearch.com/industry-analysis/healthcare-staffing-market; https://www.staffingindustry.com/editorial/healthcare-staffing-report/healthcare-staffing-to-stabilize-in-2025-see-modest-improvement-in-2026)

### 15.9 Research method caveats

- All facts verified via live web search on 2026-07-03. Direct automated fetches to fsbpt.org, ptcompact.org, apta.org, specialization.apta.org, and several state board domains were **blocked (HTTP 403) by bot protection** during research; those facts were extracted from search-indexed content of the cited primary pages plus current secondary corroboration. This finding is itself product-relevant and is reflected in §12 (fetch-infrastructure risk) and Open Question #1 (official data partnerships).
- Items marked **[verify]** must be re-confirmed against live primary sources during Phase 0 KB seeding before being served to users.
