/* ════════════════════════════════════════════════════════════
   قارئ المصحف: تمرير متواصل (افتراضي) أو صفحات — يمتد فوق v3.js
   • تمرير لا نهائي بين السور، شريط علوي يتحدّث (سورة/جزء/صفحة)
   • تمرير تلقائي، استماع مع تتبّع الآية، تفسير، مفضلة، ملاحظات
   • بحث نصي وبحث صوتي (حيث يدعمه المتصفح)
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
  function sName(n) { return (typeof SM !== 'undefined' && SM[n - 1]) ? SM[n - 1].ar : ('سورة ' + n); }
  function F(u) { return window.HudaQuran ? window.HudaQuran.fetch(u) : fetch(u); }

  window.HudaReader = true;
  var M = window.HudaMushaf || {};
  var _pageGo = M.go, _pageGoAyah = M.goAyah;
  var R = { mode: lsGet('nq_rdmode', 'scroll') === 'page' ? 'page' : 'scroll', loaded: [], first: 0, last: 0, sel: null, cur: null,
            fs: parseInt(lsGet('nq_rdfs', '22'), 10) || 22, speed: parseInt(lsGet('nq_rdspeed', '2'), 10) || 2, auto: false, raf: 0, loading: false, io: null,
            trans: lsGet('nq_rdtr', ''), hifz: false /* always start with text visible */, goal: parseInt(lsGet('nq_goal_t', '5'), 10) || 5 };

  /* ───────── عرض السورة ───────── */
  function fetchSurah(n) {
    return F('https://api.alquran.cloud/v1/surah/' + n + '/quran-uthmani').then(function (r) { if (!r.ok) throw new Error('http'); return r.json(); })
      .then(function (j) { if (!j || !j.data || !j.data.ayahs) throw new Error('bad'); return j.data; });
  }
  function fetchTrans(n) {
    if (!R.trans) return Promise.resolve(null);
    return F('https://api.alquran.cloud/v1/surah/' + n + '/' + R.trans).then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { if (!j || !j.data) return null; var m = {}; j.data.ayahs.forEach(function (a) { m[a.numberInSurah] = a.text; }); return m; }).catch(function () { return null; });
  }
  function sectionEl(d, tr) {
    var n = d.number, sec = el('section', 'rd-sec'); sec.setAttribute('data-s', n);
    var ban = el('div', 'rd-ban'); ban.appendChild(el('div', 't', d.name || ('سورة ' + sName(n)))); sec.appendChild(ban);
    if (n !== 1 && n !== 9) sec.appendChild(el('div', 'rd-bs', 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'));
    var txt = el('div', 'rd-text' + (tr ? ' tr' : ''));
    d.ayahs.forEach(function (a) {
      var sp = el('span', 'ay'); sp.setAttribute('data-s', n); sp.setAttribute('data-a', a.numberInSurah); sp.setAttribute('data-p', a.page || ''); sp.setAttribute('data-j', a.juz || '');
      sp.appendChild(document.createTextNode(a.text + ' ')); sp.appendChild(el('span', 'vm', ar(a.numberInSurah)));
      if (tr && tr[a.numberInSurah]) { var t = el('span', 'rd-tr', tr[a.numberInSurah]); t.setAttribute('dir', 'ltr'); t.setAttribute('lang', 'en'); sp.appendChild(t); }
      txt.appendChild(sp); txt.appendChild(document.createTextNode(' '));
    });
    sec.appendChild(txt); return sec;
  }
  function observe(sec) { if (R.io) sec.querySelectorAll('.ay').forEach(function (a) { R.io.observe(a); }); }

  function appendSurah(n) {
    if (n < 1 || n > 114 || R.loaded.indexOf(n) >= 0) return Promise.resolve(false);
    R.loaded.push(n); R.loading = true;
    var holder = el('div', 'rd-ld', 'جارٍ التحميل…'); $('rd-flow').appendChild(holder);
    return Promise.all([fetchSurah(n), fetchTrans(n)]).then(function (z) { var d = z[0], s = sectionEl(d, z[1]); holder.replaceWith(s); observe(s); R.last = Math.max(R.last, n); R.loading = false;
        if (R.loaded.length === 1) { var f0 = d.ayahs[0] || {}; $('mp-title').textContent = sName(n); $('mp-juz').textContent = (f0.juz ? 'الجزء ' + ar(f0.juz) : '') + (f0.page ? ' · صفحة ' + ar(f0.page) : ''); R.cur = { s: n, a: 1, p: f0.page || 0 }; syncBm(); }
        return true; })
      .catch(function () {
        R.loaded.splice(R.loaded.indexOf(n), 1); R.loading = false; holder.textContent = '';
        holder.appendChild(document.createTextNode('تعذّر تحميل السورة — تحقق من الاتصال ')); var b = el('button', 'btn-g', 'إعادة المحاولة'); b.onclick = function () { holder.remove(); appendSurah(n); }; holder.appendChild(b); return false;
      });
  }
  function openSurah(n, opt) {
    n = Math.max(1, Math.min(114, parseInt(n, 10) || 1)); stopAuto();
    R.loaded = []; R.first = R.last = n; R.cur = null; $('rd-flow').textContent = ''; closeAct();
    return appendSurah(n).then(function (ok) {
      var pv = $('rd-prev'); if (pv) pv.style.display = n > 1 ? '' : 'none';
      if (ok && opt && opt.ayah) scrollToAyah(n, opt.ayah); else window.scrollTo(0, 0);
      return ok;
    });
  }
  function scrollToAyah(s, a) {
    var t = document.querySelector('#rd-flow .ay[data-s="' + s + '"][data-a="' + a + '"]'); if (!t) return;
    t.scrollIntoView({ block: 'center' }); t.classList.add('flash'); setTimeout(function () { t.classList.remove('flash'); }, 1800);
  }

  /* ───────── تتبّع الآية الظاهرة (الشريط العلوي + الحفظ) ───────── */
  function setupIO() {
    if (!('IntersectionObserver' in window)) return;
    R.io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; var a = e.target, s = +a.getAttribute('data-s'), n = +a.getAttribute('data-a'), p = +a.getAttribute('data-p') || 0, j = a.getAttribute('data-j');
        R.cur = { s: s, a: n, p: p }; recordPage(p);
        $('mp-title').textContent = sName(s); $('mp-juz').textContent = (j ? 'الجزء ' + ar(j) : '') + (p ? ' · صفحة ' + ar(p) : '');
        lsSet('nq_mp', JSON.stringify({ s: s, a: n, p: p, n: sName(s) })); lsSet('nq_pos', JSON.stringify({ s: s, p: p })); syncBm();
      });
    }, { rootMargin: '-130px 0px -72% 0px', threshold: 0 });
    var sent = $('rd-sent');
    new IntersectionObserver(function (es) {
      if (es[0].isIntersecting && R.mode === 'scroll' && !R.loading && R.last && R.last < 114 && document.querySelector('.pg.on') && document.querySelector('.pg.on').id === 'page-mushaf') appendSurah(R.last + 1);
    }, { rootMargin: '900px 0px' }).observe(sent);
  }
  function bmPages() { return lsJSON('nq_mbm', []); }
  function curPage() { return R.mode === 'scroll' ? (R.cur ? R.cur.p : 0) : (parseInt(lsGet('nq_mpage', '1'), 10) || 1); }
  function syncBm() { var b = $('mp-bm'); if (!b) return; var on = bmPages().indexOf(curPage()) >= 0; b.setAttribute('aria-pressed', on); }

  /* ───────── اختيار الآية والإجراءات ───────── */
  function closeAct() { var a = $('mp-act'); if (a) a.classList.remove('on'); document.querySelectorAll('.ay.sel').forEach(function (x) { x.classList.remove('sel'); }); R.sel = null; }
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('#rd-flow .ay, #mp-in .ay') : null;
    if (t && R.hifz && !t.classList.contains('rev')) { t.classList.add('rev'); return; }
    if (t) {
      var same = R.sel && R.sel.el === t; closeAct(); if (same) return;
      t.classList.add('sel'); R.sel = { s: +t.getAttribute('data-s'), a: +t.getAttribute('data-a'), el: t }; $('mp-act').classList.add('on');
    } else if (!(e.target.closest && e.target.closest('#mp-act, .shbg'))) { if (R.sel) closeAct(); }
  });
  function selText() { if (!R.sel) return ''; var c = R.sel.el.cloneNode(true); c.querySelectorAll('.vm, .mk, .rd-tr').forEach(function (v) { v.remove(); }); return c.textContent.trim(); }
  /* أول آية ظاهرة تحت الشريط العلوي (ليبدأ الاستماع من حيث تقرأ) */
  function visibleAyah() {
    var top = $('rd-top'), edge = top ? top.getBoundingClientRect().bottom : 0;
    var root = R.mode === 'page' ? $('mp-in') : $('rd-flow'); if (!root) return null;
    var list = root.querySelectorAll('.ay');
    for (var i = 0; i < list.length; i++) {
      var rects = list[i].getClientRects();
      for (var k = 0; k < rects.length; k++) { if (rects[k].bottom > edge + 6 && rects[k].top < innerHeight) return { s: +list[i].getAttribute('data-s'), a: +list[i].getAttribute('data-a') }; }
    }
    return null;
  }
  function target() {
    if (R.sel) return { s: R.sel.s, a: R.sel.a, text: selText() };
    var v = visibleAyah(); if (v) return { s: v.s, a: v.a, text: '' };
    if (R.cur) return { s: R.cur.s, a: R.cur.a, text: '' }; return null;
  }

  M.act = function (k) {
    if (!R.sel) return; var s = R.sel.s, a = R.sel.a, t = selText();
    if (k === 'play' || k === 'playFrom') {
      try { localStorage.setItem('nq_last_ayah', JSON.stringify({s:s,a:a})); } catch(e){}
      if (typeof playAyahPrecise === 'function') playAyahPrecise(s, a);
      else if (typeof playAyahGapless === 'function') playAyahGapless(a, s);
      else if (typeof startPB === 'function') startPB((typeof curRec!=='undefined'&&curRec)||'alafasy', s, false);
    }
    else if (k === 'tafsir') { if (typeof openTafsirPopup === 'function') openTafsirPopup(s, a); }
    else if (k === 'fav') { if (typeof toggleFav === 'function') toggleFav(s, a, t); }
    else if (k === 'note') { if (typeof openNote === 'function') openNote(s, a); }
    else if (k === 'copy') { var tx = t + ' ﴿' + sName(s) + ': ' + a + '﴾'; if (navigator.clipboard) navigator.clipboard.writeText(tx).then(function () { toast('✅ تم النسخ'); }, function () { toast('تعذّر النسخ'); }); }
    if (k !== 'play' && k !== 'playFrom') closeAct();
    else closeAct();
  };
  M.share = function () {
    var t = target(); if (!t || !t.text) { toast('اضغط على آية أولاً ثم شاركها'); return; }
    var tx = t.text + ' ﴿' + sName(t.s) + ': ' + t.a + '﴾';
    if (navigator.share) navigator.share({ text: tx }).catch(function () {}); else if (navigator.clipboard) navigator.clipboard.writeText(tx).then(function () { toast('✅ نُسخت الآية للمشاركة'); }, function () { toast('تعذّرت المشاركة'); });
  };
  M.play = function () {
    // إيقاف / استكمال — لا تعِد من الأول
    var au = document.getElementById('aud');
    if (au && au.src && !au.ended && (window.G_ACTIVE && G_ACTIVE())) {
      if (typeof togPlay === 'function') togPlay();
      return;
    }
    if (au && au.src && !au.ended && au.currentTime > 0.15) {
      if (typeof togPlay === 'function') togPlay();
      return;
    }
    if (window.G_CAN_RESUME && G_CAN_RESUME()) {
      if (typeof togPlay === 'function') togPlay();
      return;
    }
    var t = target();
    if (!t) {
      var first = document.querySelector('#mp-in .ay[data-s][data-a], #rd-flow .ay[data-s][data-a]');
      if (first) t = { s: +first.getAttribute('data-s'), a: +first.getAttribute('data-a') };
    }
    if (!t) { toast('اختر آية أولاً'); return; }
    try { localStorage.setItem('nq_gapless', '0'); window._gaplessMode = false; } catch(e){}
    if (typeof playSurahContinuous === 'function') playSurahContinuous(t.s);
    else if (typeof playAyahGapless === 'function') playAyahGapless(1, t.s);
    else if (typeof startPB === 'function') startPB(localStorage.getItem('nq_rec')||'alafasy', t.s, false);
  };
  M.tafsir = function () { var t = target(); if (!t) { toast('اختر آية أولاً'); return; } if (typeof openTafsirPopup === 'function') openTafsirPopup(t.s, t.a); };
  M.toggleBm = function () {
    var p = curPage(); if (!p) { toast('انتظر تحميل الصفحة'); return; }
    var bm = bmPages(), i = bm.indexOf(p); if (i >= 0) bm.splice(i, 1); else bm.push(p);
    lsSet('nq_mbm', JSON.stringify(bm)); toast(i >= 0 ? 'أُزيلت العلامة' : '🔖 أُضيفت علامة — صفحة ' + ar(p)); syncBm();
  };

  /* ───────── تمرير تلقائي ───────── */
  function stepAuto() { if (!R.auto) return; window.scrollBy(0, R.speed * 0.45); R.raf = requestAnimationFrame(stepAuto); }
  function startAuto() { if (R.mode !== 'scroll') { toast('التمرير التلقائي في وضع التمرير'); return; } R.auto = true; var ab = $('rd-auto'); if (ab) ab.setAttribute('aria-pressed', 'true'); toast('تمرير تلقائي — المس الشاشة للإيقاف'); R.raf = requestAnimationFrame(stepAuto); }
  function stopAuto() { R.auto = false; cancelAnimationFrame(R.raf); var b = $('rd-auto'); if (b) b.setAttribute('aria-pressed', 'false'); }
  M.toggleAuto = function () { R.auto ? stopAuto() : startAuto(); };
  ['wheel', 'touchstart', 'keydown'].forEach(function (ev) { window.addEventListener(ev, function () { if (R.auto) stopAuto(); }, { passive: true }); });

  /* ───────── الوضعان: تمرير / صفحات ───────── */
  function applyMode() {
    $('rd-scroll').hidden = R.mode === 'page'; $('rd-paged').hidden = R.mode !== 'page';
    document.querySelectorAll('#st-mode button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-m') === R.mode); });
    var a = $('rd-auto'); if (a) a.style.display = R.mode === 'scroll' ? '' : 'none';
  }
  function setMode(m) {
    if (m === R.mode) return; var cur = R.cur; R.mode = m; lsSet('nq_rdmode', m); stopAuto(); applyMode();
    if (m === 'page') { var p = cur && cur.p ? cur.p : (lsJSON('nq_mp', {}).p || 1); _pageGo(p); }
    else { R.loaded = []; var pos = cur || lsJSON('nq_mp', null); if (pos && pos.s) openSurah(pos.s, { ayah: pos.a }); else openSurah(1); }
  }
  M.open = function () {
    R.mode = 'page'; // FORCE pages mode always as requested
    lsSet('nq_rmode', 'page');
    // Hifz OFF by default when opening mushaf — text visible
    R.hifz = false;
    lsSet('nq_hifz', '0');
    document.body.classList.remove('rd-hifz');
    var hb = document.getElementById('btn-hifz-toggle');
    if (hb) hb.classList.remove('on');


    applyMode();
    if (R.mode === 'page') { if (!(parseInt(lsGet('nq_mpage', '0'), 10))) _pageGo(1); else if (!$('mp-in').firstChild) _pageGo(parseInt(lsGet('nq_mpage', '1'), 10) || 1); return; }
    if (R.loaded.length) return;
    var pos = lsJSON('nq_mp', null);
    if (pos && pos.s) openSurah(pos.s, { ayah: pos.a });
    else if (pos && pos.p) { M.go(pos.p); }
    else openSurah(1);
  };
  M.go = function (page) {
    page = Math.max(1, Math.min(604, parseInt(page, 10) || 1));
    if (R.mode === 'page') return _pageGo(page);
    return F('https://api.alquran.cloud/v1/page/' + page + '/quran-uthmani').then(function (r) { return r.json(); }).then(function (j) {
      var a = j.data.ayahs[0]; var s = a.surah ? a.surah.number : 1; openSurah(s, { ayah: a.numberInSurah });
    }).catch(function () { var s = 1; for (var i = 0; i < SM.length; i++) if (SM[i].pg <= page) s = SM[i].n; openSurah(s); });
  };
  M.goSurah = function (n) { if (typeof SP === 'function') SP('mushaf'); if (R.mode === 'page') return _pageGo(SM[n - 1] ? SM[n - 1].pg : 1); return openSurah(n); };
  M.goAyah = function (s, a) { if (typeof SP === 'function') SP('mushaf'); if (R.mode === 'page') return _pageGoAyah(s, a); return openSurah(s, { ayah: a }); };
  M.prevSurah = function () {
    var cur = parseInt(lsGet('nq_mpage', '1'), 10) || 1;
    // Find current surah from page
    var s = 1;
    if (typeof SM !== 'undefined') {
      for (var i = 0; i < SM.length; i++) if (SM[i].pg <= cur) s = SM[i].n;
    }
    if (s > 1) M.goSurah(s - 1);
  };
  M.nextSurah = function () {
    var cur = parseInt(lsGet('nq_mpage', '1'), 10) || 1;
    var s = 1;
    if (typeof SM !== 'undefined') {
      for (var i = 0; i < SM.length; i++) if (SM[i].pg <= cur) s = SM[i].n;
    }
    if (s < 114) M.goSurah(s + 1);
  };

  /* ───────── إعدادات القراءة ───────── */
  function applyFs() {
    document.documentElement.style.setProperty('--rdfs', R.fs + 'px');
    var v = $('st-fsv'); if (v) v.textContent = ar(R.fs);
    var inn = $('mp-in');
    if (inn) {
      inn.style.fontSize = R.fs + 'px';
      inn.style.overflowY = 'auto'; // allow scroll if text bigger than page
    }
  }
  M.fs = function (d) {
    R.fs = Math.max(16, Math.min(56, (R.fs || 22) + d));
    lsSet('nq_rdfs', String(R.fs));
    applyFs();
    if (typeof showToast === 'function') showToast('حجم الخط: ' + ar(R.fs));
  };
  // Expose globally so inline onclick always works
  window.HudaMushaf = window.HudaMushaf || M;
  window.mushafFs = function(d) { if (window.HudaMushaf && HudaMushaf.fs) HudaMushaf.fs(d); };
  M.openSettings = function () { $('st-sp').value = R.speed; $('st-tr').value = R.trans; $('st-goal').textContent = ar(R.goal); applyHifz(); applyMode(); applyFs(); $('rd-set').classList.add('on'); };
  M.closeSheets = function () { ['rd-set', 'rd-sch'].forEach(function (i) { $(i).classList.remove('on'); }); stopVoice(); };

  /* ───────── البحث (نصي + صوتي) ───────── */
  var _t = 0, _rec = null;
  M.openSearch = function () { $('rd-sch').classList.add('on'); setTimeout(function () { $('rd-q').focus(); }, 80); var SR = window.SpeechRecognition || window.webkitSpeechRecognition; $('rd-mic').style.display = SR ? '' : 'none'; };
  function runSearch(q) {
    var box = $('rd-res'); box.textContent = ''; q = (q || '').trim(); if (q.length < 2) return;
    box.appendChild(el('div', 'rd-ld', 'جارٍ البحث…'));
    F('https://api.alquran.cloud/v1/search/' + encodeURIComponent(q) + '/all/ar').then(function (r) { return r.json(); }).then(function (j) {
      box.textContent = ''; var m = (j && j.data && j.data.matches) || [];
      if (!m.length) { box.appendChild(el('div', 'rd-ld', 'لا نتائج لـ «' + q + '»')); return; }
      m.slice(0, 40).forEach(function (x) {
        var r = el('div', 'rs-r'); r.setAttribute('role', 'button'); r.tabIndex = 0;
        r.appendChild(el('b', null, (x.surah.name || '').replace(/^سُورَةُ\s*/, '') + ' · ' + ar(x.numberInSurah))); r.appendChild(el('div', 'rs-t', x.text));
        r.onclick = function () { M.closeSheets(); M.goAyah(x.surah.number, x.numberInSurah); }; box.appendChild(r);
      });
    }).catch(function () { box.textContent = ''; box.appendChild(el('div', 'rd-ld', 'تعذّر البحث — تحقق من الاتصال')); });
  }
  function stopVoice() { if (_rec) { try { _rec.stop(); } catch (e) {} _rec = null; } var m = $('rd-mic'); if (m) m.classList.remove('rec'); }
  M.voice = function () {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition; if (!SR) return;
    if (_rec) { stopVoice(); return; }
    _rec = new SR(); _rec.lang = 'ar-SA'; _rec.interimResults = false; _rec.maxAlternatives = 1; $('rd-mic').classList.add('rec'); toast('🎙 اقرأ جزءاً من الآية…');
    _rec.onresult = function (e) { var t = e.results[0][0].transcript; $('rd-q').value = t; runSearch(t); };
    _rec.onend = _rec.onerror = function () { stopVoice(); }; try { _rec.start(); } catch (e) { stopVoice(); }
  };

  /* ───────── هدف القراءة اليومي ───────── */
  function day() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function goalState() { var g = lsJSON('nq_goal', null); if (!g || g.d !== day()) { var prev = g && g.hist ? g.hist : {}; if (g && g.d && g.pages) prev[g.d] = g.pages.length; g = { d: day(), pages: [], hist: prev, done: false }; lsSet('nq_goal', JSON.stringify(g)); } return g; }
  function recordPage(p) {
    if (!p) return; var g = goalState(); if (g.pages.indexOf(p) >= 0) return; g.pages.push(p);
    if (!g.done && g.pages.length >= R.goal) { g.done = true; toast('🌟 ما شاء الله! أتممت هدف القراءة اليوم'); }
    lsSet('nq_goal', JSON.stringify(g)); renderGoal();
  }
  function goalStreak(g) { var n = g.pages.length >= R.goal ? 1 : 0, d = new Date(); for (var k = 1; k < 400; k++) { d.setDate(d.getDate() - 1); var key = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); if ((g.hist[key] || 0) >= R.goal) n++; else break; } return n; }
  function renderGoal() {
    var box = $('hv-goal'); if (!box) return; var g = goalState(), n = g.pages.length, pct = Math.min(100, Math.round(n / R.goal * 100));
    box.textContent = ''; var c = el('div', 'hv-goal'); var l = el('div', 'gl');
    l.appendChild(el('b', null, 'هدف القراءة اليومي')); l.appendChild(el('small', null, n >= R.goal ? 'أتممت هدفك — تقبّل الله منك ✨' : 'اقرأ ' + ar(R.goal) + ' صفحات اليوم'));
    var bar = el('div', 'bar'); var f = el('i'); f.style.width = pct + '%'; bar.appendChild(f); l.appendChild(bar); c.appendChild(l);
    var r = el('div', 'gr'); r.appendChild(el('b', null, ar(n) + '/' + ar(R.goal))); r.appendChild(el('small', null, '🔥 ' + ar(goalStreak(g)) + ' يوم')); c.appendChild(r);
    c.onclick = function () { SP('mushaf'); }; box.appendChild(c);
  }
  M.goalStep = function (d) { R.goal = Math.max(1, Math.min(60, R.goal + d)); lsSet('nq_goal_t', String(R.goal)); var v = $('st-goal'); if (v) v.textContent = ar(R.goal); renderGoal(); };

  /* ───────── آية اليوم ───────── */
  var DAILY = [[2, 255], [94, 5], [65, 3], [13, 28], [2, 286], [39, 53], [3, 139], [20, 25], [16, 128], [24, 35], [2, 152], [29, 69], [40, 60], [94, 6], [93, 5], [7, 56]];
  function renderDaily() {
    var box = $('hv-daily'); if (!box || box.firstChild) return;
    var now = new Date(), doy = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000), ref = DAILY[doy % DAILY.length], s = ref[0], a = ref[1];
    var c = el('div', 'hv-daily'); c.appendChild(el('small', null, '🌅 آية اليوم')); var t = el('div', 'dt', '…'); c.appendChild(t);
    var meta = el('div', 'dm'); meta.appendChild(el('span', null, sName(s) + ' · ' + ar(a)));
    var b1 = el('button', null, 'تفسير'); b1.onclick = function () { if (typeof openTafsirPopup === 'function') openTafsirPopup(s, a); };
    var b2 = el('button', null, 'اقرأ في المصحف'); b2.onclick = function () { M.goAyah(s, a); };
    meta.appendChild(b1); meta.appendChild(b2); c.appendChild(meta); box.appendChild(c);
    F('https://api.alquran.cloud/v1/ayah/' + s + ':' + a + '/quran-uthmani').then(function (r) { return r.json(); }).then(function (j) { t.textContent = j.data.text; })
      .catch(function () { t.textContent = 'تعذّر تحميل الآية — تحقق من الاتصال'; box.removeChild(c); setTimeout(function () { box.textContent = ''; }, 0); });
  }

  /* ───────── إعدادات: ترجمة / حفظ ───────── */
  M.setTrans = function (v) { R.trans = v || ''; lsSet('nq_rdtr', R.trans); if (R.mode === 'scroll') { var c = R.cur; openSurah(c ? c.s : 1, { ayah: c ? c.a : 0 }); } };
  M.toggleHifz = function () { R.hifz = !R.hifz; lsSet('nq_hifz', R.hifz ? '1' : '0'); applyHifz(); toast(R.hifz ? 'وضع الحفظ: الآية تُكتب أثناء التلاوة' : 'وضع الحفظ متوقف'); };
  function applyHifz() { document.body.classList.toggle('rd-hifz', R.hifz); document.querySelectorAll('.ay.rev').forEach(function (x) { x.classList.remove('rev'); }); var b = $('st-hifz'); if (b) b.classList.toggle('on', R.hifz); }

  /* ───────── تهيئة ───────── */
  function navH() { var n = document.querySelector('nav'); document.documentElement.style.setProperty('--navh', ((n && n.offsetHeight) || 64) + 'px'); }
  function init() {
    navH(); window.addEventListener('resize', navH); applyFs(); applyMode(); setupIO(); applyHifz(); renderGoal(); renderDaily();
    var po = $('mp-pn'); if (po && window.MutationObserver) new MutationObserver(function () { var p = parseInt(lsGet('nq_mpage', '0'), 10); if (R.mode === 'page' && p) recordPage(p); }).observe(po, { childList: true, characterData: true, subtree: true });
    $('st-tr').onchange = function () { M.setTrans(this.value); };
    document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('#st-mode button'); if (b) { setMode(b.getAttribute('data-m')); applyMode(); } });
    $('st-sp').oninput = function () { R.speed = parseInt(this.value, 10) || 2; lsSet('nq_rdspeed', String(R.speed)); };
    $('rd-q').oninput = function () { clearTimeout(_t); var v = this.value; _t = setTimeout(function () { runSearch(v); }, 350); };
    var _sp = window.SP;
    window.SP = function (id, ph) {
      var r = _sp(id, ph); if (id === 'home') { renderGoal(); renderDaily(); } var cur = document.querySelector('.pg.on'); var on = !!(cur && cur.id === 'page-mushaf'); document.body.classList.toggle('in-reader', on); if (!on) stopAuto(); return r;
    };
    document.addEventListener('keydown', function (e) {
      var pg = document.querySelector('.pg.on'); if (!pg || pg.id !== 'page-mushaf' || /INPUT|TEXTAREA|SELECT/.test((e.target || {}).tagName || '')) return;
      if (e.key === 'Escape') { M.closeSheets(); closeAct(); }
    });
  }
  /* يضمن ظهور السورة (للانتقال التلقائي أثناء الاستماع المتواصل) */
  M.ensureSurah = function (n) {
    if (R.mode !== 'scroll' || R.loaded.indexOf(n) >= 0) return Promise.resolve();
    if (n === R.last + 1) return appendSurah(n);
    return Promise.resolve();
  };
  M.isBm = function () { return bmPages().indexOf(curPage()) >= 0; };
  M.isAuto = function () { return !!R.auto; };
  M.currentAyah = function () { return R.sel ? { s: R.sel.s, a: R.sel.a } : (R.cur ? { s: R.cur.s, a: R.cur.a } : null); };
  window.HudaMushaf = M;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
