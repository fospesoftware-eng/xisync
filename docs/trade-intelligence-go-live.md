# Trade Intelligence — Go-Live Checklist and Deployment Guide

| Field | Value |
| --- | --- |
| Application | `@workspace/imported-app` (`artifacts/imported-app`) |
| Stack | Vite 7 + React 19 + TypeScript 5.9 + Tailwind 3 + Recharts 2 |
| Release shape | Single-page app (SPA), static hosting; per-tenant business data lives in browser `localStorage` |
| Current gate status | typecheck passing; unit tests 20/20; production build passing |
| Document updated | 2026-11-10 |

---

## 1. Scope

This release covers one command centre and six Trade Intelligence modules:

| Module | Standard console route | ULTRA route |
| --- | --- | --- |
| Trade command centre (home) | `/dashboard` | `/dashboard/ultra` |
| Module overview | `/dashboard/trade-intelligence` | `/dashboard/ultra/trade-intelligence` |
| Sinosure-style credit assessment | `/dashboard/trade-intelligence/credit` | `/dashboard/ultra/trade-intelligence/credit` |
| Freight and transit prediction | `/dashboard/trade-intelligence/shipping` | `/dashboard/ultra/trade-intelligence/shipping` |
| AI matching and workflow | `/dashboard/trade-intelligence/matching` | `/dashboard/ultra/trade-intelligence/matching` |
| Trade analytics | `/dashboard/trade-intelligence/analytics` | `/dashboard/ultra/trade-intelligence/analytics` |
| AI toolkit (documents / quotes) | `/dashboard/trade-intelligence/toolkit` | `/dashboard/ultra/trade-intelligence/toolkit` |

Every route above sits behind the auth gate (`AuthRequired`); unauthenticated visits redirect to the login page. The release bundle must not contain any unauthenticated QA routes such as `/qa/*`.

---

## 2. Runtime facts (read this before deploying)

1. **Deterministic engine first.** The local heuristic engine (`HeuristicTradeProvider`) is the default. It runs fully without any model service and produces reproducible results.
2. **Remote model is optional.** Setting `VITE_TRADE_AI_ENDPOINT` switches to `RemoteTradeProvider`. Requests are `POST {endpoint}/{credit|shipping|documents|quote}` with a `{ "input": ... }` body. Each call times out at 2.5 s; on timeout, non-2xx, or a malformed payload it degrades to the local engine and surfaces a "model endpoint unavailable" notice.
3. **Workspace persistence.** A versioned `localStorage` repository keyed `xisync:trade-intelligence:v1:<tenantId>` (demo tenant `demo-workspace`). It stores match workflows, credit assessments, quotes, document checks, and daily snapshots.
4. **Daily snapshots.** A snapshot is written when the app opens and on every state change; writing again on the same day replaces that day's record; the last 45 calendar days are retained. On a first run with no prior-day snapshot, KPI deltas show "New baseline" and the briefing explicitly states that no prior-day snapshot exists — yesterday is never fabricated.
5. **Age of untouched matches.** Matches with a persisted workflow age from their last stage change. Suggested rows that were never touched take a seeded age (0–18 days). Reaching 7 days or more puts them into the stale count and the action queue.
6. **Theme.** `light` / `dark`, persisted in `xisync-theme`, survives reload; first visit follows the system preference.
7. **Language.** Bilingual EN/ZH, default Chinese. All UI copy comes from `tradeCopy.ts` / `commandCopy.ts`; there is no backend translation service.

---

## 3. Pre-flight gates (all must be green)

### 3.1 Code and build

From the repository root:

```bash
pnpm install --frozen-lockfile

cd artifacts/imported-app
pnpm typecheck
pnpm test
PORT=4173 BASE_PATH=/ pnpm build
```

| Check | Pass criteria |
| --- | --- |
| Typecheck | `tsc -p tsconfig.json --noEmit` exits 0 |
| Unit tests | All 20 tests pass (snapshot no-history, one-day and multi-day history, same-day overwrite, 45-day trim, suggested age and staleness) |
| Production build | Emits `artifacts/imported-app/dist/public`, exits 0 |
| Entry bundle size | Entry chunk is about 515 kB; Trade pages are already route-lazy-loaded, so the 1.8 MB single-chunk regression is gone |
| Build env vars | `PORT` and `BASE_PATH` are mandatory; `PORT` only configures the build and does not bind the running dev port |

