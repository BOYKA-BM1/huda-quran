# SECURITY AUDIT — Huda Quran

**Date:** 2026-10-09  
**Scope:** Static review + targeted code fixes in this workspace  
**Not claimed:** Formal penetration test, red-team engagement, or third-party audit

## Summary

| Area | Status | Notes |
|------|--------|-------|
| Secrets in client | PASS (current tree) | AI key intended server-side only; README requires revoke of any historical client key |
| Helmet | PASS | Enabled on Express |
| Rate limiting | PASS | `/api` limiter; separate AI max in config |
| Body size | PASS | `express.json({ limit: '50kb' })` |
| CORS | FIXED | Production now **exits** if `FRONTEND_URL` is missing or `*` |
| Process faults | FIXED | `uncaughtException` closes server and exits |
| XSS (AI chat) | PARTIAL PASS | User/bot text escapes `<` before innerHTML |
| XSS (general DOM) | OPEN risk | Many `innerHTML` templates with static/app data; treat any future user HTML as unsafe |
| SSRF | LOW | Outbound only to configured Groq base URL |
| Path traversal | LOW | Static JSON loads under known `backend/data` paths |
| Dependency CVEs | NOT FULLY RUN | `npm audit` blocked/incomplete in this session — rerun after lockfiles |

## Remediation applied in this pass

1. **`backend/config/index.js`** — Production refuses `FRONTEND_URL=*` and exits with non-zero code.
2. **`backend/server.js`** — `uncaughtException` logs stack, closes HTTP server, forces exit.

## Remaining risks (not fully closed)

| Risk | Severity | Recommendation |
|------|----------|----------------|
| Broad `innerHTML` usage | Medium | Central `escapeHtml`; prefer `textContent` / DOM APIs for dynamic values |
| No Content-Security-Policy on static host | Medium | Set CSP at CDN/nginx; avoid inline scripts long-term |
| Wildcard CORS in development default | Low | Keep `*` only for local; always set explicit origins in prod |
| Incomplete lockfiles | Medium | Commit `package-lock.json` after `npm install` on Node 20 |
| Ad injection path | Low–Med | Gate ads; document privacy |

## Evidence commands

```bash
# Production should refuse wildcard CORS
NODE_ENV=production FRONTEND_URL='*' node -e "require('./backend/config')"
# Expect process.exit(1)

# Dev still allows '*'
NODE_ENV=development node -e "console.log(require('./backend/config').frontendUrl)"
```

## Honest limitations

- No dynamic DAST scan was performed.
- Service worker security depends on host HTTPS and update discipline.
- Capacitor WebView hardening requires device testing (not available here).
