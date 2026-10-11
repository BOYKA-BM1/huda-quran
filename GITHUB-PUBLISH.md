# نشر هُدى القرآن: موقع + تطبيق

## أ) الموقع (GitHub Pages) — رابط تشاركه مع الناس

بعد رفع المشروع وتفعيل Pages، الرابط يكون مثل:

`https://USER.github.io/huda-quran/`

(استبدل USER باسمك على GitHub)

### تفعيل مرة واحدة من إعدادات المستودع

1. المستودع → **Settings** → **Pages**
2. تحت **Build and deployment**:
   - Source: **GitHub Actions**
3. احفظ. بعد أول push أو تشغيل workflow **Deploy GitHub Pages** يظهر الرابط.

### ملاحظة مهمة

- الملفات المنشورة هي محتويات مجلد **`www/`** (فيها `index.html`).
- لا تحتاج تنقل `index.html` لجذر المستودع؛ الـ workflow ينشر `www` كجذر الموقع.

---

## ب) التطبيق (APK)

1. **Actions** → **Build APK** → **Run workflow**
2. بعد النجاح: **Artifacts** → حمّل `huda-quran-apk`
3. ثبّت `app-debug.apk` على الموبايل

---

## ج) أوامر الرفع من لينكس (بعد ما يكون الـ commit جاهز)

```bash
cd ~/Downloads/huda
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/huda-quran.git
# لو remote موجود مسبقاً:
# git remote set-url origin https://github.com/YOUR_USERNAME/huda-quran.git
git push -u origin main
```

لو طلب كلمة مرور: استخدم **Personal Access Token** وليس باسورد الحساب.
