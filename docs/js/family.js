/**
 * Huda Al Quran — لوحة العائلة + تحديات أسبوعية (محلي على الجهاز)
 */
(function () {
  'use strict';
  var KEY = 'huda_family_v1';

  var WEEKLY = [
    { id: 'juz', title: 'ختم جزء', target: 1, unit: 'جزء', pts: 50 },
    { id: 'pages', title: 'قراءة ٢٠ صفحة', target: 20, unit: 'صفحة', pts: 40 },
    { id: 'tasbeeh', title: '١٠٠ تسبيحة', target: 100, unit: 'مرة', pts: 30 },
    { id: 'wird', title: 'ورد يومي ٥ أيام', target: 5, unit: 'يوم', pts: 35 },
    { id: 'prayer', title: 'تسجيل الصلوات', target: 15, unit: 'صلاة', pts: 45 }
  ];

  function weekId() {
    var d = new Date();
    var onejan = new Date(d.getFullYear(), 0, 1);
    var week = Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    return d.getFullYear() + '-W' + week;
  }

  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (s && s.members) {
        if (s.week !== weekId()) {
          s.week = weekId();
          s.members.forEach(function (m) { m.progress = {}; m.weekPts = 0; });
        }
        return s;
      }
    } catch (e) {}
    return { week: weekId(), activeId: null, members: [] };
  }

  function save(st) {
    try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {}
  }

  var st = load();

  function uid() {
    return 'm' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function active() {
    if (!st.members.length) return null;
    var m = st.members.find(function (x) { return x.id === st.activeId; });
    return m || st.members[0];
  }

  function addMember() {
    var inp = document.getElementById('fam-name');
    var name = (inp && inp.value || '').trim();
    if (!name) { alert('اكتب اسم العضو'); return; }
    if (st.members.length >= 12) { alert('الحد الأقصى 12 عضواً'); return; }
    var m = { id: uid(), name: name, weekPts: 0, progress: {}, totalPts: 0 };
    st.members.push(m);
    st.activeId = m.id;
    if (inp) inp.value = '';
    save(st);
    render();
  }

  function setActive(id) {
    st.activeId = id;
    save(st);
    render();
  }

  function removeMember(id) {
    if (!confirm('حذف هذا العضو؟')) return;
    st.members = st.members.filter(function (m) { return m.id !== id; });
    if (st.activeId === id) st.activeId = st.members[0] && st.members[0].id;
    save(st);
    render();
  }

  function bump(chalId) {
    var m = active();
    if (!m) { alert('أضف عضواً أولاً'); return; }
    var ch = WEEKLY.find(function (c) { return c.id === chalId; });
    if (!ch) return;
    m.progress[chalId] = (m.progress[chalId] || 0) + 1;
    if (m.progress[chalId] === ch.target) {
      m.weekPts += ch.pts;
      m.totalPts = (m.totalPts || 0) + ch.pts;
    }
    save(st);
    render();
  }

  function renderMembers() {
    var el = document.getElementById('fam-members');
    if (!el) return;
    if (!st.members.length) {
      el.innerHTML = '<p class="fam-empty">لا يوجد أعضاء بعد. أضف اسمك أو أفراد عائلتك.</p>';
      return;
    }
    el.innerHTML = st.members.map(function (m) {
      var on = m.id === (active() && active().id);
      return '<div class="fam-member' + (on ? ' on' : '') + '">' +
        '<button type="button" class="fam-member-main" onclick="HudaFamily.setActive(\'' + m.id + '\')">' +
        '<span class="fam-avatar">' + (m.name.charAt(0) || '?') + '</span>' +
        '<span><b>' + m.name + '</b><small>' + (m.weekPts || 0) + ' نقطة هذا الأسبوع</small></span>' +
        (on ? '<em>نشط</em>' : '') +
        '</button>' +
        '<button type="button" class="fam-del" onclick="HudaFamily.removeMember(\'' + m.id + '\')" aria-label="حذف">✕</button>' +
        '</div>';
    }).join('');
  }

  function renderBoard() {
    var el = document.getElementById('fam-leaderboard');
    if (!el) return;
    var list = st.members.slice().sort(function (a, b) { return (b.weekPts || 0) - (a.weekPts || 0); });
    if (!list.length) {
      el.innerHTML = '<p class="fam-empty">الصدارة تظهر بعد إضافة الأعضاء وتسجيل الإنجازات.</p>';
      return;
    }
    el.innerHTML = list.map(function (m, i) {
      var medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1);
      return '<div class="fam-row"><span class="fam-rank">' + medal + '</span><span class="fam-row-name">' + m.name +
        '</span><span class="fam-row-pts">' + (m.weekPts || 0) + '</span></div>';
    }).join('');
  }

  function renderWeekly() {
    var el = document.getElementById('fam-weekly');
    if (!el) return;
    var m = active();
    el.innerHTML = WEEKLY.map(function (ch) {
      var cur = (m && m.progress[ch.id]) || 0;
      var done = cur >= ch.target;
      var pct = Math.min(100, Math.round((cur / ch.target) * 100));
      return '<div class="fam-chal' + (done ? ' done' : '') + '">' +
        '<div class="fam-chal-top"><b>' + ch.title + '</b><span>+' + ch.pts + '</span></div>' +
        '<div class="fam-chal-bar"><i style="width:' + pct + '%"></i></div>' +
        '<div class="fam-chal-bot"><small>' + cur + ' / ' + ch.target + ' ' + ch.unit + '</small>' +
        '<button type="button" onclick="HudaFamily.bump(\'' + ch.id + '\')" ' + (done ? 'disabled' : '') + '>+1</button></div>' +
        '</div>';
    }).join('');
  }

  function render() {
    st = load();
    renderMembers();
    renderBoard();
    renderWeekly();
  }

  function exportCode() {
    var ta = document.getElementById('fam-code');
    var payload = btoa(unescape(encodeURIComponent(JSON.stringify(st))));
    if (ta) ta.value = payload;
    try {
      navigator.clipboard.writeText(payload);
      alert('تم نسخ الكود');
    } catch (e) {
      alert('انسخ الكود من المربع');
    }
  }

  function importCode() {
    var ta = document.getElementById('fam-code');
    var raw = (ta && ta.value || '').trim();
    if (!raw) { alert('الصق الكود أولاً'); return; }
    try {
      var data = JSON.parse(decodeURIComponent(escape(atob(raw))));
      if (!data.members) throw new Error('bad');
      data.week = data.week || weekId();
      st = data;
      save(st);
      render();
      alert('تم الاستيراد');
    } catch (e) {
      alert('كود غير صالح');
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    render();
  });

  // re-render on page open
  setTimeout(function () {
    if (typeof window.SP === 'function' && !window.SP.__fam) {
      var orig = window.SP;
      window.SP = function (id) {
        var r = orig.apply(this, arguments);
        if (id === 'family') setTimeout(render, 40);
        return r;
      };
      window.SP.__fam = true;
    }
  }, 600);

  window.HudaFamily = {
    addMember: addMember,
    setActive: setActive,
    removeMember: removeMember,
    bump: bump,
    exportCode: exportCode,
    importCode: importCode,
    render: render
  };
})();
