"""Assemble the brand bible: inject logo sprite, pattern data URIs and generated diagrams into the template."""
import os, re, sys, runpy, urllib.parse

HERE = os.path.dirname(os.path.abspath(__file__))
template, out = sys.argv[1], sys.argv[2]
os.environ.setdefault('OUT', os.path.join(os.path.dirname(HERE), 'logo'))
L = runpy.run_path(os.path.join(HERE, 'gen_logo.py'))
P = runpy.run_path(os.path.join(HERE, 'gen_patterns.py'))

def varfill(svgtxt):
    return re.sub(r'fill="(var\([^"]+\))"', r'style="fill:\1"', svgtxt)

IDS = {'symbol': 'sym', 'symbol-mono': 'sym-mono', 'symbol-small': 'sym-small', 'wordmark-en': 'wm-en',
       'wordmark-fa': 'wm-fa', 'lockup-horizontal': 'lk-h', 'lockup-stacked': 'lk-s'}
files = {IDS[k]: varfill(v) for k, v in L['build']('css', 'var(--ink)', 'var(--knot)', 'var(--ring)', None).items()}
diamond, medallion, A, H, SYM_HALF = L['diamond'], L['medallion'], L['A'], L['H'], L['SYM_HALF']

# extra symbols: window medallion (centre two rings open) and the "filled" misuse example
def window_medallion(a=10, h=8.4):
    n_r = 3; n = 7; half = (n - 1) * a + h
    ring2, ring3 = [], []
    for i in range(n):
        for j in range(n):
            r = max(abs(i - n_r), abs(j - n_r))
            if r < 2: continue
            x = half + (i - j) * a; y = half + (i + j - (n - 1)) * a
            (ring2 if r == 2 else ring3).append(diamond(x, y, h))
    return (f'<svg viewBox="0 0 {2*half:g} {2*half:g}"><path d="{"".join(ring3)}" style="fill:var(--ink)"/>'
            f'<path d="{"".join(ring2)}" style="fill:var(--ring)"/></svg>')
files['win'] = window_medallion()
o, i = medallion(SYM_HALF, SYM_HALF, A, H, ring_split=True)
files['sym-filled'] = (f'<svg viewBox="0 0 {2*SYM_HALF:g} {2*SYM_HALF:g}"><path d="{o}" style="fill:var(--ink)"/>'
                       f'<path d="{i}{diamond(SYM_HALF, SYM_HALF, H)}" style="fill:var(--ring)"/></svg>')

sprite, boxes = [], {}
for key, txt in files.items():
    vb = re.search(r'viewBox="([^"]+)"', txt).group(1)
    body = re.sub(r'^<svg[^>]*>', '', txt.strip()); body = re.sub(r'</svg>$', '', body)
    body = re.sub(r'<title>.*?</title>', '', body)
    sprite.append(f'<symbol id="{key}" viewBox="{vb}">{body}</symbol>')
    boxes[key] = vb
SPRITE = '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' + ''.join(sprite) + '</svg>'

def use(m):
    key, cls, label = m.group(1), m.group(2), m.group(3)
    aria = f'role="img" aria-label="{label}"' if label != '-' else 'aria-hidden="true"'
    return f'<svg class="{cls}" viewBox="{boxes[key]}" {aria}><use href="#{key}"/></svg>'

# pattern custom properties
def uri(svgtxt):
    return 'url("data:image/svg+xml,' + urllib.parse.quote(svgtxt.replace('"', "'"), safe=" /=:;,.-()'") + '")'
pats = P['all_patterns']()
PATTERN_CSS = ':root{' + ''.join(f'--p-{k}:{uri(v)};' for k, v in pats.items()) + '}'

