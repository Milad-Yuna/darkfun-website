// Jostoju Instagram kit. Renders every template at Instagram's exact size with the brand's own marks,
// colours, fonts and patterns.   NODE_PATH=$(npm root -g) node brand/social/render_social.js
// Output: brand/social/export/*.jpg|png (upload-ready) and brand/social/preview/*.jpg (small, for the bible).
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.join(__dirname, 'export');
const PREV = path.join(__dirname, 'preview');
const MARKS = JSON.parse(fs.readFileSync(path.join(ROOT, 'site', 'src', 'marks.json'), 'utf8'));
const f = (p) => 'file://' + path.join(ROOT, p);
const HANDLE = '@jostoju';      // placeholder until the handle is secured

const mark = (id, w, vars = '') => {
  const m = MARKS[id]; const [, , vw, vh] = m.viewBox.split(' ').map(Number);
  return `<svg viewBox="${m.viewBox}" width="${w}" height="${(w * vh / vw).toFixed(1)}" style="display:block;${vars}">${m.markup}</svg>`;
};
const logo = (w, ink = 'var(--morvarid)', acc = 'var(--tala)') => mark('compact', w, `--ink:${ink};--acc:${acc};--ring:${acc}`);
const sym = (w, ink = 'var(--morvarid)', ring = 'var(--tala)') => mark('symbol', w, `--ink:${ink};--acc:${ring};--ring:${ring}`);
const dia = (s, c) => `<i class="dia" style="width:${s}px;height:${s}px;background:${c}"></i>`;
const lachak = (g, size = 120, inset = 46) => ['tl', 'tr', 'bl', 'br'].map((k) => {
  const pos = { tl: `top:${inset}px;left:${inset}px`, tr: `top:${inset}px;right:${inset}px`, bl: `bottom:${inset}px;left:${inset}px`, br: `bottom:${inset}px;right:${inset}px` }[k];
  return `<img src="${f(`brand/patterns/lachak-${k}-${g}.svg`)}" style="position:absolute;${pos};width:${size}px;height:${size}px">`;
}).join('');
const archPath = (w, h) => { const X = (v) => (v * w / 100).toFixed(1), Y = (v) => (v * h / 130).toFixed(1);
  return `path('M0 ${Y(130)}V${Y(58)}Q0 ${Y(34)} ${X(21)} ${Y(20)}Q${X(41)} ${Y(8)} ${X(50)} 0Q${X(59)} ${Y(8)} ${X(79)} ${Y(20)}Q${w} ${Y(34)} ${w} ${Y(58)}V${h}Z')`; };
const pearls = (top, color, w = '100%', left = 0) => `<div class="pearls" style="top:${top}px;left:${left};width:${w};--pc:${color}"></div>`;

const CSS = `
:root{--shab:#16110E;--morvarid:#F4EDE0;--kaghaz:#E7D9BD;--runas:#A3261F;--zomorrod:#1F5A46;--tala:#D4A640;--lajvard:#233C8E;--gol:#E39AA6}
*{box-sizing:border-box;margin:0}
body{background:#777;padding:0}
.t{position:relative;overflow:hidden;color:var(--morvarid);font-family:Vazirmatn,Tahoma,sans-serif;direction:rtl}
.fa-d{font-family:Amiri,serif;font-weight:700}
.en-d{font-family:"Bodoni Moda",Didot,serif;direction:ltr}
.mono{font-family:"JetBrains Mono",monospace;direction:ltr;letter-spacing:.12em;text-transform:uppercase}
.verse{font-family:"Noto Nastaliq Urdu",Amiri,serif;direction:rtl}
.dia{display:inline-block;transform:rotate(45deg);flex:none}
.pearls{position:absolute;height:22px;background:radial-gradient(circle at 50% 50%,var(--pc) 0 5px,transparent 5.6px) center/22px 22px repeat-x}
.cover{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.shade{position:absolute;inset:0}
.pill{display:inline-flex;align-items:center;gap:14px;padding:12px 24px;font-size:30px;font-weight:500}
.handle{font-family:"JetBrains Mono",monospace;font-size:24px;letter-spacing:.06em;direction:ltr}
`;

