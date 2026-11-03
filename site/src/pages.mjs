// Jostoju website pages. Every string is written twice, natively: t(فارسی, English).
// Persian is the default language (served at /), English lives at /en/.

import { CLIPS } from './clips.mjs';

export const NAV = ['work', 'pardeh', 'studio', 'contact'];
export const EMAIL = 'hello@jostoju.studio';          // placeholder until the domain is secured

export const TITLES = {
  home: ['جستجو · استودیوی فیلم‌سازی با هوش مصنوعی', 'Jostoju · AI film studio'],
  work: ['کارها · جستجو', 'Work · Jostoju'],
  pardeh: ['پرده · جستجو', 'Pardeh · Jostoju'],
  studio: ['استودیو · جستجو', 'Studio · Jostoju'],
  contact: ['تماس · جستجو', 'Contact · Jostoju'],
};
export const NAMES = {
  work: ['کارها', 'Work'], pardeh: ['پرده', 'Pardeh'], studio: ['استودیو', 'Studio'], contact: ['تماس', 'Contact'],
};
export const DESC = {
  home: ['جستجو استودیوی فیلم‌سازی با هوش مصنوعی است، با ریشه در نقاشی قاجار، فرش ایرانی و شعر مولانا. آنچه یافت می‌نشود، می‌سازیم.',
         'Jostoju is an AI film studio rooted in Qajar painting, Persian carpets and the poetry of Rumi. We make what cannot be found.'],
  work: ['کارهای کارگاه جستجو: فیلم تبلیغاتی، فیلم برند و موزیک‌ویدیو.', 'Work from Jostoju Kargah: commercials, brand films and music videos.'],
  pardeh: ['پرده: فیلم‌های خودِ جستجو، از شاهنامه تا منطق‌الطیر.', 'Pardeh: Jostoju original films, from the Shahnameh to The Conference of the Birds.'],
  studio: ['داستان، ارزش‌ها و هفت وادی جستجو.', 'The story, values and seven valleys of Jostoju.'],
  contact: ['سفارش فیلم و گفت‌وگو با جستجو.', 'Commission a film or start a conversation with Jostoju.'],
};

const scene = (kind) => ({
  curtain: '<div class="scene"><div class="curtain"></div><div class="pome"></div></div>',
  sky: '<div class="scene"><div class="sky"></div><div class="hills"></div></div>',
  portrait: '<div class="scene" style="background:var(--shab)"><div class="robe"></div><div class="face"></div><div class="pearlrow"></div></div>',
}[kind]);

export function clipCard(c, clip) {
  const { t, asset } = c;
  const title = t(...clip.title), kind = t(...clip.kind);
  const has = !!clip.src;
  const attrs = has ? ` data-play data-src="${asset(clip.src)}" data-title="${title}" tabindex="0" role="button" aria-label="${t('پخش', 'Play')}: ${title}"` : '';
  const media = has
    ? `<video muted loop playsinline preload="metadata"${clip.poster ? ` poster="${asset(clip.poster)}"` : ''} src="${asset(clip.src)}"></video><span class="play" aria-hidden="true"></span>`
    : `${scene(clip.scene)}<span class="soon-chip">${t('به‌زودی', 'Coming soon')}</span>`;
  return `<figure class="clip" style="--rw:${clip.rw};--rh:${clip.rh}"${attrs}><div class="frame">${media}</div><figcaption><b>${title}</b><span>${kind}</span></figcaption></figure>`;
}

const VALLEYS = [
  ['طلب', 'Quest', 'سفارش را به یک پرسش تبدیل می‌کنیم.', 'We turn the brief into a question.'],
  ['عشق', 'Love', 'ایده‌ای که نمی‌شود رهایش کرد.', 'The idea we cannot let go of.'],
  ['معرفت', 'Knowing', 'دنیا را پیش از بافتن طراحی می‌کنیم.', 'We design the world before we weave it.'],
  ['استغنا', 'Detachment', 'صدها برداشت؛ چند تای راستین.', 'Hundreds of takes; the few that are true.'],
  ['توحید', 'Unity', 'تدوین، صدا، رنگ و خط فارسی.', 'Edit, sound, grade and Persian type.'],
  ['حیرت', 'Wonder', 'نسخه برای هر پرده و هر دو زبان.', 'Masters for every screen and both languages.'],
  ['فقر و فنا', 'Letting go', 'فیلم مال تماشاگر می‌شود.', 'The film belongs to its audience.'],
];
const faDigits = (n) => String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

