// ===== BLOG.JS =====

// Newsletter subscription
function subscribeNewsletter(e) {
  e.preventDefault();
  const form = document.getElementById('newsletterForm');
  const msg = document.getElementById('subscribeMsg');

  // Basic validation
  const emailInput = form.querySelector('input[type="email"]');
  if (!emailInput || !emailInput.value) return;

  // Simulate async submission
  const btn = form.querySelector('button');
  btn.textContent = 'Subscribing...';
  btn.disabled = true;

  setTimeout(() => {
    form.style.display = 'none';
    if (msg) msg.classList.remove('hidden');
  }, 1000);
}

// Animate blog posts on scroll
document.addEventListener('DOMContentLoaded', () => {
  const posts = document.querySelectorAll('.blog-post');

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

    posts.forEach(post => {
      post.style.opacity = '0';
      post.style.transform = 'translateY(20px)';
      post.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(post);
    });
  }
});
