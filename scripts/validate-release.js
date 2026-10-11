#!/usr/bin/env node
'use strict';
/**
 * Pre-release gate for Huda Quran.
 * Exit 1 on blocking errors; warnings print but do not fail unless --strict.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const WWW = path.join(ROOT, 'www');
const strict = process.argv.includes('--strict');
const errors = [];
const warns = [];

const ok = (m) => console.log('  ✔ ' + m);
const warn = (m) => { warns.push(m); console.log('  ⚠ ' + m); };
const fail = (m) => { errors.push(m); console.log('  ✘ ' + m); };

function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}
function existsWww(rel) {
  return fs.existsSync(path.join(WWW, rel));
}
function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

const AYAH_COUNTS = [7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6];

console.log('\n🔍 Huda validate-release\n');

// —— Project skeleton ——
console.log('• Project files');
['package.json', 'capacitor.config.json', 'www/index.html', 'www/sw.js', 'www/manifest.webmanifest',
  'backend/server.js', 'backend/package.json', 'backend/.env.example', 'scripts/fetch-data.js'].forEach((f) => {
  exists(f) ? ok(f) : fail('Missing ' + f);
});
if (!exists('.gitignore')) warn('No root .gitignore');
else ok('.gitignore');

// —— Secrets hygiene ——
console.log('\n• Secrets hygiene');
['.env', 'backend/.env'].forEach((f) => {
  if (exists(f)) warn(f + ' exists locally (OK) — ensure it is gitignored and never committed');
});
// crude scan of www for groq/openai keys patterns (not full secret scanner)
try {
  const idx = fs.readFileSync(path.join(WWW, 'index.html'), 'utf8');
  if (/gsk_[a-zA-Z0-9]{20,}/.test(idx) || /api[_-]?key\s*[:=]\s*['\"][a-zA-Z0-9]{20,}/i.test(idx)) {
    fail('Possible API key pattern in www/index.html');
  } else ok('No obvious API key pattern in index.html');
} catch (_) { /* ignore */ }

// —— Quran data ——
console.log('\n• Quran offline data');
const uthDir = path.join(WWW, 'data', 'quran', 'quran-uthmani');
const pagesDir = path.join(WWW, 'data', 'quran', 'pages');
const manifestPath = path.join(WWW, 'data', 'quran', 'manifest.json');

if (!fs.existsSync(uthDir)) {
  fail('www/data/quran/quran-uthmani missing — run: npm run data');
} else {
  let total = 0;
  for (let n = 1; n <= 114; n++) {
    const fp = path.join(uthDir, n + '.json');
    if (!fs.existsSync(fp)) {
      fail('Missing surah file ' + n + '.json');
      continue;
    }
    try {
      const j = readJSON(fp);
      const ays = j.data && j.data.ayahs;
      if (!Array.isArray(ays)) {
        fail('Surah ' + n + ': invalid ayahs array');
        continue;
      }
      if (ays.length !== AYAH_COUNTS[n - 1]) {
        fail('Surah ' + n + ': expected ' + AYAH_COUNTS[n - 1] + ' ayahs, got ' + ays.length);
      }
      total += ays.length;
    } catch (e) {
      fail('Surah ' + n + ': ' + e.message);
    }
  }
  if (total === 6236) ok('114 surahs, 6236 ayahs (structure)');
  else if (total > 0) fail('Total ayahs ' + total + ' (expected 6236)');
}

if (!fs.existsSync(pagesDir)) {
  fail('www/data/quran/pages missing — run: npm run data');
} else {
  let pc = 0;
  for (let p = 1; p <= 604; p++) {
    if (fs.existsSync(path.join(pagesDir, p + '.json'))) pc++;
  }
  if (pc === 604) ok('604 mushaf pages present');
  else fail('Mushaf pages: ' + pc + '/604');
}

if (fs.existsSync(manifestPath)) {
  try {
    const m = readJSON(manifestPath);
    if (m && (m.sha256 || m.textSha256 || m.fingerprint || m.hash || m.contentHash)) {
      ok('manifest.json has integrity fingerprint (' +
        ['sha256','textSha256','fingerprint','hash','contentHash'].filter(function(k){ return !!m[k]; }).join(', ') + ')');
    } else warn('manifest.json present but no fingerprint field detected');
  } catch (e) {
    fail('manifest.json invalid JSON: ' + e.message);
  }
} else {
  fail('www/data/quran/manifest.json missing — run: npm run data');
}

// Optional editions
['ar.muyassar', 'en.sahih'].forEach((ed) => {
  const d = path.join(WWW, 'data', 'quran', ed);
  if (!fs.existsSync(d)) warn('Optional edition missing: ' + ed);
  else ok('Edition present: ' + ed);
});

// —— Fonts ——
console.log('\n• Local fonts');
const fontList = [
  'fonts/AmiriQuran-400-arabic.woff2',
  'fonts/Tajawal-400-arabic.woff2',
  'fonts/ScheherazadeNew-400-arabic.woff2'
];
fontList.forEach((f) => (existsWww(f) ? ok(f) : fail('Missing ' + f)));
existsWww('css/fonts.css') ? ok('css/fonts.css') : warn('css/fonts.css missing');

// —— Service worker shell files ——
console.log('\n• Service Worker shell references');
try {
  const sw = fs.readFileSync(path.join(WWW, 'sw.js'), 'utf8');
  const m = sw.match(/const SHELL\s*=\s*\[([\s\S]*?)\];/);
  if (!m) warn('Could not parse SHELL array in sw.js');
  else {
    const urls = [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]).filter((u) => u !== './');
    let missing = 0;
    urls.forEach((u) => {
      const rel = u.replace(/^\//, '');
      if (!existsWww(rel) && !existsWww(path.normalize(rel))) {
        fail('SW SHELL missing file: ' + u);
        missing++;
      }
    });
    if (!missing) ok('All ' + urls.length + ' SHELL assets exist on disk');
    if (!/modern-ui\.css/.test(sw)) warn('SW SHELL does not list css/modern-ui.css');
    else ok('SW includes modern-ui.css');
  }
} catch (e) {
  fail('SW read error: ' + e.message);
}

// —— Capacitor / Android ——
console.log('\n• Capacitor / Android');
ok('capacitor.config.json present');
if (fs.existsSync(path.join(ROOT, 'android'))) ok('android/ platform present');
else warn('android/ not present — run: npm run android:add (needs Android Studio/SDK for APK)');

// —— Backend ——
console.log('\n• Backend');
exists('backend/server.js') ? ok('backend/server.js') : fail('backend/server.js missing');
const envEx = path.join(ROOT, 'backend', '.env.example');
if (fs.existsSync(envEx)) {
  const t = fs.readFileSync(envEx, 'utf8');
  ['GROQ_API_KEY', 'FRONTEND_URL', 'PORT'].forEach((k) => {
    t.includes(k) ? ok('.env.example has ' + k) : warn('.env.example missing ' + k);
  });
}

// —— Summary ——
console.log('\n──────── summary ────────');
console.log('errors: ' + errors.length + ' | warnings: ' + warns.length);
if (errors.length) {
  console.log('\nBlocking:');
  errors.forEach((e) => console.log(' - ' + e));
  console.log('\nFix data with: npm run data && npm run validate:data\n');
  process.exit(1);
}
if (strict && warns.length) {
  console.log('\nStrict mode: warnings treated as failure');
  process.exit(1);
}
console.log('✅ validate-release passed' + (warns.length ? ' (with warnings)' : '') + '\n');
process.exit(0);
