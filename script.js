/* ==========================================================
   DARKFUN — interactions
   Film details and settings live in data.js, not here.
   ========================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var DATA = window.DARKFUN || { films: [], submitTo: 'studios.darkfun@gmail.com', heroClip: '' };
  /* Every film from data.js, as { no, title, label, runtime, views, youtube, thumb } */
  var FILMS = (DATA.catalog || []).map(function (r) {
    var f = { no: r[0] || '', title: r[1] || '', label: r[2] || 'original', runtime: r[3] || '', views: r[4] || '', youtube: r[5] || '', director: r[6] || '' };
    var yt = youtubeInfo(f.youtube);
    f.ytId = yt && yt.id ? yt.id : '';
    f.thumb = f.ytId ? 'images/films/yt/' + f.ytId + '.jpg' : '';
    return f;
  });

  /* If a thumbnail isn't saved in images/films/yt yet, borrow it from YouTube */
  document.addEventListener('error', function (e) {
    var img = e.target;
    if (!img || img.tagName !== 'IMG' || !img.getAttribute('data-yt') || img.getAttribute('data-fallback')) return;
    img.setAttribute('data-fallback', '1');
    img.src = 'https://i.ytimg.com/vi/' + img.getAttribute('data-yt') + '/mqdefault.jpg';
  }, true);
  var CHANNEL = 'https://www.youtube.com/@darkfunhorror';

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var reduceMotion = false;
  try { reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  /* Fade-in on scroll: anything that has reached the screen (or was jumped past) is shown */
  var revealPending = ('IntersectionObserver' in window && !reduceMotion) ? $$('.reveal') : [];
  function revealPassed() {
    if (!revealPending.length) return;
    var limit = window.innerHeight * 0.94;
    revealPending = revealPending.filter(function (el) {
      if (el.getBoundingClientRect().top < limit) { el.classList.add('is-visible'); return false; }
      return true;
    });
  }
  var finePointer = false;
  try { finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches; } catch (e) {}

  /* ==========================================================
     SOUND (off until the visitor turns it on)
     ========================================================== */
  var Sound = (function () {
    var ctx = null, master = null, on = false;

    function init() {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);

      // Room tone: low, filtered brown noise
      var len = ctx.sampleRate * 4;
      var buf = ctx.createBuffer(1, len, ctx.sampleRate);
      var d = buf.getChannelData(0), last = 0;
      for (var i = 0; i < len; i++) {
        last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
        d[i] = last * 3.2;
      }
      var noise = ctx.createBufferSource();
      noise.buffer = buf;
      noise.loop = true;
      var lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 360;
      var ng = ctx.createGain();
      ng.gain.value = 0.16;
      noise.connect(lp).connect(ng).connect(master);
      noise.start();

      // A slow electrical hum, like a lift shaft
      var hum = ctx.createOscillator();
      hum.type = 'sine';
      hum.frequency.value = 49;
      var hg = ctx.createGain();
      hg.gain.value = 0.03;
      var lfo = ctx.createOscillator();
      lfo.frequency.value = 0.08;
      var lg = ctx.createGain();
      lg.gain.value = 0.018;
      lfo.connect(lg).connect(hg.gain);
      hum.connect(hg).connect(master);
      hum.start();
      lfo.start();
      return true;
    }

    function setOn(v) {
      if (v && !ctx && !init()) return false;
      if (!ctx) return false;
      on = v;
      var t = ctx.currentTime;
      if (v && ctx.state === 'suspended') ctx.resume();
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(master.gain.value, t);
      master.gain.linearRampToValueAtTime(v ? 0.85 : 0, t + (v ? 1.6 : 0.4));
      if (!v) setTimeout(function () { if (!on) ctx.suspend(); }, 600);
      return true;
    }

    function tone(freq, amp, dur, type, at) {
      var t = ctx.currentTime + (at || 0);
      var o = ctx.createOscillator();
      o.type = type || 'sine';
      o.frequency.value = freq;
      var g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(amp, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(master);
      o.start(t);
      o.stop(t + dur + 0.05);
      return o;
    }

    return {
      get on() { return on; },
      setOn: setOn,
      ding: function () {
        if (!on) return;
        tone(1046.5, 0.07, 1.8);
        tone(2093, 0.018, 1.2);
        tone(1568, 0.012, 1.4);
      },
      tick: function () {
        if (!on) return;
        tone(2400, 0.012, 0.05, 'triangle');
      },
      thud: function () {
        if (!on) return;
        var o = tone(70, 0.22, 0.9);
        o.frequency.exponentialRampToValueAtTime(38, ctx.currentTime + 0.8);
      }
    };
  })();

  var soundBtn = $('.sound');
  if (soundBtn) {
    soundBtn.addEventListener('click', function () {
      var next = !Sound.on;
      if (!Sound.setOn(next)) return;
      soundBtn.setAttribute('aria-pressed', String(next));
      $('.sound__text', soundBtn).textContent = next ? 'Sound off' : 'Sound on';
      if (next) setTimeout(Sound.ding, 300);
    });
  }

  /* ==========================================================
     COLD OPEN
     ========================================================== */
  var coldopen = $('.coldopen');
  var opening = root.classList.contains('is-opening');

  function endOpening() {
    if (!opening) return;
    opening = false;
    root.classList.remove('is-opening');
    startHero();
    resetIdle();
  }

  if (opening && coldopen) {
    var finishTimer = setTimeout(endOpening, 4450);
    var skip = function () {
      if (!opening || coldopen.classList.contains('is-skipping')) return;
      coldopen.classList.add('is-skipping');
      clearTimeout(finishTimer);
      setTimeout(endOpening, 800);
    };
    ['click', 'keydown', 'wheel', 'touchstart'].forEach(function (ev) {
      window.addEventListener(ev, skip, { passive: true, once: true });
    });
  } else {
    opening = false;
  }

  /* ==========================================================
     HERO: stills (or a clip) between the bars
     ========================================================== */
  var heroSlides = $$('.hero__slide');
  var heroSlate = $('.hero__slate');
  var heroIndex = 0;
  var heroTimer = null;
  var heroVisible = true;

  // The showreel replaces the stills, except for visitors who prefer less motion or save data
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  if (DATA.heroClip && heroSlides[0] && !reduceMotion && !saveData) {
    var v = document.createElement('video');
    var small = DATA.heroClipSmall && window.innerWidth < 900;
    var mp4 = small ? DATA.heroClipSmall : DATA.heroClip;
    // A lighter WebM copy is used first when it exists (same name, .webm); the MP4 is the fallback
    [[mp4.replace(/\.mp4$/i, '.webm'), 'video/webm'], [mp4, 'video/mp4']].forEach(function (s, i) {
      if (i === 0 && s[0] === mp4) return;
      var src = document.createElement('source');
      src.src = s[0];
      src.type = s[1];
      v.appendChild(src);
    });
    v.muted = true;
    v.loop = true;
    v.autoplay = true;
    v.playsInline = true;
    v.setAttribute('playsinline', '');
    v.setAttribute('aria-hidden', 'true');
    v.poster = DATA.heroPoster || $('img', heroSlides[0]).getAttribute('src');
    heroSlides[0].replaceChild(v, $('img', heroSlides[0]));
    heroSlides[0].setAttribute('data-slate', 'Independent horror film studio');
    if (heroSlate) heroSlate.textContent = heroSlides[0].getAttribute('data-slate');
    heroSlides.slice(1).forEach(function (s) { s.remove(); });
    heroSlides = heroSlides.slice(0, 1);
  }

  function showSlide(i) {
    heroSlides[heroIndex].classList.remove('is-active');
    heroIndex = (i + heroSlides.length) % heroSlides.length;
    heroSlides[heroIndex].classList.add('is-active');
    if (heroSlate) heroSlate.textContent = heroSlides[heroIndex].getAttribute('data-slate');
  }

  function startHero() {
    if (reduceMotion || heroSlides.length < 2 || heroTimer) return;
    heroTimer = setInterval(function () {
      if (document.hidden || !heroVisible) return;
      showSlide(heroIndex + 1);
    }, 6500);
  }

  if (!opening) startHero();

  /* ==========================================================
     HEADER + ELEVATOR FLOORS
     ========================================================== */
  var header = $('.site-header');
  var hero = $('.hero');
  var navLinks = $$('.site-nav a');
  var floors = $$('main [data-floor]');
  var lift = $('.lift');
  var liftFloor = $('.lift__floor');
  var liftWhisper = $('.lift-whisper');
  var panel = $('#lift-panel');
  var panelLinks = $$('.lift-panel__buttons a');
  var currentFloor = floors[0] ? floors[0].getAttribute('data-floor') : '6';
  var lastY = window.scrollY;
  var moveTimer = null;
  var haunted = false;

  function showFloor(value) {
    if (!liftFloor || liftFloor.textContent === value) return;
    liftFloor.textContent = value;
    liftFloor.classList.remove('is-changing');
    void liftFloor.offsetWidth;
    liftFloor.classList.add('is-changing');
  }

  function updateFloors() {
    var y = window.scrollY;
    header.classList.toggle('is-solid', y > 8);
    if (hero) header.classList.toggle('is-past-hero', hero.getBoundingClientRect().bottom < 120);
    if (hero) {
      var heroBottom = hero.getBoundingClientRect().bottom;
      heroVisible = heroBottom > 0;
      if (lift) lift.classList.toggle('is-away', heroBottom > window.innerHeight - 24);
    }
    revealPassed();

    var line = window.innerHeight * 0.45;
    var current = floors[0];
    var atBottom = window.innerHeight + y >= root.scrollHeight - 4;
    if (atBottom) current = floors[floors.length - 1];
    else floors.forEach(function (s) { if (s.getBoundingClientRect().top <= line) current = s; });
    if (!current) return;

    var value = current.getAttribute('data-floor');
    if (value !== currentFloor) {
      currentFloor = value;
      if (!haunted) showFloor(value);
      Sound.ding();
    }

    navLinks.forEach(function (a) {
      var on = a.getAttribute('href') === '#' + current.id;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
    });
    panelLinks.forEach(function (a) {
      a.classList.toggle('is-current', a.getAttribute('data-floor') === value);
    });

    if (lift && Math.abs(y - lastY) > 2) {
      lift.classList.toggle('is-down', y > lastY);
      lift.classList.toggle('is-up', y < lastY);
      clearTimeout(moveTimer);
      moveTimer = setTimeout(function () { lift.classList.remove('is-down', 'is-up'); }, 900);
    }
    lastY = y;
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { updateFloors(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', updateFloors);
  updateFloors();

  /* ---- Floor panel (also the phone menu) ---- */
  var panelToggles = $$('.lift, .menu-toggle');
  var panelOpener = null;

  function openPanel(opener) {
    if (!panel || !panel.hidden) return;
    panelOpener = opener || null;
    panel.hidden = false;
    document.body.style.overflow = 'hidden';
    panelToggles.forEach(function (t) { t.setAttribute('aria-expanded', 'true'); });
    var first = $('a.is-current', panel) || $('a', panel);
    if (first) first.focus();
  }

  function closePanel(returnFocus) {
    if (!panel || panel.hidden) return;
    panel.hidden = true;
    document.body.style.overflow = '';
    panelToggles.forEach(function (t) { t.setAttribute('aria-expanded', 'false'); });
    if (returnFocus !== false && panelOpener) panelOpener.focus();
  }

  panelToggles.forEach(function (t) {
    t.addEventListener('click', function () { openPanel(t); });
  });

  if (panel) {
    $('.lift-panel__close', panel).addEventListener('click', function () { closePanel(); });
    panel.addEventListener('click', function (e) { if (e.target === panel) closePanel(); });

    panelLinks.forEach(function (a) {
      a.addEventListener('click', function (e) {
        var target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        panelLinks.forEach(function (x) { x.classList.toggle('is-current', x === a); });
        Sound.ding();
        setTimeout(function () {
          closePanel(false);
          target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
          if (history.replaceState) history.replaceState(null, '', a.getAttribute('href'));
        }, reduceMotion ? 0 : 260);
      });
    });

    panel.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closePanel(); return; }
      if (e.key !== 'Tab') return;
      var items = $$('a, button', panel);
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---- Floor five. Nobody pressed it. ---- */
  var idleTimer = null;
  var hauntDone = false;

  function anyDialogOpen() {
    return (panel && !panel.hidden) || !!$('dialog[open]');
  }

  function haunt() {
    if (hauntDone || opening) return;
    if (document.hidden || anyDialogOpen()) { resetIdle(); return; }
    hauntDone = true;
    haunted = true;
    var five = $('.lift-panel__buttons a[data-floor="5"]');
    lift.classList.add('is-haunted');
    showFloor('5');
    if (five) five.classList.add('is-lit');
    liftWhisper.textContent = 'Floor five. Nobody pressed it.';
    requestAnimationFrame(function () { liftWhisper.classList.add('is-shown'); });
    Sound.ding();
    setTimeout(Sound.thud, 500);
    setTimeout(function () {
      liftWhisper.classList.remove('is-shown');
      lift.classList.remove('is-haunted');
      haunted = false;
      showFloor(currentFloor);
    }, 5200);
    setTimeout(function () {
      liftWhisper.textContent = '';
      if (five) five.classList.remove('is-lit');
    }, 6200);
  }

  function resetIdle() {
    if (hauntDone) return;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(haunt, 24000);
  }

  ['scroll', 'pointermove', 'keydown', 'touchstart'].forEach(function (ev) {
    window.addEventListener(ev, resetIdle, { passive: true });
  });
  if (!opening) resetIdle();

  /* ==========================================================
     FILMS
     ========================================================== */
  var LABELS = { original: 'A DarkFun Original', series: 'A DarkFun Series', presents: 'DarkFun Presents' };
  var SHORT_LABELS = { original: 'Original', series: 'Series', presents: 'Presents' };

  function youtubeInfo(value) {
    if (!value) return null;
    value = String(value).trim();
    if (/^[\w-]{11}$/.test(value)) return { id: value };
    try {
      var u = new URL(value);
      var list = u.searchParams.get('list');
      var id = '';
      if (/youtu\.be$/.test(u.hostname)) id = u.pathname.slice(1, 12);
      else if (u.searchParams.get('v')) id = u.searchParams.get('v');
      else {
        var m = u.pathname.match(/\/(shorts|embed|live)\/([\w-]{11})/);
        if (m) id = m[2];
      }
      if (id) return { id: id, url: value };
      if (list) return { list: list, url: value };
    } catch (e) {}
    return null;
  }

  function filmUrl(f) {
    var yt = youtubeInfo(f.youtube);
    if (yt && yt.url) return yt.url;
    if (yt && yt.id) return 'https://www.youtube.com/watch?v=' + yt.id;
    return CHANNEL + '/search?query=' + encodeURIComponent(f.title);
  }

  function embedUrl(f) {
    var yt = youtubeInfo(f.youtube);
    if (!yt) return '';
    var q = 'autoplay=1&rel=0&modestbranding=1&playsinline=1';
    if (yt.id) return 'https://www.youtube-nocookie.com/embed/' + yt.id + '?' + q;
    return 'https://www.youtube-nocookie.com/embed/videoseries?list=' + yt.list + '&' + q;
  }

  function slate(f) {
    var parts = [];
    if (f.no) parts.push('DF—' + f.no);
    parts.push(f.title);
    if (f.runtime) parts.push(f.runtime);
    parts.push(LABELS[f.label] || LABELS.original);
    if (f.director) parts.push('A film by ' + f.director);
    return parts.join(' · ');
  }

  function isLight(hex) {
    var h = String(hex || '').replace('#', '');
    if (h.length !== 6) return false;
    var c = [0, 2, 4].map(function (i) {
      var v = parseInt(h.substr(i, 2), 16) / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2] > 0.3;
  }

  function colourVars(f) {
    var quiet = (f.quiet && f.quiet[1]) || '#151A15';
    var loud = (f.loud && f.loud[1]) || '#5E7149';
    var light = isLight(quiet);
    return {
      '--quiet': quiet,
      '--loud': loud,
      '--on-quiet': light ? '#0C0D0B' : '#DDE2C0',
      '--on-quiet-soft': light ? 'rgba(12,13,11,0.72)' : 'rgba(221,226,192,0.7)'
    };
  }

  function styleString(vars) {
    return Object.keys(vars).map(function (k) { return k + ':' + vars[k]; }).join(';');
  }

  /* ---- Player ---- */
  var player = $('.player');

  function openFilm(f, e) {
    var src = embedUrl(f);
    // No player (or a preview that can't embed YouTube): let the link open YouTube instead
    if (!src || window.DARKFUN_NO_EMBED || !player || typeof player.showModal !== 'function') return;
    if (e) e.preventDefault();
    $('#player-title').textContent = slate(f);
    $('.player__line', player).textContent = f.line || '';
    var out = $('.player__out', player);
    out.href = filmUrl(f);
    var frame = $('.player__frame', player);
    frame.innerHTML = '<iframe src="' + esc(src) + '" title="' + esc(f.title) + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
    player.showModal();
  }

  if (player) {
    $('.player__close', player).addEventListener('click', function () { player.close(); });
    player.addEventListener('close', function () { $('.player__frame', player).innerHTML = ''; });
  }

  /* ---- Featured list + stage ---- */
  var byTitle = {};
  FILMS.forEach(function (f) { byTitle[f.title.toLowerCase()] = f; });
  var featured = (DATA.featured || []).map(function (x) {
    var f = {}, k, base = byTitle[String(x.film || '').toLowerCase()] || { title: x.film || '' };
    for (k in base) f[k] = base[k];
    for (k in x) f[k] = x[k];
    return f;
  }).filter(function (f) { return f.title; });
  var list = $('.feature__list');
  var stage = $('.feature__stage');
  var stageFrame = $('.stage__frame');
  var activeIndex = -1;

  if (list) {
    list.innerHTML = featured.map(function (f, i) {
      var meta = [f.runtime, f.views ? f.views + ' views' : ''].filter(Boolean).join(' · ');
      return '<li><a class="feature__item" href="' + esc(filmUrl(f)) + '" target="_blank" rel="noopener" data-i="' + i + '" style="' + styleString(colourVars(f)) + '">' +
        (f.still ? '<img class="feature__thumb" src="' + esc(f.still) + '" alt="" loading="lazy" decoding="async" style="object-position:' + esc(f.focus || '50% 50%') + '">' : '') +
        '<span class="feature__no">' + (f.no ? 'DF—' + esc(f.no) : '') + '</span>' +
        '<span class="feature__title">' + esc(f.title) + '</span>' +
        '<span class="feature__meta">' + esc(meta) + '</span>' +
        (f.line ? '<span class="feature__line">' + esc(f.line) + '</span>' : '') +
        '</a></li>';
    }).join('');

    $$('.feature__item', list).forEach(function (a) {
      var f = featured[+a.getAttribute('data-i')];
      a.addEventListener('pointerenter', function () { setActive(+a.getAttribute('data-i')); });
      a.addEventListener('focus', function () { setActive(+a.getAttribute('data-i')); });
      a.addEventListener('click', function (e) { openFilm(f, e); });
    });
  }

  function setActive(i) {
    if (!stage || i === activeIndex || !featured[i]) return;
    activeIndex = i;
    var f = featured[i];
    var vars = colourVars(f);
    Object.keys(vars).forEach(function (k) { stage.style.setProperty(k, vars[k]); });

    $$('.feature__item', list).forEach(function (a) {
      a.classList.toggle('is-active', +a.getAttribute('data-i') === i);
    });

    $('.stage__slate', stage).textContent = slate(f);
    $('.stage__line', stage).textContent = f.line || '';

    var colours = $('.stage__colors', stage);
    colours.innerHTML = [f.quiet, f.loud].filter(Boolean).map(function (c) {
      return '<span><span class="swatch" style="background:' + esc(c[1]) + '"></span>' + esc(c[0]) + ' ' + esc(c[1]) + '</span>';
    }).join('');

    var play = $('.stage__play', stage);
    play.href = filmUrl(f);
    $('span', play).textContent = embedUrl(f) ? 'Watch the film' : 'Find it on YouTube';
    play.setAttribute('aria-label', (embedUrl(f) ? 'Watch ' : 'Find ') + f.title + (embedUrl(f) ? '' : ' on YouTube'));
    play.onclick = function (e) { openFilm(f, e); };

    // Swap the picture (or clip) with a cross-fade
    var old = $$('img, video', stageFrame);
    var media;
    if (f.clip && !reduceMotion) {
      media = document.createElement('video');
      media.src = f.clip;
      media.muted = true;
      media.loop = true;
      media.autoplay = true;
      media.playsInline = true;
      media.setAttribute('playsinline', '');
      if (f.still) media.poster = f.still;
    } else {
      media = document.createElement('img');
      media.src = f.still || f.thumb || '';
      media.alt = 'A frame from ' + f.title;
      media.decoding = 'async';
    }
    media.className = 'stage__img';
    media.style.objectPosition = f.focus || '50% 50%';
    media.style.opacity = '0';
    stageFrame.insertBefore(media, $('.bug', stageFrame));
    stageFrame.classList.toggle('no-bug', f.bug === false);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { media.style.opacity = '1'; });
    });
    old.forEach(function (el) {
      el.classList.add('is-leaving');
      setTimeout(function () { el.remove(); }, 750);
    });
    Sound.tick();
  }

  setActive(0);

  /* ---- Catalog ---- */
  var catList = $('.catalog__list');
  var catCount = $('.catalog__count');
  var catEmpty = $('.catalog__empty');
  var peek = $('.peek');
  var peekImg = peek ? $('img', peek) : null;

  // Newest first
  var catalog = FILMS.slice().sort(function (a, b) { return (parseInt(b.no, 10) || 0) - (parseInt(a.no, 10) || 0); });
  var SHOW_FIRST = 12;
  var catMore = $('.catalog__more');
  var catExpanded = false;
  var catKind = 'all';

  function thumbImg(f, cls) {
    if (!f.thumb) return '';
    return '<img' + (cls ? ' class="' + cls + '"' : '') + ' src="' + esc(f.thumb) + '" data-yt="' + esc(f.ytId) + '" alt="" width="640" height="360" loading="lazy" decoding="async">';
  }

  function applyCatalog() {
    var shown = 0, matching = 0;
    $$('li', catList).forEach(function (li) {
      var match = catKind === 'all' || li.getAttribute('data-label') === catKind;
      if (match) matching++;
      var show = match && (catKind !== 'all' || catExpanded || matching <= SHOW_FIRST);
      li.hidden = !show;
      if (show) shown++;
    });
    if (catEmpty) catEmpty.hidden = matching > 0;
    if (catMore) catMore.hidden = !(catKind === 'all' && !catExpanded && matching > SHOW_FIRST);
  }

  if (catList) {
    catList.innerHTML = catalog.map(function (f) {
      var sub = [SHORT_LABELS[f.label] || 'Original', f.runtime, f.views].filter(Boolean).join(' · ');
      return '<li data-label="' + esc(f.label || 'original') + '"><a class="cat-row" href="' + esc(filmUrl(f)) + '" target="_blank" rel="noopener" data-thumb="' + esc(f.thumb || '') + '" data-yt="' + esc(f.ytId) + '">' +
        '<span class="cat-no">DF—' + (f.no ? esc(f.no) : '···') + '</span>' +
        '<span class="cat-title">' + esc(f.title) + '</span>' +
        '<span class="cat-label">' + esc(SHORT_LABELS[f.label] || 'Original') + '</span>' +
        '<span class="cat-run">' + esc(f.runtime || '—') + '</span>' +
        '<span class="cat-views">' + esc(f.views || '—') + '</span>' +
        '<span class="cat-go" aria-hidden="true">→</span>' +
        '<span class="cat-sub">' + esc(sub) + '</span>' +
        '</a></li>';
    }).join('');

    $$('.cat-row', catList).forEach(function (a, i) {
      var f = catalog[i];
      a.addEventListener('click', function (e) { openFilm(f, e); });
    });

    if (catCount) catCount.textContent = catalog.length + ' films · Newest first';
    if (catMore) {
      catMore.textContent = 'Show all ' + catalog.length + ' films';
      catMore.addEventListener('click', function () {
        catExpanded = true;
        applyCatalog();
        var next = $$('li', catList)[SHOW_FIRST];
        if (next) $('a', next).focus({ preventScroll: true });
        Sound.tick();
      });
    }
    applyCatalog();

    // Filters
    $$('.chip').forEach(function (chip) {
      var kind = chip.getAttribute('data-filter');
      var n = kind === 'all' ? catalog.length : catalog.filter(function (f) { return (f.label || 'original') === kind; }).length;
      chip.textContent = chip.textContent + ' ' + n;
      chip.addEventListener('click', function () {
        $$('.chip').forEach(function (c) {
          var on = c === chip;
          c.classList.toggle('is-on', on);
          c.setAttribute('aria-pressed', String(on));
        });
        catKind = kind;
        applyCatalog();
        Sound.tick();
      });
    });

    // A thumbnail follows the pointer
    if (peek && finePointer && !reduceMotion) {
      var px = 0, py = 0, tx = 0, ty = 0, raf = null;
      var loop = function () {
        px += (tx - px) * 0.2;
        py += (ty - py) * 0.2;
        peek.style.transform = 'translate(' + px.toFixed(1) + 'px,' + py.toFixed(1) + 'px)';
        raf = Math.abs(tx - px) + Math.abs(ty - py) > 0.5 ? requestAnimationFrame(loop) : null;
      };
      catList.addEventListener('pointermove', function (e) {
        tx = e.clientX + 28;
        ty = e.clientY - 150;
        if (tx + 270 > window.innerWidth) tx = e.clientX - 290;
        if (!raf) raf = requestAnimationFrame(loop);
      });
      $$('.cat-row', catList).forEach(function (a) {
        a.addEventListener('pointerenter', function (e) {
          var src = a.getAttribute('data-thumb');
          if (!src) { peek.classList.remove('is-on'); return; }
          if (peekImg.getAttribute('src') !== src) {
            peekImg.removeAttribute('data-fallback');
            peekImg.setAttribute('data-yt', a.getAttribute('data-yt') || '');
            peekImg.src = src;
          }
          if (!peek.classList.contains('is-on')) {
            px = tx = e.clientX + 28;
            py = ty = e.clientY - 150;
            if (tx + 270 > window.innerWidth) px = tx = e.clientX - 290;
            peek.style.transform = 'translate(' + px + 'px,' + py + 'px)';
          }
          peek.classList.add('is-on');
        });
      });
      catList.addEventListener('pointerleave', function () { peek.classList.remove('is-on'); });
    }
  }

  /* ---- How many DarkFun Presents films so far (Submit section) ---- */
  var presentsLink = $('.submit__count a');
  if (presentsLink) {
    var nPresents = FILMS.filter(function (f) { return f.label === 'presents'; }).length;
    if (nPresents) $('span', presentsLink).textContent = nPresents + ' films released as DarkFun Presents so far';
    else presentsLink.parentNode.hidden = true;
    presentsLink.addEventListener('click', function (e) {
      var chip = $('.chip[data-filter="presents"]');
      var cat = $('.catalog');
      if (!chip || !cat) return;
      e.preventDefault();
      chip.click();
      cat.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---- Newest film in the opening frame ---- */
  var newest = catalog[0];
  var heroLive = $('.hero__live');
  if (heroLive && newest) {
    $('.hero__live-text', heroLive).textContent = 'New film · ' + newest.title;
    heroLive.href = filmUrl(newest);
    heroLive.addEventListener('click', function (e) { openFilm(newest, e); });
  }

  /* ---- The three newest films on the YouTube row ---- */
  var shots = $('.platform__shots');
  if (shots) {
    shots.innerHTML = catalog.slice(0, 3).map(function (f) {
      return '<span class="shot"><span class="shot__frame">' + thumbImg(f) + '</span><span class="data">DF—' + esc(f.no) + ' · ' + esc(f.title) + '</span></span>';
    }).join('');
  }

  /* ---- Watch next: two films, different on every visit ---- */
  var nextGrid = $('.watch-next__grid');
  if (nextGrid && catalog.length) {
    var pool = catalog.filter(function (f) { return f.thumb; });
    var picks = [];
    while (picks.length < Math.min(2, pool.length)) {
      var pick = pool[Math.floor(Math.random() * pool.length)];
      if (picks.indexOf(pick) === -1) picks.push(pick);
    }
    nextGrid.innerHTML = picks.map(function (f, i) {
      return '<a class="next-film" href="' + esc(filmUrl(f)) + '" target="_blank" rel="noopener" data-i="' + i + '">' +
        '<span class="next-film__frame">' + thumbImg(f) + '<span class="next-film__play" aria-hidden="true"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M8 5v14l11-7z"/></svg></span></span>' +
        '<span class="data">DF—' + esc(f.no) + ' · ' + esc(f.runtime) + ' · ' + esc(SHORT_LABELS[f.label] || 'Original') + '</span>' +
        '<span class="next-film__title">' + esc(f.title) + '</span></a>';
    }).join('');
    $$('.next-film', nextGrid).forEach(function (a) {
      a.addEventListener('click', function (e) { openFilm(picks[+a.getAttribute('data-i')], e); });
    });
  }

  /* ==========================================================
     NUMBERS THAT COUNT UP
     ========================================================== */
  var counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window && !reduceMotion) {
    var countObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countObs.unobserve(entry.target);
        var el = entry.target;
        var to = +el.getAttribute('data-count');
        var after = el.getAttribute('data-after') || '';
        var start = null;
        var step = function (t) {
          if (!start) start = t;
          var p = Math.min(1, (t - start) / 1600);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(to * eased) + after;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) {
      el.textContent = '0' + (el.getAttribute('data-after') || '');
      countObs.observe(el);
    });
  }

  /* ==========================================================
     SCROLL REVEALS
     ========================================================== */
  if (revealPending.length) {
    root.classList.add('can-reveal');
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach(function (el) { revealObs.observe(el); });
  }

  /* ==========================================================
     SUBMIT YOUR FILM
     ========================================================== */
  var formDialog = $('.form-dialog');
  var form = $('.submit-form');
  var formStatus = $('.submit-form__status');
  var formDone = $('.form-done');
  var previewTitle = $('.form-preview__title');
  var previewSlate = $('.form-preview__slate');
  var formOpener = null;
  var F = form ? form.elements : null;
  var submitTo = DATA.submitTo || 'studios.darkfun@gmail.com';

  function updatePreview() {
    var t = F.film_title.value.trim();
    var r = F.runtime.value.trim();
    var n = F.name.value.trim();
    previewTitle.textContent = t || 'Your film here';
    previewSlate.textContent = 'DF—P01 · ' + (r || '[Runtime]') + ' · A film by ' + (n || '[you]');
  }

  function mailtoFor(d) {
    var body = [
      'Name: ' + (d.name || ''),
      'Email: ' + (d.email || ''),
      'Film title: ' + (d.film_title || ''),
      'Runtime: ' + (d.runtime || ''),
      'Link: ' + (d.link || ''),
      'Preview password: ' + (d.password || ''),
      'Country: ' + (d.country || ''),
      'About the film: ' + (d.about || ''),
      'I own the rights: ' + (d.rights ? 'Yes' : 'No')
    ].join('\r\n');
    return 'mailto:' + submitTo + '?subject=' + encodeURIComponent('Film submission: ' + (d.film_title || '') + ' · DarkFun Presents') + '&body=' + encodeURIComponent(body);
  }

  var MESSAGES = {
    name: 'Add your name.',
    email: 'Add an email address we can reply to.',
    film_title: "Add the film's title.",
    runtime: 'Add the runtime, like 06:15.',
    link: 'Add the full link to the film, starting with https://',
    rights: 'Tick the box to confirm you own the rights.'
  };

  if (formDialog && form) {
    $$('[data-open-form]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (typeof formDialog.showModal !== 'function') {
          window.location.href = 'mailto:' + submitTo + '?subject=' + encodeURIComponent('Film submission · DarkFun Presents');
          return;
        }
        formOpener = b;
        form.hidden = false;
        formDone.hidden = true;
        formDialog.showModal();
        F.name.focus();
      });
    });

    var closeForm = function () { formDialog.close(); };
    $('.form-dialog__close', formDialog).addEventListener('click', closeForm);
    $('.form-done__close', formDialog).addEventListener('click', closeForm);
    formDialog.addEventListener('click', function (e) {
      if (e.target !== formDialog) return;
      var r = formDialog.getBoundingClientRect();
      if (e.clientX < r.left) closeForm();
    });
    formDialog.addEventListener('close', function () {
      if (!formDone.hidden) { form.reset(); updatePreview(); formStatus.textContent = ''; }
      if (formOpener) formOpener.focus();
    });

    ['film_title', 'runtime', 'name'].forEach(function (n) {
      form[n].addEventListener('input', updatePreview);
    });

    form.addEventListener('input', function (e) {
      var field = e.target.closest('.field');
      if (field && e.target.checkValidity()) field.classList.remove('is-invalid');
      if (!form.classList.contains('is-sending')) formStatus.textContent = '';
    });
    F.rights.addEventListener('change', function () {
      if (F.rights.checked) F.rights.closest('.field').classList.remove('is-invalid');
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.classList.contains('is-sending')) return;

      var firstBad = null;
      $$('.field', form).forEach(function (f) { f.classList.remove('is-invalid'); });
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.name || !el.willValidate || el.checkValidity()) return;
        el.closest('.field').classList.add('is-invalid');
        if (!firstBad) firstBad = el;
      });
      if (firstBad) {
        formStatus.textContent = MESSAGES[firstBad.name] || 'Check the highlighted field.';
        firstBad.focus();
        return;
      }
      if (F._honey.value) return; // a bot filled the hidden field

      var d = {
        name: F.name.value.trim(),
        email: F.email.value.trim(),
        film_title: F.film_title.value.trim(),
        runtime: F.runtime.value.trim(),
        link: F.link.value.trim(),
        password: F.password.value.trim(),
        country: F.country.value.trim(),
        about: F.about.value.trim(),
        rights: F.rights.checked
      };

      var payload = {
        _subject: 'Film submission: ' + d.film_title + ' · DarkFun Presents',
        _template: 'table',
        _replyto: d.email,
        'Name': d.name,
        'Email': d.email,
        'Film title': d.film_title,
        'Runtime': d.runtime,
        'Link to the film': d.link,
        'Preview password': d.password || '(none)',
        'Country': d.country || '(not given)',
        'About the film': d.about || '(not given)',
        'Owns the rights': 'Yes'
      };

      form.classList.add('is-sending');
      formStatus.textContent = 'Sending…';

      fetch('https://formsubmit.co/ajax/' + encodeURIComponent(submitTo), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (r) {
          return r.json().catch(function () { return {}; }).then(function (j) {
            if (!r.ok || String(j.success) !== 'true') throw new Error(j.message || 'Not sent');
          });
        })
        .then(function () {
          form.hidden = true;
          formDone.hidden = false;
          formStatus.textContent = '';
          $('.form-done__close', formDialog).focus();
          Sound.ding();
        })
        .catch(function () {
          formStatus.innerHTML = 'That didn\'t go through. <a href="' + esc(mailtoFor(d)) + '">Email it to us instead</a>, everything is filled in.';
        })
        .then(function () { form.classList.remove('is-sending'); });
    });
  }

  /* ---- Footer year ---- */
  var year = $('.year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
