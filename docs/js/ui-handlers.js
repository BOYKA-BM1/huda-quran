/* ════════════════════════════════════════════════════════════
   هُدى القرآن — دوال الواجهة التي كان الـ HTML يستدعيها ولم تكن معرَّفة
   (المفضلة، الملاحظات، مؤقت النوم، المشغّل المصغّر، مظهر القراءة،
    صفحات الإعدادات/المفضلة/الملاحظات، تفسير الآية، اللغة، الصوت آية بآية…)
   يُحمَّل بعد app.0x.js وقبل notifications.js
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ───────── أدوات مساعدة ───────── */
  function $(id) { return document.getElementById(id); }
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function lsJSON(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function toast(m) { if (typeof showToast === 'function') showToast(m); }
  function toAr(n) { return typeof toArabicNum === 'function' ? toArabicNum(n) : String(n); }
  function surahName(n) { return (typeof SM !== 'undefined' && SM[n - 1]) ? SM[n - 1].ar : ('سورة ' + n); }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function curRecId() { return lsGet('nq_rec', '') || window.readerRec || 'alafasy'; }

  /* ═════════════ 1) المفضلة والملاحظات ═════════════ */
  window.getNQFavs = function () { var a = lsJSON('nq_favs', []); return Array.isArray(a) ? a : []; };
  window.getNQNotes = function () { var o = lsJSON('nq_notes', {}); return (o && typeof o === 'object' && !Array.isArray(o)) ? o : {}; };

  window.toggleFav = function (s, a, text) {
    var key = s + ':' + a, favs = window.getNQFavs(), i = -1;
    for (var k = 0; k < favs.length; k++) { if (favs[k].k === key) { i = k; break; } }
    if (i >= 0) { favs.splice(i, 1); toast('أُزيلت من المفضلة'); }
    else { favs.unshift({ k: key, s: +s, a: +a, t: String(text || ''), ts: Date.now() }); toast('★ أُضيفت إلى المفضلة'); }
    lsSet('nq_favs', JSON.stringify(favs));
    var b = document.querySelector('#ay-' + a + ' .fav-btn');
    if (b) b.classList.toggle('on', i < 0);
    if ($('page-favorites') && $('page-favorites').classList.contains('on')) window.buildFavoritesPage();
  };

  var _noteCtx = null;
  window.openNote = function (s, a) {
    _noteCtx = { s: +s, a: +a };
    var m = $('note-modal'); if (!m) return;
    var lbl = $('note-ref-lbl'); if (lbl) lbl.textContent = 'ملاحظة على سورة ' + surahName(s) + ' — الآية ' + toAr(a);
    var ta = $('note-ta'); if (ta) ta.value = window.getNQNotes()[s + ':' + a] || '';
    m.classList.add('on');
    setTimeout(function () { if (ta) ta.focus(); }, 80);
  };
  window.closeNote = function () { var m = $('note-modal'); if (m) m.classList.remove('on'); _noteCtx = null; };
  function _refreshNoteBtn(s, a, has) { var b = document.querySelector('#ay-' + a + ' .note-btn'); if (b && (b.getAttribute('onclick') || '').indexOf('openNote') >= 0) b.classList.toggle('has-note', has); }
  window.saveNote = function () {
    if (!_noteCtx) return;
    var ta = $('note-ta'), txt = ta ? ta.value.trim() : '';
    var notes = window.getNQNotes(), key = _noteCtx.s + ':' + _noteCtx.a;
    if (txt.length > 2000) { toast('⚠️ الملاحظة طويلة جداً'); return; }
    if (txt) { notes[key] = txt; toast('💾 تم حفظ الملاحظة'); } else { delete notes[key]; }
    lsSet('nq_notes', JSON.stringify(notes));
    _refreshNoteBtn(_noteCtx.s, _noteCtx.a, !!txt);
    window.closeNote();
    if ($('page-notes') && $('page-notes').classList.contains('on')) window.buildNotesPage();
  };
  window.deleteNote = function () {
    if (!_noteCtx) return;
    var notes = window.getNQNotes(); delete notes[_noteCtx.s + ':' + _noteCtx.a];
    lsSet('nq_notes', JSON.stringify(notes));
    _refreshNoteBtn(_noteCtx.s, _noteCtx.a, false);
    toast('🗑️ حُذفت الملاحظة');
    window.closeNote();
    if ($('page-notes') && $('page-notes').classList.contains('on')) window.buildNotesPage();
  };

  function _goToAyah(s, a) {
    if (window.HudaMushaf) window.HudaMushaf.goAyah(+s, +a);
    else if (typeof SP === 'function') SP('mushaf');
  }

  function _emptyBox(icon, line1, line2) {
    var box = el('div', 'fav-empty');
    var i = el('div', null, icon); i.style.cssText = 'font-size:3rem;opacity:.3;';
    var p = el('p'); p.style.cssText = 'margin-top:.8rem;font-size:.9rem;';
    p.appendChild(document.createTextNode(line1)); p.appendChild(document.createElement('br'));
    var sm = el('small', null, line2); p.appendChild(sm);
    box.appendChild(i); box.appendChild(p); return box;
  }
  function _itemCard(ref, text, onOpen, onRemove, removeTitle) {
    var card = el('div', 'fav-item');
    card.style.cssText = 'background:rgba(13,59,46,.35);border:1px solid rgba(201,168,76,.18);border-radius:14px;padding:.9rem;margin-bottom:.7rem;cursor:pointer;';
    var head = el('div'); head.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:.5rem;margin-bottom:.4rem;';
    var r = el('div', null, ref); r.style.cssText = 'color:var(--gold);font-size:.8rem;font-weight:700;';
    var rm = el('button', null, '✕'); rm.title = removeTitle; rm.setAttribute('aria-label', removeTitle);
    rm.style.cssText = 'background:rgba(255,100,100,.08);border:1px solid rgba(255,100,100,.2);color:#e87a7a;width:30px;height:30px;border-radius:8px;cursor:pointer;';
    rm.onclick = function (e) { e.stopPropagation(); onRemove(); };
    head.appendChild(r); head.appendChild(rm);
    var t = el('div', null, text); t.style.cssText = "color:var(--cr);font-family:'Scheherazade New',serif;font-size:1.15rem;line-height:2;direction:rtl;white-space:pre-wrap;";
    card.appendChild(head); card.appendChild(t); card.onclick = onOpen; return card;
  }

  window.buildFavoritesPage = function () {
    var wrap = $('fav-list-wrap'); if (!wrap) return;
    var favs = window.getNQFavs(); wrap.textContent = '';
    if (!favs.length) { wrap.appendChild(_emptyBox('★', 'لا توجد آيات في المفضلة بعد', 'اضغط ★ بجانب أي آية لإضافتها')); return; }
    favs.forEach(function (f) {
      wrap.appendChild(_itemCard('سورة ' + surahName(f.s) + ' — الآية ' + toAr(f.a), f.t,
        function () { _goToAyah(f.s, f.a); },
        function () { window.toggleFav(f.s, f.a, f.t); window.buildFavoritesPage(); }, 'إزالة من المفضلة'));
    });
  };
  window.buildNotesPage = function () {
    var wrap = $('notes-list-wrap'); if (!wrap) return;
    var notes = window.getNQNotes(), keys = Object.keys(notes); wrap.textContent = '';
    if (!keys.length) { wrap.appendChild(_emptyBox('📝', 'لا توجد ملاحظات بعد', 'اضغط 📝 بجانب أي آية لإضافة ملاحظة')); return; }
    keys.forEach(function (k) {
      var p = k.split(':'), s = +p[0], a = +p[1];
      wrap.appendChild(_itemCard('سورة ' + surahName(s) + ' — الآية ' + toAr(a), notes[k],
        function () { _goToAyah(s, a); },
        function () { var n = window.getNQNotes(); delete n[k]; lsSet('nq_notes', JSON.stringify(n)); window.buildNotesPage(); }, 'حذف الملاحظة'));
    });
  };

  /* ═════════════ 2) مظهر القراءة (وضع الألوان / حجم وخط) ═════════════ */
  var QFONTS = ['qfont-s', 'qfont-m', 'qfont-l', 'qfont-xl', 'qfont-xxl'];
  var QFONT_LBL = { 'qfont-s': 'ص', 'qfont-m': 'م', 'qfont-l': 'ك', 'qfont-xl': 'ك+', 'qfont-xxl': 'ض' };
  function _markOn(ids, onId) { ids.forEach(function (id) { var b = $(id); if (b) b.classList.toggle('on', id === onId); }); }

  window.openReaderSettings = function () {
    var m = $('reader-settings-modal'); if (!m) return;
    m.classList.add('on');
    _markOn(['rm-default', 'rm-sepia', 'rm-night'], 'rm-' + lsGet('nq_reader_mode', 'default'));
    _markOn(['ft-default', 'ft-uthmani'], 'ft-' + lsGet('nq_fonttype', 'default'));
  };
  window.closeReaderSettings = function () { var m = $('reader-settings-modal'); if (m) m.classList.remove('on'); };
  window.setReaderMode = function (mode) {
    document.body.classList.remove('reader-sepia', 'reader-night');
    if (mode === 'sepia' || mode === 'night') document.body.classList.add('reader-' + mode); else mode = 'default';
    lsSet('nq_reader_mode', mode);
    _markOn(['rm-default', 'rm-sepia', 'rm-night'], 'rm-' + mode);
  };
  window.setQFont = function (cls) {
    if (QFONTS.indexOf(cls) < 0) cls = 'qfont-m';
    QFONTS.forEach(function (c) { document.body.classList.remove(c); });
    document.body.classList.add(cls);
    lsSet('nq_qfont', cls);
    var b = $('qtopbar-main') && $('qtopbar-main').querySelector('button[onclick="cycleQFont()"]');
    if (b) b.textContent = QFONT_LBL[cls];
  };
  window.cycleQFont = function () {
    var i = QFONTS.indexOf(lsGet('nq_qfont', 'qfont-m'));
    window.setQFont(QFONTS[(i + 1) % QFONTS.length]);
  };
  window.setFontType = function (t) {
    document.body.classList.toggle('font-uthmani', t === 'uthmani');
    lsSet('nq_fonttype', t === 'uthmani' ? 'uthmani' : 'default');
    _markOn(['ft-default', 'ft-uthmani'], 'ft-' + (t === 'uthmani' ? 'uthmani' : 'default'));
    var b = $('uthmani-btn'); if (b) b.classList.toggle('on', t === 'uthmani');
  };
  window.toggleUthmaniFont = function () { window.setFontType(document.body.classList.contains('font-uthmani') ? 'default' : 'uthmani'); };
  window.toggleQExtraPanel = function () { var p = $('qextra-panel'); if (p) p.style.display = p.style.display === 'none' ? 'flex' : 'none'; };

  /* تكرار الآية */
  window._repCount = parseInt(lsGet('nq_repcount', '1'), 10) || 1;
  window._repEnabled = false;
  window.toggleRepMode = function () {
    window._repEnabled = !window._repEnabled;
    var b = $('rep-btn'); if (b) b.classList.toggle('on', window._repEnabled);
    toast(window._repEnabled ? ('🔁 تكرار كل آية ' + toAr(window._repCount) + ' مرات') : 'أُلغي التكرار');
  };




  /* ═════════════ 3) محرك الصوت — سورة كاملة + صوت كل شيخ من مصدره الرسمي ═════════════ */
  function recById(id) {
    if (typeof RD === 'undefined') return null;
    for (var i = 0; i < RD.length; i++) if (RD[i].id === id) return RD[i];
    return null;
  }
  function recName(id) {
    var r = recById(id);
    return (r && r.name) || id || '';
  }
  function pad3(n) { return String(n).padStart(3, '0'); }
  function ping() { try { document.dispatchEvent(new CustomEvent('huda:player')); } catch (e) {} }

  function editionFor(rec) {
    if (window._forceEdition) return window._forceEdition;
    if (window.HudaAudio && HudaAudio.edition) {
      var e = HudaAudio.edition(rec);
      if (e) return e;
    }
    return (typeof ISLAMIC_NET_IDS !== 'undefined' && ISLAMIC_NET_IDS[rec]) || null;
  }


  function globalAyah(s, a) {
    var n = 0;
    for (var i = 0; i < s - 1; i++) n += SM[i].ay;
    return n + a;
  }

  /** روابط آية واحدة — للتظليل الدقيق */
  function ayahUrlList(recId, s, a) {
    var list = [];
    var pad = pad3(s) + pad3(a);
    var ga = globalAyah(s, a);

    // everyayah (أدق للتظليل)
    var folder = (window.EVERYAYAH_FOLDERS && window.EVERYAYAH_FOLDERS[recId]) || null;
    if (folder) {
      list.push('https://everyayah.com/data/' + folder + '/' + pad + '.mp3');
    }

    // islamic.network آية
    var ed = editionFor(recId);
    if (ed) {
      list.push('https://cdn.islamic.network/quran/audio/128/' + ed + '/' + ga + '.mp3');
      list.push('https://cdn.islamic.network/quran/audio/64/' + ed + '/' + ga + '.mp3');
    }

    // احتياطي العفاسي آية بآية
    list.push('https://everyayah.com/data/Alafasy_128kbps/' + pad + '.mp3');
    list.push('https://cdn.islamic.network/quran/audio/128/ar.alafasy/' + ga + '.mp3');

    var seen = {}, out = [];
    list.forEach(function (u) { if (u && !seen[u]) { seen[u] = 1; out.push(u); } });
    return out;
  }

  /** روابط السورة الكاملة — للقراءات أو كاحتياطي */
  function surahUrlList(recId, sNum) {
    var list = [];
    var s = +sNum;
    var pad = pad3(s);

    if (window._qiraat && window._qiraatBase) {
      list.push(window._qiraatBase + pad + '.mp3');
      return list;
    }

    // 1) mp3quran server (صوت الشيخ الحقيقي أولاً)
    var rec = recById(recId);
    if (rec && rec.base) list.push(rec.base + pad + '.mp3');
    if (typeof AUDIO_FALLBACKS !== 'undefined' && AUDIO_FALLBACKS[recId]) {
      AUDIO_FALLBACKS[recId].forEach(function (base) {
        if (base) list.push(base + pad + '.mp3');
      });
    }
    // 2) islamic.network فقط إن كان للمعرّف نسخة مميزة (ليس null وليست مشتركة خطأ)
    var ed = editionFor(recId);
    if (ed) {
      list.push('https://cdn.islamic.network/quran/audio-surah/128/' + ed + '/' + s + '.mp3');
      list.push('https://cdn.islamic.network/quran/audio-surah/64/' + ed + '/' + s + '.mp3');
    }

    var seen = {}, out = [];
    list.forEach(function (u) { if (u && !seen[u]) { seen[u] = 1; out.push(u); } });
    return out;
  }

  var G = {
    audio: null,
    s: 0,
    a: 1,
    rec: 'alafasy',
    active: false,
    rate: parseFloat(lsGet('nq_rate', '1')) || 1,
    token: 0,
    urls: [],
    urlIndex: 0,
    mode: 'surah',
    session: false,
    _resumeAt: 0,
    _lastSaveT: 0
  };

  function getAudio() {
    // عنصر واحد فقط — #aud — حتى لا يتصارع محركان
    var el = document.getElementById('aud');
    if (el) {
      G.audio = el;
      return el;
    }
    if (!G.audio) {
      G.audio = new Audio();
      G.audio.preload = 'auto';
    }
    return G.audio;
  }

  function clearHighlight() {
    try {
      document.querySelectorAll('.ay.playing, .ay.pa, .ayah.playing, .ayah.pa, .ms-vn.playing').forEach(function (el) {
        el.classList.remove('playing', 'pa');
      });
    } catch (e) {}
  }
  function applyHighlight(s, a) {
    /* التظليل ملغى نهائيًا — قراءة صوت فقط */
    clearHighlight();
  }

  function updatePlayerUI(playing) {
    try {
      var gp = document.getElementById('gplayer');
      if (gp) gp.classList.add('show');
      var pl = document.getElementById('gpplay');
      if (pl) pl.textContent = playing ? '⏸' : '▶';
      var name = (window._qiraat && window._qiraat.name) || recName(G.rec) || G.rec;
      var n = document.getElementById('gpname'); if (n) n.textContent = name;
      var gs = document.getElementById('gpsurah');
      if (gs) gs.textContent = 'سورة ' + (typeof surahName === 'function' ? surahName(G.s) : G.s);
      var ga = document.getElementById('gpayah');
      if (ga) ga.textContent = G.a ? ('الآية ' + (typeof toAr === 'function' ? toAr(G.a) : G.a)) : '';
      var dn = document.getElementById('dk-rn'); if (dn) dn.textContent = name;
    } catch (e) {}
    ping();
  }

  function hardStop() {
    G.token++;
    var au = G.audio;
    if (au) {
      try {
        au.onended = au.onerror = au.onplay = au.onpause = au.ontimeupdate = null;
        au.pause();
        au.removeAttribute('src');
        au.load();
      } catch (e) {}
    }
    try {
      var el = document.getElementById('aud');
      if (el) { el.onended = el.onerror = null; el.pause(); el.removeAttribute('src'); el.load(); }
    } catch (e) {}
    if (typeof isPlay !== 'undefined') isPlay = false;
    G.active = false;
    G.session = false;
    G._resumeAt = 0;
    stopHlTimer();
    clearHighlight();
    updatePlayerUI(false);
  }

  function currentSurah() {
    try {
      if (G.s) return G.s;
      var pos = JSON.parse(localStorage.getItem('nq_pos') || 'null');
      if (pos && pos.s) return +pos.s;
      var el = document.querySelector('#mp-in .ay[data-s], #rd-flow .ay[data-s]');
      if (el) return +el.getAttribute('data-s') || 1;
      if (typeof curSurahN !== 'undefined' && curSurahN) return +curSurahN;
    } catch (e) {}
    return 1;
  }

  function resolveRec() {
    if (window._qiraat && window._qiraatBase) {
      return G.rec || 'alafasy';
    }
    var rec = (typeof curRecId === 'function' ? curRecId() : null)
      || (typeof curRec !== 'undefined' && curRec)
      || localStorage.getItem('nq_rec')
      || 'alafasy';
    G.rec = rec;
    return rec;
  }

  function nextAyah(s, a) {
    if (typeof SM === 'undefined') return null;
    if (a < SM[s - 1].ay) return [s, a + 1];
    if (s < 114) return [s + 1, 1];
    return null;
  }

  /** معطّل — دائماً سورة كاملة */
  function playAyahPrecise(s, a) {
    playSurah(+s || currentSurah());
  }

  /** شريط التقدم — موضع داخل الآية + نسبة السورة */
  function fmtTime(sec) {
    sec = Math.max(0, Math.floor(sec || 0));
    var m = Math.floor(sec / 60), s = sec % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }
  function updateProgressBar() {
    try {
      var au = G.audio;
      var fill = document.getElementById('gpfill');
      if (!fill || !au) return;
      var pct = 0;
      if (au.duration && isFinite(au.duration) && au.duration > 0) {
        pct = (au.currentTime / au.duration) * 100;
      }
      fill.style.width = Math.max(0, Math.min(100, pct)) + '%';
      var gc = document.getElementById('gcur');
      var gd = document.getElementById('gdur');
      if (gc) gc.textContent = fmtTime(au.currentTime);
      if (gd) gd.textContent = fmtTime(au.duration && isFinite(au.duration) ? au.duration : 0);
    } catch (e) {}
  }

  /** تشغيل سورة كاملة (للقراءات العشر) + تظليل تقديري */

  // مؤقت تظليل مستمر أثناء التشغيل (لا يعتمد فقط على timeupdate)
  var _hlTimer = null;
  function startHlTimer() { /* disabled */ }
  function stopHlTimer() { /* disabled */ }

  function playSurah(sNum) {
    sNum = +sNum || 1;
    if (sNum < 1) sNum = 1;
    if (sNum > 114) sNum = 114;

    var au = getAudio();
    var rec = resolveRec();

    // —— استكمال ناعم: نفس السورة + مصدر محمّل + موضع محفوظ ——
    var src = String(au && au.src || '');
    var hasMedia = src.length > 10 && (src.indexOf('http') >= 0 || src.indexOf('blob:') >= 0);
    var qBase = (window._qiraat && window._qiraatBase) ? window._qiraatBase : '';
    if (
      G.session && G.s === sNum && G.rec === rec && !G._forceReload &&
      (G._lastQiraatBase || '') === qBase &&
      hasMedia && !au.ended &&
      (au.currentTime > 0.15 || G._resumeAt > 0.15)
    ) {
      G.active = true;
      try { isPlay = true; } catch (e) {}
      if (G._resumeAt > (au.currentTime || 0) + 0.4 && au.duration) {
        try { au.currentTime = Math.min(G._resumeAt, au.duration - 0.2); } catch (e) {}
      }
      G._resumeAt = 0;
      updatePlayerUI(true);
      startHlTimer();
      applyHighlight(G.s, G.a || 1);
      var pr = au.play();
      if (pr && pr.catch) pr.catch(function () {});
      return; // لا تعِد تحميل الملف
    }

    var myToken = ++G.token;

    G.s = sNum;
    G.a = (!G._forceReload && G._resumeAt > 0.5) ? (G.a || 1) : 1;
    G.active = true;
    G.session = true;
    G.mode = 'surah';
    G.rec = rec;
    G._lastQiraatBase = (window._qiraat && window._qiraatBase) ? window._qiraatBase : '';
    G._forceReload = false;
    try { localStorage.setItem('nq_pos', JSON.stringify({ s: sNum, a: G.a })); } catch (e) {}

    updatePlayerUI(true);
    applyHighlight(sNum, G.a || 1);
    startHlTimer();

    try {
      if (window.HudaMushaf && HudaMushaf.goSurah) HudaMushaf.goSurah(sNum);
    } catch (e) {}
    setTimeout(function () { if (G.token === myToken && G.active) applyHighlight(sNum, G.a || 1); }, 300);
    setTimeout(function () { if (G.token === myToken && G.active) applyHighlight(sNum, G.a || 1); }, 700);
    setTimeout(function () { if (G.token === myToken && G.active) applyHighlight(sNum, G.a || 1); }, 1200);

    G.urls = surahUrlList(rec, sNum);
    G.urlIndex = 0;

    function tryNextUrl() {
      if (G.token !== myToken) return;
      if (G.urlIndex >= G.urls.length) {
        if (sNum < 114) playSurah(sNum + 1);
        else { G.active = false; updatePlayerUI(false); }
        return;
      }
      var url = G.urls[G.urlIndex++];
      au.onended = au.onerror = au.onplay = au.onpause = au.ontimeupdate = null;
      au.src = url;
      au.playbackRate = G.rate;
      try { au.load(); } catch (e) {}

      au.onplay = function () {
        if (G.token !== myToken) return;
        G.active = true;
        updatePlayerUI(true);
        // استكمال من موضع الإيقاف
        if (G._resumeAt && G._resumeAt > 0.5 && au.duration && isFinite(au.duration)) {
          try {
            var t0 = Math.min(G._resumeAt, Math.max(0, au.duration - 0.3));
            au.currentTime = t0;
          } catch (e) {}
          G._resumeAt = 0;
        }
        // حدّث رقم الآية حسب الزمن
        if (au.duration && SM[G.s - 1]) {
          var totalAy = SM[G.s - 1].ay || 1;
          G.a = Math.min(totalAy, Math.max(1, Math.floor((au.currentTime / au.duration) * totalAy) + 1));
        }
        applyHighlight(G.s, G.a || 1);
        updateProgressBar();
      };
      au.ontimeupdate = function () {
        if (G.token !== myToken || !G.active) return;
        updateProgressBar();
        // احفظ الموضع كل ~2 ثانية لاستكماله بعد إيقاف
        if (!G._lastSaveT || (au.currentTime - G._lastSaveT) > 2) {
          G._lastSaveT = au.currentTime;
          try {
            localStorage.setItem('nq_audio_pos', JSON.stringify({
              s: G.s, a: G.a || 1, t: au.currentTime, rec: G.rec
            }));
          } catch (e) {}
        }
        if (!au.duration || !isFinite(au.duration) || au.duration < 1) return;
        if (typeof SM === 'undefined' || !SM[G.s - 1]) return;
        var totalAy = SM[G.s - 1].ay || 1;
        // تقديري — نسبة الزمن داخل السورة (مع هامش بسيط عشان ما يسبقش الصوت)
        var ratio = au.currentTime / au.duration;
        // اطرح ~0.4 ثانية كتعويض لبداية التلاوة/البسملة
        var adj = Math.max(0, au.currentTime - 0.35) / au.duration;
        var idx = Math.min(totalAy, Math.max(1, Math.floor(adj * totalAy) + 1));
        if (idx !== G.a) {
          G.a = idx;
          try { localStorage.setItem('nq_pos', JSON.stringify({ s: G.s, a: G.a })); } catch (e) {}
          // لا تعِد رسم الصفحة إلا لو الآية مش ظاهرة (إعادة الرسم تمسح التظليل)
          try {
            var onScreen = document.querySelector(
              '.ay[data-s="' + G.s + '"][data-a="' + idx + '"], .ms-vn[data-s="' + G.s + '"][data-a="' + idx + '"]'
            );
            if (!onScreen && window.HudaMushaf && HudaMushaf.goAyah) {
              HudaMushaf.goAyah(G.s, idx);
              // بعد تحميل الصفحة أعد التظليل
              setTimeout(function () {
                if (G.token === myToken && G.active) applyHighlight(G.s, G.a);
              }, 450);
            }
          } catch (e) {}
          applyHighlight(G.s, G.a);
          try {
            var ga = document.getElementById('gpayah');
            if (ga) ga.textContent = 'الآية ' + (typeof toAr === 'function' ? toAr(G.a) : G.a);
          } catch (e) {}
        } else {
          // ثبّت التظليل لو الصفحة اتعملت repaint
          var still = document.querySelector('.ay.playing[data-a="' + G.a + '"], .ay.pa[data-a="' + G.a + '"]');
          if (!still) applyHighlight(G.s, G.a);
        }
      };
      au.onpause = function () {
        if (G.token !== myToken) return;
        if (au.paused && G.active && !au.ended && au.currentTime > 0.15) updatePlayerUI(false);
      };
      au.onended = function () {
        if (G.token !== myToken) return;
        // تكرار السورة
        try {
          if (typeof isRepeat !== 'undefined' && isRepeat) {
            try { au.currentTime = 0; } catch (e) {}
            var prr = au.play();
            if (prr && prr.catch) prr.catch(function () {});
            return;
          }
          if (G._loopSurah) {
            try { au.currentTime = 0; } catch (e) {}
            var pr2 = au.play();
            if (pr2 && pr2.catch) pr2.catch(function () {});
            return;
          }
        } catch (e) {}
        if (sNum < 114) playSurah(sNum + 1);
        else {
          G.active = false;
          updatePlayerUI(false);
          clearHighlight();
        }
      };
      au.onerror = function () {
        if (G.token !== myToken) return;
        tryNextUrl();
      };

      var p = au.play();
      if (p && p.catch) {
        p.catch(function (err) {
          if (G.token !== myToken) return;
          if (err && err.name === 'AbortError') return;
          if (err && err.name === 'NotAllowedError') {
            G.active = false;
            updatePlayerUI(false);
            if (typeof toast === 'function') toast('اضغط تشغيل للبدء');
            return;
          }
          tryNextUrl();
        });
      }
    }
    tryNextUrl();
  }

  // API — كل الطرق تؤدي لسورة كاملة
  window.playSurahContinuous = function (sNum) { playSurah(+sNum || currentSurah()); };
  /** تشغيل فوري لسورة بقارئ محدد (عند اختيار الشيخ) */
  window.__hudaMarkReload = function () {
    G._forceReload = true;
    G._resumeAt = 0;
    G.session = false;
  };
  window.forcePlaySurah = function (sNum, recId) {
    if (recId) {
      G.rec = recId;
      window._qiraat = null;
      window._qiraatBase = null;
      window._forceEdition = null;
      try {
        localStorage.setItem('nq_rec', recId);
        localStorage.removeItem('nq_qiraat');
      } catch (e) {}
    }
    G._forceReload = true;
    G._resumeAt = 0;
    G.session = false; // امنع الاستكمال الناعم على صوت الشيخ السابق
    try {
      var au = getAudio();
      if (au) {
        au.pause();
        // لا تمسح src هنا — playSurah سيعيد التعيين
      }
    } catch (e) {}
    playSurah(+sNum || currentSurah());
    G._forceReload = false;
  };
  window.playAyahGapless = function (a, surahOverride) {
    var s = +(surahOverride || currentSurah());
    window._gaplessMode = false;
    playSurah(s); // سورة كاملة فقط
  };
  window.nextGaplessAyah = function () {
    var s = currentSurah();
    if (s < 114) playSurah(s + 1);
  };
  window.prevGaplessAyah = function () {
    var s = currentSurah();
    if (s > 1) playSurah(s - 1);
  };
  // للتوافق: التنقل بين السور
  window.nextA = window.nextA || window.nextGaplessAyah;
  window.prevA = window.prevA || window.prevGaplessAyah;
  window.G_STATE = function () {
    var au = G.audio;
    return {
      active: !!(G.active || G.session),
      playing: !!(au && !au.paused && (G.active || G.session)),
      s: G.s, a: G.a || 1, rec: G.rec, rate: G.rate, session: !!G.session
    };
  };
  window.G_ACTIVE = function () { return !!(G.session || G.active); };
  window.G_CAN_RESUME = function () {
    var au = getAudio();
    return !!(au && au.src && !au.ended && (au.currentTime > 0.15 || G._resumeAt > 0.15) && G.s);
  };
  window.highlightPlayingAyah = function (s, a) { G.s = +s || G.s; G.a = +a || 1; /* no highlight */ };
  window.G_SETRATE = function (r) {
    G.rate = Math.max(0.5, Math.min(2, +r || 1));
    lsSet('nq_rate', String(G.rate));
    if (G.audio) G.audio.playbackRate = G.rate;
    ping();
    return G.rate;
  };
  window._gaplessMode = false;
  window.toggleGaplessMode = function () { toast('تشغيل السورة كاملة'); };

  window.__hudaTogPlay = window.togPlay = function () {
    var au = getAudio();
    if (!au) { playSurah(currentSurah()); return; }

    // يعمل الآن → إيقاف مؤقت (لا تمسح src ولا session)
    if (!au.paused) {
      G._resumeAt = au.currentTime || 0;
      try {
        localStorage.setItem('nq_audio_pos', JSON.stringify({
          s: G.s || currentSurah(), a: G.a || 1, t: G._resumeAt, rec: G.rec
        }));
      } catch (e) {}
      au.pause();
      G.active = false;
      G.session = true;
      try { isPlay = false; } catch (e) {}
      updatePlayerUI(false);
      try { if (window.HudaDock) HudaDock.update(); } catch (e) {}
      return;
    }

    // متوقف: استكمال
    var src = String(au.src || '');
    var hasMedia = src.length > 10 && (src.indexOf('http') >= 0 || src.indexOf('blob:') >= 0);
    if (hasMedia && !au.ended && (G.session || G.s || G._resumeAt > 0.1)) {
      if (!G.s) {
        try {
          var sav = JSON.parse(localStorage.getItem('nq_audio_pos') || 'null');
          if (sav && sav.s) { G.s = +sav.s; G.a = +sav.a || 1; G._resumeAt = +sav.t || G._resumeAt; }
        } catch (e) {}
      }
      G.active = true;
      G.session = true;
      try { isPlay = true; } catch (e) {}
      if (G._resumeAt > (au.currentTime || 0) + 0.4 && au.duration) {
        try { au.currentTime = Math.min(G._resumeAt, au.duration - 0.2); } catch (e) {}
      }
      updatePlayerUI(true);
      startHlTimer();
      applyHighlight(G.s || currentSurah(), G.a || 1);
      var p = au.play();
      if (p && p.catch) p.catch(function () {});
      try { if (window.HudaDock) HudaDock.update(); } catch (e) {}
      return;
    }

    // لا يوجد صوت محمّل → ابدأ السورة
    try {
      var saved = JSON.parse(localStorage.getItem('nq_audio_pos') || 'null');
      if (saved && saved.s && saved.t > 0.5) {
        G.s = +saved.s; G.a = +saved.a || 1; G._resumeAt = +saved.t;
        if (saved.rec) G.rec = saved.rec;
        playSurah(G.s);
        return;
      }
    } catch (e) {}
    playSurah(G.s || currentSurah());
  };
  window.stopPlay = function () { hardStop(); try { var gp = document.getElementById('gplayer'); if (gp) gp.classList.remove('show'); } catch (e) {} };
  window.G_STOP = function () { hardStop(); try { var gp = document.getElementById('gplayer'); if (gp) gp.classList.remove('show'); } catch (e) {} };

  window.startPB = function (recId, sNum) {
    if (recId) {
      G.rec = recId;
      window._forceEdition = null;
      window._qiraat = null;
      try { localStorage.setItem('nq_rec', recId); localStorage.removeItem('nq_qiraat'); } catch (e) {}
    }
    playSurah(sNum || currentSurah());
  };
  window.playQiraatSurahEdition = function (ed, surah, label) {
    window._forceEdition = ed;
    if (label) window._qiraat = { name: label, ed: ed };
    playSurah(surah || currentSurah());
  };

  if (_setVol0) window.setVol = function (v) {
    var au = G.audio;
    if (au) au.volume = Math.min(1, parseFloat(v) || 0);
    return _setVol0.apply(this, arguments);
  };
  window.seekGP = function (e) {
    var au = G.audio;
    var b = document.getElementById('gpbar');
    if (!b || !au || !au.duration || !isFinite(au.duration)) {
      if (typeof _seekGP0 === 'function') return _seekGP0.apply(this, arguments);
      return;
    }
    var rect = b.getBoundingClientRect();
    var clientX = e.clientX != null ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : rect.left);
    var ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    au.currentTime = ratio * au.duration;
    updateProgressBar();
  };

  // سحب شريط التقدم
  (function () {
    function ratioFromEvent(e, el) {
      var rect = el.getBoundingClientRect();
      var x = (e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX) - rect.left;
      return Math.max(0, Math.min(1, x / rect.width));
    }
    function seekRatio(r) {
      var au = G.audio;
      if (G.active && au && au.duration && isFinite(au.duration)) {
        au.currentTime = r * au.duration;
        updateProgressBar();
      }
    }
    function bind() {
      var bar = document.getElementById('gpbar');
      if (!bar || bar._dragBound) return;
      bar._dragBound = true;
      var dragging = false;
      bar.addEventListener('pointerdown', function (e) {
        dragging = true;
        try { bar.setPointerCapture(e.pointerId); } catch (err) {}
        seekRatio(ratioFromEvent(e, bar));
        e.preventDefault();
      });
      bar.addEventListener('pointermove', function (e) {
        if (!dragging) return;
        seekRatio(ratioFromEvent(e, bar));
      });
      function endDrag() { dragging = false; }
      bar.addEventListener('pointerup', endDrag);
      bar.addEventListener('pointercancel', endDrag);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind);
    else bind();
    setTimeout(bind, 500);
  })();

  // لا نرجع للمحرك القديم — دائماً سورة كاملة عبر playSurah
  window.startPB = function (recId, sNum) {
    try { if (typeof _stopGapless === 'function') _stopGapless(true); } catch (e) {}
    window._gaplessMode = false;
    G.failed = false;
    if (recId) {
      G.rec = recId;
      window._forceEdition = null;
      window._qiraat = null;
      try {
        localStorage.setItem('nq_rec', recId);
        localStorage.removeItem('nq_qiraat');
      } catch (e) {}
    }
    playSurah(sNum || currentSurah());
  };

  /* ─ المشغّل المصغّر الكامل ─ */
  var _miniTimer = null;
  function _activeAudio() { return (G.active && G.aud) ? G.aud : (typeof aud !== 'undefined' ? aud : null); }
  function _fmt(s) { return typeof fmt === 'function' ? fmt(s) : '0:00'; }
  function _syncMini() {
    var p = $('mini-player-panel'); if (!p || p.style.display === 'none') return;
    var a = _activeAudio(); if (!a) return;
    var f = $('mpp-fill'); if (f && a.duration) f.style.width = Math.min(100, (a.currentTime / a.duration) * 100) + '%';
    var c = $('mpp-cur'); if (c) c.textContent = _fmt(a.currentTime);
    var d = $('mpp-dur'); if (d) d.textContent = _fmt(a.duration);
    var pl = $('mpp-play'); if (pl) pl.textContent = a.paused ? '▶' : '⏸';
  }
  window.openMiniPanel = function () {
    var p = $('mini-player-panel'); if (!p) return;
    var rn = $('mpp-reciter'); if (rn && $('gpname')) rn.textContent = $('gpname').textContent;
    var sn = $('mpp-surah'); if (sn && $('gpsurah')) sn.textContent = $('gpsurah').textContent;
    var an = $('mpp-ayah'); if (an) an.textContent = G.active ? ('الآية ' + toAr(G.a)) : '';
    var av = $('mpp-av'), gav = $('gpav');
    if (av && gav) { var ring = av.querySelector('.rav-ring'); av.textContent = ''; var cl = gav.cloneNode(true); cl.removeAttribute('id'); av.appendChild(cl); if (ring) av.appendChild(ring); }
    p.style.display = 'flex'; _gaplessBtns(); _syncMini();
    clearInterval(_miniTimer); _miniTimer = setInterval(_syncMini, 400);
  };
  window.closeMiniPanel = function () { var p = $('mini-player-panel'); if (p) p.style.display = 'none'; clearInterval(_miniTimer); };
  window.seekMPP = function (e) {
    var a = _activeAudio(), b = $('mpp-bar'); if (!a || !b || !a.duration) return;
    var r = b.getBoundingClientRect(), x = (document.dir === 'rtl' || getComputedStyle(b).direction === 'rtl') ? (r.right - e.clientX) : (e.clientX - r.left);
    a.currentTime = Math.max(0, Math.min(1, x / r.width)) * a.duration;
  };
  window.syncVolSliders = function (v) {
    document.querySelectorAll('#mini-player-panel input[type=range],#gplayer input[type=range]').forEach(function (r) { r.value = v; });
  };

  /* ═════════════ 4) مؤقت النوم ═════════════ */
  var _sleepEnd = 0, _sleepTimer = null;
  function _sleepTick() {
    var left = Math.max(0, Math.round((_sleepEnd - Date.now()) / 1000));
    var c = $('sleep-countdown'); if (c) c.textContent = Math.floor(left / 60) + ':' + String(left % 60).padStart(2, '0');
    if (left <= 0) {
      window.cancelSleepTimer(true);
      try { if (G.aud) G.aud.pause(); } catch (e) {}
      if (typeof stopPlay === 'function') stopPlay();
      toast('😴 انتهى مؤقت النوم — تُقبّل الله منك');
    }
  }
  window.setSleepTimer = function (min) {
    min = parseInt(min, 10);
    if (!min || min < 1) { window.cancelSleepTimer(); return; }
    clearInterval(_sleepTimer);
    _sleepEnd = Date.now() + min * 60000;
    var b = $('sleep-badge'); if (b) b.classList.add('show');
    var sel = $('sleep-sel'); if (sel) sel.value = String(min);
    _sleepTick(); _sleepTimer = setInterval(_sleepTick, 1000);
    toast('😴 سيتوقف التشغيل بعد ' + toAr(min) + ' دقيقة');
  };
  window.cancelSleepTimer = function (silent) {
    clearInterval(_sleepTimer); _sleepTimer = null; _sleepEnd = 0;
    var b = $('sleep-badge'); if (b) b.classList.remove('show');
    var sel = $('sleep-sel'); if (sel) sel.value = '0';
    if (silent !== true) toast('أُلغي مؤقت النوم');
  };
  window.openSleepFromPanel = function () { var m = $('sleep-quick-modal'); if (m) m.style.display = 'block'; };
  window.closeSleepModal = function () { var m = $('sleep-quick-modal'); if (m) m.style.display = 'none'; };

  /* ═════════════ 5) تفسير الآية (النافذة السفلية) ═════════════ */
  var _taf = { s: 0, a: 0 };
  window.openTafsirPopup = function (s, a) {
    _taf = { s: +s, a: +a };
    var pop = $('tafsir-popup'), ov = $('tafsir-overlay'); if (!pop) return;
    $('tafsir-title').textContent = 'تفسير سورة ' + (typeof surahName === 'function' ? surahName(s) : s) + ' — الآية ' + (typeof toAr === 'function' ? toAr(a) : a);
    $('tafsir-ayah-text').textContent = '';
    var body = $('tafsir-body'); body.textContent = '';
    body.appendChild(el('div', 'tafsir-popup-loading', 'جارٍ التحميل...'));
    pop.style.display = 'flex'; pop.classList.add('show'); if (ov) { ov.style.display = 'block'; ov.classList.add('show'); }

    function done(ay, tx) {
      if (ay) $('tafsir-ayah-text').textContent = ay;
      body.textContent = '';
      if (!tx) { body.appendChild(el('div', 'tafsir-popup-loading', 'لم يتوفر التفسير')); return; }
      body.appendChild(el('div', null, tx));
      var src = el('div', null, 'المصدر: التفسير الميسَّر — مجمع الملك فهد');
      src.style.cssText = 'font-size:.7rem;color:var(--tm);margin-top:.6rem;';
      body.appendChild(src);
    }

    Promise.all([
      fetch('data/quran/ar.muyassar/' + s + '.json').then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }),
      fetch('data/quran/quran-uthmani/' + s + '.json').then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })
    ]).then(function (pair) {
      var loc = pair[0], uth = pair[1];
      var tHit = loc && loc.data && loc.data.ayahs && loc.data.ayahs.filter(function (y) { return +y.numberInSurah === +a || +y.number === +a; })[0];
      var uHit = uth && uth.data && uth.data.ayahs && uth.data.ayahs.filter(function (y) { return +y.numberInSurah === +a; })[0];
      if (tHit && (tHit.text || tHit.tafsir)) {
        done(uHit && uHit.text ? uHit.text : '', tHit.text || tHit.tafsir || '');
        return;
      }
      var F = window.HudaQuran ? window.HudaQuran.fetch : fetch;
      return F('https://api.alquran.cloud/v1/ayah/' + s + ':' + a + '/editions/ar.muyassar').then(function (r) { return r.json(); }).then(function (j) {
        var tx = (j.data && (j.data.text || (j.data[0] && j.data[0].text))) || '';
        var ay = (uHit && uHit.text) || '';
        done(ay, tx);
      });
    }).catch(function () {
      body.textContent = '';
      body.appendChild(el('div', 'tafsir-popup-loading', '⚠ تعذّر تحميل التفسير — تحقق من الاتصال'));
    });
  };
  window.closeTafsir = function () {
    var p = $('tafsir-popup'), o = $('tafsir-overlay');
    if (p) { p.classList.remove('show'); p.style.display = 'none'; }
    if (o) { o.classList.remove('show'); o.style.display = 'none'; }
  };
  // Force closed on load
  document.addEventListener('DOMContentLoaded', function(){ try{ closeTafsir(); }catch(e){} });

  window.tafsirPlay = function () {
    var s = +(_taf && _taf.s), a = +(_taf && _taf.a);
    if (!s || !a) {
      try {
        var last = JSON.parse(localStorage.getItem('nq_last_ayah') || 'null');
        if (last && last.s && last.a) { s = +last.s; a = +last.a; }
      } catch (e) {}
    }
    if (!s || !a) {
      if (typeof toast === 'function') toast('اختر آية أولاً');
      else if (typeof showToast === 'function') showToast('اختر آية أولاً');
      return;
    }
    try { localStorage.setItem('nq_last_ayah', JSON.stringify({ s: s, a: a })); } catch (e) {}
    var rec = (typeof curRec !== 'undefined' && curRec) || localStorage.getItem('nq_rec') || 'alafasy';
    var pad = function (n) { n = String(n); while (n.length < 3) n = '0' + n; return n; };
    var urls = [];
    var folder = (window.EVERYAYAH_FOLDERS && window.EVERYAYAH_FOLDERS[rec]) || null;
    if (folder) urls.push('https://everyayah.com/data/' + folder + '/' + pad(s) + pad(a) + '.mp3');
    // islamic network ayah
    var ed = (typeof ISLAMIC_NET_IDS !== 'undefined' && ISLAMIC_NET_IDS[rec]) || null;
    if (ed) {
      var ga = 0;
      if (typeof SM !== 'undefined') {
        for (var i = 0; i < s - 1; i++) ga += (SM[i] && SM[i].ay) ? SM[i].ay : 0;
      }
      ga += a;
      urls.push('https://cdn.islamic.network/quran/audio/128/' + ed + '/' + ga + '.mp3');
    }
    // always alafasy everyayah fallback
    urls.push('https://everyayah.com/data/Alafasy_128kbps/' + pad(s) + pad(a) + '.mp3');
    var au = document.getElementById('aud');
    if (!au) { au = new Audio(); au.id = 'aud'; document.body.appendChild(au); }
    var idx = 0;
    function tryPlay() {
      if (idx >= urls.length) {
        if (typeof toast === 'function') toast('تعذّر تشغيل الآية');
        return;
      }
      au.onended = null;
      au.onerror = function () { idx++; tryPlay(); };
      au.src = urls[idx++];
      var p = au.play();
      if (p && p.catch) p.catch(function () { idx++; tryPlay(); });
    }
    tryPlay();
  };
  window.tafsirCopy = function () {
    var b = $('tafsir-body'); if (!b) return;
    var txt = ($('tafsir-ayah-text').textContent + '\n\n' + b.textContent).trim();
    if (navigator.clipboard) navigator.clipboard.writeText(txt).then(function () { toast('✅ تم النسخ'); }, function () { toast('تعذّر النسخ'); });
  };
  /* إضافة زر «تفسير» لقائمة الآية */
  var _menu0 = window._showAyahMenu;
  if (typeof _menu0 === 'function') window._showAyahMenu = function (sn, an) {
    _menu0.apply(this, arguments);
    var m = $('ayah-ctx-menu'); if (!m) return;
    var b = el('button', null, '📖 تفسير'); b.style.cssText = 'background:rgba(201,168,76,.15);border:1px solid rgba(201,168,76,.3);color:#C9A84C;padding:.45rem .9rem;border-radius:10px;cursor:pointer;font-family:Tajawal,sans-serif;';
    b.onclick = function () { m.remove(); window.openTafsirPopup(sn, an); };
    m.insertBefore(b, m.firstChild);
  };

  /* ═════════════ 6) الختمة: الإشارة المرجعية ═════════════ */
  window.updateKhatmaBookmarkUI = function () {
    var pos = lsJSON('nq_pos', null), t = $('khatma-bm-title'), s = $('khatma-bm-sub');
    if (!t || !s) return;
    if (pos && pos.s) { t.textContent = 'آخر موضع قراءة'; s.textContent = 'سورة ' + surahName(pos.s); }
    else { t.textContent = 'الإشارة المرجعية'; s.textContent = 'لم يُحدَّد موضع القراءة بعد'; }
  };
  window.goToKhatmaBookmark = function () {
    var pos = lsJSON('nq_pos', null);
    if (!pos || !pos.s) { toast('لا يوجد موضع محفوظ بعد — افتح أي سورة أولاً'); return; }
    _goToAyah(pos.s, 1);
  };
  window.resetKhatmaBookmark = function () {
    if (!confirm('إعادة ضبط موضع القراءة؟')) return;
    try { localStorage.removeItem('nq_pos'); } catch (e) {} window.updateKhatmaBookmarkUI(); toast('↺ أُعيد الضبط');
  };

  /* ═════════════ 7) فلتر السور ═════════════ */
  window.msFilterSurahs = function (v) {
    var list = $('ms-panel-list-s'); if (!list) return;
    var q = window.HudaQuran ? window.HudaQuran.norm(v) : String(v || '').trim();
    Array.prototype.forEach.call(list.children, function (c) {
      var t = window.HudaQuran ? window.HudaQuran.norm(c.textContent) : c.textContent;
      c.style.display = (!q || t.indexOf(q) !== -1) ? '' : 'none';
    });
  };

  /* ═════════════ 8) اللغة ═════════════ */
  var EN = {
    about_app: 'About the app', adhan_settings: 'Adhan settings', adhan_volume: '🔊 Volume', all_offline: 'Works offline after loading',
    app_language: 'App language', app_language_desc: 'Change the interface language', auto_adhan: 'Automatic adhan at prayer time',
    auto_adhan_desc: 'Plays the adhan automatically when the prayer time begins', calc_method: 'Calculation method',
    enable_notifs: 'Enable notifications', fajr_adhan: 'Special Fajr alert', font_size: 'Font size', go_to_settings: 'Go to settings',
    hijri_correction: 'Hijri date adjustment', hijri_offset: 'Hijri day correction',
    hijri_offset_desc: 'Adjust ±1 day to match moon sighting in your country', language: 'Language', muezzin_select: 'Choose muezzin',
    notif_disabled: '⚠️ Notifications are disabled', notif_enabled: '✅ Notifications are enabled', notifications: 'Notifications',
    prayer_calc: 'Prayer time calculation', pre_prayer_reminder: 'Reminder before prayer', pre_prayer_reminder_desc: 'Alert 15 minutes before each prayer',
    reset_all: '🗑️ Clear all saved data', settings_moved: 'Settings moved', settings_moved_desc: 'Settings are now in the Settings page',
    site_settings: 'Settings', site_settings_desc: 'Full control over the app — saved for you only', themes: 'Appearance', version: 'Version',
    vibrate_adhan: 'Vibrate with adhan', play_surah: 'Play surah'
  };
  window._appLang = 'ar'; try { localStorage.setItem('nq_lang','ar'); } catch(e){}
  function applyI18n() {
    document.querySelectorAll('[data-i18n]').forEach(function (e) {
      if (e.dataset.ar === undefined) e.dataset.ar = e.textContent;
      var k = e.getAttribute('data-i18n');
      e.textContent = (window._appLang === 'en' && EN[k]) ? EN[k] : e.dataset.ar;
    });
    // أزرار القائمة الجانبية
    var navMap = {
      'nav-home': ['🏠 الرئيسية', '🏠 Home'],
      'nav-mushaf': ['📖 المصحف', '📖 Mushaf'],
      'nav-prayer': ['🕌 الصلاة والأذان', '🕌 Prayer & Adhan'],
      'nav-wird': ['🌅 الأذكار والورد', '🌅 Daily Wird'],
      'nav-hisn': ['🛡 حصن المسلم', '🛡 Fortress of Muslim'],
      'nav-search': ['🔍 بحث في القرآن', '🔍 Quran Search'],
      'nav-khatma': ['📖 خطة الختمة', '📖 Khatma Plan'],
      'nav-hifz': ['🧠 وضع الحفظ', '🧠 Hifz Mode'],
      'nav-tajweed': ['🌈 تلوين التجويد', '🌈 Tajweed Colors'],
      'nav-favorites': ['⭐ المفضلة', '⭐ Favorites'],
      'nav-notes': ['📝 ملاحظاتي', '📝 My Notes'],
      'nav-ai': ['🤖 سؤال وجواب', '🤖 Q&A'],
      'nav-seerah': ['🌙 السيرة النبوية', '🌙 Seerah'],
      'nav-prophets2': ['👳 قصص الأنبياء', '👳 Prophets Stories'],
      'nav-fiqh': ['📋 الفقه الميسّر', '📋 Easy Fiqh'],
      'nav-asma': ['✨ أسماء الله الحسنى', '✨ Names of Allah'],
      'nav-tracker': ['☑️ متابعة الصلوات', '☑️ Prayer Tracker'],
      'nav-hijri': ['📅 التقويم الهجري', '📅 Hijri Calendar'],
      'nav-zakat': ['💰 حاسبة الزكاة', '💰 Zakat Calculator'],
      'nav-mosques': ['🗺️ المساجد القريبة', '🗺️ Nearby Mosques'],
      'nav-ramadan': ['🌙 وضع رمضان', '🌙 Ramadan Mode'],
      'nav-stats': ['📊 إحصائياتي', '📊 My Stats'],
      'nav-profile': ['👤 ملفي الشخصي', '👤 Profile'],
      'nav-community': ['👥 المجتمع', '👥 Community'],
      'nav-site-settings': ['⚙️ الإعدادات', '⚙️ Settings']
    };
    Object.keys(navMap).forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.textContent = window._appLang === 'en' ? navMap[id][1] : navMap[id][0];
    });
    document.documentElement.lang = window._appLang;
    document.documentElement.dir = window._appLang === 'en' ? 'ltr' : 'rtl';
    document.body.classList.toggle('lang-en', window._appLang === 'en');
    document.body.classList.toggle('lang-ar', window._appLang !== 'en');
  }
  window.changeAppLanguage = function (l) {
    window._appLang = 'ar'; lsSet('nq_lang', 'ar');
    document.documentElement.lang = window._appLang; applyI18n();
    try {
      var pg = parseInt(localStorage.getItem('nq_mpage')||'1',10)||1;
      if (window.HudaMushaf && HudaMushaf.goPage) HudaMushaf.goPage(pg);
      else if (window.HudaMushaf && HudaMushaf.loadPage) HudaMushaf.loadPage(pg);
    } catch (e) {}
    toast(window._appLang === 'en' ? 'Language: English (partial)' : 'اللغة: العربية');
  };

  /* ═════════════ 9) التقويم الهجري: تصحيح اليوم ═════════════ */
  function hijriOff() { var v = parseInt(lsGet('nq_hijri_off', '0'), 10); return isNaN(v) ? 0 : Math.max(-2, Math.min(2, v)); }
  if (typeof window.gregToHijri === 'function' && !window.gregToHijri._wrapped) {
    var _g2h = window.gregToHijri;
    window.gregToHijri = function (y, m, d) {
      var off = hijriOff(); if (!off) return _g2h(y, m, d);
      var dt = new Date(y, m - 1, d + off); return _g2h(dt.getFullYear(), dt.getMonth() + 1, dt.getDate());
    };
    window.gregToHijri._wrapped = true;
  }
  window.changeHijriOffset = function (d) {
    var v = Math.max(-2, Math.min(2, hijriOff() + (+d))); lsSet('nq_hijri_off', String(v));
    var l = $('ss-hijri-offset-lbl'); if (l) l.textContent = (v > 0 ? '+' : '') + v;
    if (typeof updateDates === 'function') try { updateDates(); } catch (e) {}
  };

  /* ═════════════ 10) إعدادات التطبيق ═════════════ */
  window.togglePreReminderSetting = function () {
    var on = lsGet('nq_pre15', '1') !== '0'; lsSet('nq_pre15', on ? '0' : '1');
    if (typeof window.scheduleAllNotifs === 'function' && window.Notification && Notification.permission === 'granted') window.scheduleAllNotifs();
    toast(on ? 'أُلغي التذكير قبل الصلاة' : 'سيصلك تنبيه قبل كل صلاة بـ ١٥ دقيقة');
  };
  window.clearAllData = function () {
    if (!confirm('سيُحذف كل ما حفظته (المفضلة، الملاحظات، الإعدادات، التقدم…). هل أنت متأكد؟')) return;
    try {
      Object.keys(localStorage).forEach(function (k) { if (/^(nq_|_nq_|huda_|_huda_|hq_)/.test(k)) localStorage.removeItem(k); });
    } catch (e) {}
    if (window.caches) caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return /^huda-api/.test(k); }).map(function (k) { return caches.delete(k); })); }).catch(function () {});
    toast('🗑️ تم المسح'); setTimeout(function () { location.reload(); }, 600);
  };
  window.buildSiteSettings = function () {
    var ls = $('ss-lang-sel'); if (ls) ls.value = window._appLang;
    if (typeof applyTheme === 'function') applyTheme(_currentTheme);
    if (typeof _fontSize !== 'undefined') {
      var pct = Math.round(((_fontSize - 12) / 20) * 100);
      var fb = $('ss-font-bar'); if (fb) { fb.style.width = pct + '%'; fb.style.height = '100%'; fb.style.background = 'var(--gold)'; if (fb.parentNode) { fb.parentNode.style.cssText += ';flex:1;height:6px;background:rgba(201,168,76,.15);border-radius:3px;overflow:hidden;min-width:70px;'; } }
      var fl = $('ss-font-preview-lbl'); if (fl) fl.textContent = '٪' + toAr(Math.round(_fontSize / 18 * 100));
    }
    var granted = ('Notification' in window) && Notification.permission === 'granted';
    var pb = $('ss-notif-perm-box'), gb = $('ss-notif-granted-box');
    if (pb) pb.style.display = granted ? 'none' : 'block'; if (gb) gb.style.display = granted ? 'block' : 'none';
    var nl = $('ss-notif-list'); if (nl && nl.children.length === 0 && typeof buildNotifs === 'function') { try { var _l = $('notif-list'); if (!_l) { /* الصفحة المستقلة تتولاها buildNotifs */ } } catch (e) {} }
    if (typeof atSettings !== 'undefined') {
      var m = { 'ss-at-auto': atSettings.auto, 'ss-at-fajr': atSettings.fajr, 'ss-at-vib': atSettings.vib, 'ss-at-pre15': lsGet('nq_pre15', '1') !== '0' };
      Object.keys(m).forEach(function (id) { var t = $(id); if (t) t.classList.toggle('on', !!m[id]); });
    }
    var as = $('ss-adhan-sel'); if (as) as.value = lsGet('nq_adhan_idx', '0');
    var cm = $('ss-calc-method'); if (cm) cm.value = lsGet('nq_calc_method', '5');
    var av = $('ss-adhan-vol'); if (av) av.value = lsGet('nq_adhan_vol', '100');
    var ho = $('ss-hijri-offset-lbl'); if (ho) { var v = hijriOff(); ho.textContent = (v > 0 ? '+' : '') + v; }
    applyI18n();
  };

  /* ═════════════ التهيئة عند التحميل ═════════════ */
  function init() {
    var rm = lsGet('nq_reader_mode', 'default'); if (rm !== 'default') window.setReaderMode(rm);
    var qf = lsGet('nq_qfont', 'qfont-m'); window.setQFont(qf);
    if (lsGet('nq_fonttype', 'default') === 'uthmani') window.setFontType('uthmani');
    _gaplessBtns(); applyI18n();
    if (window._appLang === 'en') document.documentElement.lang = 'en';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
