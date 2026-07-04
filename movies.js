// ===== MOVIES.JS =====

// Filter movies by genre
function filterMovies(genre, btnEl) {
  const cards = document.querySelectorAll('#moviesGrid .media-card');
  const buttons = document.querySelectorAll('.filter-btn');

  // Update active button
  buttons.forEach(btn => btn.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');

  // Show/hide cards
  cards.forEach(card => {
    if (genre === 'all' || card.dataset.genre === genre) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Show trailer modal
function showTrailer(movieTitle) {
  const modal = document.getElementById('trailerModal');
  const title = document.getElementById('trailerTitle');

  if (title) title.textContent = movieTitle;
  if (modal) modal.classList.remove('hidden');

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

// Close trailer modal
function closeModal() {
  const modal = document.getElementById('trailerModal');
  if (modal) modal.classList.add('hidden');
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
