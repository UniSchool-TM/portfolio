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
const loaderWave = document.getElementById('loaderWave');
const loaderBubbles = document.getElementById('loaderBubbles');

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

/* liquid: level tracks pct, waves slide sideways, bubbles rise */
const loaderWaveBack = document.getElementById('loaderWaveBack');
const loaderSurface = document.getElementById('loaderSurface');
const SVG_H = 180;
const TOP = 34;          // liquid level when 100% (a little above the letter top)
const BOTTOM = 176;      // liquid level when 0% (below the baseline)
const AMP = 6;           // front wave amplitude
const AMP_BACK = 8;      // back wave amplitude (slightly bigger, for depth)
let waveShift = 0;
const bubbles = [];

function makeBubble() {
  const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  const r = 1.1 + Math.random() * 2.4;
  c.setAttribute('r', r.toFixed(1));
  c.setAttribute('cx', (26 + Math.random() * 268).toFixed(0));
  const y = SVG_H + Math.random() * 40;
  c.setAttribute('cy', y.toFixed(0));
  loaderBubbles.appendChild(c);
  bubbles.push({ el: c, y, speed: 0.35 + Math.random() * 1.25, r, base: 0.35 + Math.random() * 0.45 });
}
for (let i = 0; i < 16; i++) makeBubble();

function levelY() {
  return BOTTOM - (BOTTOM - TOP) * (pct / 100);
}

function wavePath(y, amp, shift, close) {
  const x0 = -160 + shift;
  let d = 'M' + x0 + ' ' + y +
    ' q 40 ' + (-amp) + ' 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0';
  if (close) d += ' V ' + SVG_H + ' H ' + x0 + ' Z';
  return d;
}

function renderLiquid() {
  const y = levelY();
  waveShift = (waveShift + 1.15) % 160;
  const backShift = (waveShift + 80) % 160;
  loaderWave.setAttribute('d', wavePath(y, AMP, waveShift, true));
  loaderWaveBack.setAttribute('d', wavePath(y + 3, AMP_BACK, backShift, true));
  loaderSurface.setAttribute('d', wavePath(y, AMP, waveShift, false));
  bubbles.forEach(b => {
    b.y -= b.speed;
    if (b.y < y - 4) { b.y = SVG_H + Math.random() * 30; b.el.setAttribute('cx', (26 + Math.random() * 268).toFixed(0)); }
    b.el.setAttribute('cy', b.y.toFixed(1));
    b.el.setAttribute('opacity', b.y > y ? b.base.toFixed(2) : '0');
  });
  liquidRAF = requestAnimationFrame(renderLiquid);
}
let liquidRAF = requestAnimationFrame(renderLiquid);

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
      cancelAnimationFrame(liquidRAF);
      loader.classList.add('is-done');
      document.body.classList.remove('is-loading');
    }, 450);
  }
}, 140);

/* ---------------------------------------------------------
   NAV SCROLL STATE + SCROLL PROGRESS BAR
--------------------------------------------------------- */
const nav = document.getElementById('nav');
const scrollProgress = document.getElementById('scrollProgress');
const onScroll = () => {
  nav.classList.toggle('is-scrolled', window.scrollY > 40);
  if (scrollProgress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    scrollProgress.style.width = pct + '%';
  }
};
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
   STAGGER：グループ内の要素に順番の遅延を付けてから reveal 化
--------------------------------------------------------- */
document.querySelectorAll('.about__timeline, .achieve__list, .works__grid, .skills__grid, .stats').forEach(group => {
  const items = group.querySelectorAll('.tl__item, .achieve, .work, .skill, .stat');
  items.forEach((el, i) => {
    el.style.setProperty('--reveal-delay', (i * 90) + 'ms');
    el.classList.add('reveal', 'reveal-stagger');
  });
});

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
   POSTS：posts.json を読み込んで Instagram 投稿カードを描画
