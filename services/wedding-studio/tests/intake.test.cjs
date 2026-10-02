const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const {parseHTML,DOMParser}=require('linkedom');
const base=require('path').resolve(__dirname,'../../../weddings/wedding-studio')+'/';
const {document,Event}=parseHTML(fs.readFileSync(base+'index.html','utf8'));
// Linkedom omits the browser's writable select.value property.
for(const el of document.querySelectorAll('select'))Object.defineProperty(el,'value',{value:'',writable:true});
const ctx=vm.createContext({document,window:{addEventListener(){}},structuredClone,setInterval:()=>0,clearInterval(){},DOMParser,Event,URL,URLSearchParams,crypto,console,setTimeout,clearTimeout,AbortController,AbortSignal,location:{search:'',href:'https://tinysitestudios.com/weddings/wedding-studio/'}});
vm.runInContext(fs.readFileSync(base+'intake.js','utf8'),ctx);
vm.runInContext(fs.readFileSync(base+'palette.js','utf8'),ctx);
vm.runInContext(fs.readFileSync(base+'planning.js','utf8'),ctx);
vm.runInContext(fs.readFileSync(base+'templates.js','utf8'),ctx);
vm.runInContext(fs.readFileSync(base+'../demos/seating-studio/room-layout.js','utf8'),ctx);
vm.runInContext(fs.readFileSync(base+'studio.js','utf8').replace('init();',''),ctx);
const run=s=>vm.runInContext(s,ctx);
const transfer=(plain='',html='',uri='',files=[])=>({files,getData:type=>({'text/plain':plain,'text/html':html,'text/uri-list':uri})[type]||''});
const read=d=>ctx.StudioIntake.read(d);
assert.equal(read(transfer('https://example.com\nhttps://pinterest.com/pin/123/\nhttps://example.com')).entries.length,2);
assert.equal(read(transfer('Candles everywhere\nMake it warm.')).entries[0].kind,'note');
const pin=read(transfer('',`<a href="https://www.pinterest.com/pin/123456/"><img src="https://i.pinimg.com/photo.jpg" alt="Garden flowers"></a><script>alert('x')</script>`)).entries[0];assert.equal(pin.url,'https://www.pinterest.com/pin/123456/');assert.equal(pin.image,'https://i.pinimg.com/photo.jpg');
assert.equal(read(transfer('javascript:alert(1)')).entries[0].kind,'note');
assert.equal(read(transfer('','','',[{name:'one.pdf'},{name:'two.png'}])).entries.length,2);
(async()=>{
 document.querySelector('#search').value='';document.querySelector('#status-filter').value='';
 run('loadDemo()');assert.equal(document.querySelectorAll('#board .card').length,6);
 ctx.capture=read(transfer('https://example.com/flowers\nhttps://www.pinterest.com/pin/123456/'));
 await run('importCapture(capture)');assert.equal(document.querySelectorAll('#board .card').length,8);assert.equal(document.querySelectorAll('.pin-art').length,1);
 const paste=new Event('paste',{bubbles:true,cancelable:true});paste.clipboardData=transfer('Candles on every table');document.dispatchEvent(paste);await new Promise(r=>setTimeout(r,20));assert.equal(document.querySelectorAll('#board .card').length,9);assert.equal(document.querySelector('dialog[open]'),null);
 const input=document.querySelector('#search');const ordinaryPaste=new Event('paste',{bubbles:true,cancelable:true});ordinaryPaste.clipboardData=transfer('Should not add');input.dispatchEvent(ordinaryPaste);await new Promise(r=>setTimeout(r,20));assert.equal(document.querySelectorAll('#board .card').length,9);
 ctx.capture=read(transfer('','','',[new File(['test document'],'quote.txt',{type:'text/plain'}),new File(['image'],'flowers.png',{type:'image/png'})]));await run('importCapture(capture)');assert.equal(document.querySelectorAll('#board .card').length,11);assert.equal(run("items.at(-2).kind"),'file');assert.equal(run("items.at(-1).kind"),'image');
 const fixtureEmail=crypto.randomUUID()+'@example.invalid';
 // Random disposable form values; auth below is a local mock and sends nothing.
 document.querySelector('#auth-email').value=fixtureEmail;document.querySelector('#auth-password').value=crypto.randomUUID();document.querySelector('#auth-password').focus=()=>{};
 run("authMode='signup';db={auth:{signUp:async()=>({data:{user:{identities:[]},session:null}})}}");await document.querySelector('#auth-form').onsubmit({preventDefault(){}});assert.equal(document.querySelector('#auth-next').hidden,false);assert.match(document.querySelector('#auth-message').textContent,/If this is a new email address/);assert.equal(document.querySelector('#auth-submit').hidden,true);document.querySelector('#auth-go-login').onclick();assert.equal(run('authMode'),'login');assert.equal(document.querySelector('#auth-submit').hidden,false);assert.equal(document.querySelector('#auth-email').value,fixtureEmail);
 // Browser-only dialog/form APIs are modeled here to test full editor and tour flows.
 for(const dialog of document.querySelectorAll('dialog')){dialog.showModal=()=>dialog.setAttribute('open','');dialog.close=()=>{dialog.removeAttribute('open');dialog.dispatchEvent(new Event('close'))}};
 document.querySelector('#item-form').reset=()=>{};
 Object.defineProperty(document.querySelector('#item-file'),'files',{value:[]});
 run("openEditor('palette')");assert.equal(document.querySelectorAll('[data-color]').length,4);
 const first=document.querySelector('[data-color]');first.value='#112233';first.oninput();assert.match(document.querySelector('#item-colors').value,/#112233/);
 document.querySelector('#item-colors').value='abc 743b61, #43867b';document.querySelector('#palette-apply').onclick();assert.equal(document.querySelectorAll('[data-color]').length,3);
 document.querySelector('#item-title').value='Test visual palette';await document.querySelector('#item-form').onsubmit({preventDefault(){}});assert.equal(run('items.at(-1).colors.join(",")'),'#AABBCC,#743B61,#43867B');
 run("openEditor(null,items.at(-1))");assert.equal(document.querySelectorAll('[data-color]').length,3);document.querySelector('#editor').close();
 run("view='canvas'");document.querySelector('#board').getBoundingClientRect=()=>({left:100,top:200});
 document.querySelector('#board-wrap').ondblclick({target:document.querySelector('#board'),clientX:360,clientY:525});assert.equal(run('draftPosition.x'),260);assert.equal(run('draftPosition.y'),325);
 document.querySelector('#item-title').value='At the click';await document.querySelector('#item-form').onsubmit({preventDefault(){}});assert.equal(run('items.at(-1).x'),260);assert.equal(run('items.at(-1).y'),325);
 document.querySelector('#board-wrap').ondblclick({target:document.querySelector('.card'),clientX:50,clientY:50});assert.equal(document.querySelector('#editor').hasAttribute('open'),false);
 const stored=new Map();ctx.localStorage={getItem:k=>stored.get(k),setItem:(k,v)=>stored.set(k,v)};
 run('maybeShowTour()');assert.equal(document.querySelector('#tour').hasAttribute('open'),true);document.querySelector('#tour-skip').onclick();run('maybeShowTour()');assert.equal(document.querySelector('#tour').hasAttribute('open'),false);
 document.querySelector('#tour-open').onclick();assert.equal(document.querySelector('#tour').hasAttribute('open'),true);document.querySelector('#tour').close();run("tourSeen=false;maybeShowTour()");assert.equal(document.querySelector('#tour').hasAttribute('open'),false);
 document.querySelector('#auth').close();run('showRecoveryError()');assert.equal(run('authMode'),'recover');assert.equal(document.querySelector('#password-label').hidden,true);assert.equal(document.querySelector('#auth-password').required,false);assert.match(document.querySelector('#auth-error').textContent,/invalid, expired, or has already been used/);
 ctx.requestedReset=null;run("db={auth:{resetPasswordForEmail:async(email,options)=>{requestedReset={email,options};return {data:{}}}}}");await document.querySelector('#auth-form').onsubmit({preventDefault(){}});assert.equal(ctx.requestedReset.options.redirectTo,'https://tinysitestudios.com/weddings/wedding-studio/');assert.equal(document.querySelector('#auth-submit').hidden,true);assert.equal(document.querySelector('#auth-resend').hidden,true);
 run('beginPasswordRecovery()');assert.equal(run('authMode'),'reset');assert.equal(document.querySelector('#email-label').hidden,true);assert.equal(document.querySelector('#password-label').hidden,false);assert.equal(document.querySelector('#auth-password').required,true);assert.equal(document.querySelector('#auth-password').value,'');assert.equal(document.querySelector('#auth-submit').textContent,'Update password');document.querySelector('#auth').close();
 // Exercise the added planning flows with the real board/editor handlers.
 run("db=null;demo=true;user=null;memberRole='owner';loadDemo()");
 assert.equal(run('view'),'canvas');
 run("openEditor(null,items[0]);draftTags=['Flowers','Reception','Personal touch'];renderTagPicker()");
 await document.querySelector('#item-form').onsubmit({preventDefault(){}});
 assert.equal(run("items[0].tags.join(',')"),'Flowers,Reception,Personal touch');
 run("category='Flowers';render()");assert(run("filtered().some(i=>i.id===items[0].id)"));
 run("category='Reception';render()");assert(run("filtered().some(i=>i.id===items[0].id)"));
 run("category='All inspiration';render()");
 const checklist=run("items.find(i=>i.kind==='checklist').id");
 await document.querySelector(`[data-task-view="${checklist}"]`).onclick();assert.equal(run("items.find(i=>i.kind==='checklist').task_view"),'kanban');
 const progress=document.querySelector('[data-task-status]');Object.defineProperty(progress,'value',{value:'doing',writable:true});await progress.onchange();await new Promise(r=>setTimeout(r,10));ctx.changedTask=progress.dataset.taskStatus;assert.equal(run("items.find(i=>i.kind==='checklist').tasks.find(t=>t.id===changedTask).status"),'doing');
 document.querySelector('#templates-open').onclick();document.querySelector('#template-select').value=ctx.window.StudioTemplates[0].id;document.querySelector('#template-start').value='2026-10-01';document.querySelector('#template-end').value='2027-10-01';document.querySelector('#template-preview').onclick();assert.equal(document.querySelector('#template-import').disabled,false);await document.querySelector('#template-import').onclick();assert(run("items.at(-1).tasks.length>20"));assert.equal(run("items.at(-1).template_meta.end"),'2027-10-01');
 document.querySelector('#seating-open').onclick();document.querySelector('#seating-guests').value='Alice\nBob';document.querySelector('#seating-tables').value='2';document.querySelector('#seating-apply').onclick();assert.equal(run('seatDraft.guests.length'),2);assert(run("seatRoom.seatGuest(seatDraft.guests[0].id,'table-1',0)"));await document.querySelector('#seating-save').onclick();assert.equal(run("items.at(-1).seating.guests[0].table"),'table-1');document.querySelector('#seating-modal').close();run("openSeating(items.at(-1))");assert.equal(run("seatRoom.snapshot().tables[0].seats[0]"),run("seatDraft.guests[0].id"));document.querySelector('#seating-modal').close();
 // Pricing must work before sign-in; trials require confirmation before board creation.
 run("demo=false;user=null;board={title:'Our wedding'};render()");
 assert(document.querySelector('#seating-open').closest('aside'));
 assert(document.querySelector('#tools-open').closest('aside'));
 assert(document.querySelector('#purchase-open').closest('.access-banner'));
 document.querySelector('#purchase-open').onclick();assert(document.querySelector('#purchase-modal').hasAttribute('open'));assert.equal(document.querySelector('#checkout-start').hidden,true);document.querySelector('#purchase-modal').close();
 document.querySelector('#trial-open').onclick();assert.equal(run('authMode'),'signup');document.querySelector('#auth').close();
 ctx.trialWrites=0;ctx.trialRecord=null;
 run(`user={id:'trial-owner'};boardOwner=null;items=[];loading=false;db={from:table=>({
   select(){return this},eq(){return this},in(){return this},
   maybeSingle:async()=>({data:trialRecord}),single:async()=>({data:trialRecord}),
   then(resolve){resolve({data:table==='wedding_studio_boards'?(trialRecord?[trialRecord]:[]):[]})},
   order:async()=>({data:[]}),insert:async()=>{trialWrites++;trialRecord={user_id:user.id,title:'Our wedding',created_at:new Date().toISOString()};return {data:null}}
 })}`);
 const declined=run('loadCloud()');await new Promise(r=>setTimeout(r,10));assert(document.querySelector('#trial-modal').hasAttribute('open'));assert.equal(ctx.trialWrites,0);document.querySelector('#trial-later').onclick();await declined;assert.equal(ctx.trialWrites,0);
 const accepted=run('loadCloud()');await new Promise(r=>setTimeout(r,10));document.querySelector('#trial-confirm').onclick();await accepted;assert.equal(ctx.trialWrites,1);assert.equal(document.querySelector('#trial-open').hidden,true);assert.match(document.querySelector('#access-state').textContent,/Trial through/);
 const startedAt=ctx.trialRecord.created_at;await run('loadCloud()');assert.equal(ctx.trialWrites,1);assert.equal(ctx.trialRecord.created_at,startedAt);assert.equal(document.querySelector('#trial-modal').hasAttribute('open'),false);
 console.log('Visible guest pricing, sidebar tools, explicit trial confirmation/cancel, and unchanged trial dates on reload passed.');
 console.log('Multi-tag filtering, checklist-to-kanban updates, template dates, and seating assignment save/reopen passed.');
 console.log('Expired-link recovery, canonical reset redirect, and new-password mode passed.');
 console.log('Visual palette save/edit, double-click coordinates, card exclusion, and first-visit/replay tour passed.');
 console.log('Signup without a session offers sign-in without claiming an email was sent.');
 console.log('Direct URL/text paste, multi-file capture, pin destination + thumbnail, and editable-field checks passed.');
})().catch(e=>{console.error(e);process.exitCode=1});
