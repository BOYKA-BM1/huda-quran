# OFFLINE TEST REPORT

**Date:** 2026-10-09  
**Method:** Static analysis + data generation status + prior frontend unit tests  
**Browser offline matrix:** Partially blocked until `www/data` generation finishes cleanly

## Data prerequisite

| Step | Result |
|------|--------|
| `npm run data:check` at audit start | FAIL — no `www/data` |
| `npm run data` in this session | IN PROGRESS → structural 114/6236 OK; orthography cross-check reported many diffs vs `quran-simple-clean` (expected between editions; human sample vs Madinah still required) |

## Scenario matrix

| # | Scenario | Status | Evidence / method |
|---|----------|--------|-------------------|
| 1 | First online visit | NOT TESTED (full UX) | Needs browser + network after data |
| 2 | Subsequent visit | NOT TESTED | SW cache depends on successful precache list |
| 3 | Offline reload | BLOCKED | Requires completed `www/data` + SW install |
| 4 | Quran reading offline | BLOCKED → PENDING | Files must exist under `www/data` |
| 5 | Search offline | BLOCKED | Same |
| 6 | Navigation offline | NOT TESTED | SPA shell may load from SW; page modules need cache |
| 7 | Cached audio | NOT TESTED | Audio is mostly network CDN |
| 8 | Missing audio offline | NOT TESTED | Expect graceful failure UI — code paths exist in player |
| 9 | SW updates | NOT TESTED | Manual hard reload / skipWaiting behavior |
| 10 | Old cache cleanup | NOT TESTED | Inspect `sw.js` activate handler |
| 11 | Interrupted downloads | NOT TESTED | |
| 12 | Failed API offline | NOT TESTED | AI backend will fail offline by design |

## Honest conclusion

**Do not claim “fully offline Quran app” until:**

1. `npm run data` completes and `npm run validate:data` / `data:check` passes for the files this release ships.
2. A real browser test completes scenarios 3–6 with DevTools Offline checked.
3. Product copy distinguishes offline mushaf text from online-only AI and streaming audio.

## SW notes

- Single worker: `www/sw.js`
- Prefer one cache name version; bump on every release that changes shell or data.
- Avoid caching authenticated or private API responses (backend AI).
