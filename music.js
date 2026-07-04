// ===== MUSIC.JS =====

// Filter music cards by genre tab
function filterByGenre(genre, btnEl) {
  const cards = document.querySelectorAll('#musicGrid .media-card');
  const buttons = document.querySelectorAll('.genre-tab');

  buttons.forEach(btn => btn.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');

  cards.forEach(card => {
    if (genre === 'all' || card.dataset.genre === genre) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Play a track and show "Now Playing" banner
function playTrack(trackName, artistName) {
  const nowPlaying = document.getElementById('nowPlaying');
  const nowPlayingText = document.getElementById('nowPlayingText');

  if (nowPlayingText) {
    nowPlayingText.textContent = `${trackName}${artistName ? ' — ' + artistName : ''}`;
  }

  if (nowPlaying) {
    nowPlaying.classList.remove('hidden');
  }
}

// Search/filter music cards
function searchMusic() {
  const query = document.getElementById('musicSearch').value.toLowerCase().trim();
  const cards = document.querySelectorAll('#musicGrid .media-card');

  cards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const artist = card.querySelector('p').textContent.toLowerCase();
    const visible = title.includes(query) || artist.includes(query);
    card.style.display = visible ? 'block' : 'none';
  });
}

// Allow pressing Enter to trigger search
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('musicSearch');
  if (searchInput) {
    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') searchMusic();
      // Live search as you type
      searchMusic();
    });
  }
});
