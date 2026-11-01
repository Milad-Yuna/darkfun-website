/* DARK FUN — small helpers for the menu and scroll effects. */
(function () {
  'use strict';

  var root = document.documentElement;
  var body = document.body;
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var toggleLabel = document.querySelector('.nav-toggle__label');
  var nav = document.getElementById('site-nav');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));

  /* ---- Mobile menu ---- */
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggleLabel.textContent = open ? 'Close' : 'Menu';
    body.classList.toggle('menu-open', open);
  }

  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });

  nav.addEventListener('click', function (event) {
    if (event.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && body.classList.contains('menu-open')) {
      setMenu(false);
      toggle.focus();
    }
  });

  var desktop = window.matchMedia('(min-width: 960px)');
  var closeOnDesktop = function () { if (desktop.matches) setMenu(false); };
  if (desktop.addEventListener) desktop.addEventListener('change', closeOnDesktop);
  else if (desktop.addListener) desktop.addListener(closeOnDesktop);

  /* ---- Header background + highlight the section you're in ---- */
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  function update() {
    header.classList.toggle('is-scrolled', window.scrollY > 24);

    var current = sections[0];
    var line = window.innerHeight * 0.4;
    var atBottom = window.innerHeight + window.scrollY >= root.scrollHeight - 4;

    if (atBottom) {
      current = sections[sections.length - 1];
    } else {
      sections.forEach(function (section) {
        if (section.getBoundingClientRect().top <= line) current = section;
      });
    }

    navLinks.forEach(function (link) {
      var active = link.getAttribute('href') === '#' + current.id;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      update();
      ticking = false;
    });
  }

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  /* ---- Gentle fade-in as sections scroll into view ---- */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !reduceMotion) {
    root.classList.add('can-reveal');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---- Keep the footer year current ---- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
