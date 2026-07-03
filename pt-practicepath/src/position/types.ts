// Position intelligence types (Phase 2, FR-1/FR-2/FR-12/FR-17).

export type PracticeSetting =
  | 'outpatient'
  | 'acute_care'
  | 'snf'
  | 'home_health'
  | 'schools'
  | 'private_practice'
  | 'travel';

export interface ParsedPosition {
  role: 'PT' | 'PTA';
  /** Jurisdiction id (USPS code, lowercased), when the posting names one. */
  jurisdiction?: string;
  city?: string;
  setting?: PracticeSetting;
  specialty?: string;
  employer?: string;
  /** Requirements the posting states explicitly, normalized to template ids where possible. */
  statedRequirements: string[];
  /** Verbatim snippets supporting the extraction, for the confirmation UI. */
  evidence: string[];
  /** Always true — the user confirms the parse before a report generates (FR-4). */
  needsConfirmation: true;
}

/**
 * FR-12 tiers, from the PRD §15.6 research synthesis:
 *  legal          — required by law to practice in the setting
 *  payer          — required by payer/regulator for the setting (Medicare, OIG…)
 *  employer_stated— the posting itself states it
 *  employer_norm  — commonly required in this setting, not stated in the posting
 */
export type RequirementBasis = 'legal' | 'payer' | 'employer_stated' | 'employer_norm';

export interface PositionRequirement {
  id: string;
  name: string;
  basis: RequirementBasis;
  note: string;
  /** Typical issuer / where to obtain. */
  issuer: string;
  issuerUrl?: string;
  /** FR-17: satisfied when the profile lists a matching held credential. */
  status: 'needed' | 'satisfied';
}
