/* ════════════════════════════════════════════════════════════
   HudaQuran — طبقة بيانات القرآن
   الترتيب: ملفات محلية (data/quran/…) ← ثم الشبكة (alquran.cloud)
   الملفات المحلية تُولَّد بالأمر:  npm run data
   تعمل بنفس شكل استجابات api.alquran.cloud، فلا يتغير باقي الكود.
   ════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  var BASE = 'data/quran/';
  var ALIAS = { 'ar.uthmani': 'quran-uthmani' };   // الاسم الصحيح للنسخة العثمانية في alquran.cloud
  var TEXT_EDITIONS = /^(quran-|ar\.uthmani$)/;
  var _mem = {};
  var _index = null, _indexFailed = false;

  function jsonResponse(obj) {
    return new Response(JSON.stringify(obj), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // تطبيع النص العربي (إزالة التشكيل وتوحيد الحروف) — للبحث ولكشف البسملة
  function norm(s) {
    return String(s || '')
      .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, '')
      .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
      .replace(/\s+/g, ' ').trim();
  }

  // بعض مصادر القرآن تُلصق البسملة بأول آية في كل سورة (عدا الفاتحة والتوبة)،
  // والتطبيق يعرض البسملة منفصلة، فنفصلها هنا لمنع التكرار. الدالة آمنة التكرار.
  var BISM = ['بسم', 'الله', 'الرحمن', 'الرحيم'];
  function stripBismillah(surahNo, ayahs) {
    if (!ayahs || !ayahs.length || surahNo === 1 || surahNo === 9) return ayahs;
    var a = ayahs[0];
    a.text = String(a.text || '').replace(/^\uFEFF/, '');
    var words = String(a.text || '').split(/\s+/).filter(Boolean);
    if (words.length >= 4) {
      var ok = true;
      for (var i = 0; i < 4; i++) { if (norm(words[i]) !== BISM[i]) { ok = false; break; } }
      if (ok) a.text = words.slice(4).join(' ').trim();
    }
    // احتياطي: إزالة بالنص المطبّع لو التقسيم فشل
    var nrmFull = norm(a.text);
    var prefix = 'بسم الله الرحمن الرحيم';
    if (nrmFull.indexOf(prefix) === 0) {
      // احذف أول 4 كلمات من النص الأصلي
      var w2 = String(a.text || '').split(/\s+/).filter(Boolean);
      if (w2.length > 4) a.text = w2.slice(4).join(' ').trim();
    }
    return ayahs;
  }
  function fixSurahJson(j, n) {
    if (j && j.data && Array.isArray(j.data.ayahs)) stripBismillah(n, j.data.ayahs);
    return j;
  }

  function loadLocal(path) {
    if (_mem[path]) return Promise.resolve(_mem[path]);
    return fetch(BASE + path).then(function (r) {
      if (!r.ok) throw new Error('local miss: ' + path);
      return r.json();
    }).then(function (j) {
      if (!j || !j.data) throw new Error('bad local file: ' + path);
      _mem[path] = j; return j;
    });
  }

  function loadIndex() {
    if (_index) return Promise.resolve(_index);
    if (_indexFailed) return Promise.reject(new Error('no index'));
    return fetch(BASE + 'search-index.json').then(function (r) {
      if (!r.ok) throw new Error('no index'); return r.json();
    }).then(function (j) {
      if (!j || !Array.isArray(j.ayahs)) throw new Error('bad index'); _index = j; return j;
    }).catch(function (e) { _indexFailed = true; throw e; });
  }

  function searchLocal(query) {
    return loadIndex().then(function (idx) {
      var q = norm(decodeURIComponent(query)), out = [];
      if (q.length < 2) return jsonResponse({ code: 200, data: { count: 0, matches: [] } });
      for (var i = 0; i < idx.ayahs.length && out.length < 80; i++) {
        var a = idx.ayahs[i]; // [surah, ayah, textUthmani, textNormalized]
        if (a[3].indexOf(q) !== -1) {
          out.push({ text: a[2], numberInSurah: a[1],
            surah: { number: a[0], name: idx.surahs[a[0] - 1] || '', englishName: idx.surahs[a[0] - 1] || '' } });
        }
      }
      return jsonResponse({ code: 200, status: 'OK', data: { count: out.length, matches: out } });
    });
  }

  // يرجع Promise<Response> محلياً، أو null إن لم يكن الطلب مما نخدمه محلياً
  function handleLocal(url) {
    var m;
    if ((m = url.match(/\/v1\/surah\/(\d+)(?:\/([\w.\-]+))?$/))) {
      var n = parseInt(m[1], 10), ed = ALIAS[m[2]] || m[2] || 'quran-uthmani';
      return loadLocal(ed + '/' + n + '.json').then(function (j) { return jsonResponse(TEXT_EDITIONS.test(ed) ? fixSurahJson(j, n) : j); });
    }
    if ((m = url.match(/\/v1\/ayah\/(\d+):(\d+)\/editions\/([\w.\-]+)$/))) {
      var an = parseInt(m[2], 10), ed2 = ALIAS[m[3]] || m[3];
      return loadLocal(ed2 + '/' + m[1] + '.json').then(function (j) {
        var a = (j.data.ayahs || []).filter(function (x) { return x.numberInSurah === an; })[0];
        if (!a) throw new Error('ayah not found');
        return jsonResponse({ code: 200, status: 'OK', data: a });
      });
    }
    if ((m = url.match(/\/v1\/page\/(\d+)\/(?:quran-uthmani|ar\.uthmani)$/))) {
      return loadLocal('pages/' + parseInt(m[1], 10) + '.json').then(jsonResponse);
    }
    if ((m = url.match(/\/v1\/ayah\/(\d+):(\d+)\/([\w.\-]+)$/)) && m[3] !== 'editions') {
      var sn3 = parseInt(m[1], 10), n3 = parseInt(m[2], 10), ed3 = ALIAS[m[3]] || m[3];
      return loadLocal(ed3 + '/' + sn3 + '.json').then(function (j) {
        var a = (j.data.ayahs || []).filter(function (x) { return x.numberInSurah === n3; })[0];
        if (!a) throw new Error('ayah not found');
        return jsonResponse({ code: 200, status: 'OK', data: Object.assign({}, a, { surah: { number: sn3, name: j.data.name } }) });
      });
    }
    if ((m = url.match(/\/v1\/search\/([^/]+)\/all\/ar$/))) return searchLocal(m[1]);
    return null;
  }

  // مسار الشبكة: نصحّح اسم النسخة، ونطبّق إصلاح البسملة على نصوص القرآن
  function viaNetwork(url, opts) {
    var u = url.replace(/\/ar\.uthmani(?=$|\?)/, '/quran-uthmani');
    var m = u.match(/\/v1\/surah\/(\d+)\/([\w.\-]+)$/);
    var p = fetch(u, opts);
    if (m && TEXT_EDITIONS.test(m[2])) {
      var n = parseInt(m[1], 10);
      return p.then(function (r) {
        if (!r.ok) return r;
        return r.clone().json().then(function (j) { return jsonResponse(fixSurahJson(j, n)); }).catch(function () { return r; });
      });
    }
    return p;
  }

  function hfetch(url, opts) {
    var s = String(url), p = null;
    if (s.indexOf('api.alquran.cloud') !== -1) { try { p = handleLocal(s); } catch (e) { p = null; } }
    if (!p) return s.indexOf('api.alquran.cloud') !== -1 ? viaNetwork(s, opts) : fetch(url, opts);
    return p.catch(function () { return viaNetwork(s, opts); });
  }

  global.HudaQuran = {
    fetch: hfetch, norm: norm, stripBismillah: stripBismillah,
    status: function () {
      return fetch(BASE + 'manifest.json').then(function (r) { return r.ok ? r.json() : { complete: false }; })
        .catch(function () { return { complete: false }; });
    }
  };
})(window);
