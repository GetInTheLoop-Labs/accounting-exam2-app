// Source Registry seed (PRD §9.3.1).
//
// One entry per fact-bearing page the validation pipeline verifies against.
// URLs present here were confirmed during PRD research (2026-07-03, see PRD
// §15); entries without a URL are enumerated-but-not-yet-located — locating
// and probing them is the census's job. Board URLs for jurisdictions beyond
// the four researched states are deliberately left null rather than guessed:
// the census discovers and verifies them, we never seed unverified URLs.

import type { Issuer, Jurisdiction, Source } from '../kb/types.js';

export const NATIONAL_ISSUERS: Issuer[] = [
  { id: 'fsbpt', name: 'Federation of State Boards of Physical Therapy', kind: 'fsbpt', url: 'https://www.fsbpt.org' },
  { id: 'pt-compact', name: 'PT Compact Commission', kind: 'compact_commission', url: 'https://ptcompact.org' },
  { id: 'abpts', name: 'American Board of Physical Therapy Specialties (APTA Specialist Certification)', kind: 'cert_body', url: 'https://specialization.apta.org' },
  { id: 'aha', name: 'American Heart Association (BLS/CPR)', kind: 'cert_body', url: 'https://cpr.heart.org' },
  { id: 'fccpt', name: 'Foreign Credentialing Commission on Physical Therapy', kind: 'cert_body', url: 'https://www.fccpt.org' },
  { id: 'nppes', name: 'CMS National Plan & Provider Enumeration System (NPI)', kind: 'federal', url: 'https://nppes.cms.hhs.gov' },
  { id: 'apta', name: 'American Physical Therapy Association', kind: 'other', url: 'https://www.apta.org' },
];

/** Board issuers for the four states deep-dived during PRD research (§15.3). */
export const RESEARCHED_BOARD_ISSUERS: Issuer[] = [
  { id: 'board-ca', name: 'Physical Therapy Board of California', kind: 'state_board', url: 'https://www.ptbc.ca.gov' },
  { id: 'board-tx', name: 'Texas Board of Physical Therapy Examiners (ECPTOTE)', kind: 'state_board', url: 'https://ptot.texas.gov' },
  { id: 'board-fl', name: 'Florida Board of Physical Therapy', kind: 'state_board', url: 'https://floridasphysicaltherapy.gov' },
  { id: 'board-ny', name: 'NYSED Office of the Professions — State Board for Physical Therapy', kind: 'state_board', url: 'https://www.op.nysed.gov' },
];

const JURISDICTION_NAMES: Record<string, string> = {
  al: 'Alabama', ak: 'Alaska', az: 'Arizona', ar: 'Arkansas', ca: 'California',
  co: 'Colorado', ct: 'Connecticut', de: 'Delaware', dc: 'District of Columbia',
  fl: 'Florida', ga: 'Georgia', hi: 'Hawaii', id: 'Idaho', il: 'Illinois',
  in: 'Indiana', ia: 'Iowa', ks: 'Kansas', ky: 'Kentucky', la: 'Louisiana',
  me: 'Maine', md: 'Maryland', ma: 'Massachusetts', mi: 'Michigan',
  mn: 'Minnesota', ms: 'Mississippi', mo: 'Missouri', mt: 'Montana',
  ne: 'Nebraska', nv: 'Nevada', nh: 'New Hampshire', nj: 'New Jersey',
  nm: 'New Mexico', ny: 'New York', nc: 'North Carolina', nd: 'North Dakota',
  oh: 'Ohio', ok: 'Oklahoma', or: 'Oregon', pa: 'Pennsylvania',
  ri: 'Rhode Island', sc: 'South Carolina', sd: 'South Dakota',
  tn: 'Tennessee', tx: 'Texas', ut: 'Utah', vt: 'Vermont', va: 'Virginia',
  wa: 'Washington', wv: 'West Virginia', wi: 'Wisconsin', wy: 'Wyoming',
  pr: 'Puerto Rico', vi: 'U.S. Virgin Islands',
};

