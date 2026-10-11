# CONTENT REVIEW REQUIRED — Islamic datasets

Automated checks cannot replace qualified scholarly review. This file lists content that must be human-verified before marketing the app as a religious authority.

## Policy

- Do **not** invent hadith grades, ayah text, or scholarly opinions.
- Preserve source attribution on every record.
- Flag uncertainty; do not silently delete.

## Datasets

| Dataset | Path | Approx. size | Review status |
|---------|------|--------------|---------------|
| Full Uthmani Quran (offline) | `www/data/` (generated) | 114 surahs / 6236 ayahs | Structural validation via `fetch-data.js`; **sample vs Madinah mushaf still required** |
| Backend Quran snippets | `backend/data/quran.json` | 2 key ayahs | Sample only for RAG — not full mushaf |
| Quran meta | `backend/data/quran_meta.json` | 114 surahs meta + key ayahs | Meta OK structurally; content spot-check recommended |
| Hadith sample | `backend/data/ahadith.json` | ~80 | Grades present in file; **verify against primary books** |
| Adiyah / duas | `backend/data/adiyah.json` | ~50 | Attribution present; scholarly spot-check |
| Tafsir samples | `backend/data/tafsir.json`, `tafsir_saadi.json` | Partial | Not a complete tafsir library offline until `npm run data:all` |
| Reciters / audio URLs | `backend/data/reciters.json`, `audio_manifest.json` | Catalog | Network URLs — verify licensing and availability |

## Questionable / incomplete areas

### 1. Full offline tafsir and hadith books
- **Suspected problem:** Default `npm run data` may not include all extra tafsirs/hadith kutub until `--all`.
- **Evidence:** README documents `data:all`; archive backend holds samples only.
- **Required verification:** Run `data:all` on a trusted machine; compare samples to printed/reliable digital sources.
- **Review status:** PENDING human review

### 2. Hadith grades in `ahadith.json`
- **Suspected problem:** Grades may be simplified (e.g. «صحيح») without isnad detail.
- **Evidence:** Sample record structure includes `grade`, `source`, `book`.
- **Required verification:** Scholar or trained editor vs. primary collections.
- **Review status:** PENDING

### 3. AI-generated answers
- **Suspected problem:** Model may paraphrase or err despite system prompt.
- **Evidence:** Prompt forbids inventing ayahs/hadith; no formal accuracy benchmark exists in-repo.
- **Required verification:** Golden-question eval set; never show fake “85% religious accuracy”.
- **Review status:** OPEN — product must show source-grounding language only

### 4. Zakat and prayer assumptions
- **Suspected problem:** Fiqh differences (nisab metal, method of prayer times).
- **Evidence:** Unit tests encode specific assumptions (e.g. silver 595g).
- **Required verification:** Document madhhab/method in UI copy.
- **Review status:** PARTIAL (tests exist; user-facing disclaimer recommended)

## Record-level template (for editors)

```
Dataset:
Record ID:
Existing attribution:
Suspected problem:
Evidence:
Required verification:
Review status: PENDING | APPROVED | REJECTED
```

No automated system in this repository replaces a qualified Islamic content review.
