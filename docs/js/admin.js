/**
 * لوحة تحكم مخفية — الرمز: 13/4/2024 في بحث القرآن
 */
(function () {
  'use strict';
  var SECRET = '13/4/2024';
  var KEY = 'huda_admin_cfg_v1';
  var DEFAULTS = {
    siteName: 'Huda Al Quran', maintenance: false,
    maintenanceMsg: 'الموقع قيد الصيانة، نعود قريبًا.',
    showAi: true, showAdhan: true, showTasbeeh: true, showNawawi: true, showHifz: true,
    welcomeMsg: '', customCss: '', notes: ''
  };

  function load() {
    try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(KEY) || '{}')); }
    catch (e) { return Object.assign({}, DEFAULTS); }
  }
  function save(cfg) { try { localStorage.setItem(KEY, JSON.stringify(cfg)); } catch (e) {} }
  function normalize(s) { return String(s || '').trim().replace(/\s+/g, ''); }
  function isSecret(val) {
    var v = normalize(val);
    return v === SECRET || v === '13/04/2024' || v === '13-4-2024' || v === '13-04-2024';
  }
  function tryUnlock(val) {
    if (!isSecret(val)) return false;
    try { sessionStorage.setItem('huda_admin_ok', '1'); } catch (e) {}
    openAdmin();
    return true;
  }
  function openAdmin() {
    if (typeof window.SP === 'function') try { window.SP('admin'); } catch (e) {}
    var page = document.getElementById('page-admin');
    if (page) {
      document.querySelectorAll('.pg').forEach(function (el) { el.classList.remove('on'); });
      page.classList.add('on');
    }
    try { var sch = document.getElementById('rd-sch'); if (sch) sch.classList.remove('on'); } catch (e) {}
    renderPanel();
  }
  function logout() {
    try { sessionStorage.removeItem('huda_admin_ok'); } catch (e) {}
    if (typeof window.SP === 'function') window.SP('home');
  }
  function applyConfig(cfg) {
    document.body.classList.toggle('adm-maintenance', !!cfg.maintenance);
    var ban = document.getElementById('adm-maint-banner');
    if (cfg.maintenance) {
      if (!ban) {
        ban = document.createElement('div');
        ban.id = 'adm-maint-banner';
        ban.className = 'adm-maint-banner';
        document.body.appendChild(ban);
      }
      ban.textContent = cfg.maintenanceMsg || DEFAULTS.maintenanceMsg;
      ban.style.display = '';
    } else if (ban) ban.style.display = 'none';

    ['nav-ai','nav-prayer','nav-hifz'].forEach(function (id, i) {
      var show = [cfg.showAi, cfg.showAdhan, cfg.showHifz][i];
      var el = document.getElementById(id);
      if (el) el.style.display = show ? '' : 'none';
    });
    document.querySelectorAll('.hv-svc button').forEach(function (btn) {
      var oc = btn.getAttribute('onclick') || '';
      if (oc.indexOf("SP('ai')") !== -1) btn.style.display = cfg.showAi ? '' : 'none';
      if (oc.indexOf("SP('tasbeeh')") !== -1) btn.style.display = cfg.showTasbeeh ? '' : 'none';
      if (oc.indexOf("SP('nawawi')") !== -1) btn.style.display = cfg.showNawawi ? '' : 'none';
      if (oc.indexOf("SP('hifz')") !== -1) btn.style.display = cfg.showHifz ? '' : 'none';
    });
    var st = document.getElementById('adm-custom-style');
    if (cfg.customCss) {
      if (!st) { st = document.createElement('style'); st.id = 'adm-custom-style'; document.head.appendChild(st); }
      st.textContent = cfg.customCss;
    } else if (st) st.textContent = '';
    if (cfg.siteName) try { document.title = cfg.siteName; } catch (e) {}
  }
  function field(label, inner) {
    return '<label class="adm-field"><span>' + label + '</span>' + inner + '</label>';
  }
  function toggleRow(id, label, on) {
    return '<label class="adm-toggle"><span>' + label + '</span><input type="checkbox" id="' + id + '"' + (on ? ' checked' : '') + '/></label>';
  }
  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }
  function val(id) { var el = document.getElementById(id); return el ? el.value : ''; }
  function chk(id) { var el = document.getElementById(id); return !!(el && el.checked); }

  function renderPanel() {
    var root = document.getElementById('adm-panels');
    if (!root) return;
    var cfg = load();
    root.innerHTML =
      '<section class="adm-card"><h3>⚙️ إعدادات عامة</h3>' +
      field('اسم التطبيق', '<input id="adm-siteName" type="text" value="' + esc(cfg.siteName) + '"/>') +
      field('وضع الصيانة', '<select id="adm-maint"><option value="0"' + (!cfg.maintenance ? ' selected' : '') + '>متوقف</option><option value="1"' + (cfg.maintenance ? ' selected' : '') + '>مفعّل</option></select>') +
      field('رسالة الصيانة', '<input id="adm-maintMsg" type="text" value="' + esc(cfg.maintenanceMsg) + '"/>') +
      '</section>' +
      '<section class="adm-card"><h3>🧩 الأقسام</h3>' +
      toggleRow('adm-showAi', 'المساعد الذكي', cfg.showAi) +
      toggleRow('adm-showAdhan', 'الصلاة والأذان', cfg.showAdhan) +
      toggleRow('adm-showTasbeeh', 'المسبحة', cfg.showTasbeeh) +
      toggleRow('adm-showNawawi', 'الأربعون النووية', cfg.showNawawi) +
      toggleRow('adm-showHifz', 'وضع الحفظ', cfg.showHifz) +
      '</section>' +
      '<section class="adm-card adm-books-card"><h3>📚 إدارة الكتب</h3>' +
      '<div class="adm-bk-form">' +
      field('عنوان الكتاب', '<input id="adm-bk-title" type="text" placeholder="مثال: أنت تسأل والإسلام يجيب"/>') +
      field('المؤلف', '<input id="adm-bk-author" type="text" placeholder="اسم المؤلف"/>') +
      field('التصنيف', '<input id="adm-bk-cat" type="text" placeholder="عقيدة / فقه / فتاوى..."/>') +
      '<div class="adm-upload-row">' +
      '<label class="adm-upload-box" for="adm-bk-cover">' +
      '<span class="adm-upload-icon">🖼️</span><span class="adm-upload-title">صورة الغلاف</span>' +
      '<span class="adm-upload-hint" id="adm-cover-hint">اضغط لاختيار صورة</span>' +
      '<input id="adm-bk-cover" type="file" accept="image/*" hidden/>' +
      '</label>' +
      '<label class="adm-upload-box adm-upload-pdf" for="adm-bk-pdf">' +
      '<span class="adm-upload-icon">📄</span><span class="adm-upload-title">ملف PDF</span>' +
      '<span class="adm-upload-hint" id="adm-pdf-hint">اضغط لرفع الكتاب كاملًا</span>' +
      '<input id="adm-bk-pdf" type="file" accept="application/pdf,.pdf" hidden/>' +
      '</label>' +
      '</div>' +
      '<button type="button" class="adm-save adm-add-bk" onclick="HudaAdmin.addBook()">➕ إضافة الكتاب للمكتبة</button>' +
      '</div>' +
      '<div id="adm-books-list" class="adm-books-list"></div>' +
      '<p class="adm-hint">الرفع يتم على السيرفر — يظهر الكتاب فورًا لكل الأجهزة والزوار. يمكنك الحذف من القائمة بالأسفل.</p>' +
      '</section>' +
      '<section class="adm-card"><h3>💾 حفظ</h3>' +
      '<div class="adm-actions">' +
      '<button type="button" class="adm-save" onclick="HudaAdmin.save()">حفظ الإعدادات</button>' +
      '<button type="button" class="adm-reset" onclick="HudaAdmin.reset()">افتراضي</button>' +
      '</div></section>';

    bindUploadHints();
    refreshBooksList();
  }

  function bindUploadHints() {
    var cover = document.getElementById('adm-bk-cover');
    var pdf = document.getElementById('adm-bk-pdf');
    if (cover) cover.onchange = function () {
      var h = document.getElementById('adm-cover-hint');
      if (h) h.textContent = cover.files[0] ? cover.files[0].name : 'اضغط لاختيار صورة';
    };
    if (pdf) pdf.onchange = function () {
      var h = document.getElementById('adm-pdf-hint');
      if (h) h.textContent = pdf.files[0] ? pdf.files[0].name : 'اضغط لرفع الكتاب كاملًا';
    };
  }

  async function refreshBooksList() {
    var box = document.getElementById('adm-books-list');
    if (!box) return;
    if (!window.HudaBooks) {
      box.innerHTML = '<p class="adm-hint">وحدة الكتب غير محمّلة</p>';
      return;
    }
    var list = await HudaBooks.adminList();
    if (!list.length) {
      box.innerHTML = '<p class="adm-hint">لا كتب بعد — أضف أول كتاب أعلاه</p>';
      return;
    }
    box.innerHTML = list.map(function (b) {
      var thumb = b.coverDataUrl
        ? '<img class="adm-bk-thumb" src="' + b.coverDataUrl + '" alt=""/>'
        : '<div class="adm-bk-thumb adm-bk-ph">📚</div>';
      return '<div class="adm-bk-row">' + thumb +
        '<div class="adm-bk-meta"><b>' + esc(b.title) + '</b><small>' + esc(b.author || '') +
        (b.hasPdf ? ' · PDF' : '') + '</small></div>' +
        '<button type="button" class="adm-bk-del" onclick="HudaAdmin.removeBook(\'' + b.id + '\')">حذف</button></div>';
    }).join('');
  }

  async function addBook() {
    if (!window.HudaBooks) { alert('وحدة الكتب غير جاهزة'); return; }
    var title = val('adm-bk-title');
    if (!title.trim()) { alert('اكتب عنوان الكتاب'); return; }
    var coverInp = document.getElementById('adm-bk-cover');
    var pdfInp = document.getElementById('adm-bk-pdf');
    var coverFile = coverInp && coverInp.files && coverInp.files[0];
    var pdfFile = pdfInp && pdfInp.files && pdfInp.files[0];
    try {
      await HudaBooks.adminAdd({
        title: title,
        author: val('adm-bk-author'),
        cat: val('adm-bk-cat')
      }, coverFile || null, pdfFile || null);
      alert('تم رفع الكتاب — سيظهر على كل الأجهزة');
      ['adm-bk-title', 'adm-bk-author', 'adm-bk-cat'].forEach(function (id) {
        var el = document.getElementById(id); if (el) el.value = '';
      });
      if (coverInp) coverInp.value = '';
      if (pdfInp) pdfInp.value = '';
      var ch = document.getElementById('adm-cover-hint'); if (ch) ch.textContent = 'اضغط لاختيار صورة';
      var ph = document.getElementById('adm-pdf-hint'); if (ph) ph.textContent = 'اضغط لرفع الكتاب كاملًا';
      alert('تمت إضافة الكتاب');
      refreshBooksList();
      if (HudaBooks.render) HudaBooks.render();
    } catch (e) {
      alert('فشل الحفظ: ' + (e && e.message ? e.message : 'خطأ'));
    }
  }

  async function removeBook(id) {
    if (!confirm('حذف هذا الكتاب من كل الأجهزة؟')) return;
    if (!window.HudaBooks) return;
    try {
      await HudaBooks.adminRemove(id);
      refreshBooksList();
      if (HudaBooks.render) HudaBooks.render();
      alert('تم حذف الكتاب');
    } catch (e) {
      alert((e && e.message) || 'فشل الحذف');
    }
  }

  function collect() {
    return {
      siteName: val('adm-siteName') || DEFAULTS.siteName,
      maintenance: val('adm-maint') === '1',
      maintenanceMsg: val('adm-maintMsg') || DEFAULTS.maintenanceMsg,
      showAi: chk('adm-showAi'), showAdhan: chk('adm-showAdhan'),
      showTasbeeh: chk('adm-showTasbeeh'), showNawawi: chk('adm-showNawawi'),
      showHifz: chk('adm-showHifz'), customCss: '', notes: '', welcomeMsg: ''
    };
  }
  function saveFromUi() {
    var cfg = collect();
    save(cfg); applyConfig(cfg);
    alert('تم الحفظ');
  }
  function resetAll() {
    if (!confirm('استعادة الافتراضي؟')) return;
    save(DEFAULTS); applyConfig(DEFAULTS); renderPanel();
  }

  function hookInput(el) {
    if (!el || el.__admHooked) return;
    el.__admHooked = true;
    function check() { if (tryUnlock(el.value)) el.value = ''; }
    el.addEventListener('input', check);
    el.addEventListener('keydown', function (e) { if (e.key === 'Enter') check(); });
  }
  function scanHooks() {
    hookInput(document.getElementById('qs-inp'));
    hookInput(document.getElementById('rd-q'));
  }
  function patchSearchFns() {
    if (typeof window.qsSearch === 'function' && !window.qsSearch.__adm) {
      var oq = window.qsSearch;
      window.qsSearch = function (q) { if (tryUnlock(q)) return; return oq.apply(this, arguments); };
      window.qsSearch.__adm = true;
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyConfig(load());
    scanHooks();
    setTimeout(function () { scanHooks(); patchSearchFns(); }, 800);
  });
  setInterval(scanHooks, 3000);

  window.HudaAdmin = {
    open: openAdmin, logout: logout, save: saveFromUi, reset: resetAll,
    tryUnlock: tryUnlock, getConfig: load, addBook: addBook, removeBook: removeBook
  };
})();
