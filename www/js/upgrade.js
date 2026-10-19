/* ════════════════════════════════════════════════════════════
   اختيار القارئ + تحميل الصوت
   • كل القرّاء (الأشهر أولاً) مع بحث
   • بجانب كل قارئ زر تحميل: حفظ للاستماع بدون إنترنت / حفظ ملف MP3 / جزء عمّ / المصحف كاملاً
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function toast(m) { if (typeof showToast === 'function') showToast(m); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function ar(n) { return String(n).replace(/\d/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }); }
  function curId() { try { return localStorage.getItem('nq_rec') || window.readerRec || 'alafasy'; } catch (e) { return window.readerRec || 'alafasy'; } }
  function sName(n) { return (typeof SM !== 'undefined' && SM[n - 1]) ? SM[n - 1].ar : String(n); }

  /* قرّاء إضافيون لهم روابط صوت في الكود لكنهم لم يكونوا في القائمة */
  var EXTRA = [
    /* عبد الرحمن مسعد غير متوفر على سيرفرات mp3quran الرسمية بمصحف كامل — لا يُضاف بصوت خاطئ */
    { id: 'sobhi',  name: 'إسلام صبحي',      country: '🇪🇬 مصر',      style: 'صوت شاب — خشوع وهدوء' },
    { id: 'hazza',  name: 'هزاع البلوشي',    country: '🇴🇲 عُمان',    style: 'صوت عذب هادئ' },
    { id: 'idrees', name: 'إدريس أبكر',      country: '🇸🇩 السودان',  style: 'مرتل — صوت ندي' },
    { id: 'lhdan',  name: 'محمد اللحيدان',   country: '🇸🇦 السعودية', style: 'صوت خاشع' }
  ];
  /* ترتيب الأشهر أولاً */
  var ORDER = ['alafasy', 'sds', 'maher', 'shur', 'minsh', 'hsry', 'basit', 'dosary', 'jbrl', 'rifai', 'shatri', 'bsfr', 'akhdar', 'ayyoub', 'jhn', 'husary_mj'];

  function recs() {
    if (typeof RD === 'undefined') return [];
    EXTRA.forEach(function (x) {
      if (RD.some(function (r) { return r.id === x.id; })) return;
      var fb = (typeof AUDIO_FALLBACKS !== 'undefined' && AUDIO_FALLBACKS[x.id]) || [];
      var base = (fb[0] || '').trim();
      if (!base) return; /* لا تُضف قارئاً بدون مصدر صوت حقيقي */
      RD.push({ id: x.id, name: x.name, en: '', country: x.country, style: x.style, ini: x.name[0], base: base, bio: '' });
    });
    return RD.slice().sort(function (a, b) {
      var ia = ORDER.indexOf(a.id), ib = ORDER.indexOf(b.id); ia = ia < 0 ? 99 : ia; ib = ib < 0 ? 99 : ib; return ia - ib;
    });
  }
