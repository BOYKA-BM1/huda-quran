/* هُدى — تسجيل الدخول */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function toast(m) { if (typeof showToast === 'function') showToast(m); }

  function apiBase() {
    try {
      if (window.HudaConfig && window.HudaConfig.backendUrl)
        return String(window.HudaConfig.backendUrl).replace(/\/$/, '') + '/api';
    } catch (e) {}
    return (window.HUDA_API || 'http://localhost:3000') + '/api';
  }

  function token() {
    try { return localStorage.getItem('huda_token') || ''; } catch (e) { return ''; }
  }
  function user() {
    try { return JSON.parse(localStorage.getItem('huda_user') || 'null'); } catch (e) { return null; }
  }
  function saveSession(tok, u) {
    try {
      localStorage.setItem('huda_token', tok);
      localStorage.setItem('huda_user', JSON.stringify(u));
    } catch (e) {}
    syncNavUser();
  }
  function clearSession() {
    try {
      localStorage.removeItem('huda_token');
      localStorage.removeItem('huda_user');
    } catch (e) {}
    syncNavUser();
  }

  window.openAuthModal = function () {
    try { if (typeof closeMenu === 'function') closeMenu(); } catch (e) {}
    var m = $('auth-modal');
    if (!m) {
      toast('واجهة الدخول غير متاحة');
      return;
    }
    m.style.display = 'flex';
    m.classList.add('on');
    authShow('login');
  };
  window.closeAuthModal = function () {
    var m = $('auth-modal');
    if (m) { m.style.display = 'none'; m.classList.remove('on'); }
  };
  window.authShow = function (which) {
    var login = $('auth-form-login'), reg = $('auth-form-reg');
    var tl = $('auth-tab-login'), tr = $('auth-tab-reg');
    if (!login || !reg) return;
    login.style.display = which === 'login' ? 'block' : 'none';
    reg.style.display = which === 'register' ? 'block' : 'none';
    if (tl) tl.classList.toggle('on', which === 'login');
    if (tr) tr.classList.toggle('on', which === 'register');
    var le = $('login-err'), re = $('reg-err');
    if (le) le.hidden = true;
    if (re) re.hidden = true;
  };

  window.submitLogin = function (e) {
    if (e) e.preventDefault();
    var username = ($('login-user') || {}).value || '';
    var password = ($('login-pass') || {}).value || '';
    var err = $('login-err');
    fetch(apiBase() + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.trim(), password: password })
    }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (!res.ok) {
          if (err) { err.hidden = false; err.textContent = (res.j && res.j.error) || 'فشل الدخول'; }
          return;
        }
        saveSession(res.j.token, res.j.user);
        closeAuthModal();
        toast('مرحبًا ' + (res.j.user.name || res.j.user.username));
      }).catch(function () {
        if (err) { err.hidden = false; err.textContent = 'تعذّر الاتصال — شغّل الباك إند (المنفذ 3000)'; }
      });
    return false;
  };

  window.submitRegister = function (e) {
    if (e) e.preventDefault();
    var name = ($('reg-name') || {}).value || '';
    var username = ($('reg-user') || {}).value || '';
    var password = ($('reg-pass') || {}).value || '';
    var err = $('reg-err');
    if (!/^[A-Za-z][A-Za-z0-9_]{2,20}$/.test(username)) {
      if (err) { err.hidden = false; err.textContent = 'اليوزر: إنجليزي يبدأ بحرف (3–21)'; }
      return false;
    }
    fetch(apiBase() + '/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), username: username.trim().toLowerCase(), password: password })
    }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (!res.ok) {
          if (err) { err.hidden = false; err.textContent = (res.j && res.j.error) || 'فشل التسجيل'; }
          return;
        }
        saveSession(res.j.token, res.j.user);
        closeAuthModal();
        toast('تم إنشاء الحساب');
      }).catch(function () {
        if (err) { err.hidden = false; err.textContent = 'تعذّر الاتصال — شغّل الباك إند'; }
      });
    return false;
  };

  window.logoutHuda = function () {
    clearSession();
    toast('تم تسجيل الخروج');
  };

  function syncNavUser() {
    var u = user();
    var nameEl = $('nav-user-name');
    var handleEl = $('nav-user-handle');
    var av = $('nav-user-av');
    var btn = $('nav-login-btn');
    if (!nameEl) return;
    if (u && u.username) {
      nameEl.textContent = u.name || u.username;
      if (handleEl) handleEl.textContent = '@' + u.username;
      if (av) av.textContent = (u.name || u.username).charAt(0);
      if (btn) {
        btn.textContent = 'خروج';
        btn.onclick = function (ev) { if (ev) ev.preventDefault(); logoutHuda(); };
      }
    } else {
      nameEl.textContent = 'زائر';
      if (handleEl) handleEl.textContent = 'سجّل الدخول لحفظ تقدمك';
      if (av) av.textContent = '؟';
      if (btn) {
        btn.textContent = 'دخول';
        btn.onclick = function (ev) {
          if (ev) { ev.preventDefault(); ev.stopPropagation(); }
          openAuthModal();
        };
      }
    }
  }

  window.HudaAuth = { token: token, user: user, sync: syncNavUser, logout: clearSession };

  function bind() {
    syncNavUser();
    var btn = $('nav-login-btn');
    if (btn && !user()) {
      btn.onclick = function (ev) {
        if (ev) { ev.preventDefault(); ev.stopPropagation(); }
        openAuthModal();
      };
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind);
  else bind();
})();
