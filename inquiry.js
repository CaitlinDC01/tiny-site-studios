(() => {
  // Only known public project identifiers enter the brief. Never render query values as HTML.
  const params = new URLSearchParams(location.search);
  const services = {business:'Business website',celebration:'Celebration or event experience',career:'Career Studio',custom:'Custom dashboard or tool'};
  const packages = {'tiny-site':'Tiny Site · $75','tiny-site-plus':'Tiny Site Plus · $100','custom-experience':'Custom Experience · from $150'};
  const weddingPackages = {essentials:'Essentials · $99',signature:'Signature · $149','wedding-hub':'Wedding Hub · $199','full-experience':'Full Experience · $249','seating-studio':'Seating Studio · $29','wedding-party':'Wedding Party Site · $39','rsvp-only':'RSVP Only · $29','save-the-date-only':'Save-the-Date Only · $29','invitation-only':'Digital Invitation Only · $39',custom:'A custom mix of wedding services'};
  const examples = {"teacher-tools": "Tiny Teacher Tools", "wedding-studio": "The Wedding Studio", "task-deck": "Task Deck", "christmas-planner": "Merry & Managed", "better-than-bingo": "Better Than Bingo", "teacher-launchpad": "Teacher Launchpad", "stableflow": "StableFlow", "birthday-trail": "Birthday Treat Trail", "dapper-daisy": "Dapper Daisy", "savings-pots": "Savings Pots", "kitas-docket": "Kita’s Docket", "shonda": "Shonda’s Nursing School Companion", "shanna": "Shanna’s Client Portal", "myles": "The Myles Mob Playbook", "penske": "The Penske Place", "grinch-crawl": "Grinch Bar Crawl", "guestbook-live": "Guestbook Live", "weddings": "Weddings by TSS"};
  const goals = {search:'Starting or restarting a job search',leadership:'Showing leadership impact',interview:'Preparing for an interview or presentation',pivot:'Changing fields or explaining a nontraditional path'};
  const isWedding = location.pathname.startsWith('/weddings/');
  const known = (map, key) => Object.hasOwn(map, key) ? map[key] : null;
  const selection = known(isWedding ? weddingPackages : packages, params.get('package'));
  const service = known(services, params.get('service'));
  const example = known(examples, params.get('example'));
  const goal = known(goals, params.get('goal'));
  const lines = [selection && `Starting point: ${selection}`,service && `Project: ${service}`,example && `Inspired by: ${example}`,goal && `Goal: ${goal}`].filter(Boolean);
  const container = document.querySelector('[data-project-context]');
  if (container && lines.length) {
    container.hidden = false;
    const brief = container.querySelector('#project-brief');
    brief.value = lines.join('\n');
    const status = container.querySelector('[data-copy-status]');
    const email = container.querySelector('[data-email-brief]');
    const updateEmail = () => {
      const subject = `Tiny Site Studios inquiry${selection || service ? ' — '+(selection || service) : ''}`;
      email.href = `mailto:caitlin@tinysitestudios.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(brief.value.slice(0,4000)+'\n\nHere’s what I’m imagining:\n')}`;
    };
    updateEmail();
    brief.addEventListener('input', updateEmail);
    container.querySelector('[data-copy-brief]').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(brief.value);
        status.textContent = 'Copied. Paste your summary into the project details field below, then add your ideas.';
      } catch {
        brief.focus(); brief.select();
        status.textContent = 'Your summary is selected. Copy it with your keyboard or device menu, then paste it into the project details below.';
      }
    });
  }
  const wrap = document.querySelector('[data-hb-wrap]');
  const formStatus = document.querySelector('[data-form-status]');
  if (wrap && formStatus) {
    let observer;
    const loaded = () => { formStatus.hidden = true; observer?.disconnect(); };
    const watchFrame = () => {
      const frame = wrap.querySelector('iframe');
      if (!frame) return;
      frame.addEventListener('load', loaded, {once:true});
      // The embed can be ready before this script; retain a useful fallback either way.
    };
    observer = new MutationObserver(watchFrame);
    observer.observe(wrap, {childList:true,subtree:true});
    watchFrame();
    setTimeout(() => {
      observer.disconnect();
      if (!formStatus.hidden) formStatus.textContent = 'If the form hasn’t appeared, use the direct HoneyBook link below or email caitlin@tinysitestudios.com.';
    }, 12000);
  }
})();
