"""Jostoju lettering: each letter is a function of its anchor point, so the same
hand-drawn forms can be composed horizontally (keshideh) or stacked (Nastaliq stair)."""
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from qalam import *

class Pen:
    def __init__(self, W=70, T=11, ang=68):
        self.W, self.T, self.ang = W, T, ang
        self.ink, self.vow, self.dots, self.deco, self.lines = [], [], [], [], []
    def s(self, segs, w=None, ang=None, pr=None, t=None, layer='ink'):
        pts = path_points(segs)
        g = sweep(pts, w or self.W, t or self.T, self.ang if ang is None else ang, pr)
        getattr(self, layer).append(g); self.lines.append(pts)
        return pts[-1]
    def dot(self, x, y, k=1.0, layer='dots'):
        getattr(self, layer).append(diamond(x, y, self.W * 0.38 * k))

def off(p, dx, dy): return (p[0] + dx, p[1] + dy)
def segs_off(segs, dx, dy):
    out = []
    for s in segs:
        if s[0] == 'L': out.append(('L', off(s[1], dx, dy), off(s[2], dx, dy)))
        else: out.append(tuple(off(p, dx, dy) for p in s))
    return out

def jim_initial(P, ex, ey, k=1.0):
    """exit point (ex, ey) = where the body meets the baseline on the left."""
    R = lambda segs: [tuple((ex + (p[0]-880)*k, ey + (p[1]-430)*k) for p in s) if s[0] != 'L' else s for s in segs]
    P.s(R([((990, 318), (975, 292), (992, 262), (1030, 262)), ((1030, 262), (1066, 262), (1096, 276), (1126, 286))]), pr=taper(0.18, 0, 0.35))
    P.s(R([((1126, 290), (1066, 300), (1024, 356), (968, 398)), ((968, 398), (942, 418), (916, 430), (880, 430))]))
    P.dot(ex + 168*k, ey + 22*k)
    return dict(head=(ex + 180*k, ey - 168*k), exit=(ex, ey))

def keshideh(P, x0, y0, x1, y1, sag=7):
    P.s([((x0, y0), (x0 + (x1-x0)*0.3, y0 + sag + (y1-y0)*0.3), (x0 + (x1-x0)*0.7, y0 + sag + (y1-y0)*0.7), (x1, y1))])

def tooth(P, x, y, h=110):
    P.s([('L', (x - 3, y + 2), (x + 3, y - h))], w=P.W*0.6, ang=12)
    P.s([('L', (x + 3, y - h), (x - 14, y - h + 12))], w=P.W*0.34, ang=12)   # cut flag at the top
    return (x, y - h)

def jim_medial(P, nx, ny):
    """entry (nx, ny) on the baseline at the right; returns exit for the next letter."""
    d = lambda segs: segs_off(segs, nx - 560, ny - 430)
    P.s(d([((566, 432), (540, 430), (526, 404), (528, 350))]), w=P.W*0.42, pr=taper(0, 0.2, 0.7))
    P.s(d([((408, 372), (396, 346), (414, 318), (450, 318)), ((450, 318), (484, 318), (508, 330), (530, 342))]), pr=taper(0.18, 0, 0.35))
    P.s(d([((530, 346), (478, 360), (436, 410), (388, 444))]))
    P.dot(nx - 104, ny + 72)
    return (nx - 172, ny + 14), (nx - 92, ny - 112)

def vav(P, nx, ny, tail=1.0):
    d = lambda segs: segs_off(segs, nx - 388, ny - 444)
    tl = lambda x, y: (388 + (x - 388) * tail, 444 + (y - 444) * (0.85 + 0.15 * tail))
    P.s(d([((388, 444), (376, 420), (378, 386), (350, 362)), ((350, 362), (320, 338), (270, 356), (278, 398)),
           ((278, 398), (284, 432), (334, 438), (356, 414)),
           ((356, 414), tl(374, 474), tl(334, 560), tl(196, 590))]),
        pr=lambda s: 0.84 if s < 0.62 else max(0.08, 0.84 * (1 - (s - 0.62) / 0.38) ** 0.85))

def zamma(P, x, y, k=1.0, layer='vow'):
    P.s([((x + 10*k, y + 8*k), (x + 4*k, y - 6*k), (x - 16*k, y - 4*k), (x - 14*k, y + 12*k)),
         ((x - 14*k, y + 12*k), (x - 12*k, y + 26*k), (x + 6*k, y + 26*k), (x + 10*k, y + 10*k)),
         ((x + 10*k, y + 10*k), (x + 14*k, y + 36*k), (x - 2*k, y + 58*k), (x - 34*k, y + 66*k))],
        w=15*k, t=3.2, pr=taper(0, 0.45, 0.14), layer=layer)

def sokun(P, x, y, r=20, layer='vow'):
    pts = [(x + r*math.cos(a/48*2*math.pi), y + r*0.92*math.sin(a/48*2*math.pi)) for a in range(49)]
    P.vow.append(sweep(pts, 14, 3.5, P.ang)) if layer == 'vow' else P.deco.append(sweep(pts, 14, 3.5, P.ang)); P.lines.append(pts)

def three_dots(P, x, y, k=1.0):
    """three knots under the toothless sin, as old manuscripts marked it."""
    h = P.W * 0.2 * k
    for dx, dy in ((-1.15, 0), (1.15, 0), (0, 1.15)):
        P.deco.append(diamond(x + dx*h*1.5, y + dy*h*1.5, h))

def muhmal(P, x, y, k=1.0):
    """the small 'v' that marks a toothless sin: decoration in the calligrapher's sense."""
    P.s([((x - 20*k, y - 14*k), (x - 12*k, y - 4*k), (x - 6*k, y + 6*k), (x, y + 14*k))], w=17*k, t=3.5, pr=taper(0.4, 0, 0.3), layer='deco')
    P.s([((x, y + 14*k), (x + 6*k, y + 2*k), (x + 12*k, y - 8*k), (x + 22*k, y - 14*k))], w=17*k, t=3.5, pr=taper(0, 0.4, 0.3), layer='deco')

def svg(P, bg, fg, ac, deco=None, debug=False, width=1000, pad=56, dotc=None):
    ink = unary_union(P.ink); vow = unary_union(P.vow); dots = unary_union(P.dots); dec = unary_union(P.deco) if P.deco else None
    minx, miny, maxx, maxy = bounds(ink, vow, dots, dec)
    vb = (minx - pad, miny - pad, maxx - minx + 2*pad, maxy - miny + 2*pad)
    dbg = ''.join(f'<polyline points="{" ".join(f"{x:.0f},{y:.0f}" for x, y in pts)}" fill="none" stroke="#2E9E97" stroke-width="2"/>' for pts in P.lines) if debug else ''
    bgr = f'<rect x="{vb[0]:.0f}" y="{vb[1]:.0f}" width="{vb[2]:.0f}" height="{vb[3]:.0f}" fill="{bg}"/>' if bg else ''
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb[0]:.0f} {vb[1]:.0f} {vb[2]:.0f} {vb[3]:.0f}" width="{width}">{bgr}'
            f'<path d="{to_d(ink)}" fill="{fg}"/><path d="{to_d(dots)}" fill="{dotc or fg}"/>'
            f'<path d="{to_d(vow)}" fill="{ac}"/>' + (f'<path d="{to_d(dec)}" fill="{deco or ac}"/>' if dec else '') + f'{dbg}</svg>')