// PT Compact status as researched 2026-07-03 (PRD §15.2). Active roster had
// one unresolved member (Nevada inferred as the 37th) — marked [verify] in
// the PRD; the census re-confirms against ptcompact.org/compact-map/.
const COMPACT_ACTIVE = new Set([
  'al', 'ak', 'az', 'ar', 'co', 'de', 'dc', 'ga', 'in', 'ia', 'ks', 'ky',
  'la', 'md', 'ms', 'mo', 'mt', 'ne', 'nh', 'nj', 'nc', 'nd', 'oh', 'ok',
  'or', 'pa', 'sc', 'sd', 'tn', 'tx', 'ut', 'vt', 'va', 'wa', 'wv', 'wi',
]);
const COMPACT_ENACTED_NOT_ACTIVE = new Set(['ct', 'me', 'ri']);

export const JURISDICTIONS: Jurisdiction[] = Object.entries(JURISDICTION_NAMES).map(
  ([id, name]) => ({
    id,
    name,
    boardIssuerId: `board-${id}`,
    compactMember: COMPACT_ACTIVE.has(id) || COMPACT_ENACTED_NOT_ACTIVE.has(id),
    ...(COMPACT_ACTIVE.has(id) ? { compactActiveDate: '2026-04-29' } : {}), // as-of date of researched roster, not join date
    ...(id === 'nv' ? { notes: 'Possible 37th active compact member — unresolved in research, [verify] against compact map' } : {}),
  }),
);

/** Placeholder issuers for boards not yet located; census fills in name/url. */
export const UNLOCATED_BOARD_ISSUERS: Issuer[] = JURISDICTIONS.filter(
  (j) => !RESEARCHED_BOARD_ISSUERS.some((b) => b.id === j.boardIssuerId),
).map((j) => ({
  id: j.boardIssuerId,
  name: `${j.name} physical therapy licensing board (locate via census)`,
  kind: 'state_board' as const,
}));

export const ALL_ISSUERS: Issuer[] = [
  ...NATIONAL_ISSUERS,
  ...RESEARCHED_BOARD_ISSUERS,
  ...UNLOCATED_BOARD_ISSUERS,
];

/**
 * Fact-bearing pages confirmed during PRD research. The census probes every
 * entry with a URL and reports access posture; entries without URLs are the
 * enumeration backlog. Each jurisdiction ultimately needs at least: fee
 * schedule, application instructions (initial + endorsement), and processing
 * times (where published).
 */
