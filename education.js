// ===== EDUCATION.JS =====

// Filter courses by category
function filterCourses(category, btnEl) {
  const cards = document.querySelectorAll('#eduGrid .edu-card');
  const buttons = document.querySelectorAll('.edu-tab');

  buttons.forEach(btn => btn.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');

  cards.forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// Live search courses
function searchCourses() {
  const query = document.getElementById('eduSearch').value.toLowerCase().trim();
  const cards = document.querySelectorAll('#eduGrid .edu-card');

  cards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const desc  = card.querySelector('p').textContent.toLowerCase();
    card.style.display = (title.includes(query) || desc.includes(query)) ? 'flex' : 'none';
  });
}

// Enroll in a course
function enrollCourse(courseName) {
  const toast = document.getElementById('enrollMsg');
  const text  = document.getElementById('enrollText');

  if (text) text.textContent = courseName;
  if (toast) {
    toast.classList.remove('hidden');
    // Auto-hide after 3.5 seconds
    setTimeout(() => toast.classList.add('hidden'), 3500);
  }
}

// Live search as you type
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('eduSearch');
  if (input) {
    input.addEventListener('input', searchCourses);
    input.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') searchCourses();
    });
  }
});
