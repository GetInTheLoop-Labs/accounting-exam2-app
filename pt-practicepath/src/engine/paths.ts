// Licensure-path engine (FR-11): which paths can get this therapist
// practicing in the target jurisdiction, and what does each require?
//
// Deliberately data-light: viability derives only from structured,
// verified inputs — the therapist's profile and the registry's compact
// roster. Costs, timelines, and jurisdiction-specific extras (e.g. whether
// a jurisprudence exam exists) attach later from KB Facts; requirements
// whose existence varies by jurisdiction are emitted with
// applicability 'jurisdiction_dependent' rather than guessed.

import { JURISDICTIONS } from '../sources/registry.js';
import { jurisdictionRequirementIds } from '../seeding/requirements.js';
import type { Jurisdiction } from '../kb/types.js';

export type PathKind = 'initial' | 'endorsement' | 'compact';

export interface TherapistProfile {
  /** Jurisdiction ids where the therapist holds an active, unencumbered license. */
  licensedIn: string[];
  /** State of permanent residence (drives compact home-state eligibility). */
  homeState?: string;
  /** Any disciplinary action against any license within the prior 2 years. */
  disciplineWithin2Years?: boolean;
  /** Passed the NPTE already (true for any licensed therapist). */
  nptePassed?: boolean;
}

export interface PathRequirement {
  requirementId: string;
  applicability: 'always' | 'jurisdiction_dependent';
  note?: string;
}

export interface PathOption {
  kind: PathKind;
  viable: boolean;
  /** Present when not viable — the single blocking reason, user-readable. */
  blockedBecause?: string;
  requirements: PathRequirement[];
  notes: string[];
}

export class UnknownJurisdictionError extends Error {
  constructor(id: string) {
    super(`Unknown jurisdiction: ${id}`);
    this.name = 'UnknownJurisdictionError';
  }
}

function jurisdiction(id: string): Jurisdiction {
  const j = JURISDICTIONS.find((x) => x.id === id.toLowerCase());
  if (!j) throw new UnknownJurisdictionError(id);
  return j;
}

function compactActive(j: Jurisdiction): boolean {
  return j.compactMember && j.compactActiveDate !== undefined;
}

const JURISPRUDENCE_NOTE =
  'Roughly 30 jurisdictions require a jurisprudence/law exam; whether this one does comes from the KB at report time';

function initialPath(target: Jurisdiction, profile: TherapistProfile): PathOption {
  const ids = new Set(jurisdictionRequirementIds(target.id));
  const candidates: PathRequirement[] = [
    ...(profile.nptePassed
      ? []
      : [{ requirementId: 'npte-registration', applicability: 'always' } satisfies PathRequirement]),
    { requirementId: `${target.id}-application-initial`, applicability: 'always' },
    {
      requirementId: `${target.id}-fingerprints`,
      applicability: 'jurisdiction_dependent',
      note: 'Most states require fingerprint-based background checks; mechanics and cost vary',
    },
    {
      requirementId: `${target.id}-jurisprudence`,
      applicability: 'jurisdiction_dependent',
      note: JURISPRUDENCE_NOTE,
    },
  ];
  const requirements = candidates.filter(
    (r) => r.requirementId === 'npte-registration' || ids.has(r.requirementId),
  );
  return {
    kind: 'initial',
    viable: true,
    requirements,
    notes: profile.nptePassed
      ? ['NPTE already passed — score transfer may replace re-examination; endorsement is usually the better path']
      : ['NPTE is offered on fixed quarterly dates; register 8–10 weeks ahead and secure jurisdiction approval'],
  };
}

function endorsementPath(target: Jurisdiction, profile: TherapistProfile): PathOption {
  if (profile.licensedIn.length === 0) {
    return {
      kind: 'endorsement',
      viable: false,
      blockedBecause: 'Endorsement requires an existing license in another jurisdiction',
      requirements: [],
      notes: [],
    };
  }
  return {
    kind: 'endorsement',
    viable: true,
    requirements: [
      { requirementId: `${target.id}-application-endorsement`, applicability: 'always' },
      {
        requirementId: 'npte-score-transfer',
        applicability: 'always',
        note: 'FSBPT score transfer to the target jurisdiction ($90 class of fact; verified at report time)',
      },
      {
        requirementId: `${target.id}-fingerprints`,
        applicability: 'jurisdiction_dependent',
        note: 'Most states require fingerprint-based background checks; mechanics and cost vary',
      },
      {
        requirementId: `${target.id}-jurisprudence`,
        applicability: 'jurisdiction_dependent',
        note: JURISPRUDENCE_NOTE,
      },
    ],
    notes: ['Requires verification of every license ever held, sent directly between boards'],
  };
}

function compactPath(target: Jurisdiction, profile: TherapistProfile): PathOption {
  const blocked = (why: string): PathOption => ({
    kind: 'compact',
    viable: false,
    blockedBecause: why,
    requirements: [],
    notes: [],
  });

  if (!compactActive(target)) {
    return blocked(
      target.compactMember
        ? `${target.name} has enacted the PT Compact but is not yet issuing/accepting privileges`
        : `${target.name} is not a PT Compact member`,
    );
  }
  if (profile.licensedIn.length === 0) {
    return blocked('Compact privileges require an active home-state license');
  }
  if (!profile.homeState) {
    return blocked('Home state (state of permanent residence) unknown — required for compact eligibility');
  }
  const home = jurisdiction(profile.homeState);
  if (!profile.licensedIn.map((s) => s.toLowerCase()).includes(home.id)) {
    return blocked(`Compact requires a license in the home state (${home.name})`);
  }
  if (!compactActive(home)) {
    return blocked(`Home state ${home.name} is not an active PT Compact member`);
  }
  if (profile.disciplineWithin2Years) {
    return blocked('Disciplinary action within the prior 2 years bars compact privileges');
  }
  return {
    kind: 'compact',
    viable: true,
    requirements: [
      {
        requirementId: 'compact-privilege-commission',
        applicability: 'always',
        note: '$45 Commission fee class of fact; verified at report time',
      },
      { requirementId: `${target.id}-compact-privilege`, applicability: 'always', note: 'Remote-state fee, $0–$300' },
      {
        requirementId: `${target.id}-jurisprudence`,
        applicability: 'jurisdiction_dependent',
        note: 'Some remote states require their jurisprudence exam before a privilege issues (e.g. AZ, WA, TX)',
      },
    ],
    notes: ['Privileges typically issue within minutes; the privilege expires with the home-state license'],
  };
}

/**
 * All three paths for a target jurisdiction, viability-annotated.
 * Order is fastest-first among viable paths: compact, endorsement, initial.
 */
export function evaluatePaths(targetId: string, profile: TherapistProfile): PathOption[] {
  const target = jurisdiction(targetId);
  if (profile.licensedIn.map((s) => s.toLowerCase()).includes(target.id)) {
    throw new Error(`Already licensed in ${target.name} — no new path required`);
  }
  const options = [compactPath(target, profile), endorsementPath(target, profile), initialPath(target, profile)];
  return [...options.filter((o) => o.viable), ...options.filter((o) => !o.viable)];
}

/** The recommended (first viable, fastest) path. */
export function recommendPath(targetId: string, profile: TherapistProfile): PathOption {
  const viable = evaluatePaths(targetId, profile).filter((o) => o.viable);
  // initialPath is always viable, so this cannot be empty.
  return viable[0]!;
}
