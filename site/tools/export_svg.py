"""Export the brand marks the website needs as inline-SVG markup (CSS-variable fills) plus the
'stations' where the lost dot can land, as percentages of each mark's box. Writes src/marks.json."""
import os, sys, json
HERE = os.path.dirname(os.path.abspath(__file__))
BRAND = os.path.join(HERE, '..', '..', 'brand', 'source')
sys.path.insert(0, BRAND)
os.environ.setdefault('FONTS', os.path.join(BRAND, 'fonts'))
import assets as A
import lostdot as LD
from lostdot import to_d
from shapely.ops import unary_union
from shapely import affinity

VAR = lambda r: f'style="fill:var(--{r})"'

def box_of(geoms, pad):
    b = unary_union([g for g in geoms if g is not None and not g.is_empty]).bounds
    return (b[0] - pad, b[1] - pad, b[2] - b[0] + 2 * pad, b[3] - b[1] + 2 * pad)

def station(vb, cx, cy, size):
    return dict(left=round((cx - vb[0]) / vb[2] * 100, 3), top=round((cy - vb[1]) / vb[3] * 100, 3), width=round(size / vb[2] * 100, 3))

def word(mode, keep_knot):
    L = LD.build(mode=mode, bold=14)
    vow = affinity.translate(L['vow'], 0, 55)
    knot = L['knot']
    parts = [L['ink'], vow, L['dots'], knot] if knot is not None else [L['ink'], vow, L['dots']]
    vb = box_of(parts, 40)
    m = [f'<path d="{to_d(L["ink"])}" {VAR("ink")}/>', f'<path d="{to_d(L["dots"])}" {VAR("ink")}/>',
         f'<path d="{to_d(vow)}" {VAR("acc")}/>']
    if keep_knot and knot is not None:
        m.append(f'<path d="{to_d(knot)}" fill-rule="evenodd" {VAR("acc")}/>')
    out = dict(viewBox=' '.join(f'{v:.0f}' for v in vb), markup=''.join(m), stations={})
    if knot is not None:
        kb = knot.bounds
        out['stations']['ahead'] = station(vb, (kb[0] + kb[2]) / 2, (kb[1] + kb[3]) / 2, kb[2] - kb[0])
    if L['origin']:
        ox, oy = L['origin']
        out['stations']['home'] = station(vb, ox, oy, L['lost_h'] * 2.0)
    return out

def comp(c):
    b = c['box']; pad = max(b[2] - b[0], b[3] - b[1]) * 0.02
    vb = (b[0] - pad, b[1] - pad, b[2] - b[0] + 2 * pad, b[3] - b[1] + 2 * pad)
    return dict(viewBox=' '.join(f'{v:.0f}' for v in vb), markup=c['markup'], stations={}), vb

marks = {}
marks['hero'] = word('journey', keep_knot=False)        # the dot is the travelling one
marks['slot'] = word('ahead', keep_knot=False)          # compact word: the ج of ju waits for its dot
marks['compact'] = word('ahead', keep_knot=True)        # header / footer logotype
sym, vb = comp(A.symbol(True)); half = vb[2] / 2
sym['stations']['center'] = station(vb, vb[0] + half, vb[1] + vb[3] / 2, 33.6 * 2)
marks['symbol'] = sym
marks['symbol-small'] = comp(A.symbol(True, small=True))[0]
marks['en'] = comp(A.latin(True))[0]
marks['lockup'] = comp(A.lockup_horizontal(True))[0]
out = os.path.join(HERE, '..', 'src', 'marks.json')
json.dump(marks, open(out, 'w'), ensure_ascii=False)
print('wrote', out, {k: (len(v['markup']) // 1024, list(v['stations'])) for k, v in marks.items()})
