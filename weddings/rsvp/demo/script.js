const modal=document.querySelector('#rsvp-modal');
const form=document.querySelector('#rsvp-form');
const formView=document.querySelector('#rsvp-form-view');
const success=document.querySelector('#rsvp-success');
const attendingFields=document.querySelector('#attending-fields');
let lastFocus;

function openRsvp(){
  lastFocus=document.activeElement;
  formView.hidden=false;
  success.hidden=true;
  modal.hidden=false;
  document.body.classList.add('modal-open');
  setTimeout(()=>document.querySelector('#guest-name').focus(),0);
}

function closeRsvp(){
  modal.hidden=true;
  document.body.classList.remove('modal-open');
  lastFocus?.focus();
}

document.querySelectorAll('[data-open-rsvp]').forEach(button=>button.addEventListener('click',openRsvp));
document.querySelectorAll('[data-close-rsvp]').forEach(button=>button.addEventListener('click',closeRsvp));
document.querySelectorAll('input[name="attendance"]').forEach(input=>input.addEventListener('change',()=>{
  attendingFields.hidden=input.value!=='yes';
  attendingFields.querySelectorAll('input,select').forEach(field=>field.disabled=input.value!=='yes');
}));

const party=form.elements.party;
const meals=document.querySelector('#guest-meals');
function renderMeals(){
  const count=Number(party.value);
  while(meals.children.length>count)meals.lastElementChild.remove();
  while(meals.children.length<count){
    const i=meals.children.length+1;
    const group=document.createElement('fieldset');
    group.innerHTML=`<legend>Guest ${i}</legend>${i>1?`<label>Guest name<input name="guest-${i}" required placeholder="First and last name"></label>`:''}<label>Meal preference<select name="meal-${i}" required><option value="">Select an entrée</option><option>Herb-roasted chicken</option><option>Seared salmon</option><option>Garden risotto</option></select></label>`;
    meals.append(group);
  }
}
party.addEventListener('change',renderMeals);
renderMeals();

form.addEventListener('submit',event=>{
  event.preventDefault();
  const data=new FormData(form);
  const firstName=(data.get('name')||'friend').trim().split(/\s+/)[0];
  document.querySelector('#success-name').textContent=firstName;
  document.querySelector('#success-message').textContent=data.get('attendance')==='yes'
    ? `Your sample RSVP is for ${data.get('party')} guest(s). Meal choices: ${Array.from(data.entries()).filter(([key])=>key.startsWith('meal-')).map(([,value])=>value).join(', ')}.`
    : 'You’ll be missed, and we’re grateful you let us know.';
  formView.hidden=true;
  success.hidden=false;
  document.querySelector('#rsvp-success button').focus();
});

document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&!modal.hidden)closeRsvp();
  if(event.key==='Tab'&&!modal.hidden){
    const focusable=[...modal.querySelectorAll('button,a,input,select,textarea')].filter(el=>!el.disabled&&el.getClientRects().length);
    const first=focusable[0],last=focusable.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }
});

const seats=document.querySelector('#seat-dialog');
document.querySelector('#open-seats').addEventListener('click',()=>seats.showModal());
document.querySelector('#close-seats').addEventListener('click',()=>seats.close());
document.querySelector('#seat-form').addEventListener('submit',event=>{
  event.preventDefault();
  const guest=document.querySelector('#seat-guest');
  document.querySelector('#seat-result').textContent=`${guest.selectedOptions[0].text} · Table ${guest.value} · ${guest.value==='3'?'Near the garden doors':guest.value==='5'?'Beside the dance floor':'By the courtyard windows'}`;
});
