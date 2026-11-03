"""Jostoju art prompts: one source for the copy-ready page and the markdown file."""
import html, os, sys

PROMPTS = [
  dict(id='mirror-hall', fa='آینه‌خانه', en='The Mirror Hall', where='Home · hero (until the reel is ready) and a keyframe for the hero video',
       model='Soul Cinema', aspect='16:9 (make a second 9:16 for phones)', ref='One Qajar portrait of a woman, e.g. your red-jacket mirror painting',
       file='site/media/hero/still.jpg', kind='Photoreal film still',
       prompt="""Wide cinematic film still inside a nineteenth-century Persian mirror hall at night. The walls and vaulted ceiling are covered in thousands of small diamond-shaped mirror tiles set in a faceted geometric mosaic, each facet catching warm candlelight in scattered gold sparks. On the left third of the frame a young Persian woman sits on a low embroidered bolster in a madder-red velvet jacket worked with gold thread, strings of pearls at her neck, black hair under a pearl and emerald diadem, kohl-lined almond eyes holding a calm, direct gaze into the lens. She raises a small round hand mirror; inside it glints a single madder-red diamond of light. Heavy red curtains are drawn aside behind her, brass lanterns glow on a Persian carpet. Warm low key light from the lanterns, soft 3:1 ratio, deep shadow in the corners. Composed with the frontal stillness of a Qajar court portrait. Palette of 60% varnished black and deep emerald, 30% madder red, 10% gold and pearl white. Rule of thirds. Photorealistic, ARRI Alexa LF, Cooke anamorphic lens, natural film grain."""),
  dict(id='seeker', fa='جوینده', en='The Seeker', where='Home · manifesto (red section)',
       model='Soul Cinema', aspect='4:5', ref='Your painting of the woman with the hand mirror and red jacket',
       file='site/media/art/seeker.jpg', kind='Painted artwork',
       prompt="""A new nineteenth-century Persian court oil painting on canvas in the Qajar style. A young woman kneels against embroidered bolster cushions on a red patterned carpet, wearing a short madder-red jacket with gold embroidery, a full emerald-green skirt edged with lace, white stockings and pointed red slippers. She holds up a small lacquered hand mirror painted with roses; the mirror glows with pale white light like a tiny cinema screen. Almond eyes, joined black brows, a calm sideways glance at the viewer. A porcelain bowl of pomegranates and grapes rests beside her. On the carpet near her slipper lies one small loose madder-red diamond-shaped jewel, set apart from all the others. Flat decorative space, dark varnished background, gold leaf highlights, fine craquelure. Palette of 60% deep varnished brown-black, 30% madder red and emerald, 10% gold and pearl. Rule of thirds."""),
  dict(id='camera', fa='دوربین شاه', en='The Royal Camera', where='Studio · «دوربین با قاجار آمد» (the Qajar camera)',
       model='Soul Cinema', aspect='16:9', ref='A Qajar court portrait of a seated king',
       file='site/media/art/camera.jpg', kind='Painted artwork',
       prompt="""A new nineteenth-century Persian court oil painting on canvas in the Qajar style. In a royal garden pavilion under a tiled pointed arch, a court photographer stands behind a large wooden box camera on a brass-fitted tripod, his head hidden under a black focusing cloth. Before the lens a Persian king sits upright and perfectly still on a gilded chair: black astrakhan hat with a jewelled aigrette, long upturned black moustache, a dark coat sewn with pearls and emeralds. Courtiers watch from the side, a peacock stands on the low wall, a long pool reflects the arch. On the brass ring of the camera lens sits one small madder-red diamond jewel. Flat decorative perspective, dark varnished sky, gold leaf on the arch, fine craquelure. Palette of 60% varnished dark green and brown, 30% madder red and emerald, 10% gold and pearl. Rule of thirds."""),
  dict(id='simorgh', fa='سی مرغ', en='Thirty Birds', where='Home · the seven valleys, or the final section',
       model='Soul Cinema', aspect='21:9', ref='A Qajar painting with birds, flowers or a palace interior',
       file='site/media/art/simorgh.jpg', kind='Painted artwork',
       prompt="""A wide nineteenth-century Persian court oil painting in the Qajar style, a long horizontal panorama. Thirty birds of many kinds, a hoopoe with its crest raised in front, nightingales, a peacock, a falcon and partridges, perch in one line along a gilded balustrade in a palace hall. They face an immense oval mirror in a carved gold frame on the left; in the mirror they appear as one great mythical bird with long flowing tail feathers in emerald, madder red and gold. The hoopoe holds one small madder-red diamond jewel in its beak. Walls of mirror mosaic glitter behind them. Flat decorative space, rhythmic composition, dark varnished ground, gold leaf, fine craquelure. Palette of 60% deep varnished black and emerald, 30% madder red and lapis blue, 10% gold. Rule of thirds."""),
  dict(id='pardeh', fa='پردهٔ نقال', en="The Naqqal's Pardeh", where='Home · Pardeh section, and the Pardeh page',
       model='Soul Cinema', aspect='21:9', ref='A Qajar coffee-house painting (naqqashi-ye qahveh-khaneh)',
       file='site/media/art/pardeh.jpg', kind='Photoreal film still',
       prompt="""Wide cinematic film still in a dim Tehran coffee house of the 1890s. A storyteller in a long dark coat and felt cap stands mid-gesture with his staff raised before a huge painted canvas hung across the back wall like a cinema screen: an epic painted battle of heroes on horseback in reds, golds and emeralds. Men sit in silhouette on carpet-covered wooden benches, tea glasses glowing, steam rising from a large brass samovar. A single shaft of warm lantern light from the left falls across the painted canvas and the storyteller, soft falloff into deep brown shadow. On the painted canvas, set in a hero's crown, one small madder-red diamond jewel catches the light. Palette of 60% smoky brown-black, 30% madder red and ochre, 10% gold. Rule of thirds. Photorealistic, ARRI Alexa LF, anamorphic lens, natural film grain."""),
  dict(id='nowruz', fa='نوروز', en='Nowruz', where='Home · «قاب‌ها» clip card (stand-in still until the film exists)',
       model='Soul Cinema', aspect='16:9', ref='A Qajar group portrait',
       file='site/media/art/nowruz.jpg', kind='Photoreal film still',
       prompt="""Cinematic film still: three young Persian sisters in brocade jackets and pearl headbands sit perfectly still behind a Nowruz table spread on a red carpet: sprouted wheat, red apples, a goldfish in a glass bowl, painted eggs, a mirror and lit candles. Frontal composition like a Qajar court portrait, calm direct gazes, a heavy red curtain drawn aside. Soft window light from the right, 2:1 ratio, candle glints in the mirror. A single small madder-red diamond jewel rests among the painted eggs. Palette of 60% deep emerald and varnished black, 30% madder red, 10% gold. Rule of thirds. Photorealistic, ARRI Alexa LF, natural film grain."""),
  dict(id='tar', fa='تار', en='The Tar Player', where='Home · «قاب‌ها» vertical clip card',
       model='Soul Cinema', aspect='9:16', ref='Optional: a Qajar portrait of a musician',
       file='site/media/art/tar.jpg', kind='Photoreal film still',
       prompt="""Vertical cinematic film still: a young Persian musician in a modern black coat over a Qajar-patterned silk shirt plays a tar on a flat mud-brick rooftop in old Tehran at blue hour, the wind lifting a red silk scarf. Behind him a turquoise-tiled dome and the first lights of the city. Cool blue ambient light with a warm lantern at his feet, soft rim light on his face. A small madder-red diamond pendant hangs at his collar. Palette of 60% lapis blue and dusk violet, 30% warm brick and madder red, 10% gold lantern light. Rule of thirds. Photorealistic, ARRI Alexa LF, natural film grain."""),
  dict(id='desert-mirror', fa='آینهٔ صحرا', en='The Desert Mirror', where='Home · «قاب‌ها» cinemascope clip card',
       model='Soul Cinema', aspect='21:9', ref='None needed',
       file='site/media/art/desert-mirror.jpg', kind='Photoreal film still',
       prompt="""Cinemascope film still: a tall standing mirror in a carved gold Qajar frame stands alone on rippled desert dunes at dawn, a caravan of camels crossing the ridge far behind it. The mirror reflects a dark palace hall full of candlelight instead of the desert. In the mirror's gold crest sits one small madder-red diamond jewel. Low golden sun from the right, long soft shadows across the sand, an empty and silent landscape. Palette of 60% pale sand and dawn rose, 30% deep shadow brown, 10% gold. Rule of thirds. Photorealistic, ARRI Alexa LF, anamorphic lens, natural film grain."""),
]

