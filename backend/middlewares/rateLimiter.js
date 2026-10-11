const rateLimit = require('express-rate-limit');
const config    = require('../config');

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'تم تجاوز الحد المسموح. حاول بعد دقيقة.'
  }
});

module.exports = limiter;
