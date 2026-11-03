"""Set a word in a real font with HarfBuzz, split it into layers (letters, dots, vowels)
and apply Jostoju's 'quest' modifications."""
import math, uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

VOWELS = {'uni064F': 'zamma', 'uni0652': 'sukun', 'uni064E': 'fatha', 'uni0650': 'kasra', 'uni0651': 'shadda'}

def split(rec):
    cs, cur = [], []
    for op, args in rec:
        cur.append((op, args))
        if op in ('closePath', 'endPath'): cs.append(cur); cur = []
    return cs

def bb(c):
    pts = [p for _, a in c for p in a]
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
    return [min(xs), min(ys), max(xs), max(ys)]

class Word:
    def __init__(self, path, text):
        self.f = TTFont(path); gs = self.f.getGlyphSet(); order = self.f.getGlyphOrder()
        gdef = self.f['GDEF'].table.GlyphClassDef.classDefs
        face = hb.Face(open(path, 'rb').read()); font = hb.Font(face)
        buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties(); hb.shape(font, buf, {})
        infos = [(i.codepoint, i.cluster) for i in buf.glyph_infos]; pos = [(p.x_advance, p.x_offset, p.y_offset) for p in buf.glyph_positions]
        self.ink, self.dots, self.vowels, self.glyphs = [], [], [], []
        x = 0
        for (gid, cl), (adv, xo, yo) in zip(infos, pos):
            name = order[gid]; ox, oy = x + xo, yo
            rec = DecomposingRecordingPen(gs); gs[name].draw(rec)
            cs = split(rec.value)
            mv = lambda b: [b[0] + ox, b[1] + oy, b[2] + ox, b[3] + oy]
            if name in VOWELS:
                self.vowels.append(dict(kind=VOWELS[name], cl=cl, contours=cs, ox=ox, oy=oy, bb=mv(bb([s for c in cs for s in c]))))
            elif 'dot' in name.lower() and gdef.get(name) == 3:          # Noto: dots are marks
                for b in self._dot_boxes(cs): self.dots.append(dict(cl=cl, bb=mv(b)))
            else:
                boxes = [bb(c) for c in cs]
                body = max(range(len(cs)), key=lambda i: (boxes[i][2]-boxes[i][0])*(boxes[i][3]-boxes[i][1]))
                B = boxes[body]
                keep = []
                for i, c in enumerate(cs):
                    b = boxes[i]
                    detached = b[1] >= B[3] - 6 or b[3] <= B[1] + 6     # dots sit wholly above or below the body
                    if i == body or not detached: keep.append(c)
                    else:
                        for d in self._dot_boxes([c]): self.dots.append(dict(cl=cl, bb=mv(d)))
                self.ink.append(dict(cl=cl, name=name, contours=keep, ox=ox, oy=oy, bb=mv(bb([s for c in keep for s in c]))))
            x += adv
        self.width = x

    @staticmethod
    def _dot_boxes(cs):
        out = []
        for c in cs:
            b = bb(c); w, h = b[2]-b[0], b[3]-b[1]
            if w > 1.3 * h:   # two dots drawn as one shape: split it into two square cells
                s = min(w / 2, h); cy = (b[1] + b[3]) / 2
                for cx in (b[0] + w / 4, b[2] - w / 4):
                    out.append([cx - s/2, cy - s/2, cx + s/2, cy + s/2])
            else: out.append(b)
        return out

    def path(self, item, dx=0, dy=0, scale=1.0, about=None):
        """SVG path (y down) for an ink/vowel item, optionally moved and scaled about a point."""
        pen = SVGPathPen(None)
        cx, cy = about or (0, 0)
        # font -> svg: X = (x+ox-cx)*s+cx+dx ; Y = -((y+oy-cy)*s+cy) - dy
        t = (scale, 0, 0, -scale, item['ox']*scale + cx*(1-scale) + dx, -(item['oy']*scale + cy*(1-scale)) - dy)
        tp = TransformPen(pen, t)
        for c in item['contours']:
            for op, args in c: getattr(tp, op)(*args)
        return pen.getCommands()

    def point_extreme(self, item, fn):
        pts = [(p[0] + item['ox'], p[1] + item['oy']) for c in item['contours'] for _, a in c for p in a]
        return fn(pts)