/* ---------------------------------------------------------------- home */
export function home(c) {
  const { t, mark, station, href } = c;
  const heroVideo = c.hero.video || CLIPS[0].src;
  const hs = c.marks.hero.stations.ahead, fs = c.marks.slot.stations.home, ms = c.marks.symbol.stations.center;
  return `
<section class="hero mirror" aria-labelledby="hero-title" data-hero>
  <div class="mirror-media" aria-hidden="true">
    ${heroVideo ? `<video class="mirror-src" muted loop playsinline autoplay preload="auto" src="${c.asset(heroVideo)}"${c.hero.image ? ` poster="${c.asset(c.hero.image)}"` : ''}></video>`
      : c.hero.image ? `<img class="mirror-src" src="${c.asset(c.hero.image)}"${c.hero.vertical ? ` data-portrait="${c.asset(c.hero.vertical)}"` : ''} alt="">` : ''}
    <canvas class="mirror-gl"></canvas>
  </div>
  <div class="mirror-veil" aria-hidden="true"></div>
  <div class="wrap hero-in">
    <div class="hero-mark">
      ${mark('hero', '', 'جستجو')}
      ${station({ name: 'hero', left: hs.left, top: hs.top, width: hs.width, color: 'tala', elusive: true })}
    </div>
    ${c.lang === 'en' ? mark('en', 'en-mark', 'jostoju') : ''}
    <h1 id="hero-title" class="studio-line">${t('استودیوی فیلم‌سازی با هوش مصنوعی', 'AI Film Studio')}</h1>
    <div class="ctas">
      <button class="btn primary" type="button" data-play data-clear data-src="${CLIPS[0].src ? c.asset(CLIPS[0].src) : (heroVideo ? c.asset(heroVideo) : '')}" data-title="${t(...CLIPS[0].title)}">${t('تماشای شوریل', 'Watch the reel')}</button>
      ${heroVideo ? `<button class="btn" type="button" data-sound aria-pressed="false">${t('صدا', 'Sound')}</button>` : ''}
      <a class="btn" href="#clips">${t('کارها', 'Work')}</a>
    </div>
    <p class="follow"><i aria-hidden="true"></i>${t('نقطه گم شده است. دنبالش بیا.', 'The dot is lost. Follow it.')}</p>
  </div>
</section>

<section class="clips g-paper" id="clips" aria-labelledby="clips-title" data-strip>
  <div class="wrap clips-head">
    <div>
      <span class="label">${t('کارها', 'Work')}</span>
      <h2 id="clips-title">${t('قاب‌ها', 'Frames')}${station({ name: 'clips', inline: true, color: 'runas' })}</h2>
    </div>
    <div class="tools">
      <a class="all" href="${href('work')}">${t('همهٔ کارها', 'All work')}</a>
      <button class="arrow" type="button" data-dir="-1" aria-label="${t('قبلی', 'Previous')}">${c.lang === 'fa' ? '→' : '←'}</button>
      <button class="arrow" type="button" data-dir="1" aria-label="${t('بعدی', 'Next')}">${c.lang === 'fa' ? '←' : '→'}</button>
    </div>
  </div>
  <div class="strip">${CLIPS.map((clip) => clipCard(c, clip)).join('')}</div>
</section>

<section class="manifesto g-red" aria-labelledby="m-title">
  <div class="wrap">
    <span class="label">${t('جستجو یعنی', 'Jostoju means')}</span>
    <h2 id="m-title">${t('هر فیلم، یک جستجوست', 'Every film is a quest')}${station({ name: 'period', inline: true, color: 'tala', fill: true })}</h2>
    <div class="halves" aria-label="${t('ساخت واژه', 'How the word is built')}">
      <div><b>جُست</b><small>jost · sought</small></div>
      <div><b>و</b><small>o · and</small></div>
      <div><b>جو</b><small>ju · seek</small></div>
    </div>
    <p>${t('جستجو از دو نیمه ساخته شده است: «جُست»، یافته، و «جو»، جوینده. در نشان ما نقطهٔ «جو» از جایش رفته و پیشاپیش کلمه ایستاده است. ما همیشه در راهیم؛ هر فیلم سفری است به سوی آنچه هنوز پیدا نشده.',
      'Jostoju has two halves: jost, sought, and ju, seek. In our logo the dot of ju has left its letter and waits ahead of the word. We are always on the way; every film is a journey toward what has not been found yet.')}</p>
  </div>
</section>

<section class="make g-pearl" aria-labelledby="make-title">
  <div class="wrap">
    <span class="label" id="make-title">${t('آنچه می‌سازیم', 'What we make')}</span>
    <ol class="make-list">
      ${[
        ['فیلم تبلیغاتی و برند', 'Commercials and brand films', 'برای برندهایی که می‌خواهند شبیه هیچ‌کس نباشند؛ نوروز، یلدا و هر لحظه‌ای که مهم است.', 'For brands that want to look like no one else: Nowruz, Yalda and every moment that matters.', 'کارگاه', 'Kargah', 'curtain'],
        ['موزیک‌ویدیو', 'Music videos', 'دنیای آهنگ شما روی پرده؛ با فیلم، لوپ، کاور و تیزر.', 'The world your song lives in, on screen, with the film, loops, covers and teasers.', 'کارگاه', 'Kargah', 'sky'],
        ['فیلم‌های خودمان', 'Our own films', 'شاهنامه، عطار و قصه‌های عامیانه؛ کوتاه و سریالی، به دو زبان.', 'The Shahnameh, Attar and folk tales, as shorts and series, in two languages.', 'پرده', 'Pardeh', 'portrait'],
      ].map(([fa, en, dfa, den, tfa, ten, sc]) => `
      <li class="make-row" data-hover-host tabindex="0">
        ${station({ name: 'make', group: 'make', color: 'runas' })}
        <div><h3>${t(fa, en)}</h3><span class="tag">${t(tfa, ten)}</span></div>
        <p>${t(dfa, den)}</p>
        <div class="thumb arch" aria-hidden="true">${scene(sc)}</div>
      </li>`).join('')}
    </ol>
  </div>
</section>

<section class="reel g-green" id="reel" aria-labelledby="reel-title">
  <div class="wrap">
    <span class="label">${t('شوریل', 'Showreel')}</span>
    <h2 id="reel-title">${t('گرهِ گمشده را پیدا کن', 'Find the missing knot')}</h2>
    <button class="medallion" type="button" data-play data-src="${CLIPS[0].src ? c.asset(CLIPS[0].src) : ''}" data-title="${t(...CLIPS[0].title)}" aria-label="${t('پخش شوریل', 'Play the showreel')}">
      ${mark('symbol', '', '-')}
      ${station({ name: 'reel', left: ms.left, top: ms.top, width: ms.width, color: 'runas', fill: true, found: '.reel' })}
      <span class="play">${t('▶ پخش', '▶ Play')}</span>
    </button>
    <p class="status" aria-live="polite"><span class="seek-text">${t('نقطه را تا مرکز ترنج دنبال کن.', 'Follow the dot to the centre of the medallion.')}</span><span class="found-text">${t('پیدا شد. حالا تماشا کن.', 'Found. Now watch.')}</span></p>
  </div>
</section>

<section class="valleys-sec g-paper" aria-labelledby="v-title">
  <div class="wrap">
    <span class="label">${t('هفت وادی', 'The seven valleys')}</span>
    <h2 id="v-title">${t('هر فیلم ما از هفت وادی می‌گذرد', 'Every film we make crosses seven valleys')}</h2>
    <ol class="valleys" data-seq>
      ${VALLEYS.map(([fa, en, dfa, den], i) => `
      <li class="valley">${station({ name: 'valley', color: 'runas' })}
        <b>${fa}</b><small>${faDigits(i + 1)} · ${en}</small><p>${t(dfa, den)}</p></li>`).join('')}
    </ol>
  </div>
</section>

<section class="pardeh g-night" aria-labelledby="p-title">
  <div class="curtain-l" aria-hidden="true"></div><div class="curtain-r" aria-hidden="true"></div>
  <div class="wrap in">
    <span class="label">${t('فیلم‌های خودمان', 'Our originals')}</span>
    <h2 class="word" id="p-title">پرده</h2>
    <p>${t('نخستین فیلم‌های ما در دست بافت است: از شاهنامه و منطق‌الطیر تا قصه‌هایی که با صدای مادربزرگ‌ها شنیده‌ایم.',
      'Our first originals are being woven: from the Shahnameh and The Conference of the Birds to the stories we heard in our grandmothers\' voices.')}</p>
    <a class="btn" href="${href('pardeh')}">${t('دربارهٔ پرده', 'About Pardeh')}</a>
  </div>
</section>

<section class="finale g-pearl" aria-labelledby="f-title">
  <div class="wrap">
    <div class="final-mark">
      ${mark('slot', '', 'جستجو')}
      ${station({ name: 'home', left: fs.left, top: fs.top, width: fs.width, color: 'runas', fill: true, found: '.finale', terminal: true })}
    </div>
    <h2 id="f-title">${t('جستجوی بعدی، مال شماست.', 'The next quest is yours.')}</h2>
    <p>${t('فیلمی در سر دارید که هنوز پیدا نشده؟ بگویید از کجا شروع کنیم.', 'Have a film in mind that cannot be found yet? Tell us where to start.')}</p>
    <div class="ctas"><a class="btn primary" href="${href('contact')}">${t('شروع یک جستجو', 'Start a quest')}</a></div>
    <p class="mail">${EMAIL}</p>
  </div>
</section>`;
}

