# [Project name]

_Replace the heading above with the project's name, and this line with one sentence describing what this app does for users._

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec

### Database

- `pnpm --filter @workspace/db run generate` — generate a SQL migration from `lib/db/src/schema` into `lib/db/migrations`
- `pnpm --filter @workspace/db run migrate` — apply pending migrations (idempotent; baselines databases that were created by the old `push` flow)
- `pnpm --filter @workspace/db run seed` — upsert the demo dataset (idempotent, deterministic UUIDs, never deletes unrelated rows)
- `pnpm --filter @workspace/db run setup` — `migrate` + `seed`
- `pnpm --filter @workspace/db run bind <email>` — attach an existing login to the seeded `lumen-trading` workspace
- `pnpm --filter @workspace/db run push` — diff/push the schema directly (dev shortcut, not tracked by migrations)

Required env: `DATABASE_URL` — Postgres connection string. Locally it is read from the root `.env`; on Replit it must be a Secret. `scripts/post-merge.sh` runs `migrate` and `seed` after every merge when `DATABASE_URL` is set.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
