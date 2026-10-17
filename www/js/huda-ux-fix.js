/* Huda v78 UX — home prayer, khatma persist, back stack, hadiths, tasbeeh instant, media session */
(function () {
  'use strict';

  /* ── durable store ── */
  var mem = {};
  function idbOpen() {
    return new Promise(function (res, rej) {
      if (!indexedDB) return rej();
      var r = indexedDB.open('huda_ux_v78', 1);
      r.onupgradeneeded = function (e) {
        var db = e.target.result;
        if (!db.objectStoreNames.contains('kv')) db.createObjectStore('kv');
      };
      r.onsuccess = function (e) { res(e.target.result); };
      r.onerror = function () { rej(); };
    });
  }
  var Store = {
    set: function (k, v) {
      var s = typeof v === 'string' ? v : JSON.stringify(v);
      mem[k] = s;
      try { localStorage.setItem(k, s); } catch (e) {}
      idbOpen().then(function (db) {
        try { db.transaction('kv', 'readwrite').objectStore('kv').put(s, k); } catch (e) {}
      }).catch(function () {});
    },
    get: function (k) {
      if (mem[k] != null) return mem[k];
      try {
        var v = localStorage.getItem(k);
        if (v != null) { mem[k] = v; return v; }
      } catch (e) {}
      return null;
    },
    hydrate: function () {
      return idbOpen().then(function (db) {
        return new Promise(function (resolve) {
          try {
            var c = db.transaction('kv', 'readonly').objectStore('kv').openCursor();
            c.onsuccess = function (e) {
              var cur = e.target.result;
              if (cur) {
                mem[cur.key] = cur.value;
                try { if (localStorage.getItem(cur.key) == null) localStorage.setItem(cur.key, cur.value); } catch (err) {}
                cur.continue();
              } else resolve();
            };
            c.onerror = function () { resolve(); };
          } catch (e) { resolve(); }
        });
      }).catch(function () {});
    }
  };
  window.HudaStore = window.HudaStore || Store;

  /* ── Khatma: never lose plan unless user deletes ── */
  function patchKhatma() {
    var _save = window.saveKhatmaState;
    var _load = window.loadKhatmaState;
    window.saveKhatmaState = function (st) {
      try {
        var j = JSON.stringify(st);
        Store.set('huda_khatma_plan_v1', j);
        Store.set('huda_khatma_plan_backup', j);
        localStorage.setItem('huda_khatma_plan_v1', j);
        localStorage.setItem('huda_khatma_plan_backup', j);
        sessionStorage.setItem('huda_khatma_plan_v1', j);
      } catch (e) {}
      if (typeof _save === 'function') try { _save(st); } catch (e) {}
    };
    window.loadKhatmaState = function () {
      try {
        var r = Store.get('huda_khatma_plan_v1') || Store.get('huda_khatma_plan_backup') ||
          localStorage.getItem('huda_khatma_plan_v1') || localStorage.getItem('huda_khatma_plan_backup') ||
          sessionStorage.getItem('huda_khatma_plan_v1');
        if (r) return typeof r === 'string' ? JSON.parse(r) : r;
      } catch (e) {}
      if (typeof _load === 'function') try { return _load(); } catch (e) {}
      return null;
    };
    // re-render khatma UI if plan exists
    if (typeof window.calcKhatma === 'function') {
      var st = window.loadKhatmaState();
      if (st && st.days) {
        try {
          var d = document.getElementById('k-days');
          var t = document.getElementById('k-times');
          var u = document.getElementById('k-unit');
          if (d && st.totalDays) d.value = st.totalDays;
          if (t && st.times) t.value = st.times;
          if (u && st.unit) u.value = st.unit;
        } catch (e) {}
      }
    }
  }

  /* ── Home prayer card fill ── */
  function updateHomePrayer() {
    try {
      if (typeof prayerTimes === 'undefined' || !prayerTimes || !Object.keys(prayerTimes).length) return;
      if (typeof PRAYERS === 'undefined' || typeof decToDate !== 'function') return;
      var now = new Date();
      var nextP = null, nextT = null;
      PRAYERS.forEach(function (p) {
        if (p.key === 'sunrise') return;
        var t = decToDate(prayerTimes[p.key]);
        if (t && t > now && (!nextT || t < nextT)) { nextT = t; nextP = p; }
      });
      if (!nextP && prayerTimes.fajr) {
        nextP = PRAYERS[0];
        var f = decToDate(prayerTimes.fajr);
        if (f) nextT = new Date(f.getTime() + 86400000);
      }
      var hvNext = document.getElementById('hv-next');
      var hvCd = document.getElementById('hv-cd');
      var hvLoc = document.getElementById('hv-loc');
      if (nextP && hvNext) hvNext.textContent = nextP.name + (nextP.icon ? ' ' + nextP.icon : '');
      if (nextT && hvCd) {
        var diff = Math.max(0, Math.floor((nextT - now) / 1000));
        var h = Math.floor(diff / 3600), m = Math.floor((diff % 3600) / 60), s = diff % 60;
        hvCd.textContent = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
      }
      var ln = document.getElementById('loc-name');
      var sname = Store.get('saved_loc_name') || localStorage.getItem('saved_loc_name');
      if (hvLoc) {
        var txt = (ln && ln.textContent && !/جار|تعذ|حدد/.test(ln.textContent)) ? ln.textContent : (sname || 'حدد موقعك');
        hvLoc.textContent = '📍 ' + txt;
      }
    } catch (e) {}
  }

  function bootPrayers() {
    try {
      var sl = Store.get('saved_lat') || localStorage.getItem('saved_lat');
      var sn = Store.get('saved_lng') || localStorage.getItem('saved_lng');
      if (sl && sn) {
        var la = parseFloat(sl), ln = parseFloat(sn);
        try { if (typeof userLat !== 'undefined') { userLat = la; userLng = ln; } } catch (e) {}
        window.userLat = la; window.userLng = ln;
      } else {
        // default Cairo so home is never empty
        try { if (typeof userLat !== 'undefined') { userLat = 30.0444; userLng = 31.2357; } } catch (e) {}
        window.userLat = 30.0444; window.userLng = 31.2357;
      }
      if (typeof calcPrayers === 'function') {
        var r = calcPrayers();
        if (r && typeof r.then === 'function') r.then(function () { updateHomePrayer(); }).catch(function () { updateHomePrayer(); });
        else updateHomePrayer();
      }
    } catch (e) {}
    setInterval(updateHomePrayer, 1000);
  }

  /* ── Back stack for Hisn + all subviews ── */
  var subStack = [];
  function pushSub(label, backFn) {
    subStack.push({ label: label, back: backFn });
  }
  function popSub() {
    if (!subStack.length) return false;
    var item = subStack.pop();
    try { item.back(); } catch (e) {}
    return true;
  }
  window.hudaGoBack = function () {
    if (popSub()) return true;
    if (typeof _pageHistory !== 'undefined' && _pageHistory.length > 1) {
      _pageHistory.pop();
      var prev = _pageHistory[_pageHistory.length - 1];
      if (typeof SP === 'function') SP(prev, false);
      return true;
    }
    return false;
  };

  function patchHisnNav() {
    if (typeof window.openHisnCat === 'function') {
      var _open = window.openHisnCat;
      window.openHisnCat = function (id, name) {
        _open(id, name);
        pushSub('hisn-cat', function () {
          if (typeof renderHisnCats === 'function') renderHisnCats();
          var cats = document.getElementById('hisn-cats');
          var view = document.getElementById('hisn-view');
          if (cats) cats.style.display = '';
          if (view) view.classList.remove('on');
        });
        try { history.pushState({ page: 'hisn', sub: id }, '', '#hisn/' + id); } catch (e) {}
      };
    }
    // Capacitor hardware back
    document.addEventListener('backbutton', function (e) {
      if (window.hudaGoBack()) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
    try {
      var Cap = window.Capacitor;
      if (Cap && Cap.Plugins && Cap.Plugins.App && Cap.Plugins.App.addListener) {
        Cap.Plugins.App.addListener('backButton', function (data) {
          if (window.hudaGoBack()) {
            // consumed
          } else if (data && data.canGoBack === false) {
            // exit handled by system
          }
        });
      }
    } catch (e) {}
    // swipe from right edge (RTL back)
    var sx = 0, sy = 0;
    document.addEventListener('touchstart', function (e) {
      if (!e.touches || !e.touches[0]) return;
      sx = e.touches[0].clientX; sy = e.touches[0].clientY;
    }, { passive: true });
    document.addEventListener('touchend', function (e) {
      if (!e.changedTouches || !e.changedTouches[0]) return;
      var dx = e.changedTouches[0].clientX - sx;
      var dy = e.changedTouches[0].clientY - sy;
      // swipe right from left edge OR swipe left from right edge in RTL
      if (Math.abs(dy) > 80) return;
      if (sx < 40 && dx > 70) { window.hudaGoBack(); }
      if (sx > (window.innerWidth - 40) && dx < -70) { window.hudaGoBack(); }
    }, { passive: true });
  }

  /* ── Hadiths: force render + fallback ── */
  var FALLBACK_HADITHS = [
    { ar: 'إنما الأعمال بالنيات وإنما لكل امرئ ما نوى', src: 'متفق عليه', cat: 'النية' },
    { ar: 'من حسن إسلام المرء تركه ما لا يعنيه', src: 'الترمذي', cat: 'الأدب' },
    { ar: 'لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه', src: 'متفق عليه', cat: 'الإيمان' },
    { ar: 'المسلم من سلم المسلمون من لسانه ويده', src: 'متفق عليه', cat: 'الأخلاق' },
    { ar: 'من كان يؤمن بالله واليوم الآخر فليقل خيراً أو ليصمت', src: 'متفق عليه', cat: 'الكلام' },
    { ar: 'الدين النصيحة', src: 'مسلم', cat: 'النصيحة' },
    { ar: 'لا ضرر ولا ضرار', src: 'ابن ماجه', cat: 'الفقه' },
    { ar: 'البر حسن الخلق', src: 'مسلم', cat: 'الأخلاق' },
    { ar: 'من لا يرحم لا يُرحم', src: 'متفق عليه', cat: 'الرحمة' },
    { ar: 'تبسمك في وجه أخيك صدقة', src: 'الترمذي', cat: 'الصدقة' }
  ];
  function ensureHadiths() {
    try {
      if (typeof HADITHS === 'undefined' || !HADITHS || !HADITHS.length) {
        window.HADITHS = FALLBACK_HADITHS.slice();
      }
    } catch (e) {
      window.HADITHS = FALLBACK_HADITHS.slice();
    }
  }
  function forceHadiths() {
    ensureHadiths();
    if (typeof renderHadithPage === 'function') {
      try { renderHadithPage(); return; } catch (e) {}
    }
    var el = document.getElementById('hadith-list');
    if (!el) return;
    var list = window.HADITHS || FALLBACK_HADITHS;
    el.innerHTML = list.map(function (h) {
      return '<div class="hadith-card"><div class="hadith-ar" style="color:#f0e8d8;font-size:1.1rem;line-height:1.9;direction:rtl">' +
        (h.ar || '') + '</div><div class="hadith-src">📚 ' + (h.src || '') + '</div></div>';
    }).join('');
    var c = document.getElementById('hadith-counter');
    if (c) c.textContent = list.length + ' حديث';
  }

  /* ── Tasbeeh: instant on pointerdown (no 300ms lag) ── */
  function patchTasbeeh() {
    document.addEventListener('pointerdown', function (e) {
      var t = e.target;
      if (!t) return;
      var btn = t.id === 'tb-tap' ? t : (t.closest && t.closest('#tb-tap'));
      if (!btn) return;
      e.preventDefault();
      if (typeof window.tasbeehClick === 'function') window.tasbeehClick();
    }, { passive: false });
  }

  /* ── Location save ── */
  function patchLocation() {
    var _gl = window.getLocation;
    window.getLocation = function (force) {
      if (!force) {
        var sl = Store.get('saved_lat') || localStorage.getItem('saved_lat');
        var sn = Store.get('saved_lng') || localStorage.getItem('saved_lng');
        var nm = Store.get('saved_loc_name') || localStorage.getItem('saved_loc_name');
        if (sl && sn) {
          var la = parseFloat(sl), ln = parseFloat(sn);
          try { if (typeof userLat !== 'undefined') { userLat = la; userLng = ln; } } catch (e) {}
          window.userLat = la; window.userLng = ln;
          var el = document.getElementById('loc-name');
          if (el) el.textContent = nm || (la.toFixed(2) + '°');
          if (typeof calcPrayers === 'function') calcPrayers();
          updateHomePrayer();
          return;
        }
      }
      if (typeof _gl === 'function') {
        _gl(true);
        // after geo, persist via interval check
        setTimeout(function () {
          try {
            if (typeof userLat !== 'undefined' && userLat) {
              Store.set('saved_lat', String(userLat));
              Store.set('saved_lng', String(userLng));
              var n = localStorage.getItem('saved_loc_name');
              if (n) Store.set('saved_loc_name', n);
              updateHomePrayer();
            }
          } catch (e) {}
        }, 3000);
      }
    };
  }

  /* ── Background audio media session ── */
  function patchMediaSession() {
    if (!('mediaSession' in navigator)) return;
    function bind(au) {
      if (!au || au._hudaMs) return;
      au._hudaMs = true;
      au.setAttribute('playsinline', '');
      try { au.setAttribute('webkit-playsinline', ''); } catch (e) {}
      au.addEventListener('play', function () {
        try {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: 'هُدى القرآن',
            artist: 'تلاوة',
            album: 'Huda Al Quran',
            artwork: [{ src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' }]
          });
          navigator.mediaSession.playbackState = 'playing';
        } catch (e) {}
      });
      au.addEventListener('pause', function () {
        try { navigator.mediaSession.playbackState = 'paused'; } catch (e) {}
      });
      try {
        navigator.mediaSession.setActionHandler('play', function () { au.play(); });
        navigator.mediaSession.setActionHandler('pause', function () { au.pause(); });
        navigator.mediaSession.setActionHandler('previoustrack', function () {});
        navigator.mediaSession.setActionHandler('nexttrack', function () {});
      } catch (e) {}
    }
    document.querySelectorAll('audio').forEach(bind);
    var obs = new MutationObserver(function () {
      document.querySelectorAll('audio').forEach(bind);
    });
    if (document.body) obs.observe(document.body, { childList: true, subtree: true });
  }

  /* ── SP hook: hadiths + khatma + prayer ── */
  function patchSP() {
    if (typeof window.SP !== 'function') return;
    var _sp = window.SP;
    window.SP = function (id, pushHistory) {
      _sp(id, pushHistory);
      if (id === 'hadiths') setTimeout(forceHadiths, 50);
      if (id === 'khatma') {
        setTimeout(function () {
          var st = window.loadKhatmaState && window.loadKhatmaState();
          if (st && typeof calcKhatma === 'function') {
            try { calcKhatma(true); } catch (e) { try { calcKhatma(); } catch (e2) {} }
          }
          if (typeof updateKhatmaBookmarkUI === 'function') updateKhatmaBookmarkUI();
        }, 80);
      }
      if (id === 'home' || id === 'prayer') setTimeout(function () {
        if (typeof calcPrayers === 'function') calcPrayers();
        updateHomePrayer();
      }, 80);
    };
  }

  function boot() {
    Store.hydrate().then(function () {
      patchKhatma();
      patchLocation();
      patchHisnNav();
      patchTasbeeh();
      patchSP();
      patchMediaSession();
      bootPrayers();
      ensureHadiths();
      // if already on hadiths
      if (document.getElementById('page-hadiths') && document.getElementById('page-hadiths').classList.contains('on')) {
        forceHadiths();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 300); });
  } else {
    setTimeout(boot, 300);
  }
})();
