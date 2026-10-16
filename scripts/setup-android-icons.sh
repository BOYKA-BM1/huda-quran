#!/bin/bash
# يضبط أيقونة التطبيق من docs/icons/icon-512.png
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ICON="$ROOT/docs/icons/icon-512.png"
[ -f "$ICON" ] || ICON="$ROOT/docs/icons/logo.png"
[ -f "$ICON" ] || { echo "No icon found"; exit 1; }

RES="$ROOT/android/app/src/main/res"
if [ ! -d "$RES" ]; then
  echo "android project missing — run: npx cap add android"
  exit 1
fi

# يحتاج ImageMagick أو ينسخ نفس الملف لكل مجلد
copy_icon() {
  local dir="$1" size="$2"
  mkdir -p "$RES/$dir"
  if command -v convert >/dev/null 2>&1; then
    convert "$ICON" -resize "${size}x${size}" "$RES/$dir/ic_launcher.png"
    convert "$ICON" -resize "${size}x${size}" "$RES/$dir/ic_launcher_round.png"
    convert "$ICON" -resize "${size}x${size}" "$RES/$dir/ic_launcher_foreground.png"
  else
    cp "$ICON" "$RES/$dir/ic_launcher.png"
    cp "$ICON" "$RES/$dir/ic_launcher_round.png"
    cp "$ICON" "$RES/$dir/ic_launcher_foreground.png"
  fi
}

copy_icon mipmap-mdpi 48
copy_icon mipmap-hdpi 72
copy_icon mipmap-xhdpi 96
copy_icon mipmap-xxhdpi 144
copy_icon mipmap-xxxhdpi 192

echo "Icons installed from $ICON"
