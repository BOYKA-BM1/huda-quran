/* Huda v79.2 — prayer/location/dates/offline/khatma hard fix */
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
    {name:'المنامة 🇧🇭',lat:26.2285,lng:50.5860},{name:'مسقط 🇴🇲',lat:23.5880,lng:58.3829},
    {name:'عمّان 🇯🇴',lat:31.9454,lng:35.9284},{name:'بيروت 🇱🇧',lat:33.8938,lng:35.5018},
    {name:'دمشق 🇸🇾',lat:33.5138,lng:36.2765},{name:'بغداد 🇮🇶',lat:33.3152,lng:44.3661},
    {name:'القدس 🇵🇸',lat:31.7683,lng:35.2137},{name:'غزة 🇵🇸',lat:31.5017,lng:34.4668},
    {name:'تونس 🇹🇳',lat:36.8065,lng:10.1815},{name:'الجزائر 🇩🇿',lat:36.7538,lng:3.0588},
    {name:'الرباط 🇲🇦',lat:34.0209,lng:-6.8416},{name:'طرابلس 🇱🇾',lat:32.8872,lng:13.1913},
    {name:'إسطنبول 🇹🇷',lat:41.0082,lng:28.9784},{name:'أنقرة 🇹🇷',lat:39.9334,lng:32.8597},
    {name:'كوالالمبور 🇲🇾',lat:3.1390,lng:101.6869},{name:'جاكرتا 🇮🇩',lat:-6.2088,lng:106.8456},
    {name:'لندن 🇬🇧',lat:51.5074,lng:-0.1278},{name:'باريس 🇫🇷',lat:48.8566,lng:2.3522},
    {name:'نيويورك 🇺🇸',lat:40.7128,lng:-74.0060}
  ];

  var HIJRI_M = ['محرم','صفر','ربيع الأول','ربيع الثاني','جمادى الأولى','جمادى الآخرة','رجب','شعبان','رمضان','شوال','ذو القعدة','ذو الحجة'];
  var GREG_D = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
  var GREG_M = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

  function $(id){ return document.getElementById(id); }
  function pad(n){ return String(n).padStart(2,'0'); }
  /* Latin digits only */
  function latNum(n){ return String(n).replace(/[٠-٩]/g, function(d){ return '0123456789'['٠١٢٣٤٥٦٧٨٩'.indexOf(d)]; }); }

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

  /* ══════ 1) Dates + clock (null-safe, Latin digits for time) ══════ */
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

  /* ══════ 2) Countdown — Latin digits only ══════ */
  var _cdLast = '';
  function forceLatinCountdown() {
    try {
      ['np-cdown', 'hv-cd', 'adhan2-cdown', 'home-cdown'].forEach(function (id) {
        var el = $(id);
        if (!el) return;
        var t = latNum(el.textContent || '');
        if (/[٠-٩]/.test(el.textContent || '')) el.textContent = t;
        // ensure format stays HH:MM:SS with latin
        if (el.textContent !== t && /\d/.test(t)) el.textContent = t;
      });
    } catch (e) {}
  }
  // Override updateCountdown to always Latin
  var _uc0 = window.updateCountdown;
  window.updateCountdown = function () {
    try {
      if (typeof _uc0 === 'function') _uc0();
    } catch (e) {}
    forceLatinCountdown();
    // If still empty, compute offline
    try {
      var el = $('np-cdown');
      if (!el) return;
      var pt = window.prayerTimes;
      if (!pt || !Object.keys(pt).length) return;
      if (typeof decToDate !== 'function') return;
      var now = new Date(), nextT = null, nextP = null;
      var keys = ['fajr','sunrise','dhuhr','asr','maghrib','isha'];
      var names = {fajr:'الفجر',sunrise:'الشروق',dhuhr:'الظهر',asr:'العصر',maghrib:'المغرب',isha:'العشاء'};
      keys.forEach(function (k) {
        if (pt[k] == null) return;
        var t = decToDate(pt[k]);
        if (t && t > now && (!nextT || t < nextT)) { nextT = t; nextP = k; }
      });
      if (!nextT && pt.fajr != null) {
        var f = decToDate(pt.fajr);
        if (f) { nextT = new Date(f.getTime() + 86400000); nextP = 'fajr'; }
      }
      if (nextT) {
        var diff = Math.max(0, Math.floor((nextT - now) / 1000));
        var h = Math.floor(diff / 3600), m = Math.floor((diff % 3600) / 60), s = diff % 60;
        var txt = pad(h) + ':' + pad(m) + ':' + pad(s);
        if (el.textContent !== txt) el.textContent = txt;
        var nn = $('np-name'); if (nn && nextP && names[nextP]) nn.textContent = names[nextP];
      }
    } catch (e) {}
  };

  /* ══════ 3) Location selector (always filled) ══════ */
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
    // restore selection
    try {
      var sl = localStorage.getItem('saved_lat');
      var sn = localStorage.getItem('saved_lng');
      if (sl && sn) {
        var target = parseFloat(sl), targetn = parseFloat(sn);
        Array.prototype.forEach.call(sel.options, function (o) {
          if (!o.value) return;
          var p = o.value.split(',');
          if (Math.abs(parseFloat(p[0]) - target) < 0.05 && Math.abs(parseFloat(p[1]) - targetn) < 0.05) {
            sel.value = o.value;
          }
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
    if (typeof calcPrayers === 'function') {
      try { var r = calcPrayers(); if (r && r.then) r.then(function(){ window.updateDates(); window.updateCountdown(); }); } catch (e) {}
    }
    if (typeof showToast === 'function') showToast('✓ تم تحديد: ' + name);
  };

  /* ══════ 4) GPS with timeout + Cairo fallback ══════ */
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
    if (typeof calcPrayers === 'function') {
      try { calcPrayers(); } catch (e) {}
    }
    window.updateDates();
    window.updateCountdown();
  }

  window.getLocation = function (force) {
    var el = $('loc-name');
    if (!force) {
      try {
        var sl = localStorage.getItem('saved_lat');
        var sn = localStorage.getItem('saved_lng');
        var snm = localStorage.getItem('saved_loc_name');
        if (sl && sn) {
          applyCoords(parseFloat(sl), parseFloat(sn), snm);
          return;
        }
      } catch (e) {}
    }
    if (el) el.textContent = 'جارٍ تحديد موقعك...';

    var done = false;
    function finish(lat, lng, name) {
      if (done) return;
      done = true;
      applyCoords(lat, lng, name);
      if (typeof showToast === 'function') showToast(name ? ('✓ ' + name) : '✓ تم تحديد الموقع');
    }
    function failFallback(msg) {
      if (done) return;
      // try saved again
      try {
        var sl = localStorage.getItem('saved_lat');
        var sn = localStorage.getItem('saved_lng');
        if (sl && sn) {
          finish(parseFloat(sl), parseFloat(sn), localStorage.getItem('saved_loc_name'));
          return;
        }
      } catch (e) {}
      finish(30.0444, 31.2357, 'القاهرة (افتراضي)');
      if (el && msg) el.textContent = msg + ' — القاهرة';
    }

    // Hard timeout 12s
    setTimeout(function () {
      if (!done) failFallback('انتهت مهلة تحديد الموقع');
    }, 12000);

    // Capacitor Geolocation if available
    try {
      var Cap = window.Capacitor;
      var Geo = Cap && Cap.Plugins && (Cap.Plugins.Geolocation || Cap.Plugins.geolocation);
      if (Geo && Geo.getCurrentPosition) {
        Geo.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000 }).then(function (pos) {
          var c = pos.coords || pos;
          finish(c.latitude, c.longitude, null);
        }).catch(function () {
          // fall through to browser
          browserGeo();
        });
        return;
      }
    } catch (e) {}

    browserGeo();

    function browserGeo() {
      if (!navigator.geolocation) {
        failFallback('الموقع غير مدعوم');
        return;
      }
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          finish(pos.coords.latitude, pos.coords.longitude, null);
        },
        function (err) {
          var msg = 'تعذّر تحديد الموقع';
          if (err && err.code === 1) msg = 'يلزم إذن الموقع من إعدادات التطبيق';
          else if (err && err.code === 3) msg = 'انتهت مهلة تحديد الموقع';
          failFallback(msg);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    }
  };

  /* ══════ 5) Online / Offline indicator ══════ */
  function paintNet() {
    var d = $('odot') || document.querySelector('.offline-dot');
    if (!d) return;
    if (navigator.onLine) {
      d.classList.add('online');
      d.classList.remove('offline');
      d.style.background = '#22c55e';
      d.style.boxShadow = '0 0 8px #22c55e';
      d.title = 'متصل بالإنترنت';
    } else {
      d.classList.remove('online');
      d.classList.add('offline');
      d.style.background = '#ef4444';
      d.style.boxShadow = '0 0 8px #ef4444';
      d.title = 'غير متصل';
    }
  }
  window.updateNetStatus = paintNet;
  window.addEventListener('online', paintNet);
  window.addEventListener('offline', paintNet);

  /* inject CSS for net dot */
  try {
    var st = document.createElement('style');
    st.textContent =
      '.offline-dot{width:10px;height:10px;border-radius:50%;background:#ef4444;display:inline-block;transition:background .3s}' +
      '.offline-dot.online{background:#22c55e!important;box-shadow:0 0 8px #22c55e}' +
      '#np-cdown,.np-countdown{font-variant-numeric:tabular-nums;font-feature-settings:"tnum";direction:ltr;unicode-bidi:isolate}' +
      '#loc-select,select.loc-sel{color:var(--tx,#f5f0e0);background:rgba(0,0,0,.35)}' +
      '#loc-select option{color:#111;background:#fff}';
    document.head.appendChild(st);
  } catch (e) {}

  /* ══════ 6) Khatma restore on boot ══════ */
  function restoreKhatma() {
    try {
      if (typeof loadKhatmaState !== 'function') return;
      var st = loadKhatmaState();
      if (!st) return;
      var days = $('k-days'); if (days && st.totalDays) days.value = st.totalDays;
      var tm = $('k-times'); if (tm && st.times) tm.value = st.times;
      var u = $('k-unit'); if (u && st.unit) u.value = st.unit;
      var s = $('k-start'); if (s && st.startDate) s.value = st.startDate;
      var t = $('k-time'); if (t && st.dailyTime) t.value = st.dailyTime;
      if (typeof calcKhatma === 'function') {
        try { calcKhatma(true); } catch (e) {}
      }
      if (typeof updateKhatmaBookmarkUI === 'function') updateKhatmaBookmarkUI();
    } catch (e) {}
  }

  /* ══════ Boot ══════ */
  function boot() {
    paintNet();
    window.buildLocSelector();
    window.updateDates();
    // Prefer saved location; GPS only if none
    try {
      var sl = localStorage.getItem('saved_lat');
      var sn = localStorage.getItem('saved_lng');
      if (sl && sn) {
        applyCoords(parseFloat(sl), parseFloat(sn), localStorage.getItem('saved_loc_name'));
      } else {
        // Default Cairo immediately so UI is never empty, then try GPS
        applyCoords(30.0444, 31.2357, 'القاهرة');
        setTimeout(function () { window.getLocation(true); }, 600);
      }
    } catch (e) {
      applyCoords(30.0444, 31.2357, 'القاهرة');
    }
    if (typeof calcPrayers === 'function') {
      try { calcPrayers(); } catch (e) {}
    }
    window.updateCountdown();
    restoreKhatma();
    setInterval(function () {
      window.updateDates();
      window.updateCountdown();
      forceLatinCountdown();
      paintNet();
    }, 1000);
  }

  // GPS button
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t) return;
    if (t.id === 'gps-btn' || t.id === 'loc-gps' || (t.closest && t.closest('#gps-btn'))) {
      e.preventDefault();
      window.getLocation(true);
    }
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 300); });
  } else {
    setTimeout(boot, 300);
  }
})();
