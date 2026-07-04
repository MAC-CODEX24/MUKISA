// ===== CONTACT.JS =====

// Contact form submission
function submitContact(e) {
  e.preventDefault();

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !subject || !message) {
    flashMessage('formError');
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    flashMessage('formError');
    return;
  }

  // Simulate sending (in production, replace with fetch() to contact.php)
  const submitBtn = document.querySelector('#contactForm button[type="submit"]');
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  setTimeout(() => {
    // Simulate a successful response
    document.getElementById('contactForm').reset();
    submitBtn.textContent = 'Send Message';
    submitBtn.disabled = false;
    flashMessage('formSuccess', 5000);

    // In real use, call:
    // sendContactForm({ name, email, subject, message });
  }, 1500);
}

// Send data to PHP backend (used in production)
async function sendContactForm(data) {
  try {
    const response = await fetch('php/contact.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.success) {
      flashMessage('formSuccess', 5000);
    } else {
      flashMessage('formError');
    }
  } catch (err) {
    console.error('Contact form error:', err);
    flashMessage('formError');
  }
}