> The build fails fast in `vite.config.ts` if `PORT` or `BASE_PATH` is missing. The dev server remains on `http://127.0.0.1:5173/`; never build against or start a second server on that port.

### 3.2 Functional acceptance

- [ ] Command centre loads: daily briefing, 4 KPIs, action queue, cash and exposure, shipment risk board, and pipeline board all render.
- [ ] First run (after clearing the workspace): KPI deltas show "New baseline / Baseline captured today" and the first briefing line explains the first run.
- [ ] Next day, or after injecting a prior-day snapshot: KPIs show concrete delta percentages with a baseline date, and the briefing reads "Since yesterday" or "Versus YYYY-MM-DD (N days ago)".
- [ ] Advance any match stage, reload, and the stage is unchanged; that day's snapshot is updated.
- [ ] Credit assessments, quote drafts, and document checks save and are echoed back in their modules.
- [ ] Untouched suggested rows sitting 7+ days appear as "Suggestion untouched N days" actions and are counted in the pipeline stale count.
- [ ] All six modules show clear copy and a retry entry point in loading, empty, and error states (offline / corrupted storage).
- [ ] After switching language, every module title, field, button, empty state, and error message is translated with no missing keys.
- [ ] Feature set is complete with no remote endpoint configured; pointing it at a bad endpoint shows the degraded notice without crashing the page.

### 3.3 Browser and accessibility

The following was already verified in real Chrome across both themes at desktop and narrow widths:

| Viewport | Result |
| --- | --- |
| 1440 × 1000 (desktop, dark) | Command centre plus all six modules opened; text contrast, glass card edges, KPI sparklines, score rings, and chart axes all legible; no console errors |
| 1440 × 1000 (desktop, light) | Same; small caption text and status badges fixed for light-mode contrast |
| 390 × 844 (narrow, dark/light) | No horizontal overflow on any of the seven pages; single-column layout, filters, and boards remain readable |
| Theme toggle | `html.dark` and `localStorage` update together, survive reload, and switch back cleanly |

- [ ] No console errors (known third-party font/analytics warnings are acceptable but must be listed in the release record).
- [ ] Dark mode: card borders, input borders, and dividers are visible; empty pipeline columns no longer read as pure black holes.
- [ ] Light mode: caption text under 10px and amber/rose/emerald status badges meet readable contrast.
- [ ] Score rings, sparklines, and Recharts axes/grid lines are distinguishable in both themes.
- [ ] Keyboard reachable: theme toggle, language toggle, module tabs, and action buttons can all be focused and triggered.

### 3.4 Security and data

- [ ] All go-live routes sit inside `AuthRequired`; confirm no temporary unauthenticated route remains (repo-wide search for `/qa` returns nothing).
- [ ] No server secrets are written to the client; `VITE_*` variables hold public configuration only.
- [ ] The remote endpoint uses HTTPS and receives no unnecessary personal data.
- [ ] `localStorage` holds only the business workspace plus theme/language preferences; no access tokens are written into Trade keys.
- [ ] Cross-tab sync works: change a stage in one tab and the other tab updates via the `storage` event.
- [ ] Corrupted storage surfaces a recoverable error (`TRADE_WORKSPACE_CORRUPTED`) and lets the user reset the workspace.

---

## 4. Environment variables

| Variable | When needed | Example | Notes |
| --- | --- | --- | --- |
| `PORT` | Build / preview / dev | `4173` | Required by `vite.config.ts`; the build does not actually listen on it |
| `BASE_PATH` | Build / dev | `/` or `/app/` | Must match the real deployment path; React Router uses it as the basename |
| `VITE_TRADE_AI_ENDPOINT` | Optional | `https://ai.example.com/trade` | Omit to use the deterministic local engine; set it to enable the remote model and automatic fallback |
| Replit Auth variables | Injected by the host | — | Reuse the existing `@workspace/replit-auth-web` configuration; this module adds no auth variables |

