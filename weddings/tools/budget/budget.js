
(() => {
  const form=document.querySelector('[data-budget-form]');
  if(!form)return;
  const panels=[...form.querySelectorAll('.step-panel')], steps=[...document.querySelectorAll('.step-list li')], progress=document.querySelector('.progress-bar'), error=document.querySelector('.planner-error'), shell=document.querySelector('.planner-shell'), results=document.querySelector('.budget-results');
  let current=0;
  const radio=n=>form.querySelector(`input[name="${n}"]:checked`)?.value||'';
  const checked=n=>[...form.querySelectorAll(`input[name="${n}"]:checked`)].map(x=>x.value);
  const val=n=>String(form.elements[n]?.value||'').trim();
  const money=n=>Number(String(val(n)).replace(/[^0-9.]/g,''))||0;
  const labels={photos:'Photography + video',food:'Food + drinks',venue:'Venue',music:'Music + entertainment',florals:'Flowers + décor',attire:'Attire + beauty',guest:'Guest experience',lowstress:'Planning / coordination'};
  const guestMid={under50:35,'50-100':75,'100-150':125,'150-200':175,'200plus':225,unsure:100};
  const guestRange={under50:[9000,18000],'50-100':[16000,30000],'100-150':[24000,40000],'150-200':[33000,52000],'200plus':[43000,70000],unsure:[20000,36000]};
  const marketMult={lower:.82,typical:1,high:1.35,destination:1.22,unsure:1};
  const categories=[
    ['venue','Venue + ceremony',18],['food','Catering + bar',21],['photos','Photography + video',12],['planning','Planning / coordination',7],
    ['florals','Flowers + décor',9],['music','Music + entertainment',7],['attire','Attire + beauty',7],['rentals','Rentals + tablescape',5],
    ['stationery','Invitations + website + signage',3],['dessert','Cake + desserts',3],['transport','Transportation',2],['buffer','Tips + fees + buffer',6]
  ];
  function show(i){current=Math.max(0,Math.min(i,panels.length-1));panels.forEach((p,x)=>p.hidden=x!==current);steps.forEach((s,x)=>{s.classList.toggle('active',x===current);s.classList.toggle('done',x<current)});if(progress)progress.style.width=`${((current+1)/panels.length)*100}%`;if(error)error.textContent='';const target=panels[current];window.scrollTo({top:target.getBoundingClientRect().top+window.scrollY-24,behavior:'smooth'});}
  function valid(){const p=panels[current], req=p.querySelector('[data-required-radio]');if(req&&!radio(req.dataset.requiredRadio))return 'Choose the option that fits you best.';for(const f of p.querySelectorAll('[required]'))if(!String(f.value||'').trim())return 'Fill in the required field before continuing.';return '';}
  form.addEventListener('click',e=>{const next=e.target.closest('[data-next]'),back=e.target.closest('[data-back]');if(next){const m=valid();if(m){error.textContent=m;return;}current===panels.length-1?build():show(current+1);}if(back)show(current-1);});
  form.querySelectorAll('input[name="priorities"]').forEach(input=>input.addEventListener('change',()=>{const boxes=[...form.querySelectorAll('input[name="priorities"]')];if(checked('priorities').length>3){input.checked=false;error.textContent='Choose up to three priorities.';}const limit=checked('priorities').length>=3;boxes.forEach(b=>{if(!b.checked)b.disabled=limit;});}));
  form.querySelectorAll('input[name="budgetMode"]').forEach(input=>input.addEventListener('change',()=>{document.querySelector('[data-known-budget]').hidden=radio('budgetMode')!=='known';document.querySelector('[data-known-budget] input').required=radio('budgetMode')==='known';}));
  function loadProfile(){try{const p=JSON.parse(localStorage.getItem('weddingGamePlanProfileV1')||'null');if(!p)return;const g=form.querySelector(`input[name="guestCount"][value="${p.guestCount}"]`);if(g)g.checked=true;if(p.location)form.elements.location.value=p.location;(p.priorityKeys||[]).forEach(k=>{const x=form.querySelector(`input[name="priorities"][value="${k}"]`);if(x)x.checked=true;});if(p.firstName)form.elements.firstName.value=p.firstName;}catch(e){}}
  function fmt(n){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Math.round(n/25)*25);}
  function benchmark(){const base=guestRange[radio('guestCount')]||guestRange.unsure,m=marketMult[radio('market')]||1;return [base[0]*m,base[1]*m];}
  function allocate(total,priorities){let rows=categories.map(([key,name,pct])=>({key,name,pct}));const boostKeys=new Set(priorities.map(k=>k==='lowstress'?'planning':k));rows.forEach(r=>{if(boostKeys.has(r.key))r.pct+=3;});let over=rows.reduce((s,r)=>s+r.pct,0)-100;if(over>0){['buffer','rentals','florals','attire','music'].forEach(key=>{const r=rows.find(x=>x.key===key);if(r&&over>0){const cut=Math.min(r.pct-2,Math.ceil(over/2));r.pct-=Math.max(0,cut);over-=Math.max(0,cut);}});}const sum=rows.reduce((s,r)=>s+r.pct,0);rows.forEach(r=>r.pct=r.pct/sum*100);return rows.map(r=>({...r,amount:total*r.pct/100,priority:boostKeys.has(r.key)}));}
  function build(){
    const range=benchmark(), mode=radio('budgetMode'), known=money('totalBudget'), target=mode==='known'?known:(range[0]+range[1])/2, priorities=checked('priorities');
    const rows=allocate(target,priorities);
    const guest=guestMid[radio('guestCount')]||100, perGuest=target/guest;
    document.querySelector('[data-budget-title]').textContent=mode==='known'?'Your working wedding budget':'Your starting planning target';
    document.querySelector('[data-total]').textContent=fmt(target);
    document.querySelector('[data-budget-sub]').textContent=mode==='known'?'We kept your total fixed and shifted the categories around what matters most to you.':'This is a planning midpoint—not a quote or a requirement. Adjust it as real vendor pricing comes in.';
    document.querySelector('[data-benchmark]').textContent=`${fmt(range[0])}–${fmt(range[1])}`;
    document.querySelector('[data-benchmark-copy]').textContent=`A broad planning range for a ${radio('guestCount')==='unsure'?'roughly 100-guest':guest+'-guest'} wedding in the market type you selected.`;
    document.querySelector('[data-perguest]').textContent=`About ${fmt(perGuest)} per guest at your current working total.`;
    document.querySelector('[data-budget-rows]').innerHTML=rows.map(r=>`<tr class="${r.priority?'priority-row':''}"><td>${r.name}</td><td>${Math.round(r.pct)}%</td><td>${fmt(r.amount)}</td></tr>`).join('');
    const protect=priorities.length?priorities.map(k=>labels[k]||k):['The experience you and your partner care about most','A contingency buffer before adding extras'];
    const save=['Digital invitations / RSVPs instead of full printed suites','Fewer floral installations; reuse ceremony pieces','Skip favors or choose one useful guest touch','Limit décor purchases until venue needs are clear'];
    const watch=['Service charges, tax, gratuities and overtime','Venue or catering minimums','Delivery, setup and breakdown fees','Last-minute guest-count changes'];
    document.querySelector('[data-protect]').innerHTML=protect.map(x=>`<li>${x}</li>`).join('');
    document.querySelector('[data-save]').innerHTML=save.map(x=>`<li>${x}</li>`).join('');
    document.querySelector('[data-watch]').innerHTML=watch.map(x=>`<li>${x}</li>`).join('');
    const reality=document.querySelector('[data-reality]');
    if(mode==='known'&&known<range[0]) reality.innerHTML='<strong>Your budget is below this broad benchmark—and that can absolutely be intentional.</strong><p>Your biggest levers will be guest count, venue format, food/bar choices, day of week, and how much you DIY. The next tool will help identify where DIY is actually worth it.</p>';
    else if(mode==='known'&&known>range[1]) reality.innerHTML='<strong>You have room to be selective about where the extra spend goes.</strong><p>Protect your top priorities first, keep a real fees/tips buffer, and do not let “we have room” turn every nice-to-have into a must-have.</p>';
    else reality.innerHTML='<strong>Your working number sits inside the broad planning range.</strong><p>That does not guarantee local vendor quotes will match it. Use this as a decision framework, then replace estimates with real quotes as you book.</p>';
    try{localStorage.setItem('weddingBudgetProfileV1',JSON.stringify({target,range,guestCount:radio('guestCount'),market:radio('market'),location:val('location'),priorities,rows}));}catch(e){}
    shell.style.display='none';results.classList.add('visible');window.scrollTo({top:results.offsetTop-15,behavior:'smooth'});
  }
  document.querySelector('[data-edit-budget]')?.addEventListener('click',()=>{results.classList.remove('visible');shell.style.display='';show(0);});
  document.querySelector('[data-print-budget]')?.addEventListener('click',()=>window.print());
  loadProfile();show(0);
})();
