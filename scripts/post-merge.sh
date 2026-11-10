#!/bin/bash
set -e
pnpm install --frozen-lockfile

if [ -n "$DATABASE_URL" ]; then
  pnpm --filter @workspace/db migrate
  pnpm --filter @workspace/db seed
else
  echo "DATABASE_URL is not set; skipping schema migrations and demo seed."
fi
