/* ---------------------------------------------------------
   INTRO LOADER：編集タイムライン風（TC カウント + レンダーバー）
--------------------------------------------------------- */
const BOOT_LOG = [
  'Footage: Import Clips',
  'Footage: Proxy Generate',
  'Timeline: Sync Clips',
  'Edit: Cut Point Analyze',
  'Color: Apply LUT',
  'Audio: Levels Normalize',
  'Audio: BGM Sync',
  'Export: Render Timeline',
  'Export: Ready'
];

const introPct = document.getElementById('introPct');
const introBar = document.getElementById('introBar');
const introTc = document.getElementById('introTc');
const introLog = document.getElementById('introLog');

(function runIntro() {
  if (!introTc || !introBar || !introPct || !introLog) return;
  const FPS = 24, CLIP_SEC = 10;
  let pct = 0, logIndex = 0;

  const fmtTc = (frames) => {
    const ff = frames % FPS;
    const ss = Math.floor(frames / FPS) % 60;
    const mm = Math.floor(frames / (FPS * 60)) % 60;
    const hh = Math.floor(frames / (FPS * 3600));
    const p2 = (n) => String(n).padStart(2, '0');
    return `${p2(hh)}:${p2(mm)}:${p2(ss)}:${p2(ff)}`;
  };

  const tick = setInterval(() => {
    pct = Math.min(100, pct + Math.random() * 7 + 2);
    const rounded = Math.round(pct);
    introPct.textContent = rounded + '%';
    introBar.style.width = pct + '%';
    introTc.textContent = fmtTc(Math.round((pct / 100) * CLIP_SEC * FPS));
    if (rounded >= 100) finish();
  }, 60);

  const logTimer = setInterval(() => {
    if (logIndex >= BOOT_LOG.length) { clearInterval(logTimer); return; }
    introLog.textContent = '> ' + BOOT_LOG[logIndex++];
  }, 170);

  function finish() {
    clearInterval(tick);
    clearInterval(logTimer);
    introLog.textContent = '> Export: Ready';
    setTimeout(() => document.body.classList.add('is-ready'), 350);
  }
})();

// フォールバック（何らかの理由で止まった場合）
setTimeout(() => document.body.classList.add('is-ready'), 4000);

/* ---------------------------------------------------------
   HEADER SCROLL STATE
--------------------------------------------------------- */
const header = document.getElementById('header');
const onScroll = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 24);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------------------------------------------------------
   MOBILE MENU
--------------------------------------------------------- */
const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');

function setMenu(open) {
  menu.classList.toggle('is-open', open);
  menu.setAttribute('aria-hidden', String(!open));
  menuBtn.classList.toggle('is-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
}

menuBtn.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false);
});

/* ---------------------------------------------------------
   STAGGER DELAYS
--------------------------------------------------------- */
document.querySelectorAll('.timeline, .achv, .works, .tools').forEach(group => {
  group.querySelectorAll(':scope > .reveal, :scope > li > .reveal').forEach((el, i) => {
    el.style.setProperty('--reveal-delay', (i * 90) + 'ms');
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
  }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
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
    card.className = 'post reveal';
    card.style.setProperty('--reveal-delay', (i * 90) + 'ms');
    if (post.permalink) {
      card.href = post.permalink;
      card.target = '_blank';
      card.rel = 'noopener';
    }

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
    link.innerHTML = 'VIEW' + arrowSVG;
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
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
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
      posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      const view = posts.slice(0, 6);
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
