/* ════════════════════════════════════════════════════════════
   هُدى v3 — الرئيسية (الأذان أولاً) · المصحف بنظام الصفحات · التنقل السفلي
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function lsJSON(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function ar(n) { return String(n).replace(/\d/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }); }
  function toast(m) { if (typeof showToast === 'function') showToast(m); }

  /* ═════════════ 1) التنقل: المصحف الجديد بدل صفحة القرآن القديمة ═════════════ */
  var _allowQuran = false, _SP0 = window.SP;
  window.SP = function (id, ph) {
    if (id === 'quran' && !_allowQuran) return window.SP('mushaf', ph);
    if (id === 'reciters') { _allowQuran = true; try { return _SP0('reciters', ph); } finally { setTimeout(function () { _allowQuran = false; }, 300); } }
    var r = _SP0(id, ph);
    var map = { home: 'home', mushaf: 'mushaf', prayer: 'prayer', adhan: 'prayer', wird: 'wird', hisn: 'wird' };
    document.querySelectorAll('#bnav button').forEach(function (b) {
      if (map[id] && b.getAttribute('data-p') === map[id]) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
    return r;
  };

  /* ═════════════ 2) الرئيسية: الأذان والمواقيت ═════════════ */
  var PR = [['fajr', 'الفجر'], ['dhuhr', 'الظهر'], ['asr', 'العصر'], ['maghrib', 'المغرب'], ['isha', 'العشاء']];
  var DAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  function fmt12(dec) { return typeof decToTime === 'function' ? decToTime(dec) : ar(Math.floor(dec) + ':' + ('0' + Math.round((dec % 1) * 60)).slice(-2)); }
  var _arcKey = '';

  function nextPrayer(pt, now) {
    for (var i = 0; i < PR.length; i++) if (pt[PR[i][0]] > now) return { i: i, t: pt[PR[i][0]], tomorrow: false };
    return { i: 0, t: pt.fajr + 24, tomorrow: true };
  }
  function arcPoint(t) { var a = Math.PI * Math.max(0, Math.min(1, t)); return [150 - 120 * Math.cos(a), 130 - 120 * Math.sin(a)]; }

  function drawArc(pt, nowDec) {
    var svg = $('hv-arc'); if (!svg) return;
    var span = (pt.isha - pt.fajr) || 1, tn = (nowDec - pt.fajr) / span;
    var key = JSON.stringify(pt) + '|' + tn.toFixed(3); if (key === _arcKey) return; _arcKey = key;
    var ns = 'http://www.w3.org/2000/svg';
    function n(tag, at) { var e = document.createElementNS(ns, tag); for (var k in at) e.setAttribute(k, at[k]); return e; }
    svg.textContent = '';
    svg.appendChild(n('path', { d: 'M30 130 A120 120 0 0 1 270 130', fill: 'none', stroke: 'var(--brd)', 'stroke-width': 2, 'stroke-dasharray': '3 5' }));
    var cur = arcPoint(tn), mid = tn > 0 && tn < 1;
    if (tn > 0) {
      var end = arcPoint(Math.min(1, tn));
      svg.appendChild(n('path', { d: 'M30 130 A120 120 0 ' + (Math.min(1, tn) > 1 ? 1 : 0) + ' 1 ' + end[0].toFixed(1) + ' ' + end[1].toFixed(1), fill: 'none', stroke: 'var(--gold)', 'stroke-width': 3, 'stroke-linecap': 'round' }));
    }
    svg.appendChild(n('line', { x1: 14, y1: 130, x2: 286, y2: 130, stroke: 'var(--brd)' }));
    PR.forEach(function (p) {
      var q = arcPoint((pt[p[0]] - pt.fajr) / span);
      svg.appendChild(n('circle', { cx: q[0].toFixed(1), cy: q[1].toFixed(1), r: 4.5, fill: 'var(--dark)', stroke: 'var(--gold)', 'stroke-width': 1.6 }));
      var lx = q[0], ly = q[1] + (q[1] > 100 ? -10 : 17), an = 'middle'; if (p[0] === 'maghrib') { lx = q[0] - 9; ly = q[1] - 4; an = 'end'; } else if (p[0] === 'isha') { ly = q[1] + 17; }
      var tx = n('text', { x: lx.toFixed(1), y: ly.toFixed(1), 'text-anchor': an, 'font-size': 9, fill: 'var(--tm)', 'font-family': 'Tajawal,sans-serif' });
      tx.textContent = p[1]; svg.appendChild(tx);
    });
    if (mid) { svg.appendChild(n('circle', { cx: cur[0].toFixed(1), cy: cur[1].toFixed(1), r: 15, fill: 'var(--gold)', opacity: .2 })); svg.appendChild(n('circle', { cx: cur[0].toFixed(1), cy: cur[1].toFixed(1), r: 8, fill: 'var(--gold)' })); }
  }

  function homeTick() {
    var pt = window.prayerTimes; if (!pt || typeof pt.fajr !== 'number') return;
    var d = new Date(), now = d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600;
    var nx = nextPrayer(pt, now), left = Math.max(0, Math.round((nx.t - now) * 3600));
    var h = Math.floor(left / 3600), m = Math.floor((left % 3600) / 60), s = left % 60;
    $('hv-next').textContent = PR[nx.i][1] + ' · ' + fmt12(pt[PR[nx.i][0]]);
    /* hv-cd owned by huda-net-gps.js (stable ms countdown) — do not write here */
    var box = $('hv-pts');
    if (!box.firstChild) PR.forEach(function (p) { var dv = el('div'); dv.appendChild(document.createTextNode(p[1])); dv.appendChild(el('b')); box.appendChild(dv); });
    PR.forEach(function (p, i) { var dv = box.children[i]; dv.lastChild.textContent = fmt12(pt[p[0]]); dv.className = i === nx.i && !nx.tomorrow ? 'on' : (!nx.tomorrow && pt[p[0]] <= now ? 'past' : (nx.tomorrow ? 'past' : '')); if (nx.tomorrow && i === 0) dv.className = 'on'; });
    drawArc(pt, now);
  }
  function homeStatic() {
    var d = new Date(), t = '';
    try { var h = (typeof gregorianToHijri === 'function') ? gregorianToHijri(d.getFullYear(), d.getMonth() + 1, d.getDate()) : null;
      t = DAYS[d.getDay()] + (h && typeof HIJRI_MONTHS !== 'undefined' ? ' ' + ar(h.d) + ' ' + HIJRI_MONTHS[h.m - 1] + ' ' + ar(h.y) + ' هـ' : ''); } catch (e) { t = DAYS[d.getDay()]; }
    $('hv-date').textContent = t;
    var ln = $('loc-name'); $('hv-loc').textContent = '📍 ' + ((ln && ln.textContent && !/جارٍ/.test(ln.textContent)) ? ln.textContent : 'حدد موقعك');
    var pos = lsJSON('nq_mp', null);
    $('hv-cont').textContent = pos && pos.p ? ((pos.n ? 'سورة ' + pos.n + ' · ' : '') + 'صفحة ' + ar(pos.p)) : 'افتح المصحف';
  }
  window.HudaHome = { sync: function () { var b = $('hv-adh'); if (b) { var on = (typeof atSettings !== 'undefined') ? !!atSettings.auto : true; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); } homeStatic(); } };
  setInterval(function () { try { homeTick(); } catch (e) {} }, 1000);
  setInterval(function () { try { homeStatic(); } catch (e) {} }, 15000);

  /* ═════════════ 3) المصحف بنظام الصفحات (٦٠٤ صفحة) ═════════════ */
  var TOTAL = 604;
  var JZ = [1, 22, 42, 62, 82, 102, 121, 142, 162, 182, 201, 222, 242, 262, 282, 302, 322, 342, 362, 382, 402, 422, 442, 462, 482, 502, 522, 542, 562, 582];
  fetch('data/quran/juz.json').then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { if (j && j.juzStartPages && j.juzStartPages.length === 30) JZ = j.juzStartPages; }).catch(function () {});
  var P = { enCache: {}, page: 0, ayahs: [], sel: null, cache: {}, token: 0 };

  function surahTitle(n) { return (typeof SM !== 'undefined' && SM[n - 1]) ? SM[n - 1].ar : ('سورة ' + n); }

  function loadPage(p) {
    p = Math.max(1, Math.min(TOTAL, parseInt(p, 10) || 1));
    var tk = ++P.token; P.page = p; closeAct();
    $('mp-range').value = p; $('mp-lbl').textContent = 'صفحة ' + ar(p) + ' من ' + ar(TOTAL); $('mp-pn').textContent = ar(p);
    var inn = $('mp-in'); inn.textContent = '';
    for (var i = 0; i < 14; i++) inn.appendChild(el('div', 'mp-sk'));
    var F = window.HudaQuran ? window.HudaQuran.fetch : fetch;
    var pr = P.cache[p] ? Promise.resolve(P.cache[p]) : F('data/quran/pages/' + p + '.json').then(function (r) {
      if (!r || !r.ok) throw new Error('local miss');
      return r.json();
    }).then(function (j) {
      var ays = (j && j.data && j.data.ayahs) ? j.data.ayahs : (Array.isArray(j) ? j : null);
      if (!ays || !ays.length) throw new Error('bad local');
      P.cache[p] = ays; return ays;
    }).catch(function () {
      return F('https://api.alquran.cloud/v1/page/' + p + '/quran-uthmani').then(function (r) { if (!r.ok) throw new Error('http'); return r.json(); }).then(function (j) {
        if (!j || !j.data || !j.data.ayahs || !j.data.ayahs.length) throw new Error('bad'); P.cache[p] = j.data.ayahs; return j.data.ayahs;
      });
    });
    pr.then(function (ays) { if (tk === P.token) render(p, ays); }).catch(function () {
      if (tk !== P.token) return; inn.textContent = '';
      var m = el('div', null, 'تعذّر تحميل الصفحة — تحقق من الاتصال'); m.style.cssText = 'text-align:center;padding:2rem 1rem;color:#6b4e0e;font-family:Tajawal,sans-serif;font-size:1rem';
      var b = el('button', 'btn-g', 'إعادة المحاولة'); b.style.marginTop = '1rem'; b.onclick = function () { loadPage(p); }; m.appendChild(document.createElement('br')); m.appendChild(b); inn.appendChild(m);
    });
    lsSet('nq_mpage', String(p));
    var bm = lsJSON('nq_mbm', []); var on = bm.indexOf(p) >= 0; var b2 = $('mp-bm'); if (b2) { b2.setAttribute('aria-pressed', on); b2.style.color = on ? 'var(--gold)' : ''; b2.style.background = on ? 'var(--em2)' : ''; }
  }

  function loadEnSurah(sn) {
    sn = +sn;
    if (P.enCache[sn]) return Promise.resolve(P.enCache[sn]);
    return fetch('data/quran/en.sahih/' + sn + '.json').then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      var map = {};
      var ays = (j && j.data && j.data.ayahs) || (j && j.ayahs) || [];
      ays.forEach(function (x) { map[x.numberInSurah] = x.text || ''; });
      P.enCache[sn] = map;
      return map;
    }).catch(function () { P.enCache[sn] = {}; return {}; });
  }

  function render(p, ays) {
    P.ayahs = ays; var inn = $('mp-in'); inn.textContent = '';
    var first = ays[0], s0 = first.surah ? first.surah.number : 0;
    $('mp-title').textContent = s0 ? surahTitle(s0) : 'المصحف';
    $('mp-juz').textContent = first.juz ? 'الجزء ' + ar(first.juz) : '';
    var isEn = false; // اللغة الإنجليزية أُزيلت من الواجهة

    function paint(enMaps) {
      inn.textContent = '';
      var curS = 0, para = null;
      ays.forEach(function (a) {
        var sn = a.surah ? a.surah.number : s0, text = String(a.text || '').replace(/^\uFEFF/, '');
        if (a.numberInSurah === 1 && sn !== curS) {
          if (sn !== 1 && sn !== 9 && window.HudaQuran) { var tmp = [{ text: text }]; window.HudaQuran.stripBismillah(sn, tmp); text = tmp[0].text; }
          inn.appendChild(el('div', 'mp-sh', (a.surah && a.surah.name) ? a.surah.name : 'سورة ' + surahTitle(sn)));
          if (sn !== 1 && sn !== 9) inn.appendChild(el('div', 'mp-bs', 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'));
          para = null;
        }
        curS = sn;
        if (isEn) {
          var wrap = el('div', 'ay ay-block');
          wrap.setAttribute('data-s', sn);
          wrap.setAttribute('data-a', a.numberInSurah);
          var arLine = el('div', 'ay-ar');
          arLine.appendChild(document.createTextNode(text + ' '));
          arLine.appendChild(el('span', 'mk', '۝' + ar(a.numberInSurah)));
          wrap.appendChild(arLine);
          var enTxt = (enMaps[sn] && enMaps[sn][a.numberInSurah]) || '';
          if (enTxt) {
            var enEl = el('div', 'ay-en');
            enEl.textContent = enTxt;
            wrap.appendChild(enEl);
          }
          inn.appendChild(wrap);
        } else {
          // التنسيق الأصلي: آيات متصلة في الفقرة
          if (!para) { para = el('div', 'mp-para'); para.style.textAlign = 'justify'; inn.appendChild(para); }
          var sp = el('span', 'ay');
          sp.setAttribute('data-s', sn);
          sp.setAttribute('data-a', a.numberInSurah);
          sp.appendChild(document.createTextNode(text + ' '));
          sp.appendChild(el('span', 'mk', '۝' + ar(a.numberInSurah)));
          para.appendChild(sp);
          para.appendChild(document.createTextNode(' '));
        }
      });
      fit(inn);
      try {
        if (typeof highlightPlayingAyah === 'function' && window.G_STATE) {
          var st = G_STATE();
          if (st && st.active) highlightPlayingAyah(st.s, st.a);
        }
      } catch (e) {}
    }

    if (isEn) {
      var surahsNeeded = {};
      ays.forEach(function (a) { surahsNeeded[a.surah ? a.surah.number : s0] = 1; });
      Promise.all(Object.keys(surahsNeeded).map(function (sn) { return loadEnSurah(sn); })).then(function () {
        var maps = {};
        Object.keys(surahsNeeded).forEach(function (sn) { maps[sn] = P.enCache[+sn] || {}; });
        paint(maps);
      });
    } else {
      paint({});
    }

    lsSet('nq_mp', JSON.stringify({ p: p, n: s0 ? surahTitle(s0) : '' }));
    lsSet('nq_pos', JSON.stringify({ s: s0, p: p }));
    [p + 1, p - 1].forEach(function (q) {
      if (q >= 1 && q <= TOTAL && !P.cache[q] && navigator.onLine !== false) {
        var F = window.HudaQuran ? window.HudaQuran.fetch : fetch;
        F('https://api.alquran.cloud/v1/page/' + q + '/quran-uthmani').then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
          if (j && j.data) P.cache[q] = j.data.ayahs;
        }).catch(function () {});
      }
    });
  }

  function preferredFs() {
    var n = parseInt(localStorage.getItem('nq_rdfs') || '36', 10);
    return (n >= 18 && n <= 56) ? n : 36;
  }
  function fit(inn) {
    // Use user's chosen size strictly — do not override manual zoom
    var sz = preferredFs();
    inn.style.fontSize = sz + 'px';
    inn.style.overflowY = 'auto';
  }
  window._mpRefit = function() {
    var i = $('mp-in');
    if (i && P.ayahs && P.ayahs.length) fit(i);
  };
  window.addEventListener('resize', function () { var i = $('mp-in'); if (i && P.ayahs.length) fit(i); });

  /* اختيار الآية + شريط الإجراءات */
  function closeAct() { var a = $('mp-act'); if (a) a.classList.remove('on'); document.querySelectorAll('.mp-in .ay.sel').forEach(function (x) { x.classList.remove('sel'); }); P.sel = null; }
  document.addEventListener('click', function (e) {
    var inn = $('mp-in'); if (!inn || window.HudaReader) return;
    var t = e.target.closest ? e.target.closest('.ay') : null;
    if (t && inn.contains(t)) {
      var same = P.sel && P.sel.s === t.getAttribute('data-s') && P.sel.a === t.getAttribute('data-a'); closeAct();
      if (same) return;
      t.classList.add('sel'); P.sel = { s: t.getAttribute('data-s'), a: t.getAttribute('data-a'), el: t }; $('mp-act').classList.add('on');
    } else if (!(e.target.closest && e.target.closest('#mp-act'))) { if (P.sel) closeAct(); }
  });
  function selText() { if (!P.sel) return ''; var c = P.sel.el.cloneNode(true); var mk = c.querySelector('.mk'); if (mk) mk.remove(); return c.textContent.trim(); }

  /* الفهرس */
  var IT = 's';
  function openIndex() { $('mp-idx').classList.add('on'); $('mi-q').value = ''; buildIndex(); }
  function closeIndex() { $('mp-idx').classList.remove('on'); }
  function row(num, name, sub, pg, onclick) {
    var r = el('div', 'mi-r'); r.setAttribute('role', 'button'); r.tabIndex = 0;
    var bd = el('div', 'mi-bd'); bd.appendChild(el('span', null, ar(num))); r.appendChild(bd);
    var d = el('div'); d.appendChild(el('div', 'n', name)); if (sub) d.appendChild(el('small', null, sub)); r.appendChild(d);
    r.appendChild(el('span', 'mi-pg', 'ص ' + ar(pg))); r.onclick = function () { closeIndex(); onclick(); }; return r;
  }
  function buildIndex() {
    var q = $('mi-q'), L = $('mi-list'); L.textContent = '';
    var term = window.HudaQuran ? window.HudaQuran.norm(q.value) : q.value.trim(), num = parseInt(q.value, 10);
    q.style.display = IT === 'j' || IT === 'b' ? 'none' : '';
    if (IT === 's') {
      SM.forEach(function (s) {
        if (term && !(window.HudaQuran.norm(s.ar).indexOf(term) >= 0 || String(s.n) === term || String(s.pg) === term)) return;
        L.appendChild(row(s.n, s.ar, s.tp + ' · ' + ar(s.ay) + (s.ay >= 3 && s.ay <= 10 ? ' آيات' : ' آية'), s.pg, function () { window.HudaMushaf.goSurah(s.n); }));
      });
    } else if (IT === 'j') {
      JZ.forEach(function (pg, i) { L.appendChild(row(i + 1, 'الجزء ' + ar(i + 1), '', pg, function () { window.HudaMushaf.go(pg); })); });
    } else if (IT === 'p') {
      var box = el('div'); box.style.cssText = 'padding:1rem 0;text-align:center'; var inp = el('input'); inp.type = 'number'; inp.min = 1; inp.max = TOTAL; inp.placeholder = 'رقم الصفحة (١–٦٠٤)'; inp.id = 'mi-pg'; inp.style.cssText = 'width:100%;padding:.8rem;border-radius:12px;border:1px solid var(--brd);font:inherit;font-size:1.1rem;text-align:center';
      var go = el('button', 'btn-g', 'اذهب'); go.style.marginTop = '.8rem'; go.onclick = function () { var v = parseInt(inp.value, 10); if (v >= 1 && v <= TOTAL) { closeIndex(); loadPage(v); } else toast('أدخل رقماً بين ١ و٦٠٤'); };
      inp.onkeydown = function (e) { if (e.key === 'Enter') go.click(); }; box.appendChild(inp); box.appendChild(go); L.appendChild(box);
    } else {
      var bm = lsJSON('nq_mbm', []).slice().sort(function (a, b) { return a - b; });
      if (!bm.length) { var e0 = el('div', null, 'لا توجد علامات بعد — اضغط ♡ أعلى الصفحة لإضافة علامة'); e0.style.cssText = 'text-align:center;color:var(--tm);padding:2rem 1rem'; L.appendChild(e0); }
      bm.forEach(function (pg) { L.appendChild(row(pg, 'صفحة ' + ar(pg), '', pg, function () { window.HudaMushaf.go(pg); })); });
    }
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('#mi-seg button'); if (!b) return;
    IT = b.getAttribute('data-t'); document.querySelectorAll('#mi-seg button').forEach(function (x) { x.classList.toggle('on', x === b); }); buildIndex();
  });
  document.addEventListener('input', function (e) { if (e.target && e.target.id === 'mi-q') buildIndex(); });

  window.HudaMushaf = {
    go: loadPage, openIndex: openIndex, closeIndex: closeIndex,
    goSurah: function (n) { if (typeof SP === 'function') SP('mushaf'); loadPage(SM[n - 1] ? SM[n - 1].pg : 1); },
    goAyah: function (s, a) {
      if (typeof SP === 'function') SP('mushaf');
      // لو الآية ظاهرة بالفعل لا تعِد تحميل الصفحة
      var existing = document.querySelector('.ay[data-s="' + s + '"][data-a="' + a + '"]');
      if (existing) {
        try { existing.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) {}
        return;
      }
      var F = window.HudaQuran ? window.HudaQuran.fetch : fetch;
      // صفحات محلية أولاً
      F('data/quran/pages/' + (SM[s - 1] ? SM[s - 1].pg : 1) + '.json').catch(function () { return null; }).then(function () {
        return F('https://api.alquran.cloud/v1/ayah/' + s + ':' + a + '/quran-uthmani');
      }).then(function (r) { return r && r.json ? r.json() : null; }).then(function (j) {
        var page = (j && j.data && j.data.page) ? j.data.page : (SM[s - 1] ? SM[s - 1].pg : 1);
        if (P.page === page) {
          setTimeout(function () {
            var t = document.querySelector('.mp-in .ay[data-s="' + s + '"][data-a="' + a + '"]');
            if (t) try { t.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) {}
          }, 50);
          return;
        }
        loadPage(page);
        setTimeout(function () {
          var t = document.querySelector('.mp-in .ay[data-s="' + s + '"][data-a="' + a + '"]');
          if (t) { try { t.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) {} }
        }, 500);
      }).catch(function () { loadPage(SM[s - 1] ? SM[s - 1].pg : 1); });
    },
    toggleBm: function () { var bm = lsJSON('nq_mbm', []), i = bm.indexOf(P.page); if (i >= 0) bm.splice(i, 1); else bm.push(P.page); lsSet('nq_mbm', JSON.stringify(bm)); toast(i >= 0 ? 'أُزيلت العلامة' : '🔖 أُضيفت علامة'); loadPage(P.page); },
    act: function (k) {
      if (!P.sel) return; var s = +P.sel.s, a = +P.sel.a, t = selText();
      if ((k === 'play' || k === 'playFrom') && typeof playAyahGapless === 'function') {
        playAyahGapless(a, s);
        try { localStorage.setItem('nq_last_ayah', JSON.stringify({s:s,a:a})); } catch(e){}
      }
      else if (k === 'tafsir' && typeof openTafsirPopup === 'function') openTafsirPopup(s, a);
      else if (k === 'fav' && typeof toggleFav === 'function') toggleFav(s, a, t);
      else if (k === 'note' && typeof openNote === 'function') openNote(s, a);
      else if (k === 'copy') { var txt = t + ' ﴿' + surahTitle(s) + ': ' + a + '﴾'; if (navigator.clipboard) navigator.clipboard.writeText(txt).then(function () { toast('✅ تم النسخ'); }); }
      closeAct();
    }
  };

  /* أدوات التنقل: سهمان، شريط، سحب، كيبورد */
  function wire() {
    $('mp-next').onclick = function () { loadPage(P.page + 1); }; $('mp-prev').onclick = function () { loadPage(P.page - 1); };
    $('mp-range').oninput = function () { $('mp-lbl').textContent = 'صفحة ' + ar(this.value) + ' من ' + ar(TOTAL); }; $('mp-range').onchange = function () { loadPage(this.value); };
    var x0 = null, y0 = null, w = $('mp-wrap');
    w.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    w.addEventListener('touchend', function (e) {
      if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) loadPage(P.page + (dx > 0 ? 1 : -1));   // سحب لليمين = الصفحة التالية (كالكتاب العربي)
    }, { passive: true });
    document.addEventListener('keydown', function (e) {
      var on = document.querySelector('.pg.on'); if (!on || on.id !== 'page-mushaf' || /INPUT|TEXTAREA|SELECT/.test((e.target || {}).tagName || '')) return;
      if (e.key === 'ArrowLeft') loadPage(P.page + 1); else if (e.key === 'ArrowRight') loadPage(P.page - 1); else if (e.key === 'Escape') { closeIndex(); closeAct(); }
    });
    // فتح صفحة المصحف أول مرة → آخر صفحة محفوظة
    var _s = window.SP; window.SP = function (id, ph) { var r = _s(id, ph); if (id === 'mushaf' && window.HudaMushaf && HudaMushaf.open) HudaMushaf.open(); return r; };
  }

  function init() {
    wire(); window.HudaHome.sync(); homeStatic();
    if (typeof applyTheme === 'function') applyTheme(window._currentTheme || 'paper');
    setTimeout(function () { window.HudaHome.sync(); }, 1500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
