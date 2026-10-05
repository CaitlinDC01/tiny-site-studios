'use strict';
/* Optional account sync. The public publishable key is never a privileged credential. */
(() => {
  const SESSION_KEY='birthday-adventure-account-v1';
  let session=null, saving=null, timer=null, pendingEmail='';
  try { session=JSON.parse(localStorage.getItem(SESSION_KEY)); } catch {}
  const setSession=s=>{session=s; if(s)localStorage.setItem(SESSION_KEY,JSON.stringify(s));else localStorage.removeItem(SESSION_KEY)};
  async function api(path,options={}) {
    const r=await fetch(`${BASE}/${path}`,{...options,headers:{apikey:KEY,'Content-Type':'application/json',...(options.auth?{Authorization:`Bearer ${session?.access_token||KEY}`}:{Authorization:`Bearer ${KEY}`}),...options.headers}});
    const data=await r.json().catch(()=>null);
    if(!r.ok)throw Error(data?.msg||data?.error_description||data?.message||'Account service is unavailable.');
    return data;
  }
  async function refresh(){
    if(!session?.refresh_token)return false;
    try { const s=await api('auth/v1/token?grant_type=refresh_token',{method:'POST',body:JSON.stringify({refresh_token:session.refresh_token})});setSession(s);return true; }
    catch {setSession(null);return false}
  }
  async function ready(){
    if(!session)return false;
    if(!session.expires_at||Date.now()/1000>session.expires_at-60) return refresh();
    return true;
  }
  async function cloudRequest(method='GET',payload){
    if(!await ready())throw Error('Please sign in again. Your device copy is still saved.');
    return api('rest/v1/birthday_plans?user_id=eq.'+encodeURIComponent(session.user.id)+(method==='GET'?'&select=plan,updated_at':''),{method,auth:true,headers:method==='POST'?{Prefer:'resolution=merge-duplicates,return=minimal'}:{},body:payload?JSON.stringify(payload):undefined});
  }
  async function upload(){
    if(!session||!state.profile)return;
    await cloudRequest('POST',{user_id:session.user.id,plan:state,updated_at:new Date().toISOString()});
  }
  function scheduleSave(){
    if(!session)return;
    clearTimeout(timer);
    timer=setTimeout(async()=>{try{saving=upload();await saving}catch(e){toast('Saved on this device; cloud sync failed. '+e.message)}finally{saving=null}},900);
  }
  async function reconcile(){
    const rows=await cloudRequest();const cloud=rows?.[0]?.plan;
    if(cloud?.profile&&state.profile){
      open(`<span class="eyebrow">TWO SAVED ADVENTURES</span><h2>Which plan should we keep?</h2><p>This device and your account both have a birthday plan. Choose before syncing; the other copy will be replaced.</p><div class="actions"><button class="primary" id="useCloud">Use my account plan</button><button class="outline" id="useDevice">Use this device’s plan</button></div>`);
    } else if(cloud?.profile){state=cloud;save();view='plan';render();toast('Your account plan is ready.');}
    else if(state.profile){await upload();toast('Your device plan is saved to your account.');}
    else toast('Signed in. Build a plan to save it across devices.');
  }
  function accountDialog(){
    if(session){open(`<span class="eyebrow">YOUR BIRTHDAY ACCOUNT</span><h2>Saved across devices.</h2><p>Signed in as ${esc(session.user.email)}. Changes sync to your private account when online. Your plan also stays in this browser.</p><div class="actions"><button class="outline" id="pullCloud">Check my saved plan</button><button class="outline" id="accountSignOut">Sign out</button></div><p class="tiny">Signing out clears the plan from this browser after it has synced. Keep a JSON backup if you want another copy.</p>`);return}
    open(`<span class="eyebrow">OPTIONAL ACCOUNT</span><h2>Take your adventure with you.</h2><p class="subtle">Enter your email to create a free account or sign in. We’ll send a one-time code and link. Your email is for account access only; no marketing signup.</p><form id="accountForm"><label>Email<input name="email" type="email" autocomplete="email" maxlength="254" required></label><p id="accountError" class="error" role="alert"></p><button class="primary" style="margin-top:18px">Email me a sign-in code →</button></form><p class="tiny">Enter the newest code here to sync your private plan. You can keep using Birthday Adventure without an account.</p>`);
  }
  document.addEventListener('click',async e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.id==='account'||b.dataset.account)accountDialog();
    if(b.id==='useCloud'){try{const rows=await cloudRequest();state=rows[0].plan;save();close();view='plan';render();toast('Your account plan is now on this device.')}catch(err){toast(err.message)}}
    if(b.id==='useDevice'){try{await upload();close();toast('This device’s plan is saved to your account.')}catch(err){toast(err.message)}}
    if(b.id==='pullCloud'){close();try{await reconcile()}catch(err){toast(err.message)}}
    if(b.id==='accountSignOut'){
      try{clearTimeout(timer);if(saving)await saving;if(state.profile)await upload();await api('auth/v1/logout',{method:'POST',auth:true})}catch(err){toast('Could not complete sign out: '+err.message);return}
      setSession(null);localStorage.removeItem('birthday-adventure-v1');state={profile:null,claims:{},bookings:{},verified:{},members:{}};view='home';close();render();toast('Signed out. This browser’s plan was cleared.');
    }
  });
  document.addEventListener('submit',async e=>{
    if(e.target.id!=='accountForm')return;e.preventDefault();
    const f=e.target,v=Object.fromEntries(new FormData(f)),error=f.querySelector('#accountError');
    error.textContent='';f.querySelector('button').disabled=true;
    try{
      await api('auth/v1/otp?redirect_to='+encodeURIComponent('https://tinysitestudios.com/birthday-adventure/'),{method:'POST',body:JSON.stringify({email:v.email,create_user:true})});
      pendingEmail=v.email;
      open(`<span class="eyebrow">CHECK YOUR INBOX</span><h2>Enter your sign-in code.</h2><p class="subtle">We sent a one-time code to ${esc(v.email)}. Enter it here to save your adventure to your account. You can also use the email link, but the code keeps you on this page.</p><form id="otpCodeForm"><label>Sign-in code<input name="code" type="text" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6,8}" minlength="6" maxlength="8" required></label><p id="codeError" class="error" role="alert"></p><button class="primary" style="margin-top:18px">Sign in & save my plan →</button></form><p class="tiny">Use the newest email. Each code works once and expires in one hour. Need another? <button class="text-button" data-account="again">Request a new code</button></p>`);
    }catch(err){error.textContent=err.message}
    finally{f.querySelector('button').disabled=false}

  });
  document.addEventListener('submit',async e=>{
    if(e.target.id!=='otpCodeForm')return;e.preventDefault();
    const f=e.target,error=f.querySelector('#codeError'),code=new FormData(f).get('code')?.toString().trim();
    error.textContent='';f.querySelector('button').disabled=true;
    try{
      const s=await api('auth/v1/verify',{method:'POST',body:JSON.stringify({email:pendingEmail,token:code,type:'email'})});
      if(!s?.access_token||!s?.user)throw Error('The code could not be verified. Please try the newest email.');
      setSession({...s,expires_at:s.expires_at||Math.floor(Date.now()/1000)+Number(s.expires_in||3600)});
      close();await reconcile();
    }catch(err){error.textContent=err.message}
    finally{f.querySelector('button').disabled=false}
  });
  window.birthdayAccount={scheduleSave,signedIn:()=>!!session};
  (async()=>{
    const hash=new URLSearchParams(location.hash.slice(1));
    if(hash.has('error')){
      history.replaceState(null,'',location.pathname+location.search);
      toast('That email link has expired or was already used. Request a new code from Account.');
    }
    if(hash.has('access_token')&&hash.has('refresh_token')){
      const token=hash.get('access_token'),refresh_token=hash.get('refresh_token');
      setSession({access_token:token,refresh_token,expires_at:Math.floor(Date.now()/1000)+Number(hash.get('expires_in')||3600),user:{id:'',email:''}});
      try{const user=await api('auth/v1/user',{auth:true});setSession({...session,user});history.replaceState(null,'',location.pathname+location.search)}
      catch(e){setSession(null);toast('The sign-in link could not be verified. Please request a new one.');return}
    }
    if(await ready()){try{await reconcile()}catch(err){toast('Account plan could not load. Device plan is still here.')}}
  })();
})();
