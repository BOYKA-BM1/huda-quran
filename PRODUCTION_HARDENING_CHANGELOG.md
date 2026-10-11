# PRODUCTION HARDENING CHANGELOG

## 2026-10-09 — audit pass

### Added
- `AUDIT_BEFORE_FIX.md`
- `SECURITY_AUDIT.md`
- `CONTENT_REVIEW_REQUIRED.md`
- `OFFLINE_TEST_REPORT.md`
- `PERFORMANCE_REPORT.md`
- `ARCHITECTURE_CLEANUP.md`
- `FINAL_QA_REPORT.md` (see companion file)
- `.github/workflows/ci.yml` — frontend tests, backend tests, audit hooks
- `npm run validate:data` → alias of `data:check`

### Changed
- `backend/config/index.js` — production exits if `FRONTEND_URL` is missing or `*`
- `backend/server.js` — `uncaughtException` closes server and exits process

### Not changed (intentional)
- UI/branding (preserved per product direction / v16 baseline)
- Quran Arabic text (generation only via script)
- Feature set (no feature removal)

### In progress / external
- Full `npm run data` generation for `www/data` (network; long-running)
- Package lockfiles (generate with `npm install` on Node 20 and commit)
- Android platform tree (`npm run android:add` on a machine with Capacitor CLI)
