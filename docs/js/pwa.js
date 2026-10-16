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

  /** روابط تحميل APK (Release ثم latest) */
  window.HUDA_APK_URLS = window.HUDA_APK_URLS || [
    'https://boyka-bm1.github.io/huda-quran/Huda-Al-Quran.apk',
    'Huda-Al-Quran.apk',
    'https://github.com/BOYKA-BM1/huda-quran/releases/latest/download/Huda-Al-Quran.apk'
  ];
  window.HUDA_APK_URL = window.HUDA_APK_URLS[0];

  window.installPWA = async function () {
    if (isNative) { toast('أنت بالفعل داخل التطبيق'); return; }
    if (isStandalone) { toast('التطبيق مثبّت ومفتوح بالفعل'); return; }

    var ua = navigator.userAgent || '';
    var isAndroid = /android/i.test(ua);

    // أندرويد أو سطح المكتب: تحميل APK مباشرة بدون فتح صفحة خطأ
    if (isAndroid || !isIOS) {
      toast('جاري تحميل تطبيق هُدى القرآن...');
      var urls = window.HUDA_APK_URLS.slice();
      function tryDownload(i) {
        if (i >= urls.length) {
          toast('تعذّر التحميل — افتح الرابط من Releases');
          window.open('https://github.com/BOYKA-BM1/huda-quran/releases/tag/v1.0.0', '_blank');
          return;
        }
        var url = urls[i];
        // استخدام iframe مخفي أضمن على أندرويد من فتح صفحة GitHub
        var iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = url;
        document.body.appendChild(iframe);
        setTimeout(function () {
          try { iframe.remove(); } catch (e) {}
        }, 60000);
        // احتياطي: رابط مباشر
        var a = document.createElement('a');
        a.href = url;
        a.setAttribute('download', 'Huda-Al-Quran.apk');
        a.rel = 'noopener';
        document.body.appendChild(a);
        try { a.click(); } catch (e) {}
        setTimeout(function () { try { a.remove(); } catch (e) {} }, 1000);
      }
      tryDownload(0);
      return;
    }

    if (isIOS) {
      toast('على آيفون: اضغط مشاركة ثم «إضافة إلى الشاشة الرئيسية»');
      return;
    }
    if (deferred) {
      deferred.prompt();
      try {
        var r = await deferred.userChoice;
        if (r && r.outcome === 'accepted') toast('✅ تم تثبيت التطبيق');
      } catch (e) {}
      deferred = null;
      return;
    }
    toast('اضغط الزر لتحميل التطبيق');
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
