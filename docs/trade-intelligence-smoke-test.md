# Trade Intelligence — Final Pre-Go-Live Smoke Test Report

| Field | Value |
| --- | --- |
| Application | `@workspace/imported-app` (`artifacts/imported-app`) |
| Smoke date | 2026-11-10 |
| Test environment | macOS; local dev server `http://127.0.0.1:5173/` (Vite dev, HMR active); real Chrome via Playwright, headless |
| Build environment | `PORT=4173 BASE_PATH=/ pnpm build` → `dist/public` (2.6 MB) |
| Overall verdict | **Pass — clear to enter the release process** (12/12 browser checks, 20/20 unit tests, typecheck and build green) |
| Companion document | [Go-live checklist and deployment guide](./trade-intelligence-go-live.md) |

---

## 1. Quality gates

| Check | Command | Result |
| --- | --- | --- |
| Typecheck | `pnpm typecheck` | Pass, exit code 0 |
| Unit tests | `pnpm test` | **20/20 pass** (includes snapshot no-history / one-day / multi-day, KPI deltas, untouched-match age) |
| Production build | `PORT=4173 BASE_PATH=/ pnpm build` | Pass (3.88 s); `dist/public/index.html` present; 2.6 MB total |
| Build warnings | — | Only the entry chunk 515 kB size notice (routes are already lazy-loaded; non-blocking) |

## 2. Routes and auth gate

Each route was probed against the running dev server:

| Route | HTTP | Notes |
| --- | --- | --- |
| `/`, `/login` | 200 | Renders normally |
| `/dashboard` and the 6 Trade Intelligence module routes | 200 (SPA fallback) | All intercepted by `AuthRequired` in the browser |
| `/qa` | 200 (SPA fallback) | No `/qa` references remain in source; the temporary verification route was removed |

Auth gate verified in a real unauthenticated Chrome session:

- `/dashboard` → redirects to `/login`: pass
- `/dashboard/trade-intelligence` → redirects to `/login`: pass
- `/dashboard/trade-intelligence/matching` → redirects to `/login`: pass

## 3. Browser smoke test (real Chrome, 12/12 pass)

| # | Check | Result |
| --- | --- | --- |
| 1 | Login page renders in dark (1440×1000) | Pass; `dark` class applied; horizontal overflow 0px |
| 2 | No console errors on login, dark | Pass |
| 3 | Login page renders in light (1440×1000) | Pass; horizontal overflow 0px |
| 4 | No console errors on login, light | Pass |
| 5–7 | Auth gate blocks 3 protected routes | Pass |
| 8 | Theme `dark` written to `xisync-theme` still applies after reload | Pass |
| 9 | Theme `light` still applies after reload | Pass |
| 10 | With no stored value, follows the system dark preference | Pass |
| 11 | No horizontal overflow at 390×844 | Pass (0px) |
| 12 | Storage key `xisync:trade-intelligence:v1:` and the 45-day snapshot constant are present in source | Pass |

Note: the theme toggle button lives inside the authenticated dashboard layout, so it is not reachable on the logged-out login page. This run therefore verified the persistence mechanism itself in both directions (stored value → `dark` class → survives reload); the click interaction was already exercised during the dark-mode audit summarised in section 4.

## 4. Dark-mode audit conclusion (final state after fixes)

A real Chrome pass over the command centre plus the six modules at 1440 dark/light and 390 dark, with screenshots and computed contrast, produced this end state:

- Dark-mode contrast failures: 1 per page, all false positives from the gradient-clipped logo
- Light-mode contrast failures: same gradient/logo false positives only
- Glass panel borders, score rings, sparklines, and chart legends: visually legible page by page
- Actual fixes applied: inverted muted text tokens (`500/400`), darkened light-mode badges from `600` to `700`, strengthened glass borders and fills on empty pipeline/matching columns, raised contrast for chart footnotes and legends

## 5. Data and snapshot behaviour

| Check | Result |
| --- | --- |
| Snapshot triggers (app open plus every state change) | Covered by unit tests, pass |
| Same-day overwrite, ascending order by date, 45-day trim | Covered by unit tests, pass |
| First run with no prior day: KPI shows "New baseline", briefing states no prior-day data | Covered by unit tests, pass |
| Prior-day and multi-day deltas read stored snapshots rather than timestamps | Covered by unit tests, pass |
| Seeded age for untouched matches (0–18 days) and 7-day staleness | Covered by unit tests, pass |

## 6. Known limitations (non-blocking)

1. Business data lives in browser `localStorage`; clearing it wipes the workspace and there is no cross-device sync.
2. Without `VITE_TRADE_AI_ENDPOINT` every result comes from the local deterministic engine; with it configured, a 2.5 s timeout falls back automatically.
3. Click-by-click regression inside the authenticated dashboard relies on the earlier dedicated audit; the recommendation is still to run the section 6 manual pass in the go-live document on staging.
4. The entry chunk exceeds the 500 kB notice; `manualChunks` can optimise this later, and it is not a functional issue.

## 7. Release conclusion

- [x] All quality gates green (typecheck / 20 of 20 unit tests / build)
- [x] Browser smoke test 12/12
- [x] Auth gate effective and temporary routes removed
- [x] Theme persists in both directions, both themes readable, no narrow-width overflow
- [x] Snapshot and delta logic covered by unit tests (no history / one day / multiple days)

**Conclusion: the smoke test passes in full; proceed to release per the go-live checklist and deployment guide.**

| Role | Signature | Date |
| --- | --- | --- |
| Test executed by | (pending) | 2026-11-10 |
| Release approved by | (pending) | |