Remote endpoint contract:

```http
POST {VITE_TRADE_AI_ENDPOINT}/credit
Content-Type: application/json

{ "input": { /* CreditInput */ } }
```

The other tasks are `shipping`, `documents`, and `quote` with the same body shape. Responses must be complete objects matching the module schema; anything else is treated as a degraded call.

---

## 5. Build and deploy

### 5.1 Build output

```bash
cd artifacts/imported-app
PORT=4173 BASE_PATH=/ pnpm build
```

Output directory: `artifacts/imported-app/dist/public/`

Verify before release:

- [ ] Asset prefix in `index.html` matches `BASE_PATH`.
- [ ] `assets/` contains content-hashed JS/CSS files.
- [ ] Route-lazy chunks exist (for example `TradeCommandCenter-*.js`, `MatchingPage-*.js`, `TradeCharts-*.js`).
- [ ] Build log has no errors; only the `chunk > 500 kB` notice, which is a known warning.

### 5.2 Static hosting requirements

1. **SPA fallback.** Any unknown path must fall back to `index.html`, otherwise refreshing `/dashboard/trade-intelligence/matching` returns a 404.
2. **Caching.**
   - `index.html`: `Cache-Control: no-cache` so a new entry point is picked up immediately after release.
   - `/assets/*`: `Cache-Control: public, max-age=31536000, immutable` (filenames are hashed).
3. **Sub-path deployment.** If mounted under `/console/`, build with `BASE_PATH=/console/` and make the reverse proxy route `/console/*` to the same `index.html`.

Nginx reference:

```nginx
location / {
  root /srv/xisync/dist/public;
  try_files $uri $uri/ /index.html;
}

location /assets/ {
  root /srv/xisync/dist/public;
  add_header Cache-Control "public, max-age=31536000, immutable";
}
```

### 5.3 Replit / existing hosting

- Use the project scripts for the build, injecting `PORT` and `BASE_PATH`.
- Production preview: `PORT=<host port> BASE_PATH=/ pnpm serve` (`vite preview`), or point the platform's static hosting at `dist/public`.
- Never configure the production service on `5173`; that port belongs to the current development session.
- Auth relies on the Replit login session; the release environment must keep the same login configuration as the existing console.

### 5.4 Release steps

1. Freeze the release branch and confirm there are no unreviewed working-tree changes.
2. In a clean environment run `pnpm install --frozen-lockfile`.
3. Run typecheck, test, then build; keep the build log once all three are green.
4. Archive the previous `dist/public` for rollback.
5. Upload/publish the new `dist/public`, preserving SPA fallback and cache headers.
6. Run the smoke test in section 6 and record the results.
7. Notify stakeholders: the first visit establishes today's baseline and day-over-day figures appear from the next day.

---

## 6. Post-deploy smoke test (about 10 minutes)

| # | Action | Expected result |
| --- | --- | --- |
| 1 | Visit `/dashboard/trade-intelligence` while signed out | Redirect to login, then back to the target page after signing in |
| 2 | Open `/dashboard` | Command centre loads with no white screen and no console errors |
| 3 | Read the first briefing line | New workspace says "First run / no prior-day snapshot"; existing snapshots say "Since yesterday" or "Versus some date (N days ago)" |
| 4 | Check the KPI cards | With a prior-day snapshot, a delta percentage and baseline date appear; without one, "New baseline" appears |
| 5 | In AI matching, advance a suggestion to "Shortlisted" | Succeeds; survives reload; pipeline board counts update |
| 6 | Complete one credit assessment and one document check | Both save and the modules echo the latest records |
| 7 | Toggle dark/light and reload | Theme persists; text, charts, and score rings stay legible |
| 8 | Open the command centre and matching page at ~390px | No horizontal scroll; single-column cards; action buttons tappable |
| 9 | Inspect `localStorage` | `xisync:trade-intelligence:v1:demo-workspace` exists and `snapshots` holds only the last 45 days |
| 10 | Point the remote endpoint at a bad URL and run one assessment | Degraded notice appears, the local engine still returns a result, the page does not crash |

