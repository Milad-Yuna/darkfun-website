# Jostoju · جستجو — brand

The full brand bible, with strategy, voice, logo, colour, type, pattern, imagery, motion and process, is
[`brand-bible.html`](brand-bible.html). It is also published at https://claude.ai/artifact/P2NZiSQbeptssPGfc3gAVf.

## At a glance

| | |
|---|---|
| Name | **جستجو · Jostoju**: "the quest". Built like گفت‌وگو: *jost* (sought) + *o* (and) + *ju* (seek) |
| Master tagline | **We make what cannot be found.** · آنچه یافت می‌نشود، می‌سازیم. |
| Craft line | Knot by knot, frame by frame. · گره به گره، قاب به قاب. |
| Symbol | The Missing Knot (گره گمشده): 24 diamond knots on a 5 × 5 lattice, centre left open |
| Sub-brands | Kargah · کارگاه (commissions) · Pardeh · پرده (originals) · Naqsheh · نقشه (lab, later) |

## Colour

| Dye | Persian | Hex | Role |
|---|---|---|---|
| Pashm | پشم | `#F2EBDD` | Light ground |
| Kaghaz | کاغذ | `#E4D6BA` | Second light surface |
| Morakkab | مرکب | `#1A1714` | Text on light grounds |
| Nil | نیل | `#121A3F` | Dark ground |
| Lajvard | لاجورد | `#203A8F` | Primary blue · Pardeh |
| Runas | روناس | `#A3261F` | Primary red · Kargah |
| Za'faran | زعفران | `#E2A63B` | Accent · gold in print |
| Firuzeh | فیروزه | `#2E9E97` | Small accents · Naqsheh |

The carpet rule for proportions: 60% field, 25% border, 10% medallion, 5% knots.

## Type

Instrument Serif (EN display) · Markazi Text (FA display) · Instrument Sans (EN text) · Vazirmatn (FA text) ·
JetBrains Mono (labels and timecodes) · Noto Nastaliq Urdu (verse only). All are on Google Fonts.

## Files

```
brand/
  brand-bible.html        the visual brand bible (built from source/brand-bible.template.html)
  tokens.css              CSS custom properties for the website (--jj-*)
  tokens.json             the same tokens as JSON
  logo/                   outlined SVG logos; the suffix names the ground: pashm (light), nil and lajvard (dark)
    favicon.svg
  patterns/               hashiyeh (border), matn (field), lachak (corners), toranj (medallion), zarafshan
  source/                 generators for the logo, patterns and bible
```

## Regenerating

```bash
pip install fonttools uharfbuzz
brand/source/fetch_fonts.sh
python3 brand/source/gen_logo.py                  # writes brand/logo/
python3 brand/source/gen_patterns.py brand/patterns
python3 brand/source/build_bible.py brand/source/brand-bible.template.html brand/brand-bible.html
```

The patterns are stored as *naqsheh* grids in `gen_patterns.py`. Each character is one knot, so you can
redesign a border by editing text.

## Persian logotype (in progress)

Round 1 sketches of a custom, pen-drawn جُسْتُجُو live in [`logotype/`](logotype/) and are published at
https://claude.ai/artifact/LhXyyUmYKhhq6AqecmEPhQ. There are two directions: **Keshideh** (horizontal) and
**Pellekan** (stair). `logotype/source/qalam.py` is the digital reed pen: stroke centre-lines with a cut nib
swept along them. `letters.py` holds the letter forms and `compose.py` arranges them into the two directions.

```bash
pip install shapely
cd brand/logotype/source && python3 build_page.py ../logotype-round1.html
```

**Round 2** (`logotype/logotype-round2.html`, published at https://claude.ai/artifact/KvRs1YsPDj3LAZpG4gfLvd)
sets جُسْتُجُو in Amiri Bold and Noto Sans Arabic Black (both SIL OFL) and adds four ways to make the quest visible:
the Missing Knot (the dot of *ju*, "seek", is empty), the Road (keshideh), the Thread (سرنخ) and the Ascent.
Recommended: **Journey** (Amiri, Road + Missing Knot). Sources in `logotype/round2/`. Run `fetch_fonts.sh` first.

Once a direction is chosen, it replaces the Markazi-based wordmark in `logo/` and in the brand bible.
