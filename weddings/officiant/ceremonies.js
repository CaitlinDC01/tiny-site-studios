import {defaults,presets,dimensions,describeVibe,createBrief} from './vibe-core.mjs';
const state={...defaults};
const sliders=dimensions.map(key=>document.getElementById(key));
const choice=document.getElementById('package-choice');
const brief=document.getElementById('inquiry-brief');
function updateBrief(){
  brief.value=createBrief(state,choice.value);
  document.getElementById('email-inquiry').href='mailto:caitlin@tinysitestudios.com?subject='+encodeURIComponent('Ceremonies by Caitlin inquiry')+'&body='+encodeURIComponent(brief.value);
  document.getElementById('copy-status').textContent='';
}
function render(){
  const vibe=describeVibe(state);
  document.getElementById('vibe-heading').textContent=vibe.title;
  document.getElementById('vibe-description').textContent=vibe.description;
  document.getElementById('vibe-sample').textContent=vibe.sample;
  const tags=document.getElementById('vibe-tags');tags.replaceChildren(...vibe.tags.map(text=>{const span=document.createElement('span');span.textContent=text;return span}));
  sliders.forEach(input=>{input.value=state[input.id];document.getElementById(input.id+'-value').textContent=state[input.id]+'/10';input.setAttribute('aria-valuetext',state[input.id]+' out of 10')});
  document.getElementById('belief').value=state.belief;
  updateBrief();
}
function clearPreset(){document.querySelectorAll('[data-preset]').forEach(button=>button.setAttribute('aria-pressed','false'))}
sliders.forEach(input=>input.addEventListener('input',()=>{state[input.id]=Number(input.value);clearPreset();render()}));
document.getElementById('belief').addEventListener('change',event=>{state.belief=event.target.value;clearPreset();render()});
document.querySelectorAll('[data-preset]').forEach(button=>button.addEventListener('click',()=>{Object.assign(state,presets[button.dataset.preset]);clearPreset();button.setAttribute('aria-pressed','true');render()}));
document.getElementById('reset-vibe').addEventListener('click',()=>{Object.assign(state,defaults);clearPreset();document.querySelector('[data-preset="heartfelt"]').setAttribute('aria-pressed','true');render()});
choice.addEventListener('change',updateBrief);
document.querySelectorAll('[data-package]').forEach(link=>link.addEventListener('click',()=>{choice.value=link.dataset.package;updateBrief()}));
document.getElementById('copy-brief').addEventListener('click',async()=>{
  const status=document.getElementById('copy-status');
  try{await navigator.clipboard.writeText(brief.value);status.textContent='Copied! Paste it into the inquiry form’s message.'}
  catch{brief.focus();brief.select();status.textContent='Select and copy the brief, then paste it into the form’s message.'}
});
document.querySelectorAll('.mobile-menu a').forEach(link=>link.addEventListener('click',()=>{document.querySelector('.mobile-menu').open=false}));
render();
