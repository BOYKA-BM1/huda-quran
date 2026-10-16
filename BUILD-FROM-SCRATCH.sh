#!/bin/bash
# ═══════════════════════════════════════════════════════════
# Huda Al Quran — بناء APK من الصفر (دقيق)
# ═══════════════════════════════════════════════════════════
set -e
cd ~/Downloads

echo "=== 1) تجهيز المشروع ==="
rm -rf huda-upload
git clone https://github.com/BOYKA-BM1/huda-quran.git huda-upload
cd huda-upload

echo "=== 2) ضمان وجود www كاملة من docs ==="
if [ ! -f docs/index.html ]; then
  echo "ERROR: docs/index.html missing — ارفع ملفات الموقع أولاً"
  exit 1
fi
rm -rf www
mkdir -p www
cp -a docs/. www/
# لا ترفع الـ APK داخل www لو كان موجوداً بالخطأ بحجم ضخم مكرر
# (نتركه في docs فقط للتحميل من الموقع)

echo "=== 3) إعداد Capacitor ==="
# انسخ إعداد التحديث الحي
cat > capacitor.config.json << 'EOF'
{
  "appId": "com.huda.alquran",
  "appName": "Huda Al Quran",
  "webDir": "www",
  "backgroundColor": "#030A06",
  "server": {
    "androidScheme": "https",
    "url": "https://boyka-bm1.github.io/huda-quran/",
    "cleartext": false
  },
  "android": {
    "allowMixedContent": false,
    "backgroundColor": "#030A06"
  },
  "plugins": {
    "LocalNotifications": {
      "iconColor": "#C9A84C"
    }
  }
}
EOF

export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
export ANDROID_HOME=$HOME/Android/Sdk
export ANDROID_SDK_ROOT=$ANDROID_HOME
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH"

npm install
npx cap add android 2>/dev/null || true
npx cap sync android

echo "=== 4) الأيقونة من لوجو الموقع ==="
ICON=""
for c in docs/icons/icon-512.png docs/icons/logo.png www/icons/icon-512.png; do
  [ -f "$c" ] && ICON="$c" && break
done
RES=android/app/src/main/res
if [ -n "$ICON" ] && [ -d "$RES" ]; then
  for pair in "mipmap-mdpi:48" "mipmap-hdpi:72" "mipmap-xhdpi:96" "mipmap-xxhdpi:144" "mipmap-xxxhdpi:192"; do
    dir="${pair%%:*}"; size="${pair##*:}"
    mkdir -p "$RES/$dir"
    if command -v convert >/dev/null 2>&1; then
      convert "$ICON" -resize "${size}x${size}" "$RES/$dir/ic_launcher.png"
      convert "$ICON" -resize "${size}x${size}" "$RES/$dir/ic_launcher_round.png"
      convert "$ICON" -resize "${size}x${size}" "$RES/$dir/ic_launcher_foreground.png"
    else
      cp "$ICON" "$RES/$dir/ic_launcher.png"
      cp "$ICON" "$RES/$dir/ic_launcher_round.png"
    fi
  done
  echo "Icons OK from $ICON"
else
  echo "WARN: no icon source found"
fi

echo "=== 5) صلاحيات Manifest ==="
MAN=android/app/src/main/AndroidManifest.xml
if [ -f "$MAN" ]; then
  for p in INTERNET ACCESS_NETWORK_STATE ACCESS_COARSE_LOCATION ACCESS_FINE_LOCATION POST_NOTIFICATIONS VIBRATE RECEIVE_BOOT_COMPLETED SCHEDULE_EXACT_ALARM WAKE_LOCK; do
    grep -q "android.permission.$p" "$MAN" || \
      sed -i "s|<application|<uses-permission android:name=\"android.permission.$p\" />\n    <application|" "$MAN"
  done
  echo "Permissions OK"
fi

echo "=== 6) بناء APK ==="
cd android
echo "sdk.dir=$ANDROID_HOME" > local.properties
./gradlew clean assembleDebug
cp app/build/outputs/apk/debug/app-debug.apk ~/Downloads/Huda-Al-Quran.apk
ls -lh ~/Downloads/Huda-Al-Quran.apk
echo "=== DONE ==="
echo "ثبّت: ~/Downloads/Huda-Al-Quran.apk"
echo "ثم ارفع نفس الملف إلى docs/ للتحميل من الموقع:"
echo "  cd ~/Downloads/huda-upload"
echo "  cp ~/Downloads/Huda-Al-Quran.apk docs/"
echo "  git add docs/Huda-Al-Quran.apk && git commit -m 'Add APK for direct download' && git push"
