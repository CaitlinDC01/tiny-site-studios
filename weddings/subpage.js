(() => {
  const packageNames = { 'seating-studio': 'Seating Studio · $29', custom: 'A custom mix of services', 'wedding-party': 'Wedding Party Site · $39', 'rsvp-only': 'RSVP Only · $29', 'save-the-date-only': 'Save-the-Date Only · $29', 'invitation-only': 'Digital Invitation Only · $39', essentials: 'Essentials · $99', signature: 'Signature · $149', 'wedding-hub': 'Wedding Hub · $199', 'full-experience': 'Full Experience · $249' };
  const selected = new URLSearchParams(location.search).get('package');
  const output = document.querySelector('[data-selected-package]');
  if (output && selected && packageNames[selected]) output.textContent = packageNames[selected];

  const finder = document.querySelector('[data-package-finder]');
  if (finder) {
    const result = finder.querySelector('[data-finder-result]');
    const update = () => {
      const values = [...finder.querySelectorAll('input:checked')].map((input) => input.value);
      const action = (url, label) => `<a class="pill pill-light" href="${url}">${label}</a>`;
      const choice = (slug, extras=[]) => {
        result.innerHTML = `<p>Your starting point:</p><strong>${packageNames[slug]}</strong>${extras.length ? `<p>Optional additions: ${extras.join(' · ')}</p>` : ''}${action('/weddings/start/?package='+slug,'Ask about this option')}`;
      };
      if (!values.length) { result.innerHTML = '<p>Choose the features you want above.</p><strong>We’ll help you find a starting point.</strong>'; return; }
      const hasSiteContent = values.some(value=>['core','travel','faq','story','weekend','live-itinerary','seat-finder','dj','updates'].includes(value));
      if (!hasSiteContent) {
        const standalone = [];
        if (values.includes('party-guide')) standalone.push('wedding-party');
        if (values.includes('save-the-date')) standalone.push('save-the-date-only');
        if (values.includes('invitation')) standalone.push('invitation-only');
        if (values.includes('rsvp') || values.includes('meals')) standalone.push('rsvp-only');
        if (values.includes('seating')) standalone.push('seating-studio');
        if (standalone.length===1 && !values.includes('guestbook')) { choice(standalone[0]); return; }
        result.innerHTML = `<p>${standalone.length || !values.includes('guestbook') ? 'Standalone services may be all you need:' : 'Your starting point:'}</p><strong>${standalone.map(slug=>packageNames[slug]).concat(values.includes('guestbook')?['Guestbook Live']:[]).join('<br>')}</strong><p>You can choose these without buying a complete wedding website.</p>${standalone.length?action('/weddings/start/?package=custom','Ask about these services'):''}${values.includes('guestbook')?action('https://guestbook-live.com/','Explore Guestbook Live'):''}`;
        return;
      }
      const tools=values.filter(value=>['seat-finder','dj','updates'].includes(value));
      let slug='essentials';
      if(values.some(value=>['rsvp','meals','travel','faq','story'].includes(value)))slug='signature';
      if(values.includes('weekend')||tools.length)slug='wedding-hub';
      if(values.includes('live-itinerary')||tools.length>=3)slug='full-experience';
      const extras=[];
      if(slug==='wedding-hub'&&tools.length>1)extras.push('1 additional standard guest tool · $19');
      if(values.includes('party-guide')&&slug!=='full-experience')extras.push('Wedding Party Site · $39');
      if(values.includes('seating'))extras.push('Seating Studio · $29');
      if(values.includes('guestbook'))extras.push(['wedding-hub','full-experience'].includes(slug)?'Guestbook Live · $39, or $19 when replacing an included standard tool':'Guestbook Live · $39');
      if(values.includes('save-the-date'))extras.push('Save-the-Date · $29');
      if(values.includes('invitation'))extras.push('Digital Invitation · $39');
      choice(slug,extras);
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
    const directLink = previewDialog.querySelector('[data-preview-link]');
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
        directLink.href = button.dataset.livePreview;
        frame.title = button.dataset.previewTitle || 'Wedding feature demo';
        frame.src = button.dataset.livePreview;
        previewDialog.showModal();
      });
    });
    previewDialog.querySelector('[data-preview-close]').addEventListener('click', close);
    previewDialog.addEventListener('close',()=>{frame.removeAttribute('src');loading.hidden=false;frame.hidden=true});
    previewDialog.addEventListener('click', (event) => {
      if (event.target === previewDialog) close();
    });
  }
})();
