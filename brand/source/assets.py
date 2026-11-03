"""Jostoju identity v2 (Qajar): logotype, wordmark, symbol and lockups.
Every component is markup in its own coordinates plus a bounding box, so it can be exported as a
file (literal colours) or used as a sprite symbol in pages (CSS variables --ink, --acc, --ring)."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import DecomposingRecordingPen
from shapely.ops import unary_union
from shapely import affinity
import lostdot as LD
from lostdot import Flat, signed_area, diamond, to_d
from shapely.geometry import Polygon

FONTS = os.environ.get('FONTS', os.path.join(HERE, 'fonts'))
LD.FONT = os.path.join(FONTS, 'Amiri-Bold.ttf')

def fill(role, var):  # role in ink / acc / ring
    return f'style="fill:var(--{role})"' if var else f'fill="{{{role}}}"'

# ---------------- Persian logotype ----------------
def persian(mode, var, bold=14, vow_drop=55, **kw):
    L = LD.build(mode=mode, bold=bold, **kw)
    vow = affinity.translate(L['vow'], 0, vow_drop)
    parts = [L['ink'], vow, L['dots']] + ([L['knot']] if L['knot'] is not None else [])
    minx, miny, maxx, maxy = unary_union([p for p in parts if not p.is_empty]).bounds
    if L['thread']:
        minx = min(minx, L['knot'].bounds[0])
    m = [f'<path d="{to_d(L["ink"])}" {fill("ink", var)}/>', f'<path d="{to_d(L["dots"])}" {fill("ink", var)}/>']
    if L['knot'] is not None and not L['thread']:
        m.append(f'<path d="{to_d(L["knot"])}" {fill("acc", var)} fill-rule="evenodd"/>')
    if L['thread']:
        st = 'style="stroke:var(--ink)"' if var else 'stroke="{ink}"'
        m.append(f'<path d="{L["thread"]}" fill="none" stroke-width="{L["thread_w"]:.0f}" stroke-linecap="round" {st}/>')
        m.append(f'<path d="{to_d(L["knot"])}" {fill("acc", var)}/>')
    m.append(f'<path d="{to_d(vow)}" {fill("acc", var)}/>')
    ib = L['ink'].bounds
    return dict(markup=''.join(m), box=(minx, miny, maxx, maxy), body=ib)

# ---------------- Latin wordmark (Bodoni Moda) ----------------
def latin(var, weight=800, size=1000):
    path = os.path.join(FONTS, f'BodoniModa-{weight}.ttf')
    f = TTFont(path); gs = f.getGlyphSet(); order = f.getGlyphOrder(); s = size / f['head'].unitsPerEm
    face = hb.Face(open(path, 'rb').read()); font = hb.Font(face)
    buf = hb.Buffer(); buf.add_str('jostoju'); buf.guess_segment_properties(); hb.shape(font, buf, {})
    infos = [i.codepoint for i in buf.glyph_infos]; pos = [(p.x_advance, p.x_offset, p.y_offset) for p in buf.glyph_positions]
    body, dots, x = [], [], 0
    for gid, (adv, xo, yo) in zip(infos, pos):
        name = order[gid]; rec = DecomposingRecordingPen(gs); gs[name].draw(rec)
        cs, cur = [], []
        for op, args in rec.value:
            cur.append((op, args))
            if op in ('closePath', 'endPath'): cs.append(cur); cur = []
        for c in cs:
            pen = Flat(); [getattr(pen, op)(*args) for op, args in c]
            for r in pen.rings:
                pts = [((px + x + xo) * s, -(py + yo) * s) for px, py in r]
                ys = [p[1] for p in pts]
                if name == 'j' and max(ys) < -560 * s:          # the tittle: becomes a knot
                    xs = [p[0] for p in pts]; cx, cy = (min(xs)+max(xs))/2, (min(ys)+max(ys))/2
                    hgt = (max(ys) - min(ys)) * 0.62
                    dots.append(diamond(cx, cy - 6, hgt))
                else:
                    body.append((Polygon(pts).buffer(0), signed_area([(p[0], -p[1]) for p in pts])))
        x += adv
    outers = unary_union([g for g, a in body if a < 0]); holes = [g for g, a in body if a > 0]
    g = outers.difference(unary_union(holes)) if holes else outers
    d = unary_union(dots)
    minx, miny, maxx, maxy = unary_union([g, d]).bounds
    m = f'<path d="{to_d(g)}" {fill("ink", var)}/><path d="{to_d(d)}" {fill("acc", var)}/>'
    return dict(markup=m, box=(minx, miny, maxx, maxy), body=g.bounds)

# ---------------- Symbol: the Missing Knot ----------------
def symbol(var, a=40, h=33.6, small=False):
    if small: h = 29.6
    half = 4 * a + h; o, i = [], []
    for ii in range(5):
        for jj in range(5):
            if ii == 2 and jj == 2: continue
            x = half + (ii - jj) * a; y = half + (ii + jj - 4) * a
            (o if max(abs(ii-2), abs(jj-2)) == 2 else i).append(diamond(x, y, h))
    if small:
        m = f'<path d="{to_d(unary_union(o + i))}" {fill("ink", var)}/>'
    else:
        m = f'<path d="{to_d(unary_union(o))}" {fill("ink", var)}/><path d="{to_d(unary_union(i))}" {fill("ring", var)}/>'
    return dict(markup=m, box=(0, 0, 2 * half, 2 * half), body=(0, 0, 2 * half, 2 * half))

def window(var, a=40, h=33.6):
    n = 7; c = 3; half = (n - 1) * a + h; r2, r3 = [], []
    for ii in range(n):
        for jj in range(n):
            r = max(abs(ii - c), abs(jj - c))
            if r < 2: continue
            x = half + (ii - jj) * a; y = half + (ii + jj - (n - 1)) * a
            (r2 if r == 2 else r3).append(diamond(x, y, h))
    m = f'<path d="{to_d(unary_union(r3))}" {fill("ink", var)}/><path d="{to_d(unary_union(r2))}" {fill("ring", var)}/>'
    return dict(markup=m, box=(0, 0, 2 * half, 2 * half), body=(0, 0, 2 * half, 2 * half))

def place(comp, tx, ty, sc=1.0):
    return f'<g transform="translate({tx:.1f} {ty:.1f}) scale({sc:.4f})">{comp["markup"]}</g>'

def lockup_stacked(var):
    sym, fa, en = symbol(var), persian('journey', var), latin(var)
    fb = fa['body']; cx = (fb[0] + fb[2]) / 2                    # centre on the letters, not the thread
    W = fb[2] - fb[0]
    ss = W * 0.30 / (sym['box'][2]); es = W * 0.58 / (en['box'][2] - en['box'][0])
    parts = []; y = 0
    sw = sym['box'][2] * ss
    parts.append(place(sym, cx - sw / 2, y, ss)); y += sw + 70
    parts.append(place(fa, 0, y - fa['box'][1])); y += fa['box'][3] - fa['box'][1] + 60
    eb = en['box']; ew = (eb[2] - eb[0]) * es
    parts.append(place(en, cx - ew / 2 - eb[0] * es, y - eb[1] * es, es)); y += (eb[3] - eb[1]) * es
    minx = min(fa['box'][0], cx - sw / 2); maxx = max(fa['box'][2], cx + sw / 2)
    return dict(markup=''.join(parts), box=(minx, 0, maxx, y), body=(minx, 0, maxx, y))

def lockup_horizontal(var):
    fa, en = persian('ahead', var), latin(var)
    fb = fa['body']; H = fb[3] - fb[1]
    eb = en['body']; es = (H * 0.62) / (eb[3] - eb[1])
    gap = H * 0.42
    mid = (fb[1] + fb[3]) / 2
    parts = []; x = 0
    parts.append(place(en, -en['box'][0] * es, mid - ((eb[1] + eb[3]) / 2) * es, es)); x += (en['box'][2] - en['box'][0]) * es + gap
    rule = 'style="fill:var(--ring)"' if var else 'fill="{ring}"'
    parts.append(f'<rect x="{x:.0f}" y="{mid - H*0.62:.0f}" width="{H*0.035:.0f}" height="{H*1.24:.0f}" {rule}/>'); x += H * 0.035 + gap
    parts.append(place(fa, x - fa['box'][0], 0)); x += fa['box'][2] - fa['box'][0]
    top = min(fa['box'][1], mid - H * 0.62); bot = max(fa['box'][3], mid + H * 0.62)
    return dict(markup=''.join(parts), box=(0, top, x, bot), body=(0, top, x, bot))

COMPONENTS = {
    'fa': lambda v: persian('journey', v), 'fa-compact': lambda v: persian('ahead', v), 'en': latin,
    'sym': symbol, 'sym-small': lambda v: symbol(v, small=True), 'win': window,
    'lk-stack': lockup_stacked, 'lk-h': lockup_horizontal,
    'x-thread': lambda v: persian('lost', v), 'x-back': lambda v: persian('compact', v),
}

THEMES = {   # name: (bg, ink, acc, ring)
    'morvarid': ('#F4EDE0', '#16110E', '#A3261F', '#A3261F'),
    'shab': ('#16110E', '#F4EDE0', '#D4A640', '#D4A640'),
    'runas': ('#A3261F', '#F4EDE0', '#D4A640', '#D4A640'),
    'zomorrod': ('#1F5A46', '#F4EDE0', '#D4A640', '#D4A640'),
}

def export(comp, theme, pad_ratio=0.08, transparent=True):
    bg, ink, acc, ring = THEMES[theme]
    b = comp['box']; w, h = b[2] - b[0], b[3] - b[1]; pad = max(w, h) * pad_ratio
    vb = f'{b[0]-pad:.0f} {b[1]-pad:.0f} {w+2*pad:.0f} {h+2*pad:.0f}'
    body = comp['markup'].replace('{ink}', ink).replace('{acc}', acc).replace('{ring}', ring)
    rect = '' if transparent else f'<rect x="{b[0]-pad:.0f}" y="{b[1]-pad:.0f}" width="{w+2*pad:.0f}" height="{h+2*pad:.0f}" fill="{bg}"/>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}">{rect}{body}</svg>\n'

if __name__ == '__main__':
    od = sys.argv[1]; os.makedirs(od, exist_ok=True)
    names = {'fa': 'logotype-fa', 'fa-compact': 'logotype-fa-compact', 'en': 'wordmark-en', 'sym': 'symbol',
             'sym-small': 'symbol-small', 'lk-stack': 'lockup-stacked', 'lk-h': 'lockup-horizontal'}
    for key, fname in names.items():
        comp = COMPONENTS[key](False)
        for t in THEMES:
            open(f'{od}/jostoju-{fname}-{t}.svg', 'w').write(export(comp, t))
    # favicon: the small-size symbol on Shab
    import lostdot as _L
    small = symbol(False, small=True); b = small['box']; pad = b[2] * 0.14; W = b[2] + 2 * pad
    fav = small['markup'].replace('{ink}', '#F4EDE0')
    open(f'{od}/favicon.svg', 'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{-pad:.0f} {-pad:.0f} {W:.0f} {W:.0f}">'
                                         f'<rect x="{-pad:.0f}" y="{-pad:.0f}" width="{W:.0f}" height="{W:.0f}" rx="{W*0.14:.0f}" fill="#16110E"/>{fav}</svg>\n')
    if not os.environ.get('PREVIEWS'):
        raise SystemExit(0)
    # preview sheet with grounds
    prev = ['<html><body style="margin:0;display:grid;grid-template-columns:1fr 1fr;gap:6px;background:#777;padding:6px">']
    for key in ('lk-stack', 'lk-h', 'fa', 'fa-compact', 'en', 'sym'):
        comp = COMPONENTS[key](False)
        for t in ('morvarid', 'shab'):
            svgtxt = export(comp, t, transparent=False)
            open(f'{od}/preview-{key}-{t}.svg', 'w').write(svgtxt)
            prev.append(f'<img src="preview-{key}-{t}.svg" style="width:100%;max-height:300px;object-fit:contain;background:{THEMES[t][0]}">')
    open(f'{od}/preview.html', 'w').write(''.join(prev) + '</body></html>')
    print('ok')
