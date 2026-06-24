#!/bin/bash
# Converts any .avif images in this folder to .jpg (so finicky tools can open
# them) and removes the originals. Filenames/slugs are preserved.
# Run on your Mac:  bash normalize-images.sh
# (Uses sips, built into macOS. No installs needed.)
cd "$(dirname "$0")" || exit 1
shopt -s nullglob
converted=0
for f in *.avif; do
  out="${f%.avif}.jpg"
  if sips -s format jpeg "$f" --out "$out" >/dev/null 2>&1 && [ -s "$out" ]; then
    rm "$f"
    echo "  $f -> $out"
    converted=$((converted+1))
  else
    echo "  FAILED: $f (left in place)"
  fi
done
[ "$converted" -eq 0 ] && echo "No .avif files to convert." || echo "Converted $converted file(s)."
