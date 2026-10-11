#!/usr/bin/env node
/* يضيف أذونات أندرويد اللازمة إلى AndroidManifest.xml (آمن للتكرار).
   يُشغَّل تلقائياً بعد `cap add android` و`cap sync android`. */
const fs = require('fs'), path = require('path');
const ROOT = process.env.HUDA_ROOT || path.resolve(__dirname, '..');
const mf = path.join(ROOT, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
if (!fs.existsSync(mf)) { console.log('لا يوجد مشروع أندرويد بعد — شغّل: npm run android:add'); process.exit(0); }
let x = fs.readFileSync(mf, 'utf8');
const PERMS = [
  'android.permission.INTERNET',
  'android.permission.ACCESS_COARSE_LOCATION',     // تحديد المدينة لمواقيت الصلاة والقبلة
  'android.permission.ACCESS_FINE_LOCATION',
  'android.permission.POST_NOTIFICATIONS',          // أندرويد 13+
  'android.permission.VIBRATE',
  'android.permission.RECEIVE_BOOT_COMPLETED',      // إعادة جدولة الإشعارات بعد إعادة تشغيل الجهاز
  'android.permission.SCHEDULE_EXACT_ALARM'         // دقة وقت الصلاة
];
let added = [];
for (const p of PERMS) {
  if (!x.includes(`android:name="${p}"`)) { x = x.replace('</manifest>', `    <uses-permission android:name="${p}" />\n</manifest>`); added.push(p.split('.').pop()); }
}
// اتجاه الشاشة: عمودي فقط
if (!x.includes('android:screenOrientation')) x = x.replace(/<activity\b/, '<activity android:screenOrientation="portrait"');
fs.writeFileSync(mf, x);
console.log(added.length ? '✔ أُضيفت أذونات: ' + added.join(', ') : '✔ الأذونات موجودة مسبقاً');
