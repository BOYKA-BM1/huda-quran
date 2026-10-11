/*! Huda mobile performance + tafsir + install fixes */
(function () {
  'use strict';

  function $(id) { return document.getElementById(id); }
  function toast(m) { if (typeof showToast === 'function') showToast(m); }

  /* تفسير من الملفات المحلية — يعمل حتى لو فشل المسار القديم */
  window.openTafsirPopup = function (s, a) {
    s = +s; a = +a;
    var pop = $('tafsir-popup'), ov = $('tafsir-overlay');
    if (!pop) {
      toast('نافذة التفسير غير متاحة');
      return;
    }
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

    // 1) محلي
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
      // 2) شبكة
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

  /* تثبيت PWA — مع شرح بديل لو المتصفح ما يدعمش */
  var _dp = null;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    _dp = e;
    var btn = $('pwa-install-btn');
    if (btn) btn.style.display = 'flex';
  });

  window.installPWA = async function () {
    if (_dp) {
      _dp.prompt();
      try {
        var res = await _dp.userChoice;
        if (res && res.outcome === 'accepted') toast('✅ تم تثبيت التطبيق');
      } catch (e) {}
      _dp = null;
      return;
    }
    var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    var isAndroid = /android/i.test(navigator.userAgent);
    var msg;
    if (isIOS) {
      msg = 'على آيفون: اضغط مشاركة □ ثم «إضافة إلى الشاشة الرئيسية»';
    } else if (isAndroid) {
      msg = 'من قائمة المتصفح ⋮ اختَر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية»';
    } else {
      msg = 'من قائمة المتصفح اختَر تثبيت التطبيق / Install app';
    }
    toast(msg);
    // نافذة مساعدة بسيطة
    if ($('pwa-help-mod')) { $('pwa-help-mod').style.display = 'flex'; return; }
    var d = document.createElement('div');
    d.id = 'pwa-help-mod';
    d.style.cssText = 'position:fixed;inset:0;z-index:20050;background:rgba(0,0,0,.65);display:flex;align-items:flex-end;justify-content:center;padding:1rem;direction:rtl;';
    d.innerHTML = '<div style="background:#0d2b1e;border:1px solid rgba(201,168,76,.35);border-radius:18px 18px 12px 12px;padding:1.2rem;max-width:400px;width:100%;color:#f0e6c0;font-family:Tajawal,sans-serif;">' +
      '<div style="font-weight:700;color:#c9a84c;margin-bottom:.6rem;font-size:1.05rem;">تثبيت هُدى القرآن</div>' +
      '<p style="margin:0 0 1rem;line-height:1.7;font-size:.9rem;color:#c5d4cc;">' + msg + '</p>' +
      '<button type="button" onclick="document.getElementById(\'pwa-help-mod\').style.display=\'none\'" style="width:100%;padding:.7rem;border-radius:12px;border:1px solid rgba(201,168,76,.4);background:rgba(201,168,76,.2);color:#f0d080;font-family:Tajawal,sans-serif;font-weight:700;cursor:pointer;">حسناً</button></div>';
    d.onclick = function (ev) { if (ev.target === d) d.style.display = 'none'; };
    document.body.appendChild(d);
  };

  /* إخفاء شاشة البداية بسرعة أكبر */
  window.addEventListener('load', function () {
    var sp = document.querySelector('.splash, #splash, .app-splash');
    if (sp) {
      setTimeout(function () {
        sp.style.opacity = '0';
        setTimeout(function () { sp.style.display = 'none'; }, 280);
      }, 400);
    }
  });
})();
