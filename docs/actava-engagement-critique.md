# Critique v2: actAVA "AI Workforce Readiness & Implementation Engagement" Proposal + Cover Email

**Version:** 2 — revised under the four-point engagement frame supplied by Jason (replaces v1, preserved in git history at commit `6b1f8af`)

**Materials reviewed:**
1. Email from Tim Kiefer (Program + Product Delivery, Empactful Studios) to Jason, forwarding the proposal for thoughts
2. `ES_actAVA_Workforce_Readiness.pdf` — "Proposal: AI Workforce Readiness & Implementation Engagement," prepared by Empactful Studios, 13 content pages

**Date:** July 3, 2026
**Status:** For review by Jason / GITLAI

---

## 0. The Frame

This critique reads both documents against the actual situation, which is simpler than either document conveys:

1. **actAVA has a prospect.** Only this engagement requires actAVA products — the proposal's actAVA-specificity is by design, not a defect.
2. **actAVA wants Empactful as a forward-deployed assessment, transformation, and implementation consultant.** Empactful, in turn, wants **Jason Gilbreath as a contractor** working with them.
3. **Out of this engagement, Empactful wants to build a repeatable engagement platform** — and wants Jason's help developing it.
4. **Jason wants to deliver that repeatable engagement platform for Empactful from GITLAI.**

That is a four-link chain — **Prospect ← actAVA ← Empactful ← Jason/GITLAI** — carrying two distinct workstreams:

| Layer | What it is | Who delivers | What exists today |
|---|---|---|---|
| **Layer 1: The engagement** | The 30/60-day actAVA readiness & implementation engagement for actAVA's prospect | Empactful + Jason (contractor) | The proposal PDF (this is all it describes) |
| **Layer 2: The platform** | A repeatable engagement-delivery platform for Empactful | GITLAI, delivered to Empactful | Nothing yet — this critique feeds its PRD |

Keeping the layers separate resolves several v1 findings and sharpens the ones that matter. The engagement is allowed to be actAVA-shaped; the platform is not. The engagement's paper is between actAVA, Empactful, and the prospect; the platform's paper is between Empactful and GITLAI — and Jason personally sits at the joint between the two, which is where the real risk now lives (§5).

---

## 1. Executive Summary

**Verdict on the proposal: a good Layer-1 document with fixable delivery defects, wearing the wrong commercial costume.** The framework — four lenses, phase/deliverable architecture, 30/60-day tiers, scoring rubrics, supervision taxonomy — is solid and is precisely the raw material Layer 2 needs. The actAVA coupling, which v1 treated as a flaw, is correct for this engagement. What still needs fixing before the document goes to a prospect:

1. **The document's commercial story no longer matches reality.** It presents Empactful as an *independent implementation partner* ("not selling the platform… independent of the license decision," separately contracted with a "clean division"). Under the actual frame, Empactful is actAVA's **forward-deployed consultant** — engaged by, aligned with, and channel to actAVA. That's a legitimate and common model, but it is a different pitch. Shipping the current text misrepresents the relationship to the prospect (§4.1).
2. **Delivery-plan defects survive the reframe untouched**: the 30-day track promises "measured results" its own phase plan cannot produce; phase compression for the 30-day track is unspecified; the AI CoE section smuggles an engagement's worth of work into one bullet; there is no performance baseline, so ROI cannot be "proven"; and there is no staffing, pricing, risk, client-effort, or acceptance content (§4.2–4.7).
3. **The central risk has moved from the documents to the paperwork around Jason.** If Jason signs a standard personal contractor agreement with Empactful to deliver Layer 1, its IP-assignment language will likely capture everything he creates — including the platform thinking that is supposed to become GITLAI's Layer-2 product. And frame points 3 and 4 quietly disagree about who owns Layer 2 at all: Empactful expects to "build a repeatable engagement platform… with Jason's help"; Jason expects GITLAI to build and deliver it. That must be settled *before* the engagement starts, because the engagement is where the platform's IP will be born (§5).
4. **Engagement #1 should be run deliberately as Layer 2's R&D** — every deliverable produced by hand is a platform requirement in disguise, and capturing them systematically is what makes the platform buildable afterward (§6).

