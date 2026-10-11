const fs   = require('fs');
const path = require('path');
const Fuse = require('fuse.js');

function normalize(str) {
  return (str || '')
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ').trim();
}

const FULL = path.join(__dirname, '../data/quran-search.json');
const SAMPLE = path.join(__dirname, '../data/quran.json');
let quran = [];
let mode = 'empty';
try {
  if (fs.existsSync(FULL)) {
    quran = require(FULL);
    mode = 'full';
  } else if (fs.existsSync(SAMPLE)) {
    quran = require(SAMPLE).map(q => ({ ...q, norm: q.norm || normalize(q.text) }));
    mode = 'sample';
  } else {
    quran = [];
    mode = 'empty';
    console.warn('[quranService] لا يوجد ملف بيانات قرآن — البحث المحلي معطل');
  }
} catch (e) {
  quran = [];
  mode = 'empty';
  console.warn('[quranService]', e.message);
}

const fuse = quran.length ? new Fuse(quran, {
  keys: ['norm', 'reference', 'text'],
  threshold: 0.35,
  ignoreLocation: true,
  includeScore: true
}) : null;

function searchQuran(query) {
  if (!fuse || !query || typeof query !== 'string') return null;
  const results = fuse.search(normalize(query));
  if (!results.length) return null;
  const best = results[0];
  const confidence = Math.round((1 - (best.score || 0)) * 100);
  return { text: best.item.text, source: best.item.source, reference: best.item.reference, confidence: `${confidence}%` };
}

module.exports = { searchQuran, mode };
