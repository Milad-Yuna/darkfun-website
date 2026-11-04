# Jostoju · جستجو: brand

The brand bible is [`brand-bible.html`](brand-bible.html), published at https://claude.ai/artifact/P2NZiSQbeptssPGfc3gAVf.
It is bilingual: Persian (right to left) by default, with an English switch.

## Version 2.1 · Qajar · November 2026 / آبان ۱۴۰۵

What changed in 2.1:
- **Origin:** the Qajar camera.
- **Logo:** the end-of-story rule.
- **Images:** the hidden lost dot in every image, and the real artwork gallery with image-making rules.
- **Motion:** the «آینه‌کاری» mirror-hall effect.
- **Applications and website:** updated to the real site.
- **New chapter 17:** Instagram.

| | |
|---|---|
| Name | **جستجو · Jostoju**: *jost* (sought) + *o* (and) + *ju* (seek) |
| Master tagline | آنچه یافت می‌نشود، می‌سازیم. · *We make what cannot be found.* |
| Logotype | «جُسْتُجُو» on Amiri Bold. The long stretch is the road, and the dot of *ju* waits ahead of the word, unattached. |
| Symbol | The Missing Knot (گره گمشده) |
| Colours | Shab `#16110E` · Morvarid `#F4EDE0` · Runas `#A3261F` · Zomorrod `#1F5A46` · Tala `#D4A640` · Lajvard `#233C8E` · Gol `#E39AA6` · Kaghaz `#E7D9BD` |
| Type | Amiri · Vazirmatn · Noto Nastaliq Urdu · Bodoni Moda · Instrument Sans · JetBrains Mono |

## Files

```
brand/
  brand-bible.html      bilingual bible (built from source/bible.template.html)
  tokens.css · tokens.json
  logo/                 logotype, compact logotype, Latin wordmark, symbol, lockups, favicon
                        suffix = the ground each file is drawn for: shab, morvarid, runas, zomorrod
  art/                  web-sized artworks and site screenshots shown in the bible
  social/               Instagram kit: export/ (upload-ready), preview/ (for the bible), render_social.js
  patterns/             hashiyeh bands, lachak corners, matn fields, toranj, zar-afshan, arch mask
  source/               generators (assets.py, lostdot.py, fontword.py, gen_patterns.py, build_bible.py)
  logotype/             logotype rounds 1 and 2: how we got here
  archive/v1/           the first (Safavid-miniature) bible and logo, kept for reference
```

## Rebuilding

```bash
pip install fonttools uharfbuzz shapely
brand/source/fetch_fonts.sh
cd brand/source && python3 assets.py ../logo && python3 build_bible.py bible.template.html ../brand-bible.html
```

Instagram templates: `NODE_PATH=$(npm root -g) node brand/social/render_social.js` (needs Playwright; edit the text or images in the script).

All fonts are under the SIL Open Font License, which allows modification and use in a logo.