LOST_DOT_EDIT = """Edit the image: add one small hidden jewel.

CHANGE: Place a single small madder-red diamond-shaped jewel, faceted and catching the light like the other jewels in the image, at [WHERE, e.g. on the carpet beside the left slipper]. It is about the size of a fingertip in the scene and casts a small natural shadow.

PRESERVE EXACTLY:
- Every figure, face, costume, pose and object, and their positions
- Composition, perspective and framing
- Color grade, palette, contrast, varnish, craquelure and brushwork

ONLY CHANGE: add the one red diamond jewel. 100% identical otherwise."""

def markdown():
    out = ['# Jostoju art prompts', '',
           'Every image hides the **lost dot**: one small madder-red diamond jewel. On the site, visitors can find it.', '',
           '**How to use:** generate in **Higgsfield Soul Cinema** with one Qajar painting as the reference image. '
           'Set the aspect ratio and 2k quality in the UI; they are not part of the prompt. Save each result with the file name given and drop it in the repo (or send it to Claude).', '']
    for p in PROMPTS:
        out += [f"## {p['fa']} · {p['en']}", '', f"- **Goes on:** {p['where']}", f"- **Type:** {p['kind']}",
                f"- **Model:** {p['model']} · **Aspect:** {p['aspect']} · **Reference:** {p['ref']}",
                f"- **Save as:** `{p['file']}`", '', '```', p['prompt'], '```', '']
    out += ['## Add the lost dot to any image · NBP edit', '', '```', LOST_DOT_EDIT, '```', '']
    return '\n'.join(out)