--------------------------------------------------------- */
(function initPosts() {
  const grid = document.getElementById('postsGrid');
  const note = document.getElementById('postsNote');
  if (!grid) return;

  const TYPE_LABEL = { IMAGE: 'PHOTO', VIDEO: 'VIDEO', CAROUSEL_ALBUM: 'ALBUM' };

  const heartSVG = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 20s-7-4.35-9.5-8.5C1 8.5 2.5 5.5 5.5 5.5c1.9 0 3.2 1.1 3.9 2.2C10.3 6.6 11.6 5.5 13.5 5.5c3 0 4.5 3 3 6-2.5 4.15-4.5 8.5-4.5 8.5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>';
  const chatSVG = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 5.5h16v10H9l-4 3.5V5.5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>';
  const arrowSVG = '<svg viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 11L11 3M11 3H4M11 3V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function fmtDate(ts) {
    try {
      const d = new Date(ts);
      if (isNaN(d)) return '';
      return new Intl.DateTimeFormat('ja-JP', {
        year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Tokyo'
      }).format(d).replace(/\//g, '.').replace(/\.$/, '');
    } catch (e) { return ''; }
  }

  function buildCard(post, i) {
    const card = document.createElement('a');
    card.className = 'post reveal reveal-stagger';
    card.style.setProperty('--reveal-delay', (i * 90) + 'ms');
    if (post.permalink) {
      card.href = post.permalink;
      card.target = '_blank';
      card.rel = 'noopener';
    }

    // media
    const media = document.createElement('div');
    media.className = 'post__media';
    if (post.image) {
      const img = document.createElement('img');
      img.loading = 'lazy';
      img.alt = '';
      img.src = post.image;
      // Instagram の画像URLは期限切れになることがある → 失敗したらフォールバック表示
      img.addEventListener('error', () => {
        img.remove();
        media.classList.add('post__media--empty');
      });
      media.appendChild(img);
    } else {
      media.classList.add('post__media--empty');
    }
    const type = document.createElement('span');
    type.className = 'post__type';
    type.textContent = TYPE_LABEL[post.type] || 'POST';
    media.appendChild(type);
    card.appendChild(media);

    // body
    const body = document.createElement('div');
    body.className = 'post__body';

    const date = document.createElement('span');
    date.className = 'post__date';
    date.textContent = fmtDate(post.timestamp);
    if (date.textContent) body.appendChild(date);

    if (post.caption) {
      const cap = document.createElement('p');
      cap.className = 'post__caption';
      cap.textContent = post.caption;
      body.appendChild(cap);
    }

    const foot = document.createElement('div');
    foot.className = 'post__foot';
    const stats = document.createElement('div');
    stats.className = 'post__stats';
    stats.innerHTML =
      '<span>' + heartSVG + (post.likes ?? 0) + '</span>' +
      '<span>' + chatSVG + (post.comments ?? 0) + '</span>';
    const link = document.createElement('span');
    link.className = 'post__link';
    link.innerHTML = '見る' + arrowSVG;
    foot.appendChild(stats);
    foot.appendChild(link);
    body.appendChild(foot);

    card.appendChild(body);
    return card;
  }

  function revealCards(cards) {
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      cards.forEach(c => io.observe(c));
    } else {
      cards.forEach(c => c.classList.add('is-visible'));
    }
  }

  function showEmpty(msg) {
    grid.innerHTML = '<p class="posts__empty">' + msg + '</p>';
  }

  fetch('posts.json', { cache: 'no-cache' })
    .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(data => {
      const posts = Array.isArray(data.posts) ? data.posts : [];
      // 新しい順に並べ替え（timestamp 降順）
      posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      const view = posts.slice(0, 6); // 最大6件まで表示
      if (!view.length) {
        showEmpty('投稿はまだありません。');
        if (note) note.textContent = '';
        return;
      }
      grid.innerHTML = '';
      const cards = view.map((p, i) => buildCard(p, i));
      cards.forEach(c => grid.appendChild(c));
      revealCards(cards);
      if (note) note.textContent = '※ Instagram @unischool_tm の投稿を自動で表示しています（新しい順・最大6件）。';
    })
    .catch(() => {
      showEmpty('投稿を読み込めませんでした。Instagram @unischool_tm をご覧ください。');
      if (note) note.textContent = '';
    });
})();

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

/* ---------------------------------------------------------
   SECTION PHOTO: reveal-trigger (Ken Burns) + scroll parallax
--------------------------------------------------------- */
const photoSections = document.querySelectorAll('.section--photo');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (photoSections.length) {
  /* Ken Burns は表示中だけ再生（is-visible が付いたら動く） */
  if ('IntersectionObserver' in window) {
    const photoIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
      });
    }, { threshold: 0.05 });
    photoSections.forEach(s => photoIo.observe(s));
  } else {
    photoSections.forEach(s => s.classList.add('is-visible'));
  }

  /* 背景写真だけスクロールでゆっくりズレる＝奥行き（コンテンツより遅く動く） */
  if (!reduceMotion) {
    let ticking = false;
    const parallax = () => {
      const vh = window.innerHeight;
      photoSections.forEach(s => {
        const bg = s.querySelector('.section__bg');
        if (!bg) return;
        const rect = s.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) { ticking = false; return; }
        const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
        bg.style.transform = `translateY(${progress * 28}px)`;
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(parallax); ticking = true; }
    }, { passive: true });
    parallax();
  }
}
