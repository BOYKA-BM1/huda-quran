/* ════════════════════════════════════════════════════════════
   HudaCore — منطق الميزات الإضافية (بدون DOM، قابل للاختبار)
   يعمل في المتصفح (window.HudaCore) وفي Node (module.exports)
   ⚠ حاسبة الزكاة والمواقيت تقريبية وليست فتوى — راجع أهل العلم عند الحاجة.
   ════════════════════════════════════════════════════════════ */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.HudaCore = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var mod24 = function (x) { return ((x % 24) + 24) % 24; };
  var isNum = function (x) { return typeof x === 'number' && isFinite(x); };

  /* ───────── أوقات إضافية من مواقيت اليوم (ساعات عشرية) ─────────
     الإشراق/الضحى : بعد الشروق بـ ١٥ دقيقة (ارتفاع الشمس قدر رمح)
     نهاية الضحى   : قبل الظهر بـ ١٠ دقائق (وقت الاستواء المنهي عن الصلاة فيه)
     الليل         : من المغرب إلى الفجر التالي (قول الجمهور)
     منتصف الليل = المغرب + نصف المدة ، وثلث الليل الأخير يبدأ عند المغرب + ثلثي المدة */
  function extraTimes(pt) {
    var out = { ishraq: null, duhaEnd: null, midnight: null, lastThird: null, nightLengthH: null };
    if (!pt) return out;
    if (isNum(pt.sunrise)) out.ishraq = mod24(pt.sunrise + 15 / 60);
    if (isNum(pt.dhuhr))   out.duhaEnd = mod24(pt.dhuhr - 10 / 60);
    if (isNum(pt.maghrib) && isNum(pt.fajr)) {
      var maghrib = pt.maghrib;
      var len = mod24(pt.fajr - maghrib);   // المدة من المغرب إلى الفجر التالي (دائماً بين 0 و24)
      if (len === 0) len = 24;
      out.nightLengthH = len;
      out.midnight  = mod24(maghrib + len / 2);
      out.lastThird = mod24(maghrib + (2 * len) / 3);
    }
    return out;
  }

  /* ───────── حاسبة زكاة المال ─────────
     • النصاب: ٨٥ جم ذهب (عيار ٢٤) أو ٥٩٥ جم فضة — يختار المستخدم
     • المقدار: ٢٫٥٪ من صافي المال إذا بلغ النصاب وحال عليه حول هجري كامل
     • المال الزكوي: نقد + مدخرات + ذهب/فضة + عروض تجارة + ديون مرجوة السداد − ديون حالّة عليك
     لا تشمل: الأنعام والزروع والمعادن والركاز (لها أحكام خاصة) */
  var NISAB_GOLD_G = 85, NISAB_SILVER_G = 595, RATE = 0.025;
  var n0 = function (v) { v = parseFloat(v); return isFinite(v) && v > 0 ? v : 0; };

  function calcZakat(o) {
    o = o || {};
    var assets = n0(o.cash) + n0(o.savings) + n0(o.gold) + n0(o.silver) + n0(o.trade) + n0(o.receivables);
    var debts = n0(o.debts);
    var net = Math.max(0, assets - debts);
    var basis = o.basis === 'silver' ? 'silver' : 'gold';
    var price = basis === 'silver' ? n0(o.silverPrice) : n0(o.goldPrice);
    var res = { assets: assets, debts: debts, net: net, basis: basis, nisab: null, reachedNisab: false, hawl: !!o.hawl, due: 0, status: '' };
    if (!price) { res.status = 'need-price'; return res; }
    res.nisab = (basis === 'silver' ? NISAB_SILVER_G : NISAB_GOLD_G) * price;
    res.reachedNisab = net >= res.nisab;
    if (!res.reachedNisab) res.status = 'below-nisab';
    else if (!res.hawl) res.status = 'no-hawl';
    else { res.status = 'due'; res.due = Math.round(net * RATE * 100) / 100; }
    return res;
  }

  /* ───────── المناسبات الإسلامية ───────── */
  // type: eid | fast | night | virtue | event
  var OCCASIONS = [
    { m: 1,  d: 1,  t: 'رأس السنة الهجرية', type: 'event' },
    { m: 1,  d: 9,  t: 'تاسوعاء — يُستحب صيامه مع عاشوراء', type: 'fast' },
    { m: 1,  d: 10, t: 'يوم عاشوراء — صيامه يكفّر سنة ماضية', type: 'fast' },
    { m: 3,  d: 12, t: 'ذكرى المولد النبوي ﷺ (للعلماء خلاف في الاحتفال به)', type: 'event' },
    { m: 7,  d: 27, t: 'ذكرى الإسراء والمعراج (تحديد تاريخها محل خلاف)', type: 'event' },
    { m: 9,  d: 1,  t: 'بداية شهر رمضان المبارك', type: 'virtue' },
    { m: 9,  d: 17, t: 'ذكرى غزوة بدر الكبرى', type: 'event' },
    { m: 9,  d: 21, t: 'أول العشر الأواخر — ليلة القدر في الوتر', type: 'night' },
    { m: 9,  d: 23, t: 'ليلة القدر المحتملة', type: 'night' },
    { m: 9,  d: 25, t: 'ليلة القدر المحتملة', type: 'night' },
    { m: 9,  d: 27, t: 'ليلة القدر المرجَّحة', type: 'night' },
    { m: 9,  d: 29, t: 'ليلة القدر المحتملة', type: 'night' },
    { m: 10, d: 1,  t: 'عيد الفطر المبارك — يحرم صيامه', type: 'eid' },
    { m: 10, d: 2,  t: 'بدء صيام الست من شوال (متتابعة أو متفرقة)', type: 'fast' },
    { m: 12, d: 1,  t: 'بداية العشر الأوائل من ذي الحجة', type: 'virtue' },
    { m: 12, d: 9,  t: 'يوم عرفة — صيامه لغير الحاج يكفّر سنتين', type: 'fast' },
    { m: 12, d: 10, t: 'عيد الأضحى المبارك — يحرم صيامه', type: 'eid' },
    { m: 12, d: 11, t: 'أول أيام التشريق — يحرم صيامها', type: 'eid' }
  ];
  // الأيام البيض: ١٣–١٥ من كل شهر هجري (ويُستثنى ذو الحجة لأن ١٣ منه من أيام التشريق)
  function isWhiteDay(h) { return h.d >= 13 && h.d <= 15 && !(h.m === 12 && h.d === 13); }

  /* يرجع أقرب `count` مناسبات قادمة، مع عدد الأيام المتبقية.
     g2h(y,m,d) → {y,m,d} هجري. نمشي يوماً بيوم لتفادي أخطاء تحويل هجري→ميلادي. */
  function upcomingOccasions(from, g2h, count, horizonDays) {
    count = count || 5; horizonDays = horizonDays || 400;
    var out = [], base = new Date(from.getFullYear(), from.getMonth(), from.getDate(), 12);
    for (var i = 0; i <= horizonDays && out.length < count; i++) {
      var dt = new Date(base.getTime() + i * 86400000);
      var h = g2h(dt.getFullYear(), dt.getMonth() + 1, dt.getDate());
      for (var k = 0; k < OCCASIONS.length; k++) {
        var o = OCCASIONS[k];
        if (o.m === h.m && o.d === h.d) out.push({ days: i, date: dt, hijri: h, title: o.t, type: o.type });
      }
    }
    return out.slice(0, count);
  }

  /* هل اليوم الجمعة؟ (0=الأحد … 5=الجمعة) */
  function isFriday(date) { return (date || new Date()).getDay() === 5; }

  var FRIDAY = {
    title: 'جمعة مباركة',
    body: 'اقرأ سورة الكهف، وأكثر من الصلاة على النبي ﷺ، وتحرَّ ساعة الإجابة قبل المغرب',
    points: [
      'قراءة سورة الكهف',
      'الإكثار من الصلاة على النبي ﷺ',
      'الاغتسال والتطيّب والتبكير للجمعة',
      'ساعة الإجابة — يُرجى أن تكون آخر ساعة بعد العصر'
    ]
  };

  return {
    extraTimes: extraTimes, calcZakat: calcZakat, OCCASIONS: OCCASIONS, isWhiteDay: isWhiteDay,
    upcomingOccasions: upcomingOccasions, isFriday: isFriday, FRIDAY: FRIDAY,
    NISAB_GOLD_G: NISAB_GOLD_G, NISAB_SILVER_G: NISAB_SILVER_G, ZAKAT_RATE: RATE
  };
});
