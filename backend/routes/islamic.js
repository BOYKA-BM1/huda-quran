const express = require('express');
const router  = express.Router();
const db      = require('../services/islamicDb');

// GET /api/islamic/ahadith?q=...&limit=5
router.get('/ahadith', (req, res) => {
  const { q, limit = 5, topic } = req.query;
  let results = q ? db.searchHadith(q, parseInt(limit)) : db.DB.ahadith.slice(0, parseInt(limit));
  if (topic) results = results.filter(h => h.topic === topic);
  res.json({ success: true, count: results.length, data: results });
});

// GET /api/islamic/adiyah?q=...&time=الصباح
router.get('/adiyah', (req, res) => {
  const { q, time, limit = 5 } = req.query;
  let results = q ? db.searchDua(q, parseInt(limit)) : db.DB.adiyah.slice(0, parseInt(limit));
  if (time) results = results.filter(d => d.time === time);
  res.json({ success: true, count: results.length, data: results });
});

// GET /api/islamic/quran?q=...
router.get('/quran', (req, res) => {
  const { q, limit = 5 } = req.query;
  if (!q) return res.status(400).json({ success: false, error: 'q parameter required' });
  const results = db.searchQuranMeta(q, parseInt(limit));
  res.json({ success: true, count: results.length, data: results });
});

// GET /api/islamic/surahs
router.get('/surahs', (req, res) => {
  res.json({ success: true, count: 114, data: db.DB.quranMeta.surahs });
});

// GET /api/islamic/tafsir/:surah
router.get('/tafsir/:surah', (req, res) => {
  const n = parseInt(req.params.surah);
  if (isNaN(n) || n < 1 || n > 114)
    return res.status(400).json({ success: false, error: 'رقم السورة يجب أن يكون بين 1 و 114' });
  const t = db.getTafsir(n);
  if (!t) return res.status(404).json({ success: false, error: 'لا يوجد تفسير لهذه السورة حالياً' });
  res.json({ success: true, data: t });
});

// GET /api/islamic/reciters
router.get('/reciters', (req, res) => {
  res.json({ success: true, count: db.getAllReciters().length, data: db.getAllReciters() });
});

// GET /api/islamic/audio/:reciter/:surah
router.get('/audio/:reciter/:surah', (req, res) => {
  const { reciter, surah } = req.params;
  const n = parseInt(surah);
  if (isNaN(n) || n < 1 || n > 114)
    return res.status(400).json({ success: false, error: 'رقم سورة غير صحيح' });
  const rec = db.getReciter(reciter);
  if (!rec)
    return res.status(404).json({ success: false, error: 'القارئ غير موجود' });
  const urls = db.buildAudioUrls(reciter, n);
  res.json({ success: true, reciter: rec.name, surah: n, urls, primary: urls[0] || null });
});

// GET /api/islamic/search?q=... — unified search across all datasets
router.get('/search', (req, res) => {
  const { q, limit = 3 } = req.query;
  if (!q) return res.status(400).json({ success: false, error: 'q parameter required' });
  const l = parseInt(limit);
  res.json({
    success:  true,
    query:    q,
    quran:    db.searchQuranMeta(q, l),
    ahadith:  db.searchHadith(q, l),
    adiyah:   db.searchDua(q, l),
  });
});

module.exports = router;
