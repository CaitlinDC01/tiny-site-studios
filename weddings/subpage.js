(() => {
  const packageNames = { essentials: 'Essentials · $99', signature: 'Signature · $149', 'wedding-hub': 'Wedding Hub · $199', 'full-experience': 'Full Experience · $249' };
  const selected = new URLSearchParams(location.search).get('package');
  const output = document.querySelector('[data-selected-package]');
  if (output && selected && packageNames[selected]) output.textContent = packageNames[selected];

  const finder = document.querySelector('[data-package-finder]');
  if (finder) {
    const result = finder.querySelector('[data-finder-result]');
    const update = () => {
      const values = [...finder.querySelectorAll('input:checked')].map((input) => input.value);
      let slug = 'essentials';
      if (values.some((value) => ['rsvp','meals','travel','faq','story'].includes(value))) slug = 'signature';
      if (values.some((value) => ['weekend','seat-finder','dj','updates','seating'].includes(value))) slug = 'wedding-hub';
      const tools = values.filter((value) => ['seat-finder','dj','updates','seating','guestbook'].includes(value)).length;
      if (tools >= 2 || values.includes('live-itinerary')) slug = 'full-experience';
      const extras = [];
      if (values.includes('seating')) extras.push('Seating Studio');
      if (values.includes('guestbook')) extras.push('Guestbook Live');
      result.innerHTML = `<p>Your best starting point:</p><strong>${packageNames[slug]}</strong>${extras.length ? `<p>Consider adding: ${extras.join(' + ')}</p>` : ''}<a class="pill pill-light" href="/weddings/start/?package=${slug}">Start with this package</a>`;
    };
    finder.addEventListener('change', update);
    update();
  }

  document.querySelectorAll('[data-mini-demo]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const result = form.querySelector('.mini-result');
      if (result) result.textContent = form.dataset.success || 'That’s what your guests would see—simple, quick, and on brand.';
    });
  });
})();