/* ---------------------------------------------------------------- templates */
const T = {};
const quote = (g, poet, poetEn, lines, en, label) => `
<div class="t" style="width:1080px;height:1350px;background:var(--${g})">
  ${lachak(g)}
  <div style="position:absolute;inset:0;display:grid;justify-items:center;align-content:center;gap:34px;padding:0 120px;text-align:center">
    <div style="display:flex;gap:18px;align-items:center;color:var(--tala);font-size:34px;font-weight:500">${dia(14, 'var(--tala)')}<span>${label}</span>${dia(14, 'var(--tala)')}</div>
    <p class="verse" style="font-size:${lines.length > 1 ? 60 : 56}px;line-height:2.55;${lines.length > 1 ? '' : 'white-space:nowrap'}">${lines.join('<br>')}</p>
    <p class="en-d" style="font-size:30px;line-height:1.45;font-style:italic;font-weight:500;color:rgba(244,237,224,.78);max-width:760px">${en}</p>
    <p style="font-size:30px;color:var(--tala)">${poet} <span class="en-d" style="font-size:24px;font-style:italic;opacity:.85">· ${poetEn}</span></p>
  </div>
  <div style="position:absolute;left:0;right:0;bottom:118px;display:grid;justify-items:center;gap:14px">${logo(230)}<span class="handle" style="color:rgba(244,237,224,.7)">${HANDLE}</span></div>
</div>`;
T['post-quote-rumi'] = quote('runas', 'مولانا', 'Rumi', ['… یافت می‌نشود، جسته‌ایم ما', 'گفت آنکه یافت می‌نشود، آنم آرزوست'],
  '“…It cannot be found; we have searched.” He said, “What cannot be found is what I long for.”', 'جستجو');
T['post-quote-hafez'] = quote('zomorrod', 'حافظ', 'Hafez', ['سال‌ها دل طلب جام جم از ما می‌کرد', 'آنچه خود داشت ز بیگانه تمنا می‌کرد'],
  'For years my heart begged us for the cup of Jamshid; what it already held, it sought from strangers.', 'جستجو');
T['post-quote-attar'] = quote('lajvard', 'عطار · منطق‌الطیر', 'Attar', ['… بی‌شک این سی مرغ، آن سیمرغ بود'],
  '…Beyond doubt, these thirty birds were that Simorgh.', 'سی مرغ');

const film = (img, pos, fa, en, kind, kindEn) => `
<div class="t" style="width:1080px;height:1350px;background:var(--shab)">
  <img class="cover" src="${f(img)}" style="object-position:${pos}">
  <div class="shade" style="background:linear-gradient(to bottom,rgba(22,17,14,.55),transparent 22%,transparent 52%,rgba(22,17,14,.92) 82%,var(--shab))"></div>
  ${pearls(46, 'var(--morvarid)', '1000px', '40px')}
  <div style="position:absolute;top:104px;right:64px" class="pill" ><span style="background:var(--morvarid);color:var(--shab);padding:10px 22px;display:inline-flex;gap:14px;align-items:center">${dia(12, 'var(--runas)')}${kind}</span></div>
  <div style="position:absolute;right:72px;left:72px;bottom:96px;display:grid;gap:8px">
    <p class="fa-d" style="font-size:136px;line-height:1.35">${fa}</p>
    <p class="en-d" style="font-size:44px;font-weight:800;line-height:1.1">${en}</p>
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:34px;padding-top:26px;border-top:2px solid rgba(212,166,64,.45)">
      <span style="font-size:30px;color:var(--tala)">به‌زودی <span class="en-d" style="font-style:italic;font-size:26px">· ${kindEn}</span></span>${logo(210)}
    </div>
  </div>
</div>`;
T['post-film-desert'] = film('site/media/art/desert-mirror.jpg', '38% 50%', 'آینهٔ صحرا', 'The Desert Mirror', 'فیلم کوتاه', 'Coming soon · Short film');
T['post-film-nowruz'] = film('site/media/art/nowruz.jpg', '50% 40%', 'نوروز', 'Nowruz', 'فیلم برند', 'Coming soon · Brand film');

T['post-art-tar'] = `
<div class="t" style="width:1080px;height:1350px;background:var(--shab)">
  <img src="${f('brand/patterns/zarafshan.svg')}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.55">
  <div style="position:absolute;left:190px;top:96px;width:700px;height:930px;background:var(--tala);clip-path:${archPath(700, 930)}">
    <div style="position:absolute;left:10px;top:10px;width:680px;height:920px;clip-path:${archPath(680, 920)};overflow:hidden">
      <img class="cover" src="${f('site/media/art/tar.jpg')}" style="object-position:50% 46%">
    </div>
  </div>
  ${pearls(1046, 'var(--tala)', '700px', '190px')}
  <div style="position:absolute;left:96px;right:96px;bottom:92px;display:flex;justify-content:space-between;align-items:flex-end">
    <div><p class="fa-d" style="font-size:96px;line-height:1.3">تار</p><p style="font-size:30px;color:rgba(244,237,224,.78);display:flex;gap:14px;align-items:center">${dia(14, 'var(--runas)')}نقطهٔ گمشده را در این قاب پیدا کن</p></div>
    <div style="display:grid;justify-items:end;gap:10px">${logo(200)}<span class="handle" style="color:rgba(244,237,224,.65)">${HANDLE}</span></div>
  </div>
</div>`;

