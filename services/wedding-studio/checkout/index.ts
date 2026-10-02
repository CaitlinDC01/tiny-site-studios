import { createClient } from 'npm:@supabase/supabase-js@2.117.2';
import {validSignature,matchesPayment} from './validation.ts';
const home='https://tinysitestudios.com/weddings/wedding-studio/';
const headers={'Access-Control-Allow-Origin':'https://tinysitestudios.com','Access-Control-Allow-Headers':'authorization, apikey, content-type','Access-Control-Allow-Methods':'GET, POST, OPTIONS','Content-Type':'application/json','Cache-Control':'no-store'};
const response=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers});
const admin=()=>createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false}});
const environment=()=>Deno.env.get('WS_SQUARE_ENVIRONMENT')||'production';
const locationId=()=>Deno.env.get('WS_SQUARE_LOCATION_ID')||'';
async function square(path:string,body?:unknown){
 const key=Deno.env.get('WS_SQUARE_ACCESS_TOKEN');if(!key)throw Error('Square checkout is being connected. Your board remains available during setup.');
 const base=environment()==='sandbox'?'https://connect.squareupsandbox.com/v2/':'https://connect.squareup.com/v2/';
 const r=await fetch(base+path,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+key,'Square-Version':'2026-09-16','Content-Type':'application/json'},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(15000)});
 const d=await r.json();if(!r.ok)throw Error('Square could not complete this request. Please try again.');return d;
}
async function fulfill(paymentId:string,expectedOwner?:string){
 if(!/^[a-zA-Z0-9_-]{1,192}$/.test(paymentId))throw Error('Invalid payment reference');
 const {payment}=await square('payments/'+encodeURIComponent(paymentId));if(payment?.status!=='COMPLETED'||!payment.order_id)return false;
 const {order}=await square('orders/'+encodeURIComponent(payment.order_id));
 if(!/^[0-9a-f-]{36}$/i.test(order?.reference_id||''))return false;
 const db=admin();const {data:checkout,error}=await db.from('wedding_studio_checkouts').select('*').eq('purchase_ref',order.reference_id).maybeSingle();if(error)throw Error('Unable to verify purchase');
 if(!checkout)return false;if(expectedOwner&&checkout.board_owner!==expectedOwner)throw Error('This purchase belongs to another wedding workspace');
 if(!matchesPayment(payment,order,checkout,locationId()))return false;
 const {error:saveError}=await db.from('wedding_studio_boards').update({paid_at:payment.updated_at||new Date().toISOString(),purchase_id:'square:'+payment.id}).eq('user_id',checkout.board_owner).is('paid_at',null);if(saveError)throw Error('Unable to save purchase');return true;
}
async function verifyPurchase(ref:string,owner:string){
 if(!/^[0-9a-f-]{36}$/i.test(ref))throw Error('Invalid checkout reference');
 const db=admin();const {data:c,error}=await db.from('wedding_studio_checkouts').select('*').eq('purchase_ref',ref).eq('board_owner',owner).maybeSingle();if(error||!c)throw Error('Checkout does not match your wedding workspace');
 const {data:board}=await db.from('wedding_studio_boards').select('paid_at').eq('user_id',owner).single();if(board?.paid_at)return true;if(!c.order_id)return false;
 const {order}=await square('orders/'+encodeURIComponent(c.order_id));for(const tender of order?.tenders||[]){if(tender.payment_id&&await fulfill(tender.payment_id,owner))return true}return false;
}
async function webhook(req:Request){
 const secret=Deno.env.get('WS_SQUARE_WEBHOOK_SIGNATURE_KEY'),url=Deno.env.get('WS_SQUARE_WEBHOOK_URL');if(!secret||!url)return response({error:'Webhook not configured'},503);
 const raw=await req.text();if(raw.length>1000000)return response({error:'Payload too large'},413);
 if(!await validSignature(raw,req.headers.get('x-square-hmacsha256-signature')||'',secret,url))return response({error:'Invalid signature'},403);
 const event=JSON.parse(raw);if(['payment.created','payment.updated'].includes(event.type)&&event.data?.object?.payment?.status==='COMPLETED')await fulfill(event.data.object.payment.id);
 return response({received:true});
}
Deno.serve(async req=>{
 if(req.method==='OPTIONS')return new Response(null,{headers});const action=new URL(req.url).searchParams.get('action');
 try{
  if(action==='webhook'&&req.method==='POST')return await webhook(req);
  const db=admin(),{data:offer,error}=await db.from('wedding_studio_offer').select('*').eq('id',true).single();if(error)throw Error('Unable to load pricing');
  const ready=environment()==='production'&&!!Deno.env.get('WS_SQUARE_ACCESS_TOKEN')&&!!locationId()&&!!Deno.env.get('WS_SQUARE_WEBHOOK_SIGNATURE_KEY')&&!!Deno.env.get('WS_SQUARE_WEBHOOK_URL')&&offer.payments_live;
  if(req.method==='GET'&&action==='status')return response({ready,provider:'square',price_cents:offer.price_cents,introductory:offer.introductory});
  if(req.method!=='POST')return response({error:'Method not allowed'},405);
  const token=req.headers.get('Authorization')?.replace(/^Bearer /,'')||'';const {data:{user},error:authError}=await db.auth.getUser(token);if(authError||!user)return response({error:'Sign in to continue'},401);
  const body=await req.json();if(action==='verify')return response({paid:await verifyPurchase(String(body.purchase_ref||''),user.id)});
  if(action!=='checkout')return response({error:'Unknown action'},400);
  if(!ready)return response({error:'Square checkout is being connected. Your board remains available during setup.'},503);
  const {data:board}=await db.from('wedding_studio_boards').select('paid_at').eq('user_id',user.id).single();if(!board)return response({error:'Create your wedding board first'},400);if(board.paid_at)return response({error:'Your wedding workspace is already purchased'},409);
  let {data:checkout,error:lookupError}=await db.from('wedding_studio_checkouts').select('*').eq('board_owner',user.id).maybeSingle();if(lookupError)throw Error('Unable to start checkout');
  if(!checkout){
   const ref=crypto.randomUUID();const payload={idempotency_key:ref,order:{location_id:locationId(),reference_id:ref,line_items:[{name:'The Wedding Studio by TSS',quantity:'1',base_price_money:{amount:offer.price_cents,currency:'USD'}}]},checkout_options:{allow_tipping:false,ask_for_shipping_address:false,redirect_url:home+'?purchase='+ref},pre_populated_data:{buyer_email:user.email},payment_note:'One wedding workspace. Unlimited vendor collaborators and Seat Studio included.'};
   const {data,error:insertError}=await db.from('wedding_studio_checkouts').insert({board_owner:user.id,purchase_ref:ref,price_cents:offer.price_cents,environment:environment(),request_payload:payload}).select('*').single();
   if(insertError?.code==='23505'){const existing=await db.from('wedding_studio_checkouts').select('*').eq('board_owner',user.id).single();checkout=existing.data}else if(insertError)throw Error('Unable to start checkout');else checkout=data;
  }
  if(!checkout||checkout.environment!==environment())throw Error('Checkout configuration changed. Please contact TSS.');
  if(checkout.checkout_url)return response({url:checkout.checkout_url});
  const {payment_link:link}=await square('online-checkout/payment-links',checkout.request_payload);if(!link?.url||!link.order_id)throw Error('Square checkout is unavailable');
  const {error:saveError}=await db.from('wedding_studio_checkouts').update({order_id:link.order_id,payment_link_id:link.id,checkout_url:link.url}).eq('board_owner',user.id);if(saveError)throw Error('Unable to save checkout. Please try again.');return response({url:link.url});
 }catch(e){console.error('Wedding Studio Square checkout failed');return response({error:e instanceof Error?e.message:'Unable to complete checkout'},action==='webhook'?500:400)}
});
