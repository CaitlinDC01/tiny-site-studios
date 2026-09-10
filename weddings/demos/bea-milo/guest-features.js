(() => {
  const data = window.BEA_GUEST_DATA;
  const escape = (value) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
  document.querySelector('#dinner-menu').innerHTML = data.menu.map(group => `<article><h3>${escape(group.title)}</h3>${group.items.map(item => `<div class="menu-item"><strong>${escape(item.name)}</strong>${item.description ? `<p>${escape(item.description)}</p>` : ''}</div>`).join('')}</article>`).join('');
  const result = document.querySelector('#seat-result');
  const showSeat = guest => {
    result.innerHTML = `<article class="seat-found"><span class="eyebrow dark">We saved you a place, ${escape(guest.names[0])}</span><h3>Table ${escape(guest.table)}</h3><strong>${escape(guest.tableName)}</strong><p>${escape(guest.locationHint)}</p><details><summary>Who’s at my table?</summary><p>${guest.companions.map(escape).join(' · ')}</p></details><a href="#menu">Take a peek at the menu ↓</a></article>`;
  };
  document.querySelector('#seat-form').addEventListener('submit', event => {
    event.preventDefault();
    const query = normalize(document.querySelector('#seat-name').value);
    if(query.length < 2) {result.textContent = 'Please enter at least two letters of your name.';return;}
    const matches = data.seats.filter(guest => guest.names.some(name => normalize(name).includes(query)));
    const exact = matches.find(guest => guest.names.some(name => normalize(name) === query));
    if(exact || matches.length === 1) showSeat(exact || matches[0]);
    else if(!matches.length) result.innerHTML = '<p class="seat-found">We couldn’t find that name. Try a first or last name from the sample list, or ask a member of the wedding party.</p>';
    else {
      result.innerHTML = '<p>Which guest are you?</p>';
      matches.forEach(guest => {const button = document.createElement('button');button.type = 'button';button.className = 'guest-match';button.textContent = guest.names[0];button.addEventListener('click', () => showSeat(guest));result.append(button);});
    }
  });
  document.querySelector('#seat-name').addEventListener('input', () => {result.replaceChildren();});
  const djForm = document.querySelector('#dj-form');
  djForm.addEventListener('submit', event => {
    event.preventDefault();
    const values = new FormData(djForm);
    if(!String(values.get('guest')).trim() || !String(values.get('song')).trim()) {djForm.querySelector('[name="song"]').setCustomValidity('Please enter a song and your name.');djForm.reportValidity();return;}
    const status = document.querySelector('#dj-result');
    status.hidden = false;status.textContent = 'Your sample request is on the list below. Nothing was sent to a DJ.';
    const item = document.createElement('li');item.textContent = `${values.get('song')}${String(values.get('artist')).trim() ? ' — '+values.get('artist') : ''} · requested by ${values.get('guest')}`;
    document.querySelector('#song-queue').prepend(item);djForm.reset();
  });
  djForm.addEventListener('input', () => djForm.querySelector('[name="song"]').setCustomValidity(''));
  const rsvpForm = document.querySelector('#rsvp-form');
  const fields = document.querySelector('#attending-fields');
  const setAttendance = () => {const no = rsvpForm.elements.attendance.value === 'no';fields.hidden = no;fields.querySelectorAll('input, select, textarea').forEach(el => el.disabled = no);};
  rsvpForm.addEventListener('change', setAttendance);
  rsvpForm.addEventListener('submit', event => {
    event.preventDefault();const values = new FormData(rsvpForm);const attending = values.get('attendance') === 'yes';
    const status = document.querySelector('#rsvp-result');
    status.innerHTML = `<p class="eyebrow dark">Your sample RSVP</p><h3>${attending ? 'We’d love to see you there.' : 'You’ll be with us in spirit.'}</h3><p>${escape(values.get('name'))} · ${attending ? `Accepts for ${escape(values.get('count'))} · ${escape(values.get('meal'))}` : 'Regretfully declines'}</p><p>Preview complete. Nothing was sent or saved.</p><button class="wedding-button" type="button">Try again</button>`;
    rsvpForm.hidden = true;status.hidden = false;status.focus();
    status.querySelector('button').addEventListener('click', () => {rsvpForm.reset();setAttendance();rsvpForm.hidden = false;status.hidden = true;rsvpForm.elements.name.focus();});
  });
  let missionIndex = 0;
  const showMission = () => {const mission = data.challenges[missionIndex];document.querySelector('#mission-type').textContent = `${mission.format} · ${missionIndex+1} / ${data.challenges.length}`;document.querySelector('#mission-prompt').textContent = mission.prompt;document.querySelector('#mission-hint').textContent = mission.hint;};
  document.querySelector('#mission-prompt').setAttribute('aria-live', 'polite');
  document.querySelector('#next-mission').addEventListener('click', () => {missionIndex = (missionIndex+1) % data.challenges.length;showMission();});showMission();
})();
