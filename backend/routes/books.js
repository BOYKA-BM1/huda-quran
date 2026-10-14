const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const router = express.Router();

const DATA_DIR = process.env.BOOKS_DATA_DIR
  ? path.resolve(process.env.BOOKS_DATA_DIR)
  : path.join(__dirname, '..', 'data', 'books');
const FILES_DIR = path.join(DATA_DIR, 'files');
const CATALOG = path.join(DATA_DIR, 'catalog.json');
const ADMIN_KEY = process.env.ADMIN_KEY || 'huda-admin-13-4-2024';

function ensureDirs() {
  fs.mkdirSync(FILES_DIR, { recursive: true });
  if (!fs.existsSync(CATALOG)) fs.writeFileSync(CATALOG, '[]', 'utf8');
}

function readCatalog() {
  ensureDirs();
  try {
    const raw = fs.readFileSync(CATALOG, 'utf8');
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (e) {
    return [];
  }
}

function writeCatalog(list) {
  ensureDirs();
  fs.writeFileSync(CATALOG, JSON.stringify(list, null, 2), 'utf8');
}

function publicBook(b, req) {
  const base = (req.protocol || 'http') + '://' + (req.get('host') || 'localhost');
  return {
    id: b.id,
    title: b.title,
    author: b.author || '',
    cat: b.cat || 'إسلامي',
    hasPdf: !!b.hasPdf,
    coverUrl: b.coverUrl || '',
    pdfUrl: b.hasPdf ? (base + '/api/books/file/' + b.id) : '',
    chapters: b.chapters || [],
    createdAt: b.createdAt || Date.now(),
    shared: true
  };
}

function checkAdmin(req, res) {
  const key = req.get('X-Admin-Key') || req.query.adminKey || (req.body && req.body.adminKey);
  if (key !== ADMIN_KEY) {
    res.status(401).json({ success: false, error: 'غير مصرح' });
    return false;
  }
  return true;
}

// list
router.get('/', (req, res) => {
  const list = readCatalog().map((b) => publicBook(b, req));
  res.json({ success: true, books: list });
});

// get one
router.get('/:id', (req, res) => {
  const b = readCatalog().find((x) => x.id === req.params.id);
  if (!b) return res.status(404).json({ success: false, error: 'غير موجود' });
  res.json({ success: true, book: publicBook(b, req) });
});

// file
router.get('/file/:id', (req, res) => {
  const b = readCatalog().find((x) => x.id === req.params.id);
  if (!b || !b.hasPdf || !b.fileName) return res.status(404).json({ error: 'الملف غير موجود' });
  const fp = path.join(FILES_DIR, b.fileName);
  if (!fs.existsSync(fp)) return res.status(404).json({ error: 'الملف غير موجود' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename="' + (b.fileName || 'book.pdf') + '"');
  fs.createReadStream(fp).pipe(res);
});

// cover file optional
router.get('/cover/:id', (req, res) => {
  const b = readCatalog().find((x) => x.id === req.params.id);
  if (!b || !b.coverFile) return res.status(404).end();
  const fp = path.join(FILES_DIR, b.coverFile);
  if (!fs.existsSync(fp)) return res.status(404).end();
  res.sendFile(fp);
});

// create — JSON with base64 pdf/cover (works without multer)
router.post('/', express.json({ limit: '40mb' }), (req, res) => {
  if (!checkAdmin(req, res)) return;
  try {
    ensureDirs();
    const body = req.body || {};
    const id = 'bk_' + Date.now().toString(36) + crypto.randomBytes(2).toString('hex');
    const book = {
      id,
      title: String(body.title || '').trim() || 'بدون عنوان',
      author: String(body.author || '').trim(),
      cat: String(body.cat || '').trim() || 'إسلامي',
      hasPdf: false,
      fileName: '',
      coverFile: '',
      coverUrl: '',
      chapters: Array.isArray(body.chapters) ? body.chapters : [],
      createdAt: Date.now()
    };

    if (body.pdfBase64) {
      const buf = Buffer.from(String(body.pdfBase64).replace(/^data:application\/pdf;base64,/, ''), 'base64');
      book.fileName = id + '.pdf';
      book.hasPdf = true;
      fs.writeFileSync(path.join(FILES_DIR, book.fileName), buf);
    }
    if (body.coverBase64) {
      const m = String(body.coverBase64).match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
      const ext = m ? (m[1].split('/')[1] || 'jpg').replace('jpeg', 'jpg') : 'jpg';
      const data = m ? m[2] : String(body.coverBase64);
      book.coverFile = id + '_cover.' + ext;
      fs.writeFileSync(path.join(FILES_DIR, book.coverFile), Buffer.from(data, 'base64'));
      book.coverUrl = '/api/books/cover/' + id;
    }

    const list = readCatalog();
    list.unshift(book);
    writeCatalog(list);
    res.json({ success: true, book: publicBook(book, req) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: 'فشل الحفظ' });
  }
});

// delete
router.delete('/:id', (req, res) => {
  if (!checkAdmin(req, res)) return;
  const list = readCatalog();
  const idx = list.findIndex((x) => x.id === req.params.id);
  if (idx < 0) return res.status(404).json({ success: false, error: 'غير موجود' });
  const b = list[idx];
  list.splice(idx, 1);
  writeCatalog(list);
  try {
    if (b.fileName) fs.unlinkSync(path.join(FILES_DIR, b.fileName));
    if (b.coverFile) fs.unlinkSync(path.join(FILES_DIR, b.coverFile));
  } catch (e) {}
  res.json({ success: true });
});

module.exports = router;
