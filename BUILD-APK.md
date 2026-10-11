# تحويل هُدى القرآن إلى تطبيق Android (APK)

المشروع جاهز بـ **Capacitor**. ما تحتاجش Android Studio على جهازك.

---

## الطريقة 1 — GitHub Actions (موصى بها · مجانية)

1. ارفع مجلد المشروع كامل على مستودع GitHub (Public أو Private).
2. افتح التبويب **Actions**.
3. اختر **Build APK** → **Run workflow**.
4. بعد انتهاء البناء (حوالي 5–10 دقائق) اضغط على الـ run → **Artifacts** → حمّل `huda-quran-apk`.
5. فك الضغط عن الملف → انقل الـ `apk` للموبايل وثبّته (فعّل «مصادر غير معروفة» إن لزم).

> الملف يكون **debug APK** — يكفي للتثبيت الشخصي.  
> لنشر على Google Play تحتاج مفتاح توقيع (keystore) لاحقًا.

---

## الطريقة 2 — تثبيت كـ تطبيق من المتصفح (PWA) فورًا

بدون APK:

1. افتح الموقع على Chrome في الموبايل.
2. القائمة ⋮ → **تثبيت التطبيق** أو **إضافة إلى الشاشة الرئيسية**.
3. يظهر كأيقونة ويعمل بملء الشاشة.

---

## الطريقة 3 — من جهاز فيه Android SDK فقط (سطر أوامر)

```bash
cd huda
npm install
npx cap add android          # مرة واحدة
npx cap sync android
cd android
./gradlew assembleDebug
# الناتج:
# android/app/build/outputs/apk/debug/app-debug.apk
```

---

## ملاحظات

- `appId`: `com.huda.quran`
- اسم التطبيق: **هُدى القرآن**
- مجلد الويب: `www/`
- بعد أي تعديل على الموقع: `npx cap sync android` ثم أعد بناء الـ APK
