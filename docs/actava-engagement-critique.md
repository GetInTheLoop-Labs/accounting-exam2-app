# Critique: actAVA "AI Workforce Readiness & Implementation Engagement" Proposal + Cover Email

**Materials reviewed:**
1. Email from Tim Kiefer (Program + Product Delivery, Empactful Studios) to Jason, forwarding the proposal for thoughts
2. `ES_actAVA_Workforce_Readiness.pdf` — "Proposal: AI Workforce Readiness & Implementation Engagement," prepared by Empactful Studios, 13 content pages

**Purpose of this critique:** Fully vet both documents before the material is turned into a PRD for an application-based, repeatable delivery system owned by GITLAI and licensed and delivered by Empactful Studios.

**Date:** July 3, 2026
**Status:** For review by Jason / GITLAI

---

## 1. Executive Summary

**Verdict: strong skeleton, not yet vetted material.** The proposal contains a genuinely productizable consulting framework — the four-lens model (Vision, Economics, Culture, Activation), a phase/deliverable architecture with named artifacts, a 30/60-day tiered offering, a workflow-selection scoring rubric, a supervision taxonomy, and a clean three-party responsibility split. That structure maps naturally onto an application data model, which is exactly what a repeatable delivery system needs.

But the document cannot go into a PRD as-is. It has five categories of problems, in descending order of severity:

