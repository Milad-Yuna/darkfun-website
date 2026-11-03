"""qalam: a digital reed pen. Strokes are centre-lines (cubic Bezier chains);
a cut nib (thin rectangle at a fixed angle) is swept along each one, giving
real calligraphic thick/thin contrast. Output: SVG path data."""
import math
from shapely.geometry import Polygon, MultiPolygon
from shapely.ops import unary_union

def cubic(p0, p1, p2, p3, n=48):
    pts = []
    for k in range(n + 1):
        t = k / n; u = 1 - t
        pts.append((u**3*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t**3*p3[0],
                    u**3*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t**3*p3[1]))
    return pts

def path_points(segs, n=48):
    """segs: list of (p0,p1,p2,p3) or ('L', p0, p1). Returns sampled points."""
    out = []
    for s in segs:
        if s[0] == 'L':
            a, b = s[1], s[2]
            pts = [(a[0] + (b[0]-a[0])*k/n, a[1] + (b[1]-a[1])*k/n) for k in range(n+1)]
        else:
            pts = cubic(*s, n=n)
        if out: pts = pts[1:]
        out += pts
    return out

def nib_corners(p, w, t, ang):
    a = math.radians(ang)
    ux, uy = math.cos(a), -math.sin(a)          # nib edge direction (y down)
    vx, vy = -uy, ux                              # nib thickness direction
    hw, ht = w / 2, t / 2
    return [(p[0] + sx*hw*ux + sy*ht*vx, p[1] + sx*hw*uy + sy*ht*vy) for sx, sy in ((1,1),(1,-1),(-1,-1),(-1,1))]

def sweep(points, w, t, ang, pressure=None):
    """pressure: function f(s in 0..1) -> width multiplier."""
    polys = []
    n = len(points)
    for k in range(n - 1):
        s0, s1 = k / (n - 1), (k + 1) / (n - 1)
        w0 = w * (pressure(s0) if pressure else 1); w1 = w * (pressure(s1) if pressure else 1)
        c = nib_corners(points[k], w0, t, ang) + nib_corners(points[k+1], w1, t, ang)
        polys.append(Polygon(c).convex_hull)
    return unary_union(polys)

def taper(a=0.0, b=0.0, lo=0.25):
    """pressure curve: ramps up over the first a and down over the last b of the stroke."""
    def f(s):
        m = 1.0
        if a and s < a: m = lo + (1 - lo) * math.sin(s / a * math.pi / 2)
        if b and s > 1 - b: m = min(m, lo + (1 - lo) * math.sin((1 - s) / b * math.pi / 2))
        return m
    return f

def diamond(cx, cy, h, sx=1.0):
    return Polygon([(cx, cy - h), (cx + h*sx, cy), (cx, cy + h), (cx - h*sx, cy)])

def to_d(geom, prec=1):
    geom = geom.buffer(0)
    polys = [geom] if isinstance(geom, Polygon) else list(getattr(geom, 'geoms', []))
    out = []
    def ring(r):
        c = list(r.coords)
        return 'M' + 'L'.join(f'{x:.{prec}f} {y:.{prec}f}' for x, y in c[:-1]) + 'Z'
    for p in polys:
        if p.is_empty: continue
        p = p.simplify(0.25)
        out.append(ring(p.exterior)); out += [ring(i) for i in p.interiors]
    return ''.join(out)

def bounds(*geoms):
    u = unary_union([g for g in geoms if g is not None and not g.is_empty])
    return u.bounds
