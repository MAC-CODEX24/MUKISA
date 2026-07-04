// ===== APP.JS — MediaHub Cross-Page Content Engine =====
// Reads admin-posted content from localStorage and injects into site pages.

(function () {
  'use strict';

  const CONTENT_KEY = 'mh_content';
  const DL_KEY      = 'mh_dl_settings';
  const CNT_KEY     = 'mh_dl_counts';
  const BUILDER_KEY = 'mh_builder';

  function getStore() {
    try { return JSON.parse(localStorage.getItem(CONTENT_KEY)) || {}; } catch { return {}; }
  }
  function getDL() {
    try { return JSON.parse(localStorage.getItem(DL_KEY)) || {}; } catch { return {}; }
  }
  function incDL(type) {
    try {
      const c = JSON.parse(localStorage.getItem(CNT_KEY) || '{}');
      c[type] = (c[type] || 0) + 1;
      localStorage.setItem(CNT_KEY, JSON.stringify(c));
    } catch {}
  }
  function esc(s) { const d = document.createElement('div'); d.textContent = String(s || ''); return d.innerHTML; }

  // ── Apply builder theme settings ────────────────────────────
  function applyBuilderTheme() {
    try {
      const b = JSON.parse(localStorage.getItem(BUILDER_KEY) || '{}');
      if (b.primary) document.documentElement.style.setProperty('--red', b.primary);
      if (b.bg)      document.documentElement.style.setProperty('--bg', b.bg);
      if (b.accent)  document.documentElement.style.setProperty('--gold', b.accent);
      // Apply hero text if on homepage
      const h1 = document.querySelector('.hero h1 span') || document.querySelector('.hero-content h1 span');
      const p  = document.querySelector('.hero-content > p');
      const btn1 = document.querySelector('.hero-buttons .btn:first-child');
      const btn2 = document.querySelector('.hero-buttons .btn:last-child');
      if (b.h1 && h1) h1.parentElement.innerHTML = b.h1;
      if (b.p  && p)  p.textContent = b.p;
      if (b.b1 && btn1) btn1.textContent = b.b1;
      if (b.b2 && btn2) btn2.textContent = b.b2;
    } catch {}
  }

  // ── Genre → emoji map ────────────────────────────────────────
  const EMOJIS = { action:'💥',drama:'🎭',comedy:'😂','sci-fi':'🚀',horror:'👻',romance:'❤️',thriller:'🔪',animation:'🎠',
    pop:'🎤',rock:'🎸',jazz:'🎹','hip-hop':'🎧',classical:'🎻',electronic:'🥁','r&b':'🎼',country:'🤠',
    football:'⚽',basketball:'🏀',tennis:'🎾',cricket:'🏏',f1:'🏎️',baseball:'⚾',other:'🏅',
    'web dev':'💻',music:'🎵',film:'🎬',business:'📈','data science':'🔬',design:'🎨' };
  function em(val) { return EMOJIS[(val||'').toLowerCase()] || '🎬'; }

  // ── Download button helper ───────────────────────────────────
  function dlBtn(type, url, label) {
    if (!url) return '';
    return `<a class="play-btn" style="background:rgba(34,197,94,.15);border:1px solid rgba(34,197,94,.3);color:#22c55e;display:inline-block;margin-top:.3rem;padding:.4rem .9rem;border-radius:7px;font-size:.8rem;text-decoration:none"
      href="${esc(url)}" target="_blank"
      onclick="try{var c=JSON.parse(localStorage.getItem('mh_dl_counts')||'{}');c['${type}']=(c['${type}']||0)+1;localStorage.setItem('mh_dl_counts',JSON.stringify(c))}catch{}"
      download>⬇ ${label || 'Download'}</a>`;
  }

  // ── MOVIES ──────────────────────────────────────────────────
  function injectMovies() {
    const grid = document.getElementById('moviesGrid');
    if (!grid) return;
    const items = (getStore().movies || []).filter(i => i.status === 'live');
    if (!items.length) return;
    const dlOn = getDL().movies !== false;
    const section = document.createElement('div');
    section.id = 'admin-movies-section';
    section.innerHTML = '<h2 class="section-title" style="margin:1.5rem 0 .75rem;border-left:3px solid #e50914;padding-left:.75rem">🆕 Recently Added</h2>';
    const subGrid = document.createElement('div');
    subGrid.className = 'media-grid';
    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'media-card';
      card.dataset.genre = (item.genre || '').toLowerCase();
      card.innerHTML = `
        <div class="media-thumb movie-thumb">${em(item.genre)}</div>
        <h3>${esc(item.title)}</h3>
        <p>⭐ ${esc(item.rating || 'N/A')} | ${esc(item.year || '')}</p>
        <span class="tag">${esc(item.genre || '')}</span>
        ${item.desc ? `<p style="font-size:.75rem;color:#888;margin:.4rem 0">${esc(item.desc.replace(/<[^>]+>/g,'').substring(0,80))}…</p>` : ''}
        ${item.trailer ? `<button class="play-btn" onclick="window.open('${esc(item.trailer)}','_blank')">🎬 Trailer</button>` : ''}
        ${dlOn ? dlBtn('movies', item.download) : ''}`;
      subGrid.appendChild(card);
    });
    section.appendChild(subGrid);
    grid.parentElement.insertBefore(section, grid.nextSibling);
  }

  // ── MUSIC ───────────────────────────────────────────────────
  function injectMusic() {
    const grid = document.getElementById('musicGrid');
    if (!grid) return;
    const items = (getStore().music || []).filter(i => i.status === 'live');
    if (!items.length) return;
    const dlOn = getDL().music !== false;
    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'media-card';
      card.dataset.genre = item.genre || '';
      card.innerHTML = `
        <div class="media-thumb music-thumb">${em(item.genre)}</div>
        <h3>${esc(item.title)}</h3>
        <p>Artist: ${esc(item.artist || '')}</p>
        <span class="tag">${esc(item.genre || '')}</span>
        ${item.album ? `<p style="font-size:.75rem;color:#888;margin:.3rem 0">📀 ${esc(item.album)}</p>` : ''}
        ${item.duration ? `<p style="font-size:.75rem;color:#888">⏱ ${esc(item.duration)}</p>` : ''}
        <button class="play-btn" onclick="${item.stream ? `window.open('${esc(item.stream)}','_blank')` : `typeof playTrack==='function'&&playTrack('${esc(item.title)}','${esc(item.artist||'')}')`}">▶ Play</button>
        ${dlOn ? dlBtn('music', item.download) : ''}`;
      grid.appendChild(card);
    });
  }

  // ── BLOG ────────────────────────────────────────────────────
  function injectBlog() {
    const posts = document.querySelector('.blog-posts');
    if (!posts) return;
    const items = (getStore().blog || []).filter(i => i.status === 'live');
    if (!items.length) return;
    items.forEach(item => {
      const article = document.createElement('article');
      article.className = 'blog-post';
      article.innerHTML = `
        <div class="post-meta">
          <span class="post-date">${esc(item.date || '')}</span>
          <span class="post-category">${esc(item.category || '')}</span>
          ${item.author ? `<span class="post-category" style="background:rgba(56,189,248,.15);color:#38bdf8">✍️ ${esc(item.author)}</span>` : ''}
        </div>
        <h2>${esc(item.title)}</h2>
        <p>${esc(item.summary || (item.content || '').replace(/<[^>]+>/g,'').substring(0,180))}…</p>
        ${item.tags ? `<div style="margin:.5rem 0">${item.tags.split(',').map(t=>`<span style="font-size:.7rem;padding:.15rem .5rem;background:rgba(229,9,20,.1);color:#e50914;border-radius:5px;margin-right:.3rem">#${t.trim()}</span>`).join('')}</div>` : ''}
        <a href="#" class="btn btn-sm">Read More</a>`;
      posts.insertBefore(article, posts.firstChild);
    });
  }

  // ── SPORTS ──────────────────────────────────────────────────
  function injectSports() {
    const grid = document.getElementById('sportsGrid');
    if (!grid) return;
    const items = (getStore().sports || []).filter(i => i.status === 'live');
    if (!items.length) return;
    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'sports-card';
      card.dataset.sport = (item.sport || '').toLowerCase();
      card.innerHTML = `
        <div class="sports-thumb football-thumb">${em(item.sport)}</div>
        <div class="sports-card-body">
          <span class="sports-badge">${esc(item.sport || '')}</span>
          <h3>${esc(item.title)}</h3>
          ${item.teams ? `<p style="font-weight:700;font-size:.82rem;margin:.2rem 0">${esc(item.teams)}${item.score ? ` — <span style="color:#22c55e">${esc(item.score)}</span>` : ''}</p>` : ''}
          <p>${esc((item.body || (item.content||'').replace(/<[^>]+>/g,'')||'').substring(0,120))}…</p>
          <div class="sports-meta">
            <span>${esc(item.date || '')}</span>
            <a href="#" class="btn btn-sm">Read More</a>
          </div>
        </div>`;
      grid.insertBefore(card, grid.firstChild);
    });
  }

  // ── EDUCATION ───────────────────────────────────────────────
  function injectEducation() {
    const grid = document.getElementById('eduGrid');
    if (!grid) return;
    const items = (getStore().courses || []).filter(i => i.status === 'live');
    if (!items.length) return;
    const dlOn = getDL().courses !== false;
    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'edu-card';
      card.dataset.category = (item.category || '').toLowerCase().replace(/ /g,'-');
      card.innerHTML = `
        <div class="edu-thumb tech-thumb">${em(item.category)}</div>
        <div class="edu-card-body">
          <span class="edu-badge">${esc(item.category || '')}</span>
          <h3>${esc(item.title)}</h3>
          <p>${esc(item.desc || '').substring(0,100)}${(item.desc||'').length>100?'…':''}</p>
          <div class="edu-meta">
            ${item.duration ? `<span>⏱ ${esc(item.duration)}h</span>` : ''}
            ${item.level ? `<span class="edu-level ${item.level.toLowerCase()}">${esc(item.level)}</span>` : ''}
            ${item.price ? `<span style="color:#22c55e;font-weight:700">${esc(item.price)}</span>` : ''}
          </div>
          ${item.url ? `<a href="${esc(item.url)}" target="_blank" class="btn btn-sm">Enroll ${item.instructor?'— '+esc(item.instructor):''}</a>` : `<button class="btn btn-sm" onclick="typeof enrollCourse==='function'&&enrollCourse('${esc(item.title)}')">Enroll Free</button>`}
          ${dlOn ? dlBtn('courses', item.download, 'Materials') : ''}
        </div>`;
      grid.insertBefore(card, grid.firstChild);
    });
  }

  // ── INIT on DOMContentLoaded ─────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    applyBuilderTheme();
    const page = window.location.pathname.split('/').pop() || 'index.html';
    if (page === 'movies.html')    injectMovies();
    if (page === 'music.html')     injectMusic();
    if (page === 'blog.html')      injectBlog();
    if (page === 'sports.html')    injectSports();
    if (page === 'education.html') injectEducation();
  });

})();
