/*! Huda — tafsir + install helpers */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function toast(m) {
    if (typeof showToast === 'function') showToast(m);
    else if (typeof toast === 'function' && toast !== arguments.callee) { /* skip */ }
  }
  function showMsg(m) {
    if (typeof showToast === 'function') showToast(m);
    else if (typeof window.toast === 'function') window.toast(m);
  }

  window.openTafsirPopup = function (s, a) {
    s = +s; a = +a;
    window._taf = { s: s, a: a };
    try { localStorage.setItem('nq_last_ayah', JSON.stringify({ s: s, a: a })); } catch (e) {}
    var pop = $('tafsir-popup'), ov = $('tafsir-overlay');
    if (!pop) { showMsg('نافذة التفسير غير متاحة'); return; }
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
    Promise.all([
      fetch('data/quran/ar.muyassar/' + s + '.json').then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }),
      fetch('data/quran/quran-uthmani/' + s + '.json').then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })
    ]).then(function (pair) {
      var loc = pair[0], uth = pair[1];
      var tHit = loc && loc.data && loc.data.ayahs && loc.data.ayahs.filter(function (y) { return +y.numberInSurah === +a || +y.number === +a; })[0];
      var uHit = uth && uth.data && uth.data.ayahs && uth.data.ayahs.filter(function (y) { return +y.numberInSurah === +a; })[0];
      if (tHit && (tHit.text || tHit.tafsir)) {
        done(uHit && uHit.text ? uHit.text : '', tHit.text || tHit.tafsir || '');
        return;
      }
      return fetch('https://api.alquran.cloud/v1/ayah/' + s + ':' + a + '/editions/ar.muyassar')
        .then(function (r) { return r.json(); })
        .then(function (j) {
          var tx = (j.data && (j.data.text || (j.data[0] && j.data[0].text))) || '';
          done((uHit && uHit.text) || '', tx);
        });
    }).catch(function () {
      if (body) body.innerHTML = '<div class="tafsir-popup-loading">تعذّر تحميل التفسير</div>';
    });
  };

  window.closeTafsir = function () {
    var p = $('tafsir-popup'), o = $('tafsir-overlay');
    if (p) { p.classList.remove('show'); p.style.display = 'none'; }
    if (o) { o.classList.remove('show'); o.style.display = 'none'; }
  };

  window.tafsirPlay = function () {
    var s = 0, a = 0;
    if (window._taf) { s = +window._taf.s || 0; a = +window._taf.a || 0; }
    if (!s || !a) {
      try {
        var last = JSON.parse(localStorage.getItem('nq_last_ayah') || 'null');
        if (last) { s = +last.s || 0; a = +last.a || 0; }
      } catch (e) {}
    }
    if (!s || !a) {
      try {
        var pos = JSON.parse(localStorage.getItem('nq_pos') || 'null');
        if (pos) { s = +pos.s || s; a = +pos.a || a; }
      } catch (e) {}
    }
    if (!s || !a) {
      var title = $('tafsir-title');
      var tx = title ? (title.textContent || '') : '';
      var m = tx.match(/(\d+)/);
      if (m) a = +m[1];
      var el = document.querySelector('.ay[data-s][data-a], #mp-in .ay[data-s]');
      if (el) {
        s = s || +el.getAttribute('data-s') || 0;
        a = a || +el.getAttribute('data-a') || 0;
      }
    }
    if (!s || !a) { showMsg('لا يمكن تحديد الآية'); return; }

    var pad = function (n) { n = String(n); while (n.length < 3) n = '0' + n; return n; };
    var rec = localStorage.getItem('nq_rec') || 'alafasy';
    var folderMap = {
      alafasy: 'Alafasy_128kbps', dosary: 'Yasser_Ad-Dussary_128kbps',
      sds: 'Abdurrahmaan_As-Sudais_192kbps', shur: 'Saood_ash-Shuraym_128kbps',
      basit: 'Abdul_Basit_Murattal_192kbps', hsry: 'Husary_128kbps',
      minsh: 'Minshawy_Murattal_128kbps', maher: 'MaherAlMuaiqly128kbps',
      shatri: 'Abu_Bakr_Ash-Shaatree_128kbps', bsfr: 'Abdullah_Basfar_192kbps'
    };
    var folder = folderMap[rec] || 'Alafasy_128kbps';
    var ga = a;
    try {
      if (window.SM) {
        ga = 0;
        for (var i = 0; i < s - 1; i++) ga += (SM[i] && SM[i].ay) || 0;
        ga += a;
      }
    } catch (e) {}
    var urls = [
      'https://everyayah.com/data/' + folder + '/' + pad(s) + pad(a) + '.mp3',
      'https://everyayah.com/data/Alafasy_128kbps/' + pad(s) + pad(a) + '.mp3',
      'https://cdn.islamic.network/quran/audio/128/ar.alafasy/' + ga + '.mp3'
    ];
    var au = $('tafsir-ayah-audio');
    if (!au) {
      au = document.createElement('audio');
      au.id = 'tafsir-ayah-audio';
      au.setAttribute('playsinline', '');
      document.body.appendChild(au);
    }
    try { au.pause(); au.currentTime = 0; } catch (e) {}
    var idx = 0;
    function tryNext() {
      if (idx >= urls.length) { showMsg('تعذّر تشغيل الآية'); return; }
      var url = urls[idx++];
      au.onerror = function () { tryNext(); };
      au.src = url;
      var p = au.play();
      if (p && p.catch) p.catch(function () { tryNext(); });
    }
    tryNext();
    showMsg('▶ الآية ' + a);
  };

  // زر التثبيت — إن وُجد
  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('pwa-install-btn');
    if (btn && window.deferredPrompt) {
      btn.style.display = '';
    }
  });
})();
