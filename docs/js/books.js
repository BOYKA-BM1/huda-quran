/**
 * مكتبة الكتب — قارئ PDF بملء الشاشة (تصميم خاص)
 */
(function () {
  'use strict';
  var DB_NAME = 'huda_library_db', DB_VER = 1, STORE = 'books';
  var dbp = null, current = null, pdfDoc = null, pageNum = 1, rendering = false;
  var pdfjsLib = null;
  var PDFJS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  var PDFJS_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  function openDb() {
    if (dbp) return dbp;
    dbp = new Promise(function (resolve, reject) {
      var req = indexedDB.open(DB_NAME, DB_VER);
      req.onupgradeneeded = function (e) {
        var d = e.target.result;
        if (!d.objectStoreNames.contains(STORE)) d.createObjectStore(STORE, { keyPath: 'id' });
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
    var tx = d.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(id);
    await txDone(tx);
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
        chapters: [{ t: 'مقدمة', b: 'الإيمان بالله وملائكته وكتبه ورسله واليوم الآخر والقدر خيره وشره.' }] },
      { id: 'sample_fiqh', title: 'فقه العبادات مبسّط', author: 'مختصر تعليمي', cat: 'فقه', createdAt: Date.now() - 2, hasPdf: false, coverDataUrl: '', color: '#1a2744', accent: '#6eb5ff',
        chapters: [{ t: 'الطهارة', b: 'الطهارة شرط لصحة الصلاة.' }] },
      { id: 'sample_akhlaq', title: 'أخلاق المسلم', author: 'مختصر تعليمي', cat: 'آداب', createdAt: Date.now() - 1, hasPdf: false, coverDataUrl: '', color: '#3b1f0f', accent: '#e8a87c',
        chapters: [{ t: 'الصدق', b: 'الصدق يهدي إلى البر.' }] }
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
      el.innerHTML = '<p class="bk-empty">لا توجد كتب بعد.</p>';
      return;
    }
    var html = '';
    for (var i = 0; i < list.length; i++) {
      var b = list[i];
      html += '<article class="bk-card">' + coverEl(b) +
        '<div class="bk-info"><h3 class="bk-name">' + esc(b.title) + '</h3>' +
        '<div class="bk-author">' + esc(b.author || '—') + '</div>' +
        '<div class="bk-cat">' + esc(b.cat || 'كتاب') + (b.hasPdf ? ' · PDF' : '') + '</div>' +
        '<div class="bk-actions">' +
        '<button type="button" class="bk-btn bk-read bk-read-full" data-open="' + b.id + '">📖 قراءة</button>' +
        '</div></div></article>';
    }
    el.innerHTML = html;
    el.querySelectorAll('[data-open]').forEach(function (btn) {
      btn.onclick = function () { openBook(btn.getAttribute('data-open')); };
    });
  }

  function loadPdfJs() {
    if (window.pdfjsLib) {
      pdfjsLib = window.pdfjsLib;
      pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
      return Promise.resolve(pdfjsLib);
    }
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = PDFJS_URL;
      s.onload = function () {
        pdfjsLib = window.pdfjsLib;
        if (!pdfjsLib) { reject(new Error('pdf.js failed')); return; }
        pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
        resolve(pdfjsLib);
      };
      s.onerror = function () { reject(new Error('pdf.js load error')); };
      document.head.appendChild(s);
    });
  }

  function showReaderShell(title, author) {
    var list = document.getElementById('books-library');
    var reader = document.getElementById('books-reader');
    var page = document.getElementById('page-books');
    if (list) list.style.display = 'none';
    if (reader) {
      reader.style.display = 'flex';
      reader.classList.add('bk-reader-full');
    }
    if (page) {
      page.classList.add('bk-reading', 'on');
      document.querySelectorAll('.pg').forEach(function (el) {
        if (el.id !== 'page-books') el.classList.remove('on');
      });
    }
    var t = document.getElementById('bk-reader-title');
    var sub = document.getElementById('bk-reader-sub');
    if (t) t.textContent = title || '';
    if (sub) sub.textContent = author || '';
    document.body.classList.add('bk-noscroll', 'bk-immersive');
  }

  function hideReader() {
    var list = document.getElementById('books-library');
    var reader = document.getElementById('books-reader');
    var page = document.getElementById('page-books');
    if (reader) {
      reader.style.display = 'none';
      reader.classList.remove('bk-reader-full');
    }
    if (list) list.style.display = 'block';
    if (page) page.classList.remove('bk-reading');
    document.body.classList.remove('bk-noscroll', 'bk-immersive');
    pdfDoc = null;
    pageNum = 1;
    current = null;
  }

  async function renderPdfPage(n) {
    if (!pdfDoc || rendering) return;
    rendering = true;
    try {
      var page = await pdfDoc.getPage(n);
      var canvas = document.getElementById('bk-pdf-canvas');
      var wrap = document.getElementById('bk-canvas-wrap');
      if (!canvas || !wrap) return;
      var base = page.getViewport({ scale: 1 });
      var maxW = wrap.clientWidth || window.innerWidth;
      var scale = maxW / base.width;
      var viewport = page.getViewport({ scale: scale });
      var ctx = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = '100%';
      canvas.style.height = 'auto';
      await page.render({ canvasContext: ctx, viewport: viewport }).promise;
      var prog = document.getElementById('bk-page-ind');
      if (prog) prog.textContent = n + ' / ' + pdfDoc.numPages;
      pageNum = n;
      wrap.scrollTop = 0;
    } finally {
      rendering = false;
    }
  }

  async function openBook(id) {
    var b = await getBook(id);
    if (!b) { toast('الكتاب غير موجود'); return; }
    current = b;
    showReaderShell(b.title, b.author);
    var body = document.getElementById('bk-reader-body');
    if (!body) return;

    if (b.pdfBlob || b.pdfDataUrl) {
      body.innerHTML =
        '<div class="bk-canvas-wrap" id="bk-canvas-wrap">' +
        '<canvas id="bk-pdf-canvas" class="bk-pdf-canvas"></canvas></div>' +
        '<div class="bk-page-bar">' +
        '<button type="button" class="bk-pg-btn" id="bk-pg-prev">›</button>' +
        '<span id="bk-page-ind">—</span>' +
        '<button type="button" class="bk-pg-btn" id="bk-pg-next">‹</button></div>';
      try {
        await loadPdfJs();
        var data;
        if (b.pdfBlob) data = await b.pdfBlob.arrayBuffer();
        else {
          var res = await fetch(b.pdfDataUrl);
          data = await res.arrayBuffer();
        }
        pdfDoc = await pdfjsLib.getDocument({ data: data }).promise;
        pageNum = 1;
        await renderPdfPage(1);
        document.getElementById('bk-pg-prev').onclick = function () {
          if (pageNum > 1) renderPdfPage(pageNum - 1);
        };
        document.getElementById('bk-pg-next').onclick = function () {
          if (pdfDoc && pageNum < pdfDoc.numPages) renderPdfPage(pageNum + 1);
        };
        var wrap = document.getElementById('bk-canvas-wrap');
        var sx = 0;
        wrap.addEventListener('touchstart', function (e) { sx = e.changedTouches[0].screenX; }, { passive: true });
        wrap.addEventListener('touchend', function (e) {
          var dx = e.changedTouches[0].screenX - sx;
          if (Math.abs(dx) < 50) return;
          if (dx > 0 && pageNum > 1) renderPdfPage(pageNum - 1);
          else if (dx < 0 && pdfDoc && pageNum < pdfDoc.numPages) renderPdfPage(pageNum + 1);
        }, { passive: true });
        wrap.addEventListener('click', function (e) {
          var r = wrap.getBoundingClientRect();
          var x = e.clientX - r.left;
          if (x < r.width * 0.3 && pageNum > 1) renderPdfPage(pageNum - 1);
          else if (x > r.width * 0.7 && pdfDoc && pageNum < pdfDoc.numPages) renderPdfPage(pageNum + 1);
        });
        window.addEventListener('resize', onResize);
      } catch (err) {
        body.innerHTML = '<div class="bk-paper"><p>تعذّر فتح ملف PDF.</p></div>';
        console.error(err);
      }
    } else if (b.chapters && b.chapters.length) {
      body.innerHTML = '<div class="bk-paper-scroll">' + b.chapters.map(function (c) {
        return '<div class="bk-paper"><div class="bk-paper-head">' + esc(c.t) + '</div><p>' +
          esc(c.b).replace(/\n/g, '<br>') + '</p></div>';
      }).join('') + '</div>';
    } else {
      body.innerHTML = '<div class="bk-paper"><p>لا يوجد محتوى.</p></div>';
    }
  }

  var resizeTimer;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (pdfDoc) renderPdfPage(pageNum);
    }, 200);
  }

  function backToList() {
    window.removeEventListener('resize', onResize);
    hideReader();
    var page = document.getElementById('page-books');
    if (page) {
      document.querySelectorAll('.pg').forEach(function (el) { el.classList.remove('on'); });
      page.classList.add('on');
    }
    renderList();
    return false;
  }

  function render() {
    hideReader();
    renderList();
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

  setTimeout(function () {
    if (typeof window.SP === 'function' && !window.SP.__books) {
      var orig = window.SP;
      window.SP = function (id) {
        if (current && id !== 'books') hideReader();
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
