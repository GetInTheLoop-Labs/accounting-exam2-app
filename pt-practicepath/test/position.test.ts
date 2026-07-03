import { describe, expect, it } from 'vitest';
import { positionLayer, normalizeStatedRequirement } from '../src/position/templates.js';
import { parsePositionText, NotAPtPositionError, type MessagesClient } from '../src/position/extract.js';

function stubClient(payload: unknown): MessagesClient {
  return {
    messages: {
      create: async () => ({
        stop_reason: 'end_turn',
        content: [{ type: 'text', text: JSON.stringify(payload) }],
      }),
    },
  };
}

const BASE_PARSE = {
  role: 'PT',
  state: 'tx',
  city: 'Austin',
  setting: 'home_health',
  specialty: null,
  employer: 'Example Home Health',
  statedRequirements: ['BLS', "driver's license", 'OCS preferred'],
  evidence: ['Home Health PT — Austin, TX', 'Current BLS required'],
};

describe('position layer (FR-12/FR-17)', () => {
  it('orders by authority: legal, payer, stated, norm', () => {
    const layer = positionLayer('home_health', ['bls'], []);
    const bases = layer.map((r) => r.basis);
    expect([...bases].sort((a, b) => bases.indexOf(a) - bases.indexOf(b))).toEqual(bases);
    expect(bases[0]).toBe('legal'); // enhanced background clearances lead
  });

  it('upgrades template entries the posting states to employer_stated', () => {
    const layer = positionLayer('home_health', ['bls'], []);
    expect(layer.find((r) => r.id === 'bls-cpr')?.basis).toBe('employer_stated');
    expect(layer.find((r) => r.id === 'drug-screen')?.basis).toBe('employer_norm');
  });

  it('marks requirements satisfied from held credentials (gap analysis)', () => {
    const layer = positionLayer('home_health', [], ['BLS', 'drivers-license']);
    expect(layer.find((r) => r.id === 'bls-cpr')?.status).toBe('satisfied');
    expect(layer.find((r) => r.id === 'drivers-license-vehicle')?.status).toBe('satisfied');
    expect(layer.find((r) => r.id === 'home-health-background')?.status).toBe('needed');
  });

  it('carries unmatched stated requirements through verbatim', () => {
    const layer = positionLayer('outpatient', ['ocs preferred'], []);
    const carried = layer.find((r) => r.id === 'ocs preferred');
    expect(carried?.basis).toBe('employer_stated');
    expect(carried?.note).toMatch(/not yet in the template library/);
  });

  it('stated-only postings work without a setting', () => {
    const layer = positionLayer(undefined, ['BLS'], []);
    expect(layer).toHaveLength(1);
    expect(layer[0]?.id).toBe('bls-cpr');
  });

  it('normalizes common stated phrasings', () => {
    expect(normalizeStatedRequirement('BLS/CPR')).toBe('bls-cpr');
    expect(normalizeStatedRequirement('Drug Screening')).toBe('drug-screen');
  });
});

describe('position parsing (Modes A/B plumbing)', () => {
  it('parses a posting into confirmed-required attributes', async () => {
    const parsed = await parsePositionText('...posting text...', stubClient(BASE_PARSE));
    expect(parsed).toMatchObject({
      role: 'PT',
      jurisdiction: 'tx',
      city: 'Austin',
      setting: 'home_health',
      needsConfirmation: true,
    });
    expect(parsed.statedRequirements).toContain('bls-cpr'); // normalized
    expect(parsed.evidence.length).toBeGreaterThan(0);
  });

  it('rejects non-PT positions (FR-6)', async () => {
    await expect(
      parsePositionText('...', stubClient({ ...BASE_PARSE, role: 'other' })),
    ).rejects.toThrow(NotAPtPositionError);
  });

  it('drops unrecognized state codes instead of guessing', async () => {
    const parsed = await parsePositionText('...', stubClient({ ...BASE_PARSE, state: 'zz' }));
    expect(parsed.jurisdiction).toBeUndefined();
  });
});
