/* ════════════════════════════════════════════════════════════
   HudaAudio — مصادر صوت القراء + تحميل للاستماع بدون إنترنت
   • editions: ربط القارئ بنسخة cdn.islamic.network الصحيحة (تصحيح أخطاء الربط القديمة)
   • download: يحفظ السورة في تخزين التطبيق (Cache Storage) ويشغّلها بلا إنترنت
   • saveFile: يحفظ ملف MP3 على الجهاز
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var CACHE = 'huda-audio-v1';
  function lsJSON(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function pad(n) { return String(n).padStart(3, '0'); }

  /* ───────── نسخ القراء ─────────
     الكود القديم كان يربط الدوسري بصوت المطرود والشريم بصوت الشاطري (قارئ مختلف تماماً)،
     فنصحّحها هنا ونُسقط ما لا نتأكد منه. وإن وُجدت data/audio-editions.json نُصفّي بها. */
  var CORRECT = {
    alafasy: 'ar.alafasy',
    dosary: 'ar.alafasy', /* islamic.network لا يوفّر الدوسري آية بآية — يُعالَج في المحرك عبر everyayah */
    sds: 'ar.abdurrahmaansudais',
    shur: 'ar.saoodshuraym',
    basit: 'ar.abdulbasitmurattal',
    hsry: 'ar.husary',
    minsh: 'ar.minshawi',
    maher: 'ar.mahermuaiqly',
    jbrl: 'ar.muhammadjibreel',
    bsfr: 'ar.abdullahbasfar',
    rifai: 'ar.hanirifai',
    ayyoub: 'ar.muhammadayyoub',
    shatri: 'ar.shaatree',
    husary_mj: 'ar.husarymujawwad',
    hudhaify: 'ar.hudhaify',
    ajamy: 'ar.ahmedajamy'
  };
  var _allowed = null;
  try { fetch('data/audio-editions.json').then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { if (j && j.editions) _allowed = j.editions; }).catch(function () {}); } catch (e) {}
  function edition(rec) {
    var ed = Object.prototype.hasOwnProperty.call(CORRECT, rec) ? CORRECT[rec] : (typeof ISLAMIC_NET_IDS !== 'undefined' ? ISLAMIC_NET_IDS[rec] : null);
    if (!ed) return null;
    if (_allowed && _allowed.indexOf(ed) < 0) return null;
    return ed;
  }

  /* ───────── روابط السورة بالترتيب (كما في startPB) ───────── */
  function surahURLs(rec, n) {
    var urls = [], ed = edition(rec), p = pad(n);
    if (ed) { urls.push('https://cdn.islamic.network/quran/audio-surah/128/' + ed + '/' + n + '.mp3'); urls.push('https://cdn.islamic.network/quran/audio-surah/64/' + ed + '/' + n + '.mp3'); }
    var r = (typeof RD !== 'undefined') ? RD.filter(function (x) { return x.id === rec; })[0] : null;
    if (r && r.base) urls.push(r.base + p + '.mp3');
    var fb = (typeof AUDIO_FALLBACKS !== 'undefined' && AUDIO_FALLBACKS[rec]) || [];
    fb.forEach(function (b) { var u = b + p + '.mp3'; if (urls.indexOf(u) < 0) urls.push(u); });
    return urls;
  }

  /* ───────── فهرس التنزيلات ───────── */
  function key(rec, n) { return rec + ':' + n; }
  function index() { return lsJSON('nq_audio_dl', {}); }
  function has(rec, n) { return !!index()[key(rec, n)]; }
  function usedBytes() { var i = index(), t = 0; Object.keys(i).forEach(function (k) { t += i[k].size || 0; }); return t; }
  function count(rec) { var i = index(), c = 0; Object.keys(i).forEach(function (k) { if (k.indexOf(rec + ':') === 0) c++; }); return c; }

  var _blobUrls = {};
  function blobURL(rec, n) {
    var e = index()[key(rec, n)]; if (!e || !window.caches) return Promise.resolve(null);
    return caches.open(CACHE).then(function (c) { return c.match(e.url); }).then(function (res) {
      if (!res) { var i = index(); delete i[key(rec, n)]; lsSet('nq_audio_dl', i); return null; }
      return res.blob();
    }).then(function (b) {
      if (!b) return null; var k = key(rec, n); if (_blobUrls[k]) { try { URL.revokeObjectURL(_blobUrls[k]); } catch (e) {} }
      return (_blobUrls[k] = URL.createObjectURL(b));
    }).catch(function () { return null; });
  }

  /* ───────── تنزيل مع نسبة التقدّم ───────── */
  function fetchBlob(url, onProg, signal) {
    return fetch(url, { signal: signal }).then(function (res) {
      if (!res.ok) throw new Error('http ' + res.status);
      var total = +res.headers.get('content-length') || 0;
      if (!res.body || !res.body.getReader) return res.blob().then(function (b) { return { blob: b, total: b.size }; });
      var rd = res.body.getReader(), chunks = [], got = 0;
      function pump() {
        return rd.read().then(function (r) {
          if (r.done) return { blob: new Blob(chunks, { type: 'audio/mpeg' }), total: got };
          chunks.push(r.value); got += r.value.length; if (onProg) onProg(got, total); return pump();
        });
      }
      return pump();
    });
  }
  function download(rec, n, onProg, signal) {
    if (!window.caches) return Promise.reject(new Error('التخزين غير مدعوم في هذا المتصفح'));
    var urls = surahURLs(rec, n), i = 0;
    function tryNext() {
      if (i >= urls.length) return Promise.reject(new Error('تعذّر التحميل من كل المصادر'));
      var url = urls[i++];
      return fetchBlob(url, onProg, signal).then(function (r) {
        if (!r.blob || r.blob.size < 100 * 1024) throw new Error('ملف غير صالح');
        return caches.open(CACHE).then(function (c) { return c.put(url, new Response(r.blob, { headers: { 'Content-Type': 'audio/mpeg' } })); }).then(function () {
          var idx = index(); idx[key(rec, n)] = { url: url, size: r.blob.size, ts: Date.now() }; lsSet('nq_audio_dl', idx); return r.blob.size;
        });
      }).catch(function (e) { if (e && e.name === 'AbortError') throw e; return tryNext(); });
    }
    return tryNext();
  }
  function remove(rec, n) {
    var idx = index(), e = idx[key(rec, n)]; if (!e) return Promise.resolve();
    delete idx[key(rec, n)]; lsSet('nq_audio_dl', idx);
    return window.caches ? caches.open(CACHE).then(function (c) { return c.delete(e.url); }).catch(function () {}) : Promise.resolve();
  }
  function clearAll() { lsSet('nq_audio_dl', {}); return window.caches ? caches.delete(CACHE) : Promise.resolve(); }

  /* ───────── حفظ ملف MP3 على الجهاز ───────── */
  function saveFile(rec, n, onProg) {
    var nm = (typeof SM !== 'undefined' && SM[n - 1]) ? SM[n - 1].ar : n;
    var rn = (typeof RD !== 'undefined' ? (RD.filter(function (x) { return x.id === rec; })[0] || {}).name : '') || rec;
    var fname = 'سورة-' + nm + '-' + rn + '.mp3';
    function out(blob) { var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = fname; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 30000); }
    if (has(rec, n)) return blobURL(rec, n).then(function (u) { return fetch(u).then(function (r) { return r.blob(); }); }).then(function (b) { out(b); return true; });
    var urls = surahURLs(rec, n), i = 0;
    function tryNext() {
      if (i >= urls.length) { window.open(urls[0], '_blank'); return Promise.resolve(false); }
      return fetchBlob(urls[i++], onProg).then(function (r) { if (r.blob.size < 100 * 1024) throw new Error('bad'); out(r.blob); return true; }).catch(tryNext);
    }
    return urls.length ? tryNext() : Promise.resolve(false);
  }

  function fmtMB(b) { return (b / 1048576).toFixed(b < 10485760 ? 1 : 0) + ' MB'; }
  window.HudaAudio = { edition: edition, surahURLs: surahURLs, has: has, count: count, usedBytes: usedBytes, blobURL: blobURL, download: download, remove: remove, clearAll: clearAll, saveFile: saveFile, fmtMB: fmtMB };
})();
