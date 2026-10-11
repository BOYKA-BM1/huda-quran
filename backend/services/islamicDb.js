const fs = require('fs');
const path = require('path');
const D = path.join(__dirname, '../data');

function load(name, fallback) {
  const p = path.join(D, name);
  try {
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    console.warn('[islamicDb] فشل تحميل', name, e.message);
  }
  return fallback;
}

const DB = {
  ahadith: load('ahadith.json', []),
  adiyah: load('adiyah.json', []),
  quranMeta: load('quran_meta.json', { surahs: [], key_ayahs: [] }),
  reciters: load('reciters.json', []),
  tafsir: load('tafsir.json', {}),
  audioManifest: load('audio_manifest.json', {}),
};

function normalize(str) {
  return (str || '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/[ةه]/g, 'ه')
    .replace(/[يى]/g, 'ي')
    .replace(/[\u064B-\u065F]/g, '')
    .trim();
}

function score(haystack, needle) {
  const h = normalize(haystack), n = normalize(needle);
  if (!n) return 0;
  if (h.includes(n)) return 1;
  const nWords = n.split(/\s+/);
  const matched = nWords.filter(w => w.length > 2 && h.includes(w)).length;
  return matched / Math.max(nWords.length, 1);
}

function searchHadith(query, limit = 5) {
  if (!query) return [];
  return DB.ahadith
    .map(h => ({ ...h, _score: score((h.text || '') + (h.topic || ''), query) }))
    .filter(h => h._score > 0.1)
    .sort((a, b) => b._score - a._score)
    .slice(0, limit)
    .map(({ _score, ...h }) => h);
}

function searchDua(query, limit = 5) {
  if (!query) return DB.adiyah.slice(0, limit);
  return DB.adiyah
    .map(d => ({ ...d, _score: score((d.text || '') + (d.topic || '') + (d.time || ''), query) }))
    .filter(d => d._score > 0.1)
    .sort((a, b) => b._score - a._score)
    .slice(0, limit)
    .map(({ _score, ...d }) => d);
}

function searchQuranMeta(query, limit = 5) {
  if (!query) return [];
  const q = normalize(query);
  const results = [];
  (DB.quranMeta.key_ayahs || []).forEach(a => {
    const s = score((a.text || '') + (a.topic || ''), query);
    if (s > 0.15) results.push({ type: 'ayah', ...a, _score: s });
  });
  (DB.quranMeta.surahs || []).forEach(s => {
    if (normalize(s.ar || '').includes(q) || normalize(s.en || '').includes(q)) {
      results.push({ type: 'surah', ...s, _score: 0.8 });
    }
  });
  return results.sort((a, b) => b._score - a._score).slice(0, limit).map(({ _score, ...r }) => r);
}

function getTafsir(ref) {
  if (!ref) return null;
  return DB.tafsir[ref] || DB.tafsir[String(ref)] || null;
}

function buildRagContext(query) {
  if (!query) return '';
  const parts = [];
  const hadiths = searchHadith(query, 3);
  if (hadiths.length) {
    parts.push('أحاديث ذات صلة:\n' + hadiths.map(h => `«${h.text}» — ${h.source || h.reference || ''}`).join('\n'));
  }
  const duas = searchDua(query, 2);
  if (duas.length) {
    parts.push('أدعية:\n' + duas.map(d => d.text).join('\n'));
  }
  const qmeta = searchQuranMeta(query, 3);
  if (qmeta.length) {
    parts.push('آيات/سور:\n' + qmeta.map(x => x.text || x.ar || JSON.stringify(x)).join('\n'));
  }
  return parts.join('\n\n').slice(0, 4000);
}

module.exports = {
  searchHadith,
  searchDua,
  searchQuranMeta,
  getTafsir,
  buildRagContext,
  DB,
};
