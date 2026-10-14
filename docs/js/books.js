/**
 * مكتبة الكتب — قارئ PDF بملء الشاشة (تصميم خاص)
 */
(function () {
  'use strict';
  var DB_NAME = 'huda_library_db', DB_VER = 1, STORE = 'books';
  var dbp = null, current = null, pdfDoc = null, pageNum = 1, rendering = false, zoomScale = 1;
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
    var tEl = document.getElementById('bk-reader-title');
    var sub = document.getElementById('bk-reader-sub');
    if (tEl) tEl.textContent = title || '';
    if (sub) sub.textContent = author || '';
    document.body.classList.add('bk-noscroll', 'bk-immersive');
    // history: reading state so browser back returns to books list
    try {
      history.pushState({ hudaBookReading: true, page: 'books' }, '', '#books/read');
    } catch (e) {}
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


  async function renderOnePage(n, container, width) {
    var page = await pdfDoc.getPage(n);
    var base = page.getViewport({ scale: 1 });
    var z = zoomScale || 1;
    var cssW = width * z;
    var dpr = Math.min(window.devicePixelRatio || 1, 3);
    var scale = (cssW / base.width) * dpr;
    var viewport = page.getViewport({ scale: scale });
    var holder = document.createElement('div');
    holder.className = 'bk-page-sheet';
    holder.dataset.page = String(n);
    var canvas = document.createElement('canvas');
    canvas.className = 'bk-pdf-canvas';
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    canvas.style.width = Math.floor(cssW) + 'px';
    canvas.style.height = Math.floor(viewport.height / dpr) + 'px';
    holder.appendChild(canvas);
    container.appendChild(holder);
    var ctx = canvas.getContext('2d', { alpha: false });
    // white background under ink for clarity
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport: viewport, background: 'rgba(255,255,255,1)' }).promise;
    return holder;
  }

  var _renderToken = 0;
  async function renderContinuous(preserveScroll) {
    var wrap = document.getElementById('bk-canvas-wrap');
    if (!wrap || !pdfDoc) return;
    var token = ++_renderToken;
    var ratio = 0;
    if (preserveScroll && wrap.scrollHeight > 50) {
      ratio = wrap.scrollTop / wrap.scrollHeight;
    }
    wrap.innerHTML = '';
    var width = Math.max(280, Math.floor(wrap.clientWidth || window.innerWidth));
    var total = pdfDoc.numPages;
    var batch = 4;
    async function nextBatch(start) {
      if (token !== _renderToken || !pdfDoc || !wrap) return;
      var end = Math.min(start + batch - 1, total);
      for (var n = start; n <= end; n++) {
        if (token !== _renderToken) return;
        await renderOnePage(n, wrap, width);
      }
      if (end < total) {
        setTimeout(function () { nextBatch(end + 1); }, 20);
      } else if (preserveScroll && ratio > 0) {
        // restore after full render
        requestAnimationFrame(function () {
          if (wrap && wrap.scrollHeight) wrap.scrollTop = ratio * wrap.scrollHeight;
        });
      }
    }
    await nextBatch(1);
  }

  async function openBook(id) {
    var b = await getBook(id);
    if (!b) { toast('الكتاب غير موجود'); return; }
    current = b;
    zoomScale = 1;
    showReaderShell(b.title, b.author);
    var body = document.getElementById('bk-reader-body');
    if (!body) return;

    if (b.pdfBlob || b.pdfDataUrl) {
      body.innerHTML =
        '<div class="bk-canvas-wrap bk-continuous" id="bk-canvas-wrap"><div class="bk-loading">جاري تحميل الكتاب…</div></div>' +
        '<div class="bk-zoom-bar" id="bk-zoom-bar">' +
        '<button type="button" class="bk-zbtn" id="bk-zoom-out" aria-label="تصغير">−</button>' +
        '<span id="bk-zoom-label">100%</span>' +
        '<button type="button" class="bk-zbtn" id="bk-zoom-in" aria-label="تكبير">+</button>' +
        '</div>';
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
        zoomScale = 1;
        var wrap = document.getElementById('bk-canvas-wrap');
        if (wrap) wrap.innerHTML = '';
        await renderContinuous(false);
        var zin = document.getElementById('bk-zoom-in');
        var zout = document.getElementById('bk-zoom-out');
        var zlab = document.getElementById('bk-zoom-label');
        function updateZoomLabel() {
          if (zlab) zlab.textContent = Math.round((zoomScale || 1) * 100) + '%';
        }
        updateZoomLabel();
        if (zin) zin.onclick = function () {
          zoomScale = Math.min(2.5, Math.round(((zoomScale || 1) + 0.2) * 100) / 100);
          updateZoomLabel();
          renderContinuous(true);
        };
        if (zout) zout.onclick = function () {
          zoomScale = Math.max(0.7, Math.round(((zoomScale || 1) - 0.2) * 100) / 100);
          updateZoomLabel();
          renderContinuous(true);
        };
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
      if (pdfDoc) renderContinuous(true);
    }, 300);
  }

  function backToList() {
    window.removeEventListener('resize', onResize);
    hideReader();
    var page = document.getElementById('page-books');
    if (page) {
      document.querySelectorAll('.pg').forEach(function (el) { el.classList.remove('on'); });
      page.classList.add('on');
    }
    // stay on books page (not home)
    try {
      history.replaceState({ page: 'books' }, '', '#books');
    } catch (e) {}
    if (typeof window.SP === 'function') {
      try { window.SP('books', false); } catch (e) {}
    }
    renderList();
    return false;
  }

  // Browser / phone back button → books list while reading
  window.addEventListener('popstate', function (ev) {
    if (current || document.body.classList.contains('bk-immersive')) {
      // closing reader, land on books
      window.removeEventListener('resize', onResize);
      hideReader();
      var page = document.getElementById('page-books');
      if (page) {
        document.querySelectorAll('.pg').forEach(function (el) { el.classList.remove('on'); });
        page.classList.add('on');
      }
      try { history.replaceState({ page: 'books' }, '', '#books'); } catch (e) {}
      if (typeof window.SP === 'function') {
        try { window.SP('books', false); } catch (e) {}
      }
      renderList();
    }
  });

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
