/* Huda core v80.1 — natural back + notifs + adhan (no exitApp spam) */
(function () {
  'use strict';

  var subStack = [];
  window.hudaGoBack = function () {
    if (!subStack.length) return false;
    var fn = subStack.pop();
    try { fn(); } catch (e) {}
    return true;
  };

  // Hisn category → back to list
  function patchHisn() {
    if (typeof window.openHisnCat !== 'function' || window.openHisnCat._patched) return;
    var orig = window.openHisnCat;
    window.openHisnCat = function (id, name) {
      orig(id, name);
      subStack.push(function () {
        if (typeof renderHisnCats === 'function') renderHisnCats();
        var cats = document.getElementById('hisn-cats');
        var view = document.getElementById('hisn-view');
        if (cats) cats.style.display = '';
        if (view) view.classList.remove('on');
      });
    };
    window.openHisnCat._patched = true;
  }

  // Android / browser back — ONE step only
  var _exitArmed = false, _exitTimer = null;
  function handleBack() {
    // 1) sub-page (hisn adhkar etc.)
    if (window.hudaGoBack()) return true;
    // 2) app page history
    if (typeof _pageHistory !== 'undefined' && _pageHistory.length > 1) {
      try { history.back(); } catch (e) {}
      return true;
    }
    // 3) double-back to exit (toast once)
    if (!_exitArmed) {
      _exitArmed = true;
      if (typeof showToast === 'function') showToast('اضغط رجوع مرة أخرى للخروج');
      else if (typeof toast === 'function') toast('اضغط رجوع مرة أخرى للخروج');
      clearTimeout(_exitTimer);
      _exitTimer = setTimeout(function () { _exitArmed = false; }, 2000);
      try { history.pushState({ page: 'home' }, '', '#home'); } catch (e) {}
      return true;
    }
    // confirmed exit
    try {
      var Cap = window.Capacitor;
      if (Cap && Cap.Plugins && Cap.Plugins.App && Cap.Plugins.App.exitApp) {
        Cap.Plugins.App.exitApp();
      }
    } catch (e) {}
    return false;
  }

  try {
    var Cap = window.Capacitor;
    if (Cap && Cap.Plugins && Cap.Plugins.App && Cap.Plugins.App.addListener) {
      Cap.Plugins.App.addListener('backButton', function () {
        handleBack();
      });
    }
  } catch (e) {}

  // Notifications
  window.hudaRequestNotifs = async function () {
    try {
      var Cap = window.Capacitor;
      if (Cap && Cap.isNativePlatform && Cap.isNativePlatform()) {
        var LN = Cap.Plugins && Cap.Plugins.LocalNotifications;
        if (LN) {
          var perm = await LN.requestPermissions();
          var ok = perm && (perm.display === 'granted' || perm.receive === 'granted');
          if (typeof showToast === 'function') showToast(ok ? '✓ تم تفعيل الإشعارات' : 'فعّل الإشعارات من إعدادات التطبيق');
          return !!ok;
        }
      }
      if ('Notification' in window) {
        var p = await Notification.requestPermission();
        if (typeof showToast === 'function') showToast(p === 'granted' ? '✓ تم تفعيل الإشعارات' : 'لم يُمنح الإذن');
        return p === 'granted';
      }
    } catch (e) {}
    return false;
  };
  window.enableNotifs = window.hudaRequestNotifs;

  // Adhan
  window.playAdhanNow = function () {
    try {
      var urls = ['https://www.islamcan.com/audio/adhan/azan1.mp3', 'https://www.islamcan.com/audio/adhan/azan2.mp3'];
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
    } catch (e) {}
  };

  function boot() {
    patchHisn();
    try {
      if (typeof window.HADITHS === 'undefined' && typeof HADITHS !== 'undefined') window.HADITHS = HADITHS;
    } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 200); });
  else setTimeout(boot, 200);
})();
