#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════
   سكربت تنزيل بيانات «هُدى القرآن» من مصادر موثوقة، مع تحقق صارم.
   يعمل على Node ≥ 18 بدون أي حزم إضافية. شغّله مرة واحدة على جهاز متصل بالإنترنت.

   الأوامر:
     npm run data          الأساسي: القرآن + التفسير الميسّر + الترجمة + الخطوط + قائمة الصوتيات
     npm run data:all      الأساسي + تفاسير إضافية + كتب حديث
     npm run data:check    يفحص الملفات الموجودة فقط (بدون إنترنت)

   أو مباشرة:  node scripts/fetch-data.js --quran --fonts --tafsir-extra --hadith --audio

   المصادر:
     • القرآن/التفسير الميسّر/الترجمة/قائمة الصوتيات : api.alquran.cloud
     • تفاسير إضافية (ابن كثير، السعدي…)             : github.com/spa5k/tafsir_api عبر jsDelivr
     • كتب الحديث (البخاري، مسلم، الأربعون النووية)   : github.com/fawazahmed0/hadith-api عبر jsDelivr
     • الخطوط (Tajawal, Amiri Quran, Scheherazade)    : Google Fonts

   مهم: هذه المصادر مفتوحة لكن ليست «مرجعاً شرعياً مصدّقاً». قبل النشر قارن عيّنة من
   النص مع مصحف المدينة (مجمع الملك فهد) وراجع الدرجات والتفاسير مع متخصص.
   ════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = process.env.HUDA_ROOT || path.resolve(__dirname, '..');
const WWW = path.join(ROOT, 'www');
const DATA = path.join(WWW, 'data');
const BACKEND_DATA = path.join(ROOT, 'backend', 'data');

const args = new Set(process.argv.slice(2));
const ALL = args.has('--all');
const want = (f) => ALL || args.has(f);
const CHECK_ONLY = args.has('--check');

/* عدد آيات كل سورة (١١٤ سورة = ٦٢٣٦ آية) — يُتحقَّق من مجموعها بالأسفل */
const AYAH_COUNTS = [7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6];
if (AYAH_COUNTS.length !== 114 || AYAH_COUNTS.reduce((a, b) => a + b, 0) !== 6236) {
  throw new Error('جدول عدد الآيات الداخلي غير صحيح');
}

const API = process.env.HUDA_API_BASE || 'https://api.alquran.cloud/v1';              // قابل للتغيير لاستخدام mirror أو للاختبار
const TAFSIR_BASE = process.env.HUDA_TAFSIR_BASE || 'https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir';
const HADITH_BASE = process.env.HUDA_HADITH_BASE || 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1';
const FONTS_CSS = process.env.HUDA_FONTS_CSS || 'https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Scheherazade+New:wght@400;700&family=Tajawal:wght@400;500;700&display=swap';
const report = { ok: [], warn: [], fail: [] };
const log = (m) => console.log(m);
const ok = (m) => { report.ok.push(m); log('  ✔ ' + m); };
const warn = (m) => { report.warn.push(m); log('  ⚠ ' + m); };
const fail = (m) => { report.fail.push(m); log('  ✘ ' + m); };

/* ───────── أدوات ───────── */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function mkdirp(p) { fs.mkdirSync(p, { recursive: true }); }
function writeJSON(p, obj) { mkdirp(path.dirname(p)); fs.writeFileSync(p, JSON.stringify(obj)); }
function readJSON(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }

async function get(url, { json = true, retries = 4, headers = {}, binary = false } = {}) {
  let lastErr;
  for (let i = 0; i <= retries; i++) {
    try {
      const ac = new AbortController();
      const t = setTimeout(() => ac.abort(), 45000);
      const res = await fetch(url, { signal: ac.signal, headers });
      clearTimeout(t);
      if (res.status === 429 || res.status >= 500) throw new Error('HTTP ' + res.status);
      if (!res.ok) { const e = new Error('HTTP ' + res.status + ' ' + url); e.fatal = true; throw e; }
      if (binary) return Buffer.from(await res.arrayBuffer());
      return json ? await res.json() : await res.text();
    } catch (e) {
      lastErr = e;
      if (e.fatal) break;
      await sleep(800 * (i + 1) ** 2);
    }
  }
  throw lastErr;
}