1. **IP ownership is entirely unaddressed — and the email's framing actively works against GITLAI.** Tim's email describes "a joint offering between actAVA & Empactful Studios." The intended commercial model is that GITLAI owns the delivery system and Empactful licenses and delivers it. Those two framings are incompatible, and if the methodology is co-developed with actAVA before ownership is papered, GITLAI's claim to it is compromised from day one. This must be settled before any PRD work begins.
2. **Internal contradictions** that a sophisticated buyer (or actAVA's lawyers) will catch — most notably a 30-day track that promises "measured results" from a Phase 4 that doesn't finish until day 60, and an "independence" claim inside a document that is explicitly co-proposed with the platform vendor.
3. **Deep vendor coupling** (actAVA, KORA|BLUE, CHRYSO are load-bearing on nearly every page) with no abstraction layer, which blocks the vendor-neutral variant Tim says he wants.
4. **Unverified third-party claims**: Empactful is effectively warranting actAVA platform capabilities (PHI redaction, citation provenance, SLAs) it has apparently never diligenced.
5. **Missing operational substance**: no staffing model, no effort model, no pricing logic, no risks/assumptions, no client-side effort estimate, no acceptance process — the parts that make an engagement *repeatable* rather than merely *describable*.

Section 5 lists the specific questions that must be answered — grouped by who owes the answer — before this is "fully vetted" and PRD work can begin. Section 6 sketches, briefly and non-bindingly, what the application this material implies would be.

---

## 2. Critique of the Email

The email is a two-paragraph forward, and its brevity hides several problems that matter commercially.

### 2.1 The "joint offering" framing conflicts with the intended ownership model

> "…ideally creating something repeatable that form a joint offering between actAVA & Empactful Studios."

This is the most consequential sentence in either document. A *joint offering* implies shared development, shared branding, and — absent contrary paperwork — shared or ambiguous IP. The stated intent for this material is the opposite: a delivery system **owned by GITLAI, licensed to and delivered by Empactful**. If Empactful builds the methodology in collaboration with actAVA under a "joint offering" banner, three bad things follow:

- actAVA acquires a plausible claim to the methodology (or at minimum, a veto over its reuse elsewhere).
- The vendor-neutral variant Tim wants becomes legally awkward: actAVA could reasonably object to "their" joint offering being repointed at competing platforms.
- GITLAI's licensing position to Empactful is undermined, because Empactful will have co-created the asset before GITLAI's ownership was established.

**Recommendation:** Before any client work or co-marketing, paper the chain: GITLAI owns the methodology, templates, instruments, and software; Empactful holds a delivery license; actAVA gets, at most, a co-marketing/referral arrangement for the actAVA-specific adapter. The proposal document itself should carry an IP notice.

### 2.2 The contracting structure is undefined

"actAVA has one near-term potential client and would like us to take on this work." This leaves the most basic commercial question open: **who is the client?**

- If actAVA subcontracts Empactful, actAVA controls the relationship, the pricing, and the paper — and Empactful's claimed independence (see §4.1) is fiction.
- If Empactful contracts directly with the prospect (which the proposal's "separately contracted" language on page 12 implies), then actAVA is a channel/referral partner and the referral economics need defining.
- Who carries delivery risk if the actAVA build slips? Who owns the client relationship afterward?

The email should have stated which structure is on the table, or at least flagged it as open.

### 2.3 Requirements are second- and third-hand

The framework "reflects a few conversations my colleague Nate has had with actAVA's CEO." So the requirements chain is: actAVA CEO → Nate → Tim → Jason — three hops from the source, and the actual end client (the "near-term potential client") has apparently never been spoken to. There is no named prospect, no timeline, no deal size, no statement of what actAVA's CEO actually committed to versus mused about. Before this becomes a PRD, someone needs first-hand confirmation of: the prospect's identity and readiness, actAVA's expected economics, and what "would like us to take on this work" means contractually.

### 2.4 The vendor-neutral ask is one sentence with no scoping

> "We'd also want to prepare for a similar engagement that is vendor neutral if actAVA isn't the platform being used or isn't the lead source."

This is the right instinct and arguably the more valuable long-term asset — but it gets one sentence, while the attachment is the *opposite* of vendor-neutral (see §4.2). Note also the two distinct scenarios buried in that sentence: (a) a different platform is used, and (b) actAVA isn't the *lead source*. Scenario (b) is a channel question, not a platform question, and has different implications (referral fees, who fronts the sale). The email conflates them.

### 2.5 No specific ask

"I wanted to send this over for your thoughts" — no decision requested, no deadline, no options framed. For a document that gates a near-term client opportunity, the email should have asked something answerable: e.g., "Can you review by X? The three things I need your read on are the commercial structure, the IP position, and whether this is productizable."

### 2.6 Minor

- Grammar: "creating something repeatable that form a joint offering" — missing word ("that *would* form" / "that form*s*").
- The email states the attachment "reflects" the Nate–actAVA conversations, but never says who authored the document or whether actAVA has seen this version — which matters because it makes representations on actAVA's behalf (see §4.3).

---

## 3. Critique of the Proposal — What's Genuinely Good

Credit where due; these elements are the reason this is worth productizing rather than rewriting from scratch.

1. **The four-lens framework (Vision, Economics, Culture, Activation)** — pages 2–3 — is a coherent, memorable organizing model, and the "engagement enters through activation" positioning is honest about how these deals actually start. The one-sentence summary ("Vision and economics set the direction. Culture decides whether it holds. Activation is where it becomes real.") is quotable and would survive productization intact.
2. **Clear division of labor.** The "What Empactful Studios does — and does not do" table (p. 5) and the three-party responsibilities table (p. 12) are the strongest pages in the document. "actAVA builds the agents; Empactful Studios builds the organization's ability to deploy, govern, and profit from them" is a crisp positioning line. The Prospect column (SME & data access, named reviewers, executive sponsor, licensing decision) shows awareness that clients are a delivery dependency.
3. **Phase architecture with named deliverables.** Four phases, each with objectives / activities / deliverables, with realistic *overlapping* day-ranges (1–10, 8–25, 18–40, 30–60) rather than naive sequential blocks. Every deliverable has a name (Workflow Specification, Governance Operating Model, Supervision Design Document, Business-Driver ROI Framework, etc.). This is precisely the structure an application can encode: **Engagement → Track → Phase → Activities → Deliverables**.
4. **Embedded instruments that beg to be software.** The workflow-selection rubric ("scoring 3–5 candidates on value, containment, data readiness, and reversibility," p. 8), the supervision placement taxonomy ("human-on-the-loop, human-in-the-loop, or human-as-the-decider," p. 9), the four safeguards ("hardcoded constraints, output verification, reversibility, and escalation paths," p. 8), and the readiness baseline are all half-built assessment tools. They are currently prose; in the delivery system they become structured, scored, reusable instruments — this is the core of the product.
5. **The 30/60-day tiering** (p. 11) is natural SKU structure: a base tier and an expanded tier with clearly incremental deliverables.
6. **Buyer disqualification.** "Organizations that will only move once the path is fully proven and risk-free are not ready for this work yet, and we would rather say so than sell a pilot that goes nowhere" (p. 3) — a real qualification filter, rare in proposals, and directly encodable as a readiness-gate in the application.
7. **Separate contracting of platform vs. implementation** (p. 12) is the right commercial hygiene, even though the independence claim built on it overreaches (§4.1).
8. **Success criteria and next steps exist** (pp. 12–13) — many proposals omit both. They need repair (see §4.6, §4.7) but the bones are there.

---

## 4. Critique of the Proposal — Weaknesses

### 4.1 Internal contradictions

**(a) The 30-day track promises results the phase plan cannot produce.**
The 30-day track column (p. 11) lists "ROI framework with **initial measured results**." But Phase 4 ("Prove the ROI") runs **days 30–60** (pp. 10–11), and the document elsewhere says the *60-day* track is the one with "the platform in production" (p. 7). On the 30-day track, nothing has been built, deployed, or measured by day 30 — the 30-day output is a workflow *readied* for actAVA to implement. "Measured results" in 30 days is a claim the delivery team cannot honor, and it's exactly the line a CFO will hold them to.

**(b) The phase plan doesn't compress onto the 30-day track.**
Phase 2 ends day 25, Phase 3 ends day 40, Phase 4 ends day 60 — so the 30-day track ends mid-Phase-3 with Phase 4 barely started. Nowhere does the document say which activities are cut, compressed, or resequenced on the 30-day track. For a repeatable system this is fatal ambiguity: the application will need two explicit phase templates (or one parameterized template), not one plan with a hand-waved shorter version.

**(c) The independence claim contradicts the document's own premise.**
"Empactful Studios is not selling the platform, so the workflow, governance, and ROI guidance is independent of the license decision" (p. 12) — inside a proposal that is "explicitly the engagement that runs alongside an actAVA platform purchase, not a substitute for it" (pp. 3–4), co-proposed with actAVA, with actAVA branding in the closing graphic (p. 13). Separately *contracted* is not the same as *independent*. A sophisticated buyer's procurement team will flag this in the first read. Either drop the independence claim, or restructure so it's true (e.g., a paid platform-selection phase that genuinely could conclude "not actAVA" — which the vendor-neutral variant would enable).

**(d) The engagement claims all four lenses but only staffs two.**
Page 3: "Empactful Studios does the work across all four" lenses. But the four workstreams (p. 6) and phases map almost entirely to Activation and Economics, with Culture appearing as training/change-management line items and Vision reduced to a single alignment workshop and a precondition check. Either scope the Vision and Culture work honestly (what are their deliverables?) or stop claiming full four-lens coverage.

### 4.2 Vendor coupling blocks the vendor-neutral variant

actAVA, KORA|BLUE, and CHRYSO are not mentioned in passing — they are **load-bearing**:

- Deliverables are defined as inputs to actAVA ("handed to actAVA as a build spec," p. 8; "platform-enforceable controls for actAVA to configure," p. 9).
- The governance workstream assumes CHRYSO specifically ("CHRYSO enforces controls," p. 6; "the control configuration actAVA implements in CHRYSO," p. 8).
- The ROI workstream assumes actAVA telemetry ("the telemetry actAVA's platform must surface," p. 10).
- The 60-day track includes "Full CHRYSO governance & compliance build-out" (p. 11).
- Even the closing graphic hard-codes "the full value of the actAVA platform" (p. 13).

To get the vendor-neutral variant, the methodology needs an abstraction layer: each phase should specify **platform capability requirements** (e.g., "policy-as-configuration control enforcement," "per-action audit telemetry," "confidence-threshold routing to human review") and each platform gets an **adapter** mapping those requirements to its actual features — actAVA/CHRYSO being adapter #1. That refactor is not cosmetic; it changes how every deliverable template is written, and it is precisely the structure the eventual application should encode (core + platform adapters + vertical overlays). Doing the actAVA version first *without* the abstraction means rewriting everything for client #2.

### 4.3 Empactful is warranting actAVA capabilities it hasn't verified

The "actAVA owns" column (p. 5) asserts, as fact, that actAVA provides: model routing, retrieval & evaluation tooling, **PHI redaction & citation provenance**, CHRYSO governance tooling & controls, and **platform hosting, security & SLAs**. In a healthcare deal, PHI redaction and security/SLA claims are not marketing copy — they are representations the client will rely on, in a HIPAA context, made in an Empactful-branded document. There is no evidence anyone at Empactful has diligenced these capabilities (the requirements chain is two conversations between Nate and actAVA's CEO). If the platform underdelivers, the client's recourse conversation starts with the document that promised it — this one.

**Recommendation:** Before this goes to any prospect: (a) run a capability diligence pass against actAVA (demo, security documentation, SOC 2 / HITRUST status, BAA willingness, actual CHRYSO control catalog); (b) reword the column as "actAVA's stated responsibilities" sourced to actAVA's own materials; (c) have actAVA formally approve the document. The diligence checklist itself becomes a reusable asset — it's the vendor-assessment instrument of the vendor-neutral variant.

### 4.4 Section 3 (AI Center of Excellence) is a bolt-on — and it smuggles in unscoped work

The AI CoE section (pp. 6–7) reads like encyclopedia boilerplate: generic definitions ("a dedicated, cross-functional team…"), generic functions, generic participant list, tonally distinct from the rest of the document, with no connection to the phases, deliverables, tracks, or pricing. It includes odd glosses ("model drift (degrading software accuracy)") and a role list (Data Scientists & ML Engineers "build and refine AI models") that contradicts the document's own premise that actAVA builds the agents.

Worse, Phase 2 quietly includes "**Establish the AI CoE** across Vision…, Economics…, Activation…, and Culture…" (p. 8) as one of three objectives in days 8–25. Standing up a cross-functional CoE — charter, governance, budget, operating model, use-case pipeline, training program — is an engagement in itself, not a bullet inside an 18-day phase that also has to produce the governance model and compliance map. Either:

- **Cut it** from the core engagement and offer "AI CoE stand-up" as a follow-on module (recommended — it's a natural expansion SKU and strengthens the scale story), or
- **Scope it honestly**: a *CoE charter draft* as a named Phase 2 deliverable, with the actual stand-up deferred.

As written it's scope creep that a delivery team will either silently drop (client disappointment) or attempt (blown timeline).

### 4.5 Vertical ambiguity: generic title, healthcare body

The title and opening are industry-generic ("prepares your organization to deploy and scale agentic AI"), but by page 2 the document pivots to "how can a **healthcare entity** be successful in an agentic future?" and never leaves: HIPAA, FHIR, PHI boundaries, CMS/ONC, clinicians, denied claims, missed measures, payer scrutiny, "operating-partner depth in healthcare finance and value-based care." That's fine if this is the healthcare proposal — but then the title and framing should say so. For the repeatable system, the decision must be explicit: a **vendor-neutral, industry-neutral core** with a **healthcare overlay** (regulatory mappings, PHI-specific guardrails, healthcare ROI frames) as the first vertical module. Conflating core and vertical in one undifferentiated document guarantees a painful unbundling later.

### 4.6 The ROI story has no baseline — so nothing can be "proven"

Phase 4 is named "Prove the ROI," and success criterion 3 promises "a board-ready ROI framework." But Phase 1's "Organizational Readiness Baseline" (p. 8) is a *gap assessment* (technical and organizational gaps to close), not a *performance baseline*. Nowhere does the plan capture the current-state cost, throughput, error/rework rates, or cycle time of the candidate workflow **before** the agent goes live. Without a pre-deployment measurement, "cost absorbed, throughput gained, and risk reduced" (p. 10) are estimates against reconstructed numbers — the exact thing CFOs discount.

Also unexplained: why "**three** quarterly outcome metrics" (pp. 10)? The number appears twice as if canonical, with no rationale. If it's a deliberate design choice (forcing focus), say so; if arbitrary, parameterize it.

**Fix:** Add a "Workflow Performance Baseline" activity/deliverable to Phase 1 (measured cost, volume, cycle time, error rate for the selected workflow). This is also a required feature of the application: baseline capture is what makes the ROI dashboard credible.

### 4.7 Missing sections a real (and repeatable) engagement needs

For a one-off proposal these are gaps; for a productized delivery system they are the product:

1. **Staffing & effort model.** Who delivers this? How many people, what roles (engagement lead, governance/compliance specialist, change lead?), how many hours per phase, what seniority? Repeatability *is* the effort model — without it, "fixed fee" is a guess and the delivery system has nothing to schedule.
2. **Pricing logic.** "Specific fees are set per prospect in the Statement of Work" (p. 12) is fine for deal #1, but the repeatable offering needs a pricing model: base fee per track, multipliers (regulated industry, second workflow, CoE module), and the margin math given the effort model.
3. **Assumptions & dependencies.** The plan silently assumes: actAVA builds on Empactful's schedule; the client grants data/SME access in days, not weeks; a workflow surviving scoring actually exists; compliance review doesn't veto the chosen workflow. Each is a schedule risk with no stated consequence.
4. **Risk register & remedies.** What happens when the actAVA build slips (Empactful's days 18–40 supervision work depends on it)? When the client's named reviewers aren't named? When Phase 2 uncovers a compliance blocker? A fixed-fee engagement with hard dependencies on two other parties and no slip/remedy language is a margin trap.
5. **Client-side effort estimate.** The Prospect column (p. 12) lists obligations but no hours. Underestimated client burden is the #1 killer of 30-day timelines; the proposal should state expected sponsor/SME/reviewer hours per week.
6. **Acceptance & sign-off process.** Empactful "owns… acceptance criteria & readiness sign-off" (p. 5), but no deliverable review/acceptance mechanics are defined — who approves, in what window, what happens on rejection. Fixed-fee + undefined acceptance = scope disputes.
7. **BAA / PHI posture for Empactful itself.** The engagement maps "PHI boundaries" (p. 8) and trains reviewers on agent output. If Empactful staff touch PHI in doing so, Empactful needs a BAA and its own handling posture. The document assigns HIPAA entirely to platform and client and is silent on Empactful's own exposure.
8. **IP ownership of deliverables and templates.** Nothing states who owns the Workflow Specification format, the scoring rubric, the Supervision Design template, the ROI model. Per §2.1, this is the load-bearing omission for GITLAI.
9. **Undefined terms used as if established.** "The four safeguards" (p. 8) are introduced with a definite article as if the reader knows them; the agentic-AI continuum (p. 8) and the hiring frame "actAVA uses" (p. 5) are referenced but never shown. Either include the models or cut the references.

### 4.8 Template & editorial hygiene

Individually minor; collectively they signal "draft," which undercuts a document whose pitch is *discipline*:

- Unfilled placeholders throughout: "Client Organization," "Sponsor: Name, Title," "Month DD, YYYY," and the header literally reads "**Replace with Client Organization name**" on every page.
- **Page 4 is a layout artifact**: a single orphaned sentence ("runs alongside an actAVA platform purchase, not a substitute for it.") on an otherwise blank page — likely a missing graphic or broken page break.
- The PDF container reports 18 pages while footers say "PAGE n OF 13" — stray blank/duplicate pages in the export.
- Success criterion 1: "A workflow specification actAVA can *be built* without ambiguity" (p. 12) — grammar; presumably "can build to" or "can build from."
- Inconsistent bullet glyphs (● vs •) between adjacent tables (p. 5); title-case inconsistencies ("engagement" lowercase in the page-2 heading).
- Success criterion 3 bundles two unrelated criteria (supervision model + ROI framework) into one item — they should be separate, testable criteria.
- The closing graphic (p. 13) hard-codes actAVA branding, so even the template's *artwork* needs a vendor-neutral variant.

---

## 5. Vetting Gate — Questions to Resolve Before the PRD

The material is "fully vetted" when these are answered. Grouped by owner.

### For Tim / Nate (Empactful)

1. **Contracting structure for engagement #1:** Does Empactful contract with the prospect directly, or subcontract to actAVA? Who carries delivery risk on the platform build? What does actAVA expect for sourcing the deal?
2. **Who authored this document, and has actAVA seen/approved it?** It makes representations on actAVA's behalf.
3. **Who is the near-term prospect** (industry confirmed as healthcare?), what's the expected deal size, and what's the real timeline?
4. **Staffing reality:** who at Empactful actually delivers the four phases, and what does capacity look like if this repeats?
5. **The 30-day track:** what is actually cut relative to the 60-day plan, and are you prepared to remove "measured results" from its promise?
6. **Scenario (b) from the email** — actAVA present but not the lead source: what does that engagement look like commercially?

### For actAVA

7. **Capability diligence:** demonstrable PHI redaction, citation provenance, CHRYSO control catalog, security posture (SOC 2 / HITRUST), BAA willingness, SLA terms. (Output: a completed vendor-assessment checklist — itself a reusable asset.)
8. **Build commitment:** will actAVA commit to build-timeline SLAs the Phase 3 schedule depends on?
9. **IP acknowledgment:** written acknowledgment that the readiness methodology, instruments, and templates are not actAVA's, notwithstanding co-marketing.

### For GITLAI (internal decisions)

10. **Paper the IP chain now:** GITLAI owns methodology + instruments + software; Empactful takes a delivery license (exclusivity? territory? term? royalty vs. per-engagement fee?); actAVA gets a co-marketing/adapter arrangement at most. This precedes any co-development with actAVA.
11. **Architecture decision:** vendor-neutral, industry-neutral **core**; **platform adapters** (actAVA first); **vertical overlays** (healthcare first). Confirm this is the productization shape before templates get written the coupled way.
12. **Product boundary:** is the delivery system (a) an internal tool for Empactful consultants, (b) a client-facing engagement portal, or (c) both with role-based views? This changes the PRD fundamentally.
13. **What GITLAI charges Empactful** — per-seat license, per-engagement fee, or revenue share — since that shapes multi-tenancy, entitlement, and metering requirements in the PRD.

---

## 6. Bridge to the PRD (Preview — Non-Binding)

For direction-validation only; the PRD follows once the Section 5 gate clears. What the proposal implies, once cleaned up, is an **engagement-delivery platform** that encodes the methodology as software:

- **Data model:** Engagement → Track (30/60, parameterized) → Phases → Activities → Deliverables, with status, owners, and dependencies — straight from the proposal's own architecture (pp. 7–11).
- **Guided instruments** (the heart of the product, converting the proposal's prose into structured, scored, reusable tools):
  - Readiness assessment (readiness baseline, incl. the buyer-disqualification gate from p. 3)
  - Workflow-selection scorer (value / containment / data readiness / reversibility rubric, weights explicit)
  - Workflow performance baseline capture (the missing instrument from §4.6)
  - Compliance & controls mapper (regulatory frameworks → platform-enforceable controls, per adapter)
  - Supervision designer (case types → on-the-loop / in-the-loop / as-decider placements, escalation thresholds)
  - ROI model builder + outcomes dashboard spec (baseline vs. live telemetry, metrics parameterized)
- **Document generation:** each named deliverable (Workflow Specification, Governance Operating Model, Supervision Design Document, ROI Framework, etc.) generated from instrument data into branded templates.
- **Platform adapter layer:** capability requirements in the core; actAVA/CHRYSO as adapter #1; the vendor-assessment checklist (§5 Q7) as the intake instrument for new adapters.
- **Vertical overlay layer:** healthcare (HIPAA/CMS/ONC mappings, PHI guardrails, healthcare ROI frames) as overlay #1.
- **Multi-tenancy & licensing:** engagements per client; Empactful operates under a GITLAI license with entitlement/metering matching whatever answer Q13 gets.

---

*Prepared for internal GITLAI review. Source page references are to the PDF's printed footer numbering ("PAGE n OF 13").*
