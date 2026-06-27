#!/bin/bash
OUT_DIR="out"
find "$OUT_DIR" \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.svg" -o -iname "*.webp" -o -iname "*.gif" -o -iname "*.woff" -o -iname "*.woff2" -o -iname "*.ttf" -o -iname "*.otf" \) -exec chmod 755 {} +
echo "✅ Public asset permissions set to 755 in $OUT_DIR"