async function pool(items, size, worker) {
  let i = 0, done = 0;
  const run = async () => {
    while (i < items.length) {
      const idx = i++;
      await worker(items[idx], idx);
      done++;
      if (done % 10 === 0 || done === items.length) process.stdout.write(`\r    ${done}/${items.length}`);
    }
  };
  await Promise.all(Array.from({ length: size }, run));
  process.stdout.write('\n');
}

const norm = (s) => String(s || '')
  .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, '')
  .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
  .replace(/\s+/g, ' ').trim();
const lettersOnly = (s) => norm(s).replace(/[^\u0621-\u064A]/g, '');

const BISM = ['بسم', 'الله', 'الرحمن', 'الرحيم'];
function stripBismillah(n, ayahs) {
  if (n === 1 || n === 9) return false;
  const w = String(ayahs[0].text || '').split(/\s+/);
  if (w.length > 4 && BISM.every((b, i) => norm(w[i]) === b)) { ayahs[0].text = w.slice(4).join(' '); return true; }
  return false;
}

/* ═════════════ 1) القرآن + التفسير الميسّر + الترجمة ═════════════ */
async function fetchSurahEdition(edition, { strip = false } = {}) {
  const dir = path.join(DATA, 'quran', edition);
  mkdirp(dir);
  const surahs = Array.from({ length: 114 }, (_, i) => i + 1);
  const meta = [];
  let stripped = 0;
  await pool(surahs, 5, async (n) => {
    const j = await get(`${API}/surah/${n}/${edition}`);
    if (j.code !== 200 || !j.data || !Array.isArray(j.data.ayahs)) throw new Error(`رد غير صالح للسورة ${n} (${edition})`);
    const d = j.data;
    if (d.ayahs.length !== AYAH_COUNTS[n - 1]) throw new Error(`السورة ${n}: وصل ${d.ayahs.length} آية والمتوقع ${AYAH_COUNTS[n - 1]} (${edition})`);
    const ayahs = d.ayahs.map((a, i) => {
      if (a.numberInSurah !== i + 1) throw new Error(`ترتيب آيات السورة ${n} مختل (${edition})`);
      if (typeof a.text !== 'string' || !a.text.trim()) throw new Error(`آية فارغة ${n}:${i + 1} (${edition})`);
      return { number: a.number, numberInSurah: a.numberInSurah, text: a.text, juz: a.juz, page: a.page, hizbQuarter: a.hizbQuarter, sajda: a.sajda || false };
    });
    if (strip && stripBismillah(n, ayahs)) stripped++;
    meta[n - 1] = { n, name: d.name, en: d.englishName, type: d.revelationType, ayahs: ayahs.length };
    writeJSON(path.join(dir, `${n}.json`), { code: 200, status: 'OK', data: { number: n, name: d.name, englishName: d.englishName, revelationType: d.revelationType, numberOfAyahs: ayahs.length, ayahs } });
  });
  return { meta, stripped };
}

