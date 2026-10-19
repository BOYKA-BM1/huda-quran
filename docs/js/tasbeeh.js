/* ════════════════════════════════════════════════════════════
   المسبحة الإلكترونية — عدّاد كبير + اقتراحات أذكار + إحصاءات
   (كانت صفحة المسبحة فارغة ومحوّلة لحصن المسلم)
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function ar(n) { return String(n).replace(/\d/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }); }
  function today() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function toast(m) { if (typeof showToast === 'function') showToast(m); }

  var DEFAULT_ZK = [
    { t: 'سُبْحَانَ اللَّهِ', s: 'تنزيه الله عن كل نقص', c: '#2E9E73' },
    { t: 'الْحَمْدُ لِلَّهِ', s: 'الثناء على الله وشكره', c: '#B8913A' },
    { t: 'اللَّهُ أَكْبَرُ', s: 'تعظيم الله سبحانه وتعالى', c: '#D08A1E' },
    { t: 'لَا إِلَٰهَ إِلَّا اللَّهُ', s: 'كلمة التوحيد', c: '#3B7DD8' },
    { t: 'أَسْتَغْفِرُ اللَّهَ', s: 'طلب المغفرة من الله', c: '#7A5BD0' },
    { t: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ', s: 'أكثر من الصلاة والسلام عليه ﷺ', c: '#2A9BAA' },
    { t: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', s: 'كنز من كنوز الجنة', c: '#C0504A' },
    { t: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', s: 'تسبيح وحمد مقترنان', c: '#8C6F3A' }
  ];
  var BASE_TARGETS = [0, 33, 99, 100];
  var COLORS = ['#2E9E73', '#B8913A', '#D08A1E', '#3B7DD8', '#7A5BD0', '#2A9BAA', '#C0504A', '#8C6F3A', '#5B8C5A', '#C4784A'];
  var ZK = DEFAULT_ZK.slice();
  var TARGETS = BASE_TARGETS.slice();
  var S, built = false, CIRC = 2 * Math.PI * 104;

  function loadCustom() {
    try {
      var cz = JSON.parse(localStorage.getItem('nq_tsb_custom_zk') || '[]');
      if (Array.isArray(cz) && cz.length) {
        ZK = DEFAULT_ZK.concat(cz.filter(function (x) { return x && x.t; }).map(function (x, i) {
          return { t: String(x.t).slice(0, 80), s: String(x.s || 'ذكر مضاف'), c: x.c || COLORS[(DEFAULT_ZK.length + i) % COLORS.length], custom: true };
        }));
      } else ZK = DEFAULT_ZK.slice();
    } catch (e) { ZK = DEFAULT_ZK.slice(); }
    try {
      var ct = JSON.parse(localStorage.getItem('nq_tsb_custom_tg') || '[]');
      var extra = Array.isArray(ct) ? ct.map(Number).filter(function (n) { return n > 0 && n <= 100000; }) : [];
      var seen = {};
      TARGETS = BASE_TARGETS.concat(extra).filter(function (n) {
        if (seen[n]) return false; seen[n] = 1; return true;
      }).sort(function (a, b) { return a - b; });
    } catch (e) { TARGETS = BASE_TARGETS.slice(); }
  }
  function saveCustomZk() {
    var custom = ZK.filter(function (x) { return x.custom; }).map(function (x) { return { t: x.t, s: x.s, c: x.c }; });
    try { localStorage.setItem('nq_tsb_custom_zk', JSON.stringify(custom)); } catch (e) {}
  }
  function saveCustomTg() {
    var extra = TARGETS.filter(function (t) { return BASE_TARGETS.indexOf(t) < 0; });
    try { localStorage.setItem('nq_tsb_custom_tg', JSON.stringify(extra)); } catch (e) {}
  }

  function load() {
    loadCustom();
    var d = {}; try { d = JSON.parse(localStorage.getItem('nq_tsb') || '{}') || {}; } catch (e) {}
    // تثبيت نظيف: لو مفيش مفتاح إصدار المسبحة → عدّادات صفر (أول استخدام / بعد إعادة التثبيت)
    var fresh = !localStorage.getItem('nq_tsb_v');
    if (fresh) {
      try { localStorage.setItem('nq_tsb_v', '1'); } catch (e) {}
      d = {};
    }
    S = { i: Math.min(Math.max(0, +d.i || 0), Math.max(0, ZK.length - 1)), counts: d.counts || {}, days: d.days || {}, total: +d.total || 0, target: TARGETS.indexOf(+d.target) >= 0 ? +d.target : 33, vib: d.vib !== false };
    if (fresh) { S.counts = {}; S.days = {}; S.total = 0; S.i = 0; }
  }
  function save() { try { localStorage.setItem('nq_tsb', JSON.stringify(S)); } catch (e) {} }
  function cnt() { return +S.counts[S.i] || 0; }
  function streak() { var n = 0, d = new Date(); for (var k = 0; k < 400; k++) { var key = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); if ((S.days[key] || 0) > 0) n++; else if (k > 0) break; d.setDate(d.getDate() - 1); } return n; }

  function build() {
    var pg = $('page-tasbeeh'); pg.removeAttribute('data-redirect'); pg.textContent = '';
    var w = el('div', 'tb-wrap');
    var hd = el('div', 'tb-hd'); hd.appendChild(el('h2', null, 'المسبحة')); hd.appendChild(el('small', null, 'اذكر الله واحتسب الأجر')); w.appendChild(hd);
    var card = el('div', 'tb-card');
    var top = el('div', 'tb-top'); var dz = el('div', 'tb-dz', ''); dz.id = 'tb-dz'; top.appendChild(dz);
    var rs = el('button', 'tb-rs', '↻ تصفير'); rs.onclick = reset; rs.setAttribute('aria-label', 'تصفير العدّاد'); top.appendChild(rs); card.appendChild(top);
    var ring = el('div', 'tb-ringw');
    ring.innerHTML = '<svg viewBox="0 0 240 240" aria-hidden="true"><circle cx="120" cy="120" r="104" fill="none" stroke="rgba(212,176,90,.22)" stroke-width="7"/><circle id="tb-arc" cx="120" cy="120" r="104" fill="none" stroke="#D4B05A" stroke-width="7" stroke-linecap="round" stroke-dasharray="' + CIRC.toFixed(1) + '" stroke-dashoffset="' + CIRC.toFixed(1) + '" transform="rotate(-90 120 120)"/></svg>';
    var btn = el('button', 'tb-tap'); btn.id = 'tb-tap'; btn.setAttribute('aria-label', 'سبّح — اضغط للعد');
    btn.appendChild(el('b', null, '٠')); btn.lastChild.id = 'tb-n'; btn.appendChild(el('span', null, 'اضغط للتسبيح')); ring.appendChild(btn); card.appendChild(ring);
    var tgBar = el('div', 'tb-tg-bar');
    var addTg = el('button', 'tb-add', '+ إضافة هدف');
    addTg.type = 'button'; addTg.onclick = addTarget;
    tgBar.appendChild(addTg);
    var tg = el('div', 'tb-tg'); tg.id = 'tb-tg';
    tgBar.appendChild(tg);
    card.appendChild(tgBar);
    var ft = el('div', 'tb-ft'); var vb = el('label'); vb.id = 'tb-vl'; var vc = el('input'); vc.type = 'checkbox'; vc.id = 'tb-vib'; vc.onchange = function () { S.vib = this.checked; save(); };
    vb.appendChild(vc); vb.appendChild(document.createTextNode(' اهتزاز عند كل ضغطة')); ft.appendChild(vb); card.appendChild(ft);
    w.appendChild(card);
    var st = el('div', 'tb-stats'); [['tb-s-today', 'اليوم'], ['tb-s-total', 'الإجمالي'], ['tb-s-streak', 'أيام متتالية']].forEach(function (x) { var d = el('div'); d.appendChild(el('b', null, '٠')); d.lastChild.id = x[0]; d.appendChild(el('small', null, x[1])); st.appendChild(d); }); w.appendChild(st);
    var sh = el('div', 'tb-sec');
    var shL = el('div', 'tb-sec-l');
    shL.appendChild(el('h3', null, 'اقتراحات للذكر'));
    shL.appendChild(el('small', null, 'اختر ما تحب أن تردده'));
    sh.appendChild(shL);
    var addZk = el('button', 'tb-add', '+ إضافة ذكر');
    addZk.type = 'button'; addZk.onclick = addDhikr;
    sh.appendChild(addZk);
    w.appendChild(sh);
    var grid = el('div', 'tb-grid'); grid.id = 'tb-grid'; w.appendChild(grid);
    var tip = el('div', 'tb-tip'); tip.appendChild(el('b', null, 'نصيحة: ')); tip.appendChild(document.createTextNode('كل ذكر له عدّاده الخاص، والعدّاد يُحفظ تلقائياً حتى بعد إغلاق التطبيق.')); w.appendChild(tip);
    pg.appendChild(w); built = true;
  }

  function render() {
    var n = cnt(), z = ZK[S.i];
    $('tb-dz').textContent = z.t; $('tb-n').textContent = ar(n);
    var arc = $('tb-arc'), tgt = S.target;
    arc.style.strokeDashoffset = tgt ? (CIRC * (1 - Math.min(1, (n % tgt || (n && n % tgt === 0 ? tgt : 0)) / tgt))).toFixed(1) : (CIRC * (1 - ((n % 100) / 100))).toFixed(1);
    var tg = $('tb-tg'); tg.textContent = '';
    TARGETS.forEach(function (t) {
      var b = el('button', t === S.target ? 'on' : '', t ? 'الهدف ' + ar(t) : 'بلا هدف');
      b.type = 'button';
      b.onclick = function () { S.target = t; save(); render(); };
      if (t && BASE_TARGETS.indexOf(t) < 0) {
        b.title = 'اضغط مطولاً للحذف';
        b.addEventListener('contextmenu', function (e) {
          e.preventDefault();
          if (!confirm('حذف الهدف ' + t + '؟')) return;
          TARGETS = TARGETS.filter(function (x) { return x !== t; });
          if (S.target === t) S.target = 33;
          saveCustomTg(); save(); render();
        });
      }
      tg.appendChild(b);
    });
    $('tb-vib').checked = S.vib;
    $('tb-s-today').textContent = ar(S.days[today()] || 0); $('tb-s-total').textContent = ar(S.total); $('tb-s-streak').textContent = ar(streak());
    var g = $('tb-grid'); g.textContent = '';
    ZK.forEach(function (x, i) {
      var b = el('button', 'tb-z' + (i === S.i ? ' on' : ''));
      b.type = 'button';
      b.style.setProperty('--c', x.c);
      b.appendChild(el('b', null, x.t));
      b.appendChild(el('small', null, x.s));
      var c = +S.counts[i] || 0;
      if (c) b.appendChild(el('em', null, ar(c)));
      if (x.custom) {
        var del = el('span', 'tb-z-del', '×');
        del.title = 'حذف';
        del.onclick = function (e) {
          e.stopPropagation();
          if (!confirm('حذف الذكر؟')) return;
          ZK.splice(i, 1);
          var nc = {};
          Object.keys(S.counts).forEach(function (k) {
            var ki = +k;
            if (ki < i) nc[ki] = S.counts[k];
            else if (ki > i) nc[ki - 1] = S.counts[k];
          });
          S.counts = nc;
          if (S.i >= ZK.length) S.i = Math.max(0, ZK.length - 1);
          saveCustomZk(); save(); render();
        };
        b.appendChild(del);
      }
      b.onclick = function () { S.i = i; save(); render(); window.scrollTo(0, 0); };
      g.appendChild(b);
    });
  }
  var _lock = 0;
  function tap(e) {
    if (e) { try { e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation(); } catch (err) {} }
    var now = Date.now();
    if (now - _lock < 320) return; // ضغطة واحدة فقط
    _lock = now;
    S.counts[S.i] = cnt() + 1; S.total++; var k = today(); S.days[k] = (S.days[k] || 0) + 1; save();
    if (S.vib && navigator.vibrate) navigator.vibrate(18);
    var done = S.target && cnt() % S.target === 0;
    if (done) { if (S.vib && navigator.vibrate) navigator.vibrate([80, 40, 80]); toast('✨ أتممت ' + ar(S.target) + ' — تقبّل الله منك'); }
    render();
    var b = $('tb-tap');
    if (b) { b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); }
  }
  function bindTap() {
    var b = $('tb-tap');
    if (!b) return;
    // أعد الربط دائمًا بعد rebuild — مع قفل عام يمنع التكرار
    b.onclick = null;
    b.onpointerdown = null;
    b.onpointerup = null;
    if (b._hudaTapHandler) {
      try { b.removeEventListener('pointerup', b._hudaTapHandler, true); } catch (e) {}
    }
    b._hudaTapHandler = function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      tap(e);
    };
    b.addEventListener('pointerup', b._hudaTapHandler, true);
    b.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    }, true);
  }
  function reset() { if (cnt() && !confirm('تصفير عدّاد هذا الذكر؟')) return; S.counts[S.i] = 0; save(); render(); }

  function addTarget() {
    var raw = prompt('أدخل رقم الهدف (مثال: 50 أو 500):', '50');
    if (raw == null) return;
    var n = parseInt(String(raw).replace(/[^\d]/g, ''), 10);
    if (!n || n < 1 || n > 100000) { toast('أدخل رقماً صحيحاً'); return; }
    if (TARGETS.indexOf(n) < 0) {
      TARGETS.push(n);
      TARGETS.sort(function (a, b) { return a - b; });
      saveCustomTg();
    }
    S.target = n; save(); render();
    toast('الهدف ' + ar(n));
  }
  function addDhikr() {
    var txt = prompt('نص الذكر:');
    if (txt == null) return;
    txt = String(txt).trim();
    if (txt.length < 2) { toast('اكتب نص الذكر'); return; }
    if (txt.length > 80) txt = txt.slice(0, 80);
    var s = prompt('وصف مختصر (اختياري):', 'ذكر مضاف');
    s = (s == null ? 'ذكر مضاف' : String(s).trim()).slice(0, 60) || 'ذكر مضاف';
    ZK.push({ t: txt, s: s, c: COLORS[ZK.length % COLORS.length], custom: true });
    S.i = ZK.length - 1;
    saveCustomZk(); save(); render();
    toast('تمت إضافة الذكر');
    window.scrollTo(0, 0);
  }

  window.initTasbeeh = function () { load(); if (!built || !$('tb-tap')) build(); bindTap(); render(); };
  window.tasbeehClick = function () { tap(); };
})();
