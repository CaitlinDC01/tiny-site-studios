
(() => {
  const form = document.querySelector('[data-planner-form]');
  if (!form) return;

  const panels = [...form.querySelectorAll('.step-panel')];
  const progress = document.querySelector('.progress-bar');
  const steps = [...document.querySelectorAll('.step-list li')];
  const error = document.querySelector('.planner-error');
  const shell = document.querySelector('.planner-shell');
  const results = document.querySelector('.results-wrap');
  let current = 0;

  const $ = (name) => form.elements[name];
  const checked = (name) => [...form.querySelectorAll(`input[name="${name}"]:checked`)].map(el => el.value);
  const value = (name) => {
    const field = $(name);
    return field ? String(field.value || '').trim() : '';
  };
  const radio = (name) => form.querySelector(`input[name="${name}"]:checked`)?.value || '';

  function show(index) {
    current = Math.max(0, Math.min(index, panels.length - 1));
    panels.forEach((p, i) => p.hidden = i !== current);
    steps.forEach((s, i) => {
      s.classList.toggle('active', i === current);
      s.classList.toggle('done', i < current);
    });
    if (progress) progress.style.width = `${((current + 1) / panels.length) * 100}%`;
    if (error) error.textContent = '';
    window.scrollTo({top: shell.offsetTop, behavior:'smooth'});
  }

  function validateStep() {
    const panel = panels[current];
    const requiredRadio = panel.querySelector('[data-required-radio]');
    if (requiredRadio) {
      const name = requiredRadio.dataset.requiredRadio;
      if (!radio(name)) return 'Choose the option that fits you best.';
    }
    const requiredFields = [...panel.querySelectorAll('[required]')];
    for (const field of requiredFields) {
      if (!field.value.trim()) return 'Fill in the required field before continuing.';
    }
    return '';
  }

  form.addEventListener('click', (event) => {
    const next = event.target.closest('[data-next]');
    const back = event.target.closest('[data-back]');
    if (next) {
      const message = validateStep();
      if (message) { error.textContent = message; return; }
      if (current === panels.length - 1) {
        buildPlan();
      } else {
        show(current + 1);
      }
    }
    if (back) show(current - 1);
  });

  const dateModeInputs = form.querySelectorAll('input[name="dateStatus"]');
  const dateFields = document.querySelector('[data-date-fields]');
  const seasonFields = document.querySelector('[data-season-fields]');
  dateModeInputs.forEach(input => input.addEventListener('change', () => {
    const hasDate = radio('dateStatus') === 'yes';
    dateFields.hidden = !hasDate;
    seasonFields.hidden = hasDate;
    dateFields.querySelector('input').required = hasDate;
  }));

  function monthsUntil(dateString) {
    if (!dateString) return null;
    const target = new Date(dateString + 'T12:00:00');
    if (Number.isNaN(target.getTime())) return null;
    const now = new Date();
    return Math.max(0, Math.round((target - now) / 2629800000));
  }

  function prettyDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString + 'T12:00:00');
    return new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric'}).format(date);
  }

  function priorityLabel(key) {
    const labels = {
      photos:'Photography / video', food:'Food + drinks', venue:'Venue / setting', music:'Music + party',
      florals:'Flowers + décor', attire:'Attire + beauty', guest:'Guest experience', lowstress:'Keeping planning low-stress'
    };
    return labels[key] || key;
  }

  function completedSet() { return new Set(checked('completed')); }

  function planLogic() {
    const hasDate = radio('dateStatus') === 'yes';
    const months = hasDate ? monthsUntil(value('weddingDate')) : null;
    const done = completedSet();
    const priorities = checked('priorities').map(priorityLabel);
    const moves = [];
    const wait = [];
    const timeline = [];
    const add = (key, text) => { if (!done.has(key) && moves.length < 5) moves.push(text); };

    if (!hasDate) {
      add('budget','Choose a comfortable budget range before you fall in love with options that do not fit it.');
      add('guestlist','Draft a rough guest-count range. You do not need names yet—just know whether this is closer to 50, 100, or 200 people.');
      add('venue','Decide what kind of setting and season you want, then start looking at venue availability.');
      add('date','Use venue availability, must-have people, and your preferred season to narrow down a wedding date.');
      add('planner','Decide whether you want a planner, partial planner, or mostly-DIY approach so you know who owns the next decisions.');
      if (moves.length < 5) add('photographer','Start a short inspiration list of photographers or vendors whose work feels like you.');
      wait.push('Formal invitations and final stationery','Seating charts and place cards','Favors and tiny décor details','Final menu selections','Wedding-day signage');
      timeline.push({label:'Right now',items:['Budget range','Rough guest count','Venue + season research','Decide how much planning help you want']});
      timeline.push({label:'Once you have a date',items:['Book your highest-priority vendors','Create your wedding website / guest-info home base','Begin travel planning if guests will be coming from out of town']});
    } else if (months !== null && months <= 3) {
      add('venue','Lock in your ceremony and reception location immediately if they are not already booked.');
      add('vendors','Confirm the essential vendors you still need: photography, food, music, officiant, rentals, and coordination.');
      add('guestlist','Finalize your guest list and get invitations or digital invitations moving now.');
      add('website','Set up one clear guest-information hub for RSVPs, schedule, travel, and updates.');
      add('timeline','Create the working wedding-day timeline and assign who is responsible for each moving part.');
      if (moves.length < 5) add('attire','Finish attire, alterations, and beauty appointments with firm deadlines.');
      wait.push('Elaborate favors','Extra DIY décor projects','Optional signage that guests do not need','Anything you are adding only because social media says you should');
      timeline.push({label:'This week',items:['Book missing essentials','Finalize guest communication','Confirm attire deadlines']});
      timeline.push({label:'Next 30 days',items:['Collect RSVPs','Build seating plan','Confirm menu and rentals','Create day-of timeline']});
      timeline.push({label:'Final 2 weeks',items:['Send final counts','Confirm every vendor','Pack details and emergency items','Stop adding new projects']});
    } else if (months !== null && months <= 6) {
      add('venue','Confirm your venue and date if either is still open.');
      add('vendors','Book the vendors that matter most to you before availability tightens.');
      add('guestlist','Get your working guest list into one place and confirm addresses/contact information.');
      add('website','Create your wedding website or guest-info hub so future details have one home.');
      add('attire','Order or finalize attire with enough time for alterations.');
      wait.push('Final seating assignments','Wedding favors','Final signage wording','Tiny décor purchases','Day-of emergency kit');
      timeline.push({label:'Now',items:['Venue + key vendors','Guest list','Attire','Wedding website']});
      timeline.push({label:'3–4 months out',items:['Invitations / RSVP launch','Menu decisions','Travel reminders','Décor plan']});
      timeline.push({label:'1–2 months out',items:['Seating plan','Final counts','Vendor confirmations','Day-of timeline']});
    } else {
      add('budget','Set a realistic overall budget and identify the 2–3 things you most want to protect money for.');
      add('guestlist','Create a rough guest list so venue and catering decisions are based on a real number.');
      add('venue','Research and book your venue once budget and guest-count range are clear.');
      add('planner','Decide whether you need a planner/coordinator and book early if that support matters to you.');
      add('vendors','Book the vendors tied to your top priorities—especially anything with limited availability.');
      if (moves.length < 5) add('website','Create a wedding website once your date and venue are set so guest information has a home.');
      wait.push('Seating charts','Final menu choices','Favors','Detailed signage','Final timeline','Small décor purchases');
      timeline.push({label:'First 1–2 months',items:['Budget + priorities','Guest-count range','Venue','Planner/coordination decision']});
      timeline.push({label:'After date + venue are set',items:['Book priority vendors','Start attire shopping','Create wedding website','Plan travel if needed']});
      timeline.push({label:'About 4–6 months out',items:['Invitations / RSVP plan','Menu and rental decisions','Guest communication']});
      timeline.push({label:'Final 1–2 months',items:['Seating plan','Final counts','Day-of timeline','Vendor confirmations']});
    }

    const missingPriority = priorities[0];
    if (missingPriority && moves.length < 5) moves.push(`Protect your priority: ${missingPriority}. Research that category early so your budget and vendor availability support what matters most to you.`);

    while (moves.length < 5) {
      const fallbacks = [
        'Create one shared place for notes, links, quotes, and decisions so wedding information stops living in screenshots and text threads.',
        'Choose one decision to make this week and give yourself permission not to solve the whole wedding at once.',
        'Make a short “must have / nice to have / do not care” list before spending money.'
      ];
      const next = fallbacks.find(item => !moves.includes(item));
      if (!next) break;
      moves.push(next);
    }
    return {moves:moves.slice(0,5), wait:wait.slice(0,6), timeline, months, priorities};
  }

  function snapshot(plan) {
    const hasDate = radio('dateStatus') === 'yes';
    const dateLabel = hasDate ? `Wedding: ${prettyDate(value('weddingDate'))}` : `Timing: ${[value('season'), value('year')].filter(Boolean).join(' ') || 'Date not chosen yet'}`;
    const guestMap = {under50:'Under 50 guests','50-100':'50–100 guests','100-150':'100–150 guests','150-200':'150–200 guests','200plus':'200+ guests','unsure':'Guest count not decided'};
    const budgetMap = {set:'Budget already set',range:'Have a rough budget range',unknown:'Budget still unknown'};
    const planningMap = {handsOn:'Very hands-on / DIY',mix:'A mix of DIY + hired help',delegated:'Prefer to delegate most of it',unsure:'Still figuring out planning style'};
    return {
      dateLabel,
      guestLabel:guestMap[radio('guestCount')] || '',
      budgetLabel:budgetMap[radio('budgetStatus')] || '',
      planningStyle:planningMap[radio('planningStyle')] || '',
      location:value('location'),
      firstName:value('firstName') || 'there',
      partnerName:value('partnerName'),
      priorities:plan.priorities
    };
  }

  function buildPlan() {
    const plan = planLogic();
    const snap = snapshot(plan);
    document.querySelector('[data-result-title]').textContent = `${snap.firstName}, here are the five things worth worrying about next.`;
    document.querySelector('[data-result-intro]').textContent = plan.months === null
      ? 'You do not need a wedding date to start. Your job right now is to narrow the decisions that make the date possible.'
      : plan.months <= 3
        ? 'Your timeline is short, so this plan intentionally prioritizes decisions that unlock everything else.'
        : 'This is your starting lane—not a giant master checklist. Handle these first, then move forward.';
    const chips = [snap.dateLabel,snap.guestLabel,snap.location,snap.budgetLabel,snap.planningStyle].filter(Boolean);
    document.querySelector('[data-snapshot]').innerHTML = chips.map(item => `<span>${escapeHtml(item)}</span>`).join('');
    document.querySelector('[data-moves]').innerHTML = plan.moves.map(item=>`<li>${escapeHtml(item)}</li>`).join('');
    document.querySelector('[data-wait]').innerHTML = plan.wait.map(item=>`<li>${escapeHtml(item)}</li>`).join('');
    document.querySelector('[data-timeline]').innerHTML = plan.timeline.map(section=>`<div class="timeline-section"><strong>${escapeHtml(section.label)}</strong><ul>${section.items.map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul></div>`).join('');
    document.querySelector('[data-email-first]').value = snap.firstName === 'there' ? '' : snap.firstName;
    document.querySelector('[data-email-name]').textContent = snap.firstName === 'there' ? 'your plan' : `${snap.firstName}'s plan`;
    results.dataset.plan = JSON.stringify({plan,snap});
    shell.style.display = 'none';
    results.classList.add('visible');
    document.title = 'Your Wedding Starting Plan | Tiny Site Weddings';
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  document.querySelector('[data-edit-plan]')?.addEventListener('click', () => {
    results.classList.remove('visible');
    shell.style.display = '';
    show(0);
  });
  document.querySelector('[data-print-plan]')?.addEventListener('click', () => window.print());

  const emailForm = document.querySelector('[data-email-form]');
  emailForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = document.querySelector('.email-status');
    const button = emailForm.querySelector('button');
    const stored = JSON.parse(results.dataset.plan || '{}');
    const email = emailForm.email.value.trim();
    const firstName = emailForm.firstName.value.trim();
    if (!email || !firstName) { status.textContent='Add your first name and email first.'; return; }
    button.disabled = true;
    button.textContent = 'Sending...';
    status.textContent = '';
    const completedLabels = checked('completed').map(v => v.replace(/([A-Z])/g,' $1').replace(/^./,m=>m.toUpperCase()));
    try {
      const response = await fetch('https://seating-studio-email.vercel.app/api/wedding-plan',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          firstName,email,partnerName:stored.snap.partnerName || '',dateLabel:stored.snap.dateLabel,
          guestLabel:stored.snap.guestLabel || '',location:stored.snap.location || '',budgetLabel:stored.snap.budgetLabel || '',
          planningStyle:stored.snap.planningStyle || '',priorities:stored.snap.priorities || [],completed:completedLabels,
          nextMoves:stored.plan.moves || [],waitOn:stored.plan.wait || [],timeline:stored.plan.timeline || [],website:''
        })
      });
      const data = await response.json().catch(()=>({}));
      if (!response.ok) throw new Error(data.error || 'Email could not be sent.');
      status.textContent = 'Sent! Check your inbox for your plan.';
      button.textContent = 'Plan sent ✓';
    } catch (err) {
      status.textContent = err.message || 'Email could not be sent. You can still print or save your plan.';
      button.disabled = false;
      button.textContent = 'Email me my plan';
    }
  });

  show(0);
})();