async function doQuran() {
  log('\n📖 القرآن الكريم (النسخة العثمانية)');
  const { meta, stripped } = await fetchSurahEdition('quran-uthmani', { strip: true });
  ok(`١١٤ سورة و٦٢٣٦ آية — عدد الآيات لكل سورة مطابق للمتوقع (فُصلت البسملة الملصقة عن ${stripped} سورة)`);

  // تحقق مقارن: نسخة ثانية من نفس المصدر بدون تشكيل
  log('   ↳ تحقق مقارن بنسخة ثانية (quran-simple-clean)…');
  const simpleDir = path.join(DATA, '_tmp_simple'); mkdirp(simpleDir);
  let mismatches = [], total = 0;
  await pool(Array.from({ length: 114 }, (_, i) => i + 1), 5, async (n) => {
    const j = await get(`${API}/surah/${n}/quran-simple-clean`);
    const simple = j.data.ayahs;
    stripBismillah(n, simple);
    const u = readJSON(path.join(DATA, 'quran', 'quran-uthmani', `${n}.json`)).data.ayahs;
    simple.forEach((s, i) => {
      total++;
      if (lettersOnly(s.text) !== lettersOnly(u[i].text)) mismatches.push(`${n}:${i + 1}`);
    });
  });
  fs.rmSync(simpleDir, { recursive: true, force: true });
  // uthmani vs simple-clean differ in orthography/drawing by design; count match is the hard gate above.
  // Large letter-level diffs are expected — warn and require human sample vs Madinah mushaf (see CONTENT_REVIEW_REQUIRED.md).
  if (mismatches.length === 0) ok(`النسختان متطابقتان حرفياً بعد إزالة التشكيل في ${total} آية`);
  else if (mismatches.length <= 30) warn(`اختلافات إملائية بسيطة بين النسختين في ${mismatches.length} آية (غالباً رسم المصحف): ${mismatches.slice(0, 8).join(', ')}…`);
  else warn(`اختلافات رسم/إملاء بين العثماني وsimple-clean في ${mismatches.length} موضعًا (متوقع بين الطبعات) — راجع عيّنة مع مصحف المدينة قبل الإطلاق: ${mismatches.slice(0, 8).join(', ')}…`);

  // صفحات المصحف (٦٠٤) — أساس نظام التصفح بالصفحات
  log('   ↳ بناء صفحات المصحف…');
  const pagesDir = path.join(DATA, 'quran', 'pages'); mkdirp(pagesDir);
  const pages = Array.from({ length: 605 }, () => []);
  for (let n = 1; n <= 114; n++) {
    const d = readJSON(path.join(DATA, 'quran', 'quran-uthmani', `${n}.json`)).data;
    d.ayahs.forEach((a) => { if (!(a.page >= 1 && a.page <= 604)) throw new Error(`رقم صفحة غير صالح ${n}:${a.numberInSurah}`); pages[a.page].push({ number: a.number, numberInSurah: a.numberInSurah, text: a.text, juz: a.juz, page: a.page, surah: { number: n, name: d.name } }); });
  }
  for (let pg = 1; pg <= 604; pg++) {
    if (!pages[pg].length) throw new Error(`الصفحة ${pg} فارغة`);
    writeJSON(path.join(pagesDir, `${pg}.json`), { code: 200, status: 'OK', data: { number: pg, ayahs: pages[pg] } });
  }
  const juzStart = []; for (let pg = 1; pg <= 604; pg++) pages[pg].forEach((a) => { if (!juzStart[a.juz - 1] || pg < juzStart[a.juz - 1]) juzStart[a.juz - 1] = pg; });
  if (juzStart.length !== 30 || juzStart.some((x) => !x)) throw new Error('بيانات الأجزاء ناقصة');
  writeJSON(path.join(DATA, 'quran', 'juz.json'), { juzStartPages: juzStart });
  ok('٦٠٤ صفحة مصحف + صفحات بدايات الأجزاء الثلاثين');

  // فهرس البحث
  const idx = { version: 1, surahs: meta.map((m) => m.name.replace(/^سُورَةُ\s*/, '')), ayahs: [] };
  const searchDocs = [];
  for (let n = 1; n <= 114; n++) {
    const d = readJSON(path.join(DATA, 'quran', 'quran-uthmani', `${n}.json`)).data;
    d.ayahs.forEach((a) => {
      const t = norm(a.text);
      idx.ayahs.push([n, a.numberInSurah, a.text, t]);
      searchDocs.push({ text: a.text, source: 'القرآن الكريم', reference: `${idx.surahs[n - 1]}:${a.numberInSurah}`, norm: t });
    });
  }
  if (idx.ayahs.length !== 6236) throw new Error('فهرس البحث ناقص');
  writeJSON(path.join(DATA, 'quran', 'search-index.json'), idx);
  if (fs.existsSync(BACKEND_DATA)) writeJSON(path.join(BACKEND_DATA, 'quran-search.json'), searchDocs);
  ok('فهرس البحث المحلي (أوفلاين) + فهرس الباك إند');

  log('\n📚 التفسير الميسّر (مجمع الملك فهد)');
  await fetchSurahEdition('ar.muyassar');
  ok('تفسير ١١٤ سورة آية بآية');

  log('\n🌐 الترجمة الإنجليزية (Sahih International)');
  await fetchSurahEdition('en.sahih');
  ok('ترجمة ١١٤ سورة');

  // manifest + بصمة
  const h = crypto.createHash('sha256');
  for (let n = 1; n <= 114; n++) readJSON(path.join(DATA, 'quran', 'quran-uthmani', `${n}.json`)).data.ayahs.forEach((a) => h.update(a.text + '\n'));
  writeJSON(path.join(DATA, 'quran', 'manifest.json'), {
    complete: true, generatedAt: new Date().toISOString(), surahs: 114, ayahs: 6236,
    editions: ['quran-uthmani', 'ar.muyassar', 'en.sahih'], source: 'api.alquran.cloud', textSha256: h.digest('hex'),
    note: 'قارن النص مع مصحف المدينة (مجمع الملك فهد) قبل النشر'
  });
  ok('manifest.json مع بصمة SHA-256 للنص');
}

