/* Huda v79.3b HARD — net dot, Latin countdown, offline msgs, notifs, khatma */
(function () {
  'use strict';

  var EG = [
    {name:'القاهرة',lat:30.0444,lng:31.2357},{name:'الجيزة',lat:29.9871,lng:31.1726},
    {name:'الإسكندرية',lat:31.2001,lng:29.9187},{name:'الشرقية',lat:30.7487,lng:31.8767},
    {name:'الدقهلية',lat:30.9880,lng:31.4143},{name:'المنوفية',lat:30.4948,lng:30.9862},
    {name:'الغربية',lat:30.8667,lng:31.0333},{name:'كفر الشيخ',lat:31.1107,lng:30.9388},
    {name:'البحيرة',lat:30.3593,lng:30.3727},{name:'الإسماعيلية',lat:30.5965,lng:32.2715},
    {name:'السويس',lat:29.9737,lng:32.5270},{name:'بورسعيد',lat:31.2565,lng:32.2841},
    {name:'الفيوم',lat:29.3084,lng:30.8428},{name:'بني سويف',lat:29.0661,lng:31.0994},
    {name:'المنيا',lat:28.0871,lng:30.7618},{name:'أسيوط',lat:27.1809,lng:31.1837},
    {name:'سوهاج',lat:26.5590,lng:31.6948},{name:'قنا',lat:26.1551,lng:32.7160},
    {name:'الأقصر',lat:25.6872,lng:32.6396},{name:'أسوان',lat:24.0889,lng:32.8998},
    {name:'الوادي الجديد',lat:25.5000,lng:28.8333},{name:'مطروح',lat:31.3543,lng:27.2373},
    {name:'شمال سيناء',lat:30.2805,lng:33.6228},{name:'جنوب سيناء',lat:29.3100,lng:34.1500},
    {name:'البحر الأحمر',lat:26.7000,lng:33.8333},{name:'دمياط',lat:31.4165,lng:31.8133},
    {name:'قليوبية',lat:30.3287,lng:31.2137}
  ];
  var WORLD = [
    {name:'مكة المكرمة 🇸🇦',lat:21.3891,lng:39.8579},{name:'المدينة المنورة 🇸🇦',lat:24.5247,lng:39.5692},
    {name:'الرياض 🇸🇦',lat:24.7136,lng:46.6753},{name:'جدة 🇸🇦',lat:21.5433,lng:39.1728},
    {name:'دبي 🇦🇪',lat:25.2048,lng:55.2708},{name:'أبوظبي 🇦🇪',lat:24.4539,lng:54.3773},
    {name:'الكويت 🇰🇼',lat:29.3759,lng:47.9774},{name:'الدوحة 🇶🇦',lat:25.2854,lng:51.5310},
    {name:'عمّان 🇯🇴',lat:31.9454,lng:35.9284},{name:'بيروت 🇱🇧',lat:33.8938,lng:35.5018},
    {name:'دمشق 🇸🇾',lat:33.5138,lng:36.2765},{name:'بغداد 🇮🇶',lat:33.3152,lng:44.3661},
    {name:'القدس 🇵🇸',lat:31.7683,lng:35.2137},{name:'تونس 🇹🇳',lat:36.8065,lng:10.1815},
    {name:'الجزائر 🇩🇿',lat:36.7538,lng:3.0588},{name:'الرباط 🇲🇦',lat:34.0209,lng:-6.8416},
    {name:'إسطنبول 🇹🇷',lat:41.0082,lng:28.9784},{name:'كوالالمبور 🇲🇾',lat:3.1390,lng:101.6869},
    {name:'جاكرتا 🇮🇩',lat:-6.2088,lng:106.8456},{name:'لندن 🇬🇧',lat:51.5074,lng:-0.1278}
  ];
  var HIJRI_M = ['محرم','صفر','ربيع الأول','ربيع الثاني','جمادى الأولى','جمادى الآخرة','رجب','شعبان','رمضان','شوال','ذو القعدة','ذو الحجة'];
  var GREG_D = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
  var GREG_M = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

  function $(id){ return document.getElementById(id); }
  function pad(n){ n = n|0; return (n < 10 ? '0' : '') + n; }
  function toLatin(s){
    return String(s).replace(/[٠-٩]/g, function(d){ return '0123456789'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)]; });
  }

  function gregToHijri(gy, gm, gd) {
    var y = gy, m = gm;
    if (m <= 2) { y--; m += 12; }
    var A = Math.floor(y / 100);
    var B = 2 - A + Math.floor(A / 4);
    var JD = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + gd + B - 1524;
    var l = JD - 1948440 + 10632;
    var n = Math.floor((l - 1) / 10631);
    l = l - 10631 * n + 354;
    var j = (Math.floor((10985 - l) / 5316)) * (Math.floor((50 * l) / 17719)) + (Math.floor(l / 5670)) * (Math.floor((43 * l) / 15238));
    l = l - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) - (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
    var hm = Math.floor((24 * l) / 709);
    var hd = l - Math.floor((709 * hm) / 24);
    var hy = 30 * n + j - 30;
    return { y: hy, m: hm, d: hd };
  }

  /* ══════ Dates ══════ */
  window.updateDates = function () {
    try {
      var now = new Date();
      var gEl = $('greg-date'), gDay = $('greg-day');
      var hEl = $('hijri-date'), hSub = $('hijri-month-ar');
      var tEl = $('current-time'), aEl = $('current-ampm');
      if (gEl) gEl.textContent = now.getDate() + ' ' + GREG_M[now.getMonth()];
      if (gDay) gDay.textContent = GREG_D[now.getDay()] + ' ' + now.getFullYear() + 'م';
      var h = gregToHijri(now.getFullYear(), now.getMonth() + 1, now.getDate());
      if (hEl) hEl.textContent = h.d + ' ' + (HIJRI_M[h.m - 1] || '');
      if (hSub) hSub.textContent = h.y + ' هـ';
      var hh = now.getHours(), mm = now.getMinutes(), ss = now.getSeconds();
      var hh12 = hh % 12 || 12;
      if (tEl) tEl.textContent = pad(hh12) + ':' + pad(mm) + ':' + pad(ss);
      if (aEl) aEl.textContent = hh >= 12 ? 'مساءً' : 'صباحاً';
    } catch (e) {}
  };

  /* ══════ Latin countdown ONLY (home + prayer) ══════ */
  function forceLatinCountdown() {
    ['hv-cd', 'np-cdown', 'adhan2-cdown', 'home-cdown', 'sleep-countdown'].forEach(function (id) {
      var el = $(id);
      if (!el) return;
      var raw = el.textContent || '';
      var fixed = toLatin(raw);
      // strip any non time chars except : and digits
      fixed = fixed.replace(/[^\d:]/g, '');
      if (fixed && fixed !== raw) el.textContent = fixed;
    });
  }
  var _uc0 = window.updateCountdown;
  window.updateCountdown = function () {
    try { if (typeof _uc0 === 'function') _uc0(); } catch (e) {}
    forceLatinCountdown();
  };

  /* ══════ Location selector ══════ */
  window.buildLocSelector = function () {
    var sel = $('loc-select');
    if (!sel) return;
    var eg = EG.map(function (g) {
      return '<option value="' + g.lat + ',' + g.lng + '">🇪🇬 ' + g.name + '</option>';
    }).join('');
    var w = WORLD.map(function (g) {
      return '<option value="' + g.lat + ',' + g.lng + '">' + g.name + '</option>';
    }).join('');
    sel.innerHTML =
      '<option value="">— اختر موقع أو محافظة —</option>' +
      '<optgroup label="محافظات مصر">' + eg + '</optgroup>' +
      '<optgroup label="مدن وعواصم">' + w + '</optgroup>';
    try {
      var sl = localStorage.getItem('saved_lat');
      var sn = localStorage.getItem('saved_lng');
      if (sl && sn) {
        var target = parseFloat(sl), targetn = parseFloat(sn);
        Array.prototype.forEach.call(sel.options, function (o) {
          if (!o.value) return;
          var p = o.value.split(',');
          if (Math.abs(parseFloat(p[0]) - target) < 0.05 && Math.abs(parseFloat(p[1]) - targetn) < 0.05) sel.value = o.value;
        });
      }
    } catch (e) {}
  };

  window.setLocFromSelect = function (val) {
    if (!val) return;
    var parts = val.split(',').map(Number);
    var la = parts[0], ln = parts[1];
    try { window.userLat = la; window.userLng = ln; } catch (e) {}
    try { if (typeof userLat !== 'undefined') { userLat = la; userLng = ln; } } catch (e) {}
    var all = EG.concat(WORLD);
    var found = all.find(function (g) { return Math.abs(g.lat - la) < 0.01 && Math.abs(g.lng - ln) < 0.01; });
    var name = found ? found.name : (la.toFixed(2) + '°, ' + ln.toFixed(2) + '°');
    var el = $('loc-name'); if (el) el.textContent = name;
    try {
      localStorage.setItem('saved_lat', String(la));
      localStorage.setItem('saved_lng', String(ln));
      localStorage.setItem('saved_loc_name', name);
    } catch (e) {}
    if (typeof calcPrayers === 'function') { try { calcPrayers(); } catch (e) {} }
    if (typeof showToast === 'function') showToast('✓ تم تحديد: ' + name);
  };

  function applyCoords(lat, lng, name) {
    try { window.userLat = lat; window.userLng = lng; } catch (e) {}
    try { if (typeof userLat !== 'undefined') { userLat = lat; userLng = lng; } } catch (e) {}
    try {
      localStorage.setItem('saved_lat', String(lat));
      localStorage.setItem('saved_lng', String(lng));
      if (name) localStorage.setItem('saved_loc_name', name);
    } catch (e) {}
    var el = $('loc-name');
    if (el) el.textContent = name || (lat.toFixed(3) + '°, ' + lng.toFixed(3) + '°');
    if (typeof calcPrayers === 'function') { try { calcPrayers(); } catch (e) {} }
    window.updateDates();
  }

  window.getLocation = function (force) {
    var el = $('loc-name');
    if (!force) {
      try {
        var sl = localStorage.getItem('saved_lat');
        var sn = localStorage.getItem('saved_lng');
        var snm = localStorage.getItem('saved_loc_name');
        if (sl && sn) { applyCoords(parseFloat(sl), parseFloat(sn), snm); return; }
      } catch (e) {}
    }
    if (el) el.textContent = 'جارٍ تحديد موقعك...';
    var done = false;
    function finish(lat, lng, name) {
      if (done) return; done = true;
      applyCoords(lat, lng, name);
    }
    function failFallback(msg) {
      if (done) return;
      try {
        var sl = localStorage.getItem('saved_lat'), sn = localStorage.getItem('saved_lng');
        if (sl && sn) { finish(parseFloat(sl), parseFloat(sn), localStorage.getItem('saved_loc_name')); return; }
      } catch (e) {}
      finish(30.0444, 31.2357, 'القاهرة');
      if (el && msg) el.textContent = msg + ' — القاهرة';
    }
    setTimeout(function () { if (!done) failFallback('انتهت مهلة تحديد الموقع'); }, 12000);
    try {
      var Cap = window.Capacitor;
      var Geo = Cap && Cap.Plugins && (Cap.Plugins.Geolocation || Cap.Plugins.geolocation);
      if (Geo && Geo.getCurrentPosition) {
        Geo.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 }).then(function (pos) {
          var c = pos.coords || pos;
          finish(c.latitude, c.longitude, null);
        }).catch(function () { browserGeo(); });
        return;
      }
    } catch (e) {}
    browserGeo();
    function browserGeo() {
      if (!navigator.geolocation) { failFallback('الموقع غير مدعوم'); return; }
      navigator.geolocation.getCurrentPosition(
        function (pos) { finish(pos.coords.latitude, pos.coords.longitude, null); },
        function (err) {
          var msg = 'تعذّر تحديد الموقع';
          if (err && err.code === 1) msg = 'يلزم إذن الموقع';
          failFallback(msg);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    }
  };

  /* ══════ Net indicator: tiny + red offline + banner ══════ */
  var _wasOffline = false;
  function ensureOfflineBanner() {
    var b = $('huda-offline-banner');
    if (!b) {
      b = document.createElement('div');
      b.id = 'huda-offline-banner';
      b.setAttribute('dir', 'rtl');
      b.textContent = 'غير متصل بالإنترنت — بعض الميزات تحتاج اتصال';
      if (document.body) document.body.insertBefore(b, document.body.firstChild);
    }
    b.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:100001;background:#b91c1c;color:#fff;text-align:center;font-size:12px;padding:7px 10px;font-family:Tajawal,sans-serif;direction:rtl';
    return b;
  }
  function paintNet() {
    var d = $('odot') || document.querySelector('.offline-dot');
    var badge = $('ofbadge');
    if (d) {
      ['width','height','minWidth','maxWidth'].forEach(function(k){ d.style.setProperty(k==='minWidth'?'min-width':k==='maxWidth'?'max-width':k, '7px', 'important'); });
      d.style.setProperty('border-radius', '50%', 'important');
      d.style.setProperty('display', 'block', 'important');
      if (navigator.onLine) {
        d.classList.add('online'); d.classList.remove('offline');
        d.style.setProperty('background', '#22c55e', 'important');
        d.style.setProperty('box-shadow', '0 0 5px #22c55e', 'important');
        d.title = 'متصل بالإنترنت';
      } else {
        d.classList.remove('online'); d.classList.add('offline');
        d.style.setProperty('background', '#ef4444', 'important');
        d.style.setProperty('box-shadow', '0 0 5px #ef4444', 'important');
        d.title = 'غير متصل';
      }
    }
    if (badge) {
      badge.style.setProperty('padding', '0', 'important');
      badge.style.setProperty('background', 'transparent', 'important');
      badge.style.setProperty('border', 'none', 'important');
    }
    var ban = ensureOfflineBanner();
    if (!navigator.onLine) {
      ban.style.setProperty('display', 'block', 'important');
      if (!_wasOffline) {
        if (typeof showToast === 'function') showToast('غير متصل بالإنترنت');
        _wasOffline = true;
      }
    } else {
      ban.style.setProperty('display', 'none', 'important');
      if (_wasOffline) {
        if (typeof showToast === 'function') showToast('✅ عاد الاتصال بالإنترنت');
        _wasOffline = false;
      }
    }
  }
  window.updateNetStatus = paintNet;
  window.addEventListener('online', paintNet);
  window.addEventListener('offline', paintNet);

  /* ══════ Offline guard for downloads / network actions ══════ */
  window.hudaRequireOnline = function (msg) {
    if (navigator.onLine) return true;
    var m = msg || 'غير متصل بالإنترنت';
    if (typeof showToast === 'function') showToast(m);
    else alert(m);
    return false;
  };
  // Wrap HudaAudio.download
  function patchAudioDownload() {
    if (!window.HudaAudio || !window.HudaAudio.download || window.HudaAudio.download._off) return;
    var orig = window.HudaAudio.download;
    window.HudaAudio.download = function () {
      if (!window.hudaRequireOnline('غير متصل بالإنترنت — لا يمكن التحميل الآن')) {
        return Promise.reject(new Error('offline'));
      }
      return orig.apply(this, arguments);
    };
    window.HudaAudio.download._off = true;
  }
  // Click intercept for download buttons
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || navigator.onLine) return;
    var txt = (t.textContent || '') + ' ' + (t.getAttribute('aria-label') || '') + ' ' + (t.title || '');
    var id = t.id || '';
    if (/تنزيل|تحميل|download|offline-dl|dl-surah|dl-quran/i.test(txt + id) ||
        (t.closest && t.closest('[data-download],.btn-download,#dl-btn,.download-btn'))) {
      e.preventDefault();
      e.stopPropagation();
      if (typeof showToast === 'function') showToast('غير متصل بالإنترنت');
    }
  }, true);

  /* ══════ Native notifications + system sound ══════ */
  window.hudaRequestNotifs = async function () {
    try {
      var Cap = window.Capacitor;
      if (Cap && Cap.isNativePlatform && Cap.isNativePlatform()) {
        var LN = Cap.Plugins && Cap.Plugins.LocalNotifications;
        if (LN) {
          try {
            if (LN.createChannel) {
              await LN.createChannel({
                id: 'huda-prayer',
                name: 'مواقيت الصلاة',
                description: 'تنبيهات الأذان والصلاة',
                importance: 5,
                visibility: 1,
                sound: 'default',
                vibration: true
              });
            }
          } catch (e) {}
          var perm = await LN.requestPermissions();
          var ok = perm && (perm.display === 'granted' || perm.receive === 'granted');
          if (ok) {
            if (typeof showToast === 'function') showToast('✓ تم تفعيل الإشعارات');
            try { localStorage.setItem('nq_notif_on', '1'); } catch (e) {}
            if (window.HudaNative && HudaNative.reschedule) try { HudaNative.reschedule(); } catch (e) {}
            return true;
          }
          if (typeof showToast === 'function') showToast('فعّل الإشعارات من إعدادات التطبيق');
          return false;
        }
      }
      if (!('Notification' in window)) {
        if (typeof showToast === 'function') showToast('فعّل الإشعارات من إعدادات التطبيق');
        return false;
      }
      var p = await Notification.requestPermission();
      if (p === 'granted') {
        if (typeof showToast === 'function') showToast('✓ تم تفعيل الإشعارات');
        try { localStorage.setItem('nq_notif_on', '1'); } catch (e) {}
        return true;
      }
      if (typeof showToast === 'function') showToast('لم يتم منح إذن الإشعارات');
      return false;
    } catch (e) {
      if (typeof showToast === 'function') showToast('تعذّر طلب الإذن');
      return false;
    }
  };
  window.enableNotifs = window.hudaRequestNotifs;
  window.requestNotifPermission = window.hudaRequestNotifs;

  /* ══════ Khatma: restore only if user saved; clear stays clear ══════ */
  function restoreKhatmaIfSaved() {
    try {
      var raw = null;
      try { raw = localStorage.getItem('huda_khatma_plan_v1'); } catch (e) {}
      if (!raw) return; // no plan — leave empty
      if (typeof loadKhatmaState !== 'function') return;
      var st = loadKhatmaState();
      if (!st || !st.totalDays) return;
      var days = $('k-days'); if (days) days.value = st.totalDays;
      var tm = $('k-times'); if (tm && st.times) tm.value = st.times;
      var u = $('k-unit'); if (u && st.unit) u.value = st.unit;
      var s = $('k-start'); if (s && st.startDate) s.value = st.startDate;
      var t = $('k-time'); if (t && st.dailyTime) t.value = st.dailyTime;
      if (typeof calcKhatma === 'function') { try { calcKhatma(true); } catch (e) {} }
      if (typeof updateKhatmaBookmarkUI === 'function') updateKhatmaBookmarkUI();
    } catch (e) {}
  }
  // Ensure reset truly clears
  var _rk = window.resetKhatmaBookmark;
  window.resetKhatmaBookmark = function () {
    try {
      localStorage.removeItem('huda_khatma_plan_v1');
      localStorage.removeItem('huda_khatma_plan_backup');
      localStorage.removeItem('huda_khatma_bm');
      sessionStorage.removeItem('huda_khatma_plan_v1');
    } catch (e) {}
    if (typeof _rk === 'function') try { _rk(); } catch (e) {}
    var box = $('khatma-result'); if (box) box.innerHTML = '';
    if (typeof showToast === 'function') showToast('تم حذف خطة الختمة');
  };

  /* CSS */
  try {
    var st = document.createElement('style');
    st.id = 'huda-v793-css';
    st.textContent =
      '#ofbadge{padding:0!important;margin:0;background:transparent!important;border:none!important}' +
      '.offline-dot,#odot{width:6px!important;height:6px!important;min-width:6px!important;border-radius:50%!important;display:inline-block!important}' +
      '.offline-dot.online,#odot.online{background:#22c55e!important;box-shadow:0 0 4px #22c55e}' +
      '.offline-dot:not(.online),#odot:not(.online){background:#ef4444!important;box-shadow:0 0 4px #ef4444}' +
      '#hv-cd,#np-cdown,.np-countdown,.hv-cd{font-variant-numeric:tabular-nums;font-feature-settings:"tnum";direction:ltr!important;unicode-bidi:isolate;font-family:ui-monospace,Menlo,monospace,Tajawal,sans-serif}' +
      '#loc-select,select.loc-sel{color:var(--tx,#f5f0e0);background:rgba(0,0,0,.35)}' +
      '#loc-select option{color:#111;background:#fff}';
    document.head.appendChild(st);
  } catch (e) {}

  function boot() {
    paintNet();
    window.buildLocSelector();
    window.updateDates();
    try {
      var sl = localStorage.getItem('saved_lat');
      var sn = localStorage.getItem('saved_lng');
      if (sl && sn) applyCoords(parseFloat(sl), parseFloat(sn), localStorage.getItem('saved_loc_name'));
      else {
        applyCoords(30.0444, 31.2357, 'القاهرة');
        setTimeout(function () { window.getLocation(true); }, 800);
      }
    } catch (e) { applyCoords(30.0444, 31.2357, 'القاهرة'); }
    if (typeof calcPrayers === 'function') { try { calcPrayers(); } catch (e) {} }
    forceLatinCountdown();
    restoreKhatmaIfSaved();
    patchAudioDownload();
    setTimeout(patchAudioDownload, 2000);
    // Request notifs once on native after short delay (like real apps)
    setTimeout(function () {
      try {
        var Cap = window.Capacitor;
        if (Cap && Cap.isNativePlatform && Cap.isNativePlatform()) {
          if (localStorage.getItem('nq_notif_asked') !== '1') {
            localStorage.setItem('nq_notif_asked', '1');
            window.hudaRequestNotifs();
          }
        }
      } catch (e) {}
    }, 2500);
    setInterval(function () {
      window.updateDates();
      forceLatinCountdown();
      paintNet();
    }, 1000);
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t) return;
    if (t.id === 'gps-btn' || t.id === 'loc-gps' || (t.closest && t.closest('#gps-btn'))) {
      e.preventDefault();
      window.getLocation(true);
    }
    var id = t.id || '';
    var txt = (t.textContent || '');
    if (id === 'fab-notif' || id === 'notifBtn' || /تفعيل.*إشعار|تفعيل.*تنبيه|تفعيل الإشعارات/.test(txt)) {
      setTimeout(function () { window.hudaRequestNotifs(); }, 40);
    }
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 300); });
  } else {
    setTimeout(boot, 300);
  }
})();
