(() => {
  const slug = location.pathname.split('/').filter(Boolean).pop();
  const packages = {
    city: { name:'Essentials', price:'$99', couple:'Maya + Theo', included:['Personalized wedding styling','Core wedding details','Venue, map, and registry','Wedding-day schedule','Photo content','External RSVP link','Six months of hosting'], upgrades:['Built-in RSVP and meal choices','Travel and accommodations','Wedding party or love story','Interactive guest tools'], note:'For this Essentials demo, RSVP opens outside the wedding site. Built-in RSVP begins with Signature.' },
    garden: { name:'Signature', price:'$149', couple:'Amelia + Julian', included:['Everything in Essentials','Built-in RSVP','Meal and dietary selections','Travel, accommodations, and FAQ','Expanded schedule details','Love story or wedding party','Two revision rounds'], upgrades:['Both story sections','Expanded gallery','Multi-event interactive itinerary','Seat Finder, DJ Requests, or other tools'], note:'This demo uses the love story option. Signature clients may choose wedding-party introductions instead.' },
    coastal: { name:'Wedding Hub', price:'$199', couple:'Sofia + Cameron', included:['Everything in Signature','Love story and wedding party','Multi-event wedding itinerary','Expanded travel guide and gallery','One interactive guest tool','Custom domain','One year of hosting'], upgrades:['Live itinerary','Two additional interactive tools','Guestbook Live substitution'], note:'This destination demo uses its interactive island guide as the selected tool. Another Wedding Hub could choose Seat Finder, DJ Requests, Guest Updates, or a different available tool.' },
    'bea-milo': { name:'Full Experience', price:'$249', couple:'Bea + Milo', included:['Everything in Wedding Hub','Live interactive itinerary','Three interactive tools','Expanded personalization','Custom domain','One year of hosting','Limited launch support'], upgrades:['Guestbook Live substitution · +$19','Additional standard tool · +$19','Seating Studio · +$29','Bilingual build · +$19'], note:'This showcase lets you explore more than three tools so you can see the possibilities. A Full Experience package includes your choice of three; Guestbook Live may replace one for $19.' }
  };
  const data = packages[slug];
  if (!data) return;
  const css = document.createElement('link'); css.rel='stylesheet'; css.href='../demo-package.css'; document.head.appendChild(css);
  if (slug === 'city') {
    document.querySelectorAll('[data-open-rsvp]').forEach((button) => {
      const link=document.createElement('a'); link.href='/weddings/features/#rsvp'; link.className='tss-external-rsvp'; link.textContent='External RSVP link ↗'; button.replaceWith(link);
    });
    document.querySelector('.rsvp-dialog')?.remove();
  }
  const button=document.createElement('button'); button.className='tss-demo-button'; button.type='button'; button.textContent='About this demo';
  const backdrop=document.createElement('div'); backdrop.className='tss-demo-backdrop'; backdrop.innerHTML=`<aside class="tss-demo-panel" role="dialog" aria-modal="true" aria-labelledby="tss-demo-title"><button class="tss-demo-close" type="button" aria-label="Close demo details">×</button><p class="tss-demo-label">You’re viewing</p><h2 id="tss-demo-title">${data.couple} is a ${data.name} demo.</h2><p class="tss-demo-price">${data.name} · ${data.price}</p><h3>Included at this level</h3><ul>${data.included.map(item=>`<li>${item}</li>`).join('')}</ul><h3>Available beyond what’s shown</h3><ul class="upgrade">${data.upgrades.map(item=>`<li>${item}</li>`).join('')}</ul><p class="tss-demo-note">${data.note}</p><div class="tss-demo-actions"><a href="/weddings/start/?package=${slug==='bea-milo'?'full-experience':slug==='coastal'?'wedding-hub':slug==='garden'?'signature':'essentials'}">Start with ${data.name}</a><a href="/weddings/pricing/">Compare all packages</a><a href="/weddings/demos/">View all demo weddings</a></div></aside>`;
  document.body.append(button,backdrop);
  const close=()=>{backdrop.classList.remove('open');document.body.style.overflow='';button.focus()};
  button.addEventListener('click',()=>{backdrop.classList.add('open');document.body.style.overflow='hidden';backdrop.querySelector('.tss-demo-close').focus()});
  backdrop.querySelector('.tss-demo-close').addEventListener('click',close);
  backdrop.addEventListener('click',(event)=>{if(event.target===backdrop)close()});
  document.addEventListener('keydown',(event)=>{if(event.key==='Escape'&&backdrop.classList.contains('open'))close()});
})();
