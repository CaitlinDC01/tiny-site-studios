(() => {
  const form = document.querySelector('[data-hashtag-form]');
  const results = document.querySelector('[data-results]');
  if (!form || !results) return;

  const storageKey = 'tssWeddingHashtagFavoritesV1';
  let favorites = new Set();
  try { const saved=JSON.parse(localStorage.getItem(storageKey)||'[]');if(Array.isArray(saved))favorites=new Set(saved.filter(tag=>typeof tag==='string'&&tag.startsWith('#')).slice(0,200)); } catch {}
  const saveFavorites=()=>{try{localStorage.setItem(storageKey,JSON.stringify([...favorites]));}catch{}};
  let state = null;

  const clean = (s='') => s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]/g,'');
  const cap = (s='') => {
    const x = clean(s);
    return x ? x.charAt(0).toUpperCase() + x.slice(1) : '';
  };
  const words = (s='') => s.split(/[^a-zA-Z0-9]+/).map(cap).filter(Boolean);
  const uniq = arr => [...new Set(arr.filter(Boolean).map(x => x.startsWith('#') ? x : '#' + x))];
  const shuffle = arr => [...arr].sort(() => Math.random() - .5);

  function getData() {
    const fd = new FormData(form);
    return {
      first1: cap(fd.get('first1') || ''),
      first2: cap(fd.get('first2') || ''),
      nick1: cap(fd.get('nick1') || ''),
      nick2: cap(fd.get('nick2') || ''),
      last1: cap(fd.get('last1') || ''),
      last2: cap(fd.get('last2') || ''),
      sharedLast: cap(fd.get('sharedLast') || ''),
      weddingDate: fd.get('weddingDate') || '',
      city: words(fd.get('city') || '').join(''),
      story: words(fd.get('story') || '').join(''),
      vibes: fd.getAll('vibe'),
      easySpell: fd.has('easySpell'),
      noCheese: fd.has('noCheese'),
      includeYear: fd.has('includeYear')
    };
  }

  function yearFrom(date) {
    return date ? date.slice(0,4) : '';
  }

  function buildIdeas(d) {
    const a = d.nick1 || d.first1;
    const b = d.nick2 || d.first2;
    const firstPair = a + 'And' + b;
    const firstPairReverse = b + 'And' + a;
    const initials = (a[0] || '') + (b[0] || '');
    const last = d.sharedLast || d.last2 || d.last1;
    const year = d.includeYear ? yearFrom(d.weddingDate) : '';
    const city = d.city;
    const story = d.story;

    const cleanIdeas = uniq([
      firstPair,
      firstPair + year,
      a + b,
      a + b + year,
      initials + 'GetMarried',
      initials + 'Wedding' + year,
      last && 'The' + last + 'Wedding',
      last && last + year,
      last && a + 'And' + b + last,
      city && firstPair + 'In' + city,
      city && a + b + city,
      firstPairReverse
    ]);

    const romantic = uniq([
      a + 'Found' + b,
      b + 'Found' + a,
      a + 'Loves' + b,
      b + 'Loves' + a,
      firstPair + 'Forever',
      a + 'And' + b + 'Forever',
      last && 'Forever' + last,
      last && 'LoveLooksLike' + last,
      'ToHaveAndToHold' + initials,
      a + 'Plus' + b + 'Always',
      city && 'LoveIn' + city,
      story && a + b + story
    ]);

    const cleverBase = [
      a + 'And' + b + 'SayIDo',
      a + 'And' + b + 'TieTheKnot',
      last && 'MeetThe' + last + 's',
      last && last + 'EverAfter',
      last && 'HappilyEver' + last,
      last && 'Going' + last,
      initials + 'MakeItOfficial',
      a + 'Got' + b,
      b + 'Got' + a,
      firstPair + 'AtLast',
      firstPair + 'ForReal',
      city && firstPair + 'Takes' + city
    ];
    const clever = uniq(d.noCheese ? [
      initials + 'MakeItOfficial',
      firstPair + 'AtLast',
      firstPair + 'ForReal',
      city && firstPair + 'In' + city,
      last && 'The' + last + 'Era'
    ] : cleverBase);

    const storyIdeas = uniq([
      story && a + 'And' + b + story,
      story && story + 'ToForever',
      story && initials + story + year,
      city && a + 'And' + b + 'In' + city,
      city && city + 'ToForever',
      city && initials + 'Take' + city,
      story && 'From' + story + 'ToIDo',
      story && last && story + 'WithThe' + last + 's'
    ]);

    const scored = uniq([...cleanIdeas, ...romantic, ...clever, ...storyIdeas]).map(tag => {
      let score = 0;
      const body = tag.slice(1);
      if (body.includes(a) && body.includes(b)) score += 5;
      if (last && body.includes(last)) score += 3;
      if (year && body.endsWith(year)) score += 1;
      if (city && body.includes(city)) score += 2;
      if (story && body.includes(story)) score += 3;
      if (d.easySpell && body.length <= 24) score += 3;
      if (d.easySpell && body.length > 32) score -= 3;
      if (d.noCheese && /TieTheKnot|SayIDo|HappilyEver/.test(body)) score -= 5;
      if (d.vibes.includes('romantic') && romantic.includes(tag)) score += 2;
      if ((d.vibes.includes('clever') || d.vibes.includes('funny') || d.vibes.includes('bold')) && clever.includes(tag)) score += 2;
      if ((d.vibes.includes('clean') || d.vibes.includes('elegant')) && cleanIdeas.includes(tag)) score += 2;
      return {tag, score};
    }).sort((x,y) => y.score - x.score);

    return {
      best: scored.slice(0,6).map(x => x.tag),
      clean: shuffle(cleanIdeas).slice(0,6),
      romantic: shuffle(romantic).slice(0,6),
      clever: shuffle(clever).slice(0,6),
      story: shuffle(storyIdeas).slice(0,6)
    };
  }

  function metaFor(tag, category, d) {
    const body = tag.slice(1);
    const flags = [];
    if (body.length <= 22) flags.push('short');
    if (d.sharedLast && body.includes(d.sharedLast)) flags.push('shared name');
    if (yearFrom(d.weddingDate) && body.includes(yearFrom(d.weddingDate))) flags.push('year');
    if (d.city && body.includes(d.city)) flags.push('destination');
    if (d.story && body.includes(d.story)) flags.push('personal');
    if (!flags.length) flags.push(category === 'clean' ? 'simple' : category);
    return flags.slice(0,2).join(' · ');
  }

  function renderCard(tag, category) {
    const card = document.createElement('article');
    card.className = 'hashtag-card';
    const fav = favorites.has(tag);
    card.innerHTML = '<div class="hashtag-value"></div><div class="hashtag-meta"></div><div class="hashtag-actions"><button type="button" data-copy>Copy</button><button type="button" data-favorite></button></div>';
    card.querySelector('.hashtag-value').textContent = tag;
    card.querySelector('.hashtag-meta').textContent = metaFor(tag, category, state);
    const favBtn = card.querySelector('[data-favorite]');
    favBtn.textContent = fav ? '♥ Saved' : '♡ Favorite';
    favBtn.classList.toggle('is-favorite', fav);

    card.querySelector('[data-copy]').addEventListener('click', async e => {
      const button = e.currentTarget;
      try {
        await navigator.clipboard.writeText(tag);
        button.textContent = 'Copied!';
        setTimeout(() => button.textContent = 'Copy', 1200);
      } catch {
        button.textContent = 'Select + copy';
      }
    });

    favBtn.addEventListener('click', () => {
      favorites.has(tag) ? favorites.delete(tag) : favorites.add(tag);
      saveFavorites();
      renderAll();
    });
    return card;
  }

  function renderCategory(name, ideas) {
    const grid = results.querySelector('[data-category="' + name + '"]');
    if (!grid) return;
    grid.innerHTML = '';
    ideas.forEach(tag => grid.appendChild(renderCard(tag, name)));
  }

  function renderFavorites() {
    const tray = results.querySelector('[data-favorite-tray]');
    const list = results.querySelector('[data-favorite-list]');
    const count = results.querySelector('[data-favorite-count]');
    const vals = [...favorites];
    tray.hidden = vals.length === 0;
    count.textContent = vals.length;
    list.innerHTML = '';
    vals.forEach(tag => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = tag + ' ×';
      btn.title = 'Remove favorite';
      btn.addEventListener('click', () => {
        favorites.delete(tag);
        saveFavorites();
        renderAll();
      });
      list.appendChild(btn);
    });
  }

  function renderAll() {
    if (!state) return;
    const ideas = buildIdeas(state);
    state.ideas = ideas;
    Object.entries(ideas).forEach(([name, vals]) => renderCategory(name, vals));
    results.querySelector('[data-story-section]').hidden = ideas.story.length === 0;
    renderFavorites();
  }

  function generate(scroll=true) {
    const d = getData();
    const error = form.querySelector('.form-error');
    if (!d.first1 || !d.first2) {
      error.textContent = 'Add both first names so we have something to work with.';
      return;
    }
    error.textContent = '';
    state = d;
    renderAll();
    results.hidden = false;
    results.querySelector('[data-results-title]').textContent = d.first1 + ' + ' + d.first2 + ', meet your hashtag shortlist.';
    const extras = [d.sharedLast && 'shared name', d.city && 'destination', d.story && 'couple detail'].filter(Boolean);
    results.querySelector('[data-results-intro]').textContent = extras.length
      ? 'We used your names plus your ' + extras.join(', ') + ' to make this batch more personal.'
      : 'We started with your names and vibe. Add a destination or “couple thing” above if you want even more personal options.';
    if (scroll) results.scrollIntoView({behavior:'smooth', block:'start'});
  }

  form.addEventListener('submit', e => { e.preventDefault(); generate(true); });
  results.querySelector('[data-regenerate]').addEventListener('click', () => { if(state){ renderAll(); } });
  results.querySelectorAll('[data-regenerate-category]').forEach(btn => btn.addEventListener('click', () => {
    if (!state) return;
    const name = btn.dataset.regenerateCategory;
    const ideas = buildIdeas(state);
    state.ideas[name] = ideas[name];
    renderCategory(name, ideas[name]);
  }));
  results.querySelector('[data-copy-favorites]').addEventListener('click', async e => {
    const button = e.currentTarget;
    const vals = [...favorites];
    if (!vals.length) { button.textContent = 'Favorite some first'; setTimeout(()=>button.textContent='Copy favorites',1400); return; }
    try {
      await navigator.clipboard.writeText(vals.join('\n'));
      button.textContent = 'Favorites copied!';
      setTimeout(()=>button.textContent='Copy favorites',1400);
    } catch {}
  });
})();