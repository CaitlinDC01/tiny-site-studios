import {createClient} from 'npm:@supabase/supabase-js@2.117.2';
import {fetchPreview} from './preview.mjs';
import {requestPinned} from './transport.ts';
const headers={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'authorization, apikey, content-type, x-client-info','Content-Type':'application/json','Cache-Control':'no-store'};
const reply=(body:unknown,status=200)=>new Response(JSON.stringify(body),{headers,status});
const usage=new Map<string,{start:number,count:number}>();
// Only this public sample URL is available without a signed-in user.
const demoURL='https://tinysitestudios.com/weddings/demos/garden/';
Deno.serve(async req=>{
 if(req.method==='OPTIONS')return new Response(null,{headers});
 if(req.method!=='POST')return reply({error:'Method not allowed'},405);
 let url:string;
 try{
 if(Number(req.headers.get('content-length'))>5000)return reply({error:'Link too long.'},400);
 const reader=req.body?.getReader();if(!reader)return reply({error:'A link is required.'},400);
 let body='',bytes=0;const decoder=new TextDecoder();while(true){const {value,done}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>5000){await reader.cancel();return reply({error:'Link too long.'},400)}body+=decoder.decode(value,{stream:true})}body+=decoder.decode();
 url=JSON.parse(body).url;if(typeof url!=='string')return reply({error:'A link is required.'},400);
 }catch{return reply({error:'A valid link is required.'},400)}
 let identity='public-demo';
 if(url!==demoURL){
 // Custom JWT authentication is required before any arbitrary outbound request.
 const bearer=req.headers.get('authorization')?.replace(/^Bearer\s+/i,'');
 if(!bearer)return reply({error:'Sign in to load link previews.'},401);
 const db=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_ANON_KEY')!);
 const {data,error}=await db.auth.getUser(bearer);
 if(error||!data.user)return reply({error:'Sign in to load link previews.'},401);
 identity=data.user.id;
 }
 const now=Date.now();for(const [id,bucket] of usage)if(now-bucket.start>60000)usage.delete(id);
 const bucket=usage.get(identity)||{start:now,count:0};bucket.count++;usage.set(identity,bucket);
 if(bucket.count>40)return reply({error:'Try refreshing this preview in a minute.'},429);
 try{return reply(await fetchPreview(url,requestPinned))}catch(error){console.error('Link preview failed:',error instanceof Error?error.message:'Unknown error');return reply({error:'This site could not supply a preview. Your link is safe to save; add a cover image instead.'},422)}
});
