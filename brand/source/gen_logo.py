"""Generate Jostoju logo SVGs: outlined wordmarks + knot medallion."""
import os, json, math, uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

SCR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = os.environ.get('FONTS', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fonts'))
OUT = os.environ.get('OUT', os.path.join(SCR, 'logo'))
os.makedirs(OUT, exist_ok=True)

def shape(path, text):
    data = open(path, 'rb').read(); face = hb.Face(data); font = hb.Font(face)
    buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties()
    hb.shape(font, buf, {})
    return [(i.codepoint, i.cluster) for i in buf.glyph_infos], [(p.x_advance, p.x_offset, p.y_offset) for p in buf.glyph_positions]

def split_contours(rec):
    cs, cur = [], []
    for op, args in rec:
        cur.append((op, args))
        if op in ('closePath', 'endPath'):
            cs.append(cur); cur = []
    return cs

def bbox(c):
    pts = [p for _, a in c for p in a]
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
    return min(xs), min(ys), max(xs), max(ys)

def replay(c, pen):
    for op, args in c:
        getattr(pen, op)(*args)

def outline(fontfile, text, scale, is_dot):
    """Return (body_path, dots[list of (cx,cy,size)], width, ascent, descent) in px, y-down, baseline at y=0."""
    f = TTFont(fontfile); gs = f.getGlyphSet(); order = f.getGlyphOrder()
    infos, poss = shape(fontfile, text)
    s = scale / f['head'].unitsPerEm
    pen = SVGPathPen(gs)
    dots = []; x = 0; ymin = 1e9; ymax = -1e9
    for (gid, cl), (adv, xo, yo) in zip(infos, poss):
        g = order[gid]
        rec = DecomposingRecordingPen(gs); gs[g].draw(rec)
        for c in split_contours(rec.value):
            bx = bbox(c)
            if is_dot(g, bx):
                cx = (bx[0] + bx[2]) / 2 + x + xo; cy = (bx[1] + bx[3]) / 2 + yo
                size = max(bx[2] - bx[0], bx[3] - bx[1])
                dots.append((cx * s, -cy * s, size * s))
                continue
            tp = TransformPen(pen, (s, 0, 0, -s, (x + xo) * s, -yo * s))
            replay(c, tp)
            ymin = min(ymin, bx[1] + yo); ymax = max(ymax, bx[3] + yo)
        x += adv
    asc, desc = ymax * s, -ymin * s
    for _, dy, sz in dots:            # make room for the knots replacing the dots
        asc = max(asc, -dy + sz * 0.8 + 1.5); desc = max(desc, dy + sz * 0.8)
    return pen.getCommands(), dots, x * s, asc, desc

def diamond(cx, cy, h):
    return f"M{cx:.2f} {cy-h:.2f}L{cx+h:.2f} {cy:.2f}L{cx:.2f} {cy+h:.2f}L{cx-h:.2f} {cy:.2f}Z"

# ---------- Symbol: the missing-knot medallion ----------
def medallion(cx, cy, a, h, ring_split=False):
    """5x5 lattice of diamonds on a 45deg grid; centre knot omitted.
    a = half the centre-to-centre step, h = knot half-diagonal."""
    outer, inner = [], []
    for i in range(5):
        for j in range(5):
            if i == 2 and j == 2:
                continue
            x = cx + (i - j) * a; y = cy + (i + j - 4) * a
            ring = max(abs(i - 2), abs(j - 2))
            (outer if ring == 2 else inner).append(diamond(x, y, h))
    if ring_split:
        return ''.join(outer), ''.join(inner)
    return ''.join(outer + inner)

A, H = 10, 8.4          # standard: gap = sqrt2*(A-H) ~ 2.26
A_S, H_S = 10, 7.4      # small-size cut: wider gaps survive at 16-32px
SYM_HALF = 4 * A + H    # half-width of the symbol = 48.4

# ---------- Wordmarks ----------
lat_body, lat_dots, lat_w, lat_asc, lat_desc = outline(
    os.path.join(FONTS, 'InstrumentSerif-Regular.ttf'), 'jostoju', 100,
    lambda g, b: g == 'j' and b[1] > 500)
fa_body, fa_dots, fa_w, fa_asc, fa_desc = outline(
    os.path.join(FONTS, 'Markazi-Bold.ttf'), 'جستجو', 168,
    lambda g, b: g in ('uniFEA0', 'uniFE9F', 'uniFE9E', 'uniFE9D') and b[3] < 0)

fa2_body, fa2_dots, fa2_w, fa2_asc, fa2_desc = outline(
    os.path.join(FONTS, 'Markazi-SemiBold.ttf'), 'جستجو', 150,
    lambda g, b: g in ('uniFEA0', 'uniFE9F', 'uniFE9E', 'uniFE9D') and b[3] < 0)
FA2_S = 150 / 2048

meta = dict(lat=dict(w=lat_w, asc=lat_asc, desc=lat_desc, dots=lat_dots),
            fa=dict(w=fa_w, asc=fa_asc, desc=fa_desc, dots=fa_dots))
if os.environ.get('VERBOSE'): print(json.dumps(meta, indent=1))

def lat_dots_svg(dx, dy, scale=1.0):
    # knot slightly larger than the round tittle so it reads as a deliberate diamond
    return ''.join(diamond(dx + x * scale, dy + (y - 1.5) * scale, s * 0.7 * scale) for x, y, s in lat_dots)

def fa_dots_svg(dx, dy, scale=1.0):
    return ''.join(diamond(dx + x * scale, dy + y * scale, s * 0.55 * scale) for x, y, s in fa_dots)

def svg(w, h, body, title, bg=None):
    bgr = f'<rect width="100%" height="100%" fill="{bg}"/>' if bg else ''
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.1f} {h:.1f}" width="{w:.0f}" height="{h:.0f}" role="img" aria-label="{title}">'
            f'<title>{title}</title>{bgr}{body}</svg>\n')

