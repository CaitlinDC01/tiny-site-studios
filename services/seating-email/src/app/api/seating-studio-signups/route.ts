import { createHmac } from "node:crypto";
import { GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { z } from "zod";

export const runtime = "nodejs";
const ALLOWED_ORIGIN = "https://tinysitestudios.com";
const schema = z.object({firstName:z.string().trim().min(1).max(80),email:z.string().trim().email().max(254),website:z.string().max(200).default("")});
const escape=(value:string)=>value.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]!);
const headers=(origin:string|null)=>({...origin===ALLOWED_ORIGIN?{"Access-Control-Allow-Origin":ALLOWED_ORIGIN}:{},"Access-Control-Allow-Methods":"GET, POST, OPTIONS","Access-Control-Allow-Headers":"Content-Type","Cache-Control":"no-store",Vary:"Origin"});
const json=(body:unknown,status=200,origin:string|null=null)=>Response.json(body,{status,headers:headers(origin)});

function store(){
 const accountId=process.env.R2_ACCOUNT_ID,accessKeyId=process.env.R2_ACCESS_KEY_ID,secretAccessKey=process.env.R2_SECRET_ACCESS_KEY,bucket=process.env.R2_BUCKET;
 if(!accountId||!accessKeyId||!secretAccessKey||!bucket)throw new Error("R2 is not configured.");
 const client=new S3Client({region:"auto",endpoint:`https://${accountId}.r2.cloudflarestorage.com`,credentials:{accessKeyId,secretAccessKey}});
 return {
  async read(key:string){try{const value=await client.send(new GetObjectCommand({Bucket:bucket,Key:key}));return JSON.parse(await value.Body!.transformToString())}catch(error){if((error as {$metadata?:{httpStatusCode?:number}}).$metadata?.httpStatusCode===404)return null;throw error}},
  async write(key:string,value:unknown){await client.send(new PutObjectCommand({Bucket:bucket,Key:key,Body:JSON.stringify(value),ContentType:"application/json",CacheControl:"private, no-store"}))},
  async list(prefix:string){const value=await client.send(new ListObjectsV2Command({Bucket:bucket,Prefix:prefix,MaxKeys:100}));return (value.Contents||[]).flatMap(item=>item.Key?[item.Key]:[])},
 };
}

