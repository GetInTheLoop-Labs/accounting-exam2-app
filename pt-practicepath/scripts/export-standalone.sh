#!/usr/bin/env bash
# Export PT PracticePath as a standalone repository and push it.
#
#   ./scripts/export-standalone.sh <git-remote-url> [branch]
#
# Creates a fresh single-commit history containing this directory as the
# repo root plus the PRD (docs/PRD.md pulled up from the parent repo), and
# pushes to the given remote. The empty remote repo must already exist.
set -euo pipefail

REMOTE="${1:?usage: export-standalone.sh <git-remote-url> [branch]}"
BRANCH="${2:-main}"

HERE="$(cd "$(dirname "$0")/.." && pwd)"          # pt-practicepath/
PARENT="$(cd "$HERE/.." && pwd)"                  # containing repo
STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT

rsync -a --exclude node_modules --exclude census --exclude 'data/seeds' \
  --exclude 'data/evidence' --exclude 'data/report-*.md' \
  "$HERE/" "$STAGE/"

# The PRD travels with the product.
mkdir -p "$STAGE/docs"
cp "$PARENT/docs/PRD.md" "$STAGE/docs/PRD.md"

cd "$STAGE"
git init -q -b "$BRANCH"
git add -A
git commit -q -m "PT PracticePath: initial import

Product PRD, Phase 0 foundation (KB schema, 53-jurisdiction source
registry, census tool, seeding pipeline, 10-state golden set), and the
Phase 1-2 product (path engine, sequencer, report assembler, HTTP API,
web UI, position intelligence). Exported from
GetInTheLoop-Labs/accounting-exam2-app."
git remote add origin "$REMOTE"
git push -u origin "$BRANCH"

echo "Pushed standalone repo to $REMOTE ($BRANCH)."
echo "Follow-ups: enable Dependabot, add the repo to the coding-agent integration,"
echo "and port issues #2–#6 from accounting-exam2-app."
