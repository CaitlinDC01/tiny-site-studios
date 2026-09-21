
(() => {
  const form = document.querySelector('[data-afford-form]');
  if (!form) return;

  const panels=[...form.querySelectorAll('.step-panel')], steps=[...document.querySelectorAll('.step-list li')];
  const progress=document.querySelector('.progress-bar'), error=document.querySelector('.planner-error'), shell=document.querySelector('.planner-shell'), results=document.querySelector('.afford-results');
  let current=0;

  const radio=n=>form.querySelector(`input[name="${n}"]:checked`)?.value||'';
  const checked=n=>[...form.querySelectorAll(`input[name="${n}"]:checked`)].map(x=>x.value);
  const val=n=>String(form.elements[n]?.value||'').trim();
  const num=n=>Number(String(val(n)).replace(/[^0-9.]/g,''))||0;
  const fmt=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Math.round(n/25)*25);

  const guestMid={under50:40,'50-100':75,'100-150':125,'150-200':175,'200plus':225,unsure:100};
  const guestBase={under50:14500,'50-100':23000,'100-150':33000,'150-200':43000,'200plus':55500,unsure:30000};
  const marketMult={lower:.8,typical:1,high:1.4,destination:1.25,unsure:1};
  const styleMult={simple:.82,classic:1,formal:1.22,luxury:1.5};
  const priorityLabels={photos:'photo/video',food:'food + drinks',venue:'venue/setting',music:'music + party',florals:'flowers + décor',attire:'attire + beauty',guest:'guest experience',lowstress:'planning support'};

  function show(i){
    current=Math.max(0,Math.min(i,panels.length-1));
    panels.forEach((p,x)=>p.hidden=x!==current);
    steps.forEach((s,x)=>{s.classList.toggle('active',x===current);s.classList.toggle('done',x<current)});
    if(progress)progress.style.width=`${((current+1)/panels.length)*100}%`;
    if(error)error.textContent='';
    const target=panels[current];
    window.scrollTo({top:target.getBoundingClientRect().top+window.scrollY-24,behavior:'smooth'});
  }

  function validate(){
    const panel=panels[current];
    const req=panel.querySelector('[data-required-radio]');
    if(req&&!radio(req.dataset.requiredRadio))return 'Choose the option that fits you best.';
    for(const f of panel.querySelectorAll('[required]')) if(!String(f.value||'').trim()) return 'Fill in the required field before continuing.';
    return '';
  }

  form.addEventListener('click',e=>{
    const next=e.target.closest('[data-next]'),back=e.target.closest('[data-back]');
    if(next){const m=validate();if(m){error.textContent=m;return;} current===panels.length-1?build():show(current+1);}
    if(back)show(current-1);
  });

  form.querySelectorAll('input[name="priorities"]').forEach(input=>input.addEventListener('change',()=>{
    const boxes=[...form.querySelectorAll('input[name="priorities"]')];
    if(checked('priorities').length>3){input.checked=false;error.textContent='Choose up to three priorities.';}
    const limit=checked('priorities').length>=3;
    boxes.forEach(b=>{if(!b.checked)b.disabled=limit;});
  }));

  function loadProfile(){
    try{
      const game=JSON.parse(localStorage.getItem('weddingGamePlanProfileV1')||'null');
      const budget=JSON.parse(localStorage.getItem('weddingBudgetProfileV1')||'null');
      if(budget?.target) form.elements.totalBudget.value=Math.round(budget.target);
      if(budget?.guestCount || game?.guestCount){
        const key=budget?.guestCount||game.guestCount;
        const el=form.querySelector(`input[name="guestCount"][value="${key}"]`);
        if(el)el.checked=true;
      }
      const pri=budget?.priorities||game?.priorityKeys||[];
      pri.slice(0,3).forEach(k=>{const el=form.querySelector(`input[name="priorities"][value="${k}"]`);if(el)el.checked=true;});
    }catch(e){}
  }

  function estimate(){
    const guests=radio('guestCount')||'unsure', market=radio('market')||'typical', style=radio('style')||'classic';
    let total=(guestBase[guests]||30000)*(marketMult[market]||1)*(styleMult[style]||1);
    const priorities=checked('priorities');
    total*=1+Math.min(.12,priorities.length*.025);
    return total;
  }

  const leverDefs = [
    {id:'guests',name:'Trim the guest list',save:()=>Math.max(1500,(guestMid[radio('guestCount')]||100)*55*.2),copy:'A smaller guest list reduces more than food—it can shrink bar, rentals, stationery, transportation, and sometimes venue needs.'},
    {id:'day',name:'Choose a weekday / Sunday / off-peak date',save:()=>estimate()*.1,copy:'Venue and minimum-spend pricing can change substantially by day and season. This is one of the highest-impact levers if your date is flexible.'},
    {id:'venue',name:'Simplify the venue model',save:()=>estimate()*.08,copy:'Community spaces, restaurants, smaller venues, or packages with more included can reduce rentals, staffing, and décor needs.'},
    {id:'bar',name:'Simplify the bar',save:()=>estimate()*.055,copy:'Beer/wine only, a limited signature menu, shorter service, or buying alcohol where permitted can materially change per-guest spend.'},
    {id:'florals',name:'Reduce floral scope',save:()=>estimate()*.045,copy:'Use statement pieces selectively, reuse ceremony flowers, and let candles/greenery/table styling do more of the visual work.'},
    {id:'digital',name:'Go digital for guest communication',save:()=>Math.max(300,estimate()*.018),copy:'Digital save-the-dates, invitations, RSVPs, seating lookup, and updates can reduce printing, postage, and reprint costs.'},
    {id:'rentals',name:'Cut specialty rentals + décor layers',save:()=>estimate()*.035,copy:'Skip upgraded chairs, extra lounge areas, custom linens, duplicate signage, and décor that does not change the guest experience.'},
    {id:'events',name:'Scale back extra wedding-weekend events',save:()=>estimate()*.06,copy:'A welcome event, after-party, or brunch can quietly become a second or third event budget. Keep what matters and simplify the rest.'}
  ];

  function build(){
    const budget=num('totalBudget'), expected=estimate(), gap=expected-budget, priorities=checked('priorities');
    const ratio=budget/expected;
    const pct=Math.max(5,Math.min(100,ratio*100));
    const status=gap<=0?'comfortable':ratio>=.85?'close':'stretch';

    document.querySelector('[data-afford-title]').textContent=status==='comfortable'?'Yes—this plan has breathing room.':status==='close'?'You’re close. A few decisions can make this work.':'This version of the wedding is likely to feel tight.';
    document.querySelector('[data-budget-number]').textContent=fmt(budget);
    document.querySelector('[data-estimate-number]').textContent=fmt(expected);
    document.querySelector('[data-gap]').textContent=gap>0?`${fmt(gap)} gap`:`${fmt(Math.abs(gap))} breathing room`;
    document.querySelector('[data-gauge] span').style.width=`${pct}%`;
    document.querySelector('[data-afford-copy]').textContent=
      status==='comfortable'
      ? 'Your working budget is at or above this tool’s broad planning estimate. Keep a contingency buffer and replace estimates with real quotes before upgrading extras.'
      : status==='close'
      ? 'Your working budget is within striking distance of the broad estimate. You probably do not need to change everything—just pull a few high-impact levers on purpose.'
      : 'The goal is not to tell you the wedding is impossible. It is to show which assumptions are creating the gap so you can change the plan before contracts lock them in.';

    const container=document.querySelector('[data-levers]');
    container.innerHTML=leverDefs.map(l=>`<article class="lever-card" data-lever-card="${l.id}"><label><input type="checkbox" data-lever="${l.id}"><span><h4>${l.name}</h4><p>${l.copy}</p><strong>Potential planning impact: about ${fmt(l.save())}</strong></span></label></article>`).join('');

    const adjusted=document.querySelector('[data-adjusted]');
    function update(){
      const chosen=[...container.querySelectorAll('[data-lever]:checked')].map(x=>x.dataset.lever);
      container.querySelectorAll('[data-lever-card]').forEach(card=>card.classList.toggle('active',chosen.includes(card.dataset.leverCard)));
      const savings=chosen.reduce((sum,id)=>sum+(leverDefs.find(l=>l.id===id)?.save()||0),0);
      const newEstimate=Math.max(0,expected-savings);
      const newGap=newEstimate-budget;
      adjusted.querySelector('span').textContent=newGap>0?`${fmt(newGap)} remaining gap`:`${fmt(Math.abs(newGap))} breathing room`;
      adjusted.querySelector('strong').textContent=chosen.length ? 'With your selected changes' : 'Try the levers above';
    }
    container.addEventListener('change',update);
    update();

    const priorityText=priorities.length?priorities.map(k=>priorityLabels[k]||k).join(', '):'the parts of the wedding you care about most';
    document.querySelector('[data-priority-copy]').textContent=`Do not cut everything equally. Protect ${priorityText}, then reduce spending in categories that matter less to you. A smaller wedding that still feels like you is usually a better trade than a larger one where every category feels compromised.`;

    try{localStorage.setItem('weddingAffordabilityProfileV1',JSON.stringify({budget,expected,gap,guestCount:radio('guestCount'),market:radio('market'),style:radio('style'),priorities}));}catch(e){}
    shell.style.display='none';results.classList.add('visible');window.scrollTo({top:results.offsetTop-15,behavior:'smooth'});
  }

  document.querySelector('[data-edit-afford]')?.addEventListener('click',()=>{results.classList.remove('visible');shell.style.display='';show(0);});
  document.querySelector('[data-print-afford]')?.addEventListener('click',()=>window.print());

  loadProfile();
  show(0);
})();