/* ═════════════ 2) قائمة الصوتيات المتاحة آية بآية ═════════════ */
async function doAudioEditions() {
  log('\n🔊 قائمة تلاوات آية بآية المتاحة');
  const j = await get(`${API}/edition?format=audio&language=ar`);
  const eds = (j.data || []).map((e) => e.identifier).filter(Boolean);
  if (eds.length < 5) throw new Error('قائمة الصوتيات غير منطقية');
  writeJSON(path.join(DATA, 'audio-editions.json'), { generatedAt: new Date().toISOString(), editions: eds });
  ok(`${eds.length} قارئاً متاحاً آية بآية: ${eds.slice(0, 6).join(', ')}…`);
}

/* ═════════════ 3) خطوط محلية ═════════════ */
async function doFonts() {
  log('\n🔤 الخطوط (محلية بدل Google Fonts)');
  const cssUrl = FONTS_CSS;
  const UA = 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36';
  const css = await get(cssUrl, { json: false, headers: { 'User-Agent': UA } });
  const blocks = [...css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*\{([^}]+)\}/g)];
  if (!blocks.length) throw new Error('تعذّر قراءة CSS الخطوط');
  const fontsDir = path.join(WWW, 'fonts'); mkdirp(fontsDir);
  let out = '/* مُولَّد تلقائياً بواسطة scripts/fetch-data.js — لا تعدّله يدوياً */\n';
  let n = 0;
  for (const [, subset, body] of blocks) {
    if (!/^(arabic|latin)$/.test(subset)) continue;
    const fam = (body.match(/font-family:\s*'([^']+)'/) || [])[1];
    const wt = (body.match(/font-weight:\s*(\d+)/) || [])[1] || '400';
    const url = (body.match(/url\(([^)]+)\)/) || [])[1];
    const range = (body.match(/unicode-range:\s*([^;]+);/) || [])[1];
    if (!fam || !url) continue;
    const file = `${fam.replace(/\s+/g, '')}-${wt}-${subset}.woff2`;
    fs.writeFileSync(path.join(fontsDir, file), await get(url, { binary: true }));
    out += `@font-face{font-family:'${fam}';font-style:normal;font-weight:${wt};font-display:swap;src:url(../fonts/${file}) format('woff2');${range ? 'unicode-range:' + range + ';' : ''}}\n`;
    n++;
  }
  if (n < 6) throw new Error(`عدد ملفات الخطوط (${n}) أقل من المتوقع`);
  fs.writeFileSync(path.join(WWW, 'css', 'fonts.css'), out);

  // استبدال رابط Google Fonts في index.html
  const idxPath = path.join(WWW, 'index.html');
  let html = fs.readFileSync(idxPath, 'utf8');
  html = html.replace(/<!-- FONTS:REMOTE:START[\s\S]*?FONTS:REMOTE:END -->/, '<link rel="stylesheet" href="css/fonts.css"> <!-- FONTS:LOCAL -->');
  fs.writeFileSync(idxPath, html);

  // إضافة الخطوط للكاش المسبق في الـ Service Worker
  const swPath = path.join(WWW, 'sw.js');
  let sw = fs.readFileSync(swPath, 'utf8');
  if (!sw.includes('css/fonts.css')) {
    const files = fs.readdirSync(fontsDir).map((f) => `  "fonts/${f}"`).join(',\n');
    sw = sw.replace('const SHELL = [', `const SHELL = [\n  "css/fonts.css",\n${files},`);
    fs.writeFileSync(swPath, sw);
  }
  ok(`${n} ملف خط محلي، وتم تحديث index.html وsw.js`);
}

