#!/usr/bin/env bash
# Download the TTFs the logo generator outlines (SIL Open Font License, via Google Fonts).
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p fonts
curl -sSfo fonts/InstrumentSerif-Regular.ttf https://fonts.gstatic.com/s/instrumentserif/v5/jizBRFtNs2ka5fXjeivQ4LroWlx-2zI.ttf
curl -sSfo fonts/Markazi-Bold.ttf https://fonts.gstatic.com/s/markazitext/v28/sykh-ydym6AtQaiEtX7yhqb_rV1k_81ZVYYZtROXT4M.ttf
curl -sSfo fonts/Markazi-SemiBold.ttf https://fonts.gstatic.com/s/markazitext/v28/sykh-ydym6AtQaiEtX7yhqb_rV1k_81ZVYYZtSqXT4M.ttf
echo "Fonts saved to $(pwd)/fonts"
