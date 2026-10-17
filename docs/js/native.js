/* ════════════════════════════════════════════════════════════
   جسر التطبيق الأصلي (Capacitor) — لا يفعل شيئاً في المتصفح العادي.
   • إشعارات الصلاة المجدولة بنظام أندرويد نفسه (تعمل والتطبيق مغلق)
   • يستبدل setTimeout/Service Worker غير الموثوقين في الخلفية
   ملاحظة: الصوت في الخلفية يحتاج Plugin/Foreground Service ولم يُنفَّذ هنا (انظر README).
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var Cap = window.Capacitor;
  var isNative = !!(Cap && Cap.isNativePlatform && Cap.isNativePlatform());
  window.HudaNative = { isNative: isNative };
  if (!isNative) return;

  var LN = Cap.Plugins && Cap.Plugins.LocalNotifications;
  if (!LN) { console.warn('LocalNotifications plugin غير متاح'); return; }

  var CHANNEL = 'huda-prayer';
  var DAYS_AHEAD = 7;
  var PRAYERS = [
    { key: 'fajr', name: 'الفجر' }, { key: 'dhuhr', name: 'الظهر' }, { key: 'asr', name: 'العصر' },
    { key: 'maghrib', name: 'المغرب' }, { key: 'isha', name: 'العشاء' }
  ];
  var lastSig = '';

  function lsOn(k) { try { return localStorage.getItem(k) !== '0'; } catch (e) { return true; } }

  function ensurePermission() {
    return LN.checkPermissions().then(function (p) {
      if (p.display === 'granted') return true;
      return LN.requestPermissions().then(function (r) { return r.display === 'granted'; });
    }).catch(function () { return false; });
  }

  function schedule(pt) {
    var settings = {};
    try { settings = JSON.parse(localStorage.getItem('nq_notif_settings') || '{}'); } catch (e) {}
    var pre = lsOn('nq_pre15');
    var items = [], now = Date.now();
    for (var d = 0; d < DAYS_AHEAD; d++) {
      PRAYERS.forEach(function (p, k) {
        if (settings[p.key] === false) return;           // أوقف المستخدم هذه الصلاة
        var dec = pt[p.key]; if (typeof dec !== 'number') return;
        var t = new Date(); t.setDate(t.getDate() + d); t.setHours(Math.floor(dec), Math.round((dec % 1) * 60), 0, 0);
        if (t.getTime() > now) {
          items.push({ id: 1000 + d * 10 + k, title: 'حان وقت صلاة ' + p.name, body: 'اللهم اجعلنا من المقيمين الصلاة على وقتها',
            channelId: CHANNEL, schedule: { at: t, allowWhileIdle: true }, smallIcon: 'ic_stat_huda' });
        }
        var tp = new Date(t.getTime() - 15 * 60000);
        if (pre && tp.getTime() > now) {
          items.push({ id: 2000 + d * 10 + k, title: 'بقي ١٥ دقيقة على ' + p.name, body: 'استعد للصلاة، وتوضّأ',
            channelId: CHANNEL, schedule: { at: tp, allowWhileIdle: true } });
        }
      });
    }
    return LN.getPending().then(function (pend) {
      var ids = (pend.notifications || []).filter(function (n) { return n.id >= 1000 && n.id < 3000; }).map(function (n) { return { id: n.id }; });
      return ids.length ? LN.cancel({ notifications: ids }) : null;
    }).then(function () { return items.length ? LN.schedule({ notifications: items }) : null; })
      .then(function () { console.log('[native] جُدولت ' + items.length + ' إشعاراً'); });
  }

  function tick() {
    var pt = window.prayerTimes;
    if (!pt || !pt.fajr) return;
    var sig = JSON.stringify(pt) + '|' + localStorage.getItem('nq_pre15') + '|' + localStorage.getItem('nq_notif_settings') + '|' + new Date().toDateString();
    if (sig === lastSig) return; lastSig = sig;
    ensurePermission().then(function (ok) { if (ok) return schedule(pt); }).catch(function (e) { console.warn('[native]', e); });
  }

  function init() {
    (LN.createChannel ? LN.createChannel({ id: CHANNEL, name: 'مواقيت الصلاة', description: 'تنبيهات الصلاة', importance: 5, visibility: 1, vibration: true }) : Promise.resolve())
      .catch(function () {}).then(function () { setInterval(tick, 5000); tick(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  /* الزر الخلفي في أندرويد: رجوع للصفحة السابقة بدل إغلاق التطبيق */
  var App = Cap.Plugins && Cap.Plugins.App;
  if (App && App.addListener) App.addListener('backButton', function () {
    var cur = document.querySelector('.pg.on');
    if (cur && cur.id !== 'page-home' && typeof SP === 'function') SP('home'); else if (App.exitApp) App.exitApp();
  });
})();