/* ═════════════ 4) تفاسير إضافية (ابن كثير، السعدي…) ═════════════ */
async function doTafsirExtra() {
  log('\n📚 تفاسير إضافية');
  const base = TAFSIR_BASE;
  let editions;
  try { editions = await get(`${base}/editions.json`); } catch (e) { return fail('تعذّر جلب قائمة التفاسير: ' + e.message); }
  const list = Array.isArray(editions) ? editions : Object.values(editions);
  const wantRe = /(ibn-kathir|saddi|sa-di|saadi|tabari|qurtubi|baghawi)/i;
  const chosen = list.filter((e) => e && (e.language_name || e.language || '').toString().toLowerCase().startsWith('arab') && wantRe.test(e.slug || e.name || ''));
  if (!chosen.length) return warn('لم أجد تفاسير عربية مطابقة في قائمة المصدر (قد يكون تغيّر هيكلها)');
  for (const ed of chosen) {
    const slug = ed.slug || ed.name;
    log(`   ↳ ${ed.name || slug} (${slug})`);
    const dir = path.join(DATA, 'tafsir', slug); mkdirp(dir);
    let bad = 0;
    await pool(Array.from({ length: 114 }, (_, i) => i + 1), 5, async (n) => {
      try {
        const j = await get(`${base}/${slug}/${n}.json`);
        const ay = (j.ayahs || []).map((a) => ({ a: a.ayah, t: a.text }));
        if (!ay.length) throw new Error('empty');
        if (Math.abs(ay.length - AYAH_COUNTS[n - 1]) > AYAH_COUNTS[n - 1] * 0.5) bad++; // التفاسير قد تجمّع الآيات
        writeJSON(path.join(dir, `${n}.json`), { surah: n, ayahs: ay });
      } catch (e) { bad += 100; }
    });
    if (bad >= 100) fail(`${slug}: فشل تنزيل سور — أعد التشغيل`);
    else ok(`${ed.name || slug}: ١١٤ سورة`);
  }
}

