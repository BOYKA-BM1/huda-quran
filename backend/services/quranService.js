const fs   = require('fs');
const path = require('path');
const Fuse = require('fuse.js');

// يفضّل البحث في كل القرآن (6236 آية) إن وُجد الملف الذي يولّده `npm run data`،
// وإلا يرجع للعيّنة الصغيرة المرفقة.
const FULL = path.join(__dirname, '../data/quran-search.json');
let quran, mode;
if (fs.existsSync(FULL)) { quran = require(FULL); mode = 'full'; }
else { quran = require('../data/quran.json').map(q => ({ ...q, norm: normalize(q.text) })); mode = 'sample'; }

function normalize(str) {
  return (str || '')
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ').trim();
}

const fuse = new Fuse(quran, {
  keys: ['norm', 'reference'],
  threshold: 0.35,
  ignoreLocation: true,
  includeScore: true
});

/** يبحث في نص القرآن. يرجع {text, source, reference, confidence} أو null */
function searchQuran(query) {
  if (!query || typeof query !== 'string') return null;
  const results = fuse.search(normalize(query));
  if (!results.length) return null;
  const best = results[0];
  const confidence = Math.round((1 - (best.score || 0)) * 100);
  return { text: best.item.text, source: best.item.source, reference: best.item.reference, confidence: `${confidence}%` };
}

module.exports = { searchQuran, mode };
