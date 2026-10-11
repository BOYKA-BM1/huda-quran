# PRODUCTION REPAIR LOG

**Date:** 2026-10-09  
**Scope:** Repair & production readiness (no UI redesign)

## Backup

Create a local zip/tar of the project before applying updates on your machine.

## Changes in this repair pass

| Area | Change |
|------|--------|
| `.gitignore` | Added — node_modules, `.env`, keystores, Android build outputs, logs |
| `www/sw.js` | VERSION `huda-v9`; precache `css/modern-ui.css` (was loaded by index but missing from shell) |
| `scripts/validate-release.js` | New pre-release gate (structure, data, fonts, SW shell, secrets hygiene) |
| `package.json` | `validate:release`, `check:all` |
| `backend/config/index.js` | Production refuses `FRONTEND_URL=*` (prior + confirmed) |
| `backend/server.js` | Safe exit on `uncaughtException` (prior + confirmed) |
| `scripts/fetch-data.js` | Orthography cross-check is warning after count validation (prior) |
| `.github/workflows/ci.yml` | Present; includes tests |

## Verified on user machine (reported 2026-10-09)

| Command | Result |
|---------|--------|
| `npm run data` | PASS — 604 pages, 8 ok, 0 fail |
| `npm run validate:data` | PASS — fingerprint match |
| `npm test` | PASS — 13 |
| Backend `npm test` | PASS |
| Backend `npm audit` | 3 high — **action required** (`npm audit` / `npm audit fix` in `backend/`) |

## Sandbox limitations

- Incomplete `www/data` pages (I/O errors during generation) — **your machine already fixed this**
- No Android SDK → APK not built here
- Do not ship sandbox `www/data` over a complete local generation

## Next actions for release

1. Keep your successful `www/data` from `npm run data`
2. Run `npm run validate:release` on that tree (should PASS)
3. `cd backend && npm audit` and remediate highs
4. Set production `FRONTEND_URL` + `GROQ_API_KEY`
5. `npm run android:add && npm run android:sync` when SDK available
