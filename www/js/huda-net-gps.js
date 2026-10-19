/* Huda v801 — stable countdown (no minute jump), online helpers, bg audio */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }

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

  /* ── Countdown: fixed end timestamp, integer remaining seconds ── */
  var _lastCd = '';
  var _nextEndMs = 0;
  var _endDay = -1;
  var _ptSig = '';

  function ptSignature(pt) {
    if (!pt) return '';
    return ['fajr','dhuhr','asr','maghrib','isha'].map(function (k) {
      return k + ':' + (pt[k] != null ? Math.round(Number(pt[k]) * 3600) : '');
    }).join('|');
  }

  /** decimal hours → ms at local date, seconds=0, minutes rounded from total minutes */
  function decToMs(dec, baseDate) {
    var t = ((Number(dec) % 24) + 24) % 24;
    var totalMin = Math.round(t * 60);
    if (totalMin >= 24 * 60) totalMin = 24 * 60 - 1;
    var h = Math.floor(totalMin / 60);
    var m = totalMin % 60;
    return new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), h, m, 0, 0).getTime();
  }

  function computeNextEnd(force) {
    var pt = window.prayerTimes;
    if (!pt || typeof pt.fajr !== 'number') return 0;
    var now = new Date();
    var day = now.getDate();
    var sig = ptSignature(pt);
    if (!force && _nextEndMs && _endDay === day && _ptSig === sig && _nextEndMs > now.getTime()) {
      return _nextEndMs;
    }
    _ptSig = sig;
    _endDay = day;
    var keys = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    var best = 0;
    var nowMs = now.getTime();
    for (var i = 0; i < keys.length; i++) {
      if (pt[keys[i]] == null || isNaN(pt[keys[i]])) continue;
      var t = decToMs(pt[keys[i]], now);
      if (t > nowMs + 999 && (!best || t < best)) best = t;
    }
    if (!best && pt.fajr != null) {
      var tom = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      best = decToMs(pt.fajr, tom);
    }
    _nextEndMs = best;
    return best;
  }

  function tickCd() {
    var el = $('hv-cd');
    if (!el) return;
    var now = Date.now();
    if (!_nextEndMs || _nextEndMs <= now) computeNextEnd(true);
    else computeNextEnd(false);
    if (!_nextEndMs) return;
    var diff = Math.max(0, Math.floor((_nextEndMs - now) / 1000));
    var h = Math.floor(diff / 3600);
    var m = Math.floor((diff % 3600) / 60);
    var s = diff % 60;
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var txt = pad(h) + ':' + pad(m) + ':' + pad(s);
    if (txt !== _lastCd) {
      el.textContent = txt;
      _lastCd = txt;
    }
  }

  function enforceNextSurah() {
    try {
      if (window.G) window.G._loopSurah = false;
    } catch (e) {}
  }

  function setupMediaSession() {
    try {
      if (!('mediaSession' in navigator)) return;
      navigator.mediaSession.setActionHandler('play', function () {
        var a = document.getElementById('aud');
        if (a) a.play().catch(function () {});
      });
      navigator.mediaSession.setActionHandler('pause', function () {
        var a = document.getElementById('aud');
        if (a) a.pause();
      });
    } catch (e) {}
  }

  function init() {
    killDot();
    setupMediaSession();
    enforceNextSurah();
    computeNextEnd(true);
    tickCd();
    setInterval(tickCd, 250);
    setInterval(killDot, 3000);
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) { computeNextEnd(true); tickCd(); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
