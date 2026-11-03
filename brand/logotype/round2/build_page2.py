import sys, os, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from variants import build, COMBOS

def symbol(sid, parts, vb, thread_w=26):
    b = [f'<path d="{"".join(parts["ink"])}" style="fill:var(--ink)"/>']
    if parts['dots']: b.append(f'<path d="{"".join(parts["dots"])}" style="fill:var(--ink)"/>')
    if parts['hollow']: b.append(f'<path d="{"".join(parts["hollow"])}" fill-rule="evenodd" style="fill:var(--vow)"/>')
    if parts['thread']: b.append(f'<path d="{"".join(parts["thread"])}" fill="none" stroke-width="{thread_w}" stroke-linecap="round" style="stroke:var(--ink)"/>')
    if parts['knot']: b.append(f'<path d="{"".join(parts["knot"])}" style="fill:var(--vow)"/>')
    b.append(f'<path d="{"".join(parts["vow"])}" style="fill:var(--vow)"/>')
    v = f'{vb[0]:.0f} {vb[1]:.0f} {vb[2]:.0f} {vb[3]:.0f}'
    return f'<symbol id="{sid}" viewBox="{v}">{"".join(b)}</symbol>', (round(vb[2]), round(vb[3]))

syms = {}
for font in ('amiri', 'noto'):
    for c in ('journey', 'missing', 'thread', 'ascent', 'road', 'path'):
        p, vb = build(font, c)
        syms[f'{font}-{c}'] = symbol(f'{font}-{c}', p, vb)
sprite = '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' + ''.join(s for s, _ in syms.values()) + '</svg>'
def use(m):
    sid, cls, label = m.group(1), m.group(2), m.group(3)
    w, h = syms[sid][1]
    aria = f'role="img" aria-label="{label}"' if label != '-' else 'aria-hidden="true"'
    return f'<svg class="{cls}" viewBox="0 0 {w} {h}" {aria}><use href="#{sid}" width="{w}" height="{h}"/></svg>'
t = open(sys.argv[1], encoding='utf-8').read().replace('{{SPRITE}}', sprite)
t = re.sub(r'\{\{USE:([\w-]+):([\w -]*):([^}]+)\}\}', use, t)
open(sys.argv[2], 'w', encoding='utf-8').write(t)
print('ok', round(len(t) / 1024), 'KB')
