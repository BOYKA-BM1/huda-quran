/* Huda UX v799 — exit confirm + smooth scroll + hadiths force-render */
(function () {
  'use strict';
  var _exitArmed = false;
  var _exitTimer = null;

  function toast(msg) {
    try {
      var t = document.getElementById('huda-exit-toast');
      if (!t) {
        t = document.createElement('div');
        t.id = 'huda-exit-toast';
        t.setAttribute('style', 'position:fixed;bottom:88px;left:50%;transform:translateX(-50%);background:rgba(20,30,20,.94);color:#f5f0e0;padding:10px 18px;border-radius:12px;font-size:.9rem;z-index:99999;border:1px solid rgba(201,168,76,.35);box-shadow:0 8px 24px rgba(0,0,0,.4);pointer-events:none;font-family:Tajawal,sans-serif;white-space:nowrap');
        document.body.appendChild(t);
      }
      t.textContent = msg;
      t.style.opacity = '1';
      clearTimeout(t._h);
      t._h = setTimeout(function () { t.style.opacity = '0'; }, 1800);
    } catch (e) {}
  }

  function isHome() {
    try {
      var home = document.getElementById('page-home');
      if (home && home.classList.contains('on')) return true;
      var pages = document.querySelectorAll('.pg.on');
      if (!pages.length) return true;
      return pages[0].id === 'page-home';
    } catch (e) { return true; }
  }

  function handleBack(e) {
    try {
      if (typeof e !== 'undefined' && e && e.preventDefault) e.preventDefault();
      // close drawers/modals first
      var drawer = document.getElementById('side-menu') || document.querySelector('.drawer.on, .side-drawer.on, #nav-drawer.on');
      if (drawer && (drawer.classList.contains('on') || drawer.classList.contains('open'))) {
        drawer.classList.remove('on', 'open');
        return;
      }
      var mod = document.querySelector('.pmod.on, .modal.on, #pmod.on');
      if (mod) { mod.classList.remove('on'); return; }

      if (!isHome()) {
        if (typeof SP === 'function') SP('home');
        else if (typeof goHome === 'function') goHome();
        else history.back();
        return;
      }

      // On home: double-back to exit
      if (_exitArmed) {
        _exitArmed = false;
        clearTimeout(_exitTimer);
        try {
          if (window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.App) {
            Capacitor.Plugins.App.exitApp();
            return;
          }
        } catch (err) {}
        // web fallback
        try { window.close(); } catch (err2) {}
        return;
      }
      _exitArmed = true;
      toast('اضغط مرة أخرى للخروج');
      _exitTimer = setTimeout(function () { _exitArmed = false; }, 2000);
    } catch (err) {}
  }

  // Capacitor back button
  function bindCapBack() {
    try {
      if (window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.App) {
        Capacitor.Plugins.App.addListener('backButton', function (res) {
          handleBack();
        });
        return true;
      }
    } catch (e) {}
    return false;
  }

  // history-based back for web
  function bindHistory() {
    try {
      history.pushState({ huda: 1 }, '');
      window.addEventListener('popstate', function () {
        history.pushState({ huda: 1 }, '');
        handleBack();
      });
    } catch (e) {}
  }

  // Force render hadiths when page opens
  function forceHadiths() {
    try {
      var list = window.HADITHS || [];
      var el = document.getElementById('hadith-list');
      var counter = document.getElementById('hadith-counter');
      var catsEl = document.getElementById('hadith-cats');
      if (!el) return;
      if (!list.length) {
        if (counter) counter.textContent = '0 حديث';
        el.innerHTML = '<p style="text-align:center;color:#c9a84c;padding:2rem">لا توجد أحاديث محمّلة</p>';
        return;
      }
      if (typeof renderHadithPage === 'function') {
        renderHadithPage();
        return;
      }
      // fallback render
      var cats = ['الكل'].concat(Array.from(new Set(list.map(function (h) { return h.cat; }))));
      if (catsEl) {
        catsEl.innerHTML = cats.map(function (c, i) {
          return '<button type="button" class="hcat-btn' + (i === 0 ? ' on' : '') + '" data-cat="' + c + '">' + c + '</button>';
        }).join('');
        catsEl.querySelectorAll('.hcat-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            catsEl.querySelectorAll('.hcat-btn').forEach(function (b) { b.classList.remove('on'); });
            btn.classList.add('on');
            paint(btn.getAttribute('data-cat'));
          });
        });
      }
      function paint(cat) {
        var q = (document.getElementById('hadith-search') || {}).value || '';
        q = String(q).trim();
        var filtered = list.filter(function (h) {
          var catOk = !cat || cat === 'الكل' || h.cat === cat;
          var searchOk = !q || (h.ar && h.ar.indexOf(q) >= 0) || (h.src && h.src.indexOf(q) >= 0);
          return catOk && searchOk;
        });
        if (counter) counter.textContent = filtered.length + ' حديث';
        el.innerHTML = filtered.map(function (h) {
          return '<div class="hadith-card" style="background:rgba(0,0,0,.25);border:1px solid rgba(201,168,76,.2);border-radius:14px;padding:1rem;margin:.75rem 0;">' +
            (h.cat ? '<div style="color:#c9a84c;font-size:.75rem;margin-bottom:.4rem;">🏷️ ' + h.cat + '</div>' : '') +
            '<div class="hadith-ar" style="color:#f5f0e0;font-size:1.15rem;line-height:1.95;direction:rtl;text-align:right;font-family:\'Amiri Quran\',\'Scheherazade New\',serif;">' + (h.ar || '') + '</div>' +
            '<div class="hadith-src" style="color:#c9a84c;font-size:.8rem;margin-top:.45rem;">📚 ' + (h.src || '') + '</div></div>';
        }).join('');
      }
      paint('الكل');
      var search = document.getElementById('hadith-search');
      if (search && !search._hudaBound) {
        search._hudaBound = true;
        search.addEventListener('input', function () {
          var on = catsEl && catsEl.querySelector('.hcat-btn.on');
          paint(on ? on.getAttribute('data-cat') : 'الكل');
        });
      }
    } catch (e) { console.error('forceHadiths', e); }
  }

  // Hook SP navigation
  function hookSP() {
    try {
      if (typeof window.SP === 'function' && !window.SP._huda799) {
        var orig = window.SP;
        window.SP = function (id) {
          var r = orig.apply(this, arguments);
          if (id === 'hadiths') setTimeout(forceHadiths, 40);
          return r;
        };
        window.SP._huda799 = true;
      }
    } catch (e) {}
  }

  // Performance: reduce heavy effects on mobile
  function perfCSS() {
    try {
      var s = document.getElementById('huda-perf-799');
      if (s) return;
      s = document.createElement('style');
      s.id = 'huda-perf-799';
      s.textContent = [
        'html,body{-webkit-overflow-scrolling:touch!important;scroll-behavior:auto!important;touch-action:manipulation}',
        '.pg,.drawer,.side-drawer,#rd-scroll,.mushaf-scroll,main{-webkit-overflow-scrolling:touch!important}',
        '@media (max-width:900px){',
        '  .bottom-nav,.drawer,.side-drawer,.hv-card{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}',
        '  *{animation-duration:.01ms!important;animation-iteration-count:1!important}',
        '  .pg{transform:translateZ(0);will-change:auto}',
        '}',
        '#hadith-cats{display:flex;flex-wrap:wrap;gap:.4rem;justify-content:flex-start;margin:.6rem 0}',
        '#hadith-cats .hcat-btn{background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.28);color:#f0d080;border-radius:999px;padding:.35rem .85rem;font-size:.8rem;font-family:Tajawal,sans-serif}',
        '#hadith-cats .hcat-btn.on{background:rgba(201,168,76,.35);color:#fff;border-color:#c9a84c}',
        '#hv-cd,.hv-cd{display:block!important;width:100%!important;text-align:center!important;margin:.35rem auto!important;font-variant-numeric:tabular-nums!important;direction:ltr!important;unicode-bidi:isolate!important;font-size:clamp(1.85rem,7vw,2.4rem)!important;font-weight:700!important;color:var(--gold,#C9A84C)!important}'
      ].join('\n');
      document.head.appendChild(s);
    } catch (e) {}
  }

  function init() {
    perfCSS();
    bindCapBack();
    bindHistory();
    hookSP();
    // if already on hadiths
    setTimeout(function () {
      hookSP();
      var p = document.getElementById('page-hadiths');
      if (p && p.classList.contains('on')) forceHadiths();
    }, 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  // also after full load
  window.addEventListener('load', function () {
    hookSP();
    setTimeout(forceHadiths, 500);
  });
})();