T['post-history-camera'] = `
<div class="t" style="width:1080px;height:1350px;background:var(--shab)">
  <div style="position:absolute;top:96px;right:72px;left:72px;display:grid;gap:6px">
    <span class="mono" style="font-size:26px;color:var(--tala);direction:ltr;text-align:right">1842 · ۱۲۲۱</span>
    <p class="fa-d" style="font-size:92px;line-height:1.4">دوربین با قاجار آمد.</p>
    <p class="en-d" style="font-size:36px;font-weight:800">The camera came with the Qajars.</p>
  </div>
  <div style="position:absolute;top:470px;left:60px;right:60px;padding:14px;background:linear-gradient(135deg,#7d5e1f,#e9c86c 28%,#a8812d 52%,#f2d684 74%,#7d5e1f);box-shadow:0 40px 80px -40px #000">
    <img src="${f('site/media/art/camera.jpg')}" style="display:block;width:100%;height:auto">
  </div>
  <div style="position:absolute;right:72px;left:72px;bottom:96px;display:flex;justify-content:space-between;align-items:flex-end;gap:40px">
    <p style="font-size:30px;line-height:1.8;color:rgba(244,237,224,.85);max-width:640px">ناصرالدین‌شاه خود عکاس بود و در کاخ گلستان عکاس‌خانه ساخت. جستجو از همان‌جا ادامه می‌دهد.</p>
    ${logo(200)}
  </div>
</div>`;

/* carousel: one 3240×1350 panorama, sliced into three 1080×1350 slides; the dot walks the seven valleys across it */
const VALLEYS = [['طلب', 'Quest'], ['عشق', 'Love'], ['معرفت', 'Knowing'], ['استغنا', 'Detachment'], ['توحید', 'Unity'], ['حیرت', 'Wonder'], ['فقر و فنا', 'Letting go']];
const VX = [300, 760, 1330, 1620, 1910, 2400, 2860];
const pathD = (() => { let d = `M0 1010`; VX.forEach((x, i) => { const px = i ? VX[i - 1] : 0; const mid = (px + x) / 2; d += ` Q${mid} ${i % 2 ? 1060 : 960} ${x} 1010`; }); return d + ' L3240 1010'; })();
const PANO = `
<div class="t" style="width:3240px;height:1350px;background:var(--kaghaz);color:var(--shab)">
  <div style="position:absolute;left:0;bottom:0;width:3240px;height:110px;background:url('${f('brand/patterns/band-morvarid.svg')}') left center/auto 110px repeat-x"></div>
  <svg width="3240" height="1350" style="position:absolute;inset:0"><path d="${pathD}" fill="none" stroke="#A3261F" stroke-width="5" stroke-dasharray="2 16" stroke-linecap="round"/></svg>
  ${VX.map((x, i) => `
    <div style="position:absolute;left:${x - 140}px;top:960px;width:280px;display:grid;justify-items:center;gap:6px;text-align:center">
      <i class="dia" style="width:62px;height:62px;background:${i === 6 ? 'var(--runas)' : 'var(--shab)'};margin-top:10px"></i>
      <span class="fa-d" style="font-size:60px;line-height:1.6;margin-top:20px">${VALLEYS[i][0]}</span>
      <span class="en-d" style="font-size:28px;font-style:italic;font-weight:500;opacity:.7">${i + 1} · ${VALLEYS[i][1]}</span>
    </div>`).join('')}
  <div style="position:absolute;left:90px;top:120px;width:900px;display:grid;gap:18px">
    <span style="font-size:34px;color:var(--runas);font-weight:500">هفت وادی</span>
    <p class="fa-d" style="font-size:110px;line-height:1.4">هر فیلم ما از هفت وادی می‌گذرد.</p>
    <p class="en-d" style="font-size:38px;font-weight:800">Every film we make crosses seven valleys.</p>
  </div>
  <div style="position:absolute;left:1170px;top:150px;width:900px;display:grid;gap:22px">
    <p class="fa-d" style="font-size:96px;line-height:1.45">صدها برداشت؛ چند تای راستین.</p>
    <p style="font-size:34px;line-height:1.8;opacity:.78">مثل مرغان عطار: از طلب تا حیرت. هر وادی یک مرحله از ساختن فیلم است.</p>
  </div>
  <div style="position:absolute;left:2250px;top:140px;width:900px;display:grid;gap:18px;justify-items:end;text-align:right">
    <p class="fa-d" style="font-size:96px;line-height:1.45">جستجوی بعدی، مال شماست.</p>
    <p class="en-d" style="font-size:36px;font-weight:800">The next quest is yours.</p>
    <div style="margin-top:28px;display:flex;gap:26px;align-items:center">${logo(240, 'var(--shab)', 'var(--runas)')}</div>
    <span class="handle" style="color:rgba(22,17,14,.7)">${HANDLE}</span>
  </div>
  <div style="position:absolute;left:860px;top:1176px;font-size:28px;color:var(--runas);font-weight:500">ورق بزن ←</div>
</div>`;