> If items 3/4 still report "first run" on an existing workspace, snapshots are not being written: check whether `localStorage` is disabled in the browser and whether `TRADE_WORKSPACE_WRITE_FAILED` appears in the console.

---

## 7. Data, retention, and migration

| Item | Behaviour |
| --- | --- |
| Storage key | `xisync:trade-intelligence:v1:<tenantId>` |
| Default tenant | `demo-workspace` |
| Workspace version | `version: 1`; state is normalised on read and unknown fields are ignored |
| List caps | Latest 25 each for assessments, quotes, and document checks |
| Snapshot cap | Last 45 calendar days, one record per day, same-day overwrite |
| Snapshot triggers | App open, match stage change, saving an assessment/quote/document check, workspace reset |
| First run | No prior-day snapshot: KPI delta is `null` and the UI shows "New baseline"; that day's snapshot becomes the baseline for later comparisons |
| Cross-device | Not supported; data lives only in the current browser and tenant |
| Clearing data | Call `resetWorkspace()` or delete the matching `localStorage` key; the theme key is `xisync-theme` |
| Older versions | Data without `snapshots` is read as an empty array and today's snapshot is written on the next open |

There is no database migration and no backend schema change. Rolling back the app does not break existing local data; forward compatibility is handled by `version` and `normalizeState`.

---

## 8. Monitoring and alerting suggestions

Watch these after launch:

1. **Frontend error rate.** Break `pageerror` and `console.error` down by route, especially `TradeCommandCenter` and `TradeCharts`.
2. **Storage write failures.** Capture `TRADE_WORKSPACE_WRITE_FAILED` (quota exhaustion, private browsing).
3. **Remote model degradation rate.** Track `model_endpoint_unavailable`; if it stays high, check endpoint latency against the 2.5 s threshold and validate the response shape.
4. **First-day baseline ratio.** "New baseline" for a new tenant is expected; if an established tenant keeps showing it, snapshots are not persisting.
5. **Bundle size.** The entry chunk is near the 500 kB notice line; split new heavy dependencies by route first.

---

## 9. Rollback plan

1. Redeploy the previous `dist/public` with the same `BASE_PATH`.
2. No database or local-data rollback is required; the `version: 1` shape is backward compatible.
3. If the new version misreads old `localStorage`, ship a fix rather than wiping user data; if a wipe is unavoidable, delete only `xisync:trade-intelligence:v1:*` and leave `xisync-theme` and other business keys alone.
4. After rollback, rerun smoke items 1, 2, 5, and 7 to confirm login, command centre, match persistence, and theme.

---

## 10. Known limitations and follow-ups

- **Local persistence.** The workspace and snapshots live in the browser with no multi-device sync or team sharing. If collaboration is needed, replace the `TradeWorkspaceRepository` implementation with a backend API; pages and aggregation logic do not need rewriting.
- **Snapshots only on open/change.** A day when the user never opens the app produces no record; the next day falls back to the most recent earlier snapshot and the briefing states the gap in days.
- **KPI day-over-day source.** Revenue and order intake currently come from monthly seed data, so the daily delta is 0% while that data is static; meaningful daily movement appears once a real order feed is connected.
- **Suggested age is seeded.** Untouched matches use a deterministic seed (0–18 days) to demonstrate staleness detection; once real match timestamps exist, use first-seen time instead.
- **Bundle size.** The entry chunk is about 515 kB and triggers the 500 kB notice; Trade pages are lazy-loaded already, and `manualChunks` can further split Recharts.
- **Theme first paint.** The theme is applied to `<html>` after React mounts, so very slow devices may flash light once; an inline theme script in `index.html` would remove that entirely.

---

## 11. Release record template

| Field | Value |
| --- | --- |
| Release version / commit | |
| Release date and window | |
| Build environment (Node / pnpm) | |
| Typecheck | Pass / Fail |
| Unit tests | Passed / Total |
| Production build | Pass / Fail |
| `BASE_PATH` | |
| Remote model endpoint | Disabled / Enabled (URL) |
| Smoke test result | Passed / Total |
| Rollback package location | |
| Released by / Reviewed by | |
| Open issues | |