function sender(){const configured=process.env.RESEND_EMAIL_DOMAIN?.trim();if(!configured)throw new Error("Email domain is not configured.");const address=configured.includes("@")?configured:`memories@${configured}`;return `Tiny Site Studios <${address}>`}
async function sendEmail(email:{from:string;to:string;reply_to?:string;subject:string;html:string;text?:string;tags?:Array<{name:string;value:string}>},key:string){
 const apiKey=process.env.RESEND_API_KEY;if(!apiKey)throw new Error("Resend is not configured.");
 const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${apiKey}`,"Content-Type":"application/json","Idempotency-Key":key},body:JSON.stringify(email)});
 const result=await response.json().catch(()=>null) as {id?:string;message?:string}|null;if(!response.ok||!result?.id)throw new Error(result?.message||"Email could not be sent.");
}

function emailContent(firstName:string,token:string){
 const demoUrl=`https://tinysitestudios.com/weddings/demos/seating-studio/?access=${encodeURIComponent(token)}`,finderUrl=`${demoUrl}&view=finder`,weddingsUrl="https://tinysitestudios.com/weddings/";
 const text=`Hi ${firstName},

Your Seating Studio demo is ready.

Open the seating planner: ${demoUrl}
Preview the guest Seat Finder: ${finderUrl}
Explore Tiny Site Studios weddings: ${weddingsUrl}

Inside the demo, you can move sample guests, arrange the reception room, catch seating concerns, download a sample seating PDF, and preview the guest-facing Seat Finder.

Your personal demo links work for 7 days. Changes are saved only in your browser, and you can reset the sample wedding anytime.

Questions? Reply to this email and Caitlin at Tiny Site Studios will help.

This email confirms the demo you requested. You have not been added to a newsletter or marketing list.
Tiny Site Studios · caitlin@tinysitestudios.com`;
 const button=(url:string,label:string,background:string,color="#fffaf6")=>`<a href="${escape(url)}" style="display:inline-block;margin:0 8px 12px 0;padding:15px 22px;border-radius:9px;background:${background};color:${color};font-weight:700;text-decoration:none">${label}</a>`;
 const html=`<!doctype html><html><body style="margin:0;padding:0;background:#efe7e5;font-family:Arial,sans-serif;color:#3a202b"><div style="display:none;max-height:0;overflow:hidden">Your Seating Studio demo links are ready.</div><div style="max-width:620px;margin:24px auto;background:#fffaf6;border-radius:24px;overflow:hidden;box-shadow:0 18px 48px rgba(58,32,43,.12)"><div style="padding:34px 38px;background:#3a202b;color:#fffaf6"><div style="font-size:11px;letter-spacing:2.2px">TINY SITE STUDIOS</div><div style="margin-top:17px;font-family:Georgia,serif;font-size:34px;line-height:1">Seating <i style="color:#e3b7c7;font-weight:400">Studio</i></div><div style="margin-top:12px;color:#dbcbd1;font-size:14px">A calmer way to seat every guest.</div></div><div style="padding:36px 38px"><p style="margin:0 0 10px;color:#805a6a;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase">Your private demo entry</p><h1 style="margin:0 0 18px;font-family:Georgia,serif;font-size:36px;font-weight:400;line-height:1.15">Come on in, ${escape(firstName)}.</h1><p style="margin:0 0 24px;color:#6d5962;font-size:16px;line-height:1.7">Bea + Milo’s sample seating planner is ready for you. Move guests, arrange the room, check the chart, and see the experience from a guest’s point of view.</p><div style="margin-bottom:14px">${button(demoUrl,"Open Seating Studio →","#623749")}${button(finderUrl,"Try the Seat Finder →","#ead8df","#4b2b38")}</div><div style="margin:24px 0;padding:20px;border:1px solid #e5d5db;border-radius:14px;background:#f7eff2"><p style="margin:0 0 10px;font-weight:700">A few things to try</p><p style="margin:0;color:#69565e;font-size:14px;line-height:1.8">Move Jordan to Table 5 · Keep Rachel + Leo together · Check the Comfort Map · Search “Caitlin Cloyd” in the Seat Finder</p></div><p style="margin:0 0 22px;color:#6d5962;font-size:14px;line-height:1.65"><strong>Your links work for 7 days.</strong> Your changes stay in your browser, and you can reset the sample wedding anytime.</p><a href="${weddingsUrl}" style="color:#623749;font-size:14px;font-weight:700">Explore more Tiny Site Studios wedding experiences →</a><p style="margin:28px 0 0;padding-top:20px;border-top:1px solid #eadde2;color:#7b6870;font-size:12px;line-height:1.6">You’re receiving this email because you requested the Seating Studio demo. <strong>You have not been added to a newsletter or marketing list.</strong><br>Tiny Site Studios · caitlin@tinysitestudios.com</p></div></div></body></html>`;
 return {demoUrl,finderUrl,text,html};
}

export async function OPTIONS(request:Request){const origin=request.headers.get("origin");return new Response(null,{status:origin===ALLOWED_ORIGIN?204:403,headers:headers(origin)})}
export async function GET(request:Request){const origin=request.headers.get("origin");if(origin!==ALLOWED_ORIGIN)return json({error:"Not allowed."},403,origin);const token=new URL(request.url).searchParams.get("access")||"";if(!/^[a-f0-9]{64}$/.test(token))return json({ok:false},401,origin);try{const receipt=await store().read(`seating-studio-access/${token}.json`) as {expiresAt?:string}|null;return receipt?.expiresAt&&new Date(receipt.expiresAt)>new Date()?json({ok:true},200,origin):json({ok:false},401,origin)}catch{return json({ok:false},401,origin)}}

