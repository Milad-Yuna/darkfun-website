"""Jostoju pattern library. Every pattern is a naqsheh: a grid where each
character is one knot. '.' = empty. Letters map to palette colours."""
import os, random

PAL = dict(pashm='#F2EBDD', kaghaz='#E4D6BA', morakkab='#1A1714', nil='#121A3F',
           lajvard='#203A8F', runas='#A3261F', zafaran='#E2A63B', firuzeh='#2E9E97')

C = 10      # knot cell
HK = 4.4    # knot half-diagonal (gap shows at the tips)

def knot(cx, cy, h=HK):
    return f"M{cx:g} {cy-h:g}l{h:g} {h:g}l{-h:g} {h:g}l{-h:g} {-h:g}z"

def from_grid(rows, colors, cell=C, h=HK):
    rows = [r for r in rows]
    w = max(len(r) for r in rows) * cell; ht = len(rows) * cell
    paths = {}
    for y, row in enumerate(rows):
        for x, ch in enumerate(row):
            if ch == '.' or ch == ' ':
                continue
            paths.setdefault(ch, []).append(knot(x * cell + cell / 2, y * cell + cell / 2, h))
    body = ''.join(f'<path fill="{colors[k]}" d="{"".join(v)}"/>' for k, v in paths.items())
    return w, ht, body

def svg(w, h, body):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w:g}" height="{h:g}" viewBox="0 0 {w:g} {h:g}">{body}</svg>'

# 1. Hashiyeh: border band, repeats on x
BAND = [
    "rrrrrrrrrrrr",
    "............",
    "...z........",
    "..z.z....w..",
    ".z.r.z..www.",
    "..z.z....w..",
    "...z........",
    "............",
    "rrrrrrrrrrrr",
]
# 2. Matn: field lattice, repeats on x and y
FIELD = [
    "........",
    "..z.....",
    ".z.z....",
    "..z.....",
    "........",
    "......z.",
    ".....z.z",
    "......z.",
]
# 3. Lachak: corner piece (top-left; rotate for the others)
LACHAK = [
    "rrrrrrrrrrrr",
    "r...........",
    "r.zzzzzzzz..",
    "r.zwwwwwz...",
    "r.zwrrwz....",
    "r.zwrwz.....",
    "r.zwwz......",
    "r.zwz.......",
    "r.zz........",
    "r.z.........",
    "r...........",
    "r...........",
]

def toranj_lattice(n_rings, ring_colors, a=10, h=8.4):
    """Medallion on the 45-degree lattice, like the symbol. ring_colors[r] or None (empty)."""
    n = 2 * n_rings + 1; c = n_rings
    half = (n - 1) * a + h
    paths = {}
    for i in range(n):
        for j in range(n):
            r = max(abs(i - c), abs(j - c))
            col = ring_colors[r]
            if not col:
                continue
            x = half + (i - j) * a; y = half + (i + j - (n - 1)) * a
            paths.setdefault(col, []).append(knot(x, y, h))
    body = ''.join(f'<path fill="{k}" d="{"".join(v)}"/>' for k, v in paths.items())
    return 2 * half, 2 * half, body

def zarafshan(w=240, h=240, n=26, color=PAL['zafaran'], seed=1405):
    rnd = random.Random(seed)
    body = ''.join(knot(rnd.uniform(6, w - 6), rnd.uniform(6, h - 6), rnd.choice([1.6, 2.2, 2.8])) for _ in range(n))
    return w, h, f'<path fill="{color}" opacity=".85" d="{body}"/>'

VARIANTS = {
    # ground: colour map for letters
    'nil':    dict(r=PAL['runas'], z=PAL['zafaran'], w=PAL['pashm']),
    'pashm':  dict(r=PAL['runas'], z=PAL['lajvard'], w=PAL['zafaran']),
    'lajvard':dict(r=PAL['zafaran'], z=PAL['pashm'], w=PAL['runas']),
}

def all_patterns():
    out = {}
    for g, cmap in VARIANTS.items():
        out[f'hashiyeh-{g}'] = svg(*from_grid(BAND, cmap))
        flips = {'tl': LACHAK, 'tr': [r[::-1] for r in LACHAK],
                 'bl': LACHAK[::-1], 'br': [r[::-1] for r in LACHAK[::-1]]}
        for corner, grid in flips.items():
            out[f'lachak-{corner}-{g}'] = svg(*from_grid(grid, cmap))
    out['matn-nil'] = svg(*from_grid(FIELD, dict(z='rgba(242,235,221,.07)')))
    out['matn-pashm'] = svg(*from_grid(FIELD, dict(z='rgba(32,58,143,.08)')))
    out['toranj-nil'] = svg(*toranj_lattice(6, [None, PAL['zafaran'], PAL['runas'], None, PAL['pashm'], None, PAL['lajvard']]))
    out['toranj-pashm'] = svg(*toranj_lattice(6, [None, PAL['runas'], PAL['lajvard'], None, PAL['morakkab'], None, PAL['zafaran']]))
    out['zarafshan'] = svg(*zarafshan())
    return out

if __name__ == '__main__':
    import sys
    out_dir = sys.argv[1]
    os.makedirs(out_dir, exist_ok=True)
    for k, v in all_patterns().items():
        open(os.path.join(out_dir, f'{k}.svg'), 'w').write(v + '\n')
    print('patterns:', len(all_patterns()))
