(() => {
  const buttons = document.querySelectorAll('.print-action');
  if (!buttons.length) return;

  function cleanup(state) {
    document.body.classList.remove('print-one', 'print-all-resources');
    document.querySelectorAll('.print-selected').forEach(el => el.classList.remove('print-selected'));
    state?.details?.forEach(({el, open}) => { el.open = open; });
  }

  function openDetails(root) {
    const details = [...root.querySelectorAll('details')];
    return details.map(el => {
      const open = el.open;
      el.open = true;
      return {el, open};
    });
  }

  function printTarget(target) {
    const all = target === 'all';
    const root = all ? document.querySelector('.planning-library') : document.getElementById(target);
    if (!root) return;

    const state = { details: openDetails(root) };
    if (all) {
      document.body.classList.add('print-all-resources');
    } else {
      document.body.classList.add('print-one');
      root.classList.add('print-selected');
    }

    let cleaned = false;
    const finish = () => {
      if (cleaned) return;
      cleaned = true;
      cleanup(state);
      window.removeEventListener('afterprint', finish);
    };

    window.addEventListener('afterprint', finish, { once: true });
    requestAnimationFrame(() => requestAnimationFrame(() => window.print()));
    setTimeout(finish, 30000);
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => printTarget(button.dataset.printTarget));
  });
})();