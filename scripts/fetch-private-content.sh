#!/bin/bash
# Fetch private content from a separate private GitHub repository.
# Required Vercel environment variables:
#   PRIVATE_CONTENT_REPO  — e.g. "username/ai-knowledge-blog-private"
#   GITHUB_ACCESS_TOKEN   — a fine-grained PAT with "Contents: Read" on the private repo

set -euo pipefail

DEST="content/private"

if [ -z "${PRIVATE_CONTENT_REPO:-}" ] || [ -z "${GITHUB_ACCESS_TOKEN:-}" ]; then
  echo "[private-content] PRIVATE_CONTENT_REPO or GITHUB_ACCESS_TOKEN not set, skipping."
  exit 0
fi

echo "[private-content] Cloning private content from ${PRIVATE_CONTENT_REPO}..."

# Clean destination if it exists (e.g. leftover from cache)
rm -rf "$DEST"

git clone --depth 1 \
  "https://x-access-token:${GITHUB_ACCESS_TOKEN}@github.com/${PRIVATE_CONTENT_REPO}.git" \
  "$DEST"

# Remove .git from cloned repo — Nuxt Content only needs the files
rm -rf "${DEST}/.git"

echo "[private-content] Done. $(find "$DEST" -name '*.md' | wc -l) markdown files injected."