function inits(n) { var p = String(n || '').trim().split(/\s+/).filter(Boolean); if (!p.length) return ''; var last = p[p.length - 1].replace(/^ال/, ''); return p.length === 1 ? p[0][0] : p[0][0] + (last[0] || ''); }
  function norm(s) { return window.HudaQuran ? HudaQuran.norm(s) : String(s || '').trim(); }

  var abort = null, busyKey = '';
  function surahSel() { var s = $('rcp-s'); return s ? +s.value : 1; }
  function surahNow() { var c = window.HudaMushaf && HudaMushaf.currentAyah && HudaMushaf.currentAyah(); return c ? c.s : (window.currentSurahN || 1); }

  function dlBtn(r, n) {
    var done = window.HudaAudio && HudaAudio.has(r.id, n), busy = busyKey && busyKey.indexOf(r.id + ':') === 0;
    var cls = 'rcp-dl' + (done ? ' done' : '') + (busy ? ' busy' : '');
    var inner = busy ? '<svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="16" fill="none" stroke="var(--brd)" stroke-width="2.5"/><circle class="rcp-ring" cx="18" cy="18" r="16" fill="none" stroke="var(--gold)" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="100.5" stroke-dashoffset="100.5"/></svg><span class="rcp-pc">…</span>' : (done ? '✓' : '⬇');
    return '<button class="' + cls + '" data-id="' + r.id + '" aria-label="' + (done ? 'محفوظ — خيارات ' : 'تحميل صوت ') + esc(r.name) + '">' + inner + '</button>';
  }
  function build() {
    var q = norm($('rcp-q') ? $('rcp-q').value : ''), cur = curId(), n = surahSel();
    var tab = window._rcpTab || 'sheikh';
    var html = '';

    // تبويبان منفصلان
    html += '<div class="rcp-tabs">' +
      '<button type="button" class="rcp-tab' + (tab==='sheikh'?' on':'') + '" data-tab="sheikh">🎙 الشيوخ</button>' +
      '<button type="button" class="rcp-tab' + (tab==='qiraat'?' on':'') + '" data-tab="qiraat">📖 القراءات العشر</button>' +
      '</div>';

    if (tab === 'qiraat') {
      var QL = window.QIRAAT_LIST || [];
      var curQ = '';
      try { curQ = localStorage.getItem('nq_qiraat') || ''; } catch(e){}
      var filtered = QL.filter(function(x){
        return !q || norm(x.name).indexOf(q)>=0 || norm(x.reader).indexOf(q)>=0;
      });
      if (!filtered.length) {
        html += '<div style="text-align:center;color:var(--tm);padding:2rem">لا نتائج</div>';
      } else {
        var last = '';
        filtered.forEach(function(x){
          if (x.reader !== last) {
            html += '<div class="rcp-sec">' + esc(x.reader) + '</div>';
            last = x.reader;
          }
          var on = (x.id === curQ) ? ' on' : '';
          html += '<div class="rcp-row rcp-qrow' + on + '" data-qid="' + x.id + '">' +
            '<button class="rcp-pick rcp-qpick" data-qid="' + x.id + '" aria-label="اختيار ' + esc(x.name) + '">' +
            '<span class="rcp-av">ق</span>' +
            '<span class="rcp-tx"><b>' + esc(x.name) + '</b><small>' + esc(x.reader) + (x.mode==='ayah'?' · آية بآية':' · سورة') + '</small></span>' +
            '<span class="rcp-ck">' + (x.id === curQ ? '✓' : '') + '</span></button></div>';
        });
      }
    } else {
      var list = recs().filter(function (r) { return !q || norm(r.name).indexOf(q) >= 0 || norm(r.country || '').indexOf(q) >= 0 || norm(r.style || '').indexOf(q) >= 0; });
      if (!list.length) {
        html += '<div style="text-align:center;color:var(--tm);padding:2rem">لا نتائج</div>';
      } else {
        list.forEach(function (r) {
          var cnt = window.HudaAudio ? HudaAudio.count(r.id) : 0;
          var ini = esc(inits(r.name));
          var av = r.img ? '<img src="' + esc(r.img) + '" alt="" data-i="' + ini + '" onerror="this.parentNode.textContent=this.dataset.i">' : '';
          html += '<div class="rcp-row' + (r.id === cur ? ' on' : '') + '" data-id="' + r.id + '">' +
            '<button class="rcp-pick" data-id="' + r.id + '" aria-label="اختيار ' + esc(r.name) + '">' +
            '<span class="rcp-av">' + (av || ini) + '</span>' +
            '<span class="rcp-tx"><b>' + esc(r.name) + '</b><small>' + esc(r.style || '') + ' · ' + esc(r.country || '') + '</small>' + (cnt ? '<em>⬇ محفوظ ' + ar(cnt) + ' سورة</em>' : '') + '</span>' +
            '<span class="rcp-ck">' + (r.id === cur ? '✓' : '') + '</span></button>' + dlBtn(r, n) + '</div>';
        });
      }
    }

    $('rcp-list').innerHTML = html;

    // ربط التبويبات
    $('rcp-list').querySelectorAll('.rcp-tab').forEach(function(btn){
      btn.onclick = function(e){
        e.stopPropagation();
        window._rcpTab = btn.getAttribute('data-tab') || 'sheikh';
        build();
      };
    });

    var u = $('rcp-used'); if (u && window.HudaAudio) { var b = HudaAudio.usedBytes(); u.firstChild.textContent = b ? 'المساحة المستخدمة للتلاوات المحفوظة: ' + HudaAudio.fmtMB(b) : 'لا توجد تلاوات محفوظة بعد'; u.lastChild.style.display = b ? '' : 'none'; }
  }
  function setProgress(id, frac, txt) {
    var btn = document.querySelector('.rcp-row[data-id="' + id + '"] .rcp-dl'); if (!btn) return;
    var ring = btn.querySelector('.rcp-ring'), pc = btn.querySelector('.rcp-pc');
    if (ring) ring.style.strokeDashoffset = (100.5 * (1 - Math.max(0, Math.min(1, frac)))).toFixed(1);
    if (pc) pc.textContent = txt != null ? txt : Math.round(frac * 100) + '%';
  }

  /* ───────── التنفيذ ───────── */
  function closeMenus() { document.querySelectorAll('.rcp-menu').forEach(function (m) { m.remove(); }); }
  function saveOffline(id, n) {
    if (busyKey) { toast('انتظر انتهاء التحميل الحالي'); return; }
    abort = window.AbortController ? new AbortController() : null; busyKey = id + ':' + n; build();
    toast('بدأ تحميل سورة ' + sName(n) + '…');
    HudaAudio.download(id, n, function (got, total) { setProgress(id, total ? got / total : 0, total ? null : (got / 1048576).toFixed(0) + 'M'); }, abort && abort.signal)
      .then(function (sz) { toast('✅ تم الحفظ (' + HudaAudio.fmtMB(sz) + ') — يعمل بدون إنترنت'); })
      .catch(function (e) { if (e && e.name !== 'AbortError') toast('⚠ ' + (e && e.message ? e.message : 'تعذّر التحميل')); })
      .then(function () { busyKey = ''; abort = null; build(); });
  }
  function saveFile(id, n) {
    toast('جارٍ تجهيز الملف…');
    HudaAudio.saveFile(id, n).then(function (ok) { toast(ok ? '✅ تم حفظ الملف' : 'فُتح الملف في صفحة جديدة — احفظه من هناك'); }).catch(function () { toast('⚠ تعذّر التحميل'); });
  }
  function juzAmma(id) {
    if (busyKey) { toast('انتظر انتهاء التحميل الحالي'); return; }
    if (!confirm('تحميل جزء عمّ كاملاً (٣٧ سورة) لهذا القارئ؟ قد يستهلك عدة عشرات من الميغابايت.')) return;
    abort = window.AbortController ? new AbortController() : null; var n = 78, ok = 0, bar = $('rcp-batch');
    busyKey = id + ':batch'; build();
    bar.hidden = false; bar.innerHTML = '<span id="rcp-bt">جزء عمّ: ٠/٣٧</span><button id="rcp-bx">إلغاء</button>';
    $('rcp-bx').onclick = function () { if (abort) abort.abort(); };
    (function next() {
      if (n > 114 || (abort && abort.signal.aborted)) { bar.hidden = true; busyKey = ''; abort = null; build(); toast('تم حفظ ' + ar(ok) + ' سورة من جزء عمّ'); return; }
      $('rcp-bt').textContent = 'جزء عمّ: ' + ar(n - 78) + '/٣٧ — سورة ' + sName(n);
      var p = HudaAudio.has(id, n) ? Promise.resolve(1) : HudaAudio.download(id, n, function (g, t) { setProgress(id, ((n - 78) + (t ? g / t : 0)) / 37, ar(n - 78)); }, abort && abort.signal);
      p.then(function () { ok++; n++; next(); }).catch(function (e) { if (e && e.name === 'AbortError') { n = 999; } else { n++; } next(); });
    })();
  }

  function fullMushaf(id) {
    if (busyKey) { toast('انتظر انتهاء التحميل الحالي'); return; }
    if (!confirm('تحميل المصحف الصوتي كاملاً (١١٤ سورة) لهذا القارئ؟\nقد يستهلك مئات الميغابايت ويأخذ وقتاً طويلاً.')) return;
    abort = window.AbortController ? new AbortController() : null;
    var n = 1, ok = 0, bar = $('rcp-batch');
    busyKey = id + ':full';
    build();
    bar.hidden = false;
    bar.innerHTML = '<span id="rcp-bt">المصحف: ٠/١١٤</span><button id="rcp-bx">إلغاء</button>';
    $('rcp-bx').onclick = function () { if (abort) abort.abort(); };
    (function next() {
      if (n > 114 || (abort && abort.signal.aborted)) {
        bar.hidden = true; busyKey = ''; abort = null; build();
        toast('تم حفظ ' + ar(ok) + ' سورة من المصحف الكامل');
        return;
      }
      $('rcp-bt').textContent = 'المصحف: ' + ar(n - 1) + '/١١٤ — سورة ' + sName(n);
      var p = HudaAudio.has(id, n)
        ? Promise.resolve(1)
        : HudaAudio.download(id, n, function (g, t) {
            setProgress(id, ((n - 1) + (t ? g / t : 0)) / 114, ar(n - 1));
          }, abort && abort.signal);
      p.then(function () { ok++; }).catch(function () {}).then(function () { n++; next(); });
    })();
  }

  function showMenu(id) {
    closeMenus(); var row = document.querySelector('.rcp-row[data-id="' + id + '"]'); if (!row) return;
    var n = surahSel(), done = HudaAudio.has(id, n), m = document.createElement('div'); m.className = 'rcp-menu'; m.setAttribute('role', 'menu');
    m.innerHTML =
      (done ? '<button data-act="del" class="rcp-bad">🗑 حذف التحميل المحفوظ (سورة ' + esc(sName(n)) + ')</button>'
            : '<button data-act="off">⬇ حفظ سورة ' + esc(sName(n)) + ' للاستماع بدون إنترنت</button>') +
      '<button data-act="juz">📦 تحميل جزء عمّ كاملاً (٣٧ سورة)</button>' +
      '<button data-act="full">📖 تحميل المصحف الصوتي كاملاً (١١٤ سورة)</button>';
    row.appendChild(m);
    m.onclick = function (e) {
      var b = e.target.closest('button'); if (!b) return; var a = b.dataset.act; closeMenus();
      if (a === 'off') saveOffline(id, n); else if (a === 'juz') juzAmma(id); else if (a === 'full') fullMushaf(id);
      else if (a === 'del') HudaAudio.remove(id, n).then(function () { toast('تم الحذف'); build(); });
    };
  }

  function open() {
    if (!$('rd-rec')) {
      var d = document.createElement('div'); d.className = 'shbg'; d.id = 'rd-rec';
      d.onclick = function (e) { if (e.target === d) close(); };
      var opts = ''; if (typeof SM !== 'undefined') for (var i = 0; i < SM.length; i++) opts += '<option value="' + (i + 1) + '">' + ar(i + 1) + ' — ' + esc(SM[i].ar) + '</option>';
      d.innerHTML = '<div class="sh" role="dialog" aria-label="اختيار القارئ">' +
        '<div class="rcp-top"><h2>القراء والقراءات</h2><button class="ib" aria-label="إغلاق" id="rcp-x">✕</button></div>' +
        '<input class="rcp-q" id="rcp-q" placeholder="ابحث عن قارئ…" aria-label="بحث عن قارئ">' +
        '<label class="rcp-sl">سورة التحميل <select id="rcp-s">' + opts + '</select></label>' +
        '<div class="rcp-used" id="rcp-used"><span></span><button id="rcp-clr">مسح الكل</button></div>' +
        '<div class="rcp-batch" id="rcp-batch" hidden></div>' +
        '<div id="rcp-list" class="rcp-list"></div></div>';
      document.body.appendChild(d);
      $('rcp-x').onclick = close; $('rcp-q').oninput = build; $('rcp-s').onchange = function () { closeMenus(); build(); };
      $('rcp-clr').onclick = function () { if (confirm('حذف كل التلاوات المحفوظة؟')) HudaAudio.clearAll().then(function () { toast('تم المسح'); build(); }); };
      $('rcp-list').addEventListener('click', function (e) {
        var p = e.target.closest('.rcp-pick'), dl = e.target.closest('.rcp-dl');
        if (dl) { e.stopPropagation(); if (busyKey) { if (abort && confirm('إلغاء التحميل الجاري؟')) abort.abort(); return; } showMenu(dl.dataset.id); return; }
        if (p) {
          closeMenus();
          // اختيار قراءة من القراءات العشر
          if (p.classList.contains('rcp-qpick') || p.dataset.qid) {
            var qid = p.dataset.qid;
            if (typeof window.setQiraat === 'function') window.setQiraat(qid);
            else toast('جاري تفعيل الرواية…');
            build();
            return;
          }
          var id = p.dataset.id, r = recs().filter(function (x) { return x.id === id; })[0];
          if (typeof setRec === 'function') {
            setRec(id, r ? r.name : id);
          } else {
            try { localStorage.setItem('nq_rec', id); } catch (er) {}
            window.readerRec = id;
            var s = 1;
            try {
              var st = (typeof G_STATE === 'function') ? G_STATE() : null;
              if (st && st.s) s = st.s;
              var first = document.querySelector('#mp-in .ay[data-s]');
              if (first) s = +first.getAttribute('data-s') || s;
            } catch (er2) {}
            if (typeof window.forcePlaySurah === 'function') window.forcePlaySurah(s, id);
            else if (typeof playSurahContinuous === 'function') playSurahContinuous(s);
            else if (typeof playAyahGapless === 'function') playAyahGapless(1, s);
          }
          try { document.dispatchEvent(new CustomEvent('huda:rec')); } catch (er) {}
          build();
          // setRec already toasts + plays
          if (typeof setRec !== 'function') toast('▶ ' + (r ? r.name : id));
        }
      });
      document.addEventListener('click', function (e) { if (!e.target.closest('.rcp-menu,.rcp-dl')) closeMenus(); });
    }
    $('rcp-q').value = ''; $('rcp-s').value = surahNow(); closeMenus(); build();
    $('rd-rec').classList.add('on');
    var on = document.querySelector('#rcp-list .rcp-row.on'); if (on && on.scrollIntoView) on.scrollIntoView({ block: 'center' });
  }
  function close() { var d = $('rd-rec'); if (d) d.classList.remove('on'); closeMenus(); }

  function init() {
    recs();
    var st = document.querySelector('#rd-set .sh');
    if (st && !$('st-rec')) {
      var row = document.createElement('div'); row.className = 'st-row'; row.id = 'st-rec';
      row.innerHTML = '<span>القارئ</span><button class="mb" type="button">اختيار القارئ وتحميل الصوت</button>';
      row.querySelector('button').onclick = function () { if (window.HudaMushaf) HudaMushaf.closeSheets(); open(); };
      st.insertBefore(row, st.children[1] || null);
    }
    window.HudaRec = { open: open, close: close };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
