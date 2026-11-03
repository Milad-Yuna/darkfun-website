"""Jostoju Persian logotype: جُسْتُجُو in Amiri Bold, emboldened, with knot dots, vowels in the
second colour, and the 'lost dot': the dot of the last ج (ju, 'seek') leaves the word and waits at
the end of a thread drawn out of the و tail."""
import sys, os, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from fontTools.pens.basePen import BasePen
from shapely.geometry import Polygon, MultiPolygon
from shapely.ops import unary_union
from shapely import affinity
from fontword import Word

class Flat(BasePen):
    def __init__(self, n=10):
        super().__init__(None); self.rings, self.cur, self.n = [], [], n
    def _moveTo(self, p): self.cur = [p]
    def _lineTo(self, p): self.cur.append(p)
    def _curveToOne(self, p1, p2, p3):
        p0 = self.cur[-1]
        for k in range(1, self.n + 1):
            t = k / self.n; u = 1 - t
            self.cur.append((u**3*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t**3*p3[0], u**3*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t**3*p3[1]))
    def _qCurveToOne(self, p1, p2):
        p0 = self.cur[-1]
        for k in range(1, self.n + 1):
            t = k / self.n; u = 1 - t
            self.cur.append((u*u*p0[0] + 2*u*t*p1[0] + t*t*p2[0], u*u*p0[1] + 2*u*t*p1[1] + t*t*p2[1]))
    def _closePath(self):
        if len(self.cur) > 2: self.rings.append(self.cur)
        self.cur = []
    _endPath = _closePath

def signed_area(r):
    return 0.5 * sum(r[i][0]*r[(i+1) % len(r)][1] - r[(i+1) % len(r)][0]*r[i][1] for i in range(len(r)))

def item_geom(item, dx=0, dy=0, scale=1.0, about=None):
    pen = Flat()
    for c in item['contours']:
        for op, args in c: getattr(pen, op)(*args)
    outers, holes = [], []
    for r in pen.rings:
        pts = [(x + item['ox'], y + item['oy']) for x, y in r]
        (outers if signed_area(pts) < 0 else holes).append(Polygon(pts).buffer(0))
    g = unary_union(outers)
    if holes: g = g.difference(unary_union(holes))
    if about and scale != 1.0: g = affinity.scale(g, scale, scale, origin=about)
    g = affinity.scale(g, 1, -1, origin=(0, 0))           # font (y up) -> svg (y down)
    return affinity.translate(g, dx, -dy)

def diamond(cx, cy, h): return Polygon([(cx, cy - h), (cx + h, cy), (cx, cy + h), (cx - h, cy)])

def to_d(geom, prec=1):
    polys = [geom] if isinstance(geom, Polygon) else list(getattr(geom, 'geoms', []))
    out = []
    for p in polys:
        if p.is_empty: continue
        p = p.simplify(0.7)
        for ring in [p.exterior] + list(p.interiors):
            c = list(ring.coords)[:-1]
            out.append('M' + 'L'.join(f'{x:.{prec}f} {y:.{prec}f}' for x, y in c) + 'Z')
    return ''.join(out)

FONT = os.environ.get('AMIRI', os.path.join(HERE, 'fonts', 'Amiri-Bold.ttf'))

