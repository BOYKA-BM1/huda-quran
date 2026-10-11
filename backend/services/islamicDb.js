const path = require('path');
const D    = path.join(__dirname, '../data');

// Load all databases once at startup
const DB = {
  ahadith:     require(path.join(D, 'ahadith.json')),
  adiyah:      require(path.join(D, 'adiyah.json')),
  quranMeta:   require(path.join(D, 'quran_meta.json')),
  reciters:    require(path.join(D, 'reciters.json')),
  tafsir:      require(path.join(D, 'tafsir.json')),
  audioManifest: require(path.join(D, 'audio_manifest.json')),
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function normalize(str) {
  return (str || '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/[ةه]/g, 'ه')
    .replace(/[يى]/g, 'ي')
    .replace(/[\u064B-\u065F]/g, '') // تشكيل
    .trim();
}

function score(haystack, needle) {
  const h = normalize(haystack), n = normalize(needle);
  if (h.includes(n)) return 1;
  // Word overlap score
  const nWords = n.split(/\s+/);
  const matched = nWords.filter(w => w.length > 2 && h.includes(w)).length;
  return matched / nWords.length;
}

// ─── Hadith search ───────────────────────────────────────────────────────────
function searchHadith(query, limit = 5) {
  if (!query) return [];
  return DB.ahadith
    .map(h => ({ ...h, _score: score(h.text + h.topic, query) }))
    .filter(h => h._score > 0.1)
    .sort((a, b) => b._score - a._score)
    .slice(0, limit)
    .map(({ _score, ...h }) => h);
}

// ─── Dua search ──────────────────────────────────────────────────────────────
function searchDua(query, limit = 5) {
  if (!query) return DB.adiyah.slice(0, limit);
  return DB.adiyah
    .map(d => ({ ...d, _score: score(d.text + d.topic + d.time, query) }))
    .filter(d => d._score > 0.1)
    .sort((a, b) => b._score - a._score)
    .slice(0, limit)
    .map(({ _score, ...d }) => d);
}

// ─── Quran search ────────────────────────────────────────────────────────────
function searchQuranMeta(query, limit = 5) {
  if (!query) return [];
  const q = normalize(query);
  const results = [];
  // Search key ayahs
  DB.quranMeta.key_ayahs.forEach(a => {
    const s = score(a.text + a.topic, query);
    if (s > 0.15) results.push({ type: 'ayah', ...a, _score: s });
  });
  // Search surah names
  DB.quranMeta.surahs.forEach(s => {
    if (normalize(s.ar).includes(q) || normalize(s.en).includes(q)) {
      results.push({ type: 'surah', ...s, _score: 0.8 });
    }
  });
  return results
    .sort((a, b) => b._score - a._score)
    .slice(0, limit)
    .map(({ _score, ...r }) => r);
}

// ─── Tafsir ──────────────────────────────────────────────────────────────────
function getTafsir(surahN) {
  return DB.tafsir.find(t => t.surah === surahN) || null;
}

// ─── Reciters ────────────────────────────────────────────────────────────────
function getAllReciters() { return DB.reciters; }
function getReciter(id)   { return DB.reciters.find(r => r.id === id) || null; }

function buildAudioUrls(reciterId, surahNum) {
  const rec = getReciter(reciterId);
  if (!rec) return [];
  const pad = String(surahNum).padStart(3, '0');
  const urls = [];
  // ① CDN Islamic — أثبت
  if (rec.cdn_id) {
    urls.push(`https://cdn.islamic.network/quran/audio-surah/128/${rec.cdn_id}/${surahNum}.mp3`);
    urls.push(`https://cdn.islamic.network/quran/audio-surah/64/${rec.cdn_id}/${surahNum}.mp3`);
  }
  // ② mp3quran servers
  rec.servers.forEach(s => urls.push(`${s}${pad}.mp3`));
  // ③ quranicaudio
  if (rec.quranicaudio) {
    urls.push(`https://download.quranicaudio.com/quran/${rec.quranicaudio}/${pad}.mp3`);
  }
  return [...new Set(urls)]; // dedup
}

// ─── RAG context builder for AI ──────────────────────────────────────────────
function buildRagContext(query) {
  const hadith  = searchHadith(query, 2);
  const dua     = searchDua(query, 1);
  const quran   = searchQuranMeta(query, 2);
  const parts   = [];

  if (quran.length)  parts.push('📖 آيات ذات صلة:\n' + quran.map(a => a.text ? `﴿${a.text}﴾` : `سورة ${a.ar}`).join('\n'));
  if (hadith.length) parts.push('📚 أحاديث ذات صلة:\n' + hadith.map(h => `«${h.text}» — ${h.narrator} [${h.source}]`).join('\n'));
  if (dua.length)    parts.push('🤲 أدعية ذات صلة:\n' + dua.map(d => `${d.text} [${d.source}]`).join('\n'));

  return parts.length ? parts.join('\n\n') : '';
}

module.exports = {
  searchHadith, searchDua, searchQuranMeta,
  getTafsir, getAllReciters, getReciter,
  buildAudioUrls, buildRagContext,
  DB
};
