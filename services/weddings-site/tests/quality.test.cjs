const fs=require('node:fs'), vm=require('node:vm'), assert=require('node:assert/strict'), path=require('node:path');
const {parseHTML}=require('linkedom');
const root=path.resolve(__dirname,'../../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const source=read('weddings/subpage.js');
function recommend(values){
 const {document}=parseHTML('<html><body><form data-package-finder>'+values.map(v=>`<input type="checkbox" checked value="${v}">`).join('')+'<div data-finder-result></div></form></body></html>');
 vm.runInNewContext(source,{document,location:{search:''},URLSearchParams});
 return document.querySelector('[data-finder-result]').textContent;
}
assert.match(recommend([]),/Choose the features/);
assert.match(recommend(['guestbook']),/Guestbook Live/);
assert.doesNotMatch(recommend(['guestbook']),/Essentials|\$99/);
assert.match(recommend(['rsvp','meals']),/RSVP Only · \$29/);
assert.match(recommend(['seating']),/Seating Studio · \$29/);
assert.match(recommend(['seat-finder','dj']),/Wedding Hub · \$199/);
assert.match(recommend(['seat-finder','dj']),/additional standard guest tool · \$19/);
assert.match(recommend(['seat-finder','dj','updates']),/Full Experience · \$249/);
assert.match(recommend(['live-itinerary']),/Full Experience · \$249/);
assert.doesNotMatch(recommend(['party-guide','rsvp']),/Full Experience|\$249/);
assert.doesNotMatch(recommend(['core','guestbook']),/\$19 when replacing/);
// Exercise the actual budget allocator against totals that previously rounded each row independently.
const budget=read('weddings/tools/budget/budget.js');
const categories=budget.slice(budget.indexOf('const categories='),budget.indexOf('function show'));
const allocate=budget.slice(budget.indexOf('function allocate('),budget.indexOf('function build('));
const context=vm.createContext({});vm.runInContext(categories+allocate+';this.allocate=allocate',context);
for(const total of [1,99,999,25000,25317,100000,19999.75])for(const priorities of [[],['photos'],['food','venue','lowstress'],['photos','florals','attire']]){
 const rows=context.allocate(total,priorities);
 assert.equal(rows.reduce((s,r)=>s+r.amount,0),Math.round(total));
 assert.equal(rows.reduce((s,r)=>s+r.displayPct,0),100);
 assert.ok(rows.every(r=>r.amount>=0&&Number.isFinite(r.amount)));
}
// Initial tool loading should leave the introduction visible; navigation still scrolls to the next question.
for(const p of ['budget/budget','can-i-afford-this/afford','just-engaged/planner','diy-or-hire/diy'])assert.match(read('weddings/tools/'+p+'.js'),/show\(0, false\)/);
// Guard asynchronous clipboard buttons against the event target being cleared after dispatch.
const hashtag=read('weddings/tools/hashtag-generator/hashtag.js');
assert.doesNotMatch(hashtag,/e\.currentTarget\.textContent/);
assert.match(hashtag,/const button = e.currentTarget/);
assert.match(read('weddings/demos/experience.js'),/no response was saved or confirmation sent/);
console.log('Wedding QA: 11 recommendation cases and 28 budget scenarios passed.');