/* ---------------------------------------------------------------- work */
export function work(c) {
  const { t, href, station } = c;
  return `
<header class="page-head g-pearl"><div class="wrap">
  <span class="label">${t('کارگاه جستجو', 'Jostoju Kargah')}</span>
  <h1>${t('کارها', 'Work')}${station({ name: 'title', inline: true, color: 'runas', fill: true })}</h1>
  <p class="lede">${t('نخستین کارهای کارگاه در دست بافت است. این‌جا خانهٔ آن‌هاست: هر پروژه با فیلم، سفارش، هفت وادی‌اش و نام سازندگان.',
    'The workshop\'s first films are on the loom. This is where they will live: each project with the film, the brief, its seven valleys and its credits.')}</p>
</div></header>
<section class="section g-pearl" style="padding-top:0"><div class="wrap">
  <div class="clip-grid">${CLIPS.map((clip) => clipCard(c, clip)).join('')}</div>
</div></section>
<section class="section g-red"><div class="wrap" style="text-align:center">
  <h2>${t('پروژهٔ اول شما می‌تواند این‌جا باشد.', 'Your project could be the first one here.')}</h2>
  <a class="btn" href="${href('contact')}">${t('سفارش فیلم', 'Commission a film')}</a>
</div></section>`;
}

/* ---------------------------------------------------------------- pardeh */
export function pardeh(c) {
  const { t, station } = c;
  return `
<section class="pardeh g-night" style="padding-block:clamp(60px,10vw,140px)">
  <div class="curtain-l" aria-hidden="true"></div><div class="curtain-r" aria-hidden="true"></div>
  <div class="wrap in">
    <span class="label">${t('پردهٔ جستجو', 'Jostoju Pardeh')}</span>
    <h1 class="word">پرده${station({ name: 'title', inline: true, color: 'tala', fill: true })}</h1>
    <p>${t('«پرده» هم پردهٔ نقال است و هم پردهٔ سینما. این‌جا فیلم‌های خودمان را می‌سازیم: کوتاه، سریالی و روزی بلند؛ اول به فارسی، و برای جهان به انگلیسی.',
      '“Pardeh” is both the naqqal\'s painted canvas and the cinema screen. This is where we make our own films: shorts, series and one day features, in Persian first and in English for the world.')}</p>
  </div>
</section>
<section class="section g-pearl"><div class="wrap">
  <h2>${t('سرچشمه‌ها', 'The sources')}</h2>
  <div class="cards">
    ${[['شاهنامه', 'The Shahnameh', 'پهلوانان، عشق‌ها و سوگ‌ها؛ با نگاهی تازه و قابی قاجاری.', 'Heroes, loves and losses, seen fresh, in Qajar frames.', 'portrait'],
       ['منطق‌الطیر', 'The Conference of the Birds', 'سفر مرغان به سوی سیمرغ؛ جستجویی که به آینه می‌رسد.', 'The birds\' journey to the Simorgh: a search that ends in a mirror.', 'sky'],
       ['قصه‌های عامیانه', 'Folk tales', 'قصه‌هایی که با صدای مادربزرگ‌ها شنیده‌ایم، برای نسلی که دور از خانه بزرگ شده.', 'The stories our grandmothers told, for a generation raised far from home.', 'curtain']].map(([fa, en, dfa, den, sc]) => `
    <article class="card"><div class="thumb">${scene(sc)}</div><div class="txt"><span class="soon">${t('در دست بافت', 'In development')}</span><h3>${t(fa, en)}</h3><p>${t(dfa, den)}</p></div></article>`).join('')}
  </div>
</div></section>`;
}