# construction diagram
def construction():
    s = 2.4; a, h = A * s, H * s; c = 160
    parts = []
    for k in range(-3, 4):  # lattice guides through knot centres
        off = k * a * 2 ** .5 / 2 * 2 ** .5
        parts.append(f'<line x1="{c - 150 + k*a:.1f}" y1="{c - 150 - k*a:.1f}" x2="{c + 150 + k*a:.1f}" y2="{c + 150 - k*a:.1f}"/>')
        parts.append(f'<line x1="{c - 150 + k*a:.1f}" y1="{c + 150 + k*a:.1f}" x2="{c + 150 + k*a:.1f}" y2="{c - 150 + k*a:.1f}"/>')
    guides = f'<g class="cg">{"".join(parts)}</g>'
    o, i = medallion(c, c, a, h, ring_split=True)
    hole = f'<path class="ch" d="{diamond(c, c, h)}"/>'
    # step annotation between two knot centres on the top-right edge
    x1, y1 = c + 0 * a, c - 4 * a; x2, y2 = c + 1 * a, c - 3 * a
    ann = (f'<g class="ca"><line x1="{x1+14:.1f}" y1="{y1-14:.1f}" x2="{x2+14:.1f}" y2="{y2-14:.1f}"/>'
           f'<text x="{(x1+x2)/2+24:.1f}" y="{(y1+y2)/2-16:.1f}">a</text>'
           '</g>')
    return (f'<svg class="construct" viewBox="0 0 330 320" role="img" aria-label="Symbol construction on a 5 by 5 diagonal lattice">'
            f'{guides}<path d="{o}" style="fill:var(--ink)"/><path d="{i}" style="fill:var(--ring)"/>{hole}{ann}</svg>')

# weave demo: 24 separate knots with a row index (bottom row = 0)
def weave():
    a, h = A, H; c = SYM_HALF; out = []
    for ii in range(5):
        for jj in range(5):
            if ii == 2 and jj == 2: continue
            x = c + (ii - jj) * a; y = c + (ii + jj - 4) * a
            row = 8 - (ii + jj); ring = max(abs(ii-2), abs(jj-2))
            fill = 'var(--ink)' if ring == 2 else 'var(--ring)'
            out.append(f'<path d="{diamond(x, y, h)}" style="fill:{fill};--r:{row}"/>')
    return f'<svg class="weave-svg" viewBox="0 0 {2*c:g} {2*c:g}" role="img" aria-label="The symbol weaving in, row by row">{"".join(out)}</svg>'

# naqsheh view of the border band: graph paper + knots
def naqsheh_view():
    grid = P['BAND']; cmap = dict(r='var(--runas)', z='var(--zafaran)', w='var(--pashm)')
    cell = 22; cols = len(grid[0]) * 2; rows = len(grid)
    lines = ''.join(f'<line x1="{x*cell}" y1="0" x2="{x*cell}" y2="{rows*cell}"/>' for x in range(cols + 1))
    lines += ''.join(f'<line x1="0" y1="{y*cell}" x2="{cols*cell}" y2="{y*cell}"/>' for y in range(rows + 1))
    kn = []
    for y, row in enumerate(grid):
        for x, ch in enumerate(row * 2):
            if ch != '.':
                kn.append(f'<path d="{diamond(x*cell+cell/2, y*cell+cell/2, cell*0.42)}" style="fill:{cmap[ch]}"/>')
    return (f'<svg class="naqsheh" viewBox="-1 -1 {cols*cell+2} {rows*cell+2}" role="img" aria-label="The border pattern drawn as a naqsheh: one square is one knot">'
            f'<g class="ng">{lines}</g>{"".join(kn)}</svg>')

html = open(template, encoding='utf-8').read()
html = html.replace('{{SPRITE}}', SPRITE).replace('{{PATTERN_CSS}}', PATTERN_CSS)
html = html.replace('{{CONSTRUCTION}}', construction()).replace('{{WEAVE}}', weave()).replace('{{NAQSHEH}}', naqsheh_view())
html = re.sub(r'\{\{USE:([\w-]+):([\w -]+):([^}]+)\}\}', use, html)
left = re.findall(r'\{\{[^}]+\}\}', html)
if left: raise SystemExit(f'unreplaced tokens: {left[:5]}')
open(out, 'w', encoding='utf-8').write(html)
print('ok', out, round(len(html) / 1024), 'KB')
