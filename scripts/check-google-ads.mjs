import {readFileSync,existsSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=readFileSync('google-ads.js','utf8');
function run({embedded=false,hash='',search='',existing=false}={}){
 const requests=[],calls=[];
 const w={location:{hash,search},dataLayer:[]};w.self=w;w.top=embedded?{}:w;
 if(existing)w.gtag=(...args)=>calls.push(args);
 const d={querySelector:()=>existing?{}:null,createElement:()=>({}),head:{appendChild:s=>requests.push(s)}};
 const context={window:w,document:d,URLSearchParams};
 vm.runInNewContext(source,context);vm.runInNewContext(source,context);
 const events=existing?calls:w.dataLayer.map(x=>Array.from(x));
 return {requests,events};
}
for(const options of [{},{existing:true},{search:'?gclid=campaign123&utm_source=google'}]){
 const r=run(options);assert.equal(r.events.filter(e=>e[0]==='config'&&e[1]==='AW-18390015739').length,1);
 assert.equal(r.requests.length,options.existing?0:1);
 assert.equal(r.events.find(e=>e[0]==='config')[2].allow_ad_personalization_signals,false);
}
for(const options of [{embedded:true},{hash:'#temporary-token'},{search:'?token=secret'},{search:'?name=Student'},{search:'?gclid=123&email=private'}]){
 const r=run(options);assert.equal(r.requests.length,0);assert.equal(r.events.length,0);
}
const scope=JSON.parse(readFileSync('docs/google-ads-scope.json'));
for(const path of scope.included){
 const html=readFileSync(path,'utf8');const matches=[...html.matchAll(/<script src="([^"]+)" defer data-tss-ads><\/script>/g)];
 assert.equal(matches.length,1,path);assert.ok(existsSync(resolve(dirname(path),matches[0][1])),path);
 assert.ok(!/gtag\('config', 'AW-18390015739'\)/.test(html),path);
}
for(const path of scope.excluded)assert.ok(!readFileSync(path,'utf8').includes('data-tss-ads'),path);
assert.equal(source,readFileSync('christmas/google-ads.js','utf8'));
assert.ok(!/localStorage|sessionStorage|querySelectorAll|\.value|\.textContent|\.innerHTML/.test(source));
console.log(`Passed: one-time initialization, loader reuse, 5 privacy guards, ${scope.included.length} page includes, ${scope.excluded.length} exclusions.`);
