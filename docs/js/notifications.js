// ══════════════════════════════════════════
// هُدى القرآن — PWA + إشعارات الصلاة
// ══════════════════════════════════════════

// ══ طلب إذن الإشعارات ══
window.requestNotifPermission = async function() {
  if (!('Notification' in window)) {
    showToast('متصفحك لا يدعم الإشعارات');
    return false;
  }
  if (Notification.permission === 'granted') return true;
  
  const perm = await Notification.requestPermission();
  if (perm === 'granted') {
    showToast('✅ تم تفعيل الإشعارات');
    scheduleAllNotifs();
    return true;
  } else {
    showToast('⚠️ لم يتم السماح بالإشعارات');
    return false;
  }
};

// ══ جدولة إشعارات الصلاة ══
window.scheduleAllNotifs = function() {
  if (Notification.permission !== 'granted') return;
  if (!window.prayerTimes) return;
  
  const now = new Date();
  const PRAYERS = [
    { key: 'fajr',    name: 'الفجر',   icon: '🌙' },
    { key: 'dhuhr',   name: 'الظهر',   icon: '☀️' },
    { key: 'asr',     name: 'العصر',   icon: '🌤' },
    { key: 'maghrib', name: 'المغرب',  icon: '🌇' },
    { key: 'isha',    name: 'العشاء',  icon: '🌃' },
  ];

  // إلغاء المؤقتات القديمة
  if (window._prayerTimers) window._prayerTimers.forEach(t => clearTimeout(t));
  window._prayerTimers = [];

  // جدولة لكل صلاة
  PRAYERS.forEach(p => {
    const dec = window.prayerTimes[p.key];
    if (!dec) return;
    
    let t = ((dec % 24) + 24) % 24;
    const h = Math.floor(t), m = Math.floor((t - h) * 60);
    const pTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
    
    // لو الوقت فات اليوم، جدّله بكره
    if (pTime <= now) pTime.setDate(pTime.getDate() + 1);
    
    const diff = pTime - now;
    
    const timer = setTimeout(() => {
      // إشعار في المتصفح
      if (Notification.permission === 'granted') {
        new Notification('حان وقت ' + p.name + ' ' + p.icon, {
          body: 'الله أكبر الله أكبر، حي على الصلاة',
          icon: 'icons/icon-192.png',
          badge: 'icons/icon-72.png',
          dir: 'rtl',
          lang: 'ar',
          vibrate: [400, 200, 400, 200, 600, 200, 400],
          tag: 'prayer-' + p.key,
          renotify: true,
          requireInteraction: true
        });
      }
      // تشغيل الأذان تلقائياً
      if (localStorage.getItem('at_auto') !== '0') {
        setTimeout(() => {
          if (typeof adhan2PlayToggle === 'function') adhan2PlayToggle();
        }, 500);
      }
    }, diff);
    
    window._prayerTimers.push(timer);

    // تنبيه قبل الصلاة بـ ١٥ دقيقة (يُعطَّل من الإعدادات)
    var preDiff = diff - 15 * 60000;
    if (preDiff > 0 && localStorage.getItem('nq_pre15') !== '0') {
      window._prayerTimers.push(setTimeout(function () {
        if (Notification.permission === 'granted') {
          new Notification('بقي ١٥ دقيقة على صلاة ' + p.name, {
            body: 'استعد للصلاة، وتوضّأ', icon: 'icons/icon-192.png', dir: 'rtl', lang: 'ar', tag: 'pre-' + p.key
          });
        }
      }, preDiff));
    }
  
  });
};

// ══ إشعار ذكر الصباح ══
window.scheduleAdhkar = function() {
  if (Notification.permission !== 'granted') return;
  
  const dhikrItems = [
    'أذكار الصباح: سبحان الله وبحمده ١٠٠ مرة 🌅',
    'لا تنس: أعوذ بكلمات الله التامات من شر ما خلق ٣ مرات',
    'أذكار المساء: تبارك الذي بيده الملك 🌙',
  ];
  
  // صباحاً الساعة 6
  const now = new Date();
  const morning = new Date(now);
  morning.setHours(6, 0, 0);
  if (morning <= now) morning.setDate(morning.getDate() + 1);
  
  setTimeout(() => {
    new Notification('أذكار الصباح 🌅', {
      body: dhikrItems[0],
      icon: 'icons/icon-192.png',
      dir: 'rtl',
      tag: 'adhkar-morning',
      requireInteraction: false
    });
  }, morning - now);
  
  // مساءً الساعة 6
  const evening = new Date(now);
  evening.setHours(18, 0, 0);
  if (evening <= now) evening.setDate(evening.getDate() + 1);
  
  setTimeout(() => {
    new Notification('أذكار المساء 🌙', {
      body: dhikrItems[2],
      icon: 'icons/icon-192.png',
      dir: 'rtl',
      tag: 'adhkar-evening',
      requireInteraction: false
    });
  }, evening - now);
};

// ══ زر تثبيت التطبيق (PWA Install) ══
let _deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  _deferredPrompt = e;
  // إظهار زر التثبيت
  const btn = document.getElementById('pwa-install-btn');
  if (btn) btn.style.display = 'flex';
});

window.installPWA = async function() {
  if (!_deferredPrompt) {
    showToast('التطبيق مثبّت بالفعل أو المتصفح لا يدعم التثبيت');
    return;
  }
  _deferredPrompt.prompt();
  const { outcome } = await _deferredPrompt.userChoice;
  if (outcome === 'accepted') showToast('✅ تم تثبيت التطبيق!');
  _deferredPrompt = null;
  const btn = document.getElementById('pwa-install-btn');
  if (btn) btn.style.display = 'none';
};

window.addEventListener('appinstalled', () => {
  showToast('✅ هُدى القرآن مثبّت على جهازك');
  _deferredPrompt = null;
});
