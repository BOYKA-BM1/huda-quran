# ARCHITECTURE CLEANUP NOTES

## Current shape

```
www/          static SPA + SW
backend/      Express AI + JSON Islamic services
scripts/      data fetch, serve, android patch
tests/        frontend calculation tests
.github/      CI (added this pass)
```

## Keep

- Capacitor single `webDir: www`
- Server-side only API keys
- Strict `fetch-data.js` validation philosophy
- Existing visual identity (v16 UI baseline)

## Cleanup candidates (do not delete without proof)

1. Overlapping CSS (`modern-ui` vs `v3` vs `app`) — consolidate in a future dedicated UI pass with visual regression.
2. Parallel Quran readers (`app.01` surah mode vs `v3`/`reader` page mode) — document which is canonical for mushaf pages.
3. Backend `quran.json` stub vs full `www/data` — document roles clearly in README.

## Applied this pass

- CI workflow added
- `validate:data` script alias
- Production CORS hard-fail
- Safer uncaughtException handling
- Audit / security / content / offline report files

## Do not

- Migrate to React/Vue without product decision
- Strip features for cleanliness alone
- Rewrite Quran Arabic text in-repo from memory
