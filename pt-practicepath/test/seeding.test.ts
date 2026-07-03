import { describe, expect, it } from 'vitest';
import { auditSeed, valuesMatch, type GoldenFile } from '../src/seeding/audit.js';
import { htmlToText } from '../src/seeding/fetcher.js';
import { toProposedFacts } from '../src/seeding/extractor.js';
import { applyDecisions, renderReviewReport, ReviewError, reviewCounts } from '../src/seeding/review.js';
import { jurisdictionRequirementIds } from '../src/seeding/requirements.js';
import type { ProposedFact, SeedFile } from '../src/seeding/types.js';
import type { Source } from '../src/kb/types.js';

function fact(overrides: Partial<ProposedFact>): ProposedFact {
  return {
    requirementId: 'tx-fingerprints',
    factClass: 'fee',
    value: '38.25',
    unit: 'usd',
    sourceUrl: 'https://ptot.texas.gov/x',
    sourceId: 'tx-apply-exam',
    evidenceQuote: 'The fingerprinting fee is $38.25',
    confidence: 0.95,
    extractedAt: '2026-07-03T00:00:00Z',
    evidenceSnapshot: 'data/evidence/x.html',
    status: 'pending_review',
    ...overrides,
  };
}

function seedWith(facts: ProposedFact[]): SeedFile {
  return { jurisdiction: 'tx', model: 'claude-opus-4-8', seededAt: '2026-07-03T00:00:00Z', facts };
}

describe('value matching', () => {
  it('compares fees numerically, tolerating currency formatting', () => {
    expect(valuesMatch('fee', '38.25', '$38.25')).toBe(true);
    expect(valuesMatch('fee', '485', '485.00')).toBe(true);
    expect(valuesMatch('fee', '485', '48.50')).toBe(false);
    expect(valuesMatch('fee', 'n/a', '485')).toBe(false);
  });

  it('compares text classes by normalized containment', () => {
    expect(
      valuesMatch(
        'wait_time',
        '1-4 days once all required items received; may practice upon online verification',
        '1-4 days once all required items received',
      ),
    ).toBe(true);
    expect(valuesMatch('rule', '75 questions, open-book', '50 questions, closed-book')).toBe(false);
  });
});

describe('golden-set audit', () => {
  const golden: GoldenFile = {
    jurisdiction: 'tx',
    verifiedAt: '2026-07-03',
    entries: [
      { requirementId: 'tx-fingerprints', factClass: 'fee', expected: '38.25', sourceUrl: 'x', status: 'verified' },
      { requirementId: 'tx-jurisprudence', factClass: 'fee', expected: '0', sourceUrl: 'x', status: 'verified' },
      { requirementId: 'tx-application-initial', factClass: 'fee', expected: '190', sourceUrl: 'x', status: 'unverified' },
    ],
  };

  it('counts matches, mismatches, missing; excludes unverified golden entries', () => {
    const report = auditSeed(
      seedWith([
        fact({ status: 'approved' }), // matches fingerprints
        fact({ requirementId: 'tx-jurisprudence', value: '48', status: 'approved' }), // mismatch
      ]),
      golden,
    );
    expect(report.matches).toBe(1);
    expect(report.mismatches).toBe(1);
    expect(report.missing).toBe(0);
    expect(report.excluded).toBe(1);
    expect(report.accuracy).toBeCloseTo(0.5);
  });

  it('only counts approved facts — pending and rejected are invisible to the audit', () => {
    const report = auditSeed(
      seedWith([fact({ status: 'pending_review' }), fact({ status: 'rejected' })]),
      golden,
    );
    expect(report.missing).toBe(2);
    expect(report.matches).toBe(0);
  });
});

describe('review decisions', () => {
  it('approves and rejects by index, immutably', () => {
    const seed = seedWith([fact({}), fact({ requirementId: 'tx-jurisprudence' })]);
    const updated = applyDecisions(seed, [
      { index: 0, action: 'approve' },
      { index: 1, action: 'reject', note: 'wrong fee row' },
    ]);
    expect(updated.facts[0]?.status).toBe('approved');
    expect(updated.facts[1]?.status).toBe('rejected');
    expect(updated.facts[1]?.reviewNote).toBe('wrong fee row');
    expect(seed.facts[0]?.status).toBe('pending_review'); // original untouched
    expect(reviewCounts(updated)).toEqual({ pending_review: 0, approved: 1, rejected: 1 });
  });

  it('refuses re-review and bad indexes', () => {
    const seed = seedWith([fact({ status: 'approved' })]);
    expect(() => applyDecisions(seed, [{ index: 0, action: 'reject' }])).toThrow(ReviewError);
    expect(() => applyDecisions(seed, [{ index: 5, action: 'approve' }])).toThrow(ReviewError);
  });

  it('flags low-confidence facts in the review report', () => {
    const report = renderReviewReport(seedWith([fact({ confidence: 0.6 })]));
    expect(report).toContain('⚠️');
    expect(report).toContain('0.60');
  });
});

describe('extraction plumbing', () => {
  it('maps extraction results to review-ready proposed facts', () => {
    const source: Source = {
      id: 'tx-apply-exam',
      issuerId: 'board-tx',
      url: 'https://ptot.texas.gov/apply-by-exam/',
      description: 'x',
      factClasses: ['fee'],
      accessRung: 'unassessed',
    };
    const facts = toProposedFacts(
      {
        facts: [
          {
            requirementId: 'tx-application-initial',
            factClass: 'fee',
            value: '190',
            unit: 'usd',
            evidenceQuote: 'The application fee is $190',
            confidence: 0.9,
          },
        ],
        missing: [{ factClass: 'wait_time', note: 'not on this page' }],
      },
      source,
      {
        url: source.url!,
        fetchedAt: '2026-07-03T00:00:00Z',
        contentType: 'text/html',
        text: 'x',
        snapshotPath: 'data/evidence/y.html',
      },
    );
    expect(facts).toHaveLength(1);
    expect(facts[0]).toMatchObject({
      status: 'pending_review',
      sourceId: 'tx-apply-exam',
      evidenceSnapshot: 'data/evidence/y.html',
      unit: 'usd',
    });
  });

  it('strips html to text preserving line structure', () => {
    const text = htmlToText(
      '<html><head><style>.x{}</style></head><body><h1>Fees</h1><p>Application: <b>$190</b></p><script>var x=1;</script></body></html>',
    );
    expect(text).toContain('Fees');
    expect(text).toContain('Application: $190');
    expect(text).not.toContain('var x=1');
  });

  it('canonical requirement ids cover the golden-set scheme', () => {
    const ids = jurisdictionRequirementIds('tx');
    for (const required of [
      'tx-application-initial',
      'tx-fingerprints',
      'tx-jurisprudence',
      'tx-license-issuance',
      'tx-compact-privilege',
      'tx-ce-renewal',
      'npte-registration',
    ]) {
      expect(ids).toContain(required);
    }
  });
});
