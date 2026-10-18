/* Huda v796 — offline red dot, stable CD, bg audio, no cascade offline */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }

  var _online = !!navigator.onLine;

  function setDot(online) {
    _online = !!online;
    var d = $('odot') || document.querySelector('.offline-dot');
    if (!d) return;
    ['width','height','min-width','max-width'].forEach(function (k) {
      d.style.setProperty(k, '7px', 'important');
    });
    d.style.setProperty('border-radius', '50%', 'important');
    d.style.setProperty('display', 'block', 'important');
    d.style.setProperty('opacity', '1', 'important');
    d.style.setProperty('visibility', 'visible', 'important');
    if (_online) {
      d.classList.add('online'); d.classList.remove('offline');
      d.style.setProperty('background', '#22c55e', 'important');
      d.style.setProperty('background-color', '#22c55e', 'important');
      d.style.setProperty('box-shadow', '0 0 5px #22c55e', 'important');
    } else {
      d.classList.remove('online'); d.classList.add('offline');
      d.style.setProperty('background', '#ef4444', 'important');
      d.style.setProperty('background-color', '#ef4444', 'important');
      d.style.setProperty('box-shadow', '0 0 6px #ef4444', 'important');
    }
    var ban = $('huda-offline-banner');
    if (ban) { try { ban.remove(); } catch (e) {} }
  }

  function syncFromNavigator() {
    // المصدر الوحيد الموثوق على أندرويد عند وضع الطيران
    setDot(!!navigator.onLine);
  }

  window.hudaIsOnline = function () { return !!navigator.onLine; };
  window.hudaRequireOnline = function (msg) {
    if (navigator.onLine) return true;
    if (typeof showToast === 'function') showToast(msg || 'يرجى الاتصال بالإنترنت');
    else if (typeof toast === 'function') toast(msg || 'يرجى الاتصال بالإنترنت');
    return false;
  };

  window.addEventListener('online', function () { setDot(true); });
  window.addEventListener('offline', function () { setDot(false); });

  /* GPS keep */
  function saveLoc(lat, lng, name) {
    try { window.userLat = lat; window.userLng = lng; } catch (e) {}
    try {
      localStorage.setItem('saved_lat', String(lat));
      localStorage.setItem('saved_lng', String(lng));
      if (name) localStorage.setItem('saved_loc_name', name);
    } catch (e) {}
    var el = $('loc-name');
    if (el) el.textContent = name || (lat.toFixed(4) + ', ' + lng.toFixed(4));
    if (typeof calcPrayers === 'function') { try { calcPrayers(); } catch (e) {} }
  }
  window.getLocation = async function (force) {
    var el = $('loc-name');
    if (!force) {
      try {
        var sl = localStorage.getItem('saved_lat');
        var sn = localStorage.getItem('saved_lng');
        if (sl && sn) { saveLoc(parseFloat(sl), parseFloat(sn), localStorage.getItem('saved_loc_name')); return; }
      } catch (e) {}
    }
    if (el) el.textContent = 'جارٍ تحديد موقعك...';
    try {
      var pos = await new Promise(function (resolve, reject) {
        var done = false;
        setTimeout(function () { if (!done) { done = true; reject(new Error('t')); } }, 12000);
        if (!navigator.geolocation) { reject(new Error('no')); return; }
        navigator.geolocation.getCurrentPosition(
          function (p) { if (!done) { done = true; resolve(p.coords); } },
          function (e) { if (!done) { done = true; reject(e); } },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 20000 }
        );
      });
      saveLoc(pos.latitude, pos.longitude, null);
      if (typeof showToast === 'function') showToast('✓ تم تحديد موقعك');
    } catch (err) {
      try {
        var sl = localStorage.getItem('saved_lat'), sn = localStorage.getItem('saved_lng');
        if (sl && sn) { saveLoc(parseFloat(sl), parseFloat(sn), localStorage.getItem('saved_loc_name')); return; }
      } catch (e) {}
      saveLoc(30.0444, 31.2357, 'القاهرة');
    }
  };
  document.addEventListener('click', function (e) {
    var t = e.target; if (!t) return;
    var txt = t.textContent || '';
    if (/موقعي تلقائي|GPS فقط/.test(txt) || (t.closest && t.closest('.pr-loc-btn'))) {
      setTimeout(function () { window.getLocation(true); }, 10);
    }
    // block download / save offline
    if (!navigator.onLine) {
      if (/تنزيل|تحميل|حفظ.*صوت|download|save/i.test(txt)) {
        e.preventDefault(); e.stopPropagation();
        if (typeof showToast === 'function') showToast('يرجى الاتصال بالإنترنت');
      }
    }
  }, true);

  /* Stable countdown */
  var _lastCd = '', _nextEndMs = 0;
  function computeNextEnd() {
    var pt = window.prayerTimes;
    if (!pt || typeof pt.fajr !== 'number') return 0;
    var now = new Date();
    function decToMs(dec) {
      var h = Math.floor(dec), m = Math.floor((dec - h) * 60);
      var s = Math.round(((dec - h) * 60 - m) * 60);
      return new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, s, 0).getTime();
    }
    var keys = ['fajr','dhuhr','asr','maghrib','isha'], best = 0;
    for (var i = 0; i < keys.length; i++) {
      if (pt[keys[i]] == null) continue;
      var t = decToMs(pt[keys[i]]);
      if (t > now.getTime() + 500 && (!best || t < best)) best = t;
    }
    if (!best && pt.fajr != null) best = decToMs(pt.fajr) + 86400000;
    _nextEndMs = best;
    return best;
  }
  function tickCd() {
    var el = $('hv-cd'); if (!el) return;
    if (!_nextEndMs || _nextEndMs < Date.now() - 2000) computeNextEnd();
    if (!_nextEndMs) return;
    var diff = Math.max(0, Math.floor((_nextEndMs - Date.now()) / 1000));
    if (diff === 0) computeNextEnd();
    var h = Math.floor(diff / 3600), m = Math.floor((diff % 3600) / 60), s = diff % 60;
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var txt = pad(h) + ':' + pad(m) + ':' + pad(s);
    if (txt !== _lastCd) { el.textContent = txt; _lastCd = txt; }
  }

  /* Background audio */
  function setupBgAudio() {
    function getAud() { return document.getElementById('aud') || (window.G && G.audio) || null; }
    function bindMS() {
      if (!('mediaSession' in navigator)) return;
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: 'هُدى القرآن', artist: 'تلاوة', album: 'Huda Al Quran',
          artwork: [{ src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' }]
        });
        navigator.mediaSession.setActionHandler('play', function () { var a = getAud(); if (a) a.play().catch(function () {}); });
        navigator.mediaSession.setActionHandler('pause', function () { var a = getAud(); if (a) a.pause(); });
      } catch (e) {}
    }
    function attach() {
      var a = getAud();
      if (!a || a._huda796) return;
      a._huda796 = true;
      a.setAttribute('playsinline', '');
      a.addEventListener('play', function () {
        bindMS();
        try { navigator.mediaSession.playbackState = 'playing'; } catch (e) {}
      });
    }
    attach();
    setInterval(attach, 2000);
  }

  /* Hide "save audio to device" controls if present */
  function hideSaveAudioUI() {
    try {
      document.querySelectorAll('button, a, .btn').forEach(function (el) {
        var t = (el.textContent || '') + ' ' + (el.getAttribute('title') || '');
        if (/حفظ.*(الصوت|الملف|الجهاز)|save.*(audio|file)|تنزيل الملف/i.test(t)) {
          el.style.display = 'none';
        }
      });
    } catch (e) {}
  }

  /* Guard playSurah when offline */
  function patchPlayOffline() {
    if (window.playSurahContinuous && !window.playSurahContinuous._796) {
      var orig = window.playSurahContinuous;
      window.playSurahContinuous = function (s) {
        if (!navigator.onLine) {
          // allow if we might have cached blob - still try, but on fail toast is from ui-handlers
        }
        return orig.apply(this, arguments);
      };
      window.playSurahContinuous._796 = true;
    }
    // Ensure isRepeat starts false and G._loopSurah false
    try { if (typeof isRepeat === 'undefined') window.isRepeat = false; } catch (e) {}
    try { if (window.G) window.G._loopSurah = false; } catch (e) {}
  }

  function boot() {
    syncFromNavigator();
    setInterval(syncFromNavigator, 1000); // every second — instant red when airplane mode
    computeNextEnd();
    setInterval(computeNextEnd, 30000);
    setInterval(tickCd, 1000);
    setInterval(function () {
      var el = $('hv-cd');
      if (el && _lastCd && el.textContent !== _lastCd) el.textContent = _lastCd;
    }, 250);
    setupBgAudio();
    hideSaveAudioUI();
    setInterval(hideSaveAudioUI, 3000);
    setInterval(patchPlayOffline, 2000);
    try {
      var name = localStorage.getItem('saved_loc_name');
      var sl = localStorage.getItem('saved_lat');
      if (sl) saveLoc(parseFloat(sl), parseFloat(localStorage.getItem('saved_lng') || '31.23'), name);
    } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 100); });
  else setTimeout(boot, 100);
})();
