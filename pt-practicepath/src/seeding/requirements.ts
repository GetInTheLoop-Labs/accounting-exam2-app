// Canonical requirement ids used during seeding, per jurisdiction.
//
// These are the KB `requirement.id` values facts attach to (PRD §8.2). The
// extractor is constrained to this list so it cannot invent requirement ids;
// the golden set uses the same scheme so the audit can join on
// (requirementId, factClass).

export const NATIONAL_REQUIREMENT_IDS = [
  'npte-registration',
  'npte-score-transfer',
  'compact-privilege-commission',
];

export function jurisdictionRequirementIds(jurisdiction: string): string[] {
  const j = jurisdiction.toLowerCase();
  return [
    `${j}-application-initial`,
    `${j}-application-endorsement`,
    `${j}-fingerprints`,
    `${j}-jurisprudence`,
    `${j}-license-issuance`,
    `${j}-ce-renewal`,
    `${j}-compact-privilege`,
    ...NATIONAL_REQUIREMENT_IDS,
  ];
}
