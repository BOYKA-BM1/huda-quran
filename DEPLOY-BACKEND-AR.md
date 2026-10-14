# رفع سيرفر هُدى على Railway (مجاني تقريبًا)

## لماذا السيرفر؟
GitHub Pages يستضيف الموقع فقط (ملفات ثابتة).
رفع الكتب والذكاء الاصطناعي يحتاج سيرفر Node يعمل 24 ساعة.

## الخطوات (مرة واحدة)

### 1) تأكد أن الكود على GitHub
المستودع: https://github.com/BOYKA-BM1/huda-quran
مجلد السيرفر: `backend/`

### 2) أنشئ حساب Railway
1. افتح: https://railway.app
2. Sign up with GitHub
3. اسمح بالوصول للمستودع

### 3) مشروع جديد من GitHub
1. New Project → Deploy from GitHub repo
2. اختر `huda-quran`
3. Root Directory = `backend`
4. Railway سيثبّت الحزم ويشغّل: `node server.js`

### 4) متغيرات البيئة (Variables)
أضف:

```
NODE_ENV=production
FRONTEND_URL=https://boyka-bm1.github.io,https://boyka-bm1.github.io/huda-quran
ADMIN_KEY=huda-admin-13-4-2024
GROQ_API_KEY=ضع_مفتاح_جروك_هنا
BOOKS_DATA_DIR=/data/books
```

### 5) قرص دائم للكتب (مهم)
بدون Volume الكتب تُمسح عند كل إعادة نشر:
1. في خدمة السيرفر → Settings → Volumes
2. Mount path: `/data/books`
3. Size: 1GB يكفي في البداية

### 6) رابط عام (Generate Domain)
1. Settings → Networking → Generate Domain
2. انسخ الرابط مثل: `https://huda-quran-production.up.railway.app`

### 7) اربط الموقع بالسيرفر
في الملفات:
- `docs/js/config.js`
- `www/js/config.js`

ضع:

```js
var PRODUCTION_BACKEND = 'https://رابط-railway-بتاعك.up.railway.app/api';
```

ثم:

```bash
git add docs/js/config.js www/js/config.js
git commit -m "Point frontend to Railway backend"
git push
```

### 8) اختبار
افتح في المتصفح:
`https://رابط-railway/api/health`

يجب أن ترى JSON فيه `"status":"ok"`.

### 9) رفع كتاب من الموبايل
1. افتح الموقع
2. بحث القرآن → اكتب `13/4/2024`
3. ارفع PDF
4. يظهر على كل الأجهزة

## ملاحظات
- FRONTEND_URL لازم يطابق عنوان موقعك وإلا السيرفر يرفض الطلبات في الإنتاج.
- ADMIN_KEY لازم يطابق `adminKey` في config.js
- لا ترفع ملف `.env` على GitHub
