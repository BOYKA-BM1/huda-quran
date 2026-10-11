/* ════════════════════════════════════════════════════════════
   واجهة الميزات الإضافية: حاسبة الزكاة، أوقات الإشراق/الضحى/ثلث الليل،
   بانر الجمعة وتذكيرها، المناسبات الإسلامية القادمة.
   يعتمد على HudaCore (features-core.js)
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var C = window.HudaCore;
  if (!C) { console.warn('HudaCore غير محمّل'); return; }

  function $(id) { return document.getElementById(id); }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function ar(n) { return typeof toArabicNum === 'function' ? toArabicNum(n) : String(n); }
  function money(n) { return ar(Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 })); }
  function hhmm(dec) { return typeof decToTime === 'function' ? decToTime(dec) : '—'; }

  /* ═════ حاسبة الزكاة ═════ */
  window.zakatBasisChange = function () {
    var silver = $('zk-basis').value === 'silver';
    $('zk-price-l').firstChild.nodeValue = silver ? 'سعر جرام الفضة بعملتك' : 'سعر جرام الذهب (عيار ٢٤) بعملتك';
    $('zk-price').placeholder = silver ? 'مثال: 45' : 'مثال: 3500';
  };
  window.zakatCalc = function () {
    var basis = $('zk-basis').value;
    var r = C.calcZakat({
      cash: $('zk-cash').value, savings: $('zk-savings').value, gold: $('zk-gold').value, silver: $('zk-silver').value,
      trade: $('zk-trade').value, receivables: $('zk-recv').value, debts: $('zk-debts').value,
      basis: basis, goldPrice: basis === 'gold' ? $('zk-price').value : 0, silverPrice: basis === 'silver' ? $('zk-price').value : 0,
      hawl: $('zk-hawl').checked
    });
    var box = $('zk-result'); box.textContent = '';
    var card = el('div', 'zk-res' + (r.status === 'due' ? '' : ' warn'));
    var msg = {
      'need-price': ['أدخل سعر الجرام', 'لا يمكن تحديد النصاب بدون سعر الجرام اليوم.'],
      'below-nisab': ['لا زكاة عليك الآن', 'صافي مالك أقل من النصاب. وإن زاد لاحقاً وحال عليه الحول فتجب الزكاة.'],
      'no-hawl': ['بلغ النصاب — لم يحل الحول', 'تجب الزكاة عند مرور سنة هجرية كاملة على المال وهو بالغ النصاب.'],
      'due': ['زكاة مالك الواجبة', 'مقدارها ٢٫٥٪ من صافي المال الزكوي']
    }[r.status];
    card.appendChild(el('div', null, msg[0])).style.cssText = 'color:var(--cr);font-size:.95rem;';
    if (r.status === 'due') card.appendChild(el('div', 'zk-big', money(r.due)));
    card.appendChild(el('div', null, msg[1])).style.cssText = 'color:var(--tm);font-size:.8rem;margin-bottom:.6rem;';
    var rows = [['إجمالي الأموال الزكوية', money(r.assets)], ['الديون الحالّة', money(r.debts)], ['الصافي', money(r.net)]];
    if (r.nisab != null) rows.push(['النصاب (' + (r.basis === 'silver' ? '٥٩٥ جم فضة' : '٨٥ جم ذهب') + ')', money(r.nisab)]);
    rows.forEach(function (x) { var row = el('div', 'zk-row'); row.appendChild(el('span', null, x[0])); row.appendChild(el('b', null, x[1])); card.appendChild(row); });
    box.appendChild(card);
  };

  /* ═════ أوقات الإشراق والضحى وثلث الليل ═════ */
  var _xtKey = '';
  function renderExtraTimes() {
    var box = $('extra-times'), pt = window.prayerTimes;
    if (!box || !pt || !pt.fajr) return;
    var key = JSON.stringify(pt); if (key === _xtKey) return; _xtKey = key;
    var x = C.extraTimes(pt);
    box.textContent = '';
    var wrap = el('div', 'xt-box');
    wrap.appendChild(el('div', 'xt-title', '🌟 أوقات إضافية'));
    [
      ['صلاة الإشراق / بداية الضحى', 'بعد الشروق بنحو ١٥ دقيقة', x.ishraq],
      ['نهاية وقت الضحى', 'قبل الظهر بنحو ١٠ دقائق', x.duhaEnd],
      ['منتصف الليل', 'بين المغرب والفجر', x.midnight],
      ['الثلث الأخير من الليل', 'وقت التهجد وإجابة الدعاء', x.lastThird]
    ].forEach(function (r) {
      if (r[2] == null) return;
      var row = el('div', 'xt-row'), l = el('div'); l.appendChild(document.createTextNode(r[0])); l.appendChild(el('small', null, r[1]));
      row.appendChild(l); row.appendChild(el('span', 'xt-t', hhmm(r[2]))); wrap.appendChild(row);
    });
    var note = el('div', null, 'تقريبية، وتتبع طريقة حساب المواقيت المختارة.'); note.style.cssText = 'font-size:.68rem;color:var(--tm);margin-top:.4rem;';
    wrap.appendChild(note); box.appendChild(wrap);
  }
  var _rpc = window.renderPrayerCards;
  if (typeof _rpc === 'function') window.renderPrayerCards = function () { var r = _rpc.apply(this, arguments); try { renderExtraTimes(); } catch (e) {} return r; };

  /* ═════ الجمعة ═════ */
  function todayKey() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function renderFriday() {
    var box = $('friday-banner'); if (!box) return;
    if (!C.isFriday(new Date())) { box.style.display = 'none'; return; }
    box.style.display = 'block'; box.textContent = '';
    var card = el('div', 'fri-card');
    card.appendChild(el('h3', null, '🕌 ' + C.FRIDAY.title));
    card.appendChild(el('div', null, C.FRIDAY.body)).style.cssText = 'color:var(--cr);font-size:.85rem;line-height:1.8;';
    var ul = el('ul'); C.FRIDAY.points.forEach(function (p) { ul.appendChild(el('li', null, p)); }); card.appendChild(ul);
    var on = lsGet('nq_fri', '1') !== '0';
    var b = el('button', null, on ? '🔔 تذكير الجمعة: مفعّل' : '🔕 تذكير الجمعة: متوقف');
    b.onclick = function () {
      var now = lsGet('nq_fri', '1') !== '0'; lsSet('nq_fri', now ? '0' : '1');
      if (!now && 'Notification' in window && Notification.permission === 'default') Notification.requestPermission();
      renderFriday();
    };
    card.appendChild(b); box.appendChild(card);
  }
  function maybeNotifyFriday() {
    if (!C.isFriday(new Date()) || lsGet('nq_fri', '1') === '0') return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    if (new Date().getHours() < 8 || lsGet('nq_fri_shown', '') === todayKey()) return;
    lsSet('nq_fri_shown', todayKey());
    var opts = { body: C.FRIDAY.body, icon: 'icons/icon-192.png', dir: 'rtl', lang: 'ar', tag: 'friday' };
    if (window._swReg && window._swReg.showNotification) window._swReg.showNotification('🕌 ' + C.FRIDAY.title, opts);
    else new Notification('🕌 ' + C.FRIDAY.title, opts);
  }

  /* ═════ المناسبات: تصحيح اليوم الهجري + القادمة بعدد الأيام ═════ */
  var _g2h = window.gregorianToHijri;
  if (typeof _g2h === 'function' && !_g2h._wrapped) {
    window.gregorianToHijri = function (y, m, d) {
      var off = parseInt(lsGet('nq_hijri_off', '0'), 10) || 0;
      if (!off) return _g2h(y, m, d);
      var dt = new Date(y, m - 1, d + off); return _g2h(dt.getFullYear(), dt.getMonth() + 1, dt.getDate());
    };
    window.gregorianToHijri._wrapped = true;
  }
  var _bh = window.buildHijri;
  if (typeof _bh === 'function') window.buildHijri = function () {
    var r = _bh.apply(this, arguments);
    var occ = $('hijri-occasions'); if (!occ || typeof gregorianToHijri !== 'function') return r;
    try {
      var now = new Date(), h = gregorianToHijri(now.getFullYear(), now.getMonth() + 1, now.getDate());
      var list = C.upcomingOccasions(now, gregorianToHijri, 7, 400);
      occ.textContent = '';
      var t = el('div', null, '🗓 المناسبات القادمة'); t.style.cssText = 'color:var(--gold);font-size:.9rem;font-weight:700;margin:.4rem 0 .7rem;'; occ.appendChild(t);
      if (C.isWhiteDay(h)) {
        var w = el('div', 'oc-item today fast'); var wl = el('div'); wl.appendChild(el('div', 'oc-t', 'اليوم من الأيام البيض')); wl.appendChild(el('div', 'oc-d', 'يُستحب صيام ١٣ و١٤ و١٥ من كل شهر هجري'));
        w.appendChild(wl); w.appendChild(el('span', 'oc-days', 'اليوم ✨')); occ.appendChild(w);
      }
      list.forEach(function (o) {
        var it = el('div', 'oc-item ' + o.type + (o.days === 0 ? ' today' : ''));
        var l = el('div'); l.appendChild(el('div', 'oc-t', o.title));
        l.appendChild(el('div', 'oc-d', ar(o.hijri.d) + ' ' + HIJRI_MONTHS[o.hijri.m - 1] + ' ' + ar(o.hijri.y) + ' هـ — ' + o.date.toLocaleDateString('ar', { day: 'numeric', month: 'long', year: 'numeric' })));
        it.appendChild(l);
        it.appendChild(el('span', 'oc-days', o.days === 0 ? 'اليوم ✨' : o.days === 1 ? 'غداً' : 'بعد ' + ar(o.days) + ' يوماً'));
        occ.appendChild(it);
      });
      var note = el('div', null, 'التواريخ تقريبية بحسب التقويم الحسابي، وقد تختلف يوماً عن رؤية الهلال في بلدك — يمكنك ضبط ذلك من الإعدادات.'); note.style.cssText = 'font-size:.7rem;color:var(--tm);margin-top:.5rem;'; occ.appendChild(note);
    } catch (e) { console.warn('occasions:', e); }
    return r;
  };

  /* ═════ تشغيل ═════ */
  function init() { renderFriday(); maybeNotifyFriday(); setInterval(function () { renderFriday(); maybeNotifyFriday(); renderExtraTimes(); }, 30 * 60 * 1000); setTimeout(renderExtraTimes, 1500); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
