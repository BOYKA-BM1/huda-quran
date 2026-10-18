#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
export JAVA_HOME="${JAVA_HOME:-/usr/lib/jvm/java-21-openjdk-amd64}"
export ANDROID_HOME="${ANDROID_HOME:-$HOME/Android/Sdk}"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH"

echo "== sync www from docs =="
mkdir -p www
cp -a docs/. www/

echo "== npm + capacitor =="
npm install
if [ ! -d android ]; then
  npx cap add android
fi
npx cap sync android

# Permissions
MAN=android/app/src/main/AndroidManifest.xml
if [ -f "$MAN" ]; then
  for p in ACCESS_FINE_LOCATION ACCESS_COARSE_LOCATION POST_NOTIFICATIONS VIBRATE RECEIVE_BOOT_COMPLETED SCHEDULE_EXACT_ALARM FOREGROUND_SERVICE; do
    grep -q "android.permission.$p" "$MAN" || sed -i "s|<application|    <uses-permission android:name=\"android.permission.$p\" />\n    <application|" "$MAN"
  done
fi

# Notification small icon
mkdir -p android/app/src/main/res/drawable
if command -v convert >/dev/null 2>&1 && [ -f www/icons/icon-192.png ]; then
  convert www/icons/icon-192.png -resize 96x96 -colorspace gray -fill white -colorize 100% \
    android/app/src/main/res/drawable/ic_stat_huda.png || cp www/icons/icon-96.png android/app/src/main/res/drawable/ic_stat_huda.png
else
  cp www/icons/icon-96.png android/app/src/main/res/drawable/ic_stat_huda.png 2>/dev/null || true
fi

# Launcher icons from logo
if command -v convert >/dev/null 2>&1 && [ -f www/icons/icon-512.png ]; then
  for s in 48 72 96 144 192; do
    d="android/app/src/main/res/mipmap-mdpi"
    case $s in
      48) d="android/app/src/main/res/mipmap-mdpi";;
      72) d="android/app/src/main/res/mipmap-hdpi";;
      96) d="android/app/src/main/res/mipmap-xhdpi";;
      144) d="android/app/src/main/res/mipmap-xxhdpi";;
      192) d="android/app/src/main/res/mipmap-xxxhdpi";;
    esac
    mkdir -p "$d"
    convert www/icons/icon-512.png -resize ${s}x${s} "$d/ic_launcher.png"
    convert www/icons/icon-512.png -resize ${s}x${s} "$d/ic_launcher_round.png"
  done
  echo "Icons OK"
fi

echo "sdk.dir=$ANDROID_HOME" > android/local.properties
cd android
./gradlew assembleDebug
cp app/build/outputs/apk/debug/app-debug.apk "$HOME/Downloads/Huda-Al-Quran.apk"
ls -lh "$HOME/Downloads/Huda-Al-Quran.apk"
echo "APK_READY"
