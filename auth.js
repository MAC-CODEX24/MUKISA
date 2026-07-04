// ===== AUTH.JS — sign in, sign up, dashboard, notifications =====

/* ── Helpers ── */
function showMsg(id, text, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.className = 'auth-msg ' + type;
}

function togglePw(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') { input.type = 'text'; btn.textContent = '🙈'; }
  else { input.type = 'password'; btn.textContent = '👁'; }
}

/* ── Password strength ── */
function checkStrength(val) {
  const bar = document.getElementById('strengthBar');
  const lbl = document.getElementById('strengthLabel');
  if (!bar) return;
  let score = 0;
  if (val.length >= 8)  score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  const levels = [
    { w: '0%',   bg: '#333',    txt: '' },
    { w: '25%',  bg: '#e50914', txt: 'Weak' },
    { w: '50%',  bg: '#f97316', txt: 'Fair' },
    { w: '75%',  bg: '#f5c518', txt: 'Good' },
    { w: '100%', bg: '#22c55e', txt: 'Strong' },
  ];
  bar.style.width = levels[score].w;
  bar.style.background = levels[score].bg;
  if (lbl) lbl.textContent = levels[score].txt;
}

/* ── Sign In ── */
function handleSignIn(e) {
  e.preventDefault();
  const email = document.getElementById('signin-email').value.trim();
  const pw    = document.getElementById('signin-pw').value;
  if (!email || !pw) { showMsg('authMsg','Please fill in all fields.','error'); return; }

  // Simulate auth — in production this calls the backend
  const stored = JSON.parse(localStorage.getItem('mh_user') || 'null');
  if (stored && stored.email === email && stored.pw === pw) {
    localStorage.setItem('mh_session', JSON.stringify({ email, name: stored.name, loggedIn: true }));
    showMsg('authMsg', '✅ Signed in! Redirecting…', 'success');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1000);
  } else {
    showMsg('authMsg', '❌ Invalid email or password.', 'error');
  }
}

/* ── Sign Up ── */
function handleSignUp(e) {
  e.preventDefault();
  const name  = document.getElementById('su-name').value.trim();
  const email = document.getElementById('su-email').value.trim();
  const pw    = document.getElementById('su-pw').value;
  const pw2   = document.getElementById('su-pw2').value;
  const agree = document.getElementById('agreeTerms').checked;

  if (!name || !email || !pw || !pw2) { showMsg('authMsg','Please fill in all fields.','error'); return; }
  if (pw !== pw2) { showMsg('authMsg','Passwords do not match.','error'); return; }
  if (pw.length < 8) { showMsg('authMsg','Password must be at least 8 characters.','error'); return; }
  if (!agree) { showMsg('authMsg','Please accept the Terms of Service.','error'); return; }

  localStorage.setItem('mh_user', JSON.stringify({ name, email, pw }));
  localStorage.setItem('mh_session', JSON.stringify({ email, name, loggedIn: true }));
  showMsg('authMsg', '✅ Account created! Redirecting…', 'success');
  setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
}

/* ── Sign Out ── */
function signOut() {
  localStorage.removeItem('mh_session');
  window.location.href = 'signin.html';
}

/* ── Confirm Delete ── */
function confirmDelete() {
  if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
    localStorage.removeItem('mh_user');
    localStorage.removeItem('mh_session');
    window.location.href = 'index.html';
  }
}

/* ── Dashboard tabs ── */
function showTab(name, link) {
  document.querySelectorAll('.dash-tab').forEach(t => t.classList.add('hidden'));
  const tab = document.getElementById('tab-' + name);
  if (tab) tab.classList.remove('hidden');
  document.querySelectorAll('.dash-nav-link').forEach(l => l.classList.remove('active'));
  if (link) link.classList.add('active');
  if (link) { history.replaceState(null,'','#'+name); }
}

/* ── Dashboard settings shortcuts ── */
const fontCycle = ['Normal','Large','Small'];
let fontIdx = 0;
function cycleFontDash() {
  fontIdx = (fontIdx + 1) % fontCycle.length;
  document.body.classList.remove('font-sm','font-lg');
  if (fontIdx === 1) document.body.classList.add('font-lg');
  if (fontIdx === 2) document.body.classList.add('font-sm');
  const btn = document.getElementById('dashFontBtn');
  if (btn) btn.textContent = fontCycle[fontIdx];
}
function toggleContrastDash() {
  document.body.classList.toggle('high-contrast');
  const btn = document.getElementById('dashContrastBtn');
  if (btn) btn.textContent = document.body.classList.contains('high-contrast') ? 'On' : 'Off';
}

