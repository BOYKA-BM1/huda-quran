#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
export JAVA_HOME="${JAVA_HOME:-/usr/lib/jvm/java-21-openjdk-amd64}"
export ANDROID_HOME="${ANDROID_HOME:-$HOME/Android/Sdk}"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH"
echo "== sync www =="
mkdir -p www
cp -a docs/. www/
npm install
if [ ! -d android ]; then npx cap add android; fi
npx cap sync android
MAN=android/app/src/main/AndroidManifest.xml
if [ -f "$MAN" ]; then
  for p in ACCESS_FINE_LOCATION ACCESS_COARSE_LOCATION POST_NOTIFICATIONS VIBRATE RECEIVE_BOOT_COMPLETED SCHEDULE_EXACT_ALARM; do
    grep -q "android.permission.$p" "$MAN" || sed -i "s|<application|    <uses-permission android:name=\"android.permission.$p\" />\n    <application|" "$MAN"
  done
fi
# App icon from logo
ICON_SRC=""
for c in www/icons/logo.png www/icons/icon-512.png www/icons/icon-192.png; do
  [ -f "$c" ] && ICON_SRC="$c" && break
done
if command -v convert >/dev/null 2>&1 && [ -n "$ICON_SRC" ]; then
  for s in 48 72 96 144 192; do
    case $s in
      48) d=mipmap-mdpi;; 72) d=mipmap-hdpi;; 96) d=mipmap-xhdpi;;
      144) d=mipmap-xxhdpi;; 192) d=mipmap-xxxhdpi;;
    esac
    mkdir -p "android/app/src/main/res/$d"
    convert "$ICON_SRC" -resize ${s}x${s} "android/app/src/main/res/$d/ic_launcher.png"
    convert "$ICON_SRC" -resize ${s}x${s} "android/app/src/main/res/$d/ic_launcher_round.png"
  done
  mkdir -p android/app/src/main/res/drawable
  convert "$ICON_SRC" -resize 96x96 -colorspace gray -fill white -colorize 100% \
    android/app/src/main/res/drawable/ic_stat_huda.png || true
  echo "Icons from $ICON_SRC"
fi
echo "sdk.dir=$ANDROID_HOME" > android/local.properties
cd android
./gradlew assembleDebug
cp app/build/outputs/apk/debug/app-debug.apk "$HOME/Downloads/Huda-Al-Quran.apk"
ls -lh "$HOME/Downloads/Huda-Al-Quran.apk"
echo APK_READY
