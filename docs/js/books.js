/**
 * مكتبة الكتب — عرض PDF بملء الشاشة + أغلفة
 */
(function () {
  'use strict';
  var DB_NAME = 'huda_library_db', DB_VER = 1, STORE = 'books', OFFLINE = 'offline_flags';
  var dbp = null, current = null, currentUrl = null;

  function openDb() {
    if (dbp) return dbp;
    dbp = new Promise(function (resolve, reject) {
      var req = indexedDB.open(DB_NAME, DB_VER);
      req.onupgradeneeded = function (e) {
        var d = e.target.result;
        if (!d.objectStoreNames.contains(STORE)) d.createObjectStore(STORE, { keyPath: 'id' });
        if (!d.objectStoreNames.contains(OFFLINE)) d.createObjectStore(OFFLINE, { keyPath: 'id' });
      };
      req.onsuccess = function (e) { resolve(e.target.result); };
      req.onerror = function () { reject(req.error); };
    });
    return dbp;
  }
  function txDone(tx) {
    return new Promise(function (res, rej) {
      tx.oncomplete = function () { res(); };
      tx.onerror = function () { rej(tx.error); };
    });
  }
  async function allBooks() {
    var d = await openDb();
    return new Promise(function (resolve) {
      var r = d.transaction(STORE, 'readonly').objectStore(STORE).getAll();
      r.onsuccess = function () {
        var list = r.result || [];
        list.sort(function (a, b) { return (b.createdAt || 0) - (a.createdAt || 0); });
        resolve(list);
      };
      r.onerror = function () { resolve([]); };
    });
  }
  async function getBook(id) {
    var d = await openDb();
    return new Promise(function (resolve) {
      var r = d.transaction(STORE, 'readonly').objectStore(STORE).get(id);
      r.onsuccess = function () { resolve(r.result || null); };
      r.onerror = function () { resolve(null); };
    });
  }
  async function putBook(book) {
    var d = await openDb();
    var tx = d.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(book);
    await txDone(tx);
  }
  async function deleteBook(id) {
    var d = await openDb();
    var tx = d.transaction([STORE, OFFLINE], 'readwrite');
    tx.objectStore(STORE).delete(id);
    tx.objectStore(OFFLINE).delete(id);
    await txDone(tx);
  }
  async function setOffline(id, on) {
    var d = await openDb();
    var tx = d.transaction(OFFLINE, 'readwrite');
    if (on) tx.objectStore(OFFLINE).put({ id: id, at: Date.now() });
    else tx.objectStore(OFFLINE).delete(id);
    await txDone(tx);
  }
  async function isOffline(id) {
    var d = await openDb();
    return new Promise(function (resolve) {
      var r = d.transaction(OFFLINE, 'readonly').objectStore(OFFLINE).get(id);
      r.onsuccess = function () { resolve(!!r.result); };
      r.onerror = function () { resolve(false); };
    });
  }
  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }
  function toast(t) {
    var el = document.getElementById('books-toast');
    if (!el) return;
    el.textContent = t;
    el.classList.add('on');
    setTimeout(function () { el.classList.remove('on'); }, 2200);
  }
  function coverEl(b) {
    if (b.coverDataUrl) {
      return '<div class="bk-cover bk-cover-img"><img src="' + b.coverDataUrl + '" alt=""/></div>';
    }
    var color = b.color || '#0d3b2e', ac = b.accent || '#c9a84c';
    return '<div class="bk-cover" style="--bk:' + color + ';--ac:' + ac + '">' +
      '<div class="bk-cover-orn">☪</div><div class="bk-cover-title">' + esc(b.title) + '</div>' +
      '<div class="bk-cover-author">' + esc(b.author || '') + '</div><div class="bk-cover-line"></div></div>';
  }

  async function ensureSeed() {
    var list = await allBooks();
    if (list.length) return;
    var samples = [
      { id: 'sample_aqida', title: 'أصول الإيمان', author: 'مختصر تعليمي', cat: 'عقيدة', createdAt: Date.now() - 3, hasPdf: false, coverDataUrl: '', color: '#0d3b2e', accent: '#c9a84c',
        chapters: [{ t: 'مقدمة', b: 'الإيمان بالله وملائكته وكتبه ورسله واليوم الآخر والقدر خيره وشره.' }, { t: 'أركان الإيمان', b: 'أركان الإيمان ستة، وهي أساس عقيدة المسلم.' }] },
      { id: 'sample_fiqh', title: 'فقه العبادات مبسّط', author: 'مختصر تعليمي', cat: 'فقه', createdAt: Date.now() - 2, hasPdf: false, coverDataUrl: '', color: '#1a2744', accent: '#6eb5ff',
        chapters: [{ t: 'الطهارة', b: 'الطهارة شرط لصحة الصلاة.' }, { t: 'الصلاة', b: 'الصلاة عمود الدين.' }] },
      { id: 'sample_akhlaq', title: 'أخلاق المسلم', author: 'مختصر تعليمي', cat: 'آداب', createdAt: Date.now() - 1, hasPdf: false, coverDataUrl: '', color: '#3b1f0f', accent: '#e8a87c',
        chapters: [{ t: 'الصدق', b: 'الصدق يهدي إلى البر.' }, { t: 'الأمانة', b: 'لا إيمان لمن لا أمانة له.' }] }
    ];
    for (var i = 0; i < samples.length; i++) await putBook(samples[i]);
  }

  async function renderList() {
    await ensureSeed();
    var el = document.getElementById('books-list');
    if (!el) return;
    var q = ((document.getElementById('books-search') || {}).value || '').trim();
    var list = await allBooks();
    if (q) list = list.filter(function (b) {
      return (b.title + ' ' + (b.author || '') + ' ' + (b.cat || '')).indexOf(q) !== -1;
    });
    if (!list.length) {
      el.innerHTML = '<p class="bk-empty">لا توجد كتب بعد.<br><small>أضفها من لوحة التحكم</small></p>';
      return;
    }
    var html = '';
    for (var i = 0; i < list.length; i++) {
      var b = list[i];
      var on = await isOffline(b.id);
      html += '<article class="bk-card">' + coverEl(b) +
        '<div class="bk-info"><h3 class="bk-name">' + esc(b.title) + '</h3>' +
        '<div class="bk-author">' + esc(b.author || '—') + '</div>' +
        '<div class="bk-cat">' + esc(b.cat || 'كتاب') + (on ? ' · ✓ محفوظ' : '') + (b.hasPdf ? ' · PDF' : '') + '</div>' +
        '<div class="bk-actions">' +
        '<button type="button" class="bk-btn bk-read" data-open="' + b.id + '">📖 قراءة</button>' +
        (on
          ? '<button type="button" class="bk-btn bk-dl on" data-off="' + b.id + '">✓ محفوظ</button>'
          : '<button type="button" class="bk-btn bk-dl" data-save="' + b.id + '">⬇️ دون إنترنت</button>') +
        '</div></div></article>';
    }
    el.innerHTML = html;
    el.querySelectorAll('[data-open]').forEach(function (btn) {
      btn.onclick = function () { openBook(btn.getAttribute('data-open')); };
    });
    el.querySelectorAll('[data-save]').forEach(function (btn) {
      btn.onclick = async function () {
        await setOffline(btn.getAttribute('data-save'), true);
        toast('تم الحفظ بدون إنترنت');
        renderList();
      };
    });
    el.querySelectorAll('[data-off]').forEach(function (btn) {
      btn.onclick = async function () {
        await setOffline(btn.getAttribute('data-off'), false);
        toast('أُزيل من المحفوظات');
        renderList();
      };
    });
  }

  function revokeUrl() {
    if (currentUrl) {
      try { URL.revokeObjectURL(currentUrl); } catch (e) {}
      currentUrl = null;
    }
  }

  async function openBook(id) {
    var b = await getBook(id);
    if (!b) { toast('الكتاب غير موجود'); return; }
    current = b;
    revokeUrl();

    var page = document.getElementById('page-books');
    var list = document.getElementById('books-library');
    var reader = document.getElementById('books-reader');
    if (list) list.style.display = 'none';
    if (reader) {
      reader.style.display = 'flex';
      reader.classList.add('bk-reader-full');
    }
    if (page) page.classList.add('bk-reading');

    var title = document.getElementById('bk-reader-title');
    var sub = document.getElementById('bk-reader-sub');
    var body = document.getElementById('bk-reader-body');
    if (title) title.textContent = b.title;
    if (sub) sub.textContent = b.author || '';

    if (body) {
      if (b.pdfBlob || b.pdfDataUrl) {
        var url = b.pdfDataUrl;
        if (b.pdfBlob) {
          url = URL.createObjectURL(b.pdfBlob);
          currentUrl = url;
        }
        // full page embed — view=FitH for width fit
        body.innerHTML =
          '<div class="bk-pdf-wrap">' +
          '<iframe class="bk-pdf-frame" src="' + url + '#toolbar=1&navpanes=0&scrollbar=1&view=FitH" title="' + esc(b.title) + '" allowfullscreen></iframe>' +
          '</div>';
      } else if (b.chapters && b.chapters.length) {
        body.innerHTML = '<div class="bk-paper-scroll">' + b.chapters.map(function (c) {
          return '<div class="bk-paper"><div class="bk-paper-head">' + esc(c.t) + '</div><p>' +
            esc(c.b).replace(/\n/g, '<br>') + '</p></div>';
        }).join('') + '</div>';
      } else {
        body.innerHTML = '<div class="bk-paper"><p>لا يوجد ملف PDF لهذا الكتاب.</p></div>';
      }
    }
    try { history.pushState({ hudaBook: id }, '', location.href); } catch (e) {}
    try { document.body.classList.add('bk-noscroll'); } catch (e) {}
  }

  function backToList(ev) {
    if (ev) { try { ev.preventDefault(); ev.stopPropagation(); } catch (e) {} }
    revokeUrl();
    var list = document.getElementById('books-library');
    var reader = document.getElementById('books-reader');
    var page = document.getElementById('page-books');
    if (reader) {
      reader.style.display = 'none';
      reader.classList.remove('bk-reader-full');
    }
    if (list) list.style.display = 'block';
    if (page) page.classList.remove('bk-reading');
    try { document.body.classList.remove('bk-noscroll'); } catch (e) {}
    current = null;
    if (page) {
      document.querySelectorAll('.pg').forEach(function (el) { el.classList.remove('on'); });
      page.classList.add('on');
    }
    return false;
  }

  function render() {
    renderList();
    backToList();
  }

  function fileToDataUrl(file) {
    return new Promise(function (resolve, reject) {
      var fr = new FileReader();
      fr.onload = function () { resolve(fr.result); };
      fr.onerror = reject;
      fr.readAsDataURL(file);
    });
  }

  async function adminAdd(meta, coverFile, pdfFile) {
    var id = 'bk_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    var book = {
      id: id,
      title: (meta.title || '').trim() || 'بدون عنوان',
      author: (meta.author || '').trim(),
      cat: (meta.cat || '').trim() || 'إسلامي',
      createdAt: Date.now(),
      hasPdf: false,
      coverDataUrl: '',
      pdfBlob: null,
      pdfDataUrl: '',
      chapters: []
    };
    if (coverFile) book.coverDataUrl = await fileToDataUrl(coverFile);
    if (pdfFile) {
      book.hasPdf = true;
      book.pdfBlob = pdfFile;
    }
    await putBook(book);
    return book;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var s = document.getElementById('books-search');
    if (s) s.addEventListener('input', function () { renderList(); });
  });
  window.addEventListener('popstate', function () { if (current) backToList(); });

  setTimeout(function () {
    if (typeof window.SP === 'function' && !window.SP.__books) {
      var orig = window.SP;
      window.SP = function (id) {
        var r = orig.apply(this, arguments);
        if (id === 'books') setTimeout(render, 40);
        return r;
      };
      window.SP.__books = true;
    }
  }, 600);

  window.HudaBooks = {
    open: openBook,
    back: backToList,
    render: render,
    adminList: allBooks,
    adminAdd: adminAdd,
    adminRemove: deleteBook,
    allBooks: allBooks
  };
})();
