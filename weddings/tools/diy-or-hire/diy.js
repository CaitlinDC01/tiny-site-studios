
(() => {
  const form = document.querySelector('[data-diy-form]');
  if (!form) return;

  const panels = [...form.querySelectorAll('.step-panel')];
  const steps = [...document.querySelectorAll('.step-list li')];
  const progress = document.querySelector('.progress-bar');
  const error = document.querySelector('.planner-error');
  const shell = document.querySelector('.planner-shell');
  const results = document.querySelector('.diy-results');
  let current = 0;

  const radio = name => form.querySelector(`input[name="${name}"]:checked`)?.value || '';
  const checked = name => [...form.querySelectorAll(`input[name="${name}"]:checked`)].map(el => el.value);

  const projects = {
    website:{name:'Wedding website',base:72,time:'medium',skill:'tech',risk:'low',scale:true,savings:'medium',reason:'Templates make this very DIY-able, but setup, updates, mobile testing, and keeping guest information organized still take time.',hybrid:'Use a template or done-for-you setup, then update simple details yourself.',service:'/weddings/pricing/',serviceText:'See done-for-you wedding sites →'},
    invitations:{name:'Invitations / save the dates',base:76,time:'medium',skill:'design',risk:'low',scale:true,savings:'high',reason:'Digital or template-based stationery is one of the easier places to save if you are comfortable editing layouts and proofreading details.',hybrid:'Design the look yourself, then outsource printing, addressing, or digital setup.',service:'/weddings/demos/digital-invitation/',serviceText:'See a personalized digital invitation →'},
    rsvp:{name:'RSVP setup + tracking',base:68,time:'medium',skill:'tech',risk:'medium',scale:true,savings:'medium',reason:'The form itself can be simple; the harder part is plus-ones, meal choices, households, reminders, and keeping responses organized.',hybrid:'Use a polished RSVP system but manage the guest follow-up yourself.',service:'/weddings/demos/',serviceText:'Explore Tiny Site RSVP options →'},
    seating:{name:'Seating chart / seat finder',base:64,time:'high',skill:'organization',risk:'medium',scale:true,savings:'medium',reason:'The design is DIY-friendly, but the real work is managing relationships, late RSVP changes, table capacity, and final updates.',hybrid:'Build the guest list yourself, then use a digital planner to handle arrangement and guest lookup.',service:'/weddings/demos/seating-studio/',serviceText:'Try Seating Studio →'},
    signage:{name:'Wedding signs',base:82,time:'medium',skill:'design',risk:'low',scale:true,savings:'high',reason:'Signs are usually forgiving projects if you can design consistently and leave enough time for printing or assembly.',hybrid:'Design everything yourself and outsource only the final printing or specialty materials.'},
    favors:{name:'Favors',base:80,time:'high',skill:'craft',risk:'low',scale:true,savings:'medium',reason:'Favors are low-risk, but assembling 100+ identical items can become a bigger time commitment than couples expect.',hybrid:'Choose a simple purchased item and DIY only the tag, packaging, or presentation.'},
    florals:{name:'Florals',base:48,time:'high',skill:'craft',risk:'medium',scale:true,savings:'high',reason:'DIY florals can save money, but fresh flowers introduce storage, timing, transport, and wedding-week labor.',hybrid:'Hire out bouquets and large installations; DIY bud vases, greenery, or simple centerpieces.'},
    decor:{name:'Decor + centerpieces',base:70,time:'high',skill:'craft',risk:'low',scale:true,savings:'high',reason:'Decor can be a strong DIY category when setup and teardown are simple and the venue allows enough access time.',hybrid:'DIY tabletop details, but rent or outsource anything large, heavy, electrical, or time-sensitive.'},
    guestbook:{name:'Guestbook / guest photo sharing',base:76,time:'low',skill:'tech',risk:'low',scale:true,savings:'medium',reason:'A simple physical guestbook is easy to DIY. Digital photo, video, and audio collection becomes more about setup and guest experience than crafting.',hybrid:'Create your own signage/QR display and use a hosted digital guestbook for the actual collecting.',service:'https://guestbook-live.com/demo',serviceText:'Try Guestbook Live →'},
    photobooth:{name:'Photo booth',base:58,time:'medium',skill:'tech',risk:'medium',scale:false,savings:'high',reason:'An iPad-and-ring-light setup can work well, but lighting, framing, power, file delivery, props, and troubleshooting still need an owner.',hybrid:'DIY the backdrop and props; use a simple hosted booth app or assign someone to own setup.'},
    cake:{name:'Cake / desserts',base:38,time:'high',skill:'culinary',risk:'high',scale:true,savings:'medium',reason:'Baking for a crowd is a production job: food safety, transport, refrigeration, decorating, and timing all matter.',hybrid:'Order the main cake and DIY cookies, dessert-table styling, or family-favorite treats.'},
    catering:{name:'Catering / meal service',base:18,time:'high',skill:'culinary',risk:'high',scale:true,savings:'high',reason:'Food for a wedding is not just cooking—it is purchasing, holding temperatures, staffing, serving, cleanup, and food-safety responsibility.',hybrid:'Hire the meal service and DIY lower-risk extras such as late-night snacks or packaged welcome treats.'},
    bar:{name:'Bar / drinks',base:30,time:'medium',skill:'logistics',risk:'high',scale:true,savings:'high',reason:'Alcohol service brings quantities, ice, glassware, staffing, venue rules, insurance, and liability into the picture.',hybrid:'Buy your own alcohol where allowed, but use insured bartenders or venue staff for service.'},
    dj:{name:'DJ / music',base:42,time:'medium',skill:'tech',risk:'high',scale:false,savings:'high',reason:'A playlist can cover the songs, but a DJ also handles pacing, announcements, microphones, transitions, and reading the room.',hybrid:'Build the must-play/do-not-play lists yourself and hire someone for sound, announcements, and reception flow.'},
    photo:{name:'Photography',base:20,time:'low',skill:'photo',risk:'high',scale:false,savings:'high',reason:'There is almost no redo for missed ceremony moments, poor exposure, bad audio, or lost files. The risk is concentrated into one day.',hybrid:'Hire the professional coverage you care about most, then use guest photo sharing for candid extras.'},
    video:{name:'Videography',base:28,time:'medium',skill:'photo',risk:'high',scale:false,savings:'high',reason:'Phones can capture clips, but audio, stabilization, coverage, file management, and editing are where DIY gets difficult.',hybrid:'Hire ceremony/speeches coverage and invite guests to upload candid clips for everything else.'},
    coordination:{name:'Day-of coordination',base:24,time:'high',skill:'organization',risk:'high',scale:false,savings:'high',reason:'This work happens exactly when you should not be doing it. Vendor arrivals, timeline changes, questions, and emergencies need someone other than the couple.',hybrid:'Build your own planning documents, then hand them to a month-of/day-of coordinator to execute.'},
    hairmakeup:{name:'Hair + makeup',base:52,time:'medium',skill:'beauty',risk:'medium',scale:false,savings:'medium',reason:'DIY can work if your usual look is what you want and you can recreate it reliably under time pressure.',hybrid:'DIY one service and hire the other, or book a trial and decide afterward.'},
    transportation:{name:'Guest / wedding-party transportation',base:40,time:'medium',skill:'logistics',risk:'high',scale:true,savings:'medium',reason:'Transportation seems simple until timing, parking, drivers, alcohol, multiple pickup points, and stranded guests enter the picture.',hybrid:'DIY the schedule and guest communication, but use professional drivers for the actual transportation.'}
  };

  const skillLabels={design:'Design / Canva',craft:'Crafts / making things',tech:'Tech / websites / apps',organization:'Spreadsheets / logistics',culinary:'Cooking / baking',photo:'Photography / video',beauty:'Hair / makeup',logistics:'Event logistics'};
  const guestLarge=()=>['150-200','200plus'].includes(radio('guestCount'));

  function show(index){
    current=Math.max(0,Math.min(index,panels.length-1));
    panels.forEach((p,i)=>p.hidden=i!==current);
    steps.forEach((s,i)=>{s.classList.toggle('active',i===current);s.classList.toggle('done',i<current);});
    if(progress)progress.style.width=`${((current+1)/panels.length)*100}%`;
    if(error)error.textContent='';
    const target=panels[current];
    window.scrollTo({top:target.getBoundingClientRect().top+window.scrollY-24,behavior:'smooth'});
  }

  function validate(){
    const panel=panels[current];
    const minChecks=panel.dataset.minChecks;
    if(minChecks){
      const name=panel.dataset.checkName;
      if(checked(name).length<Number(minChecks)) return panel.dataset.checkMessage || 'Choose at least one option.';
    }
    const req=panel.querySelector('[data-required-radio]');
    if(req&&!radio(req.dataset.requiredRadio)) return 'Choose the option that fits you best.';
    return '';
  }

  form.addEventListener('click',event=>{
    const next=event.target.closest('[data-next]');
    const back=event.target.closest('[data-back]');
    if(next){
      const message=validate();
      if(message){error.textContent=message;return;}
      current===panels.length-1?buildResults():show(current+1);
    }
    if(back)show(current-1);
  });

  function loadProfile(){
    try{
      const game=JSON.parse(localStorage.getItem('weddingGamePlanProfileV1')||'null');
      const budget=JSON.parse(localStorage.getItem('weddingBudgetProfileV1')||'null');
      const source=budget||game;
      if(!source)return;
      if(source.guestCount){
        const guest=form.querySelector(`input[name="guestCount"][value="${source.guestCount}"]`);
        if(guest)guest.checked=true;
      }
      if(game?.weddingDate){
        const target=new Date(game.weddingDate+'T12:00:00');
        const months=Math.max(0,Math.round((target-new Date())/2629800000));
        const bucket=months<=3?'under3':months<=6?'3-6':months<=12?'6-12':'12plus';
        const timing=form.querySelector(`input[name="timing"][value="${bucket}"]`);
        if(timing)timing.checked=true;
      }
    }catch(e){}
  }

  function scoreProject(project){
    let score=project.base;
    const goal=radio('goal');
    const time=radio('timeAvailable');
    const timing=radio('timing');
    const support=radio('support');
    const skills=new Set(checked('skills'));

    if(goal==='saveMoney') score += project.savings==='high'?10:project.savings==='medium'?5:1;
    if(goal==='saveTime') score -= project.time==='high'?16:project.time==='medium'?8:2;
    if(goal==='lowStress') score -= project.risk==='high'?16:project.risk==='medium'?8:2;
    if(goal==='personal') score += 8;

    if(time==='under2') score -= project.time==='high'?18:project.time==='medium'?9:2;
    if(time==='2-5') score -= project.time==='high'?9:project.time==='medium'?3:0;
    if(time==='5-10') score += project.time==='medium'||project.time==='high'?5:2;
    if(time==='10plus') score += project.time==='high'?10:4;

    if(skills.has(project.skill)) score += 12;
    else if(project.skill && project.risk!=='low') score -= 6;

    if(timing==='under3') score -= project.time==='high'?16:project.time==='medium'?8:3;
    if(timing==='3-6') score -= project.time==='high'?8:project.time==='medium'?3:0;
    if(timing==='12plus') score += project.time==='high'?6:2;

    if(project.scale&&guestLarge()) score -= 9;
    if(project.scale&&radio('guestCount')==='200plus') score -= 5;
    if(support==='yes'&&project.time==='high') score += 6;
    if(support==='no'&&project.time==='high') score -= 6;

    if(project.risk==='high'&&!skills.has(project.skill)) score=Math.min(score,48);
    return Math.max(5,Math.min(95,score));
  }

  function level(score){
    if(score>=62)return 'diy';
    if(score>=42)return 'hybrid';
    return 'hire';
  }
  function levelLabel(l){return l==='diy'?'Great DIY candidate':l==='hybrid'?'Consider a hybrid':'Usually worth hiring';}
  function metricLabel(value){return value==='low'?'Low':value==='medium'?'Medium':'High';}

  function renderCard(item){
    const p=item.project,l=item.level;
    const service=p.service?`<a class="service-link" href="${p.service}" ${p.service.startsWith('http')?'target="_blank" rel="noopener"':''}>${p.serviceText}</a>`:'';
    return `<article class="recommendation-card ${l}">
      <span class="rec-label">${levelLabel(l)}</span>
      <h4>${p.name}</h4>
      <div class="metric-row"><span>Time: ${metricLabel(p.time)}</span><span>Savings potential: ${metricLabel(p.savings)}</span><span>Day-of risk: ${metricLabel(p.risk)}</span></div>
      <p>${p.reason}</p>
      <p class="hybrid-idea"><strong>Hybrid idea:</strong> ${p.hybrid}</p>
      ${service}
    </article>`;
  }

  function buildResults(){
    const selected=checked('projects');
    const scored=selected.map(key=>({key,project:projects[key],score:scoreProject(projects[key])})).map(item=>({...item,level:level(item.score)}));
    scored.sort((a,b)=>b.score-a.score);

    const diy=scored.filter(x=>x.level==='diy');
    const hybrid=scored.filter(x=>x.level==='hybrid');
    const hire=scored.filter(x=>x.level==='hire');

    document.querySelector('[data-diy-count]').textContent=diy.length;
    document.querySelector('[data-hybrid-count]').textContent=hybrid.length;
    document.querySelector('[data-hire-count]').textContent=hire.length;
    document.querySelector('[data-result-intro]').textContent=
      radio('goal')==='saveMoney'
        ? 'You told us saving money matters most, so this plan gives DIY more credit where the savings are meaningful—but still protects you from high-risk wedding-day jobs.'
        : radio('goal')==='saveTime'
        ? 'You told us time is the scarce resource, so labor-heavy projects are pushed toward hybrid or hire even when DIY could save money.'
        : radio('goal')==='lowStress'
        ? 'You told us lower stress matters most, so one-shot and day-of responsibilities are weighted more heavily toward professional help.'
        : 'You told us personalization matters most, so creative projects get more DIY room while high-risk wedding-day jobs stay protected.';

    const sections=[
      ['diy','Great DIY candidates','These are the projects your answers suggest are realistic to own yourself.',diy],
      ['hybrid','Consider a hybrid','Keep the parts you enjoy and outsource the pieces that create scale, setup, or stress.',hybrid],
      ['hire','Usually worth hiring','These are the jobs where time pressure, risk, or day-of responsibility outweigh the likely DIY savings.',hire]
    ];
    document.querySelector('[data-result-sections]').innerHTML=sections.filter(s=>s[3].length).map(([kind,title,copy,items])=>`
      <section class="result-section">
        <header><h3>${title}</h3><p>${copy}</p></header>
        <div class="recommendation-grid">${items.map(renderCard).join('')}</div>
      </section>`).join('');

    try{
      localStorage.setItem('weddingDiyProfileV1',JSON.stringify({
        projects:selected,goal:radio('goal'),timeAvailable:radio('timeAvailable'),timing:radio('timing'),
        guestCount:radio('guestCount'),skills:checked('skills'),support:radio('support'),
        results:scored.map(x=>({key:x.key,score:x.score,level:x.level}))
      }));
    }catch(e){}

    shell.style.display='none';
    results.classList.add('visible');
    window.scrollTo({top:results.offsetTop-15,behavior:'smooth'});
  }

  document.querySelector('[data-edit-diy]')?.addEventListener('click',()=>{
    results.classList.remove('visible');
    shell.style.display='';
    show(0);
  });
  document.querySelector('[data-print-diy]')?.addEventListener('click',()=>window.print());

  loadProfile();
  show(0);
})();
