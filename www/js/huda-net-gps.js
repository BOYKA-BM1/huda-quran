/* Huda v797 — no net-dot; stable countdown; next-surah enforce; bg audio */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }

  // Remove net indicator if still in DOM
  function killDot() {
    ['ofbadge', 'odot'].forEach(function (id) {
      var el = $(id); if (el) try { el.remove(); } catch (e) {}
    });
    document.querySelectorAll('.offline-badge,.offline-dot').forEach(function (el) {
      try { el.remove(); } catch (e) {}
    });
  }

  window.hudaIsOnline = function () { return !!navigator.onLine; };
  window.hudaRequireOnline = function (msg) {
    if (navigator.onLine) return true;
    if (typeof showToast === 'function') showToast(msg || 'يرجى الاتصال بالإنترنت');
    else if (typeof toast === 'function') toast(msg || 'يرجى الاتصال بالإنترنت');
    return false;
  };

  /* Stable countdown — single writer, tabular nums */
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
    var keys = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'], best = 0;
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
    var el = $('hv-cd');
    if (!el) return;
    if (!_nextEndMs || _nextEndMs < Date.now() - 1500) computeNextEnd();
    if (!_nextEndMs) return;
    var diff = Math.max(0, Math.floor((_nextEndMs - Date.now()) / 1000));
    if (diff === 0) { computeNextEnd(); diff = Math.max(0, Math.floor((_nextEndMs - Date.now()) / 1000)); }
    var h = Math.floor(diff / 3600), m = Math.floor((diff % 3600) / 60), s = diff % 60;
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var txt = pad(h) + ':' + pad(m) + ':' + pad(s);
    if (txt !== _lastCd) {
      el.textContent = txt;
      _lastCd = txt;
    }
  }

  /* Enforce isRepeat false unless user toggled; next surah on ended */
  function enforceNextSurah() {
    try {
      if (window.G) window.G._loopSurah = false;
    } catch (e) {}
    var au = document.getElementById('aud');
    if (!au || au._huda797ended) return;
    au._huda797ended = true;
    au.addEventListener('ended', function () {
      var repeatOn = false;
      try { repeatOn = (typeof isRepeat !== 'undefined' && isRepeat === true); } catch (e) {}
      if (repeatOn) {
        try { au.currentTime = 0; au.play(); } catch (e) {}
        return;
      }
      var cur = 0;
      try {
        if (window.G && G.s) cur = G.s | 0;
        else if (typeof curSurahN !== 'undefined') cur = curSurahN | 0;
      } catch (e) {}
      var next = cur + 1;
      if (next < 1 || next > 114) return;
      setTimeout(function () {
        try {
          if (typeof isRepeat !== 'undefined' && isRepeat === true) return;
          if (window.G) { G._forceReload = true; G._resumeAt = 0; G.session = false; }
          if (typeof playSurahContinuous === 'function') playSurahContinuous(next);
          else if (typeof window.forcePlaySurah === 'function') window.forcePlaySurah(next);
          try { curSurahN = next; } catch (e) {}
          if (window.HudaMushaf && HudaMushaf.goSurah) try { HudaMushaf.goSurah(next); } catch (e) {}
        } catch (e) {}
      }, 450);
    });
  }

  function setupBgAudio() {
    function getAud() { return document.getElementById('aud'); }
    function bind() {
      if (!('mediaSession' in navigator)) return;
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: 'هُدى القرآن', artist: 'تلاوة', album: 'Huda Al Quran'
        });
        navigator.mediaSession.setActionHandler('play', function () { var a = getAud(); if (a) a.play().catch(function () {}); });
        navigator.mediaSession.setActionHandler('pause', function () { var a = getAud(); if (a) a.pause(); });
      } catch (e) {}
    }
    var a = getAud();
    if (a && !a._bg797) {
      a._bg797 = true;
      a.addEventListener('play', bind);
    }
  }

  function boot() {
    killDot();
    setInterval(killDot, 3000);
    computeNextEnd();
    setInterval(computeNextEnd, 30000);
    setInterval(tickCd, 1000);
    setInterval(enforceNextSurah, 2000);
    enforceNextSurah();
    setupBgAudio();
    // ensure isRepeat starts false
    try { if (typeof isRepeat !== 'undefined') isRepeat = false; } catch (e) {}
    try { if (window.G) G._loopSurah = false; } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 120); });
  else setTimeout(boot, 120);
})();
