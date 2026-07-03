# PT PracticePath — single-process deployment image.
# The app is dependency-light (runtime deps: @anthropic-ai/sdk only) and
# serves API + web UI from one Node process.

FROM node:22-slim AS base
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

COPY tsconfig.json ./
COPY src ./src
COPY db ./db
COPY data/golden ./data/golden

# tsx runs TypeScript directly; no build step by design.
RUN npm install --no-save tsx --no-audit --no-fund

# Persisted working data (reports, seeds, evidence snapshots) lives under
# /app/data — mount a volume there in production.
VOLUME ["/app/data"]

ENV PORT=3000
EXPOSE 3000

# Required in production:
#   ANTHROPIC_API_KEY   — live Mode A/B posting parsing + seeding extraction
# Optional:
#   CENSUS_ENV          — label census runs with the egress description
USER node
CMD ["npx", "tsx", "src/api/server.ts"]
