(() => {
 const groups={all:'all 12 people',bea:'Bea’s five attendants',milo:'Milo’s five attendants',family:'the flower girl and ring bearer'};
 document.querySelectorAll('[data-crew]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-crew]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  document.querySelectorAll('[data-person]').forEach(card=>card.hidden=button.dataset.crew!=='all'&&card.dataset.person!==button.dataset.crew);
  document.querySelector('#crew-status').textContent='Showing '+groups[button.dataset.crew]+'.';
 }));
 const notes={all:'All wedding-party times are shown.',bea:'Bea’s party: arrive at 10:30 AM. Pickup is 3:15 PM at Audubon Cottages.',milo:'Milo’s party: arrive at noon. Pickup is 3:10 PM at Maison de la Luz.',family:'Children and guardians: arrive at Marigny Opera House at 3:30 PM. Stay together throughout the day.'};
 document.querySelectorAll('[data-day-role]').forEach(button=>button.addEventListener('click',()=>{
  const role=button.dataset.dayRole;document.querySelectorAll('[data-day-role]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  document.querySelectorAll('[data-day-for]').forEach(row=>row.hidden=role!=='all'&&row.dataset.dayFor!=='all'&&row.dataset.dayFor!==role);
  document.querySelector('#day-role-note').textContent=notes[role];
 }));
 document.querySelector('#party-response').addEventListener('submit',event=>{
  event.preventDefault();const form=event.currentTarget;const name=form.elements.name.value.trim();
  if(!name){form.elements.name.setCustomValidity('Please enter your name.');form.reportValidity();return;}
  document.querySelector('#response-status').textContent=`${name}: ${form.elements.response.value} — sample response complete. Nothing was sent or saved.`;
 });
 document.querySelector('#party-response [name=name]').addEventListener('input',event=>event.target.setCustomValidity(''));
})();
