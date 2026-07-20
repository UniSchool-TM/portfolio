/* ---------------------------------------------------------
   PRELOADER
--------------------------------------------------------- */
const BOOT_LOG = [
  'Footage: Import Clips',
  'Footage: Proxy Generate',
  'Footage: Color Space Detect',
  'Edit: Timeline Sync',
  'Edit: Cut Point Analyze',
  'Edit: Transition Render',
  'Audio: Levels Normalize',
  'Audio: Noise Reduction Apply',
  'Audio: BGM Sync',
  'Export: Codec Optimize',
  'Export: Thumbnail Generate',
  'Export: Ready'
];

document.body.classList.add('is-loading');

const loader = document.getElementById('loader');
const loaderPct = document.getElementById('loaderPct');
const loaderBar = document.getElementById('loaderBar');
const loaderLog = document.getElementById('loaderLog');

let pct = 0;
let logIndex = 0;

function pushLog() {
  if (logIndex >= BOOT_LOG.length) return;
  const line = document.createElement('span');
  line.textContent = '> ' + BOOT_LOG[logIndex];
  loaderLog.innerHTML = '';
  loaderLog.appendChild(line);
  logIndex++;
}

const logTimer = setInterval(pushLog, 180);
pushLog();

const pctTimer = setInterval(() => {
  const step = pct < 70 ? Math.random() * 9 + 3 : Math.random() * 4 + 1;
  pct = Math.min(100, pct + step);
  const rounded = Math.round(pct);
  loaderPct.textContent = String(rounded).padStart(2, '0') + '%';
  loaderBar.style.width = rounded + '%';
  if (pct >= 100) {
    clearInterval(pctTimer);
    clearInterval(logTimer);
    setTimeout(() => {
      loader.classList.add('is-done');
      document.body.classList.remove('is-loading');
    }, 250);
  }
}, 140);

/* ---------------------------------------------------------
   NAV SCROLL STATE
--------------------------------------------------------- */
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------------------------------------------------------
   FULLSCREEN MENU
--------------------------------------------------------- */
const navToggle = document.getElementById('navToggle');
const menu = document.getElementById('menu');
const toggleText = navToggle.querySelector('.nav__toggle-text');

function setMenu(open) {
  menu.classList.toggle('is-open', open);
  navToggle.classList.toggle('is-active', open);
  navToggle.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
  toggleText.textContent = open ? 'CLOSE' : 'MENU';
}

navToggle.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

/* ---------------------------------------------------------
   CUSTOM CURSOR
--------------------------------------------------------- */
const cursor = document.getElementById('cursor');
let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
let tx = cx, ty = cy;

if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
  (function tick() {
    cx += (tx - cx) * 0.18;
    cy += (ty - cy) * 0.18;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  })();

  document.querySelectorAll('a, button, .work__frame').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));
  });
}

/* ---------------------------------------------------------
   SCROLL REVEAL
--------------------------------------------------------- */
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
}

/* ---------------------------------------------------------
   STAT COUNTERS
--------------------------------------------------------- */
const counters = document.querySelectorAll('.count');
if ('IntersectionObserver' in window && counters.length) {
  const countIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1400;
      const start = performance.now();
      function step(now) {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target).toLocaleString('ja-JP');
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString('ja-JP');
      }
      requestAnimationFrame(step);
      countIo.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(el => countIo.observe(el));
}

/* ---------------------------------------------------------
   HERO GIANT TYPE PARALLAX
--------------------------------------------------------- */
const heroGiant = document.querySelector('.hero__giant span');
if (heroGiant) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY * 0.15;
    heroGiant.style.transform = `translateY(${y}px)`;
  }, { passive: true });
}