/* ═════════════ 5) كتب الحديث ═════════════ */
async function doHadith() {
  log('\n📜 كتب الحديث');
  const base = HADITH_BASE;
  const WANT = [
    { ed: 'ara-nawawi', min: 40,   ar: 'الأربعون النووية' },
    { ed: 'ara-bukhari', min: 6000, ar: 'صحيح البخاري' },
    { ed: 'ara-muslim', min: 5000, ar: 'صحيح مسلم' }
  ];
  mkdirp(path.join(DATA, 'hadith'));
  const index = [];
  for (const w of WANT) {
    try {
      const j = await get(`${base}/editions/${w.ed}.min.json`);
      const arr = j.hadiths || [];
      if (arr.length < w.min) throw new Error(`عدد الأحاديث ${arr.length} أقل من المتوقع (${w.min})`);
      const hs = arr.map((h) => ({
        n: h.hadithnumber, t: String(h.text || '').trim(),
        g: (h.grades || []).map((g) => ({ by: g.name, g: g.grade })),
        r: h.reference || null
      })).filter((h) => h.t);
      writeJSON(path.join(DATA, 'hadith', `${w.ed}.json`), { edition: w.ed, name: w.ar, count: hs.length, hadiths: hs });
      index.push({ edition: w.ed, name: w.ar, count: hs.length });
      ok(`${w.ar}: ${hs.length} حديثاً`);
    } catch (e) { fail(`${w.ar}: ${e.message}`); }
  }
  writeJSON(path.join(DATA, 'hadith', 'index.json'), { generatedAt: new Date().toISOString(), books: index, note: 'درجات الأحاديث كما وردت في المصدر — راجعها مع متخصص' });
}

/* ═════════════ فحص بدون إنترنت ═════════════ */
function doCheck() {
  log('🔎 فحص الملفات الموجودة (بدون إنترنت)');
  const qdir = path.join(DATA, 'quran');
  if (!fs.existsSync(path.join(qdir, 'manifest.json'))) return fail('بيانات القرآن غير موجودة — شغّل: npm run data');
  for (const ed of ['quran-uthmani', 'ar.muyassar', 'en.sahih']) {
    let total = 0;
    for (let n = 1; n <= 114; n++) {
      const p = path.join(qdir, ed, `${n}.json`);
      if (!fs.existsSync(p)) { fail(`ينقص ${ed}/${n}.json`); continue; }
      const a = readJSON(p).data.ayahs;
      if (a.length !== AYAH_COUNTS[n - 1]) fail(`${ed} سورة ${n}: ${a.length} ≠ ${AYAH_COUNTS[n - 1]}`);
      total += a.length;
    }
    if (total === 6236) ok(`${ed}: ٦٢٣٦ آية`);
  }
  const m = readJSON(path.join(qdir, 'manifest.json'));
  const h = crypto.createHash('sha256');
  for (let n = 1; n <= 114; n++) readJSON(path.join(qdir, 'quran-uthmani', `${n}.json`)).data.ayahs.forEach((a) => h.update(a.text + '\n'));
  if (h.digest('hex') === m.textSha256) ok('بصمة النص مطابقة لما سُجّل عند التنزيل (لم يُعدَّل)'); else fail('بصمة النص لا تطابق — الملفات عُدِّلت بعد التنزيل!');
}

/* ═════════════ التشغيل ═════════════ */
(async () => {
  if (CHECK_ONLY) { doCheck(); return finish(); }
  const any = ['--quran', '--fonts', '--audio', '--tafsir-extra', '--hadith'].some((f) => args.has(f)) || ALL;
  if (!any) { ['--quran', '--fonts', '--audio'].forEach((f) => args.add(f)); }
  const steps = [
    ['--quran', doQuran], ['--audio', doAudioEditions], ['--fonts', doFonts],
    ['--tafsir-extra', doTafsirExtra], ['--hadith', doHadith]
  ];
  for (const [flag, fn] of steps) {
    if (!want(flag)) continue;
    try { await fn(); } catch (e) { fail(`${flag}: ${e.message}`); }
  }
  finish();
})();

function finish() {
  log('\n──────── الملخص ────────');
  log(`نجح: ${report.ok.length} | تحذيرات: ${report.warn.length} | فشل: ${report.fail.length}`);
  if (report.fail.length) { log('\nالإخفاقات:'); report.fail.forEach((f) => log(' - ' + f)); log('\nأعد التشغيل (الأخطاء الشبكية المؤقتة تُعاد محاولتها تلقائياً).'); process.exit(1); }
  log('\n✅ تم. شغّل  npm run data:check  للتأكد لاحقاً أن الملفات لم تتغيّر.');
}
