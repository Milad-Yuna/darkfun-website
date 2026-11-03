#!/usr/bin/env bash
# Fonts the logo is built from: Amiri Bold (Khaled Hosny) and Bodoni Moda ExtraBold (Owen Earl),
# both SIL Open Font License, via Google Fonts.
set -euo pipefail
cd "$(dirname "$0")"; mkdir -p fonts
get() { url=$(curl -sS "https://fonts.googleapis.com/css2?family=$1" | grep -o 'https://[^)]*\.ttf' | head -1); curl -sSfo "fonts/$2" "$url"; echo "saved fonts/$2"; }
get "Amiri:wght@700" Amiri-Bold.ttf
get "Bodoni+Moda:opsz,wght@96,800" BodoniModa-800.ttf
