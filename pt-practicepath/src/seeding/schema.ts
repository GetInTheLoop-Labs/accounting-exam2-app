// JSON schema constraining the extractor's output (structured outputs via
// output_config.format). Kept within the API's supported subset:
// additionalProperties:false everywhere, no numeric/string constraints.

export const EXTRACTION_SCHEMA = {
  type: 'object',
  properties: {
    facts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          requirementId: {
            type: 'string',
            description: 'KB requirement id this fact belongs to, from the provided list',
          },
          factClass: {
            type: 'string',
            enum: ['fee', 'wait_time', 'rule', 'url', 'date'],
          },
          value: {
            type: 'string',
            description:
              'The fact value. Fees: plain decimal number, no currency symbol. Wait times and rules: concise verbatim-faithful statement.',
          },
          unit: {
            type: ['string', 'null'],
            enum: ['usd', 'days', 'weeks', null],
          },
          evidenceQuote: {
            type: 'string',
            description: 'Verbatim quote from the page that supports the value',
          },
          confidence: {
            type: 'number',
            description:
              '0..1. Use <0.8 when the page is ambiguous, values conflict, or the quote only indirectly supports the value.',
          },
        },
        required: ['requirementId', 'factClass', 'value', 'unit', 'evidenceQuote', 'confidence'],
        additionalProperties: false,
      },
    },
    missing: {
      type: 'array',
      description: 'Expected fact classes the page did NOT contain',
      items: {
        type: 'object',
        properties: {
          factClass: {
            type: 'string',
            enum: ['fee', 'wait_time', 'rule', 'url', 'date'],
          },
          note: { type: 'string' },
        },
        required: ['factClass', 'note'],
        additionalProperties: false,
      },
    },
  },
  required: ['facts', 'missing'],
  additionalProperties: false,
} as const;
