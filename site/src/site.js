/* Jostoju · the lost dot.
   One fixed dot travels the page. Elements with [data-station] are places it can land.
   - data-group: stations that compete (the hovered one wins, else the one nearest the middle)
   - data-seq on a container: its stations are visited in order as you scroll through it
   - data-fill="1": the dot is solid (found) there; otherwise it is an empty knot (seeking)
   - data-color: brand colour name for the dot at that station
   - data-found-target: selector of the element that gets .found while the dot is docked */
(() => {
  const root = document.documentElement;
  root.classList.remove('no-js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rtl = root.dir === 'rtl';

  const head = document.querySelector('.site-head');
  const onScroll = () => head && head.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* film player: anything with [data-play] opens the dialog; empty data-src shows the "in the edit" note */
  const dlg = document.querySelector('dialog.reel-dialog');
  if (dlg) {
    const v = dlg.querySelector('video'), pend = dlg.querySelector('.pending'), ttl = dlg.querySelector('.dtitle');
    const open = (el) => {
      const src = el.dataset.src || '';
      ttl.textContent = el.dataset.title || '';
      v.hidden = !src; pend.hidden = !!src;
      if (src) v.src = src;
      if (dlg.showModal) dlg.showModal();
      if (src) { const p = v.play(); if (p && p.catch) p.catch(() => {}); }
    };
    document.querySelectorAll('[data-play]').forEach((el) => {
      el.addEventListener('click', () => open(el));
      if (el.tagName !== 'BUTTON') el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(el); } });
    });
    dlg.addEventListener('close', () => { v.pause(); v.removeAttribute('src'); v.load(); });
    dlg.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => dlg.close()));
  }

  /* clips: play silently while on screen; arrows scroll the strip */
  const vids = document.querySelectorAll('.clip video');
  if (vids.length && 'IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { const p = e.target.play(); if (p && p.catch) p.catch(() => {}); } else e.target.pause();
    }), { threshold: .6 });
    vids.forEach((v) => io.observe(v));
  }
  document.querySelectorAll('[data-strip]').forEach((box) => {
    const strip = box.querySelector('.strip');
    box.querySelectorAll('[data-dir]').forEach((b) => b.addEventListener('click', () => {
      strip.scrollBy({ left: +b.dataset.dir * strip.clientWidth * .8 * (rtl ? -1 : 1), behavior: reduce ? 'auto' : 'smooth' });
    }));
  });

  /* every artwork hides the lost dot: find it */
  document.querySelectorAll('.find-dot').forEach((b) => b.addEventListener('click', () => {
    const fig = b.closest('figure'); fig.classList.add('found');
    const m = fig.querySelector('.found-msg'); if (m) m.textContent = m.dataset.msg;
  }));

  /* contact form: posts to data-endpoint when configured, otherwise says so honestly */
  const form = document.querySelector('form[data-endpoint]');
  if (form) form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.querySelector('.form-msg');
    const ep = form.dataset.endpoint;
    const show = (key) => { msg.textContent = msg.dataset[key]; msg.classList.add('show'); };
    if (!ep) { show('offline'); return; }
    try {
      const r = await fetch(ep, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (r.ok) { form.reset(); show('sent'); } else show('error');
    } catch (err) { show('error'); }
  });

  const dot = document.querySelector('.qdot');
  const stations = [...document.querySelectorAll('[data-station]')];
  if (!dot || !stations.length) return;

  let x = null, y = null, s = 30, px = -1e4, py = -1e4, hovered = null, lastFound = null;
  let locked = null;   // the finale: once the dot is home, it stays put
  addEventListener('pointermove', (e) => { px = e.clientX; py = e.clientY; }, { passive: true });
  stations.forEach(st => {
    const host = st.closest('[data-hover-host]');
    if (host) {
      host.addEventListener('pointerenter', () => { hovered = st; });
      host.addEventListener('pointerleave', () => { if (hovered === st) hovered = null; });
      host.addEventListener('focusin', () => { hovered = st; });
      host.addEventListener('focusout', () => { if (hovered === st) hovered = null; });
    }
  });

  const seqIndex = new Map();
  function sequences(vh) {
    document.querySelectorAll('[data-seq]').forEach(c => {
      const items = [...c.querySelectorAll('[data-station]')];
      const r = c.getBoundingClientRect();
      const p = Math.min(.999, Math.max(0, (vh * .78 - r.top) / Math.max(1, r.height + vh * .56)));
      const idx = Math.floor(p * items.length);
      items.forEach((it, i) => {
        const li = it.closest('.valley');
        if (li) { li.classList.toggle('active', i === idx); li.classList.toggle('passed', i < idx); }
      });
      seqIndex.set(c, items[idx]);
    });
  }

  function target() {
    const vh = innerHeight, mid = vh * .5;
    sequences(vh);
    if (locked) {
      const r = locked.getBoundingClientRect();
      if (r.top < vh) return {   // on screen or scrolled past it: the quest is over, the dot stays home
        x: r.left + r.width / 2, y: r.top + r.height / 2, s: r.width, fill: true, color: `var(--${locked.dataset.color || 'runas'})`, st: locked };
    }
    let best = null, bestD = Infinity, bestRect = null;
    for (const st of stations) {
      const seq = st.closest('[data-seq]');
      if (seq && seqIndex.get(seq) !== st) continue;
      const g = st.dataset.group;
      if (g && hovered && hovered.dataset.group === g && hovered !== st) continue;
      const r = st.getBoundingClientRect();
      if (!r.width) continue;
      const cy = r.top + r.height / 2;
      if (cy < vh * .14 || cy > vh * .86) continue;
      let d = Math.abs(cy - mid);
      if (hovered === st) d -= vh;            // the hovered row always wins inside its zone
      if (d < bestD) { bestD = d; best = st; bestRect = r; }
    }
    document.querySelectorAll('.make-row').forEach(row => row.classList.toggle('active', !!best && row.contains(best)));
    if (!best) {
      const small = innerWidth < 760; const edge = small ? 10 : 30;
      return { x: rtl ? edge : innerWidth - edge, y: mid, s: small ? 14 : 26, fill: false, color: 'var(--runas)', st: null };
    }
    let tx = bestRect.left + bestRect.width / 2, ty = bestRect.top + bestRect.height / 2;
    if (best.dataset.elusive && !reduce) {          // «آنچه یافت می‌نشود»: the hero dot slips away
      const dx = tx - px, dy = ty - py, dist = Math.hypot(dx, dy), R = Math.max(150, bestRect.width * 2.4);
      if (dist < R && dist > 0.01) { const push = (R - dist) * .42; tx += dx / dist * push; ty += dy / dist * push; }
    }
    return { x: tx, y: ty, s: bestRect.width, fill: best.dataset.fill === '1', color: `var(--${best.dataset.color || 'runas'})`, st: best };
  }

  function frame() {
    const t = target();
    if (x === null) { x = t.x; y = t.y; s = t.s; dot.classList.add('on'); }
    if (locked && t.st !== locked) { locked = null; dot.classList.remove('home'); }
    const k = reduce || locked ? 1 : .13;
    x += (t.x - x) * k; y += (t.y - y) * k; s += (t.s - s) * k;
    dot.style.transform = `translate3d(${(x - 50).toFixed(2)}px, ${(y - 50).toFixed(2)}px, 0) scale(${(s / 100).toFixed(4)})`;
    dot.style.setProperty('--dot-c', t.color);
    const docked = !!t.st && (locked === t.st || (Math.hypot(t.x - x, t.y - y) < 3 && Math.abs(t.s - s) < 3));
    if (docked && t.st.dataset.terminal && !locked) { locked = t.st; dot.classList.add('home'); }
    dot.classList.toggle('filled', !!(t.fill && docked) || (t.fill && reduce));
    const foundEl = docked && t.st.dataset.foundTarget ? t.st.closest(t.st.dataset.foundTarget) : null;
    if (foundEl !== lastFound) { if (lastFound) lastFound.classList.remove('found'); if (foundEl) foundEl.classList.add('found'); lastFound = foundEl; }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