def build(mode='lost', bold=13, text=None, thread_len=600, rise=70, ahead_gap=1.6, ahead_level='road', hollow=True):
    """mode: 'lost' (primary) or 'compact' (all dots in place, no thread)."""
    if text is None:
        text = 'جُسْـــــتُجُو' if mode == 'journey' else 'جُسْتُجُو'
    w = Word(FONT, text)
    k = -1
    for _ in range(2): k = text.index('ج', k + 1)
    jim2, vav_cl = k, text.index('و')
    ink = unary_union([item_geom(it) for it in w.ink]).buffer(bold, join_style=2, mitre_limit=2.2)
    vows = unary_union([item_geom(v) for v in w.vowels]).buffer(bold * 0.22, join_style=2, mitre_limit=2.2)
    dots, lost_h, origin = [], None, None
    groups = {}
    for d in w.dots: groups.setdefault(d['cl'], []).append(d)
    for cl, g in groups.items():        # pairs of dots (ت): open them up a little so thick knots never touch
        if len(g) == 2:
            (a, b) = g; ca = (a['bb'][0] + a['bb'][2]) / 2; cb = (b['bb'][0] + b['bb'][2]) / 2; mid = (ca + cb) / 2
            for d, c in ((a, ca), (b, cb)):
                sh = (c - mid) * 0.42; d['bb'] = [d['bb'][0] + sh, d['bb'][1], d['bb'][2] + sh, d['bb'][3]]
    for d in w.dots:
        b = d['bb']; cx, cy = (b[0]+b[2])/2, -(b[1]+b[3])/2; h = max(b[2]-b[0], b[3]-b[1]) * 0.52 + bold * 0.7
        if mode in ('lost', 'journey', 'ahead') and d['cl'] == jim2: lost_h = h; origin = (cx, cy); continue
        dots.append(diamond(cx, cy, h))
    dots = unary_union(dots)
    thread = knot = None; tip = kc = None
    if mode == 'lost':
        vav = [it for it in w.ink if it['cl'] == vav_cl][0]
        tx, ty = w.point_extreme(vav, lambda pts: min(pts, key=lambda p: (p[0], p[1])))
        X, Y = tx + 4, -ty
        L = thread_len
        kx, ky = X - L, Y - rise
        thread = (f'M{X:.0f} {Y:.0f}C{X - L*0.28:.0f} {Y + 34:.0f} {X - L*0.52:.0f} {Y + 22:.0f} {X - L*0.72:.0f} {Y - rise*0.45:.0f}'
                  f'S{X - L*0.92:.0f} {ky + 2:.0f} {kx + lost_h*1.05:.0f} {ky:.0f}')
        knot = diamond(kx, ky, lost_h); tip = (X, Y); kc = (kx, ky)
    if mode in ('journey', 'ahead'):
        # the dot of 'ju' goes ahead of the word, unattached: the word travels toward it
        wminx = ink.bounds[0]
        if ahead_level == 'road':
            # the baseline stroke: sample the ink at the middle of the word, find its vertical centre
            from shapely.geometry import LineString
            midx = (ink.bounds[0] + ink.bounds[2]) / 2
            cut = ink.intersection(LineString([(midx, ink.bounds[1]), (midx, ink.bounds[3])]))
            segs = [g for g in getattr(cut, 'geoms', [cut]) if not g.is_empty]
            low = max(segs, key=lambda g: g.bounds[3])
            ky = (low.bounds[1] + low.bounds[3]) / 2
        else:
            ky = origin[1]
        H = lost_h * 1.55
        kx = wminx - H * ahead_gap - H
        knot = diamond(kx, ky, H)
        if hollow: knot = knot.difference(diamond(kx, ky, H * 0.46))
        kc = (kx, ky)
    parts = [ink, vows, dots] + ([knot.buffer(lost_h*0.2)] if knot is not None else [])
    minx, miny, maxx, maxy = unary_union([p for p in parts if not p.is_empty]).bounds
    return dict(ink=ink, vow=vows, dots=dots, thread=thread, knot=knot, bounds=(minx, miny, maxx, maxy), thread_w=24 + bold * 0.6, origin=origin, tip=tip, kc=kc, lost_h=lost_h)

def svg(L, ink, vow, bg=None, pad=50, width=None, var=False):
    minx, miny, maxx, maxy = L['bounds']
    vb = (minx - pad, miny - pad, maxx - minx + 2*pad, maxy - miny + 2*pad)
    f = (lambda c: f'style="fill:{c}"') if var else (lambda c: f'fill="{c}"')
    s = (lambda c: f'style="stroke:{c}"') if var else (lambda c: f'stroke="{c}"')
    o = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb[0]:.0f} {vb[1]:.0f} {vb[2]:.0f} {vb[3]:.0f}"' + (f' width="{width}"' if width else '') + '>']
    if bg: o.append(f'<rect x="{vb[0]:.0f}" y="{vb[1]:.0f}" width="{vb[2]:.0f}" height="{vb[3]:.0f}" fill="{bg}"/>')
    o.append(f'<path d="{to_d(L["ink"])}" {f(ink)}/><path d="{to_d(L["dots"])}" {f(ink)}/>')
    if L['thread']: o.append(f'<path d="{L["thread"]}" fill="none" stroke-width="{L["thread_w"]:.0f}" stroke-linecap="round" {s(ink)}/>')
    if L['knot'] is not None: o.append(f'<path d="{to_d(L["knot"])}" {f(vow)}/>')
    o.append(f'<path d="{to_d(L["vow"])}" {f(vow)}/></svg>')
    return ''.join(o), vb

if __name__ == '__main__':
    od = sys.argv[1]; os.makedirs(od, exist_ok=True)
    for name, kw in (('lost', dict(mode='lost')), ('lost-b0', dict(mode='lost', bold=0)), ('lost-b22', dict(mode='lost', bold=22)), ('compact', dict(mode='compact'))):
        L = build(**kw)
        open(f'{od}/{name}-light.svg', 'w').write(svg(L, '#16110E', '#A3261F', '#F4EDE0')[0])
        open(f'{od}/{name}-dark.svg', 'w').write(svg(L, '#F4EDE0', '#D4A640', '#16110E')[0])
    print('ok')