/* ── Profile save ── */
function saveProfile() {
  const first = document.getElementById('pfFirstName')?.value || '';
  const last  = document.getElementById('pfLastName')?.value  || '';
  const email = document.getElementById('pfEmail')?.value     || '';
  const name  = (first + ' ' + last).trim();

  const el1 = document.getElementById('profileNameDisplay');
  const el2 = document.getElementById('profileEmailDisplay');
  const el3 = document.getElementById('dashUserName');
  const el4 = document.getElementById('dashGreetName');
  const av1 = document.getElementById('dashAvatarInitial');
  const av2 = document.getElementById('profileAvatarBig');
  const init = name.charAt(0).toUpperCase() || 'U';

  if (el1) el1.textContent = name;
  if (el2) el2.textContent = email;
  if (el3) el3.textContent = name;
  if (el4) el4.textContent = first || name;
  if (av1) av1.textContent = init;
  if (av2) av2.textContent = init;

  const session = JSON.parse(localStorage.getItem('mh_session') || '{}');
  session.name = name; session.email = email;
  localStorage.setItem('mh_session', JSON.stringify(session));
  showMsg('profileMsg','✅ Profile updated successfully.','success');
  setTimeout(() => { const m = document.getElementById('profileMsg'); if(m) m.className='auth-msg'; }, 3000);
}

/* ── Notifications ── */
function markRead(item) {
  item.classList.remove('unread');
  const dot = item.querySelector('.notif-unread-dot');
  if (dot) dot.remove();
  updateUnreadCount();
}

function markAllRead() {
  document.querySelectorAll('.notif-item.unread').forEach(i => markRead(i));
}

function updateUnreadCount() {
  const count = document.querySelectorAll('.notif-item.unread').length;
  document.querySelectorAll('.notif-bell-count').forEach(el => {
    el.textContent = count;
    el.style.display = count ? 'flex' : 'none';
  });
}

function filterNotifs(type, btn) {
  document.querySelectorAll('.notif-filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.notif-item').forEach(item => {
    item.style.display = (type === 'all' || item.dataset.type === type) ? '' : 'none';
  });
}

/* ── Load session on dashboard ── */
document.addEventListener('DOMContentLoaded', () => {
  const session = JSON.parse(localStorage.getItem('mh_session') || 'null');

  // Populate dashboard if on dashboard page
  if (document.getElementById('dashUserName') && session) {
    const name  = session.name  || 'User';
    const first = name.split(' ')[0];
    const init  = name.charAt(0).toUpperCase();
    const el1 = document.getElementById('dashUserName');
    const el2 = document.getElementById('dashGreetName');
    const av1 = document.getElementById('dashAvatarInitial');
    const av2 = document.getElementById('profileAvatarBig');
    if (el1) el1.textContent = name;
    if (el2) el2.textContent = first;
    if (av1) av1.textContent = init;
    if (av2) av2.textContent = init;
    if (document.getElementById('pfFirstName')) {
      const parts = name.split(' ');
      document.getElementById('pfFirstName').value = parts[0] || '';
      document.getElementById('pfLastName').value  = parts.slice(1).join(' ') || '';
      document.getElementById('pfEmail').value = session.email || '';
      if (document.getElementById('profileNameDisplay'))  document.getElementById('profileNameDisplay').textContent  = name;
      if (document.getElementById('profileEmailDisplay')) document.getElementById('profileEmailDisplay').textContent = session.email || '';
    }
  }

  // Handle initial tab from URL hash
  const hash = window.location.hash.replace('#','');
  if (hash && document.getElementById('tab-' + hash)) {
    showTab(hash, document.querySelector(`.dash-nav-link[href="#${hash}"]`));
  }
});
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();

app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: "GOOGLE_CLIENT_ID",
  clientSecret: "GOOGLE_CLIENT_SECRET",
  callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => res.send("Google Login Success")
);

app.listen(3000);
