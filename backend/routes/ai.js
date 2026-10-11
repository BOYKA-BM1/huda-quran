const express = require('express');
const rateLimit = require('express-rate-limit');
const { Readable } = require('stream');
const router = express.Router();
const config = require('../config');
const { callAI, openStream } = require('../services/aiService');
const { buildRagContext } = require('../services/islamicDb');

const VALID_ROLES    = new Set(['user', 'assistant']);
const MAX_MSG_LENGTH = 4000;
const MAX_MESSAGES   = 30;

// حدّ أشد لطلبات الذكاء الاصطناعي (فوق الحد العام)
const aiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.aiMax,
  standardHeaders: true, legacyHeaders: false,
  message: { success: false, error: 'أرسلت أسئلة كثيرة بسرعة. انتظر دقيقة ثم حاول مجدداً.' }
});

/** يتحقق من الرسائل ويرجع {error} أو {messages} نظيفة (role/content فقط) */
function validate(body) {
  const { messages } = body || {};
  if (!Array.isArray(messages) || messages.length === 0) return { error: 'الرجاء إرسال قائمة رسائل صحيحة' };
  if (messages.length > MAX_MESSAGES) return { error: `الحد الأقصى ${MAX_MESSAGES} رسالة` };
  const clean = [];
  for (const msg of messages) {
    if (!msg || !VALID_ROLES.has(msg.role)) return { error: 'دور رسالة غير صالح' };
    if (typeof msg.content !== 'string' || !msg.content.trim()) return { error: 'محتوى الرسالة لا يمكن أن يكون فارغاً' };
    if (msg.content.length > MAX_MSG_LENGTH) return { error: `رسالة تتجاوز ${MAX_MSG_LENGTH} حرف` };
    clean.push({ role: msg.role, content: msg.content.trim() });
  }
  return { messages: clean };
}

function ragFor(messages) {
  const lastUser = [...messages].reverse().find(m => m.role === 'user');
  return lastUser ? buildRagContext(lastUser.content) : '';
}

// رد كامل — يستخدمه التفسير بالذكاء الاصطناعي وصفحات أخرى
router.post('/chat', aiLimiter, async (req, res, next) => {
  try {
    const v = validate(req.body);
    if (v.error) return res.status(400).json({ success: false, error: v.error });
    const ragContext = req.body.useRag === false ? '' : ragFor(v.messages);
    const reply = await callAI(v.messages, ragContext);
    res.json({ success: true, reply, hasRagContext: ragContext.length > 0 });
  } catch (err) { next(err); }
});

// رد متدفق (SSE) — تستخدمه صفحة السؤال والجواب. المفتاح لا يغادر السيرفر أبداً.
router.post('/chat/stream', aiLimiter, async (req, res, next) => {
  try {
    const v = validate(req.body);
    if (v.error) return res.status(400).json({ success: false, error: v.error });
    const upstream = await openStream(v.messages, ragFor(v.messages));

    res.status(200).set({
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no'
    });
    if (res.flushHeaders) res.flushHeaders();

    const body = Readable.fromWeb(upstream.body);
    req.on('close', () => body.destroy());
    body.on('error', () => res.end());
    body.pipe(res);
  } catch (err) { next(err); }
});

router.get('/health', (req, res) => {
  const ok = Boolean(config.groqApiKey);
  res.json({ success: true, configured: ok,
    message: ok ? 'خدمة الذكاء الاصطناعي جاهزة' : 'لم يتم تكوين مفتاح الذكاء الاصطناعي على الخادم' });
});

module.exports = router;
module.exports.validate = validate;
