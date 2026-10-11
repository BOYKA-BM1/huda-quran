const config = require('../config');

function errorHandler(err, req, res, next) {
  const status  = err.status || 500;

  // في production: رسالة عامة للمستخدم، التفاصيل في الـ log فقط
  const message = config.nodeEnv === 'production' && status === 500
    ? 'خطأ داخلي في الخادم'
    : (err.message || 'خطأ داخلي في الخادم');

  // سجّل الـ stack دائماً على السيرفر (مش في الـ response)
  if (status >= 500) {
    console.error('[Error]', err.stack || err.message);
  }

  res.status(status).json({ success: false, error: message });
}

module.exports = errorHandler;
