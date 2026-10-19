/* Huda v79 stable — no double-count, fixed duas, calm home, qibla freeze, native notifs, adhan */
(function () {
  'use strict';

  /* ══════ 1) Remove previous fix side-effects ══════ */
  // Disable aggressive MutationObserver re-render of duas from hard-fix by replacing renderDuas
  var _duaFixed = {}; // time -> {text, ref} locked until user clicks next

  function dayIndex() {
    var n = new Date();
    return (n.getFullYear() * 372 + n.getMonth() * 31 + n.getDate()) | 0;
  }

  var FB = {
    'صباح': [
      { text: 'اللهم بك أصبحنا وبك أمسينا وبك نحيا وبك نموت وإليك النشور', ref: 'أبو داود' },
      { text: 'اللهم إني أسألك علماً نافعاً ورزقاً طيباً وعملاً متقبلاً', ref: 'ابن ماجه' },
      { text: 'بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء وهو السميع العليم', ref: 'أبو داود' },
      { text: 'رضيت بالله رباً وبالإسلام ديناً وبمحمد نبياً', ref: 'أبو داود' }
    ],
    'مساء': [
      { text: 'اللهم بك أمسينا وبك أصبحنا وبك نحيا وبك نموت وإليك المصير', ref: 'أبو داود' },
      { text: 'أعوذ بكلمات الله التامات من شر ما خلق', ref: 'مسلم' },
      { text: 'اللهم إني أسألك العفو والعافية في الدنيا والآخرة', ref: 'ابن ماجه' },
      { text: 'اللهم ما أمسى بي من نعمة أو بأحد من خلقك فمنك وحدك لا شريك لك فلك الحمد ولك الشكر', ref: 'أبو داود' }
    ],
    'دعاء عام': [
      { text: 'ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار', ref: 'البقرة:201' },
      { text: 'اللهم إني أسألك الهدى والتقى والعفاف والغنى', ref: 'مسلم' },
      { text: 'يا مقلب القلوب ثبّت قلبي على دينك', ref: 'الترمذي' }
    ]
  };

  function poolFor(time) {
    try {
      if (typeof DUAS_DB !== 'undefined' && DUAS_DB && DUAS_DB.length) {
        var p = DUAS_DB.filter(function (d) {
          if (time === 'دعاء عام') return d.time !== 'صباح' && d.time !== 'مساء';
          return d.time === time;
        });
        if (p.length) return p.map(function (d) { return { text: d.text, ref: d.ref || '' }; });
      }
    } catch (e) {}
    return FB[time] || FB['دعاء عام'];
  }

  function lockedDua(time, advance) {
    if (!advance && _duaFixed[time]) return _duaFixed[time];
    var pool = poolFor(time);
    var key = 'huda_dua_idx_' + time;
    var idx = 0;
    try { idx = parseInt(localStorage.getItem(key) || '0', 10) || 0; } catch (e) {}
    if (advance) idx = (idx + 1) % pool.length;
    else idx = dayIndex() % pool.length;
    try { localStorage.setItem(key, String(idx)); } catch (e) {}
    _duaFixed[time] = pool[idx % pool.length];
    return _duaFixed[time];
  }

  function paintDua(time, id, advance) {
    var d = lockedDua(time, !!advance);
    var t = document.getElementById('dua-' + id + '-text');
    var r = document.getElementById('dua-' + id + '-ref');
    if (t) {
      t.textContent = d.text;
      t.style.cssText = 'font-size:1.05rem;line-height:2;direction:rtl;text-align:right;color:#f0e8d8;opacity:1;visibility:visible;display:block;min-height:3em;';
    }
    if (r) { r.textContent = d.ref ? ('📚 ' + d.ref) : ''; r.style.color = '#c9a84c'; }
  }

  window.renderDuas = function () {
    // NO advance — keep same duas until user clicks
    paintDua('صباح', 'morning', false);
    paintDua('مساء', 'evening', false);
    paintDua('دعاء عام', 'general', false);
  };
  window.nextDua = function (time) {
    var map = { 'صباح': 'morning', 'مساء': 'evening', 'دعاء عام': 'general' };
    var id = map[time];
    if (!id) return;
    paintDua(time, id, true);
    try { if (navigator.vibrate) navigator.vibrate(12); } catch (e) {}
  };

    /* ══════ 2) Tasbeeh: handled ONLY in tasbeeh.js (v802) ══════ */

  /* ══════ 3) Home: update countdown only if text changes ══════ */
  var _lastCd = '', _lastNext = '';
  function calmHomeTick() {
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
      if (nextP && hvNext) {
        var nt = nextP.name;
        if (nt !== _lastNext) { hvNext.textContent = nt; _lastNext = nt; }
      }
      if (nextT && hvCd) {
        var diff = Math.max(0, Math.floor((nextT - now) / 1000));
        var h = Math.floor(diff / 3600), m = Math.floor((diff % 3600) / 60), s = diff % 60;
        var cd = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
        if (cd !== _lastCd) { hvCd.textContent = cd; _lastCd = cd; }
      }
    } catch (e) {}
  }

  /* ══════ 4) Qibla: accurate bearing + distance + freeze on stop ══════ */
  var MAK_LAT = 21.422487, MAK_LNG = 39.826206;
  function toRad(d) { return d * Math.PI / 180; }
  function toDeg(r) { return r * 180 / Math.PI; }

  window.hudaUpdateQibla = function (lat, lng) {
    lat = parseFloat(lat); lng = parseFloat(lng);
    if (isNaN(lat) || isNaN(lng)) return;
    var φ1 = toRad(lat), φ2 = toRad(MAK_LAT);
    var Δλ = toRad(MAK_LNG - lng);
    var y = Math.sin(Δλ) * Math.cos(φ2);
    var x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    var b = (toDeg(Math.atan2(y, x)) + 360) % 360;
    window._qBearing = b;
    window._qFrozenAngle = b; // absolute bearing when compass off

    var deg = document.getElementById('qibla-degree');
    if (deg) deg.textContent = Math.round(b) + '°';

    // Haversine distance km
    var R = 6371.0088;
    var dLat = toRad(MAK_LAT - lat), dLng = toRad(MAK_LNG - lng);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat)) * Math.cos(toRad(MAK_LAT)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    var dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distEl = document.getElementById('qibla-dist');
    if (distEl) distEl.textContent = Math.round(dist).toLocaleString('ar-EG') + ' كم إلى مكة';

    var dial = document.getElementById('qibla-dial');
    if (dial && !window._qLive) {
      dial.style.transform = 'rotate(' + b + 'deg)';
    }
    var st = document.getElementById('qibla-status');
    if (st && !window._qLive) {
      st.textContent = 'اتجاه القبلة ' + Math.round(b) + '° من الشمال · ' + Math.round(dist).toLocaleString('ar-EG') + ' كم';
    }
  };

  function stopCompass() {
    window._qLive = false;
    try {
      window.removeEventListener('deviceorientationabsolute', window._ho79);
      window.removeEventListener('deviceorientation', window._ho79);
    } catch (e) {}
    // Freeze dial at last relative angle OR absolute bearing
    var dial = document.getElementById('qibla-dial');
    if (dial && typeof window._qLastRotate === 'number') {
      dial.style.transform = 'rotate(' + window._qLastRotate + 'deg)';
    } else if (dial && typeof window._qBearing === 'number') {
      dial.style.transform = 'rotate(' + window._qBearing + 'deg)';
    }
    var btn = document.getElementById('qibla-live-btn');
    if (btn) { btn.textContent = '🧭 تفعيل البوصلة الحية'; btn.classList.remove('active'); }
    var st = document.getElementById('qibla-status');
    if (st) st.textContent = 'البوصلة متوقفة — الاتجاه ثابت';
  }

  function startCompass() {
    var la = window.userLat || parseFloat(localStorage.getItem('saved_lat') || '30.0444');
    var ln = window.userLng || parseFloat(localStorage.getItem('saved_lng') || '31.2357');
    window.hudaUpdateQibla(la, ln);

    function onO(e) {
      if (!window._qLive) return;
      var heading = null;
      if (typeof e.webkitCompassHeading === 'number') heading = e.webkitCompassHeading;
      else if (typeof e.alpha === 'number') {
        // prefer absolute
        if (e.absolute === true || e.absolute === undefined) heading = (360 - e.alpha) % 360;
        else heading = (360 - e.alpha) % 360;
      }
      if (heading == null || isNaN(heading)) return;
      var bearing = window._qBearing || 0;
      var rot = bearing - heading;
      window._qLastRotate = rot;
      var dial = document.getElementById('qibla-dial');
      if (dial) dial.style.transform = 'rotate(' + rot + 'deg)';
      var diff = Math.abs(((rot % 360) + 360) % 360);
      if (diff > 180) diff = 360 - diff;
      var st = document.getElementById('qibla-status');
      if (st) st.textContent = diff < 8 ? '✅ أنت باتجاه القبلة' : ('الفرق عن القبلة ' + Math.round(diff) + '°');
    }
    try {
      window.removeEventListener('deviceorientationabsolute', window._ho79);
      window.removeEventListener('deviceorientation', window._ho79);
    } catch (e) {}
    window._ho79 = onO;
    window._qLive = true;
    if ('ondeviceorientationabsolute' in window) {
      window.addEventListener('deviceorientationabsolute', onO, true);
    }
    window.addEventListener('deviceorientation', onO, true);
    var btn = document.getElementById('qibla-live-btn');
    if (btn) { btn.textContent = '⏹ إيقاف البوصلة'; btn.classList.add('active'); }
    if (typeof showToast === 'function') showToast('🧭 البوصلة مفعّلة — أمسك الهاتف أفقيًا');
  }

  // Capture click on qibla button — override previous handlers
  document.addEventListener('click', function (e) {
    var btn = e.target && (e.target.id === 'qibla-live-btn' ? e.target : (e.target.closest && e.target.closest('#qibla-live-btn')));
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    if (window._qLive) stopCompass();
    else startCompass();
  }, true);

  /* ══════ 5) Native notifications (Capacitor) ══════ */
  window.hudaRequestNotifs = async function () {
    try {
      var Cap = window.Capacitor;
      if (Cap && Cap.isNativePlatform && Cap.isNativePlatform()) {
        var LN = Cap.Plugins && Cap.Plugins.LocalNotifications;
        if (LN) {
          if (LN.createChannel) {
            try {
              await LN.createChannel({
                id: 'huda-prayer',
                name: 'مواقيت الصلاة',
                importance: 5,
                visibility: 1,
                sound: 'default',
                vibration: true
              });
            } catch (e) {}
          }
          var perm = await LN.requestPermissions();
          var ok = perm && (perm.display === 'granted' || perm.receive === 'granted');
          if (ok) {
            if (typeof showToast === 'function') showToast('✓ تم تفعيل الإشعارات');
            // schedule via native if available
            if (typeof window.HudaNative !== 'undefined' && window.HudaNative.reschedule) {
              try { window.HudaNative.reschedule(); } catch (e) {}
            }
            return true;
          }
          if (typeof showToast === 'function') showToast('ارفض الإذن — فعّله من إعدادات التطبيق');
          return false;
        }
      }
      // Web fallback
      if (!('Notification' in window)) {
        if (typeof showToast === 'function') showToast('فعّل الإشعارات من إعدادات التطبيق');
        return false;
      }
      var p = await Notification.requestPermission();
      if (p === 'granted') {
        if (typeof showToast === 'function') showToast('✓ تم تفعيل الإشعارات');
        return true;
      }
      if (typeof showToast === 'function') showToast('لم يتم منح إذن الإشعارات');
      return false;
    } catch (e) {
      if (typeof showToast === 'function') showToast('تعذّر طلب الإذن');
      return false;
    }
  };

  // Override browser-only alert path
  window.enableNotifs = window.hudaRequestNotifs;
  window.requestNotifPermission = window.hudaRequestNotifs;

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t) return;
    var id = t.id || '';
    var txt = (t.textContent || '');
    if (id === 'fab-notif' || id === 'notifBtn' || /تفعيل.*إشعار|تفعيل.*تنبيه|تفعيل الإشعارات/.test(txt)) {
      // let it run; also force native path
      setTimeout(function () { window.hudaRequestNotifs(); }, 30);
    }
  }, true);

  /* ══════ 6) Adhan play — robust ══════ */
  var ADHAN_URLS = [
    'https://www.islamcan.com/audio/adhan/azan1.mp3',
    'https://www.islamcan.com/audio/adhan/azan2.mp3',
    'https://cdn.aladhan.com/audio/adhans/a1.mp3'
  ];
  window.playAdhanNow = function () {
    try {
      if (navigator.vibrate) navigator.vibrate([300, 150, 300]);
      var urls = ADHAN_URLS.slice();
      try {
        if (typeof ADHAN_SHEIKHS !== 'undefined' && ADHAN_SHEIKHS.length) {
          var idx = typeof adhanSheikhIdx === 'number' ? adhanSheikhIdx : 0;
          urls = (ADHAN_SHEIKHS[idx].urls || []).concat(urls);
        }
      } catch (e) {}
      if (!window._adhanAud) {
        window._adhanAud = new Audio();
        window._adhanAud.setAttribute('playsinline', '');
      }
      var au = window._adhanAud;
      try { au.pause(); au.currentTime = 0; } catch (e) {}
      function next() {
        if (!urls.length) {
          if (typeof showToast === 'function') showToast('تعذّر تشغيل الأذان');
          return;
        }
        au.src = urls.shift();
        var p = au.play();
        if (p && p.catch) p.catch(function () { next(); });
      }
      next();
      if (typeof showToast === 'function') showToast('🔊 جاري تشغيل الأذان');
      if (typeof closePrayerToast === 'function') try { closePrayerToast(); } catch (e) {}
    } catch (err) {
      if (typeof showToast === 'function') showToast('خطأ في تشغيل الأذان');
    }
  };

  /* ══════ 7) Back: single step only ══════ */
  // Soften swipe-back to avoid double-home
  // (leave hudaGoBack from ux-fix if present, but debounce)
  var _backLock = 0;
  var _oldBack = window.hudaGoBack;
  window.hudaGoBack = function () {
    var now = Date.now();
    if (now - _backLock < 450) return true;
    _backLock = now;
    if (typeof _oldBack === 'function') return _oldBack();
    if (typeof _pageHistory !== 'undefined' && _pageHistory.length > 1) {
      _pageHistory.pop();
      var prev = _pageHistory[_pageHistory.length - 1];
      if (typeof SP === 'function') SP(prev, false);
      return true;
    }
    return false;
  };

  /* ══════ Boot ══════ */
  function boot() {
    // Fixed duas once
    try { window.renderDuas(); } catch (e) {}

    // Prayers once then calm tick
    try {
      var sl = localStorage.getItem('saved_lat');
      var sn = localStorage.getItem('saved_lng');
      if (sl && sn) {
        try { if (typeof userLat !== 'undefined') { userLat = parseFloat(sl); userLng = parseFloat(sn); } } catch (e) {}
        window.userLat = parseFloat(sl); window.userLng = parseFloat(sn);
      } else {
        try { if (typeof userLat !== 'undefined') { userLat = 30.0444; userLng = 31.2357; } } catch (e) {}
        window.userLat = 30.0444; window.userLng = 31.2357;
      }
      if (typeof calcPrayers === 'function') {
        var r = calcPrayers();
        if (r && r.then) r.then(function () { calmHomeTick(); }).catch(function () {});
        else calmHomeTick();
      }
      // qibla distance ready
      window.hudaUpdateQibla(window.userLat, window.userLng);
    } catch (e) {}

    setInterval(calmHomeTick, 1000);

    // Force hadiths if empty list element
    setTimeout(function () {
      var el = document.getElementById('hadith-list');
      if (el && !el.children.length && typeof renderHadithPage === 'function') {
        try { renderHadithPage(); } catch (e) {}
      }
    }, 800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 400); });
  } else {
    setTimeout(boot, 400);
  }
})();
