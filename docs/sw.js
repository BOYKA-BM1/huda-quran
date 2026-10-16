/* v43 — auto update books + admin */
/* هُدى القرآن — Service Worker
   • الهيكل (HTML/CSS/JS) يُخزَّن مسبقاً ليعمل التطبيق أوفلاين
   • data/ (القرآن والتفسير والحديث): cache-first
   • api.alquran.cloud: stale-while-revalidate (يتراكم أوفلاين مع الاستخدام)
   • الصوت والخرائط والمواقع الأخرى: لا يتدخل فيها إطلاقاً (طلبات Range)
   ملاحظة: غيّر VERSION عند كل إصدار لتحديث الكاش. */
const VERSION = 'huda-v74';
const SHELL_CACHE = VERSION + '-shell';
const DATA_CACHE  = VERSION + '-data';
const API_CACHE   = 'huda-api-v1';
const FONT_CACHE  = 'huda-fonts-v1';
const KEEP = [SHELL_CACHE, DATA_CACHE, API_CACHE, FONT_CACHE];

const SHELL = [
  "css/fonts.css",
  "fonts/AmiriQuran-400-arabic.woff2",
  "fonts/AmiriQuran-400-latin.woff2",
  "fonts/ScheherazadeNew-400-arabic.woff2",
  "fonts/ScheherazadeNew-400-latin.woff2",
  "fonts/ScheherazadeNew-700-arabic.woff2",
  "fonts/ScheherazadeNew-700-latin.woff2",
  "fonts/Tajawal-400-arabic.woff2",
  "fonts/Tajawal-400-latin.woff2",
  "fonts/Tajawal-500-arabic.woff2",
  "fonts/Tajawal-500-latin.woff2",
  "fonts/Tajawal-700-arabic.woff2",
  "fonts/Tajawal-700-latin.woff2",
  "./",
  "index.html",
  "css/app.css",
  "css/native.css",
  "css/features.css",
  "css/v3.css",
  "css/upgrade.css",
  "css/dock.css",
  "css/paper.css",
  "css/modern-ui.css",
  "manifest.webmanifest",
  "js/persist.js","js/config.js",
  "js/quran-data.js",
  "js/app.01.js",
  "js/app.02.js",
  "js/app.03.js",
  "js/app.04.js",
  "js/app.05.js",
  "js/ui-handlers.js",
  "js/v3.js",
  "js/reader.js",
  "js/audio.js",
  "js/dock.js",
  "js/upgrade.js",
  "js/tasbeeh.js",
  "js/features-core.js",
  "js/features-ui.js",
  "js/native.js",
  "js/notifications.js",
  "js/adhan-live.js",
  "js/pwa.js",
  "js/mobile-fix.js",
  "js/nawawi40.js",
  "icons/icon-192.png",
  "icons/icon-512.png"
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(SHELL_CACHE).then((c) => Promise.all(
      SHELL.map((u) => c.add(u).catch(() => console.warn('[SW] لم يُخزَّن:', u)))
    )).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !KEEP.includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function staleWhileRevalidate(req, cacheName) {
  return caches.open(cacheName).then((cache) =>
    cache.match(req).then((hit) => {
      const net = fetch(req).then((res) => {
        if (res && res.status === 200) cache.put(req, res.clone());
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
}

function cacheFirst(req, cacheName) {
  return caches.open(cacheName).then((cache) =>
    cache.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res && res.status === 200) cache.put(req, res.clone());
      return res;
    }))
  );
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || req.headers.has('range')) return;
  const url = new URL(req.url);

  if (url.origin === self.location.origin) {
    if (req.mode === 'navigate') {
      e.respondWith(fetch(req).catch(() => caches.match('index.html')));
      return;
    }
    if (url.pathname.includes('/data/')) { e.respondWith(cacheFirst(req, DATA_CACHE)); return; }
    e.respondWith(staleWhileRevalidate(req, SHELL_CACHE));
    return;
  }
  if (url.hostname === 'api.alquran.cloud') { e.respondWith(staleWhileRevalidate(req, API_CACHE)); return; }
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(staleWhileRevalidate(req, FONT_CACHE)); return;
  }
  // أي شيء آخر (صوت، مواقيت، خرائط…) يمر مباشرة للشبكة
});

/* ── رسائل الصفحة: جدولة إشعارات (تعمل ما دام الـ SW حياً — في التطبيق الأصلي تُستخدم LocalNotifications) ── */
self.addEventListener('message', (e) => {
  const d = e.data || {};
  if (d.type === 'SCHEDULE_PRAYER') {
    const delay = d.time - Date.now();
    if (delay > 0 && delay < 3600000) {
      setTimeout(() => self.registration.showNotification('حان وقت صلاة ' + d.name, {
        body: 'اللهم اجعلنا من المقيمين الصلاة على وقتها',
        icon: 'icons/icon-192.png', badge: 'icons/icon-72.png',
        tag: 'prayer-' + d.key, dir: 'rtl', lang: 'ar',
        requireInteraction: true, vibrate: [200, 100, 200], data: { url: './#prayer' }
      }), delay);
    }
  } else if (d.type === 'SCHEDULE_NOTIF') {
    if (d.delay > 0 && d.delay < 86400000) {
      setTimeout(() => self.registration.showNotification(d.title, {
        body: d.body, icon: 'icons/icon-192.png', badge: 'icons/icon-72.png',
        tag: d.tag || 'huda', dir: 'rtl', lang: 'ar', data: { url: d.url || './' }
      }), d.delay);
    }
  }
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const target = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((cs) => {
      const c = cs[0];
      if (c) { c.focus(); return; }
      return self.clients.openWindow(target);
    })
  );
});


self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
