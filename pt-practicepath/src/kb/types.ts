// Knowledge-base entity types mirroring db/schema.sql (PRD §8.2).

export type RoleKind = 'PT' | 'PTA' | 'both';
export type LicensurePath = 'initial' | 'endorsement' | 'compact' | 'all';
export type RequirementCategory =
  | 'exam'
  | 'application'
  | 'background'
  | 'jurisprudence'
  | 'education'
  | 'clearance'
  | 'certification'
  | 'health'
  | 'administrative';
export type FactClass = 'fee' | 'wait_time' | 'rule' | 'url' | 'date';
export type VerificationMethod = 'live_fetch' | 'api' | 'manual';
export type IssuerKind =
  | 'state_board'
  | 'fsbpt'
  | 'compact_commission'
  | 'cert_body'
  | 'federal'
  | 'other';

/** Escalation ladder rung assigned per source (PRD §9.3.2). */
export type AccessRung =
  | 'A_official_data'
  | 'B_alternative_channel'
  | 'C_direct_fetch'
  | 'D_licensed_vendor'
  | 'E_human_verification'
  | 'unassessed';

export interface Issuer {
  id: string;
  name: string;
  kind: IssuerKind;
  url?: string;
  contact?: string;
}

export interface Jurisdiction {
  id: string; // USPS code, lowercased
  name: string;
  boardIssuerId: string;
  compactMember: boolean;
  compactActiveDate?: string; // ISO date; only when actively issuing/accepting
  notes?: string;
}

export interface ProcessStep {
  step: string;
  detail?: string;
  url?: string;
}

export interface Requirement {
  id: string;
  jurisdictionId?: string; // absent = national (e.g. NPTE)
  role: RoleKind;
  path: LicensurePath;
  category: RequirementCategory;
  name: string;
  description: string;
  issuerId: string;
  processSteps: ProcessStep[];
  dependsOn: string[];
  standardTimeline?: string;
  renewalCycle?: string;
}

export interface Fact {
  requirementId: string;
  factClass: FactClass;
  value: string;
  unit?: 'usd' | 'days' | 'weeks';
  sourceUrl: string;
  verifiedAt: string; // ISO timestamp
  verificationMethod: VerificationMethod;
  confidence: number; // 0..1
  evidenceSnapshot?: string;
}

export interface Source {
  id: string;
  issuerId: string;
  /** Absent until enumerated by the access census (PRD §9.3.1). */
  url?: string;
  description: string;
  factClasses: FactClass[];
  accessRung: AccessRung;
  notes?: string;
}