[0, 1, 2].forEach((i) => { T[`carousel-valleys-${i + 1}`] = `<div class="t" style="width:1080px;height:1350px;background:var(--kaghaz)"><div style="position:absolute;top:0;left:${-1080 * i}px">${PANO}</div></div>`; });

T['story-film-tar'] = `
<div class="t" style="width:1080px;height:1920px;background:var(--shab)">
  <img class="cover" src="${f('site/media/art/tar.jpg')}" style="object-position:50% 40%">
  <div class="shade" style="background:linear-gradient(to bottom,rgba(22,17,14,.5),transparent 18%,transparent 56%,rgba(22,17,14,.9) 80%,var(--shab))"></div>
  <div style="position:absolute;top:270px;right:70px"><span class="pill" style="background:var(--morvarid);color:var(--shab)">${dia(12, 'var(--runas)')}موزیک‌ویدیو تازه</span></div>
  <div style="position:absolute;right:72px;left:72px;bottom:350px;display:grid;gap:6px">
    <p class="fa-d" style="font-size:170px;line-height:1.3">تار</p>
    <p class="en-d" style="font-size:48px;font-weight:800">The Tar Player</p>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:36px">
      <span style="font-size:34px;color:var(--tala)">به‌زودی · ${'<span class="en-d" style="font-style:italic;font-size:30px">Coming soon</span>'}</span>${logo(220)}
    </div>
  </div>
</div>`;

T['story-question'] = `
<div class="t" style="width:1080px;height:1920px;background:var(--shab)">
  <img src="${f('brand/patterns/zarafshan.svg')}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.7">
  <div style="position:absolute;top:330px;left:90px;right:90px;text-align:center;display:grid;gap:18px;justify-items:center">
    <span style="font-size:34px;color:var(--tala);display:flex;gap:16px;align-items:center">${dia(14, 'var(--tala)')}پرسش جستجو${dia(14, 'var(--tala)')}</span>
    <p class="fa-d" style="font-size:112px;line-height:1.45">از کدام قصه فیلم بسازیم؟</p>
    <p class="en-d" style="font-size:40px;font-weight:800;opacity:.85">Which story should we film next?</p>
  </div>
  <div style="position:absolute;left:150px;right:150px;top:930px;height:380px">
    ${['top:0;right:0', 'top:0;left:0;transform:scaleX(-1)', 'bottom:0;right:0;transform:scaleY(-1)', 'bottom:0;left:0;transform:scale(-1,-1)'].map((p) => `<div style="position:absolute;${p};width:70px;height:70px;border-top:5px solid var(--tala);border-right:5px solid var(--tala)"></div>`).join('')}
  </div>
  <div style="position:absolute;left:0;right:0;bottom:380px;display:grid;justify-items:center;gap:14px">${logo(240)}<span class="handle" style="color:rgba(244,237,224,.7)">${HANDLE}</span></div>
</div>`;

T['reel-cover-mirror'] = `
<div class="t" style="width:1080px;height:1920px;background:var(--shab)">
  <img class="cover" src="${f('site/media/hero/still-vertical.jpg')}" style="object-position:50% 50%">
  <div class="shade" style="background:linear-gradient(to bottom,rgba(22,17,14,.78),rgba(22,17,14,.35) 34%,transparent 52%)"></div>
  <div style="position:absolute;top:300px;left:70px;right:70px;text-align:center;display:grid;justify-items:center;gap:8px">
    <p class="fa-d" style="font-size:150px;line-height:1.35">آینه‌خانه</p>
    <p class="en-d" style="font-size:48px;font-weight:800">The Mirror Hall</p>
    <div style="margin-top:30px">${logo(230)}</div>
  </div>
</div>`;