/* ---------------------------------------------------------------- studio */
export function studio(c) {
  const { t, station } = c;
  const values = [
    ['طلب', 'اول بجوی', 'Seek first', 'هر پروژه با یک پرسش شروع می‌شود، نه با یک پرامپت.', 'Every project starts with a question, not a prompt.'],
    ['ریشه', 'ریشه، نه لباس مبدل', 'Rooted, not costumed', 'از سرچشمه برمی‌داریم: فرش، نسخه، معماری، شعر و چهره‌های واقعی.', 'We draw from the source: carpets, manuscripts, architecture, poetry and real faces.'],
    ['دست', 'دست در ماشین', 'The hand in the machine', 'هوش مصنوعی دار قالی ماست؛ هر قاب را انسان انتخاب و تمام می‌کند.', 'AI is our loom; a person chooses and finishes every frame.'],
    ['راستی', 'بگو چطور ساخته شد', 'Say how it was made', 'می‌گوییم کجا از هوش مصنوعی استفاده شده؛ چهره و صدای هیچ آدم واقعی را بی‌رضایت کتبی نمی‌سازیم.', 'We say where AI was used, and never recreate a real face or voice without written consent.'],
    ['حیرت', 'حیرت، نه هیاهو', 'Wonder over spectacle', 'قابی که نمی‌شود از آن چشم برداشت، نه هیاهویی که با اسکرول بعدی فراموش شود.', 'The frame you can\'t stop looking at, not noise that fades by the next scroll.'],
  ];
  return `
<header class="page-head g-pearl"><div class="wrap">
  <span class="label">${t('از پرده تا پیکسل', 'From pardeh to pixel')}</span>
  <h1>${t('استودیو', 'Studio')}${station({ name: 'title', inline: true, color: 'runas', fill: true })}</h1>
  <p class="lede">${t('پیش از پیکسل، گره بود. بافنده گره به گره نقشه را می‌خواند، خوشنویس هر حرف را با نقطه می‌سنجد، و نقال با پرده‌ای نقاشی‌شده شاهنامه را زنده می‌کرد. جستجو همان رشته را با دار امروز ادامه می‌دهد: هوش مصنوعی.',
    'Before the pixel, there was the knot. The weaver read the design knot by knot, the calligrapher measured every letter in dots, and the naqqal brought the Shahnameh to life before a painted screen. Jostoju picks up that thread with today\'s loom: AI.')}</p>
</div></header>
<section class="section g-paper"><div class="wrap split">
  <div>
    <span class="label">${t('نام ما', 'Our name')}</span>
    <p class="verse">… یافت می‌نشود، جسته‌ایم ما<br>گفت آنکه یافت می‌نشود، آنم آرزوست</p>
    <p style="color:var(--mute)">${t('مولانا · دیوان شمس', 'Rumi · Divan-e Shams: “…It cannot be found; we have searched.” He said, “What cannot be found is what I long for.”')}</p>
  </div>
  <div>
    <p style="font-size:1.15rem">${t('«جسته‌ایم» همان فعلِ نام ماست. جستجو یعنی یافته و جوینده در یک واژه؛ و کار سینما همین است. در «منطق‌الطیر» عطار، سی مرغ به جستجوی سیمرغ می‌روند و درمی‌یابند سیمرغ خودشان‌اند. جستجویی که به آینه می‌رسد.',
      'Jostoju means sought and seeking in one word, which is the work of cinema. In Attar\'s Conference of the Birds, thirty birds search for the Simorgh and find that the Simorgh is themselves: a search that ends in a mirror.')}</p>
  </div>
</div></section>
<section class="section g-night camera"><div class="wrap">
  <span class="label">${t('دوربین قاجاری', 'The Qajar camera')}</span>
  <h2>${t('دوربین با قاجار به ایران آمد.', 'The camera came to Iran with the Qajars.')}</h2>
  <ol class="timeline">
    <li><b>${t('۱۲۲۱', '1842')}</b><small>${t('۱۸۴۲ میلادی', 'Photography')}</small><p>${t('نخستین دوربین عکاسی به دربار قاجار رسید.', 'The first camera reaches the Qajar court.')}</p></li>
    <li><b>${t('۱۲۲۷–۱۲۷۵', '1848–1896')}</b><small>${t('ناصرالدین‌شاه', 'Naser al-Din Shah')}</small><p>${t('شاه خود عکاس بود؛ از نخستین پادشاهان جهان که پشت دوربین ایستاد، و در کاخ گلستان عکاس‌خانه ساخت.', 'The Shah was a photographer himself, one of the first monarchs anywhere to stand behind the camera, and built a photography house in the Golestan Palace.')}</p></li>
    <li><b>${t('۱۲۷۹', '1900')}</b><small>${t('۱۹۰۰ میلادی · سینما', 'Cinema')}</small><p>${t('مظفرالدین‌شاه در پاریس سینماتوگراف را دید و عکاس‌باشی دربار، میرزا ابراهیم‌خان، نخستین فیلم ایرانی را گرفت.', 'Mozaffar al-Din Shah sees the cinematograph in Paris, and court photographer Mirza Ebrahim Khan Akkas Bashi shoots the first Iranian film footage.')}</p></li>
  </ol>
  <p class="coda">${t('پس رنگ و قاب قاجاری برای ما تزئین نیست؛ جایی است که دوربین ایرانی چشم باز کرد. جستجو از همان‌جا ادامه می‌دهد.', 'So the Qajar look is not decoration for us. It is where the Iranian camera first opened its eye, and Jostoju picks up from there.')}</p>
</div></section>
<section class="section g-pearl"><div class="wrap">
  <h2>${t('ارزش‌ها', 'Values')}</h2>
  <div class="values">
    ${values.map(([w, fa, en, dfa, den]) => `<article><b>${w}</b><div><h3>${t(fa, en)}</h3><p>${t(dfa, den)}</p></div></article>`).join('')}
  </div>
</div></section>
<section class="valleys-sec g-paper"><div class="wrap">
  <h2>${t('هفت وادی', 'The seven valleys')}</h2>
  <ol class="valleys" data-seq>
    ${VALLEYS.map(([fa, en, dfa, den], i) => `<li class="valley">${station({ name: 'valley', color: 'runas' })}<b>${fa}</b><small>${faDigits(i + 1)} · ${en}</small><p>${t(dfa, den)}</p></li>`).join('')}
  </ol>
</div></section>
<section class="section g-green"><div class="wrap split">
  <div><h2>${t('هوش مصنوعی، با راستی', 'AI, honestly')}</h2></div>
  <ul style="margin:0;padding-inline-start:1.2em;display:grid;gap:10px">
    <li>${t('در تیتراژ هر فیلم می‌گوییم کجا از هوش مصنوعی استفاده شده و نام انسان‌هایی را که آن را ساخته‌اند می‌آوریم.', 'Every film\'s credits say where AI was used and name the people who made it.')}</li>
    <li>${t('چهره یا صدای هیچ آدم واقعی را بدون رضایت کتبی بازسازی نمی‌کنیم.', 'We never recreate a real person\'s face or voice without written consent.')}</li>
    <li>${t('خط فارسیِ ساختهٔ ماشین را هرگز تحویل نمی‌دهیم؛ هر نوشته با حروف واقعی جایگزین می‌شود.', 'We never ship machine-written Persian; every inscription is replaced with real type.')}</li>
  </ul>
</div></section>`;
}

