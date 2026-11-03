"""Assemble brand bible v2 (Qajar, bilingual): sprite, pattern variables, lost-dot motion demo."""
import os, sys, re, urllib.parse, runpy
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import assets as A
import lostdot as LD
from lostdot import to_d
from shapely import affinity

PAT = runpy.run_path(os.environ.get('GEN_PATTERNS', os.path.join(HERE, 'gen_patterns.py')))
Q = dict(shab='#16110E', morvarid='#F4EDE0', kaghaz='#E7D9BD', runas='#A3261F', zomorrod='#1F5A46', tala='#D4A640', lajvard='#233C8E', gol='#E39AA6')

def patterns():
    fg, sv, B, F, LA = PAT['from_grid'], PAT['svg'], PAT['BAND'], PAT['FIELD'], PAT['LACHAK']
    out = {}
    bands = {'shab': dict(r=Q['tala'], z=Q['morvarid'], w=Q['runas']), 'morvarid': dict(r=Q['runas'], z=Q['zomorrod'], w=Q['tala']),
             'runas': dict(r=Q['tala'], z=Q['morvarid'], w=Q['zomorrod']), 'zomorrod': dict(r=Q['tala'], z=Q['morvarid'], w=Q['runas']),
             'lajvard': dict(r=Q['tala'], z=Q['morvarid'], w=Q['runas'])}
    for g, cm in bands.items():
        out[f'band-{g}'] = sv(*fg(B, cm))
        flips = {'tl': LA, 'tr': [r[::-1] for r in LA], 'bl': LA[::-1], 'br': [r[::-1] for r in LA[::-1]]}
        for k, grid in flips.items(): out[f'lachak-{k}-{g}'] = sv(*fg(grid, cm))
    out['field-shab'] = sv(*fg(F, dict(z='rgba(212,166,64,.10)')))
    out['field-morvarid'] = sv(*fg(F, dict(z='rgba(22,17,14,.06)')))
    out['toranj'] = sv(*PAT['toranj_lattice'](6, [None, Q['tala'], Q['runas'], None, Q['morvarid'], None, Q['zomorrod']]))
    out['zarafshan'] = sv(*PAT['zarafshan'](color=Q['tala']))
    out['arch'] = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 130" preserveAspectRatio="none">'
                   '<path d="M0 130V58Q0 34 21 20Q41 8 50 0Q59 8 79 20Q100 34 100 58V130Z" fill="#000"/></svg>')
    return out

def uri(t): return 'url("data:image/svg+xml,' + urllib.parse.quote(t.replace('"', "'"), safe=" /=:;,.-()'") + '")'

def sprite():
    syms, boxes = [], {}
    for key, fn in A.COMPONENTS.items():
        c = fn(True); b = c['box']; pad = max(b[2]-b[0], b[3]-b[1]) * 0.02
        vb = (b[0]-pad, b[1]-pad, b[2]-b[0]+2*pad, b[3]-b[1]+2*pad)
        syms.append(f'<symbol id="{key}" viewBox="{vb[0]:.0f} {vb[1]:.0f} {vb[2]:.0f} {vb[3]:.0f}">{c["markup"]}</symbol>')
        boxes[key] = (round(vb[2]), round(vb[3]))
    return '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' + ''.join(syms) + '</svg>', boxes

def motion():
    """The dot of 'ju' leaves its letter and runs ahead of the word. Rests in its final place."""
    L = LD.build(mode='journey', bold=14)
    vow = affinity.translate(L['vow'], 0, 55)
    kx, ky = L['kc']; ox, oy = L['origin']
    r = lambda x, y: f'{x - kx:.0f} {y - ky:.0f}'
    mp = f'M{r(ox, oy)}C{r(ox - 260, oy + 190)} {r(kx + 420, ky + 210)} {r(kx, ky)}'
    minx, miny, maxx, maxy = L['bounds']; pad = 40
    vb = f'{minx-pad:.0f} {miny-pad:.0f} {maxx-minx+2*pad:.0f} {maxy-miny+300:.0f}'
    knot = affinity.translate(L['knot'], -kx, -ky)
    return (f'<svg class="motion-svg" viewBox="{vb}" role="img" aria-label="The dot leaves the last letter and runs ahead of the word">'
            f'<path d="{to_d(L["ink"])}" style="fill:var(--ink)"/><path d="{to_d(L["dots"])}" style="fill:var(--ink)"/>'
            f'<path d="{to_d(vow)}" style="fill:var(--acc)"/>'
            f'<g transform="translate({kx:.0f} {ky:.0f})"><path d="{to_d(knot)}" fill-rule="evenodd" style="fill:var(--acc)">'
            f'<animateMotion id="dotmove" dur="2.4s" begin="indefinite" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines=".5 0 .15 1" path="{mp}"/></path></g></svg>')

def use_fn(boxes):
    def use(m):
        sid, cls, label = m.group(1), m.group(2), m.group(3)
        w, h = boxes[sid]
        aria = f'role="img" aria-label="{label}"' if label != '-' else 'aria-hidden="true"'
        return f'<svg class="{cls}" viewBox="0 0 {w} {h}" {aria}><use href="#{sid}" width="{w}" height="{h}"/></svg>'
    return use

if __name__ == '__main__':
    tpl, out = sys.argv[1], sys.argv[2]
    sp, boxes = sprite()
    pcss = ':root{' + ''.join(f'--p-{k}:{uri(v)};' for k, v in patterns().items()) + '}'
    t = open(tpl, encoding='utf-8').read()
    t = t.replace('{{SPRITE}}', sp).replace('{{PATTERN_CSS}}', pcss).replace('{{MOTION}}', motion())
    t = re.sub(r'\{\{USE:([\w-]+):([\w -]*):([^}]+)\}\}', use_fn(boxes), t)
    left = re.findall(r'\{\{[^}]+\}\}', t)
    if left: raise SystemExit(f'unreplaced: {left[:4]}')
    open(out, 'w', encoding='utf-8').write(t)
    print('ok', round(len(t) / 1024), 'KB')
