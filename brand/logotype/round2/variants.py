import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fontword import Word

_D = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fonts')
FONTS = {'amiri': os.environ.get('AMIRI', os.path.join(_D, 'Amiri-Bold.ttf')), 'noto': os.environ.get('NOTO', os.path.join(_D, 'NotoSansArabic-Black.ttf'))}
BASE = 'جُسْتُجُو'; ROAD = 'جُسْـــــتُجُو'

def nth(text, ch, n):
    k = -1
    for _ in range(n): k = text.index(ch, k + 1)
    return k

def diamond(cx, cy, h):
    return f'M{cx:.1f} {cy-h:.1f}L{cx+h:.1f} {cy:.1f}L{cx:.1f} {cy+h:.1f}L{cx-h:.1f} {cy:.1f}Z'

COMBOS = {'plain': set(), 'missing': {'missing'}, 'thread': {'thread'}, 'ascent': {'ascent'}, 'road': {'road'},
          'seeker': {'missing', 'ascent'}, 'path': {'road', 'thread', 'hollow-end'}, 'journey': {'road', 'missing'}}

def build(font, concept, text=None):
    C = COMBOS[concept]
    text = text or (ROAD if 'road' in C else BASE)
    w = Word(FONTS[font], text)
    jim2 = nth(text, 'ج', 2); vav_cl = text.index('و')
    parts = {'ink': [], 'dots': [], 'hollow': [], 'vow': [], 'thread': [], 'knot': []}
    xs, ys = [], []
    def track(x0, y0, x1, y1): xs.extend([x0, x1]); ys.extend([y0, y1])
    for it in w.ink:
        parts['ink'].append(w.path(it)); b = it['bb']; track(b[0], -b[3], b[2], -b[1])
    for d in w.dots:
        b = d['bb']; cx, cy = (b[0]+b[2])/2, -(b[1]+b[3])/2; h = max(b[2]-b[0], b[3]-b[1]) * 0.52
        if 'missing' in C and d['cl'] == jim2:
            hh = h * 1.3
            parts['hollow'].append(diamond(cx, cy, hh) + diamond(cx, cy, hh * 0.46))
        else:
            parts['dots'].append(diamond(cx, cy, h))
        track(cx-h*1.2, cy-h*1.2, cx+h*1.2, cy+h*1.2)
    vows = sorted(w.vowels, key=lambda v: -v['bb'][0])          # right to left
    for i, v in enumerate(vows):
        dy = 0; sc = 1.0
        if 'ascent' in C:
            dy = i * 90; sc = 1.12
        b = v['bb']; about = ((b[0]+b[2])/2, (b[1]+b[3])/2)
        parts['vow'].append(w.path(v, dy=dy, scale=sc, about=about))
        track(b[0]-30, -b[3]-dy-30, b[2]+30, -b[1]-dy+30)
    if 'thread' in C:
        vav = [it for it in w.ink if it['cl'] == vav_cl][0]
        tx, ty = w.point_extreme(vav, lambda pts: min(pts, key=lambda p: (p[0], p[1])))
        X, Y = tx, -ty                       # svg coords of the tail tip
        L = 640
        d = (f'M{X+8:.0f} {Y:.0f}C{X-L*0.25:.0f} {Y+30:.0f} {X-L*0.5:.0f} {Y+18:.0f} {X-L*0.72:.0f} {Y-22:.0f}'
             f'S{X-L*0.9:.0f} {Y-70:.0f} {X-L:.0f} {Y-62:.0f}')
        parts['thread'].append(d)
        kh = 56
        kx, ky = X - L - kh * 1.05, Y - 62
        if 'hollow-end' in C: parts['hollow'].append(diamond(kx, ky, kh) + diamond(kx, ky, kh * 0.46))
        else: parts['knot'].append(diamond(kx, ky, kh))
        track(kx - kh * 1.4, ky - kh * 1.4, X, Y + 50)
    pad = 60
    vb = (min(xs) - pad, min(ys) - pad, max(xs) - min(xs) + 2*pad, max(ys) - min(ys) + 2*pad)
    return parts, vb

def svg(parts, vb, ink, vow, bg=None, thread_w=26, width=None, cls=''):
    W = f' width="{width}"' if width else ''
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb[0]:.0f} {vb[1]:.0f} {vb[2]:.0f} {vb[3]:.0f}"{W} class="{cls}">']
    if bg: out.append(f'<rect x="{vb[0]:.0f}" y="{vb[1]:.0f}" width="{vb[2]:.0f}" height="{vb[3]:.0f}" fill="{bg}"/>')
    out.append(f'<path d="{"".join(parts["ink"])}" fill="{ink}"/>')
    if parts['dots']: out.append(f'<path d="{"".join(parts["dots"])}" fill="{ink}"/>')
    if parts['hollow']: out.append(f'<path d="{"".join(parts["hollow"])}" fill="{vow}" fill-rule="evenodd"/>')
    if parts['thread']: out.append(f'<path d="{"".join(parts["thread"])}" fill="none" stroke="{ink}" stroke-width="{thread_w}" stroke-linecap="round"/>')
    if parts['knot']: out.append(f'<path d="{"".join(parts["knot"])}" fill="{vow}"/>')
    out.append(f'<path d="{"".join(parts["vow"])}" fill="{vow}"/></svg>')
    return ''.join(out)

if __name__ == '__main__':
    od = sys.argv[1]; os.makedirs(od, exist_ok=True)
    for font in FONTS:
        for c in COMBOS:
            p, vb = build(font, c)
            open(f'{od}/{font}-{c}.svg', 'w').write(svg(p, vb, '#1A1714', '#A3261F', '#F2EBDD'))
    print('ok')
