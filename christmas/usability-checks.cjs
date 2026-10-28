const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'index.html'),'utf8');const block=html.slice(html.indexOf('// Storage reads never replace'),html.indexOf('function downloadText'));
const stored={version:2,year:2026,people:[{name:'Keep my real person'}],shopping:[{text:'Existing list'}]};let disk=JSON.stringify(stored),calls=0;const backend={getItem(){return disk},setItem(k,v){calls++;disk=v}};const notice={textContent:''};
let checks=`
const good=readPlanner(window.localStorage,key,x=>x);nodeAssert.equal(good.kind,'valid');nodeAssert.equal(good.data.people[0].name,'Keep my real person');
const broken=readPlanner({getItem:()=>'{broken'},key,JSON.parse);nodeAssert.equal(broken.kind,'unreadable');nodeAssert.equal(broken.raw,'{broken');
const guarded=writePlanner(window.localStorage,key,{bad:'replacement'},true);nodeAssert.equal(guarded.ok,false);nodeAssert.equal(JSON.parse(window.localStorage.getItem(key)).people[0].name,'Keep my real person');
const badBackend={getItem(){throw Error('Blocked')},setItem(){throw Error('QuotaExceeded')}};nodeAssert.equal(readPlanner(badBackend,key,x=>x).kind,'unavailable');nodeAssert.equal(writePlanner(badBackend,key,{}).ok,false);
window.localStorage=badBackend;nodeAssert.equal(save(),false);notify('Saved!');nodeAssert.equal(hasUnsavedChanges,true);nodeAssert.match($('#notice').textContent,/only in this tab/);nodeAssert.doesNotMatch($('#notice').textContent,/Saved!/);
window.localStorage=originalBackend;nodeAssert.equal(save(),true);nodeAssert.equal(hasUnsavedChanges,false);notify('Saved!');nodeAssert.equal($('#notice').textContent,'Saved!');
nodeAssert.deepEqual(emptyPlanner(2027).people,[]);nodeAssert.deepEqual(emptyPlanner(2027).mealPlans,[]);
console.log('Passed: existing planner preservation, corrupt-data protection, blocked storage, honest failure feedback, successful retry, and empty planner initialization.');
`;
vm.runInNewContext(html.slice(html.indexOf('function migrateShopping'),html.indexOf('function validateRecipeExtras'))+html.slice(html.indexOf('function pantryStatus'),html.indexOf('function validatePantry'))+html.slice(html.indexOf('function syncLinkedMeals'),html.indexOf('function linkedEvent('))+block+checks,{window:{localStorage:backend},originalBackend:backend,nodeAssert:assert,console,JSON,Date,defaultYear:2026,data:stored,key:'test-planner',$:s=>s==='#notice'?notice:null});
