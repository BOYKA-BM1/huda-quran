/*! Huda — tafsir + install helpers (no layout interference) */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function toast(m) { if (typeof showToast === 'function') showToast(m); }

  /* تفسير محلي أولاً */
  window.openTafsirPopup = function (s, a) {
    s = +s; a = +a;
    var pop = $('tafsir-popup'), ov = $('tafsir-overlay');
    if (!pop) { toast('نافذة التفسير غير متاحة'); return; }
    var title = $('tafsir-title');
    var ayahEl = $('tafsir-ayah-text');
    var body = $('tafsir-body');
    if (title) title.textContent = 'تفسير — الآية ' + a;
    if (ayahEl) ayahEl.textContent = '';
    if (body) body.innerHTML = '<div class="tafsir-popup-loading">جارٍ التحميل...</div>';
    pop.style.display = 'flex';
    pop.classList.add('show');
    if (ov) { ov.style.display = 'block'; ov.classList.add('show'); }

    function done(ayahText, tafsirText) {
      if (ayahEl && ayahText) ayahEl.textContent = ayahText;
      if (body) {
        body.textContent = '';
        var d = document.createElement('div');
        d.className = 'tafsir-txt';
        d.style.cssText = 'line-height:1.9;font-size:1rem;color:var(--tx,#e8e0d0);padding:.5rem 0;';
        d.textContent = tafsirText || 'لم يتوفر التفسير';
        body.appendChild(d);
      }
    }
    function fail(msg) {
      if (body) body.innerHTML = '<div class="tafsir-popup-loading">' + (msg || 'تعذّر التحميل') + '</div>';
    }

    Promise.all([
      fetch('data/quran/ar.muyassar/' + s + '.json').then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }),
      fetch('data/quran/quran-uthmani/' + s + '.json').then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })
    ]).then(function (pair) {
      var loc = pair[0], uth = pair[1];
      var tHit = loc && loc.data && loc.data.ayahs && loc.data.ayahs.filter(function (y) {
        return +y.numberInSurah === a || +y.number === a;
      })[0];
      var uHit = uth && uth.data && uth.data.ayahs && uth.data.ayahs.filter(function (y) {
        return +y.numberInSurah === a;
      })[0];
      if (tHit && (tHit.text || tHit.tafsir)) {
        done(uHit && uHit.text ? uHit.text : (tHit.text || ''), tHit.text || tHit.tafsir || '');
        return;
      }
      return fetch('https://api.alquran.cloud/v1/ayah/' + s + ':' + a + '/editions/ar.muyassar,quran-uthmani')
        .then(function (r) { return r.json(); })
        .then(function (j) {
          var list = Array.isArray(j.data) ? j.data : (j.data ? [j.data] : []);
          var taf = '', ay = '';
          list.forEach(function (item) {
            var id = (item.edition && item.edition.identifier) || '';
            if (id.indexOf('muyassar') >= 0) taf = item.text || '';
            if (id.indexOf('uthmani') >= 0 || id.indexOf('quran') >= 0) ay = item.text || ay;
          });
          if (!taf && list[0]) taf = list[0].text || '';
          if (!ay && list[1]) ay = list[1].text || '';
          done(ay, taf);
        });
    }).catch(function () { fail('⚠ تعذّر تحميل التفسير — تحقق من الاتصال'); });
  };

  window.closeTafsir = function () {
    var p = $('tafsir-popup'), o = $('tafsir-overlay');
    if (p) { p.classList.remove('show'); p.style.display = 'none'; }
    if (o) { o.classList.remove('show'); o.style.display = 'none'; }
  };

  /* تثبيت PWA: انتقل إلى js/pwa.js */
})();
