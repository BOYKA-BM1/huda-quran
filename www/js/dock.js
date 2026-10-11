/* ════════════════════════════════════════════════════════════
   HudaDock — مشغّل صوت عائم في القارئ (كبسولة بنصف دائرة على الطرفين)
   • خامل:  [ القارئ ▾ ]  [ ▶ استماع ]
   • نشط:   [ ⏮ ] [ ⏸ كبير ] [ ⏭ ]  السورة · الآية · القارئ  [ ⋯ ]
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function ar(n) { return String(n).replace(/\d/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }); }
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } }
  function toast(m) { if (typeof showToast === 'function') showToast(m); }
  function ic(name) { return '<svg class="ic" aria-hidden="true" viewBox="0 0 24 24"><use href="#i-' + name + '"/></svg>'; }
  function curRec() { return lsGet('nq_rec', '') || window.readerRec || 'alafasy'; }
  function recObj() { var id = curRec(); return (typeof RD !== 'undefined' ? RD.filter(function (r) { return r.id === id; })[0] : null) || { id: id, name: id }; }
  function shortName(n) {
    var p = String(n || '').trim().split(/\s+/); if (p.length <= 2) return n;
    if (p[0] === 'عبد' || p[0] === 'أبو') return p.length === 3 ? p.join(' ') : p.slice(0, 2).join(' ');
    return p[0] + ' ' + p[p.length - 1];
  }
function inits(n) { var p = String(n || '').trim().split(/\s+/).filter(Boolean); if (!p.length) return ''; var last = p[p.length - 1].replace(/^ال/, ''); return p.length === 1 ? p[0][0] : p[0][0] + (last[0] || ''); }
  function sName(n) { return (typeof SM !== 'undefined' && SM[n - 1]) ? SM[n - 1].ar : ''; }
  var RATES = [0.75, 1, 1.25, 1.5, 2];
  var D = null, menuOpen = false;

  function build() {
    D = el('div', 'dk idle'); D.id = 'rd-dock'; D.setAttribute('role', 'region'); D.setAttribute('aria-label', 'مشغّل التلاوة');
    D.innerHTML =
            '<button class="dk-go" id="dk-go" aria-label="تشغيل التلاوة">' + ic('play') + '<span>استماع</span></button>' +
'<button class="dk-rec" id="dk-rec" aria-label="اختيار القارئ"><span class="dk-av" id="dk-av"></span><span class="dk-rn" id="dk-rn"></span><span class="dk-ch">▾</span></button>' +
      '<button class="dk-sm dk-more0" id="dk-more0" aria-label="المزيد" aria-expanded="false">' + ic('more') + '</button>' +
      '<div class="dk-act">' +
        '<button class="dk-info" id="dk-info" aria-label="اختيار القارئ"><b id="dk-s">—</b><small id="dk-a"></small></button>' +
        '<button class="dk-sm" id="dk-prev" aria-label="الآية السابقة">' + ic('prev') + '</button>' +
        '<button class="dk-pp" id="dk-pp" aria-label="إيقاف مؤقت">' + ic('pause') + '</button>' +
        '<button class="dk-sm" id="dk-next" aria-label="الآية التالية">' + ic('next') + '</button>' +
        '<button class="dk-sm" id="dk-more" aria-label="المزيد" aria-expanded="false">' + ic('more') + '</button>' +
      '</div>';
    document.body.appendChild(D);
    var menu = el('div', 'dk-menu'); menu.id = 'dk-menu'; menu.hidden = true;
    menu.innerHTML =
      '<button id="dk-rate"><span>السرعة</span><b id="dk-rv">١×</b></button>' +
      '<button id="dk-rep"><span>تكرار السورة</span><b id="dk-rpv">متوقف</b></button>' +
      '<button id="dk-bm"><span>علامة مرجعية للصفحة</span><b id="dk-bmv">إضافة</b></button>' +
      '<button id="dk-share"><span>مشاركة الآية</span><b>↗</b></button>' +
      '<button id="dk-rc"><span>تغيير القارئ / تحميل</span><b>‹</b></button>' +
      '<button id="dk-stop" class="dk-danger"><span>إيقاف وإغلاق</span><b>■</b></button>';
    document.body.appendChild(menu);

    $('dk-go').onclick = function () {
      var au = document.getElementById('aud');
      if (au && au.src && !au.ended && (window.G_ACTIVE && G_ACTIVE() || au.currentTime > 0.15)) {
        if (typeof togPlay === 'function') togPlay();
        else if (window.HudaMushaf && HudaMushaf.play) HudaMushaf.play();
        return;
      }
      if (window.HudaMushaf && HudaMushaf.play) HudaMushaf.play();
      else if (typeof playSurahContinuous === 'function') playSurahContinuous();
    };
    $('dk-pp').onclick = function () { if (typeof togPlay === 'function') togPlay(); else if (window.__hudaTogPlay) __hudaTogPlay(); };
    $('dk-next').onclick = function () { if (typeof nextGaplessAyah === 'function' && window.G_ACTIVE && G_ACTIVE()) nextGaplessAyah(); else if (typeof nextA === 'function') nextA(); };
    $('dk-prev').onclick = function () { if (typeof prevGaplessAyah === 'function' && window.G_ACTIVE && G_ACTIVE()) prevGaplessAyah(); else if (typeof prevA === 'function') prevA(); };
    $('dk-rec').onclick = $('dk-info').onclick = $('dk-rc').onclick = function () { closeMenu(); if (window.HudaRec) HudaRec.open(); };
    $('dk-more').onclick = $('dk-more0').onclick = function (e) { e.stopPropagation(); menuOpen ? closeMenu() : openMenu(); };
        $('dk-bm').onclick = function () { if (window.HudaMushaf) HudaMushaf.toggleBm(); setTimeout(update, 60); };
    $('dk-share').onclick = function () { closeMenu(); if (window.HudaMushaf) HudaMushaf.share(); };
    $('dk-rate').onclick = function () { var cur = window.G_STATE ? G_STATE().rate : 1, i = RATES.indexOf(cur); var n = RATES[(i + 1) % RATES.length]; if (window.G_SETRATE) G_SETRATE(n); toast('السرعة ' + ar(n) + '×'); update(); };
    $('dk-rep').onclick = function () { if (typeof togRepeat === 'function') togRepeat(); else if (typeof toggleRepMode === 'function') toggleRepMode(); update(); };
    $('dk-stop').onclick = function () { closeMenu(); if (window.G_STOP) G_STOP(); update(); };
    document.addEventListener('click', function (e) { if (menuOpen && !e.target.closest('#dk-menu,#dk-more,#dk-more0')) closeMenu(); });
  }
  function openMenu() { var m = $('dk-menu'); m.hidden = false; menuOpen = true; $('dk-more').setAttribute('aria-expanded', 'true'); update(); }
  function closeMenu() { var m = $('dk-menu'); if (m) m.hidden = true; menuOpen = false; ['dk-more', 'dk-more0'].forEach(function (i) { var b = $(i); if (b) b.setAttribute('aria-expanded', 'false'); }); }

  function surahModeState() {
    var a = document.getElementById('aud'); if (!a) return null;
    var has = a.src && !a.ended && (typeof curSurahN !== 'undefined' && curSurahN > 0) && document.getElementById('gplayer') && document.getElementById('gplayer').classList.contains('show');
    return has ? { playing: !a.paused, s: curSurahN } : null;
  }
  function update() {
    if (!D) return; var g = window.G_STATE ? G_STATE() : { active: false }, sm = surahModeState();
    var sess = !!(window.G_ACTIVE && G_ACTIVE());
    var active = !!(g.active || g.playing || sess || sm);
    var playing = g.playing || !!(sm && sm.playing) || (sess && document.getElementById('aud') && !document.getElementById('aud').paused);
    D.classList.toggle('idle', !active); D.classList.toggle('act', active); D.classList.toggle('playing', active && playing);
    var r = recObj(); var rn = shortName(r.name);
    $('dk-rn').textContent = rn; $('dk-av').textContent = inits(r.name);
    if (active) {
      var s = g.active ? g.s : sm.s; $('dk-s').textContent = 'سورة ' + sName(s);
      $('dk-a').textContent = (g.active ? 'الآية ' + ar(g.a) + ' · ' : 'تشغيل متواصل · ') + rn;
      $('dk-pp').innerHTML = ic(playing ? 'pause' : 'play'); $('dk-pp').setAttribute('aria-label', playing ? 'إيقاف مؤقت' : 'متابعة');
    }
    if (menuOpen) {
      $('dk-rv').textContent = ar(g.rate || 1) + '×'; $('dk-rpv').textContent = (typeof isRepeat !== 'undefined' && isRepeat) ? 'يعمل' : 'متوقف';
      if (window.HudaMushaf) { $('dk-av2').textContent = HudaMushaf.isAuto() ? 'يعمل' : 'متوقف'; $('dk-bmv').textContent = HudaMushaf.isBm() ? 'إزالة' : 'إضافة'; }
    }
  }
  window.HudaDock = { update: update };

  function init() {
    build(); update();
    document.addEventListener('huda:player', update);
    var a = document.getElementById('aud'); if (a) ['play', 'pause', 'ended', 'loadstart', 'emptied'].forEach(function (ev) { a.addEventListener(ev, update); });
    window.addEventListener('storage', update);
    document.addEventListener('huda:rec', update);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
