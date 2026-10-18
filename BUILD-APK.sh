#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
export JAVA_HOME="${JAVA_HOME:-/usr/lib/jvm/java-21-openjdk-amd64}"
export ANDROID_HOME="${ANDROID_HOME:-$HOME/Android/Sdk}"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH"

mkdir -p www
cp -a docs/. www/
npm install
[ -d android ] || npx cap add android
npx cap sync android

MAN=android/app/src/main/AndroidManifest.xml
if [ -f "$MAN" ]; then
  for p in ACCESS_FINE_LOCATION ACCESS_COARSE_LOCATION POST_NOTIFICATIONS VIBRATE RECEIVE_BOOT_COMPLETED SCHEDULE_EXACT_ALARM WAKE_LOCK FOREGROUND_SERVICE; do
    grep -q "android.permission.$p" "$MAN" || sed -i "s|<application|    <uses-permission android:name=\"android.permission.$p\" />\n    <application|" "$MAN"
  done
fi

# Remove adaptive icon XML so PNG mipmaps are used (fixes Capacitor X icon)
rm -rf android/app/src/main/res/mipmap-anydpi-v26
rm -f android/app/src/main/res/drawable/ic_launcher_background.xml 2>/dev/null || true
rm -f android/app/src/main/res/drawable-v24/ic_launcher_foreground.xml 2>/dev/null || true

ICON_SRC=""
for c in www/icons/icon-512-solid.png www/icons/logo-transparent.png www/icons/logo.png www/icons/icon-512.png; do
  [ -f "$c" ] && ICON_SRC="$c" && break
done
echo "ICON_SRC=$ICON_SRC"
command -v convert >/dev/null || sudo apt-get install -y imagemagick >/dev/null 2>&1 || true
if [ -n "$ICON_SRC" ] && command -v convert >/dev/null; then
  for pair in "48:mdpi" "72:hdpi" "96:xhdpi" "144:xxhdpi" "192:xxxhdpi"; do
    s="${pair%%:*}"; dens="${pair##*:}"
    mkdir -p "android/app/src/main/res/mipmap-$dens"
    convert "$ICON_SRC" -resize ${s}x${s} -background "#030A06" -gravity center -extent ${s}x${s} \
      "android/app/src/main/res/mipmap-$dens/ic_launcher.png"
    convert "$ICON_SRC" -resize ${s}x${s} -background "#030A06" -gravity center -extent ${s}x${s} \
      "android/app/src/main/res/mipmap-$dens/ic_launcher_round.png"
    convert "$ICON_SRC" -resize ${s}x${s} -background "#030A06" -gravity center -extent ${s}x${s} \
      "android/app/src/main/res/mipmap-$dens/ic_launcher_foreground.png"
  done
  mkdir -p android/app/src/main/res/drawable
  convert "$ICON_SRC" -resize 96x96 -colorspace gray -fill white -colorize 100% \
    android/app/src/main/res/drawable/ic_stat_huda.png
  echo "ICONS_WRITTEN"
  ls -la android/app/src/main/res/mipmap-xxhdpi/
else
  echo "WARN no icon"
fi

# Force application icon in manifest if needed
if [ -f "$MAN" ]; then
  sed -i 's/android:icon="@mipmap\/ic_launcher"/android:icon="@mipmap\/ic_launcher"/' "$MAN"
fi

echo "sdk.dir=$ANDROID_HOME" > android/local.properties
cd android
./gradlew clean assembleDebug
cp app/build/outputs/apk/debug/app-debug.apk "$HOME/Downloads/Huda-Al-Quran.apk"
ls -lh "$HOME/Downloads/Huda-Al-Quran.apk"
echo APK_READY
