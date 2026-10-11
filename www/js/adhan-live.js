/* شاشة الأذان الحية — تظهر عند تشغيل الأذان */
(function () {
  'use strict';

  var _starsReady = false;
  var _muted = false;

  function $(id) { return document.getElementById(id); }

  function ensureStars() {
    if (_starsReady) return;
    var box = $('al-stars');
    if (!box) return;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < 60; i++) {
      var s = document.createElement('span');
      s.className = 'al-star';
      s.style.left = Math.random() * 100 + '%';
      s.style.top = Math.random() * 70 + '%';
      s.style.animationDelay = (Math.random() * 3) + 's';
      s.style.width = s.style.height = (1 + Math.random() * 2) + 'px';
      frag.appendChild(s);
    }
    box.appendChild(frag);
    _starsReady = true;
  }

  window.showAdhanLive = function (prayerName) {
    var el = $('adhan-live');
    if (!el) return;
    ensureStars();
    var name = prayerName || 'الأذان';
    var pn = $('al-prayer-name');
    if (pn) pn.textContent = name;
    var sub = $('al-sub');
    if (sub) sub.textContent = 'الله أكبر · الله أكبر';
    el.hidden = false;
    el.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    _muted = false;
    try {
      if (typeof adhanAud !== 'undefined' && adhanAud) adhanAud.muted = false;
    } catch (e) {}
    var mb = $('al-mute-btn');
    if (mb) mb.textContent = '🔇 كتم';
  };

  window.hideAdhanLive = function () {
    var el = $('adhan-live');
    if (!el) return;
    el.hidden = true;
    el.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  window.stopAdhanLive = function () {
    try {
      if (typeof stopAdhan === 'function') stopAdhan();
    } catch (e) {}
    try {
      if (typeof adhanAud !== 'undefined' && adhanAud) {
        adhanAud.pause();
        adhanAud.currentTime = 0;
      }
    } catch (e) {}
    try { window._adhanPlaying = false; } catch (e) {}
    try {
      if (typeof _adhanPlaying !== 'undefined') _adhanPlaying = false;
    } catch (e) {}
    var icon = $('adhan2-play-icon');
    var txt = $('adhan2-play-txt');
    if (icon) icon.textContent = '🔊';
    if (txt) txt.textContent = 'تشغيل الأذان الآن';
    var now2 = $('adhan2-now');
    if (now2) now2.style.display = 'none';
    hideAdhanLive();
  };

  window.muteAdhanLive = function () {
    _muted = !_muted;
    try {
      if (typeof adhanAud !== 'undefined' && adhanAud) adhanAud.muted = _muted;
    } catch (e) {}
    var mb = $('al-mute-btn');
    if (mb) mb.textContent = _muted ? '🔊 إلغاء الكتم' : '🔇 كتم';
  };

  function currentPrayerLabel() {
    try {
      if (typeof prayerTimes === 'undefined' || !prayerTimes) return 'الأذان';
      var now = new Date();
      var mins = now.getHours() * 60 + now.getMinutes();
      var map = [
        ['fajr', 'الفجر'],
        ['dhuhr', 'الظهر'],
        ['asr', 'العصر'],
        ['maghrib', 'المغرب'],
        ['isha', 'العشاء']
      ];
      var best = 'الأذان', bestDiff = 9999;
      for (var i = 0; i < map.length; i++) {
        var dec = prayerTimes[map[i][0]];
        if (dec == null || isNaN(dec)) continue;
        var t = ((dec % 24) + 24) % 24;
        var h = Math.floor(t), m = Math.floor((t - h) * 60);
        var pm = h * 60 + m;
        var d = Math.abs(mins - pm);
        if (d < bestDiff) { bestDiff = d; best = map[i][1]; }
      }
      return best;
    } catch (e) {
      return 'الأذان';
    }
  }

  function hookAudioEnd() {
    try {
      if (typeof adhanAud !== 'undefined' && adhanAud) {
        adhanAud.addEventListener('ended', function () {
          hideAdhanLive();
        });
      }
    } catch (e) {}
  }

  // لفّ دوال التشغيل لعرض الشاشة
  function patchPlay() {
    if (typeof window.adhan2PlayToggle === 'function' && !window.adhan2PlayToggle._alPatched) {
      var orig = window.adhan2PlayToggle;
      window.adhan2PlayToggle = function () {
        var was = false;
        try { was = !!window._adhanPlaying || (typeof _adhanPlaying !== 'undefined' && _adhanPlaying); } catch (e) {}
        // detect via icon text after call is hard; peek before
        var playingBefore = false;
        try {
          if (typeof adhanAud !== 'undefined' && adhanAud && !adhanAud.paused && !adhanAud.ended) playingBefore = true;
        } catch (e) {}
        var r = orig.apply(this, arguments);
        setTimeout(function () {
          var playing = false;
          try {
            if (typeof adhanAud !== 'undefined' && adhanAud && !adhanAud.paused && !adhanAud.ended) playing = true;
          } catch (e) {}
          if (playing) {
            showAdhanLive(currentPrayerLabel());
            hookAudioEnd();
          } else {
            hideAdhanLive();
          }
        }, 200);
        return r;
      };
      window.adhan2PlayToggle._alPatched = true;
    }

    if (typeof window.playAdhanNow === 'function' && !window.playAdhanNow._alPatched) {
      var o2 = window.playAdhanNow;
      window.playAdhanNow = function () {
        var r = o2.apply(this, arguments);
        setTimeout(function () {
          showAdhanLive(currentPrayerLabel());
          hookAudioEnd();
        }, 150);
        return r;
      };
      window.playAdhanNow._alPatched = true;
    }

    if (typeof window.stopAdhan === 'function' && !window.stopAdhan._alPatched) {
      var o3 = window.stopAdhan;
      window.stopAdhan = function () {
        var r = o3.apply(this, arguments);
        hideAdhanLive();
        return r;
      };
      window.stopAdhan._alPatched = true;
    }

    if (typeof window._autoPlayAdhan === 'function' && !window._autoPlayAdhan._alPatched) {
      var o4 = window._autoPlayAdhan;
      window._autoPlayAdhan = function () {
        var r = o4.apply(this, arguments);
        setTimeout(function () {
          showAdhanLive(currentPrayerLabel());
          hookAudioEnd();
        }, 150);
        return r;
      };
      window._autoPlayAdhan._alPatched = true;
    }
  }

  // _autoPlayAdhan may be non-window
  function patchAuto() {
    try {
      if (typeof _autoPlayAdhan === 'function' && !_autoPlayAdhan._alPatched) {
        var orig = _autoPlayAdhan;
        _autoPlayAdhan = function () {
          var r = orig.apply(this, arguments);
          setTimeout(function () {
            showAdhanLive(currentPrayerLabel());
            hookAudioEnd();
          }, 150);
          return r;
        };
        _autoPlayAdhan._alPatched = true;
        window._autoPlayAdhan = _autoPlayAdhan;
      }
    } catch (e) {}
  }

  function boot() {
    patchPlay();
    patchAuto();
    setTimeout(function () { patchPlay(); patchAuto(); }, 1500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
