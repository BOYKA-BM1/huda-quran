#!/bin/bash
set -e
cd "$(dirname "$0")"
export JAVA_HOME="${JAVA_HOME:-/usr/lib/jvm/java-21-openjdk-amd64}"
export ANDROID_HOME="${ANDROID_HOME:-$HOME/Android/Sdk}"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH"

echo "== sync www =="
cp -a docs/. www/

echo "== npm / cap =="
npm install
if [ ! -d android ]; then
  npx cap add android
fi
npx cap sync android

echo "== permissions =="
MAN=android/app/src/main/AndroidManifest.xml
if [ -f "$MAN" ]; then
  grep -q ACCESS_FINE_LOCATION "$MAN" || sed -i 's|<application|<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />\n    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />\n    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />\n    <uses-permission android:name="android.permission.VIBRATE" />\n    <application|' "$MAN"
fi

echo "== launcher icons from logo =="
ICON_SRC=""
for c in www/icons/icon-512.png www/icons/logo.png docs/icons/icon-512.png; do
  [ -f "$c" ] && ICON_SRC="$c" && break
done
if [ -n "$ICON_SRC" ]; then
  for dens in mdpi:48 hdpi:72 xhdpi:96 xxhdpi:144 xxxhdpi:192; do
    name="${dens%%:*}"; sz="${dens##*:}"
    dir="android/app/src/main/res/mipmap-${name}"
    mkdir -p "$dir"
    if command -v convert >/dev/null 2>&1; then
      convert "$ICON_SRC" -resize ${sz}x${sz} "$dir/ic_launcher.png"
      convert "$ICON_SRC" -resize ${sz}x${sz} "$dir/ic_launcher_round.png"
      convert "$ICON_SRC" -resize ${sz}x${sz} "$dir/ic_launcher_foreground.png"
    else
      cp "$ICON_SRC" "$dir/ic_launcher.png"
      cp "$ICON_SRC" "$dir/ic_launcher_round.png"
    fi
  done
  mkdir -p android/app/src/main/res/drawable
  if command -v convert >/dev/null 2>&1; then
    convert www/icons/icon-96.png -resize 96x96 -colorspace gray -fill white -colorize 100% \
      android/app/src/main/res/drawable/ic_stat_huda.png 2>/dev/null || \
      cp www/icons/icon-96.png android/app/src/main/res/drawable/ic_stat_huda.png
  else
    cp www/icons/icon-96.png android/app/src/main/res/drawable/ic_stat_huda.png 2>/dev/null || true
  fi
  echo "icons OK from $ICON_SRC"
else
  echo "WARNING: no icon source found"
fi

echo "== build =="
cd android
echo "sdk.dir=$ANDROID_HOME" > local.properties
./gradlew assembleDebug
cp app/build/outputs/apk/debug/app-debug.apk "$HOME/Downloads/Huda-Al-Quran.apk"
ls -lh "$HOME/Downloads/Huda-Al-Quran.apk"
echo "DONE"
