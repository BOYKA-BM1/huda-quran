# AUDIT BEFORE FIX — Huda Quran v2.1.0 (archive state)

**Audit date:** 2026-10-09  
**Baseline path:** `/home/workdir/artifacts/huda-redesign/huda` (restored from delivery zip aligned with UI v16)  
**Auditor role:** Principal architecture / security / offline / Capacitor / data integrity

## 1. Architecture summary

| Layer | Stack | Notes |
|-------|--------|------|
| Frontend | Static SPA in `www/` (HTML + CSS + vanilla JS, RTL) | No bundler; multiple CSS/JS modules |
| Offline | Single `www/sw.js` + expected `www/data/` | Data **missing** in this archive |
| Backend | Express on Node ≥18 (`backend/`) | Groq AI + local JSON Islamic DB |
| Mobile | Capacitor 7 (`capacitor.config.json`) | Android platform **not** present in archive |
| CI | Documented GitHub Actions APK build | **No** `.github/workflows` in archive |
| Tests | `tests/core.test.js` (Node assert), `backend/test/ai.test.js` | Minimal coverage |

**Strengths**
- Clear separation: API keys intended only on server (`GROQ_API_KEY`)
- Helmet + rate limit + JSON body limit (50kb) on backend
- Graceful SIGTERM/SIGINT shutdown
- System prompt discourages fabricated hadith/ayahs and complex fatwa
- Frontend zakat/prayer unit tests (13) pass in this environment
- Capacitor config is sane (`appId`, https scheme, mixed content off)
- Data script `scripts/fetch-data.js` is strict (114 surahs, 6236 ayahs, SHA checks)

**Weaknesses / production blockers**
- Offline Quran corpus not present (`www/data/`) — `npm run data` required
- Backend `quran.json` is a 2-item sample, not full text (by design for RAG snippets; full text belongs under `www/data`)
- No package-lock files → non-reproducible installs
- No GitHub Actions despite README
- No Android project tree in archive
- Heavy use of `innerHTML` on frontend (XSS risk if any field is user-controlled or from network without escape)
- CORS allows `*` when `FRONTEND_URL=*`
- `uncaughtException` does not exit process (unsafe production pattern)
- Incomplete Islamic datasets for full offline tafsir/hadith books until `data:all`
- Duplicate/legacy JS paths (`app.01–05` + newer modules) increase maintenance risk

## 2. Findings by severity

### P0 — Critical

| ID | Finding | Evidence |
|----|---------|----------|
| P0-1 | **Missing `www/data/`** — offline mushaf/search/tafsir local files absent | `node scripts/fetch-data.js --check` → fail «بيانات القرآن غير موجودة» |
| P0-2 | **Production offline claim blocked** without successful `npm run data` | README requires data before ship |
| P0-3 | **No lockfiles** | `package-lock.json` absent at root and backend |

### P1 — High

| ID | Finding | Evidence |
|----|---------|----------|
| P1-1 | **GitHub Actions missing** | No `.github/` directory; README documents APK workflow |
| P1-2 | **Android platform not in archive** | No `android/`; must `cap add android` |
| P1-3 | **CORS wildcard path** | `backend/server.js` + `config.frontendUrl === '*'` → `origin: '*'` |
| P1-4 | **Process continues after uncaughtException** | `server.js` logs only |
| P1-5 | **XSS surface via innerHTML** | Widespread in `www/js/app.01.js` and other modules; some user text escaped, many templates not systematically sanitized |
| P1-6 | **Backend Quran for AI is stub** | `backend/data/quran.json` length 2 |

### P2 — Medium

| ID | Finding | Evidence |
|----|---------|----------|
| P2-1 | Hadith/dua datasets are curated samples (80 / 50), not full kutub | `ahadith.json`, `adiyah.json` sizes |
| P2-2 | Tafsir backend files partial | `tafsir.json` 9, `tafsir_saadi.json` keyed subset |
| P2-3 | SW cache versioning mixed with redesign patches | `sw.js` + optional version comments |
| P2-4 | No automated XSS / injection regression tests beyond light AI tests |
| P2-5 | AdSense injection path in frontend | `app.01.js` adsbygoogle — privacy/CSP implications |

### P3 — Low

| ID | Finding | Evidence |
|----|---------|----------|
| P3-1 | Multiple CSS layers (`app`, `v3`, `modern-ui`, `upgrade`) hard to reason about |
| P3-2 | REDESIGN-NOTES vs original product identity — keep UI as shipped in v16 baseline |
| P3-3 | Engines: root Node ≥20, backend ≥18 — align docs |

## 3. Scripts and commands (as defined)

| Script | Purpose | Status at audit |
|--------|---------|-----------------|
| `npm run serve` | Static server | Available |
| `npm run data` / `data:all` / `data:check` | Generate/validate `www/data` | check **FAIL** (no data) |
| `npm test` | Frontend calc tests | **PASS** (13) |
| `npm run test:backend` | Backend AI tests | Install may be slow; pending full run |
| `android:*` | Capacitor | Needs `cap` + Android SDK |

## 4. Data integrity notes

- Canonical Arabic text must come from generation script / trusted API, not invented.
- `AYAH_COUNTS` array in `fetch-data.js` is the structural ground truth for 6236 ayahs.
- Backend JSON is for AI RAG snippets and metadata — not a substitute for full offline mushaf files under `www/data/`.
- Religious content remains subject to human scholarly review (`CONTENT_REVIEW_REQUIRED.md`).

## 5. Security snapshot (pre-fix)

- Secrets: `.env.example` documents `GROQ_API_KEY`; do not commit real keys.
- README correctly warns to revoke any key that was ever embedded client-side historically.
- Rate limiting on `/api` present.
- Body size limited to 50kb.
- Helmet enabled.
- Gaps: CORS `*`, uncaughtException continue, innerHTML, no CSP header from static host by default.

## 6. Immediate fix plan (execution order)

1. Generate/validate `www/data` (`npm run data` + `data:check`).
2. Add production CORS defaults (deny `*` in production).
3. Harden process error handlers (exit on uncaughtException after log).
4. Add `escapeHtml` helper and harden highest-risk AI/chat DOM paths.
5. Add `.github/workflows` for test + optional Android debug APK.
6. Document Android add/sync; do not claim runtime without device.
7. Expand tests where cheap; write remaining report files.
8. `npm audit` when installs complete; record results honestly.

## 7. Explicit limitations of this environment

- May lack Android SDK / emulator → Android **build/runtime** may be BLOCKED.
- Full `npm run data` is network-heavy and long-running; status tracked separately.
- Cannot claim penetration test or full offline UX pass without browser automation of all 12 offline scenarios after data exists.
- Islamic scholarly certification is **out of scope** for automated tooling.

---
*Next: implement Phase 1–3 fixes against this baseline.*
