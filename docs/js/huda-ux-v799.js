/* Huda UX v801 — exit only on home (double back), stack back, hadiths force, perf */
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
        t.setAttribute('style', 'position:fixed;bottom:88px;left:50%;transform:translateX(-50%);background:rgba(20,30,20,.94);color:#f5f0e0;padding:10px 18px;border-radius:12px;font-size:.9rem;z-index:99999;border:1px solid rgba(201,168,76,.35);box-shadow:0 8px 24px rgba(0,0,0,.4);pointer-events:none;font-family:Tajawal,sans-serif;white-space:nowrap;transition:opacity .2s;opacity:0');
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
      if (!home) return true;
      if (home.classList.contains('on')) return true;
      var on = document.querySelector('.pg.on');
      return !on || on.id === 'page-home';
    } catch (e) { return true; }
  }

  function goBackInApp() {
    try {
      if (typeof _pageHistory !== 'undefined' && _pageHistory && _pageHistory.length > 1) {
        _pageHistory.pop();
        var prev = _pageHistory[_pageHistory.length - 1] || 'home';
        if (typeof SP === 'function') { SP(prev, false); return; }
      }
      if (typeof SP === 'function') SP('home', false);
    } catch (e) {
      try { if (typeof SP === 'function') SP('home', false); } catch (e2) {}
    }
  }

  function handleBack(e) {
    try {
      if (e && e.preventDefault) e.preventDefault();
      var drawer = document.getElementById('side-menu') || document.querySelector('.drawer.on, .side-drawer.on, #nav-drawer.on');
      if (drawer && (drawer.classList.contains('on') || drawer.classList.contains('open'))) {
        drawer.classList.remove('on', 'open');
        _exitArmed = false;
        return;
      }
      var mod = document.querySelector('.pmod.on, .modal.on, #pmod.on, #rmod.on');
      if (mod) { mod.classList.remove('on'); _exitArmed = false; return; }

      // Not home → navigate back in stack, NEVER show exit toast
      if (!isHome()) {
        _exitArmed = false;
        clearTimeout(_exitTimer);
        goBackInApp();
        return;
      }

      // Home only: double-back to exit
      if (_exitArmed) {
        _exitArmed = false;
        clearTimeout(_exitTimer);
        try {
          if (window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.App) {
            Capacitor.Plugins.App.exitApp();
            return;
          }
        } catch (err) {}
        return;
      }
      _exitArmed = true;
      toast('اضغط مرة أخرى للخروج');
      _exitTimer = setTimeout(function () { _exitArmed = false; }, 2000);
    } catch (err) {}
  }

  function bindCapBack() {
    try {
      if (window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.App) {
        Capacitor.Plugins.App.addListener('backButton', function () { handleBack(); });
        return true;
      }
    } catch (e) {}
    return false;
  }

  function bindHistory() {
    try {
      history.pushState({ huda: 1 }, '');
      window.addEventListener('popstate', function () {
        history.pushState({ huda: 1 }, '');
        handleBack();
      });
    } catch (e) {}
  }

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
      if (typeof renderHadithPage === 'function') { renderHadithPage(); return; }
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
        var q = String((document.getElementById('hadith-search') || {}).value || '').trim();
        var filtered = list.filter(function (h) {
          var catOk = !cat || cat === 'الكل' || h.cat === cat;
          var searchOk = !q || (h.ar && h.ar.indexOf(q) >= 0) || (h.src && h.src.indexOf(q) >= 0);
          return catOk && searchOk;
        });
        if (counter) counter.textContent = filtered.length + ' حديث';
        el.innerHTML = filtered.map(function (h) {
          return '<div class="hadith-card" style="background:rgba(0,0,0,.25);border:1px solid rgba(201,168,76,.2);border-radius:14px;padding:1rem;margin:.75rem 0;">' +
            (h.cat ? '<div style="color:#c9a84c;font-size:.75rem;margin-bottom:.4rem;">🏷️ ' + h.cat + '</div>' : '') +
            '<div style="color:#f5f0e0;font-size:1.15rem;line-height:1.95;direction:rtl;text-align:right;font-family:\'Amiri Quran\',\'Scheherazade New\',serif;">' + (h.ar || '') + '</div>' +
            '<div style="color:#c9a84c;font-size:.8rem;margin-top:.45rem;">📚 ' + (h.src || '') + '</div></div>';
        }).join('');
      }
      paint('الكل');
    } catch (e) { console.error('forceHadiths', e); }
  }

  function hookSP() {
    try {
      if (typeof window.SP === 'function' && !window.SP._huda801) {
        var orig = window.SP;
        window.SP = function (id) {
          _exitArmed = false;
          var r = orig.apply(this, arguments);
          if (id === 'hadiths') setTimeout(forceHadiths, 40);
          return r;
        };
        window.SP._huda801 = true;
      }
    } catch (e) {}
  }

  function perfCSS() {
    try {
      if (document.getElementById('huda-perf-801')) return;
      var s = document.createElement('style');
      s.id = 'huda-perf-801';
      s.textContent = [
        'html,body{-webkit-overflow-scrolling:touch!important;scroll-behavior:auto!important;touch-action:manipulation}',
        '@media (max-width:900px){.bottom-nav,.drawer,.side-drawer{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}}',
        '#hadith-cats{display:flex;flex-wrap:wrap;gap:.4rem;margin:.6rem 0}',
        '#hadith-cats .hcat-btn{background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.28);color:#f0d080;border-radius:999px;padding:.35rem .85rem;font-size:.8rem}',
        '#hadith-cats .hcat-btn.on{background:rgba(201,168,76,.35);color:#fff;border-color:#c9a84c}',
        '#hv-cd,.hv-cd{display:block!important;width:100%!important;text-align:center!important;margin:.35rem auto!important;font-variant-numeric:tabular-nums!important;direction:ltr!important;unicode-bidi:isolate!important;font-size:clamp(1.85rem,7vw,2.4rem)!important;font-weight:700!important;color:var(--gold,#C9A84C)!important}',
        '/* paper high contrast */',
        'body.theme-paper,body.theme-paper .pg{color:#1a1206!important;background:#f6f0e2!important}',
        'body.theme-paper p,body.theme-paper span,body.theme-paper small,body.theme-paper li,body.theme-paper label,body.theme-paper .ss-desc,body.theme-paper .text-muted{color:#2a1c08!important}',
        'body.theme-paper h1,body.theme-paper h2,body.theme-paper h3,body.theme-paper b,body.theme-paper strong,body.theme-paper .ss-lbl{color:#5c3f08!important}',
        'body.theme-paper .hadith-ar,body.theme-paper .ay,body.theme-paper .mushaf-ayah{color:#140e04!important}',
        'body.theme-paper [style*="color:var(--tm)"],body.theme-paper [style*="color: var(--tm)"]{color:#3a2a10!important}',
        'body.theme-paper [style*="color:rgba(255"],body.theme-paper [style*="color: rgba(255"]{color:#1a1206!important}'
      ].join('\n');
      document.head.appendChild(s);
    } catch (e) {}
  }

  function init() {
    perfCSS();
    bindCapBack();
    bindHistory();
    hookSP();
    setTimeout(hookSP, 400);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  window.addEventListener('load', function () { hookSP(); setTimeout(forceHadiths, 400); });
})();
