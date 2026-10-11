const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const morgan       = require('morgan');

const config       = require('./config');
const routes       = require('./routes');
const rateLimiter  = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Railway/Render/Heroku خلف proxy: بدونها يرى الـ rate limiter كل المستخدمين كـ IP واحد
app.set('trust proxy', 1);

// ─── Security ─────────────────────────────────────────────────────────────────
app.use(helmet());

const allowed = config.frontendUrl === '*' ? null
  : [...config.frontendUrl.split(',').map(u => u.trim()).filter(Boolean), ...config.nativeOrigins];

app.use(cors({
  origin: allowed
    ? (origin, cb) => cb(null, !origin || allowed.includes(origin))
    : '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ─── Parsing ──────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: false }));

// ─── Logging ─────────────────────────────────────────────────────────────────
if (config.nodeEnv !== 'test') {
  app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
}

// ─── Rate Limiting ────────────────────────────────────────────────────────────
app.use('/api', rateLimiter);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api', routes);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'المسار غير موجود' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT   = config.port;
const server = app.listen(PORT, () => {
  console.log(`\n🌙 Huda Backend running on http://localhost:${PORT}`);
  console.log(`   ENV      : ${config.nodeEnv}`);
  console.log(`   Groq Key : ${config.groqApiKey ? '✅ Configured' : '⚠️  Not set (.env)'}`);
  console.log(`   Models   : ${config.groqModels.join(', ')}`);
  console.log(`   CORS     : ${config.frontendUrl}\n`);
});

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
function shutdown(signal) {
  console.log(`\n[Server] ${signal} received — shutting down gracefully`);
  server.close(() => {
    console.log('[Server] Closed. Goodbye 🌙');
    process.exit(0);
  });
  // force-kill بعد 10 ثواني لو الإغلاق اتأخر
  setTimeout(() => process.exit(1), 10_000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

// ─── Catch Unhandled Errors ───────────────────────────────────────────────────
process.on('unhandledRejection', (reason) => {
  console.error('[UnhandledRejection]', reason);
});
process.on('uncaughtException', (err) => {
  console.error('[UncaughtException]', err && err.stack ? err.stack : err);
  // Do not keep serving after undefined process state
  try {
    server.close(() => process.exit(1));
  } catch (_) {
    process.exit(1);
  }
  setTimeout(() => process.exit(1), 5_000).unref();
});

module.exports = app;