export async function POST(request:Request){
 const origin=request.headers.get("origin");if(origin!==ALLOWED_ORIGIN)return json({error:"Please open the Seating Studio demo and try again."},403,origin);if(Number(request.headers.get("content-length")||0)>4096)return json({error:"Request too large."},413,origin);
 let input:unknown;try{const body=await request.text();if(body.length>4096)return json({error:"Request too large."},413,origin);input=JSON.parse(body)}catch{return json({error:"Please enter your first name and email."},400,origin)}
 const parsed=schema.safeParse(input);if(!parsed.success||parsed.data.website)return json({error:"Please check your name and email and try again."},400,origin);
 const secret=process.env.RATE_LIMIT_SECRET;if(!secret)return json({error:"Demo signup is temporarily unavailable. Please try again shortly."},503,origin);
 const hash=(value:string)=>createHmac("sha256",secret).update(value).digest("hex"),now=new Date(),email=parsed.data.email.toLowerCase(),day=now.toISOString().slice(0,10),token=hash(`seating-studio-v1:${day}:${email}`),ip=request.headers.get("x-vercel-forwarded-for")||request.headers.get("x-forwarded-for")||"local",prefix=`seating-studio-signups/${day}/${hash(ip.split(",")[0].trim())}/${now.getUTCHours()}/`,signupKey=`${prefix}${hash(email)}.json`,createdAt=now.toISOString();
 try{
  const media=store(),existing=await media.list(prefix);if(existing.length>=10&&!existing.includes(signupKey))return json({error:"Too many demo signups. Please try again in an hour."},429,origin);
  const record={firstName:parsed.data.firstName,email,createdAt,source:"seating_studio_demo",marketingConsent:false,expiresAt:new Date(now.getTime()+7*86400000).toISOString()};await media.write(signupKey,record);await media.write(`seating-studio-access/${token}.json`,record);
  const content=emailContent(parsed.data.firstName,token),from=sender();
  try{const recipient=process.env.GBL_INQUIRY_EMAIL?.trim()||"caitlin@tinysitestudios.com";await sendEmail({from,to:recipient,reply_to:email,subject:`[Seating Studio Demo] ${parsed.data.firstName}`,html:`<div style="font:16px/1.6 Arial,sans-serif;max-width:620px;margin:auto;color:#3a202b"><p style="color:#805a6a;font-size:12px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase">Tiny Site Studios lead alert</p><h1 style="font-family:Georgia,serif;font-weight:400">New Seating Studio demo signup</h1><p><strong>${escape(parsed.data.firstName)}</strong> tried the Seating Studio demo.</p><p>Email: <a href="mailto:${escape(email)}">${escape(email)}</a><br>Submitted: ${escape(createdAt)}</p><p><a href="${escape(content.demoUrl)}" style="color:#623749;font-weight:700">Open their demo link →</a></p><p style="color:#806d75;font-size:13px">Their confirmation was sent separately. They were not added to a marketing list.</p></div>`,tags:[{name:"category",value:"seating-studio-alert"}]},`seating-studio-alert-${token}`)}catch(error){console.error("[seating-studio] alert unavailable",error)}
  try{await sendEmail({from,to:email,reply_to:"caitlin@tinysitestudios.com",subject:"Your Seating Studio demo is ready 💌",html:content.html,text:content.text,tags:[{name:"category",value:"seating-studio-demo"}]},`seating-studio-confirmation-${token}`)}catch(error){console.error("[seating-studio] confirmation unavailable",error);return json({ok:true,emailSent:false,access:token},200,origin)}
  return json({ok:true,emailSent:true,access:token},200,origin);
 }catch(error){console.error("[seating-studio] request failed",error);return json({error:"We couldn’t open your demo just yet. Please try again."},502,origin)}
}