PALETTES = {
    # name: (ink, knot-accent, inner-ring, background-for-preview)
    'pashm': ('#1A1714', '#A3261F', '#A3261F', '#F2EBDD'),   # ink on wool
    'nil':   ('#F2EBDD', '#E2A63B', '#E2A63B', '#121A3F'),   # wool on indigo night
    'lajvard': ('#F2EBDD', '#E2A63B', '#E2A63B', '#203A8F'), # wool on lapis
}

def g(transform, d, fill):
    return f'<path transform="{transform}" d="{d}" fill="{fill}"/>' if transform else f'<path d="{d}" fill="{fill}"/>'

def build(pal_name, ink, acc, inner, bg, with_bg=False):
    B = bg if with_bg else None
    files = {}
    # 1. Symbol (two-tone: outer ring ink, inner ring accent)
    o, i = medallion(SYM_HALF, SYM_HALF, A, H, ring_split=True)
    files['symbol'] = svg(2 * SYM_HALF, 2 * SYM_HALF, g(None, o, ink) + g(None, i, inner), 'Jostoju symbol', B)
    # 1b. Symbol mono + small-size cut
    files['symbol-mono'] = svg(2 * SYM_HALF, 2 * SYM_HALF, g(None, medallion(SYM_HALF, SYM_HALF, A, H), ink), 'Jostoju symbol', B)
    half_s = 4 * A_S + H_S
    files['symbol-small'] = svg(2 * half_s, 2 * half_s, g(None, medallion(half_s, half_s, A_S, H_S), ink), 'Jostoju symbol', B)
    # 2. Latin wordmark
    pad = 4
    W = lat_w + 2 * pad; Hh = lat_asc + lat_desc + 2 * pad
    oy = lat_asc + pad
    files['wordmark-en'] = svg(W, Hh, g(f'translate({pad} {oy:.2f})', lat_body, ink) + g(None, lat_dots_svg(pad, oy), acc), 'jostoju', B)
    # 3. Persian wordmark
    W = fa_w + 2 * pad; Hh = fa_asc + fa_desc + 2 * pad
    oy = fa_asc + pad
    files['wordmark-fa'] = svg(W, Hh, g(f'translate({pad} {oy:.2f})', fa_body, ink) + g(None, fa_dots_svg(pad, oy), acc), 'جستجو', B)
    # 4. Bilingual horizontal: jostoju  <knot>  جستجو  (both scripts read toward the knot)
    gap = 30; sym = 2 * SYM_HALF; lat_s = 1.12
    cy = 0.0
    lat_base = cy + 51.6 * lat_s / 2          # centre Latin x-height on the medallion axis
    fa_base = cy + 298 * FA2_S                 # centre Persian tooth-height on the axis
    top = min(cy - SYM_HALF, lat_base - lat_asc * lat_s, fa_base - fa2_asc)
    bot = max(cy + SYM_HALF, lat_base + lat_desc * lat_s, fa_base + fa2_desc)
    shift = pad - top
    cy += shift; lat_base += shift; fa_base += shift
    x0 = pad
    parts = g(f'translate({x0:.2f} {lat_base:.2f}) scale({lat_s})', lat_body, ink) + g(None, lat_dots_svg(x0, lat_base, lat_s), acc)
    sx = x0 + lat_w * lat_s + gap
    o, i = medallion(sx + SYM_HALF, cy, A, H, ring_split=True)
    parts += g(None, o, ink) + g(None, i, inner)
    fx = sx + sym + gap
    parts += g(f'translate({fx:.2f} {fa_base:.2f})', fa2_body, ink)
    parts += ''.join(f'<path d="{diamond(fx + x, fa_base + y, sz * 0.55)}" fill="{acc}"/>' for x, y, sz in fa2_dots)
    total_w = fx + fa2_w + pad
    files['lockup-horizontal'] = svg(total_w, bot - top + 2 * pad, parts, 'Jostoju · جستجو', B)
    # 5. Stacked medallion lockup: symbol / جستجو / jostoju
    sym_scale = 1.25; sym2 = 2 * SYM_HALF * sym_scale
    lat_s = 0.72
    width = max(fa_w, lat_w * lat_s, sym2) + 2 * pad + 20
    cx = width / 2
    y = pad
    parts = ''
    o, i = medallion(cx, y + sym2 / 2, A * sym_scale, H * sym_scale, ring_split=True)
    parts += g(None, o, ink) + g(None, i, inner)
    y += sym2 + 34 + fa_asc
    fx = cx - fa_w / 2
    parts += g(f'translate({fx:.2f} {y:.2f})', fa_body, ink) + g(None, fa_dots_svg(fx, y), acc)
    y += fa_desc + 18 + lat_asc * lat_s
    lx = cx - lat_w * lat_s / 2
    parts += g(f'translate({lx:.2f} {y:.2f}) scale({lat_s})', lat_body, ink) + g(None, lat_dots_svg(lx, y, lat_s), acc)
    y += lat_desc * lat_s + pad
    files['lockup-stacked'] = svg(width, y, parts, 'Jostoju · جستجو', B)
    return files

for name, (ink, acc, inner, bg) in PALETTES.items():
    for key, content in build(name, ink, acc, inner, bg).items():
        with open(os.path.join(OUT, f'jostoju-{key}-{name}.svg'), 'w') as fh:
            fh.write(content)
    if not os.environ.get('PREVIEWS'):
        continue
    for key, content in build(name, ink, acc, inner, bg, with_bg=True).items():
        with open(os.path.join(OUT, f'preview-{key}-{name}.svg'), 'w') as fh:
            fh.write(content)
# raw path data for embedding in pages
if os.environ.get('PATHS_JSON'): json.dump(dict(lat_body=lat_body, fa_body=fa_body, lat_dots=lat_dots, fa_dots=fa_dots,
               lat_w=lat_w, lat_asc=lat_asc, lat_desc=lat_desc, fa_w=fa_w, fa_asc=fa_asc, fa_desc=fa_desc),
          open(os.path.join(OUT, 'paths.json'), 'w'))

