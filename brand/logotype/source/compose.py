import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from letters import *

def keshideh_version(W=72):
    P = Pen(W=W, T=11)
    j = jim_initial(P, 880, 430)
    keshideh(P, 884, 430, 560, 430, sag=8)
    tooth(P, 660, 432, 118)
    P.dot(632, 280, 0.82); P.dot(690, 280, 0.82)
    exit2, head2 = jim_medial(P, 560, 430)
    vav(P, *exit2)
    zamma(P, 1064, 172, 1.4); zamma(P, 664, 180, 1.4); zamma(P, 470, 214, 1.4)
    sokun(P, 785, 356, 19)
    three_dots(P, 760, 500, 1.0)
    return P

def stair_version(W=74):
    """Nastaliq stair: each join steps down to the left; a compact block."""
    P = Pen(W=W, T=11)
    jim_initial(P, 780, 300)
    keshideh(P, 784, 300, 610, 372, sag=10)
    tooth(P, 664, 362, 116)
    P.dot(636, 212, 0.82); P.dot(694, 212, 0.82)
    exit2, head2 = jim_medial(P, 612, 372)
    vav(P, *exit2, tail=1.25)
    zamma(P, 964, 40, 1.4); zamma(P, 668, 108, 1.4); zamma(P, 520, 152, 1.4)
    sokun(P, 742, 240, 19)
    three_dots(P, 850, 420, 1.0)
    return P

if __name__ == '__main__':
    out = sys.argv[1]
    for name, fn in (('kesh', keshideh_version), ('stair', stair_version)):
        P = fn()
        open(f'{out}-{name}-debug.svg', 'w').write(svg(P, '#F2EBDD', '#1A1714', '#A3261F', debug=True))
        open(f'{out}-{name}-light.svg', 'w').write(svg(P, '#F2EBDD', '#1A1714', '#A3261F'))
        open(f'{out}-{name}-dark.svg', 'w').write(svg(P, '#121A3F', '#F2EBDD', '#E2A63B'))
