/**
 * Huda Al Quran — نظام المسابقات والمستويات والأوسمة
 * يحفظ التقدم محلياً (localStorage) ويكافئ على العبادات اليومية.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'huda_comp_v1';

  var LEVELS = [
    { id: 1, name: 'مبتدئ', min: 0, icon: '🌱' },
    { id: 2, name: 'مجتهد', min: 100, icon: '📖' },
    { id: 3, name: 'حافظ', min: 300, icon: '🧠' },
    { id: 4, name: 'مُتقِن', min: 700, icon: '✨' },
    { id: 5, name: 'سراج', min: 1500, icon: '🌟' },
    { id: 6, name: 'قمر', min: 3000, icon: '🌙' },
    { id: 7, name: 'شمس', min: 6000, icon: '☀️' }
  ];

  var BADGES = [
    { id: 'first_read', name: 'أول تلاوة', desc: 'اقرأ أول صفحة من المصحف', icon: '📗', pts: 20 },
    { id: 'daily_wird', name: 'ورد اليوم', desc: 'افتح ورد اليوم', icon: '📿', pts: 15 },
    { id: 'prayer_track', name: 'مواظب', desc: 'سجّل صلاة في المتابعة', icon: '🕌', pts: 25 },
    { id: 'tasbeeh_33', name: 'مسبّح', desc: 'أكمل 33 تسبيحة', icon: '🔵', pts: 15 },
    { id: 'quiz_win', name: 'فائز', desc: 'أجب صح على سؤال مسابقة', icon: '🏆', pts: 30 },
    { id: 'streak_3', name: 'سلسلة ٣ أيام', desc: 'ادخل التطبيق ٣ أيام متتالية', icon: '🔥', pts: 50 },
    { id: 'streak_7', name: 'أسبوع نور', desc: '٧ أيام متتالية', icon: '💎', pts: 120 },
    { id: 'khatma_page', name: 'خطوة ختمة', desc: 'سجّل تقدماً في خطة الختمة', icon: '📚', pts: 20 }
  ];

  var QUIZ = [
    { q: 'كم عدد سور القرآن الكريم؟', options: ['١١٤', '١١٠', '١٢٠', '١٠٠'], a: 0 },
    { q: 'ما هي أطول سورة في القرآن؟', options: ['البقرة', 'آل عمران', 'النساء', 'المائدة'], a: 0 },
    { q: 'في أي سورة وردت آية الكرسي؟', options: ['البقرة', 'آل عمران', 'النساء', 'المائدة'], a: 0 },
    { q: 'كم عدد أجزاء القرآن؟', options: ['٣٠', '٦٠', '١١٤', '١٥'], a: 0 },
    { q: 'ما أول سورة نزلت من القرآن؟', options: ['العلق', 'الفاتحة', 'المدثر', 'المزمل'], a: 0 },
    { q: 'ما السورة التي تُسمّى قلب القرآن؟', options: ['يس', 'الرحمن', 'الملك', 'الإخلاص'], a: 0 },
    { q: 'كم مرة يُصلّي المسلم في اليوم فرضاً؟', options: ['٥', '٣', '٤', '٦'], a: 0 },
    { q: 'ما اسم الغزوة التي وقعت في رمضان؟', options: ['بدر', 'أحد', 'الخندق', 'تبوك'], a: 0 }
  ];

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
      points: 0,
      badges: {},
      streak: 0,
      lastDay: '',
      quizDone: {},
      history: []
    };
  }

  function save(state) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  function todayKey() {
    var d = new Date();
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  }

  function levelFor(pts) {
    var cur = LEVELS[0];
    for (var i = 0; i < LEVELS.length; i++) {
      if (pts >= LEVELS[i].min) cur = LEVELS[i];
    }
    return cur;
  }

  function nextLevel(pts) {
    for (var i = 0; i < LEVELS.length; i++) {
      if (LEVELS[i].min > pts) return LEVELS[i];
    }
    return null;
  }

  var state = load();

  function touchStreak() {
    var t = todayKey();
    if (state.lastDay === t) return;
    var y = new Date();
    y.setDate(y.getDate() - 1);
    var yk = y.getFullYear() + '-' + (y.getMonth() + 1) + '-' + y.getDate();
    if (state.lastDay === yk) state.streak += 1;
    else state.streak = 1;
    state.lastDay = t;
    if (state.streak >= 3) awardBadge('streak_3');
    if (state.streak >= 7) awardBadge('streak_7');
    save(state);
  }

  function addPoints(n, reason) {
    state.points += n;
    state.history.unshift({ t: Date.now(), n: n, reason: reason || '' });
    if (state.history.length > 40) state.history.pop();
    save(state);
    render();
  }

  function awardBadge(id) {
    if (state.badges[id]) return false;
    var b = null;
    for (var i = 0; i < BADGES.length; i++) if (BADGES[i].id === id) b = BADGES[i];
    if (!b) return false;
    state.badges[id] = Date.now();
    state.points += b.pts;
    save(state);
    render();
    return true;
  }

  function publicApi() {
    return {
      award: function (id) { touchStreak(); return awardBadge(id); },
      points: function (n, reason) { touchStreak(); addPoints(n, reason); },
      getState: function () { return JSON.parse(JSON.stringify(state)); },
      render: render
    };
  }

  var quizIndex = 0;

  function pickQuiz() {
    quizIndex = Math.floor(Math.random() * QUIZ.length);
    return QUIZ[quizIndex];
  }

  function answerQuiz(opt) {
    var item = QUIZ[quizIndex];
    var ok = opt === item.a;
    var el = document.getElementById('comp-quiz-result');
    if (ok) {
      addPoints(25, 'إجابة صحيحة');
      awardBadge('quiz_win');
      if (el) el.innerHTML = '<span style="color:#3dce8c">✔ إجابة صحيحة! +٢٥ نقطة</span>';
    } else {
      if (el) el.innerHTML = '<span style="color:#e07a7a">✖ الإجابة الصحيحة: ' + item.options[item.a] + '</span>';
    }
    setTimeout(function () {
      showQuiz();
      if (el) el.innerHTML = '';
    }, 1600);
  }

  function showQuiz() {
    var item = pickQuiz();
    var qEl = document.getElementById('comp-quiz-q');
    var oEl = document.getElementById('comp-quiz-opts');
    if (!qEl || !oEl) return;
    qEl.textContent = item.q;
    oEl.innerHTML = '';
    item.options.forEach(function (opt, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'comp-opt';
      btn.textContent = opt;
      btn.onclick = function () { answerQuiz(i); };
      oEl.appendChild(btn);
    });
  }

  function render() {
    touchStreak();
    var pts = state.points;
    var lvl = levelFor(pts);
    var nxt = nextLevel(pts);

    var set = function (id, val) {
      var el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    set('comp-points', String(pts));
    set('comp-level-name', lvl.icon + ' ' + lvl.name);
    set('comp-streak', String(state.streak));

    var bar = document.getElementById('comp-level-bar');
    if (bar) {
      var min = lvl.min;
      var max = nxt ? nxt.min : min + 1;
      var pct = nxt ? Math.min(100, Math.round(((pts - min) / (max - min)) * 100)) : 100;
      bar.style.width = pct + '%';
    }
    set('comp-level-next', nxt ? ('المستوى التالي: ' + nxt.name + ' عند ' + nxt.min + ' نقطة') : 'وصلت أعلى مستوى 🌟');

    var badgesEl = document.getElementById('comp-badges');
    if (badgesEl) {
      badgesEl.innerHTML = BADGES.map(function (b) {
        var on = !!state.badges[b.id];
        return '<div class="comp-badge' + (on ? ' on' : '') + '" title="' + b.desc + '">' +
          '<div class="comp-badge-icon">' + b.icon + '</div>' +
          '<div class="comp-badge-name">' + b.name + '</div>' +
          '<div class="comp-badge-pts">+' + b.pts + '</div>' +
          (on ? '<div class="comp-badge-got">مُنجَز</div>' : '<div class="comp-badge-lock">مقفل</div>') +
          '</div>';
      }).join('');
    }

    var challenges = document.getElementById('comp-challenges');
    if (challenges) {
      challenges.innerHTML =
        '<div class="comp-chal"><b>اليوم</b><span>اقرأ صفحة من المصحف</span><em>+٢٠</em></div>' +
        '<div class="comp-chal"><b>اليوم</b><span>افتح ورد اليوم أو حصن المسلم</span><em>+١٥</em></div>' +
        '<div class="comp-chal"><b>اليوم</b><span>أجب على سؤال المسابقة</span><em>+٢٥</em></div>' +
        '<div class="comp-chal"><b>متواصل</b><span>سلسلة دخول ' + state.streak + ' يوم</span><em>🔥</em></div>';
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    render();
    showQuiz();
    // soft hooks
    document.body.addEventListener('click', function (e) {
      var t = e.target;
      if (!t) return;
      var pageBtn = t.closest && t.closest('[onclick*="SP(\'mushaf\')"]');
      if (pageBtn) setTimeout(function () { awardBadge('first_read'); }, 800);
    });
  });

  // re-render when opening page
  var _sp = window.SP;
  if (typeof _sp === 'function') {
    window.SP = function (id) {
      var r = _sp.apply(this, arguments);
      if (id === 'competitions') setTimeout(function () { render(); showQuiz(); }, 50);
      return r;
    };
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(function () {
        if (typeof window.SP === 'function' && !window.SP.__compWrapped) {
          var orig = window.SP;
          window.SP = function (id) {
            var r = orig.apply(this, arguments);
            if (id === 'competitions') setTimeout(function () { render(); showQuiz(); }, 50);
            return r;
          };
          window.SP.__compWrapped = true;
        }
      }, 500);
    });
  }

  window.HudaCompetitions = publicApi();
})();
