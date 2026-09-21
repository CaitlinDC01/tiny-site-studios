(() => {
  const menu = document.querySelector('.mobile-menu');
  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { menu.open = false; }));
  const mobileStart = document.querySelector('.mobile-start');
  const hero = document.querySelector('.hero');
  if (mobileStart && hero && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => { mobileStart.classList.toggle('visible', !entry.isIntersecting); }, { threshold: 0.1 });
    observer.observe(hero);
  }
})();
