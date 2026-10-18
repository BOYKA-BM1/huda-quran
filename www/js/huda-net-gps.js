/* Huda v794 — real offline detect + GPS + qibla fallback + stable countdown */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }

  /* ══════ Real connectivity (navigator.onLine alone is unreliable on Android) ══════ */
  var _online = navigator.onLine;
  var _probeTimer = null;
  var _wasOffline = false;

  function setOnlineUI(online) {
    _online = !!online;
    var d = $('odot') || document.querySelector('.offline-dot');
    if (d) {
      d.style.setProperty('width', '7px', 'important');
      d.style.setProperty('height', '7px', 'important');
      d.style.setProperty('min-width', '7px', 'important');
      d.style.setProperty('border-radius', '50%', 'important');
      d.style.setProperty('display', 'block', 'important');
      if (_online) {
        d.classList.add('online'); d.classList.remove('offline');
        d.style.setProperty('background', '#22c55e', 'important');
        d.style.setProperty('box-shadow', '0 0 5px #22c55e', 'important');
      } else {
        d.classList.remove('online'); d.classList.add('offline');
        d.style.setProperty('background', '#ef4444', 'important');
        d.style.setProperty('box-shadow', '0 0 5px #ef4444', 'important');
      }
    }
    var ban = $('huda-offline-banner');
    if (!ban) {
      ban = document.createElement('div');
      ban.id = 'huda-offline-banner';
      ban.textContent = 'غير متصل بالإنترنت — بعض الميزات تحتاج اتصال';
      if (document.body) document.body.insertBefore(ban, document.body.firstChild);
    }
    ban.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:100001;background:#b91c1c;color:#fff;text-align:center;font-size:12px;padding:7px 10px;font-family:Tajawal,sans-serif;direction:rtl';
    if (!_online) {
      ban.style.display = 'block';
      if (!_wasOffline && typeof showToast === 'function') showToast('غير متصل بالإنترنت');
      _wasOffline = true;
    } else {
      ban.style.display = 'none';
      if (_wasOffline && typeof showToast === 'function') showToast('✅ عاد الاتصال');
      _wasOffline = false;
    }
  }

  function probeNet() {
    if (!navigator.onLine) { setOnlineUI(false); return; }
    // quick probe — fail = offline
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var to = setTimeout(function () { try { if (ctrl) ctrl.abort(); } catch (e) {} }, 3500);
    var url = 'https://www.gstatic.com/generate_204';
    fetch(url, { method: 'GET', cache: 'no-store', mode: 'no-cors', signal: ctrl ? ctrl.signal : undefined })
      .then(function () { clearTimeout(to); setOnlineUI(true); })
      .catch(function () {
        clearTimeout(to);
        // second try: captative.apple.com style
        fetch('https://connectivitycheck.gstatic.com/generate_204', { method: 'GET', cache: 'no-store', mode: 'no-cors' })
          .then(function () { setOnlineUI(true); })
          .catch(function () { setOnlineUI(false); });
      });
  }

  window.hudaIsOnline = function () { return !!_online && navigator.onLine; };
  window.hudaRequireOnline = function (msg) {
    if (window.hudaIsOnline()) return true;
    if (typeof showToast === 'function') showToast(msg || 'غير متصل بالإنترنت');
    return false;
  };
  window.addEventListener('online', function () { probeNet(); });
  window.addEventListener('offline', function () { setOnlineUI(false); });

  /* ══════ GPS — reliable ══════ */
  function saveLoc(lat, lng, name) {
    try {
      window.userLat = lat; window.userLng = lng;
      if (typeof userLat !== 'undefined') { userLat = lat; userLng = lng; }
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
    if (typeof window.hudaUpdateQibla === 'function') { try { window.hudaUpdateQibla(lat, lng); } catch (e) {} }
  }

  function geoOnce(timeoutMs) {
    return new Promise(function (resolve, reject) {
      var done = false;
      function ok(lat, lng) { if (done) return; done = true; resolve({ lat: lat, lng: lng }); }
      function fail(err) { if (done) return; done = true; reject(err || new Error('geo fail')); }
      setTimeout(function () { fail(new Error('timeout')); }, timeoutMs || 12000);

      // Capacitor Geolocation
      try {
        var Cap = window.Capacitor;
        var Geo = Cap && Cap.Plugins && (Cap.Plugins.Geolocation || Cap.Plugins.geolocation);
        if (Geo && Geo.getCurrentPosition) {
          Geo.getCurrentPosition({ enableHighAccuracy: true, timeout: timeoutMs || 10000 })
            .then(function (pos) {
              var c = pos.coords || pos;
              ok(c.latitude, c.longitude);
            })
            .catch(function () { /* fall through */ });
        }
      } catch (e) {}

      if (!navigator.geolocation) { fail(new Error('no geo')); return; }
      navigator.geolocation.getCurrentPosition(
        function (pos) { ok(pos.coords.latitude, pos.coords.longitude); },
        function (err) { fail(err); },
        { enableHighAccuracy: true, timeout: timeoutMs || 10000, maximumAge: 15000 }
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
    var st = $('qibla-status');
    if (st) st.textContent = 'جارٍ تحديد موقعك بـ GPS...';

    try {
      var pos = await geoOnce(12000);
      saveLoc(pos.lat, pos.lng, null);
      if (typeof showToast === 'function') showToast('✓ تم تحديد موقعك');
      // reverse geocode optional
      try {
        if (window.hudaIsOnline()) {
          fetch('https://nominatim.openstreetmap.org/reverse?lat=' + pos.lat + '&lon=' + pos.lng + '&format=json', {
            headers: { 'Accept-Language': 'ar' }
          }).then(function (r) { return r.json(); }).then(function (d) {
            var city = (d.address && (d.address.city || d.address.town || d.address.state)) || '';
            if (city) saveLoc(pos.lat, pos.lng, city);
          }).catch(function () {});
        }
      } catch (e) {}
    } catch (err) {
      // fallback saved or Cairo
      try {
        var sl = localStorage.getItem('saved_lat');
        var sn = localStorage.getItem('saved_lng');
        if (sl && sn) {
          saveLoc(parseFloat(sl), parseFloat(sn), localStorage.getItem('saved_loc_name'));
          if (typeof showToast === 'function') showToast('تعذّر GPS — استخدمنا آخر موقع محفوظ');
          return;
        }
      } catch (e) {}
      saveLoc(30.0444, 31.2357, 'القاهرة');
      if (el) el.textContent = 'تعذّر GPS — القاهرة';
      if (st) st.textContent = 'تعذّر GPS — القاهرة';
      if (typeof showToast === 'function') showToast('تعذّر تحديد الموقع — تم استخدام القاهرة');
    }
  };

  // Wire buttons
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t) return;
    var btn = t.closest ? (t.closest('.pr-loc-btn') || t.closest('#gps-btn') || t.closest('[data-gps]')) : null;
    var txt = (t.textContent || '') + (btn ? btn.textContent : '');
    if (btn || /موقعي تلقائي|GPS فقط/.test(txt) || t.id === 'gps-btn') {
      // let native onclick also run; force ours
      setTimeout(function () { window.getLocation(true); }, 10);
    }
    // offline download guard
    if (!window.hudaIsOnline()) {
      if (/تنزيل|تحميل|download/i.test(txt) || (t.closest && t.closest('[data-download],.btn-download'))) {
        e.preventDefault(); e.stopPropagation();
        if (typeof showToast === 'function') showToast('غير متصل بالإنترنت — لا يمكن التحميل');
      }
    }
  }, true);

  /* ══════ Qibla: use saved location immediately ══════ */
  function refreshQiblaFromSaved() {
    try {
      var lat = parseFloat(localStorage.getItem('saved_lat') || window.userLat || 30.0444);
      var lng = parseFloat(localStorage.getItem('saved_lng') || window.userLng || 31.2357);
      if (typeof window.hudaUpdateQibla === 'function') window.hudaUpdateQibla(lat, lng);
      // distance + bearing display
      var R = 6371;
      var toRad = function (d) { return d * Math.PI / 180; };
      var lat1 = toRad(lat), lat2 = toRad(21.4225);
      var dLat = toRad(21.4225 - lat), dLng = toRad(39.8262 - lng);
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
      var dist = Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
      var y = Math.sin(toRad(39.8262 - lng)) * Math.cos(lat2);
      var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(toRad(39.8262 - lng));
      var brng = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
      var distEl = document.querySelector('.qibla-dist-val, #qibla-dist, [data-qibla-dist]');
      // try common IDs from UI
      document.querySelectorAll('.qibla-card b, .qibla-info b').forEach(function () {});
      var cards = document.querySelectorAll('.qibla-card .qibla-val, .qb-val');
      // fill status
      var st = $('qibla-status');
      if (st && /جارٍ/.test(st.textContent || '')) {
        st.textContent = '📍 ' + (localStorage.getItem('saved_loc_name') || (lat.toFixed(2) + ', ' + lng.toFixed(2))) + ' — ' + dist + ' كم · ' + Math.round(brng) + '°';
      }
      // try update distance/bearing labels if present
      var all = document.querySelectorAll('#pg-qibla b, #qibla b, .qibla-panel b');
      // safer: specific known elements
      var elDist = $('qibla-km') || $('q-dist');
      var elBr = $('qibla-deg') || $('q-bearing');
      if (elDist) elDist.textContent = dist + ' كم';
      if (elBr) elBr.textContent = Math.round(brng) + '°';
    } catch (e) {}
  }

  /* ══════ Stable home countdown (ms-based, no flicker) ══════ */
  var _lastCdTxt = '';
  function stableHomeCd() {
    try {
      var el = $('hv-cd');
      if (!el) return;
      var pt = window.prayerTimes;
      if (!pt || typeof pt.fajr !== 'number' || typeof decToDate !== 'function') return;
      var now = new Date();
      var keys = [
        { k: 'fajr', n: 'الفجر' }, { k: 'dhuhr', n: 'الظهر' }, { k: 'asr', n: 'العصر' },
        { k: 'maghrib', n: 'المغرب' }, { k: 'isha', n: 'العشاء' }
      ];
      var nextT = null, nextN = '';
      keys.forEach(function (p) {
        if (pt[p.k] == null) return;
        var t = decToDate(pt[p.k]);
        if (t && t > now && (!nextT || t < nextT)) { nextT = t; nextN = p.n; }
      });
      if (!nextT && pt.fajr != null) {
        var f = decToDate(pt.fajr);
        if (f) { nextT = new Date(f.getTime() + 86400000); nextN = 'الفجر'; }
      }
      if (!nextT) return;
      var diff = Math.max(0, Math.floor((nextT - now) / 1000));
      var h = Math.floor(diff / 3600), m = Math.floor((diff % 3600) / 60), s = diff % 60;
      var pad = function (n) { return (n < 10 ? '0' : '') + n; };
      var txt = pad(h) + ':' + pad(m) + ':' + pad(s);
      if (txt !== _lastCdTxt) { el.textContent = txt; _lastCdTxt = txt; }
    } catch (e) {}
  }

  function boot() {
    setOnlineUI(navigator.onLine);
    probeNet();
    setInterval(probeNet, 15000);
    setInterval(stableHomeCd, 1000);
    // restore location label if stuck
    try {
      var el = $('loc-name');
      var name = localStorage.getItem('saved_loc_name');
      var sl = localStorage.getItem('saved_lat');
      if (el && (/جارٍ/.test(el.textContent || '') || !el.textContent) && name) {
        el.textContent = name;
      }
      if (sl) {
        saveLoc(parseFloat(sl), parseFloat(localStorage.getItem('saved_lng') || '31.23'), name);
      }
    } catch (e) {}
    setTimeout(refreshQiblaFromSaved, 500);
    setTimeout(refreshQiblaFromSaved, 2000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 200); });
  } else {
    setTimeout(boot, 200);
  }
})();
