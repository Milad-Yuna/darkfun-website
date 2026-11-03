import sys, os, re
sys.path.insert(0, '.')
from compose import keshideh_version, stair_version
from letters import *

def symbol(P, sid, pad=40, debug=False):
    ink = unary_union(P.ink); vow = unary_union(P.vow); dots = unary_union(P.dots); dec = unary_union(P.deco)
    minx, miny, maxx, maxy = bounds(ink, vow, dots, dec)
    vb = f'{minx-pad:.0f} {miny-pad:.0f} {maxx-minx+2*pad:.0f} {maxy-miny+2*pad:.0f}'
    if debug:
        lines = ''.join(f'<polyline points="{" ".join(f"{x:.0f},{y:.0f}" for x, y in pts)}" fill="none" style="stroke:var(--line-c)" stroke-width="2.5"/>' for pts in P.lines)
        body = (f'<path d="{to_d(ink)}" style="fill:var(--ghost)"/><path d="{to_d(dots)}" style="fill:var(--ghost)"/>'
                f'<path d="{to_d(vow)}" style="fill:var(--ghost)"/><path d="{to_d(dec)}" style="fill:var(--ghost)"/>{lines}')
    else:
        body = (f'<path d="{to_d(ink)}" style="fill:var(--ink)"/><path d="{to_d(dots)}" style="fill:var(--ink)"/>'
                f'<path d="{to_d(vow)}" style="fill:var(--vow)"/><path d="{to_d(dec)}" style="fill:var(--vow)"/>')
    return f'<symbol id="{sid}" viewBox="{vb}">{body}</symbol>', vb

K, St = keshideh_version(), stair_version()
syms = {}
for sid, P, dbg in (('kesh', K, False), ('stair', St, False), ('kesh-build', keshideh_version(), True)):
    syms[sid] = symbol(P, sid, debug=dbg)
sprite = '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' + ''.join(s for s, _ in syms.values()) + '</svg>'
def use(sid, cls='', label='-'):
    aria = f'role="img" aria-label="{label}"' if label != '-' else 'aria-hidden="true"'
    w, h = syms[sid][1].split()[2:]
    return f'<svg class="{cls}" viewBox="0 0 {w} {h}" {aria}><use href="#{sid}" width="{w}" height="{h}"/></svg>'

tpl = open('page.template.html', encoding='utf-8').read()
tpl = tpl.replace('{{SPRITE}}', sprite)
tpl = re.sub(r'\{\{USE:([\w-]+):([\w -]*):([^}]+)\}\}', lambda m: use(m.group(1), m.group(2), m.group(3)), tpl)
open(sys.argv[1], 'w', encoding='utf-8').write(tpl)
print('ok', round(len(tpl)/1024), 'KB')