export const SOURCES: Source[] = [
  // ── National ──────────────────────────────────────────────────────────
  { id: 'fsbpt-exam-fees', issuerId: 'fsbpt', url: 'https://www.fsbpt.org/Our-Services/Candidate-Services/Exam-Registration-Payment', description: 'NPTE registration fee', factClasses: ['fee'], accessRung: 'unassessed' },
  { id: 'fsbpt-exam-dates', issuerId: 'fsbpt', url: 'https://www.fsbpt.org/Secondary-Pages/Exam-Candidates/National-Exam-NPTE/Dates-and-Deadlines', description: 'NPTE fixed exam dates and registration deadlines', factClasses: ['date'], accessRung: 'unassessed' },
  { id: 'fsbpt-retake-rules', issuerId: 'fsbpt', url: 'https://www.fsbpt.org/Secondary-Pages/Exam-Candidates/National-Exam-NPTE/Retake-Exam/Important-Retake-Information', description: 'NPTE retake limits', factClasses: ['rule'], accessRung: 'unassessed' },
  { id: 'fsbpt-score-transfer', issuerId: 'fsbpt', url: 'https://www.fsbpt.org/Secondary-Pages/Licensees/Getting-Licensed/Score-Transfer-Service', description: 'Score transfer fee and processing time', factClasses: ['fee', 'wait_time'], accessRung: 'unassessed' },
  { id: 'fsbpt-lrg', issuerId: 'fsbpt', url: 'https://www.fsbpt.org/lrg', description: 'Jurisdiction Licensure Reference Guide (corroborating layer, quarterly self-report)', factClasses: ['rule'], accessRung: 'unassessed' },
  { id: 'compact-map', issuerId: 'pt-compact', url: 'https://ptcompact.org/compact-map/', description: 'Compact membership and active-status roster', factClasses: ['rule', 'date'], accessRung: 'unassessed' },
  { id: 'compact-fee-table', issuerId: 'pt-compact', url: 'https://ptcompact.org/Compact-Privilege-Fee-Jurisprudence-and-Waiver-Table', description: 'Per-state privilege fees and jurisprudence requirements', factClasses: ['fee', 'rule'], accessRung: 'unassessed' },
  { id: 'compact-eligibility', issuerId: 'pt-compact', url: 'https://ptcompact.org/process-and-requirements/', description: 'Privilege eligibility rules', factClasses: ['rule'], accessRung: 'unassessed' },
  { id: 'abpts-fees', issuerId: 'abpts', url: 'https://specialization.apta.org/become-a-specialist/fees-deadlines', description: 'Specialist certification fees and deadlines', factClasses: ['fee', 'date'], accessRung: 'unassessed' },
  { id: 'aha-bls-courses', issuerId: 'aha', url: 'https://cpr.heart.org/en/courses/basic-life-support-course-options', description: 'BLS course options and pricing entry point', factClasses: ['fee', 'rule'], accessRung: 'unassessed' },
  { id: 'fccpt-fees', issuerId: 'fccpt', url: 'https://www.fccpt.org/Requirements/How-to-Apply/Application-Fee-Schedule', description: 'Credential-evaluation fee schedule ([verify] — last confirmed 2018)', factClasses: ['fee'], accessRung: 'unassessed' },
  { id: 'nppes-npi', issuerId: 'nppes', url: 'https://nppes.cms.hhs.gov', description: 'NPI application (free; processing time)', factClasses: ['wait_time', 'rule'], accessRung: 'unassessed' },
  { id: 'apta-direct-access', issuerId: 'apta', url: 'https://www.apta.org/advocacy/issues/direct-access-advocacy/direct-access-by-state', description: 'Direct access classification by state (Tier-2 corroborating)', factClasses: ['rule'], accessRung: 'unassessed' },

  // ── California (PRD §15.3) ────────────────────────────────────────────
  { id: 'ca-fees', issuerId: 'board-ca', url: 'https://www.ptbc.ca.gov/applicants/new_grad/fees.shtml', description: 'Application + initial license fees ([verify] $300/$150 split)', factClasses: ['fee'], accessRung: 'unassessed' },
  { id: 'ca-caljam', issuerId: 'board-ca', url: 'https://www.ptbc.ca.gov/applicants/caljam.shtml', description: 'CAL-JAM jurisprudence exam: format, fee, pass bar', factClasses: ['fee', 'rule'], accessRung: 'unassessed' },
  { id: 'ca-processing', issuerId: 'board-ca', url: 'https://www.ptbc.ca.gov/applicants/index.shtml', description: 'Stated acknowledgement/issuance timelines', factClasses: ['wait_time'], accessRung: 'unassessed' },
  { id: 'ca-ce', issuerId: 'board-ca', url: 'https://www.ptbc.ca.gov/licensees/continuing_competency/', description: 'Continuing competency hours and mandated topics', factClasses: ['rule'], accessRung: 'unassessed' },

  // ── Texas (PRD §15.3) ─────────────────────────────────────────────────
  { id: 'tx-apply-exam', issuerId: 'board-tx', url: 'https://ptot.texas.gov/apply-by-exam/', description: 'Initial licensure by examination: process and fees ([verify] fee vs 22 TAC §651.2)', factClasses: ['fee', 'rule'], accessRung: 'unassessed' },
  { id: 'tx-apply-endorsement', issuerId: 'board-tx', url: 'https://ptot.texas.gov/apply-by-endorsement/', description: 'Endorsement process and fees', factClasses: ['fee', 'rule'], accessRung: 'unassessed' },
  { id: 'tx-jam', issuerId: 'board-tx', url: 'https://ptot.texas.gov/pt-jam/', description: 'TX JAM jurisprudence exam: format and fees', factClasses: ['fee', 'rule'], accessRung: 'unassessed' },
  { id: 'tx-processing', issuerId: 'board-tx', url: 'https://ptot.texas.gov/how-long-does-it-take-to-get-a-license/', description: 'Published processing time (1–4 days once complete)', factClasses: ['wait_time'], accessRung: 'unassessed' },
  { id: 'tx-compact', issuerId: 'board-tx', url: 'https://ptot.texas.gov/compact/', description: 'Texas compact participation and state privilege fee', factClasses: ['fee', 'rule'], accessRung: 'unassessed' },
  { id: 'tx-fee-schedule-tac', issuerId: 'board-tx', url: 'https://texreg.sos.state.tx.us/public/readtac$ext.TacPage?sl=R&app=9&pg=1&ti=22&pt=28&ch=651&rl=2', description: '22 TAC §651.2 official fee schedule — rung-B statutory channel for tx fees', factClasses: ['fee'], accessRung: 'unassessed' },

  // ── Florida (PRD §15.3) ───────────────────────────────────────────────
  { id: 'fl-application', issuerId: 'board-fl', url: 'https://floridasphysicaltherapy.gov/applications/application-pt.pdf', description: 'Initial application PDF incl. fee breakdown ($100+$75+$5)', factClasses: ['fee', 'rule'], accessRung: 'unassessed' },
  { id: 'fl-laws-rules-exam', issuerId: 'board-fl', url: 'https://floridasphysicaltherapy.gov/florida-ptpta-laws-and-rules-exam/', description: 'FL Laws & Rules exam fee and format', factClasses: ['fee', 'rule'], accessRung: 'unassessed' },
  { id: 'fl-processing', issuerId: 'board-fl', url: 'https://floridasphysicaltherapy.gov/licensing-renewals/', description: 'Stated review timelines', factClasses: ['wait_time'], accessRung: 'unassessed' },
  { id: 'fl-screening', issuerId: 'board-fl', url: 'https://flhealthsource.gov/background-screening/', description: 'Level 2 background screening (required since Jul 2025)', factClasses: ['fee', 'rule'], accessRung: 'unassessed' },

  // ── New York (PRD §15.3) ──────────────────────────────────────────────
  { id: 'ny-requirements', issuerId: 'board-ny', url: 'https://www.op.nysed.gov/professions/physical-therapists/license-requirements', description: 'License requirements and $294 fee; $70 limited permit', factClasses: ['fee', 'rule'], accessRung: 'unassessed' },
  { id: 'ny-forms', issuerId: 'board-ny', url: 'https://www.op.nysed.gov/professions/physical-therapists/license-application-forms', description: 'Application forms incl. endorsement Forms 3/4', factClasses: ['rule', 'url'], accessRung: 'unassessed' },
  { id: 'ny-ce', issuerId: 'board-ny', url: 'https://www.op.nysed.gov/professions/physical-therapists/continuing-education/faqs', description: 'CE: 36 hours per 3-year registration', factClasses: ['rule'], accessRung: 'unassessed' },
  { id: 'ny-processing', issuerId: 'board-ny', description: 'NYSED publishes no processing times (research finding, PRD §15.3) — wait time must be served as a labeled estimate; rung E until an official channel emerges', factClasses: ['wait_time'], accessRung: 'E_human_verification' },

  // ── Enumeration backlog: one fee-schedule + processing-time + application
  //    source per remaining jurisdiction, located by the census ───────────
  ...JURISDICTIONS.filter((j) => !['ca', 'tx', 'fl', 'ny'].includes(j.id)).flatMap(
    (j): Source[] => [
      { id: `${j.id}-fees`, issuerId: j.boardIssuerId, description: `${j.name} fee schedule (locate via census)`, factClasses: ['fee'], accessRung: 'unassessed' },
      { id: `${j.id}-application`, issuerId: j.boardIssuerId, description: `${j.name} application instructions, initial + endorsement (locate via census)`, factClasses: ['rule', 'url'], accessRung: 'unassessed' },
      { id: `${j.id}-processing`, issuerId: j.boardIssuerId, description: `${j.name} processing times, if published (locate via census)`, factClasses: ['wait_time'], accessRung: 'unassessed' },
    ],
  ),
];