const hl = (g, icon, ink = 'var(--morvarid)') => `<div class="t" style="width:1080px;height:1920px;background:var(--${g});display:grid;place-items:center;--ink:${ink}">${icon}</div>`;
const S = 'stroke:var(--ink);fill:none;stroke-width:22';
T['highlight-work'] = hl('runas', sym(420, 'var(--morvarid)', 'var(--tala)'));
T['highlight-pardeh'] = hl('zomorrod', `<svg width="420" height="520" viewBox="0 0 100 124"><path d="M8 122V58Q8 36 27 23Q43 12 50 4Q57 12 73 23Q92 36 92 58V122" style="${S};stroke-width:6"/><path d="M50 70l9 9-9 9-9-9z" style="fill:var(--tala)"/></svg>`);
T['highlight-bts'] = hl('lajvard', `<svg width="480" height="360" viewBox="0 0 120 90"><rect x="6" y="18" width="80" height="62" style="${S};stroke-width:6"/><path d="M86 38l28-14v42l-28-14z" style="${S};stroke-width:6;stroke-linejoin:round"/><path d="M46 37l12 12-12 12-12-12z" style="fill:var(--tala)"/></svg>`);
T['highlight-quest'] = hl('tala', `<svg width="420" height="420" viewBox="0 0 100 100"><path fill-rule="evenodd" d="M50 4L96 50L50 96L4 50ZM50 32L68 50L50 68L32 50Z" style="fill:var(--shab)"/></svg>`, 'var(--shab)');
T['highlight-contact'] = hl('shab', `<svg width="480" height="360" viewBox="0 0 120 90"><rect x="6" y="8" width="108" height="74" style="${S};stroke-width:6"/><path d="M8 10l52 40 52-40" style="${S};stroke-width:6;stroke-linejoin:round"/><path d="M60 40l11 11-11 11-11-11z" style="fill:var(--runas)"/></svg>`);
T['avatar'] = `<div class="t" style="width:1080px;height:1080px;background:var(--shab);display:grid;place-items:center">${sym(560)}</div>`;

/* ---------------------------------------------------------------- render */
(async () => {
  fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(PREV, { recursive: true });
  const html = `<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Amiri:wght@700&family=Bodoni+Moda:ital,opsz,wght@0,6..96,500;0,6..96,800;1,6..96,500&family=JetBrains+Mono:wght@400;500&family=Noto+Nastaliq+Urdu:wght@400&family=Vazirmatn:wght@400;500;700&display=swap">
<style>${CSS}</style></head><body>${Object.entries(T).map(([k, v]) => `<section id="${k}" style="margin:0 0 40px">${v}</section>`).join('')}</body></html>`;
  const src = path.join(__dirname, 'templates.html');
  fs.writeFileSync(src, html);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 3300, height: 2000 }, deviceScaleFactor: 1 });
  await p.goto('file://' + src, { waitUntil: 'networkidle' });
  await p.evaluate(async () => { await document.fonts.ready; });
  await p.waitForTimeout(800);
  const made = [];
  for (const id of Object.keys(T)) {
    const el = await p.$(`#${id} > .t`);
    const png = id.startsWith('highlight') || id === 'avatar';
    const file = path.join(OUT, `${id}.${png ? 'png' : 'jpg'}`);
    await el.screenshot(png ? { path: file } : { path: file, type: 'jpeg', quality: 92 });
    made.push(file);
  }
  // small previews for the bible (a local page, so it may load the local files)
  const prevPage = path.join(__dirname, '_preview.html');
  for (const file of made) {
    fs.writeFileSync(prevPage, `<!doctype html><body style="margin:0"><img src="${'file://' + file}" style="display:block;width:540px">`);
    const pg = await b.newPage({ viewport: { width: 540, height: 960 } });
    await pg.goto('file://' + prevPage, { waitUntil: 'load' });
    const img = await pg.$('img');
    await img.screenshot({ path: path.join(PREV, path.basename(file).replace(/\.png$/, '.jpg')), type: 'jpeg', quality: 84 });
    await pg.close();
  }
  fs.unlinkSync(prevPage);
  await b.close();
  console.log('rendered', made.length, 'files');
})();
