// Position requirement templates (FR-12), encoded from the PRD §15.6
// research (verified 2026-07-03). Every entry states its basis tier; costs
// and timelines attach from KB Facts at report time, same as licensure
// requirements — this table answers only "what applies in this setting and
// on what authority".

import type { PositionRequirement, PracticeSetting, RequirementBasis } from './types.js';

interface TemplateEntry {
  id: string;
  name: string;
  basis: Exclude<RequirementBasis, 'employer_stated'>;
  note: string;
  issuer: string;
  issuerUrl?: string;
  /** Profile credential ids that satisfy this requirement (FR-17). */
  satisfiedBy: string[];
}

const BLS: TemplateEntry = {
  id: 'bls-cpr',
  name: 'BLS/CPR certification',
  basis: 'employer_norm',
  note: 'Near-universal employer requirement; AHA and Red Cross dominant (many systems accept AHA only); 2-year validity; blended course completable within days',
  issuer: 'American Heart Association',
  issuerUrl: 'https://cpr.heart.org/en/courses/basic-life-support-course-options',
  satisfiedBy: ['bls', 'bls-cpr', 'cpr'],
};

const DRUG_SCREEN: TemplateEntry = {
  id: 'drug-screen',
  name: 'Pre-employment drug screening',
  basis: 'employer_norm',
  note: 'Standard in hospital, SNF, and home-health onboarding; commonly 10-panel',
  issuer: 'Employer-designated lab',
  satisfiedBy: [],
};

const IMMUNIZATIONS: TemplateEntry = {
  id: 'immunization-records',
  name: 'Immunization records + TB screening',
  basis: 'payer',
  note: 'Typical onboarding set: Hep B series (OSHA-mandated employer offer), MMR, varicella, Tdap, annual flu, TB test; state laws add facility-specific mandates',
  issuer: 'Occupational health / primary care',
  issuerUrl: 'https://www.osha.gov/publications/bbfact05',
  satisfiedBy: ['immunizations', 'tb-test'],
};

const NPI: TemplateEntry = {
  id: 'npi',
  name: 'NPI (Type 1)',
  basis: 'payer',
  note: 'Required for any PT who bills or appears on claims; free; online processing typically 1–10 business days',
  issuer: 'CMS NPPES',
  issuerUrl: 'https://nppes.cms.hhs.gov',
  satisfiedBy: ['npi'],
};

export const SETTING_TEMPLATES: Record<PracticeSetting, TemplateEntry[]> = {
  outpatient: [BLS, DRUG_SCREEN, IMMUNIZATIONS],
  acute_care: [BLS, DRUG_SCREEN, IMMUNIZATIONS],
  snf: [
    BLS,
    DRUG_SCREEN,
    IMMUNIZATIONS,
    {
      id: 'oig-exclusion-screening',
      name: 'HHS-OIG exclusion screening',
      basis: 'payer',
      note: 'Medicare/Medicaid participation requires screening against the OIG List of Excluded Individuals/Entities pre-hire and recurring; employer runs it, but exclusions block employment',
      issuer: 'HHS Office of Inspector General',
      issuerUrl: 'https://oig.hhs.gov',
      satisfiedBy: [],
    },
  ],
  home_health: [
    BLS,
    DRUG_SCREEN,
    IMMUNIZATIONS,
    {
      id: 'drivers-license-vehicle',
      name: "Driver's license, reliable vehicle, auto insurance",
      basis: 'employer_norm',
      note: 'Standard hard requirement — travel to patient homes',
      issuer: 'State DMV / insurer',
      satisfiedBy: ['drivers-license'],
    },
    {
      id: 'home-health-background',
      name: 'Enhanced background clearances',
      basis: 'legal',
      note: 'National Background Check Program states require fingerprint-based state+FBI checks for home-health employees; OIG exclusion screening applies per Medicare participation',
      issuer: 'State agency / FBI via employer',
      issuerUrl: 'https://oig.hhs.gov/oei/reports/oei-07-14-00131.pdf',
      satisfiedBy: [],
    },
  ],
  schools: [
    BLS,
    IMMUNIZATIONS,
    {
      id: 'school-credential',
      name: 'State school-personnel credential (where required)',
      basis: 'legal',
      note: 'Some states require a separate school certificate on top of the PT license (e.g. WA ESA School Physical Therapist; NJ School PT Standard Certificate) — jurisdiction-dependent, resolved from the KB',
      issuer: 'State education department',
      satisfiedBy: ['school-credential'],
    },
    {
      id: 'child-clearances',
      name: 'Child abuse / school clearances',
      basis: 'legal',
      note: 'States mandate clearance sets for work with children (e.g. PA: child abuse history + state police + FBI; PA also requires child-abuse-recognition training for licensure)',
      issuer: 'State agencies',
      satisfiedBy: [],
    },
  ],
  private_practice: [
    BLS,
    NPI,
    {
      id: 'medicare-enrollment',
      name: 'Medicare enrollment (PECOS / CMS-855I)',
      basis: 'payer',
      note: 'Applies to PTs in private practice (PTPP) — facility-based PTs bill under the facility; ~60-day processing; requires operational practice location',
      issuer: 'CMS via PECOS',
      issuerUrl: 'https://medicare.fcso.com/enrollment/physical-therapist-pt-private-practice',
      satisfiedBy: ['medicare-enrollment'],
    },
    {
      id: 'liability-insurance',
      name: 'Professional liability insurance',
      basis: 'employer_norm',
      note: 'Effectively required for private practice/contract work; typical $1M/$3M limits run ~$100–$400/yr',
      issuer: 'e.g. HPSO',
      issuerUrl: 'https://www.hpso.com/Insurance-for-you/Individual-Practitioners/Physical-Therapists',
      satisfiedBy: ['liability-insurance'],
    },
  ],
  travel: [
    BLS,
    DRUG_SCREEN,
    IMMUNIZATIONS,
    {
      id: 'credentialing-packet',
      name: 'Agency credentialing packet',
      basis: 'employer_norm',
      note: 'Background check, fingerprinting, transcripts, license verifications from every state held, employment verification — agencies require the full set per assignment',
      issuer: 'Staffing agency',
      satisfiedBy: [],
    },
    {
      id: 'liability-insurance',
      name: 'Professional liability insurance',
      basis: 'employer_norm',
      note: 'Commonly required for travel/contract roles when not agency-provided',
      issuer: 'e.g. HPSO',
      issuerUrl: 'https://www.hpso.com/Insurance-for-you/Individual-Practitioners/Physical-Therapists',
      satisfiedBy: ['liability-insurance'],
    },
  ],
};

