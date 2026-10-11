/* تسجيل الـ Service Worker الوحيد في المشروع (للويب فقط) */
(function () {
  var isNative = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
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
