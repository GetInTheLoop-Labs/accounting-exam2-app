import { describe, expect, it } from 'vitest';
import {
  evaluatePaths,
  recommendPath,
  UnknownJurisdictionError,
  type TherapistProfile,
} from '../src/engine/paths.js';

const NEW_GRAD: TherapistProfile = { licensedIn: [], nptePassed: false };
const TX_LICENSED: TherapistProfile = {
  licensedIn: ['tx'],
  homeState: 'tx',
  nptePassed: true,
  disciplineWithin2Years: false,
};

describe('path engine (FR-11)', () => {
  it('new grad: only initial licensure is viable', () => {
    const paths = evaluatePaths('tx', NEW_GRAD);
    expect(paths.filter((p) => p.viable).map((p) => p.kind)).toEqual(['initial']);
    const initial = paths.find((p) => p.kind === 'initial')!;
    expect(initial.requirements.map((r) => r.requirementId)).toContain('npte-registration');
    expect(paths.find((p) => p.kind === 'compact')?.blockedBecause).toMatch(/home-state license/);
  });

  it('TX-licensed resident targeting an active compact state: compact recommended, endorsement viable', () => {
    const paths = evaluatePaths('wa', TX_LICENSED);
    expect(paths.filter((p) => p.viable).map((p) => p.kind)).toEqual([
      'compact',
      'endorsement',
      'initial',
    ]);
    expect(recommendPath('wa', TX_LICENSED).kind).toBe('compact');
    const compact = paths[0]!;
    expect(compact.requirements.map((r) => r.requirementId)).toEqual([
      'compact-privilege-commission',
      'wa-compact-privilege',
      'wa-jurisprudence',
    ]);
  });

  it('targeting a non-member state (CA): compact blocked, endorsement recommended', () => {
    const paths = evaluatePaths('ca', TX_LICENSED);
    expect(recommendPath('ca', TX_LICENSED).kind).toBe('endorsement');
    expect(paths.find((p) => p.kind === 'compact')?.blockedBecause).toMatch(/not a PT Compact member/);
  });

  it('targeting an enacted-but-not-active state (CT): compact blocked with the right reason', () => {
    const compact = evaluatePaths('ct', TX_LICENSED).find((p) => p.kind === 'compact')!;
    expect(compact.viable).toBe(false);
    expect(compact.blockedBecause).toMatch(/not yet issuing/);
  });

  it('Nevada counts as active (issuing since 2026-01-20)', () => {
    expect(recommendPath('nv', TX_LICENSED).kind).toBe('compact');
  });

  it('home state not an active member blocks compact even when the target is active', () => {
    const nyResident: TherapistProfile = {
      licensedIn: ['ny'],
      homeState: 'ny',
      nptePassed: true,
    };
    const compact = evaluatePaths('tx', nyResident).find((p) => p.kind === 'compact')!;
    expect(compact.viable).toBe(false);
    expect(compact.blockedBecause).toMatch(/New York is not an active PT Compact member/);
    expect(recommendPath('tx', nyResident).kind).toBe('endorsement');
  });

  it('license held but not in the home state blocks compact', () => {
    const profile: TherapistProfile = { licensedIn: ['tx'], homeState: 'fl', nptePassed: true };
    const compact = evaluatePaths('wa', profile).find((p) => p.kind === 'compact')!;
    expect(compact.blockedBecause).toMatch(/license in the home state \(Florida\)/);
  });

  it('recent discipline blocks compact', () => {
    const compact = evaluatePaths('wa', { ...TX_LICENSED, disciplineWithin2Years: true }).find(
      (p) => p.kind === 'compact',
    )!;
    expect(compact.blockedBecause).toMatch(/Disciplinary action/);
  });

  it('licensed therapist skips NPTE registration on the initial path', () => {
    const initial = evaluatePaths('ca', TX_LICENSED).find((p) => p.kind === 'initial')!;
    expect(initial.requirements.map((r) => r.requirementId)).not.toContain('npte-registration');
  });

  it('rejects unknown jurisdictions and already-licensed targets', () => {
    expect(() => evaluatePaths('zz', TX_LICENSED)).toThrow(UnknownJurisdictionError);
    expect(() => evaluatePaths('tx', TX_LICENSED)).toThrow(/Already licensed/);
  });

  it('jurisdiction-dependent requirements are marked, never asserted', () => {
    for (const path of evaluatePaths('wa', TX_LICENSED).filter((p) => p.viable)) {
      for (const req of path.requirements) {
        if (req.requirementId.endsWith('-jurisprudence') || req.requirementId.endsWith('-fingerprints')) {
          expect(req.applicability).toBe('jurisdiction_dependent');
        }
      }
    }
  });
});
