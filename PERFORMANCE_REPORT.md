# PERFORMANCE REPORT

**Date:** 2026-10-09  
**Measurement level:** Static size inventory (no Lighthouse run in this session)

## Asset inventory (approximate)

| Area | Observation |
|------|-------------|
| `www/js/app.01.js` … `app.05.js` | Large legacy bundles; primary UI logic |
| Additional modules | `reader.js`, `v3.js`, `upgrade.js`, `features-*`, `audio.js`, etc. |
| CSS | Multiple layers: `app.css`, `v3.css`, `modern-ui.css`, `upgrade.css`, `features.css`, `dock.css`, `paper.css`, `native.css` |
| Build step | **None** — ships as static files (fast deploy, no tree-shaking) |

## Findings

1. **No bundler** — acceptable for PWA simplicity; costs more bytes on first load.
2. **Duplicate styling systems** — redesign CSS stacked on original; higher parse cost, harder caching granularity.
3. **Runtime** — mushaf `fit()` loops font size; acceptable for single page render.
4. **Network** — audio and optional API (AI, live prayer) dominate after first paint.

## Safe improvements (not all applied)

| Improvement | Status |
|-------------|--------|
| Defer non-critical JS | Recommended |
| Single CSS entry for production | Deferred (UI freeze rule) |
| Compress assets at CDN | Ops concern |
| Lazy init for AI / qibla / heavy widgets | Recommended |
| Avoid removing legacy JS until unused proof | Per policy |

## Before/after

No reliable Lighthouse before/after in this environment. Treat this as a baseline inventory only.
