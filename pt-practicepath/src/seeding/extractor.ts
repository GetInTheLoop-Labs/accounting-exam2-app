// LLM extraction: fetched page → ProposedFacts (PRD §8.3 step 2).
//
// Extraction is schema-constrained via structured outputs, low-drama by
// design: the model may only emit facts tied to the provided requirement ids,
// each with a verbatim evidence quote and a confidence score. Anything
// ambiguous is expected to come back with confidence < 0.8, which flags it
// for mandatory human attention in review.

import Anthropic from '@anthropic-ai/sdk';
import type { FactClass } from '../kb/types.js';
import type { Source } from '../kb/types.js';
import type { ExtractionResult, ProposedFact } from './types.js';
import type { FetchedPage } from './fetcher.js';
import { EXTRACTION_SCHEMA } from './schema.js';

export const EXTRACTION_MODEL = 'claude-opus-4-8';
const MAX_PAGE_CHARS = 200_000;
export const REVIEW_ATTENTION_THRESHOLD = 0.8;

const SYSTEM_PROMPT = `You extract regulatory facts about US physical therapy licensure from official web pages for a knowledge base.

Rules:
- Only extract facts that the page actually states. Never infer, estimate, or fill in from outside knowledge.
- Every fact needs a verbatim evidenceQuote copied from the page text that supports the value.
- Fees: value is a plain decimal number (e.g. "38.25"), unit "usd". If the page states multiple fees, emit one fact per fee against the best-matching requirementId.
- Wait times / processing times: quote the page's own framing (e.g. "1-4 days once all required items received"); unit null unless the page states a single number of days/weeks.
- Rules (formats, pass thresholds, CE hours, required steps): concise but faithful; do not editorialize.
- Set confidence below 0.8 whenever the page is ambiguous, values conflict on the page, the page looks outdated, or the quote only indirectly supports the value.
- If an expected fact class is absent from the page, record it under "missing" with a short note instead of guessing.`;

export interface ExtractorDeps {
  client?: Anthropic;
}

export async function extractFacts(
  source: Source,
  page: FetchedPage,
  requirementIds: string[],
  deps: ExtractorDeps = {},
): Promise<ExtractionResult> {
  const client = deps.client ?? new Anthropic();

  const truncated = page.text.length > MAX_PAGE_CHARS;
  const pageText = truncated ? page.text.slice(0, MAX_PAGE_CHARS) : page.text;

  const response = await client.messages.create({
    model: EXTRACTION_MODEL,
    max_tokens: 16000,
    thinking: { type: 'adaptive' },
    system: [
      {
        type: 'text',
        text: SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    output_config: {
      format: { type: 'json_schema', schema: EXTRACTION_SCHEMA as unknown as Record<string, unknown> },
    },
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: [
              `Source: ${source.id} — ${source.description}`,
              `URL: ${page.url}`,
              `Expected fact classes: ${source.factClasses.join(', ')}`,
              `Valid requirementId values (use only these): ${requirementIds.join(', ')}`,
              truncated ? `NOTE: page text was truncated to ${MAX_PAGE_CHARS} characters.` : '',
              '',
              '--- PAGE TEXT ---',
              pageText,
            ].join('\n'),
          },
        ],
      },
    ],
  });

  if (response.stop_reason === 'max_tokens') {
    throw new Error(`Extraction truncated for ${source.id}: hit max_tokens`);
  }
  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error(`Extraction for ${source.id} returned no text block (stop_reason=${response.stop_reason})`);
  }
  return JSON.parse(textBlock.text) as ExtractionResult;
}

/** Wrap raw extraction output into review-ready ProposedFacts. */
export function toProposedFacts(
  result: ExtractionResult,
  source: Source,
  page: FetchedPage,
): ProposedFact[] {
  return result.facts.map((f) => ({
    requirementId: f.requirementId,
    factClass: f.factClass as FactClass,
    value: f.value,
    ...(f.unit ? { unit: f.unit } : {}),
    sourceUrl: page.url,
    sourceId: source.id,
    evidenceQuote: f.evidenceQuote,
    confidence: f.confidence,
    extractedAt: page.fetchedAt,
    evidenceSnapshot: page.snapshotPath,
    status: 'pending_review' as const,
  }));
}
