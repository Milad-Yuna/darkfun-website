/* Jostoju · «آینه‌کاری» the mirror hall.
   The hero film plays through hundreds of diamond mirror facets (the brand's knots). Facets catch gold light
   around the cursor, settle after the opening, and align into one clear frame as you scroll: from fragments to
   the found image. Source: the hero video, else a still artwork, else a painted placeholder scene. */
(() => {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* header floats over the film while the hero is on screen */
  const head = document.querySelector('.site-head');
  const setOver = () => head && head.classList.toggle('over', hero.getBoundingClientRect().bottom > 90);
  addEventListener('scroll', setOver, { passive: true }); setOver();

  const src = hero.querySelector('.mirror-src');
  const video = src && src.tagName === 'VIDEO' ? src : null;
  if (video) { const p = video.play(); if (p && p.catch) p.catch(() => {}); }
  const snd = hero.querySelector('[data-sound]');
  if (snd && video) snd.addEventListener('click', () => {
    video.muted = !video.muted; snd.setAttribute('aria-pressed', String(!video.muted));
    if (!video.muted) { const p = video.play(); if (p && p.catch) p.catch(() => {}); }
  });

  const cvs = hero.querySelector('.mirror-gl');
  const gl = cvs && (cvs.getContext('webgl', { antialias: false, premultipliedAlpha: false }) || cvs.getContext('experimental-webgl'));
  if (!gl) { hero.classList.add('no-gl'); return; }

  const VS = 'attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
  const FS = `precision mediump float;
uniform sampler2D T;uniform vec2 R,S,M;uniform float t,sh,cell,hov,kb;varying vec2 v;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
vec2 h2(vec2 p){return vec2(h(p),h(p+19.19));}
vec2 cover(vec2 u){float ra=R.x/R.y,ta=S.x/S.y;vec2 s=ra>ta?vec2(1.,ta/ra):vec2(ra/ta,1.);return (u-.5)*s/kb+.5;}
void main(){
  vec2 px=v*R; float c=cell*1.41421;
  vec2 q=vec2(px.x+px.y,px.x-px.y)/c; vec2 id=floor(q); vec2 f=fract(q)-.5;
  vec2 cq=(id+.5)*c; vec2 cp=vec2(cq.x+cq.y,cq.x-cq.y)*.5;
  vec2 r=h2(id); float a=R.x/R.y;
  float dm=distance(v*vec2(a,1.),M*vec2(a,1.));
  float s=clamp(sh+hov*.6*exp(-dm*dm/.03),0.,1.);
  float an=(r.x-.5)*1.3*s; float z=1.+(r.y-.35)*.8*s;
  vec2 d=mat2(cos(an),-sin(an),sin(an),cos(an))*(px-cp)/z;
  vec2 off=(h2(id+7.)-.5)*R*.2*s*(1.+.12*sin(t*.6+r.x*6.283));
  vec2 u=cover((cp+d+off)/R); u=abs(mod(u+1.,2.)-1.);
  vec3 col=texture2D(T,u).rgb;
  col*=mix(1.,.8+.4*h(id+3.),min(1.,s*1.6));
  vec2 n=normalize(r-.5+1e-3); vec2 L=normalize(M-v+1e-3);
  float g=pow(max(0.,dot(n,L)),14.)*exp(-dm*dm/.09)*hov;
  float tw=pow(.5+.5*sin(t*.9+h(id+11.)*40.),60.)*.7;
  col+=vec3(1.,.84,.5)*(g*.9+tw*min(1.,s*1.4)*.6);
  float e=smoothstep(.455,.5,max(abs(f.x),abs(f.y)));
  col=mix(col,vec3(.06,.05,.04),e*.85*min(1.,s*2.2));
  gl_FragColor=vec4(col,1.);
}`;
  const sh = (type, code) => { const o = gl.createShader(type); gl.shaderSource(o, code); gl.compileShader(o); return o; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { hero.classList.add('no-gl'); return; }
  gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = {}; ['T', 'R', 'S', 'M', 't', 'sh', 'cell', 'hov', 'kb'].forEach((k) => { U[k] = gl.getUniformLocation(prog, k); });
  const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  [[gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE], [gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR]]
    .forEach(([k, val]) => gl.texParameteri(gl.TEXTURE_2D, k, val));

  /* the source: video > still > painted placeholder */
  const paint = src ? null : painter();
  const img = src && src.tagName === 'IMG' ? src : null;
  if (img && img.dataset.portrait && innerHeight > innerWidth * 1.1) img.src = img.dataset.portrait;   // phones get the vertical still
  let srcW = 960, srcH = 540, uploadedStill = false;
  const upload = () => {
    if (video) { if (video.readyState < 2) return; srcW = video.videoWidth; srcH = video.videoHeight; gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video); hero.classList.add('ready'); }
    else if (img) { if (uploadedStill || !img.complete || !img.naturalWidth) return; srcW = img.naturalWidth; srcH = img.naturalHeight; gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img); uploadedStill = true; hero.classList.add('ready'); }
    else { paint.draw(performance.now() / 1000); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, paint.canvas); hero.classList.add('ready'); }
  };

  let W = 0, H = 0, dpr = 1;
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    W = Math.max(1, Math.round(hero.clientWidth * dpr)); H = Math.max(1, Math.round(hero.clientHeight * dpr));
    if (cvs.width !== W || cvs.height !== H) { cvs.width = W; cvs.height = H; gl.viewport(0, 0, W, H); }
  };
  resize(); if ('ResizeObserver' in window) new ResizeObserver(resize).observe(hero); else addEventListener('resize', resize);

  let mx = .5, my = .5, tmx = .5, tmy = .5, hov = 0, thov = 0, clear = 0, tclear = 0;
  hero.addEventListener('pointermove', (e) => { const r = hero.getBoundingClientRect(); tmx = (e.clientX - r.left) / r.width; tmy = 1 - (e.clientY - r.top) / r.height; thov = fine ? 1 : 0; }, { passive: true });
  hero.addEventListener('pointerleave', () => { thov = 0; });
  hero.querySelectorAll('[data-clear]').forEach((b) => {
    b.addEventListener('pointerenter', () => { tclear = 1; }); b.addEventListener('pointerleave', () => { tclear = 0; });
    b.addEventListener('focus', () => { tclear = 1; }); b.addEventListener('blur', () => { tclear = 0; });
  });

  let visible = true;
  if ('IntersectionObserver' in window) new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible) requestAnimationFrame(frame); }).observe(hero);

  const t0 = performance.now();
  function frame(now) {
    if (!visible) return;
    const t = (now - t0) / 1000;
    upload();
    const intro = reduce ? 1 : Math.min(1, t / 2.8), ease = 1 - Math.pow(1 - intro, 3);
    const base = reduce ? .22 : 1 - .68 * ease;
    const r = hero.getBoundingClientRect();
    const scrolled = Math.min(1, Math.max(0, -r.top / (r.height * .7)));
    if (!fine && !reduce) { tmx = .5 + .28 * Math.cos(t * .27); tmy = .5 + .22 * Math.sin(t * .41); thov = .55; }
    const k = reduce ? 1 : .08;
    mx += (tmx - mx) * k; my += (tmy - my) * k; hov += (thov - hov) * k; clear += (tclear - clear) * .06;
    const shatter = base * (1 - scrolled) * (1 - clear);
    gl.uniform1i(U.T, 0); gl.uniform2f(U.R, W, H); gl.uniform2f(U.S, srcW, srcH); gl.uniform2f(U.M, mx, my);
    gl.uniform1f(U.t, reduce ? 0 : t); gl.uniform1f(U.sh, shatter); gl.uniform1f(U.cell, (W < 700 * dpr ? 26 : 42) * dpr);
    gl.uniform1f(U.hov, hov * (1 - clear)); gl.uniform1f(U.kb, img && !reduce ? 1 + .06 * (.5 + .5 * Math.sin(t * .05)) : 1);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* a painted Qajar stage, used until the reel or a still artwork exists */
  function painter() {
    const c = document.createElement('canvas'); c.width = 960; c.height = 540; const x = c.getContext('2d');
    let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const dust = Array.from({ length: 80 }, () => ({ x: rnd() * 960, y: rnd() * 540, s: 1 + rnd() * 3.2, v: 5 + rnd() * 14, p: rnd() * 6.283 }));
    const dia = (cx, cy, hh) => { x.beginPath(); x.moveTo(cx, cy - hh); x.lineTo(cx + hh, cy); x.lineTo(cx, cy + hh); x.lineTo(cx - hh, cy); x.closePath(); };
    const arch = (x0, y0, w, hh) => { const X = (u) => x0 + u * w / 100, Y = (u) => y0 + u * hh / 130;
      x.beginPath(); x.moveTo(X(0), Y(130)); x.lineTo(X(0), Y(58)); x.quadraticCurveTo(X(0), Y(34), X(21), Y(20)); x.quadraticCurveTo(X(41), Y(8), X(50), Y(0));
      x.quadraticCurveTo(X(59), Y(8), X(79), Y(20)); x.quadraticCurveTo(X(100), Y(34), X(100), Y(58)); x.lineTo(X(100), Y(130)); x.closePath(); };
    const curtain = (left, t) => {
      x.save(); x.beginPath(); const w = 250;
      if (left) { x.moveTo(0, 0); x.lineTo(w, 0); for (let y = 0; y <= 540; y += 18) x.lineTo(w * (.78 - .5 * (y / 540) ** 1.4) + 14 * Math.sin(y / 70 + t * .9), y); x.lineTo(0, 540); }
      else { x.moveTo(960, 0); x.lineTo(960 - w, 0); for (let y = 0; y <= 540; y += 18) x.lineTo(960 - w * (.78 - .5 * (y / 540) ** 1.4) - 14 * Math.sin(y / 70 + t * .9 + 1.3), y); x.lineTo(960, 540); }
      x.closePath(); x.fillStyle = '#A3261F'; x.fill(); x.clip();
      for (let i = 0; i < 40; i++) { const xx = left ? i * 14 : 960 - i * 14; x.fillStyle = 'rgba(0,0,0,.22)'; x.fillRect(xx + 4 * Math.sin(t + i), 0, 6, 540); }
      x.restore();
      x.fillStyle = '#D4A640'; x.fillRect(left ? 150 + 6 * Math.sin(t * .9) : 798 - 6 * Math.sin(t * .9 + 1.3), 250, 12, 46);
    };
    function draw(t) {
      let g = x.createLinearGradient(0, 0, 0, 540); g.addColorStop(0, '#1F5A46'); g.addColorStop(.6, '#163f33'); g.addColorStop(1, '#16110E');
      x.fillStyle = g; x.fillRect(0, 0, 960, 540);
      x.save(); arch(330, 40, 300, 520); x.clip();
      g = x.createLinearGradient(0, 40, 0, 360); g.addColorStop(0, '#D4A640'); g.addColorStop(1, '#B4552C'); x.fillStyle = g; x.fillRect(330, 40, 300, 520);
      x.save(); x.translate(480, 170); x.rotate(t * .12);
      for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) { if (!i && !j) continue; const ring = Math.max(Math.abs(i), Math.abs(j));
        x.fillStyle = ring === 2 ? '#F4EDE0' : '#A3261F'; dia((i - j) * 13, (i + j) * 13, 11); x.fill(); }
      x.restore();
      x.fillStyle = '#233C8E'; x.beginPath(); x.moveTo(330, 330);
      [[330, 300], [372, 300], [372, 276], [420, 276], [420, 292], [470, 292], [470, 262], [520, 262], [520, 286], [575, 286], [575, 306], [630, 306], [630, 560], [330, 560]].forEach(([a, b]) => x.lineTo(a, b));
      x.fill(); x.fillStyle = '#16110E'; x.fillRect(330, 420, 300, 140);
      for (let i = 0; i < 3; i++) { const px = 400 + i * 80, py = 404 + 6 * Math.sin(t * 1.1 + i * 2);
        x.fillStyle = '#A3261F'; x.beginPath(); x.arc(px, py, 22, 0, 6.283); x.fill();
        x.fillStyle = '#D4A640'; x.beginPath(); x.moveTo(px - 10, py - 18); x.lineTo(px - 6, py - 32); x.lineTo(px - 2, py - 22); x.lineTo(px + 2, py - 32); x.lineTo(px + 6, py - 22); x.lineTo(px + 10, py - 32); x.lineTo(px + 12, py - 18); x.fill(); }
      x.restore();
      x.lineWidth = 3; x.strokeStyle = '#D4A640'; arch(330, 40, 300, 520); x.stroke();
      const sweep = Math.sin(t * .35) * .35;
      x.save(); x.globalCompositeOperation = 'lighter'; x.translate(480, -40); x.rotate(sweep);
      g = x.createLinearGradient(0, 0, 0, 600); g.addColorStop(0, 'rgba(255,230,170,.32)'); g.addColorStop(1, 'rgba(255,230,170,0)');
      x.fillStyle = g; x.beginPath(); x.moveTo(-20, 0); x.lineTo(20, 0); x.lineTo(170, 620); x.lineTo(-170, 620); x.fill(); x.restore();
      curtain(true, t); curtain(false, t);
      dust.forEach((d) => { const y = (d.y - t * d.v) % 540; const yy = y < 0 ? y + 540 : y;
        x.globalAlpha = .55 + .45 * Math.sin(t * 2 + d.p); x.fillStyle = '#E8C46A'; dia(d.x + 6 * Math.sin(t * .5 + d.p), yy, d.s); x.fill(); });
      x.globalAlpha = 1;
    }
    return { canvas: c, draw };
  }
})();