/* ---------------------------------------------------------------- contact */
export function contact(c) {
  const { t, station } = c;
  return `
<header class="page-head g-pearl"><div class="wrap">
  <span class="label">${t('شروع یک جستجو', 'Start a quest')}</span>
  <h1>${t('تماس', 'Contact')}${station({ name: 'title', inline: true, color: 'runas', fill: true })}</h1>
  <p class="lede">${t('از فیلمی که در سر دارید بگویید: چه می‌خواهید، برای چه کسی، و تا کی. ما با یک پرسش جواب می‌دهیم.', 'Tell us about the film you have in mind: what it is, who it is for and when you need it. We will answer with a question.')}</p>
</div></header>
<section class="section g-pearl" style="padding-top:0"><div class="wrap split">
  <form class="form" data-endpoint="" novalidate>
    <div class="row">
      <label for="f-name">${t('نام', 'Name')}<input id="f-name" name="name" autocomplete="name" required></label>
      <label for="f-email">${t('ایمیل', 'Email')}<input id="f-email" name="email" type="email" autocomplete="email" dir="ltr" required></label>
    </div>
    <div class="row">
      <label for="f-type">${t('نوع پروژه', 'Project type')}<select id="f-type" name="type">
        <option>${t('فیلم تبلیغاتی', 'Commercial')}</option><option>${t('فیلم برند', 'Brand film')}</option><option>${t('موزیک‌ویدیو', 'Music video')}</option><option>${t('چیز دیگر', 'Something else')}</option></select></label>
      <label for="f-lang">${t('زبان فیلم', 'Film language')}<select id="f-lang" name="language">
        <option>${t('فارسی', 'Persian')}</option><option>${t('انگلیسی', 'English')}</option><option>${t('هر دو', 'Both')}</option></select></label>
    </div>
    <div class="row">
      <label for="f-when">${t('زمان تحویل', 'Timeline')}<input id="f-when" name="timeline" placeholder="${t('مثلاً پیش از نوروز', 'e.g. before Nowruz')}"></label>
      <label for="f-budget">${t('بودجهٔ تقریبی', 'Approximate budget')}<input id="f-budget" name="budget"></label>
    </div>
    <label for="f-msg">${t('از فیلم بگویید', 'Tell us about the film')}<textarea id="f-msg" name="message" required></textarea></label>
    <div><button class="btn primary" type="submit">${t('فرستادن', 'Send')}</button></div>
    <p class="form-msg" role="status"
       data-offline="${t('این فرم هنوز به ایمیل وصل نشده است. لطفاً مستقیم به نشانی کنار صفحه بنویسید.', 'This form is not connected to email yet. Please write to the address on this page.')}"
       data-sent="${t('رسید. به‌زودی با یک پرسش برمی‌گردیم.', 'Received. We will come back soon with a question.')}"
       data-error="${t('فرستاده نشد. لطفاً مستقیم ایمیل بزنید.', 'It did not send. Please email us directly.')}"></p>
  </form>
  <div>
    <span class="label">${t('یا مستقیم بنویسید', 'Or write directly')}</span>
    <p class="mailbox">${EMAIL}</p>
    <p class="note" style="color:var(--mute)">${t('پاسخ به فارسی یا انگلیسی، هر کدام که راحت‌ترید.', 'We reply in Persian or English, whichever you prefer.')}</p>
  </div>
</div></section>`;
}