def page():
    E = html.escape
    cards = []
    for i, p in enumerate(PROMPTS, 1):
        cards.append(f'''<article class="card" id="{p['id']}">
  <header><span class="n">{i:02d}</span><h2><span class="fa" lang="fa" dir="rtl">{E(p['fa'])}</span> <span class="en">{E(p['en'])}</span></h2><span class="kind">{E(p['kind'])}</span></header>
  <dl>
    <div><dt>Goes on</dt><dd>{E(p['where'])}</dd></div>
    <div><dt>Model</dt><dd>{E(p['model'])}</dd></div>
    <div><dt>Aspect</dt><dd>{E(p['aspect'])}</dd></div>
    <div><dt>Reference</dt><dd>{E(p['ref'])}</dd></div>
    <div><dt>Save as</dt><dd><code>{E(p['file'])}</code></dd></div>
  </dl>
  <div class="prompt"><pre id="p-{p['id']}">{E(p['prompt'])}</pre><button type="button" data-copy="p-{p['id']}">Copy prompt</button></div>
</article>''')
    edit = f'''<article class="card edit" id="lost-dot">
  <header><span class="n">+</span><h2><span class="fa" lang="fa" dir="rtl">نقطهٔ گمشده</span> <span class="en">Add the lost dot</span></h2><span class="kind">Edit · Nano Banana Pro</span></header>
  <p class="note">If an image comes out without the red jewel, run this edit on it in NBP. Replace [WHERE] with a spot in that image.</p>
  <div class="prompt"><pre id="p-edit">{E(LOST_DOT_EDIT)}</pre><button type="button" data-copy="p-edit">Copy prompt</button></div>
</article>'''
    return f'''<title>Jostoju Art Prompts</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Amiri:wght@700&family=Bodoni+Moda:opsz,wght@6..96,800&family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap">
<style>
/* Layout: a working sheet. One column of prompt cards on pearl paper, each with its brief and a copy button. */
:root {{ color-scheme: light; --pearl:#F4EDE0; --paper:#E7D9BD; --ink:#16110E; --mute:rgba(22,17,14,.66); --line:rgba(22,17,14,.14); --red:#A3261F; --green:#1F5A46; --gold:#D4A640;
  --display:"Bodoni Moda",Didot,Georgia,serif; --fa:"Amiri","Times New Roman",serif; --text:"Instrument Sans","Segoe UI",system-ui,sans-serif; --mono:"JetBrains Mono",ui-monospace,Menlo,monospace }}
* {{ box-sizing:border-box }}
body {{ margin:0; background:var(--pearl); color:var(--ink); font:400 1rem/1.6 var(--text) }}
.wrap {{ max-width:880px; margin-inline:auto; padding-left:max(18px,env(safe-area-inset-left,0px)); padding-right:max(18px,env(safe-area-inset-right,0px)); padding-block:clamp(36px,6vw,72px) 64px }}
.top {{ display:grid; gap:12px; margin-bottom:34px }}
.top .fa {{ font:700 clamp(2.4rem,1.6rem + 3vw,3.6rem)/1.4 var(--fa); margin:0; direction:rtl; text-align:right }}
h1 {{ margin:0; font:800 clamp(2rem,1.4rem + 2.4vw,3rem)/1.05 var(--display); letter-spacing:-.01em }}
.lede {{ margin:0; color:var(--mute); max-width:62ch }}
.how {{ display:grid; gap:10px; padding:18px 20px; background:var(--paper); margin:6px 0 0 }}
.how b {{ color:var(--red) }}
.dotnote {{ display:flex; gap:12px; align-items:center; }}
.dotnote i {{ width:14px; height:14px; background:var(--red); transform:rotate(45deg); flex:none }}
.cards {{ display:grid; gap:22px }}
.card {{ border:1px solid var(--line); background:#FBF7EF; padding:22px 22px 20px; display:grid; gap:14px; min-width:0 }}
.card header {{ display:flex; flex-wrap:wrap; align-items:baseline; gap:6px 14px }}
.card .n {{ font:400 .8rem/1 var(--mono); color:var(--red) }}
.card h2 {{ margin:0; display:flex; gap:12px; align-items:baseline; flex-wrap:wrap }}
.card h2 .fa {{ font:700 1.9rem/1.4 var(--fa) }}
.card h2 .en {{ font:800 1.25rem/1.2 var(--display) }}
.card .kind {{ margin-inline-start:auto; font-size:.8rem; padding:2px 10px; border:1px solid var(--line); color:var(--mute) }}
dl {{ margin:0; display:grid; gap:4px 18px; grid-template-columns:1fr }}
@media (min-width:640px) {{ dl {{ grid-template-columns:repeat(2,minmax(0,1fr)) }} }}
dl div {{ display:grid; grid-template-columns:90px 1fr; gap:10px; min-width:0 }}
dt {{ color:var(--mute); font-size:.85rem }}
dd {{ margin:0; font-size:.92rem; min-width:0; overflow-wrap:anywhere }}
code {{ font:400 .82rem/1.4 var(--mono); color:var(--green) }}
.prompt {{ position:relative; background:var(--ink); color:#EFE6D4; padding:18px 18px 56px; min-width:0 }}
pre {{ margin:0; white-space:pre-wrap; font:400 .9rem/1.65 var(--mono); overflow-wrap:anywhere }}
.prompt button {{ position:absolute; right:12px; bottom:12px; font:500 .85rem/1 var(--text); padding:10px 14px; border:0; background:var(--gold); color:var(--ink); cursor:pointer }}
.prompt button.ok {{ background:#7FBF9E }}
.prompt button:focus-visible {{ outline:2px solid #fff; outline-offset:2px }}
.note {{ margin:0; color:var(--mute) }}
.card.edit {{ border-color:var(--red) }}
footer {{ margin-top:30px; color:var(--mute); font-size:.85rem }}
</style>
<div class="wrap">
  <header class="top">
    <p class="fa" lang="fa">دستورهای تصویر جستجو</p>
    <h1>Art prompts</h1>
    <p class="lede">Eight images that turn Qajar paintings into new Jostoju artwork for the website. Every one hides the lost dot: one small madder-red diamond jewel that visitors can find on the site.</p>
    <div class="how">
      <div><b>Model:</b> Higgsfield Soul Cinema. Use one Qajar painting you love as the reference image; the prompt sets the new scene.</div>
      <div><b>Settings:</b> set the aspect ratio and 2k quality in the Higgsfield UI. They are not part of the prompt.</div>
      <div><b>Blending:</b> Soul Cinema takes one reference. To blend several paintings, use Nano Banana Pro, which accepts many references.</div>
      <div class="dotnote"><i aria-hidden="true"></i><span>Save each result with the file name given and send it to me, or drop it into the repo. The site picks it up.</span></div>
    </div>
  </header>
  <div class="cards">
{chr(10).join(cards)}
{edit}
  </div>
  <footer>Jostoju · art prompts v1 · prompts follow the Lira method: natural prose, technical light, 60/30/10 palette, settings in the UI.</footer>
</div>
<script>
document.querySelectorAll('[data-copy]').forEach(function (b) {{
  b.addEventListener('click', function () {{
    var pre = document.getElementById(b.dataset.copy), txt = pre.textContent;
    var done = function () {{ b.textContent = 'Copied'; b.classList.add('ok'); setTimeout(function () {{ b.textContent = 'Copy prompt'; b.classList.remove('ok'); }}, 1600); }};
    var sel = function () {{ var r = document.createRange(); r.selectNodeContents(pre); var s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = 'Selected'; }};
    try {{ navigator.clipboard.writeText(txt).then(done, sel); }} catch (e) {{ sel(); }}
  }});
}});
</script>
'''

if __name__ == '__main__':
    here = os.path.dirname(os.path.abspath(__file__))
    open(os.path.join(here, 'PROMPTS.md'), 'w', encoding='utf-8').write(markdown())
    open(os.path.join(here, 'prompts.html'), 'w', encoding='utf-8').write(page())
    lens = {p['id']: len(p['prompt']) for p in PROMPTS}
    print('written', lens)
