(() => {
  const button = document.querySelector('.menu-button');
  const menu = document.querySelector('#main-menu');
  if (button && menu) {
    const close = (returnFocus = false) => {
      menu.classList.remove('open');
      button.setAttribute('aria-expanded', 'false');
      if (returnFocus) button.focus();
    };
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      menu.classList.toggle('open', open);
      button.setAttribute('aria-expanded', String(open));
    });
    menu.addEventListener('click', (event) => { if (event.target.closest('a')) close(); });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') close(true);
    });
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.nav-row')) close();
    });
    document.addEventListener('focusin', (event) => {
      if (!event.target.closest('.nav-row')) close();
    });
    const desktop = matchMedia('(min-width: 951px)');
    desktop.addEventListener('change', () => close());
  }
  const filters = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('[data-category]')];
  if (filters.length) {
    const apply = (category) => {
      const selected = filters.some(filter => filter.dataset.filter === category) ? category : 'all';
      let count = 0;
      cards.forEach(card => {
        card.hidden = selected !== 'all' && card.dataset.category !== selected;
        if (!card.hidden) count++;
      });
      filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter.dataset.filter === selected)));
      document.querySelector('#filter-status').textContent = `${count} ${count === 1 ? 'project' : 'projects'} · ${filters.find(filter => filter.dataset.filter === selected).textContent}`;
    };
    filters.forEach(filter => filter.addEventListener('click', () => {
      apply(filter.dataset.filter);
      const url = new URL(location.href);
      if (filter.dataset.filter === 'all') url.searchParams.delete('category');
      else url.searchParams.set('category', filter.dataset.filter);
      history.replaceState(null, '', url);
    }));
    apply(new URLSearchParams(location.search).get('category'));
    addEventListener('popstate', () => apply(new URLSearchParams(location.search).get('category')));
  }
})();
