// ===== MAIN.JS - Shared across all pages =====

document.addEventListener('DOMContentLoaded', () => {

  // ── Hamburger menu toggle ──────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.querySelector('nav ul');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    // Close menu when a nav link is clicked
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('open');
      }
    });
  }

  // ── Settings dropdown open/close ───────────────────────────────
  const dropdowns = document.querySelectorAll('.nav-dropdown');

  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.nav-dropdown-toggle');

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('open');
      // Close all other dropdowns first
      dropdowns.forEach(d => {
        d.classList.remove('open');
        const t = d.querySelector('.nav-dropdown-toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        dropdown.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    dropdowns.forEach(dropdown => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
        const toggle = dropdown.querySelector('.nav-dropdown-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close dropdown on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove('open');
        const toggle = dropdown.querySelector('.nav-dropdown-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // ── Dark / Light theme toggle ──────────────────────────────────
  const themeBtn = document.getElementById('themeToggleBtn');
  const THEME_KEY = 'mediahub-theme';

  function applyTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
      if (themeBtn) themeBtn.textContent = '☀️ Toggle Dark / Light';
    } else {
      document.body.classList.remove('light-theme');
      if (themeBtn) themeBtn.textContent = '🌙 Toggle Dark / Light';
    }
  }

  // Restore saved theme
  applyTheme(localStorage.getItem(THEME_KEY) || 'dark');

  if (themeBtn) {
    themeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isLight = document.body.classList.contains('light-theme');
      const next = isLight ? 'dark' : 'light';
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }

  // ── Font size toggle ───────────────────────────────────────────
  // Cycles: normal → large → small → normal
  const fontBtn  = document.getElementById('fontSizeBtn');
  const FONT_KEY = 'mediahub-fontsize';
  const fontSizes = ['normal', 'large', 'small'];

  function applyFontSize(size) {
    document.body.classList.remove('font-sm', 'font-lg');
    if (size === 'small')  document.body.classList.add('font-sm');
    if (size === 'large')  document.body.classList.add('font-lg');
    if (fontBtn) {
      const labels = { normal: '🔡 Text Size', large: '🔡 Text Size: Large', small: '🔡 Text Size: Small' };
      fontBtn.textContent = labels[size] || '🔡 Text Size';
    }
  }

  applyFontSize(localStorage.getItem(FONT_KEY) || 'normal');

  if (fontBtn) {
    fontBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const current = localStorage.getItem(FONT_KEY) || 'normal';
      const idx  = fontSizes.indexOf(current);
      const next = fontSizes[(idx + 1) % fontSizes.length];
      localStorage.setItem(FONT_KEY, next);
      applyFontSize(next);
    });
  }

  // ── Language selector ──────────────────────────────────────────
  // Cycles EN → AR → FR → ES → EN
  const langBtn  = document.getElementById('langBtn');
  const LANG_KEY = 'mediahub-lang';
  const langs    = ['EN', 'AR', 'FR', 'ES'];

  function applyLang(lang) {
    if (langBtn) langBtn.textContent = `🌐 Language: ${lang}`;
    document.documentElement.lang = lang.toLowerCase();
  }

  applyLang(localStorage.getItem(LANG_KEY) || 'EN');

  if (langBtn) {
    langBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const current = localStorage.getItem(LANG_KEY) || 'EN';
      const idx  = langs.indexOf(current);
      const next = langs[(idx + 1) % langs.length];
      localStorage.setItem(LANG_KEY, next);
      applyLang(next);
    });
  }

  // ── Animations toggle ──────────────────────────────────────────
  const animBtn  = document.getElementById('animToggleBtn');
  const ANIM_KEY = 'mediahub-anim';

  function applyAnim(value) {
    if (value === 'off') {
      document.body.classList.add('reduce-motion');
      if (animBtn) animBtn.textContent = '✨ Animations: Off';
    } else {
      document.body.classList.remove('reduce-motion');
      if (animBtn) animBtn.textContent = '✨ Animations: On';
    }
  }

  applyAnim(localStorage.getItem(ANIM_KEY) || 'on');

  if (animBtn) {
    animBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const current = localStorage.getItem(ANIM_KEY) || 'on';
      const next    = current === 'on' ? 'off' : 'on';
      localStorage.setItem(ANIM_KEY, next);
      applyAnim(next);
    });
  }

  // ── High Contrast toggle ───────────────────────────────────────
  const contrastBtn  = document.getElementById('contrastBtn');
  const CONTRAST_KEY = 'mediahub-contrast';

  function applyContrast(value) {
    if (value === 'on') {
      document.body.classList.add('high-contrast');
      if (contrastBtn) contrastBtn.textContent = '👁 High Contrast: On';
    } else {
      document.body.classList.remove('high-contrast');
      if (contrastBtn) contrastBtn.textContent = '👁 High Contrast';
    }
  }

  applyContrast(localStorage.getItem(CONTRAST_KEY) || 'off');

  if (contrastBtn) {
    contrastBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const current = localStorage.getItem(CONTRAST_KEY) || 'off';
      const next    = current === 'off' ? 'on' : 'off';
      localStorage.setItem(CONTRAST_KEY, next);
      applyContrast(next);
    });
  }

}); // end DOMContentLoaded

// ── Utility: show an element ───────────────────────────────────────
function showElement(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('hidden');
}

// ── Utility: hide an element ───────────────────────────────────────
function hideElement(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('hidden');
}

// ── Utility: show then auto-hide after delay ───────────────────────
function flashMessage(id, delay = 4000) {
  showElement(id);
  setTimeout(() => hideElement(id), delay);
}

// ── Admin Portal Button — injected on every page except admin.html ──
(function injectAdminButton() {
  // Don't add to admin page itself
  if (window.location.pathname.endsWith('admin.html')) return;

  const btn = document.createElement('a');
  btn.href        = 'admin.html';
  btn.className   = 'admin-portal-btn';
  btn.title       = 'Admin Portal';
  btn.setAttribute('aria-label', 'Admin Portal');
  btn.innerHTML   = '<i class="fa-solid fa-shield-halved"></i>';
  document.body.appendChild(btn);
})();
