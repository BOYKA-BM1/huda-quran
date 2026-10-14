# HUDA AL QURAN — FULL BUILD PROMPT FOR LOVABLE

You are a senior full-stack engineer. Rebuild and complete this Islamic app project as a production-ready web app with backend, based on the uploaded source code.

## Product name
**Huda Al Quran** (هُدى القرآن)

## Goal
A complete Islamic web app (PWA-ready) with:
1. Quran mushaf reading
2. Audio recitation (reciters + qiraat)
3. Prayer times / adhan
4. Azkar / Hisn al-Muslim
5. Tasbeeh
6. Islamic Q&A / AI assistant (optional if API key provided)
7. **Books library (critical)**
8. Hidden admin panel
9. Mobile-first RTL Arabic UI

## NON-NEGOTIABLE RULES
- Keep Arabic RTL as primary language.
- Do NOT invent Quran verses or hadith.
- Do NOT break existing working features from the uploaded code; extend them.
- Preserve branding name: **Huda Al Quran**.
- Admin secret unlock: typing `13/4/2024` in Quran search opens admin.
- Books uploaded by admin must appear for **ALL users on ALL devices** (cloud storage, not device-local only).
- Book reader must be full-screen continuous scroll (pages stacked), no browser PDF chrome, no white overlay covering text.
- Browser Back from a book must return to **Books list**, not Home.
- PWA install name: **Huda Al Quran**.

## CRITICAL FEATURE: Cloud Books
Implement a real backend + database/storage:

### Public
- Books page with cover grid
- Open book → full-screen reader (PDF continuous scroll OR chapter text)
- Same catalog for every visitor

### Admin (secret panel)
- Add book: title, author, category, cover image, PDF file
- List books
- Delete book (removes for everyone)
- Uploads stored on server (not IndexedDB-only)

### API (minimum)
- `GET /api/books` list
- `POST /api/books` create (admin key required)
- `DELETE /api/books/:id` delete (admin key required)
- `GET /api/books/file/:id` serve PDF

Admin key default: `huda-admin-13-4-2024` (env configurable)

## Tech preferences
- Frontend: keep simple static HTML/CSS/JS structure if possible, or migrate cleanly to a modern stack Lovable supports
- Backend: Node/Express OR Lovable native backend
- Persistent storage for PDFs and catalog
- CORS allow GitHub Pages / production domain
- Service worker with version bump for updates

## UI/UX
- Mobile first, responsive, polished Islamic green/gold aesthetic
- Dark top bar, clean cards
- Books: 2-column covers, title under cover, Read button
- Reader: full viewport, continuous pages, optional floating zoom only if stable (must not jump to page 1)
- Admin: clear upload UI + delete buttons

## Also implement / keep
- Side menu navigation
- Search
- Settings
- Prayer section
- Azkar section
- Nawawi 40 if present in code
- Offline caching for shell assets where possible

## Deliverables
1. Working deployed preview URL
2. Admin flow tested: upload on phone → appears on desktop for another user
3. Delete book tested
4. Back navigation from reader → books list
5. Short README: env vars, admin key, how to upload books

## Acceptance tests
| # | Test | Must pass |
|---|------|-----------|
| 1 | Open site on mobile + desktop | Same books list |
| 2 | Admin unlock with 13/4/2024 | Opens admin |
| 3 | Upload PDF book | Visible to all users |
| 4 | Delete book | Removed for all users |
| 5 | Open book | Full screen continuous pages |
| 6 | Browser Back | Returns to books list |
| 7 | No white card covering text | Clear readable pages |

## Source
Use the uploaded project files as the base. Prefer fixing and completing over rewriting from zero unless required.

Start by inspecting the repo structure (`www/`, `docs/`, `backend/`), then implement cloud books + admin delete + deploy.
