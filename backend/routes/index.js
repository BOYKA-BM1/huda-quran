const express   = require('express');
const router    = express.Router();

const askRoute     = require('./ask');
const aiRoute      = require('./ai');
const islamicRoute = require('./islamic');
const authRoute     = require('./auth');

router.get('/health', (req, res) => {
  res.json({ success: true, status: 'ok', timestamp: new Date().toISOString(),
    endpoints: ['/ask', '/ai/chat', '/ai/chat/stream', '/ai/health',
      '/islamic/ahadith', '/islamic/adiyah', '/islamic/quran',
      '/islamic/surahs', '/islamic/tafsir/:n', '/islamic/reciters',
      '/islamic/audio/:reciter/:surah', '/islamic/search', '/auth/register', '/auth/login', '/auth/me'] });
});

router.use('/ask',     askRoute);
router.use('/ai',      aiRoute);
router.use('/islamic', islamicRoute);
router.use('/auth',    authRoute);

module.exports = router;
