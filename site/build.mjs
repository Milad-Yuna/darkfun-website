// Jostoju website build. No dependencies: `node build.mjs`
//   dist/     the real site (pretty URLs, shared /assets), ready for any static host
//   preview/  a self-contained copy with relative links, used for review links
import { readFileSync, writeFileSync, mkdirSync, rmSync, copyFileSync } from 'node:fs';
import { dirname, relative, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as P from './src/pages.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const read = (p) => readFileSync(join(HERE, p), 'utf8');
const marks = JSON.parse(read('src/marks.json'));
const brand = (p) => readFileSync(join(HERE, '..', 'brand', p), 'utf8');
const uri = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg.trim()).replace(/'/g, '%27')}")`;
const PATTERN_CSS = `:root{--p-dust:${uri(brand('patterns/zarafshan.svg'))};--p-arch:${uri(brand('patterns/arch.svg'))};--p-band:${uri(brand('patterns/band-shab.svg'))}}\n`;
const CSS = PATTERN_CSS + read('src/site.css');
const JS = read('src/site.js');
const FAVICON = brand('logo/favicon.svg');
const FONTS = 'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Bodoni+Moda:ital,opsz,wght@0,6..96,500;0,6..96,800;1,6..96,500&family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Noto+Nastaliq+Urdu:wght@400&family=Vazirmatn:wght@400;500;700&display=swap';
const PAGES = ['home', 'work', 'pardeh', 'studio', 'contact'];
const SITE_URL = 'https://jostoju.studio';   // placeholder until the domain is secured

const fileOf = (lang, page) => (lang === 'en' ? 'en/' : '') + (page === 'home' ? '' : page + '/') + 'index.html';
const urlOf = (lang, page) => (lang === 'en' ? '/en/' : '/') + (page === 'home' ? '' : page + '/');

function ctxFor(mode, lang, page) {
  const from = fileOf(lang, page);
  const href = (p, l = lang) => mode === 'site' ? urlOf(l, p) : (relative(dirname(from), fileOf(l, p)) || 'index.html');
  const t = (fa, en) => (lang === 'fa' ? fa : en);
  const mark = (id, cls, label) => {
    const m = marks[id]; const [, , w, h] = m.viewBox.split(' ');
    const aria = label === '-' ? 'aria-hidden="true"' : `role="img" aria-label="${label}"`;
    return `<svg class="${cls}" viewBox="${m.viewBox}" width="${w}" height="${h}" ${aria}>${m.markup}</svg>`;
  };
  const station = ({ name, left, top, width, inline, group, color, fill, elusive, found }) => {
    const attrs = [`data-station="${name}"`, group && `data-group="${group}"`, color && `data-color="${color}"`,
      fill && 'data-fill="1"', elusive && 'data-elusive="1"', found && `data-found-target="${found}"`].filter(Boolean).join(' ');
    const style = left !== undefined ? ` style="left:${left}%;top:${top}%;width:${width}%"` : '';
    return `<span class="station${inline ? ' inline' : ''}" ${attrs}${style} aria-hidden="true"></span>`;
  };
  return { mode, lang, page, t, href, mark, station, marks };
}

function header(c) {
  const { t, href, mark, page, lang } = c;
  const other = lang === 'fa' ? 'en' : 'fa';
  return `<header class="site-head"><div class="wrap">
  <a class="brand" href="${href('home')}" aria-label="${t('جستجو، خانه', 'Jostoju, home')}">${mark('symbol-small', 'sym', '-')}${mark('compact', 'word', '-')}</a>
  <nav aria-label="${t('اصلی', 'Main')}"><ul class="nav">
    ${P.NAV.map((p) => `<li${p === 'pardeh' ? ' class="hide-sm"' : ''}><a href="${href(p)}"${p === page ? ' aria-current="page"' : ''}>${t(...P.NAMES[p])}</a></li>`).join('')}
    <li><a class="lang" href="${href(page, other)}" hreflang="${other}" lang="${other}">${lang === 'fa' ? 'EN' : 'فا'}</a></li>
  </ul></nav>
</div></header>`;
}

function footer(c) {
  const { t, href, mark } = c;
  return `<footer class="site-foot g-night">
  <div class="band" aria-hidden="true"></div>
  <div class="wrap">
    <div class="foot-in">
      <div>${mark('lockup', 'lock', 'جستجو · jostoju')}<p class="close">گره به گره، قاب به قاب.</p><p style="color:var(--mute);margin:0">Knot by knot, frame by frame.</p></div>
      <div><h4>${t('صفحه‌ها', 'Pages')}</h4><ul>${['home', ...P.NAV].map((p) => `<li><a href="${href(p)}">${p === 'home' ? t('خانه', 'Home') : t(...P.NAMES[p])}</a></li>`).join('')}</ul></div>
      <div><h4>${t('در تماس', 'In touch')}</h4><ul><li><span class="lat" style="color:var(--mute)">${P.EMAIL}</span></li><li style="color:var(--mute)">${t('اینستاگرام و یوتیوب: به‌زودی', 'Instagram and YouTube: soon')}</li></ul></div>
    </div>
    <div class="foot-base"><span>${t('© ۱۴۰۵ جستجو. هر قاب با دست انسان.', '© 2026 Jostoju. A human hand on every frame.')}</span><span>${t('ساخته‌شده با هوش مصنوعی، با کارگردانی انسان.', 'Made with AI, directed by people.')}</span></div>
  </div>
</footer>`;
}

const DOT = '<div class="qdot" aria-hidden="true"><svg viewBox="0 0 100 100"><path class="ring" fill-rule="evenodd" d="M50 0L100 50L50 100L0 50ZM50 27L73 50L50 73L27 50Z"/><path class="core" d="M50 27L73 50L50 73L27 50Z"/></svg></div>';

function render(mode, lang, page) {
  const c = ctxFor(mode, lang, page);
  const title = c.t(...P.TITLES[page]); const desc = c.t(...P.DESC[page]);
  const body = header(c) + `<main id="main">${P[page](c)}</main>` + footer(c) + DOT;
  const alt = `<link rel="alternate" hreflang="fa" href="${SITE_URL}${urlOf('fa', page)}"><link rel="alternate" hreflang="en" href="${SITE_URL}${urlOf('en', page)}">`;
  const meta = `<meta name="description" content="${desc}"><meta property="og:title" content="${title}"><meta property="og:description" content="${desc}"><meta name="theme-color" content="#F4EDE0">`;
  const fonts = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="${FONTS}">`;
  if (mode === 'site') {
    return `<!doctype html>\n<html lang="${lang}" dir="${lang === 'fa' ? 'rtl' : 'ltr'}" class="no-js"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>${title}</title>${meta}${alt}
<link rel="icon" href="/favicon.svg" type="image/svg+xml">${fonts}<link rel="stylesheet" href="/assets/site.css"></head>
<body>${body}<script src="/assets/site.js" defer></script></body></html>\n`;
  }
  const setRoot = `<script>document.documentElement.lang="${lang}";document.documentElement.dir="${lang === 'fa' ? 'rtl' : 'ltr'}";document.documentElement.classList.add("no-js")</script>`;
  const favicon = `<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(FAVICON.trim())}">`;
  const inner = `${meta}${favicon}${fonts}<style>${CSS}</style>${setRoot}${body}<script>${JS}</script>`;
  if (fileOf(lang, page) === 'index.html') {     // review link entry page: the host adds the document shell
    return `<title>Jostoju Website</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n${inner}\n`;
  }
  return `<!doctype html>\n<html lang="${lang}" dir="${lang === 'fa' ? 'rtl' : 'ltr'}" class="no-js"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>${title}</title></head><body>${inner}</body></html>\n`;
}

for (const mode of ['site', 'preview']) {
  const out = join(HERE, mode === 'site' ? 'dist' : 'preview');
  rmSync(out, { recursive: true, force: true });
  for (const lang of ['fa', 'en']) for (const page of PAGES) {
    const f = join(out, fileOf(lang, page)); mkdirSync(dirname(f), { recursive: true });
    writeFileSync(f, render(mode, lang, page));
  }
  if (mode === 'site') {
    mkdirSync(join(out, 'assets'), { recursive: true });
    writeFileSync(join(out, 'assets/site.css'), CSS); writeFileSync(join(out, 'assets/site.js'), JS);
    writeFileSync(join(out, 'favicon.svg'), FAVICON);
  }
}
console.log('built dist/ and preview/ ·', PAGES.length * 2, 'pages each');
