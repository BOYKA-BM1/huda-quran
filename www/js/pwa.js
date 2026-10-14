/* تسجيل الـ Service Worker + زر «ثبّت التطبيق» — المكان الوحيد لهما في المشروع */
(function () {
  var isNative = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  var isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  var deferred = null;

  function toast(m) { if (typeof showToast === 'function') showToast(m); }
  function btn() { return document.getElementById('pwa-install-btn'); }
  function hideBtn() { var b = btn(); if (b) b.style.display = 'none'; }

  // داخل تطبيق أندرويد (Capacitor) أو التطبيق مثبّت بالفعل: لا داعي لزر التثبيت
  if (isNative || isStandalone) {
    document.addEventListener('DOMContentLoaded', hideBtn);
    hideBtn();
  }

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferred = e;
    var b = btn(); if (b) b.style.display = '';
  });

  window.addEventListener('appinstalled', function () {
    deferred = null; hideBtn(); toast('✅ هُدى القرآن مثبّت على جهازك');
  });

  window.installPWA = async function () {
    if (deferred) {
      deferred.prompt();
      try {
        var r = await deferred.userChoice;
        if (r && r.outcome === 'accepted') toast('✅ تم تثبيت التطبيق');
      } catch (e) {}
      deferred = null;
      return;
    }
    if (isStandalone) { toast('التطبيق مثبّت ومفتوح بالفعل'); return; }
    if (!window.isSecureContext) {
      toast('التثبيت يحتاج رابط https (أو localhost). افتح الموقع بعد رفعه على استضافة https');
      return;
    }
    toast(isIOS
      ? 'على آيفون: اضغط مشاركة ثم «إضافة إلى الشاشة الرئيسية»'
      : 'من قائمة المتصفح ⋮ اختَر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية»');
  };

  if (isNative || !('serviceWorker' in navigator) || location.protocol === 'file:') return;
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').then(function (reg) {
      window._swReg = reg;
      navigator.serviceWorker.ready.then(function (r) {
        window._swReg = r;
        if (typeof schedulePrayerNotifs === 'function') { try { schedulePrayerNotifs(r); } catch (e) {} }
      });
    }).catch(function (err) { console.warn('SW registration failed:', err && err.message); });
  });
})();

/* HUDA_SW_AUTO_UPDATE */
(function () {
  if (!("serviceWorker" in navigator)) return;
  function tryUpdate() {
    navigator.serviceWorker.getRegistration().then(function (reg) {
      if (!reg) return;
      reg.update().catch(function () {});
      if (reg.waiting) {
        reg.waiting.postMessage({ type: "SKIP_WAITING" });
      }
      reg.addEventListener("updatefound", function () {
        var nw = reg.installing;
        if (!nw) return;
        nw.addEventListener("statechange", function () {
          if (nw.state === "installed" && navigator.serviceWorker.controller) {
            // new version ready — activate immediately
            if (reg.waiting) reg.waiting.postMessage({ type: "SKIP_WAITING" });
            // soft reload once
            if (!sessionStorage.getItem("huda_sw_reloaded")) {
              sessionStorage.setItem("huda_sw_reloaded", "1");
              location.reload();
            }
          }
        });
      });
    });
  }
  navigator.serviceWorker.addEventListener("controllerchange", function () {
    if (!sessionStorage.getItem("huda_sw_reloaded2")) {
      sessionStorage.setItem("huda_sw_reloaded2", "1");
      location.reload();
    }
  });
  // check on load and every 2 minutes
  tryUpdate();
  setInterval(tryUpdate, 120000);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") tryUpdate();
  });
})();