Section 7 is the vetting gate — the questions to close, organized by relationship link. Section 8 previews the platform the material implies.

---

## 2. Critique of the Email

The email's core problem is that it communicates the frame badly — the four points above are what it should have said, and none of them are stated plainly.

1. **The relationship structure is implied, not stated.** "actAVA… would like us to take on this work" hints at the forward-deployed arrangement but never says who contracts with whom, who faces the prospect, or what actAVA expects economically. Anyone reading cold (as v1 of this critique did) reasonably concludes the structure is undecided.
2. **"Joint offering" is loose language for a specific thing.** Under the frame, what's meant is: Empactful becomes actAVA's repeatable implementation channel. That's a channel/services relationship, not a jointly-owned product. The words "joint offering" invite exactly the co-ownership ambiguity that will later complicate both the methodology and the platform built from it. Precision here is cheap now and expensive later.
3. **Two different futures are packed into the vendor-neutral sentence.** "If actAVA isn't the platform being used or isn't the lead source" is (a) a different-platform scenario and (b) a different-channel scenario. For Layer 1 they're similar; for Layer 2 they're the argument for a vendor-neutral core with platform adapters (§8) — worth separating because (b) can happen even when the platform *is* actAVA.
4. **Requirements are third-hand.** actAVA CEO → Nate → Tim → Jason, with the actual prospect never yet in the room. Fine for a first read; not fine as the basis for a PRD. First-hand confirmation of the prospect, timeline, and actAVA's expectations belongs at the top of the gate (§7.1).
5. **No specific ask.** "Send this over for your thoughts" — no decision requested, no deadline. Given the frame, the concrete asks are: (a) will Jason contract for Layer-1 delivery, (b) will Jason/GITLAI take on Layer 2, and (c) on what terms. The email should have posed them.
6. **Minor:** grammar — "creating something repeatable that form a joint offering" (missing word). The email also doesn't say who authored the PDF or whether actAVA has approved it, which matters because the PDF makes representations on actAVA's behalf (§4.8).

---

## 3. Critique of the Proposal — What's Genuinely Good

Unchanged in substance from v1, but under the new frame this list does double duty: it is the **feature inventory for Layer 2**.

1. **The four-lens framework (Vision, Economics, Culture, Activation)** — pp. 2–3 — coherent, memorable, and honest about entering through Activation. Survives productization intact.
2. **Clear division of labor.** The "does — and does not do" table (p. 5) and three-party responsibilities table (p. 12) are the strongest pages. "actAVA builds the agents; Empactful Studios builds the organization's ability to deploy, govern, and profit from them" is a crisp positioning line, and it's *more* accurate under the forward-deployed frame, not less.
3. **Phase architecture with named deliverables** — four phases with objectives/activities/deliverables and realistic overlapping day-ranges (1–10, 8–25, 18–40, 30–60). This is the platform's data model: **Engagement → Track → Phase → Activities → Deliverables**.
4. **Embedded instruments that beg to be software**: the workflow-selection rubric (value / containment / data readiness / reversibility, p. 8), the supervision taxonomy (human-on-the-loop / in-the-loop / as-decider, p. 9), the four safeguards (p. 8), the readiness baseline. Currently prose; in Layer 2 they become structured, scored, reusable instruments — the core of the product.
5. **The 30/60-day tiering** (p. 11) is natural SKU structure.
6. **Buyer disqualification** (p. 3) — "we would rather say so than sell a pilot that goes nowhere" — a real qualification filter, directly encodable as a readiness gate.
7. **Success criteria and next steps exist** (pp. 12–13); they need repair (§4.5, §4.9) but the bones are there.

---

## 4. Critique of the Proposal — What Needs Fixing (Layer 1)

### 4.1 The commercial story contradicts the actual relationship

This replaces v1's "independence contradiction" finding, and the reframe makes it *worse*, not better.

- P. 12: "Empactful Studios is **not selling the platform**, so the workflow, governance, and ROI guidance is **independent of the license decision**."
- P. 12: "The two are co-proposed but **separately contracted**, so the prospect sees a clean division…"
- Pp. 3–4: the engagement "runs alongside an actAVA platform purchase, not a substitute for it."

