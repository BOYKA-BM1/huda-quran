/* Huda v795 — red offline dot (no banner), stable countdown, background audio */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }

  /* ══════ Network: trust offline event; probe only when "online" ══════ */
  var _online = !!navigator.onLine;
  var _probing = false;

  function setDot(online) {
    _online = !!online;
    var d = $('odot') || document.querySelector('.offline-dot');
    if (!d) return;
    d.style.setProperty('width', '7px', 'important');
    d.style.setProperty('height', '7px', 'important');
    d.style.setProperty('min-width', '7px', 'important');
    d.style.setProperty('max-width', '7px', 'important');
    d.style.setProperty('border-radius', '50%', 'important');
    d.style.setProperty('display', 'block', 'important');
    if (_online) {
      d.classList.add('online'); d.classList.remove('offline');
      d.style.setProperty('background', '#22c55e', 'important');
      d.style.setProperty('box-shadow', '0 0 5px #22c55e', 'important');
    } else {
      d.classList.remove('online'); d.classList.add('offline');
      d.style.setProperty('background', '#ef4444', 'important');
      d.style.setProperty('box-shadow', '0 0 6px #ef4444', 'important');
    }
    // never show banner
    var ban = $('huda-offline-banner');
    if (ban) ban.style.display = 'none';
  }

  function probeNet() {
    // Browser says offline → red immediately (most reliable on Android)
    if (!navigator.onLine) {
      setDot(false);
      return;
    }
    if (_probing) return;
    _probing = true;
    var done = false;
    function finish(ok) {
      if (done) return;
      done = true;
      _probing = false;
      // Only go green if navigator still says online
      setDot(ok && navigator.onLine);
    }
    // Image probe — not intercepted as easily by SW as fetch no-cors
    var img = new Image();
    var t = setTimeout(function () {
      try { img.onload = img.onerror = null; } catch (e) {}
      finish(false);
    }, 4000);
    img.onload = function () { clearTimeout(t); finish(true); };
    img.onerror = function () { clearTimeout(t); finish(false); };
    // cache-bust unique URL
    img.src = 'https://www.google.com/favicon.ico?_=' + Date.now() + Math.random();
  }

  window.hudaIsOnline = function () { return !!_online && !!navigator.onLine; };
  window.hudaRequireOnline = function (msg) {
    if (window.hudaIsOnline()) return true;
    if (typeof showToast === 'function') showToast(msg || 'غير متصل بالإنترنت');
    return false;
  };

  window.addEventListener('online', function () {
    // don't trust immediately — probe
    setTimeout(probeNet, 300);
  });
  window.addEventListener('offline', function () {
    setDot(false); // instant red
  });

  /* ══════ GPS (keep previous working logic) ══════ */
  function saveLoc(lat, lng, name) {
    try {
      window.userLat = lat; window.userLng = lng;
    } catch (e) {}
    try {
      localStorage.setItem('saved_lat', String(lat));
      localStorage.setItem('saved_lng', String(lng));
      if (name) localStorage.setItem('saved_loc_name', name);
    } catch (e) {}
    var el = $('loc-name');
    if (el) el.textContent = name || (lat.toFixed(4) + ', ' + lng.toFixed(4));
    var st = $('qibla-status');
    if (st) st.textContent = '📍 ' + (name || (lat.toFixed(3) + '°, ' + lng.toFixed(3) + '°'));
    if (typeof calcPrayers === 'function') { try { calcPrayers(); } catch (e) {} }
  }

  function geoOnce(timeoutMs) {
    return new Promise(function (resolve, reject) {
      var done = false;
      function ok(lat, lng) { if (done) return; done = true; resolve({ lat: lat, lng: lng }); }
      function fail(err) { if (done) return; done = true; reject(err || new Error('geo')); }
      setTimeout(function () { fail(new Error('timeout')); }, timeoutMs || 12000);
      try {
        var Cap = window.Capacitor;
        var Geo = Cap && Cap.Plugins && Cap.Plugins.Geolocation;
        if (Geo && Geo.getCurrentPosition) {
          Geo.getCurrentPosition({ enableHighAccuracy: true, timeout: timeoutMs || 10000 })
            .then(function (pos) {
              var c = pos.coords || pos;
              ok(c.latitude, c.longitude);
            }).catch(function () {});
        }
      } catch (e) {}
      if (!navigator.geolocation) { fail(new Error('no geo')); return; }
      navigator.geolocation.getCurrentPosition(
        function (pos) { ok(pos.coords.latitude, pos.coords.longitude); },
        function (err) { fail(err); },
        { enableHighAccuracy: true, timeout: timeoutMs || 10000, maximumAge: 20000 }
      );
    });
  }

  window.getLocation = async function (force) {
    var el = $('loc-name');
    if (!force) {
      try {
        var sl = localStorage.getItem('saved_lat');
        var sn = localStorage.getItem('saved_lng');
        if (sl && sn) {
          saveLoc(parseFloat(sl), parseFloat(sn), localStorage.getItem('saved_loc_name'));
          return;
        }
      } catch (e) {}
    }
    if (el) el.textContent = 'جارٍ تحديد موقعك...';
    try {
      var pos = await geoOnce(12000);
      saveLoc(pos.lat, pos.lng, null);
      if (typeof showToast === 'function') showToast('✓ تم تحديد موقعك');
    } catch (err) {
      try {
        var sl = localStorage.getItem('saved_lat');
        var sn = localStorage.getItem('saved_lng');
        if (sl && sn) {
          saveLoc(parseFloat(sl), parseFloat(sn), localStorage.getItem('saved_loc_name'));
          return;
        }
      } catch (e) {}
      saveLoc(30.0444, 31.2357, 'القاهرة');
      if (el) el.textContent = 'تعذّر GPS — القاهرة';
    }
  };

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t) return;
    var txt = (t.textContent || '');
    var btn = t.closest ? t.closest('.pr-loc-btn, #gps-btn, [data-gps]') : null;
    if (btn || /موقعي تلقائي|GPS فقط/.test(txt)) {
      setTimeout(function () { window.getLocation(true); }, 10);
    }
    if (!window.hudaIsOnline()) {
      if (/تنزيل|تحميل|download/i.test(txt) || (t.closest && t.closest('[data-download],.btn-download'))) {
        e.preventDefault(); e.stopPropagation();
        if (typeof showToast === 'function') showToast('غير متصل بالإنترنت');
      }
    }
  }, true);

  /* ══════ ONE stable countdown — kill competing homeTick on #hv-cd ══════ */
  var _lastCd = '';
  var _nextEndMs = 0;

  function computeNextEnd() {
    var pt = window.prayerTimes;
    if (!pt || typeof pt.fajr !== 'number') return 0;
    var now = new Date();
    var names = [
      { k: 'fajr', n: 'الفجر' },
      { k: 'dhuhr', n: 'الظهر' },
      { k: 'asr', n: 'العصر' },
      { k: 'maghrib', n: 'المغرب' },
      { k: 'isha', n: 'العشاء' }
    ];
    function decToMs(dec) {
      var h = Math.floor(dec);
      var m = Math.floor((dec - h) * 60);
      var s = Math.round(((dec - h) * 60 - m) * 60);
      var d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, s, 0);
      return d.getTime();
    }
    var best = 0, bestName = '';
    for (var i = 0; i < names.length; i++) {
      var p = names[i];
      if (pt[p.k] == null) continue;
      var t = decToMs(pt[p.k]);
      if (t > now.getTime() + 500 && (!best || t < best)) {
        best = t; bestName = p.n;
      }
    }
    if (!best && pt.fajr != null) {
      best = decToMs(pt.fajr) + 86400000;
      bestName = 'الفجر';
    }
    _nextEndMs = best;
    return best;
  }

  function tickCd() {
    var el = $('hv-cd');
    if (!el) return;
    if (!_nextEndMs || _nextEndMs < Date.now() - 2000) computeNextEnd();
    if (!_nextEndMs) return;
    var diff = Math.max(0, Math.floor((_nextEndMs - Date.now()) / 1000));
    if (diff === 0) computeNextEnd();
    var h = Math.floor(diff / 3600);
    var m = Math.floor((diff % 3600) / 60);
    var s = diff % 60;
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    var txt = pad(h) + ':' + pad(m) + ':' + pad(s);
    // only write when changed — prevents visual flicker
    if (txt !== _lastCd) {
      el.textContent = txt;
      _lastCd = txt;
    }
  }

  // Override v3 homeTick so it does NOT rewrite #hv-cd (stops up/down jump)
  function patchHomeTick() {
    try {
      // v3 homeTick is inside IIFE — we intercept via MutationObserver-free approach:
      // periodically re-assert our value if something else overwrote it
      // and patch global if exposed
      if (typeof window.homeTick === 'function' && !window.homeTick._huda795) {
        var orig = window.homeTick;
        window.homeTick = function () {
          try { orig(); } catch (e) {}
          tickCd(); // force our stable value after
        };
        window.homeTick._huda795 = true;
      }
    } catch (e) {}
  }

  /* ══════ Background audio when screen locks ══════ */
  function setupBgAudio() {
    function getAud() {
      return document.getElementById('aud') || (window.G && G.audio) || null;
    }
    function bindMediaSession() {
      if (!('mediaSession' in navigator)) return;
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: 'هُدى القرآن',
          artist: 'تلاوة',
          album: 'Huda Al Quran',
          artwork: [
            { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }
          ]
        });
        navigator.mediaSession.setActionHandler('play', function () {
          var a = getAud(); if (a) a.play().catch(function () {});
        });
        navigator.mediaSession.setActionHandler('pause', function () {
          var a = getAud(); if (a) a.pause();
        });
        navigator.mediaSession.setActionHandler('previoustrack', function () {});
        navigator.mediaSession.setActionHandler('nexttrack', function () {});
      } catch (e) {}
    }
    function onPlay() {
      bindMediaSession();
      try {
        if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
      } catch (e) {}
      // Wake Lock optional — helps some devices keep decoding
      try {
        if (navigator.wakeLock && navigator.wakeLock.request) {
          navigator.wakeLock.request('screen').catch(function () {});
        }
      } catch (e) {}
    }
    function onPause() {
      try {
        if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
      } catch (e) {}
    }
    // attach to #aud when available
    function attach() {
      var a = getAud();
      if (!a || a._huda795bg) return;
      a._huda795bg = true;
      a.setAttribute('playsinline', '');
      a.preload = 'auto';
      a.addEventListener('play', onPlay);
      a.addEventListener('pause', onPause);
      // Do NOT pause on visibility change
      document.addEventListener('visibilitychange', function () {
        // intentionally empty — do not pause audio when screen locks
      });
    }
    attach();
    setInterval(attach, 2000);
    bindMediaSession();
  }

  function boot() {
    // initial dot from navigator
    setDot(!!navigator.onLine);
    if (navigator.onLine) probeNet();
    setInterval(function () {
      if (!navigator.onLine) setDot(false);
      else probeNet();
    }, 8000);

    // countdown: recompute end time every 30s, tick every 1s
    computeNextEnd();
    setInterval(computeNextEnd, 30000);
    setInterval(tickCd, 1000);
    setInterval(patchHomeTick, 3000);
    // Also force-overwrite any competing write every second after a short delay
    setInterval(function () {
      var el = $('hv-cd');
      if (el && _lastCd && el.textContent !== _lastCd) el.textContent = _lastCd;
    }, 250);

    setupBgAudio();

    try {
      var el = $('loc-name');
      var name = localStorage.getItem('saved_loc_name');
      var sl = localStorage.getItem('saved_lat');
      if (el && /جارٍ/.test(el.textContent || '') && name) el.textContent = name;
      if (sl) saveLoc(parseFloat(sl), parseFloat(localStorage.getItem('saved_lng') || '31.23'), name);
    } catch (e) {}

    // remove any leftover offline banner
    var ban = $('huda-offline-banner');
    if (ban) ban.remove();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 150); });
  } else {
    setTimeout(boot, 150);
  }
})();
