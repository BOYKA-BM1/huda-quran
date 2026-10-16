#!/bin/bash
set -e
cd "$(dirname "$0")"
export JAVA_HOME="${JAVA_HOME:-/usr/lib/jvm/java-21-openjdk-amd64}"
export ANDROID_HOME="${ANDROID_HOME:-$HOME/Android/Sdk}"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH"

# نسخ الويب
cp -a docs/. www/

# أيقونات
bash scripts/setup-android-icons.sh 2>/dev/null || true

# صلاحيات الموقع في Manifest
MAN=android/app/src/main/AndroidManifest.xml
if [ -f "$MAN" ]; then
  for p in ACCESS_COARSE_LOCATION ACCESS_FINE_LOCATION POST_NOTIFICATIONS VIBRATE; do
    grep -q "$p" "$MAN" || sed -i "s|<application|<uses-permission android:name=\"android.permission.$p\" />\n    <application|" "$MAN"
  done
fi

npx cap sync android
cd android
echo "sdk.dir=$ANDROID_HOME" > local.properties
./gradlew assembleDebug
cp app/build/outputs/apk/debug/app-debug.apk ../../Huda-Al-Quran.apk 2>/dev/null || \
cp app/build/outputs/apk/debug/app-debug.apk ../Huda-Al-Quran.apk
echo "APK ready"
ls -lh app/build/outputs/apk/debug/app-debug.apk
