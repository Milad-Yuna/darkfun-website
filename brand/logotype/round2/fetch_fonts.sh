#!/usr/bin/env bash
# Amiri (Khaled Hosny) and Noto Sans Arabic (Google), both SIL Open Font License, via Google Fonts.
set -euo pipefail
cd "$(dirname "$0")"; mkdir -p fonts
for spec in "Amiri:wght@700|Amiri-Bold.ttf" "Noto+Sans+Arabic:wght@900|NotoSansArabic-Black.ttf"; do
  fam=${spec%%|*}; out=${spec##*|}
  url=$(curl -sS "https://fonts.googleapis.com/css2?family=$fam" | grep -o 'https://[^)]*\.ttf' | head -1)
  curl -sSfo "fonts/$out" "$url"; echo "saved fonts/$out"
done