/** Stated-requirement phrases → template ids (extends per learning). */
const STATED_ALIASES: Record<string, string> = {
  bls: 'bls-cpr',
  cpr: 'bls-cpr',
  'bls/cpr': 'bls-cpr',
  'drug screen': 'drug-screen',
  'drug screening': 'drug-screen',
  npi: 'npi',
  'liability insurance': 'liability-insurance',
  "driver's license": 'drivers-license-vehicle',
  'drivers license': 'drivers-license-vehicle',
};

export function normalizeStatedRequirement(stated: string): string {
  const key = stated.trim().toLowerCase();
  return STATED_ALIASES[key] ?? key;
}

/**
 * FR-12 + FR-17: assemble the position-specific layer for a setting.
 * Stated requirements upgrade a template entry's basis to employer_stated
 * (the posting asked for it explicitly); unmatched stated requirements are
 * carried through verbatim so nothing the employer asked for is dropped.
 * Held credentials from the profile mark entries satisfied.
 */
export function positionLayer(
  setting: PracticeSetting | undefined,
  statedRequirements: string[] = [],
  heldCredentials: string[] = [],
): PositionRequirement[] {
  const held = new Set(heldCredentials.map((c) => c.trim().toLowerCase()));
  const statedIds = new Set(statedRequirements.map(normalizeStatedRequirement));
  const out: PositionRequirement[] = [];
  const seen = new Set<string>();

  for (const entry of setting ? SETTING_TEMPLATES[setting] : []) {
    if (seen.has(entry.id)) continue;
    seen.add(entry.id);
    const stated = statedIds.has(entry.id);
    statedIds.delete(entry.id);
    out.push({
      id: entry.id,
      name: entry.name,
      basis: stated ? 'employer_stated' : entry.basis,
      note: entry.note,
      issuer: entry.issuer,
      ...(entry.issuerUrl ? { issuerUrl: entry.issuerUrl } : {}),
      status: entry.satisfiedBy.some((s) => held.has(s)) ? 'satisfied' : 'needed',
    });
  }

  // Employer-stated requirements with no template stay visible verbatim.
  for (const id of statedIds) {
    if (seen.has(id)) continue;
    out.push({
      id,
      name: id,
      basis: 'employer_stated',
      note: 'Stated in the posting; not yet in the template library — verify with the employer',
      issuer: 'Employer',
      status: held.has(id) ? 'satisfied' : 'needed',
    });
  }

  // Legal first, then payer, then stated, then norms — authority order.
  const rank: Record<RequirementBasis, number> = { legal: 0, payer: 1, employer_stated: 2, employer_norm: 3 };
  return out.sort((a, b) => rank[a.basis] - rank[b.basis]);
}
