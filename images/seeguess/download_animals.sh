#!/bin/bash
# Downloads the AI-generated Animales images and saves them as square JPGs
# with the exact filenames from MANIFEST.txt.
# Run on your Mac:  bash download_animals.sh
# (Uses curl + sips, both built into macOS. No installs needed.)
#
# NOTE: these are temporary cloud URLs — run this soon, they may expire.

set -e
cd "$(dirname "$0")"

# filename  ->  source URL
download() {
  local name="$1" url="$2"
  echo "Fetching $name ..."
  curl -fsSL "$url" -o "_tmp.png"
  # convert PNG -> JPEG (images are already 1024x1024 square)
  sips -s format jpeg "_tmp.png" --out "$name" >/dev/null
  rm -f "_tmp.png"
  echo "  saved $name"
}

download "perro.jpg"   "https://d8j0ntlcm91z4.cloudfront.net/user_3EnMXsVYwUPUqqPLyyr3LDylPpi/hf_20260621_231752_fe128312-3de9-4dc1-a8ef-306342428211.png"
download "gato.jpg"    "https://d8j0ntlcm91z4.cloudfront.net/user_3EnMXsVYwUPUqqPLyyr3LDylPpi/hf_20260621_233038_40d6254a-0d7e-4020-aebe-087ea4b2ec27.png"
download "vaca.jpg"    "https://d8j0ntlcm91z4.cloudfront.net/user_3EnMXsVYwUPUqqPLyyr3LDylPpi/hf_20260621_233039_71a844a2-8e9f-4f08-b246-dd41db1ce76f.png"
download "caballo.jpg" "https://d8j0ntlcm91z4.cloudfront.net/user_3EnMXsVYwUPUqqPLyyr3LDylPpi/hf_20260621_233040_69aeeca5-a783-45cf-84fb-0cf994d5bd89.png"
download "gallina.jpg" "https://d8j0ntlcm91z4.cloudfront.net/user_3EnMXsVYwUPUqqPLyyr3LDylPpi/hf_20260621_233044_efa79b6f-bcd4-48f6-92fe-3ce4bcdeed25.png"

echo ""
echo "Done. 5 images saved into $(pwd)"
