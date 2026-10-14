/**
 * Huda Al Quran — لوحة تحكم مخفية
 * تُفتح بكتابة: 13/4/2024 في بحث القرآن
 */
(function () {
  'use strict';

  var SECRET = '13/4/2024';
  var KEY = 'huda_admin_cfg_v1';
  var unlocked = false;

  var DEFAULTS = {
    siteName: 'Huda Al Quran',
    maintenance: false,
    maintenanceMsg: 'الموقع قيد الصيانة، نعود قريبًا.',
    showAi: true,
    showAdhan: true,
    showTasbeeh: true,
    showNawawi: true,
    showHifz: true,
    welcomeMsg: '',
    customCss: '',
    notes: ''
  };

  function load() {
    try {
      var o = JSON.parse(localStorage.getItem(KEY) || '{}');
      return Object.assign({}, DEFAULTS, o);
    } catch (e) {
      return Object.assign({}, DEFAULTS);
    }
  }

  function save(cfg) {
    try { localStorage.setItem(KEY, JSON.stringify(cfg)); } catch (e) {}
  }

  function normalize(s) {
    return String(s || '').trim().replace(/\s+/g, '');
  }

  function isSecret(val) {
    var v = normalize(val);
    return v === SECRET || v === '13/04/2024' || v === '13-4-2024' || v === '13-04-2024';
  }

  function tryUnlock(val) {
    if (!isSecret(val)) return false;
    unlocked = true;
    try { sessionStorage.setItem('huda_admin_ok', '1'); } catch (e) {}
    openAdmin();
    return true;
  }

  function openAdmin() {
    if (typeof window.SP === 'function') {
      try { window.SP('admin'); } catch (e) {}
    }
    var page = document.getElementById('page-admin');
    if (page) {
      document.querySelectorAll('.pg').forEach(function (el) { el.classList.remove('on'); });
      page.classList.add('on');
    }
    try {
      var sch = document.getElementById('rd-sch');
      if (sch) sch.classList.remove('on');
    } catch (e) {}
    renderPanel();
  }

  function logout() {
    unlocked = false;
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
    } else if (ban) {
      ban.style.display = 'none';
    }

    toggleNav('nav-ai', cfg.showAi);
    toggleNav('nav-prayer', cfg.showAdhan);
    toggleNav('nav-hifz', cfg.showHifz);

    document.querySelectorAll('.hv-svc button').forEach(function (btn) {
      var oc = btn.getAttribute('onclick') || '';
      if (oc.indexOf("SP('ai')") !== -1) btn.style.display = cfg.showAi ? '' : 'none';
      if (oc.indexOf("SP('tasbeeh')") !== -1) btn.style.display = cfg.showTasbeeh ? '' : 'none';
      if (oc.indexOf("SP('nawawi')") !== -1) btn.style.display = cfg.showNawawi ? '' : 'none';
      if (oc.indexOf("SP('hifz')") !== -1) btn.style.display = cfg.showHifz ? '' : 'none';
    });

    var st = document.getElementById('adm-custom-style');
    if (cfg.customCss) {
      if (!st) {
        st = document.createElement('style');
        st.id = 'adm-custom-style';
        document.head.appendChild(st);
      }
      st.textContent = cfg.customCss;
    } else if (st) st.textContent = '';

    if (cfg.siteName) {
      try { document.title = cfg.siteName; } catch (e) {}
    }
  }

  function toggleNav(id, show) {
    var el = document.getElementById(id);
    if (el) el.style.display = show ? '' : 'none';
  }

  function field(label, inner) {
    return '<label class="adm-field"><span>' + label + '</span>' + inner + '</label>';
  }

  function toggleRow(id, label, on) {
    return '<label class="adm-toggle"><span>' + label + '</span>' +
      '<input type="checkbox" id="' + id + '"' + (on ? ' checked' : '') + '/></label>';
  }

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  function renderPanel() {
    var root = document.getElementById('adm-panels');
    if (!root) return;
    var cfg = load();

    root.innerHTML =
      '<section class="adm-card"><h3>⚙️ إعدادات عامة</h3>' +
      field('اسم التطبيق', '<input id="adm-siteName" type="text" value="' + esc(cfg.siteName) + '"/>') +
      field('رسالة ترحيب', '<input id="adm-welcome" type="text" value="' + esc(cfg.welcomeMsg) + '"/>') +
      field('وضع الصيانة', '<select id="adm-maint"><option value="0"' + (!cfg.maintenance ? ' selected' : '') + '>متوقف</option><option value="1"' + (cfg.maintenance ? ' selected' : '') + '>مفعّل</option></select>') +
      field('رسالة الصيانة', '<input id="adm-maintMsg" type="text" value="' + esc(cfg.maintenanceMsg) + '"/>') +
      '</section>' +
      '<section class="adm-card"><h3>🧩 إظهار/إخفاء الأقسام</h3>' +
      toggleRow('adm-showAi', 'المساعد الذكي', cfg.showAi) +
      toggleRow('adm-showAdhan', 'الصلاة والأذان', cfg.showAdhan) +
      toggleRow('adm-showTasbeeh', 'المسبحة', cfg.showTasbeeh) +
      toggleRow('adm-showNawawi', 'الأربعون النووية', cfg.showNawawi) +
      toggleRow('adm-showHifz', 'وضع الحفظ', cfg.showHifz) +
      '</section>' +
      '<section class="adm-card"><h3>🎨 تخصيص</h3>' +
      field('CSS مخصص', '<textarea id="adm-css" rows="5">' + esc(cfg.customCss) + '</textarea>') +
      field('ملاحظات المشرف', '<textarea id="adm-notes" rows="3">' + esc(cfg.notes) + '</textarea>') +
      '</section>' +
      '<section class="adm-card"><h3>💾 حفظ</h3>' +
      '<div class="adm-actions">' +
      '<button type="button" class="adm-save" onclick="HudaAdmin.save()">حفظ وتطبيق</button>' +
      '<button type="button" class="adm-reset" onclick="HudaAdmin.reset()">استعادة الافتراضي</button>' +
      '</div>' +
      '<p class="adm-hint">الإعدادات تُحفظ على هذا الجهاز. لنشرها لكل الزوار يلزم ربط الخادم لاحقًا.</p></section>';
  }

  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value : '';
  }
  function chk(id) {
    var el = document.getElementById(id);
    return !!(el && el.checked);
  }

  function collect() {
    return {
      siteName: val('adm-siteName') || DEFAULTS.siteName,
      welcomeMsg: val('adm-welcome'),
      maintenance: val('adm-maint') === '1',
      maintenanceMsg: val('adm-maintMsg') || DEFAULTS.maintenanceMsg,
      showAi: chk('adm-showAi'),
      showAdhan: chk('adm-showAdhan'),
      showTasbeeh: chk('adm-showTasbeeh'),
      showNawawi: chk('adm-showNawawi'),
      showHifz: chk('adm-showHifz'),
      customCss: val('adm-css'),
      notes: val('adm-notes')
    };
  }

  function saveFromUi() {
    var cfg = collect();
    save(cfg);
    applyConfig(cfg);
    alert('تم الحفظ والتطبيق');
  }

  function resetAll() {
    if (!confirm('استعادة الإعدادات الافتراضية؟')) return;
    save(DEFAULTS);
    applyConfig(DEFAULTS);
    renderPanel();
  }

  function hookInput(el) {
    if (!el || el.__admHooked) return;
    el.__admHooked = true;
    function check() {
      if (tryUnlock(el.value)) el.value = '';
    }
    el.addEventListener('input', check);
    el.addEventListener('change', check);
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') check();
    });
  }

  function scanHooks() {
    hookInput(document.getElementById('qs-inp'));
    hookInput(document.getElementById('rd-q'));
  }

  function patchSearchFns() {
    if (typeof window.qsSearch === 'function' && !window.qsSearch.__adm) {
      var oq = window.qsSearch;
      window.qsSearch = function (q) {
        if (tryUnlock(q)) return;
        return oq.apply(this, arguments);
      };
      window.qsSearch.__adm = true;
    }
    if (typeof window.runSearch === 'function' && !window.runSearch.__adm) {
      var or = window.runSearch;
      window.runSearch = function (q) {
        if (tryUnlock(q)) return;
        return or.apply(this, arguments);
      };
      window.runSearch.__adm = true;
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    try { if (sessionStorage.getItem('huda_admin_ok') === '1') unlocked = true; } catch (e) {}
    applyConfig(load());
    scanHooks();
    setTimeout(function () { scanHooks(); patchSearchFns(); }, 800);
    setTimeout(patchSearchFns, 2000);
  });

  setInterval(scanHooks, 3000);

  window.HudaAdmin = {
    open: openAdmin,
    logout: logout,
    save: saveFromUi,
    reset: resetAll,
    tryUnlock: tryUnlock,
    getConfig: load
  };
})();
