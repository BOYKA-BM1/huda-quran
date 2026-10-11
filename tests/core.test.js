// اختبارات منطق الميزات — التشغيل: node tests/core.test.js
const assert = require('assert');
const C = require('../www/js/features-core.js');
let n = 0; const t = (name, fn) => { fn(); n++; console.log('✔', name); };
const near = (a, b, eps = 0.01) => assert.ok(Math.abs(a - b) < eps, `${a} ≉ ${b}`);

t('الإشراق = الشروق + ١٥ دقيقة', () => {
  const x = C.extraTimes({ fajr: 4.5, sunrise: 6.0, dhuhr: 12.0, asr: 15.5, maghrib: 18.0, isha: 19.5 });
  near(x.ishraq, 6.25); near(x.duhaEnd, 12 - 10 / 60);
});
t('منتصف الليل وثلث الليل الأخير (مغرب ١٨:٠٠، فجر ٤:٣٠)', () => {
  const x = C.extraTimes({ fajr: 4.5, sunrise: 6, dhuhr: 12, asr: 15.5, maghrib: 18, isha: 19.5 });
  near(x.nightLengthH, 10.5);          // ١٨:٠٠ → ٤:٣٠
  near(x.midnight, 23.25);             // ١١:١٥ م
  near(x.lastThird, 1.0);              // ١٨ + ٧ = ٢٥ → ١:٠٠ ص
});
t('الفجر بعد منتصف الليل لا يكسر الحساب', () => {
  const x = C.extraTimes({ fajr: 23.9, sunrise: 5, dhuhr: 12, maghrib: 18 });
  assert.ok(x.nightLengthH > 0 && x.nightLengthH < 24);
});
t('قيم ناقصة ترجع null بدل NaN', () => {
  const x = C.extraTimes({ fajr: null, sunrise: undefined });
  assert.strictEqual(x.ishraq, null); assert.strictEqual(x.lastThird, null);
  assert.deepStrictEqual(C.extraTimes(null).midnight, null);
});
t('زكاة: بلغ النصاب وحال الحول → ٢٫٥٪', () => {
  const r = C.calcZakat({ cash: 100000, savings: 50000, goldPrice: 3000, hawl: true }); // النصاب ٨٥×٣٠٠٠ = ٢٥٥٬٠٠٠؟ لا: ١٥٠٠٠٠ < ٢٥٥٠٠٠
  assert.strictEqual(r.status, 'below-nisab');
  const r2 = C.calcZakat({ cash: 300000, goldPrice: 3000, hawl: true });
  assert.strictEqual(r2.status, 'due'); near(r2.due, 7500);
});
t('زكاة: الديون تُخصم قبل النصاب', () => {
  const r = C.calcZakat({ cash: 300000, debts: 100000, goldPrice: 3000, hawl: true });
  assert.strictEqual(r.status, 'below-nisab'); assert.strictEqual(r.net, 200000);
});
t('زكاة: لم يحل الحول → لا تجب الآن', () => {
  const r = C.calcZakat({ cash: 300000, goldPrice: 3000, hawl: false });
  assert.strictEqual(r.status, 'no-hawl'); assert.strictEqual(r.due, 0);
});
t('زكاة: بدون سعر الذهب → يطلبه ولا يحسب', () => {
  assert.strictEqual(C.calcZakat({ cash: 1e6 }).status, 'need-price');
});
t('زكاة: نصاب الفضة ٥٩٥ جم', () => {
  const r = C.calcZakat({ cash: 50000, basis: 'silver', silverPrice: 50, hawl: true }); // ٥٩٥×٥٠ = ٢٩٧٥٠
  near(r.nisab, 29750); assert.strictEqual(r.status, 'due'); near(r.due, 1250);
});
t('زكاة: مدخلات سالبة/نصية لا تُنتج NaN', () => {
  const r = C.calcZakat({ cash: 'abc', savings: -50, goldPrice: '3000', hawl: true });
  assert.ok(Number.isFinite(r.net)); assert.strictEqual(r.net, 0);
});
t('الأيام البيض ١٣-١٥ وتُستثنى ١٣ ذي الحجة', () => {
  assert.ok(C.isWhiteDay({ m: 5, d: 14 })); assert.ok(!C.isWhiteDay({ m: 5, d: 12 }));
  assert.ok(!C.isWhiteDay({ m: 12, d: 13 })); assert.ok(C.isWhiteDay({ m: 12, d: 14 }));
});
t('المناسبات القادمة تمشي بالتسلسل وبعدد الأيام الصحيح', () => {
  // محوّل وهمي: كل يوم ميلادي يساوي يوماً هجرياً تسلسلياً يبدأ من ٩/٢٨
  const start = new Date(2030, 0, 1, 12);
  const g2h = (y, m, d) => { const k = Math.round((new Date(y, m - 1, d, 12) - start) / 864e5); const day = 28 + k; return day > 30 ? { y: 1450, m: 10, d: day - 30 } : { y: 1450, m: 9, d: day }; };
  const u = C.upcomingOccasions(start, g2h, 3, 10);
  assert.strictEqual(u[0].title.includes('ليلة القدر'), true); assert.strictEqual(u[0].days, 1);   // ٩/٢٩
  assert.strictEqual(u[1].title.includes('عيد الفطر'), true); assert.strictEqual(u[1].days, 3);   // ٩/٢٨ → ٩/٢٩ (+1) → ٩/٣٠ (+2) → ١٠/١ (+3)
  assert.strictEqual(u[1].type, 'eid');
});
t('الجمعة', () => { assert.ok(C.isFriday(new Date(2026, 9, 9))); assert.ok(!C.isFriday(new Date(2026, 9, 4))); });
console.log(`\n${n} اختبارات نجحت`);
