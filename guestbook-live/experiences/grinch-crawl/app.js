(() => {
  const root = document.querySelector('#app');
  const STORAGE_KEY = 'glx-grinch-live-demo';

  const event = {
    title: 'Grinch Bar Crawl',
    subtitle: 'Digital Passport',
    date: 'December 11, 2026',
    location: 'Downtown Navasota',
    organizer: 'WildFlyer Mead'
  };

  const stops = [
    {id:'wildflyer',number:1,name:'WildFlyer Mead',short:'WildFlyer',address:'Downtown Navasota · Railroad St.',featured:'Cranberry Cheer Mead',note:'Tart cranberry · warming spice · local honey',offer:'$1 off the featured pour',challenge:'Raise a glass beneath the holiday lights and snap a crawl photo.',prize:'Collect this stop stamp toward raffle qualification.',code:'GRINCH1'},
    {id:'red-board',number:2,name:'Red Board Tavern',short:'Red Board',address:'Downtown Navasota · Railroad St.',featured:'Merry Mule',note:'Ginger · lime · winter spice',offer:'Featured crawl bite with any drink',prize:'Complete the full passport to enter the WildFlyer raffle.',code:'GRINCH2'},
    {id:'hamers',number:3,name:'Hamer’s',short:'Hamer’s',address:'Downtown Navasota · Railroad St.',featured:'Holiday Old Fashioned',note:'Orange · cherry · aromatic bitters',offer:'Crawl-night featured menu',challenge:'Find the tiny gold star hidden near the bar.',prize:'A surprise venue prize may be announced by the host.',code:'GRINCH3'},
    {id:'rail-rye',number:4,name:'Rail & Rye',short:'Rail & Rye',address:'Downtown Navasota · Railroad St.',featured:'Evergreen Spritz',note:'Bright citrus · herbs · bubbles',offer:'Special crawl pricing on the featured sip',prize:'Your check-in counts toward the completion raffle.',code:'GRINCH4'},
    {id:'smoke-daddies',number:5,name:'Smoke Daddies',short:'Smoke Daddies',address:'Downtown Navasota · Washington Ave.',featured:'Mistletoe BBQ Slider',note:'Smoked brisket · cranberry glaze',offer:'One-night-only crawl snack',challenge:'Share your best “holiday mischief” pose to the Memory Wall.',prize:'A venue prize is announced separately by WildFlyer.',code:'GRINCH5'},
    {id:'portofinos',number:6,name:'Portofino’s',short:'Portofino’s',address:'Downtown Navasota · Washington Ave.',featured:'Peppermint Tiramisu',note:'Espresso · cocoa · peppermint',offer:'Complimentary festive garnish',prize:'Final stamp unlocks raffle qualification when all stops are complete.',code:'GRINCH6'}
  ];

  const seedMemories = [
    {id:'m1',type:'photo',author:'Maya + crew',caption:'First stop and already feeling festive.',time:'7:08 PM',src:'../../../assets/guestbook-live-gala-wall.jpg'},
    {id:'m2',type:'message',author:'Devon',caption:'The downtown lights, the mead, the music—such a fun night!',time:'7:24 PM'},
    {id:'m3',type:'video',author:'Table Seven',caption:'We found the holiday mischief.',time:'7:41 PM',src:'../../../weddings/assets/guestbook-live-cards.png'},
    {id:'m4',type:'audio',author:'Jess',caption:'A little voice note from Railroad Street',time:'8:02 PM'}
  ];

  let state = {
    participant: null,
    completed: [],
    checkins: {},
    challengeTime: null,
    tab: 'passport',
    screen: 'main',
    activeStop: null,
    scanned: false,
    modal: null,
    memoryType: 'photo',
    memories: [...seedMemories],
    error: ''
  };

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved) state = {...state, ...saved, tab:'passport', screen:'main', activeStop:null, modal:null, memories:[...seedMemories]};
  } catch (_) {}

  const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const brand = compact => `<div class="brand ${compact ? 'compact' : ''}"><div class="seal">GL</div><div><span>Guestbook Live</span><small>Experiences</small></div></div>`;
  const lights = () => `<div class="lights" aria-hidden="true">${Array.from({length:9},()=>'<i></i>').join('')}</div>`;
  const time = value => value ? new Intl.DateTimeFormat('en-US',{hour:'numeric',minute:'2-digit'}).format(new Date(value)) : '';
  const selectedStop = () => stops.find(stop => stop.id === state.activeStop);
  const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify({participant:state.participant,completed:state.completed,checkins:state.checkins,challengeTime:state.challengeTime}));

  function registration() {
    return `<div class="welcome">${lights()}${brand(false)}<div class="welcome-copy"><span class="event-date">${event.date} · ${event.location}</span><h1>${event.title}</h1><p class="passport-script">${event.subtitle}</p><p class="intro">Register once, visit each stop, scan to check in, complete your passport, and qualify for the raffle.</p></div><form class="register-card" data-form="register"><div class="form-head"><i>✦</i><div><b>Let’s get you on the list</b><span>Your passport stays with this device.</span></div></div><label class="field"><span>First + last name</span><input name="name" autocomplete="name" required placeholder="Caitlin Guest"></label><label class="field"><span>Email</span><input name="email" type="email" autocomplete="email" required placeholder="hello@example.com"></label><label class="field"><span>Mobile number</span><input name="phone" type="tel" autocomplete="tel" required placeholder="(936) 555-0123"></label><button class="primary" type="submit">Start my passport →</button><small>Prototype demo · No information is sent or saved online.</small></form><footer>Hosted by <b>${event.organizer}</b></footer></div>`;
  }

  function passport() {
    const count = state.completed.length;
    const next = stops.find(stop => !state.completed.includes(stop.id));
    const percent = Math.round(count / stops.length * 100);
    const firstName = esc(state.participant.name.split(' ')[0]);
    const cards = stops.map(stop => {
      const done = state.completed.includes(stop.id);
      const current = next && next.id === stop.id;
      return `<button class="stop-card ${done?'done':current?'current':''}" data-action="open-stop" data-stop="${stop.id}"><div class="stop-top"><span class="number">${done?'✓':stop.number}</span><span class="status ${done?'complete':current?'available':''}">${done?'Completed':current?'Available':'Not visited'}</span></div><div class="stop-copy"><b>${stop.short}</b><span>${stop.featured}</span></div>${done?'<span class="stamp">visited</span>':''}</button>`;
    }).join('');
    const challenge = count >= 2 && count < stops.length ? `<button class="challenge-alert" data-action="challenge"><i>!</i><span><small>Surprise alert</small><b>He’s been spotted downtown!</b><em>Open the Grinch challenge</em></span><b>›</b></button>` : '';
    return `<div class="view"><header class="view-title"><div><span class="eyebrow">${firstName}’s passport</span><h1>Crawl Passport</h1></div><span class="date-chip">DEC 11</span></header><section class="progress-card"><div class="progress-head"><div><span>Progress</span><strong>${count} of ${stops.length} stops</strong></div><strong>${percent}%</strong></div><div class="progress-track"><div class="progress-bar" style="width:${percent}%"></div></div><p>${count===0?'Your first holiday stamp is waiting.':count===stops.length?'Every stop is complete!':`${stops.length-count} stop${stops.length-count===1?'':'s'} left before raffle qualification.`}</p></section>${challenge}<div class="section-label"><b>Your stops</b><small>Tap a stop for details</small></div><div class="stops">${cards}</div><div class="scope-note"><b>Visits, not purchases.</b> The passport records stop check-ins. Event hosts handle purchase or challenge verification.</div></div>`;
  }

  function stopDetail() {
    const stop = selectedStop();
    const done = state.completed.includes(stop.id);
    const check = done ? `<span class="checked">✓ Checked in at ${time(state.checkins[stop.id])}</span>` : '';
    const challenge = stop.challenge ? `<section class="detail-block"><i class="detail-icon gold">✦</i><div><small>Optional challenge</small><h2>${stop.challenge}</h2><p>The event team confirms challenge completion separately.</p></div></section>` : '';
    return `<div><header class="sub-header"><button data-action="back-main" aria-label="Back to passport">←</button><span>Stop details</span><span>☆</span></header><div class="detail-hero"><span class="detail-number">${stop.number}</span><span class="eyebrow">Crawl stop</span><h1>${stop.name}</h1><p>⌖ ${stop.address}</p>${check}</div><div class="detail-list"><section class="detail-block"><i class="detail-icon">◆</i><div><small>Featured drink / food</small><h2>${stop.featured}</h2><p>${stop.note}</p></div></section><section class="detail-block"><i class="detail-icon red">✦</i><div><small>Special offer</small><h2>${stop.offer}</h2><p>Show this screen at the venue. Organizer terms apply.</p></div></section>${challenge}<section class="detail-block"><i class="detail-icon">☆</i><div><small>Prize information</small><h2>${stop.prize}</h2></div></section><button class="directions" data-action="directions"><span><b>Walking directions</b><small>Map link in the production version</small></span><b>›</b></button></div><div class="sticky"><button class="primary ${done?'':'red'}" data-action="start-checkin">${done?'✓ View completed check-in':'▣ Simulate venue QR scan'}</button></div></div>`;
  }

  function checkin() {
    const stop = selectedStop();
    if (!state.scanned) return `<div><header class="sub-header"><button data-action="back-detail">←</button><span>Venue check-in</span><span>▣</span></header><div class="scan"><div class="qr">▦</div><span class="eyebrow">Prototype scanner</span><h1>Scan the venue QR</h1><p>At the event, a unique QR code at ${stop.name} will open this stop automatically.</p><button class="primary" data-action="scan">Simulate QR scan</button><button class="secondary" data-action="back-detail">Cancel</button></div></div>`;
    return `<div><header class="sub-header"><button data-action="back-detail">←</button><span>Venue check-in</span><span>✓</span></header><div class="scan"><div class="success">✓</div><span class="eyebrow">QR recognized</span><h1>You’re at ${stop.name}</h1><p>Enter the short code shown at the venue to add this visit to your passport.</p><form class="code-form" data-form="checkin"><label class="field"><span>Venue code</span><input name="code" autocomplete="off" autocapitalize="characters" placeholder="${stop.code}" required></label>${state.error?`<p class="error">${state.error}</p>`:''}<button class="primary red" type="submit">Check in here →</button><p class="demo-code">Demo code: <b>${stop.code}</b></p></form></div></div>`;
  }

  function confirmation() {
    const stop = selectedStop();
    const repeated = !state.justCompleted;
    return `<div class="confirm"><div class="success">✓</div><span class="eyebrow">Passport updated</span><h1>${repeated?'Already checked in':'Stop Complete!'}</h1><p><b>${stop.name} · ${state.completed.length} of ${stops.length}</b></p><div class="mini-stamp">${stop.number}</div><p>${repeated?'Repeated check-ins never add duplicate progress.':'Your visit timestamp has been recorded and your passport stamp is in place.'}</p><button class="primary" data-action="confirm-return">${state.completed.length===stops.length?'See my completion':'Back to passport →'}</button></div>`;
  }

  function mapView() {
    const nodes = stops.map((stop,index)=>`<button class="map-stop s${index+1} ${state.completed.includes(stop.id)?'done':''}" data-action="open-stop" data-stop="${stop.id}"><b>${state.completed.includes(stop.id)?'✓':stop.number}</b><small>${stop.short}</small></button>`).join('');
    const list = stops.map(stop=>`<button class="route-row" data-action="open-stop" data-stop="${stop.id}"><i>${state.completed.includes(stop.id)?'✓':stop.number}</i><span><b>${stop.name}</b><small>${stop.address}</small></span><b>›</b></button>`).join('');
    return `<div class="view"><header class="view-title"><div><span class="eyebrow">Downtown Navasota</span><h1>Crawl Route</h1></div><span>⌖</span></header><p class="view-intro">Six walkable stops along Railroad Street and Washington Avenue.</p><div class="route-map"><span class="street rail">Railroad Street</span><span class="street wash">Washington Ave.</span><div class="route-line h"></div><div class="route-line v"></div>${nodes}</div><p class="map-note">Illustrated crawl route · not necessarily to scale</p><div class="route-list">${list}</div></div>`;
  }

  function memoryCard(memory) {
    let media = '';
    if (memory.type === 'photo') media = `<img src="${esc(memory.src)}" alt="Guestbook Live sample crawl memory">`;
    if (memory.type === 'video') media = memory.src ? `<img src="${esc(memory.src)}" alt="Guestbook Live sample video memory">` : '<div class="media-placeholder">Video memory</div>';
    if (memory.type === 'audio') media = '<div class="media-placeholder">Voice note · 0:18</div>';
    return `<article class="memory ${memory.type}">${media}<div class="memory-body"><p>${esc(memory.caption)}</p><span><b>${esc(memory.author)}</b> · ${esc(memory.time)}</span></div></article>`;
  }

  function wallView() {
    return `<div class="view"><header class="view-title"><div><span class="eyebrow">Guestbook Live</span><h1>Memory Wall</h1></div><span>▧</span></header><p class="view-intro">The passport tracks the crawl. The wall keeps the night.</p><button class="primary drop" data-action="memory">＋ Drop a memory</button><div class="memory-types"><span>Photo</span><span>Video</span><span>Audio</span><span>Note</span></div><div class="memory-grid">${state.memories.map(memoryCard).join('')}</div><div class="moderation"><b>Prototype Memory Wall</b><br>In production, organizers can approve what appears publicly.</div></div>`;
  }

  function organizer() {
    const rows = stops.map(stop=>`<div><span>${stop.short}</span><time>${state.checkins[stop.id]?time(state.checkins[stop.id]):'Not visited'}</time></div>`).join('');
    return `<section class="organizer"><header><small>Simulated organizer view</small><h2>Participant record</h2></header><div class="participant"><b>${esc(state.participant.name)}</b><span>${esc(state.participant.email)}</span><span>${esc(state.participant.phone)}</span></div><div class="stats"><div><b>${state.completed.length}/${stops.length}</b><small>Stops</small></div><div><b>${state.completed.length===stops.length?'Yes':'No'}</b><small>Raffle qualified</small></div><div><b>${state.challengeTime?'Yes':'—'}</b><small>Challenge</small></div></div><div class="times">${rows}</div><footer>WildFlyer conducts the prize drawing and confirms challenge validity separately.</footer></section>`;
  }

  function moreView() {
    return `<div class="view more"><header class="view-title"><div><span class="eyebrow">Plan your crawl</span><h1>More</h1></div><span>☰</span></header><div class="more-card"><i>i</i><div><small>Event information</small><h2>${event.title}</h2><p>${event.date} · ${event.location}<br>Hosted by ${event.organizer}</p></div></div><h3>Helpful details</h3><details open><summary>How it works</summary><ol><li>Choose a stop and view its featured special.</li><li>Scan the venue QR, then enter its short code.</li><li>Watch your passport update immediately.</li><li>Complete all six stops to become raffle qualified.</li></ol></details><details><summary>Prizes + raffle</summary><p>Completing the passport adds your contact information to the eligible participant list. Guestbook Live does not select the raffle winner.</p></details><details><summary>Participating businesses</summary><p>${stops.map(stop=>stop.name).join(' · ')}. Final locations and offers are still to be confirmed.</p></details>${organizer()}<button class="secondary reset" data-action="reset">↺ Reset prototype</button></div>`;
  }

  function completion() {
    const first = esc(state.participant.name.split(' ')[0]);
    return `<div class="complete">${lights()}<span class="eyebrow">Passport complete</span><div class="trophy">☆</div><h1>Raffle Qualified!</h1><p>Way to go, ${first}—all six stops are stamped.</p><div class="qualified"><i>✓</i><div><b>You’re on the eligible participant list.</b><span>WildFlyer will conduct the prize drawing separately. Guestbook Live does not automatically choose a winner.</span></div></div><div class="stamp-row">${stops.map(stop=>`<span>✓${stop.number}</span>`).join('')}</div><button class="primary" data-action="complete-wall">Share your memories</button><button class="secondary" data-action="complete-passport">View completed passport</button></div>`;
  }

  function bottomNav() {
    const items = [['passport','✓','Passport'],['map','⌖','Map'],['wall','▧','Wall'],['more','☰','More']];
    return `<nav class="bottom-nav" aria-label="Primary navigation">${items.map(([id,icon,label])=>`<button class="${state.tab===id?'active':''}" data-action="tab" data-tab="${id}"><i>${icon}</i><span>${label}</span></button>`).join('')}</nav>`;
  }

  function challengeModal() {
    if (state.challengeTime) return `<div class="modal"><section class="modal-card"><button class="icon-button close" data-action="close-modal">×</button><h2>The Grinch has escaped!</h2><p>He’s been spotted somewhere downtown. Find him before he disappears!</p><div class="challenge-done"><b>✓ Entry recorded</b><span>${time(state.challengeTime)} · WildFlyer will confirm valid entries.</span></div></section></div>`;
    return `<div class="modal"><section class="modal-card"><button class="icon-button close" data-action="close-modal">×</button><h2>The Grinch has escaped!</h2><p>He’s been spotted somewhere downtown. Find him before he disappears!</p><div class="choice"><button data-action="challenge-method" data-method="scan" class="${state.challengeMethod!=='photo'?'active':''}">Scan special QR</button><button data-action="challenge-method" data-method="photo" class="${state.challengeMethod==='photo'?'active':''}">Submit a photo</button></div>${state.challengeMethod==='photo'?'<label class="upload"><b>Choose a Grinch sighting photo</b><small>Prototype records the timestamp only.</small><input type="file" accept="image/*"></label>':''}<button class="primary red" data-action="complete-challenge">${state.challengeMethod==='photo'?'Record photo entry':'Simulate Grinch QR'}</button><p>No automatic judging. WildFlyer determines the first 10 valid entries.</p></section></div>`;
  }

  function memoryModal() {
    const choices = ['photo','video','audio','message'].map(type=>`<button data-action="memory-type" data-type="${type}" class="${state.memoryType===type?'active':''}">${type[0].toUpperCase()+type.slice(1)}</button>`).join('');
    const upload = state.memoryType !== 'message' ? `<label class="upload"><b>Choose a ${state.memoryType}</b><small>Prototype upload stays in this browser session.</small><input name="media" type="file" accept="${state.memoryType==='photo'?'image/*':state.memoryType==='video'?'video/*':'audio/*'}"></label>` : '';
    return `<div class="modal"><section class="modal-card"><button class="icon-button close" data-action="close-modal">×</button><h2>Drop a memory</h2><p>Share a moment from the crawl with the event Memory Wall.</p><div class="choice">${choices}</div><form data-form="memory">${upload}<label class="field"><span>Caption or message</span><textarea name="caption" ${state.memoryType==='message'?'required':''} placeholder="${state.memoryType==='message'?'Leave a note for the wall…':'Add a caption…'}"></textarea></label><button class="primary" type="submit">Add to Memory Wall</button></form></section></div>`;
  }

  function renderMain() {
    if (state.screen === 'detail') return stopDetail();
    if (state.screen === 'checkin') return checkin();
    if (state.screen === 'confirm') return confirmation();
    if (state.screen === 'complete') return completion();
    if (state.tab === 'map') return mapView();
    if (state.tab === 'wall') return wallView();
    if (state.tab === 'more') return moreView();
    return passport();
  }

  function render() {
    if (!state.participant) { root.innerHTML = registration(); return; }
    const detail = ['detail','checkin','confirm','complete'].includes(state.screen);
    root.innerHTML = `<div class="app-shell">${state.screen==='complete'?'':`<header class="app-header">${brand(true)}<button class="icon-button" data-action="info" aria-label="Event information">i</button></header>`}<div class="app-body">${renderMain()}</div>${!detail?bottomNav():''}${state.modal==='challenge'?challengeModal():state.modal==='memory'?memoryModal():''}</div>`;
  }

  root.addEventListener('click', e => {
    const button = e.target.closest('[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'tab') { state.tab = button.dataset.tab; state.screen = 'main'; state.activeStop = null; }
    if (action === 'info') { state.tab = 'more'; state.screen = 'main'; state.activeStop = null; }
    if (action === 'open-stop') { state.activeStop = button.dataset.stop; state.screen = 'detail'; }
    if (action === 'back-main') { state.activeStop = null; state.screen = 'main'; }
    if (action === 'start-checkin') { state.scanned = state.completed.includes(state.activeStop); state.justCompleted = false; state.screen = state.completed.includes(state.activeStop) ? 'confirm' : 'checkin'; }
    if (action === 'back-detail') { state.screen = 'detail'; state.scanned = false; state.error = ''; }
    if (action === 'scan') { state.scanned = true; }
    if (action === 'confirm-return') { state.activeStop = null; state.screen = state.completed.length === stops.length ? 'complete' : 'main'; state.tab = 'passport'; }
    if (action === 'challenge') { state.modal = 'challenge'; state.challengeMethod = 'scan'; }
    if (action === 'challenge-method') { state.challengeMethod = button.dataset.method; }
    if (action === 'complete-challenge') { state.challengeTime = new Date().toISOString(); save(); }
    if (action === 'memory') { state.modal = 'memory'; state.memoryType = 'photo'; }
    if (action === 'memory-type') { state.memoryType = button.dataset.type; }
    if (action === 'close-modal') { state.modal = null; }
    if (action === 'complete-wall') { state.screen = 'main'; state.tab = 'wall'; }
    if (action === 'complete-passport') { state.screen = 'main'; state.tab = 'passport'; }
    if (action === 'directions') alert('Walking directions will open the venue’s map link in the production event.');
    if (action === 'reset') { if (confirm('Reset this prototype and clear the simulated participant?')) { localStorage.removeItem(STORAGE_KEY); state.participant = null; state.completed = []; state.checkins = {}; state.challengeTime = null; state.tab = 'passport'; state.screen = 'main'; } }
    render();
  });

  root.addEventListener('submit', e => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    if (form.dataset.form === 'register') {
      state.participant = {name:String(data.get('name')||''),email:String(data.get('email')||''),phone:String(data.get('phone')||'')};
      save(); state.tab = 'passport'; state.screen = 'main';
    }
    if (form.dataset.form === 'checkin') {
      const stop = selectedStop();
      if (String(data.get('code')||'').trim().toUpperCase() !== stop.code) { state.error = `Try the demo code ${stop.code}`; render(); return; }
      state.justCompleted = !state.completed.includes(stop.id);
      if (state.justCompleted) { state.completed.push(stop.id); state.checkins[stop.id] = new Date().toISOString(); save(); }
      state.error = ''; state.screen = 'confirm';
    }
    if (form.dataset.form === 'memory') {
      const file = data.get('media');
      const memory = {id:`memory-${Date.now()}`,type:state.memoryType,author:state.participant.name,caption:String(data.get('caption')||`${state.memoryType} memory from the crawl`),time:'Just now'};
      if (file instanceof File && file.size && ['photo','video'].includes(state.memoryType)) memory.src = URL.createObjectURL(file);
      state.memories.unshift(memory); state.modal = null; state.tab = 'wall'; state.screen = 'main';
    }
    render();
  });

  render();
})();