Under the frame, Empactful is actAVA's forward-deployed consultant on a deal actAVA sourced, positioned to make the actAVA sale succeed. Every incentive points toward the license decision going one way. Claiming independence in that posture is the kind of representation that surfaces badly in procurement diligence — or later, if the deployment disappoints.

The fix is not to hide the relationship but to sell it straight: *"actAVA provides the platform; Empactful is actAVA's implementation partner, engaged to make your deployment succeed."* Forward-deployed is a respected model (clients understand it from every major platform vendor's SI ecosystem). What must go: the independence claim. What must be decided before the document ships: who actually contracts with the prospect, and whose paper this proposal goes out on — the current text ("separately contracted") may or may not match what actAVA and Empactful agree (§7.1).

### 4.2 The 30-day track promises results the phase plan cannot produce

The 30-day track (p. 11) lists "ROI framework with **initial measured results**." Phase 4 ("Prove the ROI") runs **days 30–60** (p. 10), and the document itself says only the 60-day track has "the platform in production" (p. 7). On the 30-day track nothing has been deployed or measured by day 30 — the output is a workflow *readied* for actAVA to build. This is the line a CFO will hold the delivery team to. Cut "measured results" from the 30-day promise or restructure the track.

Related: Phase 2 ends day 25, Phase 3 ends day 40, Phase 4 ends day 60 — so the 30-day track terminates mid-Phase-3 with no statement of what gets cut, compressed, or resequenced. For Layer 2 this is fatal ambiguity: the platform needs two explicit phase templates (or one parameterized one), not one plan with a hand-waved shorter version.

### 4.3 Section 3 (AI Center of Excellence) is a bolt-on that smuggles in unscoped work

The AI CoE section (pp. 6–7) is generic boilerplate — tonally distinct, disconnected from phases/deliverables/pricing, with a role list ("Data Scientists & ML Engineers build and refine AI models") that contradicts the document's own premise that actAVA builds the agents. Then Phase 2 quietly includes "**Establish the AI CoE**" as one bullet in days 8–25 (p. 8). Standing up a cross-functional CoE is an engagement in itself. Recommendation: cut it from the core engagement and make "AI CoE stand-up" a follow-on module — a natural expansion SKU that strengthens the scale story. At minimum, downgrade the Phase 2 deliverable to a *CoE charter draft*.

### 4.4 No performance baseline — so nothing can be "proven"

Phase 4 is named "Prove the ROI," but Phase 1's "Organizational Readiness Baseline" (p. 8) is a *gap assessment*, not a *performance baseline*. Nowhere is the current-state cost, volume, cycle time, or error rate of the candidate workflow measured before the agent goes live — so "cost absorbed, throughput gained, risk reduced" (p. 10) are estimates against reconstructed numbers, the exact thing CFOs discount. Add a "Workflow Performance Baseline" deliverable to Phase 1. (Also: "**three** quarterly outcome metrics" appears twice as if canonical, with no rationale — deliberate design choice or arbitrary? Say which, or parameterize.)

### 4.5 Missing operational sections — the parts that make an engagement repeatable

For a one-off proposal these are gaps; for the engagement Layer 2 must encode, they are the product:

1. **Staffing & effort model** — who delivers, what roles, hours per phase. Repeatability *is* the effort model; without it "fixed fee" is a guess and the platform has nothing to schedule. This also directly affects Jason: his contractor scope is undefined until this exists.
2. **Pricing logic** — "fees set per prospect in the SOW" (p. 12) works for deal #1; the repeatable offering needs base-fee-per-track plus multipliers, and the margin math given the effort model.
3. **Assumptions & dependencies** — the plan silently assumes actAVA builds on Empactful's schedule and the client grants data/SME access in days. Each is a schedule risk with no stated consequence.
4. **Risk register & remedies** — what happens when the actAVA build slips (the days 18–40 supervision work depends on it), reviewers aren't named, or Phase 2 finds a compliance blocker. Fixed fee + hard dependencies on two other parties + no slip language = margin trap.
5. **Client-side effort estimate** — the Prospect column (p. 12) lists obligations but no hours. Underestimated client burden is the #1 killer of 30-day timelines.
6. **Acceptance & sign-off mechanics** — Empactful "owns… acceptance criteria & readiness sign-off" (p. 5) but no review windows, approvers, or rejection handling are defined. Fixed fee + undefined acceptance = scope disputes.
7. **BAA / PHI posture for Empactful (and Jason).** The engagement maps PHI boundaries and trains reviewers on agent output. If Empactful staff or its contractor touch PHI, they need BAA coverage and a handling posture. The document assigns HIPAA entirely to platform and client, and is silent on Empactful's own exposure — which now includes Jason personally.

### 4.6 Undefined terms used as if established

"The four safeguards" (p. 8) arrive with a definite article as if the reader knows them; the "agentic-AI continuum" (p. 8) and the hiring frame "actAVA uses" (p. 5) are referenced but never shown. Include the models or cut the references. (For Layer 2, each of these is a content asset that needs an authored, canonical version.)

### 4.7 Healthcare specificity should be explicit, not ambient

The title is industry-generic; the body pivots to healthcare by page 2 and never leaves (HIPAA, FHIR, PHI, CMS/ONC, clinicians, denied claims). For engagement #1 — presumably a healthcare prospect — fine, but say so in the title and framing. For Layer 2, this becomes the core-vs-overlay decision: industry-neutral engagement core, healthcare as the first vertical overlay (§8).

### 4.8 actAVA capability claims still need diligence — even as actAVA's partner

The "actAVA owns" column (p. 5) asserts PHI redaction, citation provenance, CHRYSO controls, and hosting/security/SLAs as fact. Under the forward-deployed frame this is *more natural* than v1 assumed — channel partners represent their vendor's capabilities all the time. But the representations are prospect-facing, in a HIPAA context, in an Empactful-branded document, based on a requirements chain of two conversations. Empactful (and Jason, whose work product sits underneath) still need: a capability diligence pass (demo, security docs, SOC 2/HITRUST status, BAA willingness, actual CHRYSO control catalog), actAVA's formal sign-off on the document, and rewording to "actAVA provides…" sourced to actAVA's own materials. The diligence checklist becomes a reusable Layer-2 instrument — it is the vendor-assessment intake for every future platform adapter.

### 4.9 Template & editorial hygiene

Individually minor; collectively they signal "draft" in a document whose pitch is *discipline*:

- Unfilled placeholders throughout ("Client Organization," "Sponsor: Name, Title," "Month DD, YYYY"); the running header literally reads "**Replace with Client Organization name**" on every page.
- **Page 4 is a layout artifact** — one orphaned sentence on an otherwise blank page (likely a missing graphic or broken page break).
- PDF container reports 18 pages; footers say "PAGE n OF 13" — stray pages in the export.
- Success criterion 1 grammar: "A workflow specification actAVA can *be built* without ambiguity" (p. 12).
- Success criterion 3 bundles two unrelated criteria (supervision model + ROI framework) — split them; criteria should be individually testable.
- Inconsistent bullet glyphs between adjacent tables (p. 5); heading case inconsistencies (p. 2).
- The closing graphic (p. 13) hard-codes actAVA branding — fine for this engagement; note that Layer 2's template library will need brand-parameterized artwork.

---

## 5. The Joint Between the Layers: Jason's Position (the central risk)

This is where the reframe concentrates the risk. Three findings, in order of urgency.

### 5.1 A personal contractor agreement can capture the platform IP before it exists

Frame point 2: Empactful wants **Jason personally** as a contractor for Layer-1 delivery. Standard contractor agreements assign to the client all IP created in connection with the engagement — and Layer 1 is precisely where the Layer-2 instruments, templates, and design thinking will be created. Signed carelessly, the Layer-1 paper hands Empactful (and possibly, up the chain, actAVA) ownership of everything GITLAI intends to build, before GITLAI writes a line of code.

**Recommendation — settle before day 1 of the engagement:**
- Contract through **GITLAI**, not personally, if at all possible; at minimum, negotiate an explicit IP carve-out reserving methodology-generalizations, tools, and platform work to GITLAI.
- **Two separate agreements**: (a) an engagement-delivery services agreement (Layer 1 — deliverables for the prospect belong to whoever the engagement paper says), and (b) a platform development & licensing agreement (Layer 2 — on the ownership model chosen in §5.2). Do not let one document govern both.

### 5.2 Frame points 3 and 4 quietly disagree about who owns Layer 2

- Point 3 (Empactful's view): Empactful "would like to **build** a repeatable engagement platform" and "would like **Jason's help** with its development" — Empactful builds and presumably owns; Jason assists.
- Point 4 (Jason's view): "Jason would like to **deliver** a repeatable engagement platform **for Empactful from GITLAI**" — GITLAI builds it as a product; Empactful is the customer.

These describe different companies five years out. The three honest models, which should be named explicitly in the Empactful conversation:

| Model | Who owns what | GITLAI's future |
|---|---|---|
| **Work-for-hire** | Empactful owns the platform outright; GITLAI is a paid development shop | One-time revenue; no product |
| **GITLAI product, licensed** | GITLAI owns the platform; Empactful licenses it (exclusivity, territory, term, fees TBD) | GITLAI has a product it can license to other consultancies |
| **Hybrid (engine/instance split)** | GITLAI owns the engine (workflow/instrument/doc-gen machinery); Empactful owns its branded instance, methodology content, and client data | Both sides keep what they're best at; the likely landing zone |

Jason's stated preference (from the original request: "owned by GITLAI and licensed and delivered by Empactful") is the second model, and the hybrid is its pragmatic variant. Empactful's phrasing suggests they may be assuming the first. **This is a conversation to have explicitly and early — before the engagement generates the IP the models divide differently.** Everything in the eventual PRD (multi-tenancy, entitlement, branding, content ownership, metering) depends on which model is chosen (§7.3).

### 5.3 IP hygiene up the chain: actAVA's potential claim

Empactful will be developing and refining the methodology *while forward-deployed for actAVA, on actAVA's deal, possibly under actAVA's paper*. Unless the actAVA↔Empactful agreement expressly reserves the methodology and derived tooling to Empactful (and, by flow-down, respects GITLAI's platform position), actAVA acquires a colorable claim to the very material Layer 2 is built from — and a practical veto over the vendor-neutral variant, since it would point "their" methodology at competitors. One clause fixes this now; litigation-adjacent awkwardness fixes it later.

---

## 6. Run Engagement #1 as Layer 2's R&D

The engagement is not just revenue — it is the requirements-gathering phase of the platform, and it should be run that way deliberately:

- **Instrument capture discipline:** every artifact produced by hand becomes a platform requirement. Keep a running capture log of: the workflow-scoring spreadsheet (criteria, weights, scales actually used), the readiness-baseline questionnaire, the guardrail/PHI-boundary mapping format, the control-to-regulation mapping table, the supervision placement matrix and threshold definitions, the ROI model structure (inputs, formulas, telemetry fields requested from actAVA), every deliverable template, and — just as valuable — every point where the documented process was abandoned or improvised.
- **Time tracking by phase and activity**, even roughly. This produces the effort model the proposal lacks (§4.5.1) and the platform's estimation engine.
- **Friction journal:** where did the client stall, where did actAVA's build block Empactful's schedule, which deliverable drafts required the most rework. These become the platform's checklists, dependencies, and alerts.
- **Telemetry wishlist:** every metric the ROI framework wants but actAVA's platform can't surface becomes both feedback to actAVA and a field in Layer 2's adapter specification.

This costs almost nothing during delivery and is the difference between "we did an engagement and now must reconstruct it" and "the PRD writes itself from the capture log."

---

## 7. Vetting Gate — Questions to Close, by Relationship Link

### 7.1 actAVA ↔ Empactful (Layer 1 commercial structure)

1. **Contract form:** Does actAVA engage Empactful (subcontract/forward-deployed services), or does Empactful contract with the prospect directly with actAVA as referrer? Whose paper does this proposal go out on? (The current "separately contracted" text presumes an answer nobody has confirmed.)
2. **Economics:** What does actAVA expect for sourcing the deal — margin on Empactful's fees, or nothing beyond the license sale? What are Empactful's rates to actAVA vs. to the prospect?
3. **Positioning:** Agree on the forward-deployed framing and remove the independence claim (§4.1) before the prospect sees the document.
4. **Build SLAs:** Will actAVA commit to build-timeline commitments the Phase 3 schedule (days 18–40) depends on?
5. **Methodology IP clause:** Express reservation of the methodology, instruments, and derived tooling to Empactful (with GITLAI's position respected by flow-down) — see §5.3.
6. **Capability diligence:** Complete the vendor-assessment pass (§4.8) and get actAVA's written sign-off on the document's representations.
7. **First-hand facts:** Who is the prospect, what is the timeline, has anyone from Empactful spoken to them directly?

### 7.2 Empactful ↔ Jason (the contractor agreement)

8. **Contracting entity:** Jason personally or through GITLAI? (Recommend GITLAI; see §5.1.)
9. **IP carve-out:** Explicit reservation of methodology generalizations, tools, and platform work product to GITLAI, regardless of contracting entity.
10. **Two agreements, not one:** engagement-delivery services (Layer 1) separate from platform development & licensing (Layer 2).
11. **Scope & compensation:** Jason's Layer-1 role (which phases, how many hours — blocked on the missing staffing model, §4.5.1) and compensation form (rate; and for Layer 2, fee vs. license revenue vs. hybrid).

### 7.3 Empactful ↔ GITLAI (Layer 2 — the platform)

12. **Ownership model decision:** work-for-hire vs. GITLAI-product-licensed vs. engine/instance hybrid (§5.2). Everything downstream in the PRD depends on this.
13. **If licensed or hybrid:** exclusivity (can GITLAI license the engine to other consultancies?), territory/field-of-use, term, and fee structure (per-seat, per-engagement, revenue share).
14. **Development funding:** Does Empactful fund development (milestones), does GITLAI build at its own cost against license revenue, or a mix?
15. **Roadmap control:** Who prioritizes features — Empactful as design partner with a voice, GITLAI as owner with the pen?
16. **Product boundary:** internal consultant tool, client-facing engagement portal, or both with role-based views? (Changes the PRD fundamentally.)

### 7.4 Engagement #1 as pilot (Layer 2 inputs)

17. **Adopt the instrument-capture plan (§6)** as an explicit, agreed part of how the engagement is run.
18. **Design-partner expectations:** Empactful acknowledges engagement #1 doubles as platform R&D; Jason's platform-related capture work is covered by the Layer-2 agreement (not silently absorbed into Layer-1 scope).

---

## 8. Bridge to the PRD (Preview — Non-Binding)

For direction-validation once the §7 gate clears. What the material implies, under the frame:

- **Primary user:** Empactful consultants delivering engagements like #1. (Whether clients get a portal view is gate question 16.)
- **Design partner:** engagement #1 — its capture log (§6) is the seed requirements set.
- **Data model:** Engagement → Track (parameterized 30/60) → Phases → Activities → Deliverables, with status, owners, dependencies — straight from the proposal's own architecture (pp. 7–11).
- **Guided instruments** (the heart of the product, from §3.4 plus the gaps this critique identified): readiness assessment with the buyer-disqualification gate; workflow-selection scorer with explicit weights; **workflow performance baseline capture** (§4.4's missing piece); compliance & controls mapper; supervision designer; ROI model builder + outcomes dashboard spec.
- **Document generation:** each named deliverable generated from instrument data into brand-parameterized templates.
- **Platform adapter layer:** capability requirements in the core; **actAVA/CHRYSO as adapter #1** (its specification largely falls out of engagement #1's telemetry wishlist); the vendor-assessment checklist (§4.8) as the intake instrument for future adapters. The vendor-neutral core is justified by Empactful's own future non-actAVA deals — the email's variant ask — not by any defect in engagement #1.
- **Vertical overlay layer:** healthcare (HIPAA/CMS/ONC mappings, PHI guardrails, healthcare ROI frames) as overlay #1.
- **Effort & estimation:** phase/activity effort model seeded from engagement #1's time tracking (§6).
- **Tenancy, entitlement, branding:** determined by the §7.3 ownership decision — deferred by design.

---

*Prepared for internal GITLAI review. Source page references are to the PDF's printed footer numbering ("PAGE n OF 13"). Version 1 of this critique, written before the four-point frame was supplied, is preserved in git history (commit `6b1f8af`).*
