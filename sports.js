// ===== SPORTS.JS =====

// Filter sports cards by sport type
function filterSports(sport, btnEl) {
  const cards = document.querySelectorAll('#sportsGrid .sports-card');
  const buttons = document.querySelectorAll('.sports-tab');

  buttons.forEach(btn => btn.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');

  cards.forEach(card => {
    if (sport === 'all' || card.dataset.sport === sport) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// Pause ticker on hover
document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.ticker-track');
  if (track) {
    track.addEventListener('mouseenter', () => {
      track.style.animationPlayState = 'paused';
    });
    track.addEventListener('mouseleave', () => {
      track.style.animationPlayState = 'running';
    });
  }

  // Animate cards on scroll
  const cards = document.querySelectorAll('.sports-card');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    cards.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = `opacity 0.4s ease ${i * 0.08}s, transform 0.4s ease ${i * 0.08}s`;
      observer.observe(card);
    });
  }
});
