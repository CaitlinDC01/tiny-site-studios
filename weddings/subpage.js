(() => {
  const packageNames = { 'wedding-party': 'Wedding Party Site · $39', 'rsvp-only': 'RSVP Only · $29', 'save-the-date-only': 'Save-the-Date Only · $29', 'invitation-only': 'Digital Invitation Only · $39', essentials: 'Essentials · $99', signature: 'Signature · $149', 'wedding-hub': 'Wedding Hub · $199', 'full-experience': 'Full Experience · $249' };
  const selected = new URLSearchParams(location.search).get('package');
  const output = document.querySelector('[data-selected-package]');
  if (output && selected && packageNames[selected]) output.textContent = packageNames[selected];

  const finder = document.querySelector('[data-package-finder]');
  if (finder) {
    const result = finder.querySelector('[data-finder-result]');
    const update = () => {
      const values = [...finder.querySelectorAll('input:checked')].map((input) => input.value);
      let slug = 'essentials';
      if (values.length === 1 && values.includes('party-guide')) slug = 'wedding-party';
      else if (values.length === 1 && values.includes('save-the-date')) slug = 'save-the-date-only';
      else if (values.length === 1 && values.includes('invitation')) slug = 'invitation-only';
      else if (values.length && values.every((value) => ['rsvp','meals'].includes(value))) slug = 'rsvp-only';
      else {
        if (values.some((value) => ['rsvp','meals','travel','faq','story'].includes(value))) slug = 'signature';
        if (values.some((value) => ['weekend','seat-finder','dj','updates','seating'].includes(value))) slug = 'wedding-hub';
        const tools = values.filter((value) => ['seat-finder','dj','updates','seating','guestbook'].includes(value)).length;
        if (tools >= 2 || values.includes('live-itinerary') || values.includes('party-guide')) slug = 'full-experience';
      }
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

  const previewDialog = document.querySelector('[data-preview-dialog]');
  if (previewDialog) {
    const frame = previewDialog.querySelector('[data-preview-frame]');
    const heading = previewDialog.querySelector('[data-preview-heading]');
    const loading = previewDialog.querySelector('[data-preview-loading]');
    const close = () => {
      previewDialog.close();
      frame.removeAttribute('src');
      loading.hidden = false;
      frame.hidden = true;
    };
    frame.hidden = true;
    frame.addEventListener('load', () => {
      loading.hidden = true;
      frame.hidden = false;
    });
    document.querySelectorAll('[data-live-preview]').forEach((button) => {
      button.addEventListener('click', () => {
        heading.textContent = button.dataset.previewTitle || 'Live feature example';
        loading.hidden = false;
        frame.hidden = true;
        frame.src = button.dataset.livePreview;
        previewDialog.showModal();
      });
    });
    previewDialog.querySelector('[data-preview-close]').addEventListener('click', close);
    previewDialog.addEventListener('click', (event) => {
      if (event.target === previewDialog) close();
    });
  }
})();
