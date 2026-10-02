import {matchesPayment,validSignature} from './validation.ts';
function assert(value:unknown,label:string){if(!value)throw Error(label)}
Deno.test('Square notification signatures bind the exact URL and raw body',async()=>{
 const raw='{"event":"payment.updated"}',url='https://example.test/checkout?action=webhook',secret='test-only';
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const sig=btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(url+raw)))));
 assert(await validSignature(raw,sig,secret,url),'valid notification');assert(!await validSignature(raw+' ',sig,secret,url),'tampered body');assert(!await validSignature(raw,sig,secret,url+'x'),'different URL');assert(!await validSignature(raw,'',secret,url),'missing signature');
});
Deno.test('Only a matching completed production payment grants access',()=>{
 const c={environment:'production',purchase_ref:'nonce',order_id:'order',price_cents:2900};const o={id:'order',reference_id:'nonce',location_id:'location',total_money:{amount:2900,currency:'USD'}};
 const p={status:'COMPLETED',order_id:'order',location_id:'location',amount_money:{amount:2900,currency:'USD'}};
 assert(matchesPayment(p,o,c,'location'),'completed matching payment');
 for(const patch of [{status:'APPROVED'},{status:'FAILED'},{order_id:'other'},{location_id:'other'},{amount_money:{amount:1,currency:'USD'}},{amount_money:{amount:2900,currency:'CAD'}},{refunded_money:{amount:2900}}])assert(!matchesPayment({...p,...patch},o,c,'location'),'mismatch rejected');
 assert(!matchesPayment(p,o,{...c,environment:'sandbox'},'location'),'sandbox cannot unlock production');assert(!matchesPayment(p,{...o,reference_id:'other'},c,'location'),'other workspace rejected');
});
