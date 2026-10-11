require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';

if (!process.env.GROQ_API_KEY) {
  console.warn('⚠️  [Config] GROQ_API_KEY غير موجود — لن تعمل ميزة الذكاء الاصطناعي حتى تضيفه في متغيرات البيئة');
}
// Production: refuse wildcard CORS (security)
if (isProd && (!process.env.FRONTEND_URL || process.env.FRONTEND_URL.trim() === '*')) {
  console.error('❌ [Config] FRONTEND_URL must be an explicit allowlist in production (comma-separated origins). Refusing to start with CORS *.');
  process.exit(1);
}

// نماذج Groq بالترتيب (يمكن تغييرها بدون تعديل الكود: GROQ_MODELS=model1,model2)
// ملاحظة: mixtral-8x7b-32768 أُوقف من Groq فحُذف
const defaultModels = ['openai/gpt-oss-20b', 'openai/gpt-oss-120b'];

module.exports = {
  port:    parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  groqApiKey:  process.env.GROQ_API_KEY || '',
  groqBaseUrl: process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1',
  groqModels:  (process.env.GROQ_MODELS ? process.env.GROQ_MODELS.split(',').map(s => s.trim()).filter(Boolean) : defaultModels),

  // أصول مسموحة: الموقع + تطبيق Capacitor (https://localhost على أندرويد، capacitor://localhost على iOS)
  frontendUrl: process.env.FRONTEND_URL || '*',
  nativeOrigins: ['https://localhost', 'capacitor://localhost', 'http://localhost', 'ionic://localhost'],

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60_000,
    max:      parseInt(process.env.RATE_LIMIT_MAX, 10)        || (isProd ? 120 : 1000),
    aiMax:    parseInt(process.env.RATE_LIMIT_AI_MAX, 10)     || (isProd ? 30 : 500)
  },

  aiSystem: require('./system-prompt'),
  aiTemperature: 0.4,
  aiMaxTokens:   2500
};
