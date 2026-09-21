import { createHmac } from "node:crypto";
import { z } from "zod";

export const runtime = "nodejs";

const schema = z.object({
  firstName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(254),
  partnerName: z.string().trim().max(80).default(""),
  dateLabel: z.string().trim().min(1).max(120),
  guestLabel: z.string().trim().max(120).default(""),
  location: z.string().trim().max(160).default(""),
  budgetLabel: z.string().trim().max(160).default(""),
  planningStyle: z.string().trim().max(160).default(""),
  priorities: z.array(z.string().trim().max(120)).max(8).default([]),
  completed: z.array(z.string().trim().max(120)).max(20).default([]),
  nextMoves: z.array(z.string().trim().min(1).max(220)).min(1).max(5),
  waitOn: z.array(z.string().trim().min(1).max(220)).max(6).default([]),
  timeline: z.array(z.object({
    label: z.string().trim().min(1).max(120),
    items: z.array(z.string().trim().min(1).max(220)).min(1).max(8)
  })).max(5).default([]),
  website: z.string().max(200).default("")
});

const requestBuckets = new Map<string, {count:number;resetAt:number}>();
const sign = (value:string, secret:string) => createHmac("sha256", secret).update(value).digest("hex");
const escape = (value:string) => value.replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"} as Record<string,string>)[c]);

function allowedOrigin(origin:string|null){
  if(!origin) return null;
  if(origin === "https://tinysitestudios.com") return origin;
  if(/^https:\/\/tiny-site-studios-preview(?:-[a-z0-9-]+)?\.vercel\.app$/.test(origin)) return origin;
  return null;
}
function responseHeaders(origin:string|null){
  const allowed = allowedOrigin(origin);
  return {
    ...(allowed ? {"Access-Control-Allow-Origin": allowed} : {}),
    "Access-Control-Allow-Methods":"POST, OPTIONS",
    "Access-Control-Allow-Headers":"Content-Type",
    "Cache-Control":"no-store",
    "Vary":"Origin"
  };
}
const json=(body:unknown,status=200,origin:string|null=null)=>Response.json(body,{status,headers:responseHeaders(origin)});
function rateLimited(key:string){
  const now=Date.now(), current=requestBuckets.get(key);
  if(!current || current.resetAt<=now){requestBuckets.set(key,{count:1,resetAt:now+3600000});return false;}
  current.count += 1;
  return current.count > 15;
}
function sender(){
  const configured=process.env.RESEND_EMAIL_DOMAIN?.trim();
  if(!configured) throw new Error("Email domain is not configured.");
  const address=configured.includes("@")?configured:`memories@${configured}`;
  return `Tiny Site Studios <${address}>`;
}
async function sendEmail(email:{from:string;to:string;reply_to?:string;subject:string;html:string;text?:string;tags?:Array<{name:string;value:string}>},key:string){
  const apiKey=process.env.RESEND_API_KEY;
  if(!apiKey) throw new Error("Resend is not configured.");
  const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${apiKey}`,"Content-Type":"application/json","Idempotency-Key":key},body:JSON.stringify(email)});
  const result=await response.json().catch(()=>null) as {id?:string;message?:string}|null;
  if(!response.ok || !result?.id) throw new Error(result?.message||"Email could not be sent.");
}

function list(items:string[]){
  return `<ul style="margin:10px 0 0;padding-left:20px;color:#5f5258;line-height:1.75">${items.map(item=>`<li style="margin:0 0 7px">${escape(item)}</li>`).join("")}</ul>`;
}
function timelineHtml(timeline:Array<{label:string;items:string[]}>){
  return timeline.map(section=>`<div style="margin:18px 0 0;padding:18px;border:1px solid #eadde2;border-radius:14px;background:#fffdfb"><div style="color:#805a6a;font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase">${escape(section.label)}</div>${list(section.items)}</div>`).join("");
}
function emailContent(data:z.infer<typeof schema>){
  const names=data.partnerName ? `${data.firstName} + ${data.partnerName}` : data.firstName;
  const summary=[data.dateLabel,data.guestLabel,data.location,data.budgetLabel,data.planningStyle].filter(Boolean);
  const text=`Hi ${data.firstName},

Here is your personalized "I Just Got Engaged... Now What?" plan from Tiny Site Weddings.

YOUR WEDDING SNAPSHOT
${summary.map(item=>`- ${item}`).join("\n")}

YOUR NEXT 5 MOVES
${data.nextMoves.map((item,index)=>`${index+1}. ${item}`).join("\n")}

WHAT CAN WAIT
${data.waitOn.length?data.waitOn.map(item=>`- ${item}`).join("\n"):"Nothing urgent is being intentionally pushed back right now."}

UPCOMING TIMELINE
${data.timeline.map(section=>`${section.label}\n${section.items.map(item=>`- ${item}`).join("\n")}`).join("\n\n")}

Your plan is a practical starting point, not a rulebook. Vendor availability, venue requirements, cultural traditions, and your own priorities can change the timing.

Explore Tiny Site Weddings: https://tinysitestudios.com/weddings/

This email confirms the plan you asked us to send. You have not been added to a newsletter or marketing list.
Tiny Site Studios · caitlin@tinysitestudios.com`;

  const html=`<!doctype html><html><body style="margin:0;padding:0;background:#efe8eb;font-family:Arial,sans-serif;color:#352b30"><div style="display:none;max-height:0;overflow:hidden">Your personalized wedding starting plan is ready.</div><div style="max-width:660px;margin:24px auto;background:#fffaf6;border-radius:24px;overflow:hidden;box-shadow:0 18px 48px rgba(58,32,43,.12)"><div style="padding:34px 38px;background:#382638;color:#fffaf6"><div style="font-size:11px;letter-spacing:2.2px">TINY SITE STUDIOS · WEDDINGS</div><div style="margin-top:17px;font-family:Georgia,serif;font-size:34px;line-height:1">I Just Got Engaged... <i style="color:#e8bdc5;font-weight:400">Now What?</i></div><div style="margin-top:12px;color:#dacdd6;font-size:14px">A calm starting plan for ${escape(names)}.</div></div><div style="padding:36px 38px"><p style="margin:0 0 10px;color:#8a5d69;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase">Your personalized starting plan</p><h1 style="margin:0 0 18px;font-family:Georgia,serif;font-size:36px;font-weight:400;line-height:1.15">Start here, ${escape(data.firstName)}.</h1><p style="margin:0 0 22px;color:#6d5962;font-size:16px;line-height:1.7">You do not need to plan the whole wedding today. These are the things worth focusing on first based on what you told us.</p><div style="padding:18px;border-radius:14px;background:#f6eff1"><strong style="display:block;margin-bottom:8px">Wedding snapshot</strong>${list(summary)}</div><h2 style="margin:30px 0 8px;font-family:Georgia,serif;font-size:27px;font-weight:400">Your next 5 moves</h2>${list(data.nextMoves)}${data.waitOn.length?`<h2 style="margin:30px 0 8px;font-family:Georgia,serif;font-size:27px;font-weight:400">What can wait</h2>${list(data.waitOn)}`:""}<h2 style="margin:30px 0 8px;font-family:Georgia,serif;font-size:27px;font-weight:400">Your upcoming timeline</h2>${timelineHtml(data.timeline)}<div style="margin:28px 0 0;padding:20px;border-radius:14px;background:#382638;color:#fffaf6"><strong style="display:block;margin-bottom:8px;font-family:Georgia,serif;font-size:22px">Next up: build your wedding budget.</strong><p style="margin:0 0 14px;color:#e5d9df;line-height:1.6">We’re building the next free Tiny Site Weddings tool to help you figure out what deserves your money and what doesn’t.</p><a href="https://tinysitestudios.com/weddings/" style="color:#fffaf6;font-weight:700">Explore Tiny Site Weddings →</a></div><p style="margin:28px 0 0;padding-top:20px;border-top:1px solid #eadde2;color:#7b6870;font-size:12px;line-height:1.6">This plan is general guidance, not a rulebook. Vendor availability, venue requirements, traditions, and your priorities can change the timing.<br><br>You’re receiving this because you asked us to email your plan. <strong>You have not been added to a newsletter or marketing list.</strong><br>Tiny Site Studios · caitlin@tinysitestudios.com</p></div></div></body></html>`;
  return {html,text,names};
}

export async function OPTIONS(request:Request){
  const origin=request.headers.get("origin");
  return new Response(null,{status:allowedOrigin(origin)?204:403,headers:responseHeaders(origin)});
}

export async function POST(request:Request){
  const origin=request.headers.get("origin");
  if(!allowedOrigin(origin)) return json({error:"Please open the wedding planning tool and try again."},403,origin);
  if(Number(request.headers.get("content-length")||0)>20000) return json({error:"Request too large."},413,origin);

  let input:unknown;
  try{
    const body=await request.text();
    if(body.length>20000) return json({error:"Request too large."},413,origin);
    input=JSON.parse(body);
  }catch{
    return json({error:"Please check your information and try again."},400,origin);
  }

  const parsed=schema.safeParse(input);
  if(!parsed.success || parsed.data.website) return json({error:"Please check your name and email and try again."},400,origin);

  const secret=process.env.RATE_LIMIT_SECRET;
  if(!secret) return json({error:"Plan email is temporarily unavailable. Please try again shortly."},503,origin);

  const ip=(request.headers.get("x-vercel-forwarded-for")||request.headers.get("x-forwarded-for")||"local").split(",")[0].trim();
  const hour=new Date().toISOString().slice(0,13);
  if(rateLimited(`${ip}:${hour}:wedding-plan`)) return json({error:"Too many plan emails were requested from this connection. Please try again in an hour."},429,origin);

  const data=parsed.data;
  const email=data.email.toLowerCase();
  const content=emailContent(data);
  const fingerprint=sign([email,data.dateLabel,...data.nextMoves].join("|"),secret).slice(0,32);
  const from=sender();

  try{
    await sendEmail({from,to:email,reply_to:"caitlin@tinysitestudios.com",subject:"Your wedding starting plan is ready 💍",html:content.html,text:content.text,tags:[{name:"category",value:"wedding-start-plan"}]},`wedding-plan-${fingerprint}`);
  }catch(error){
    console.error("[wedding-plan] confirmation unavailable",error);
    return json({error:"We couldn’t email your plan just yet. You can still print or save it from the page."},502,origin);
  }

  try{
    const recipient=process.env.GBL_INQUIRY_EMAIL?.trim()||"caitlin@tinysitestudios.com";
    await sendEmail({from,to:recipient,reply_to:email,subject:`[Wedding Planning Tool] ${content.names}`,html:`<div style="font:16px/1.6 Arial,sans-serif;max-width:620px;margin:auto;color:#3a202b"><p style="color:#805a6a;font-size:12px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase">Tiny Site Studios lead alert</p><h1 style="font-family:Georgia,serif;font-weight:400">Wedding planning tool email request</h1><p><strong>${escape(content.names)}</strong> emailed themselves a personalized starting plan.</p><p>Email: <a href="mailto:${escape(email)}">${escape(email)}</a><br>Date/timing: ${escape(data.dateLabel)}<br>Guests: ${escape(data.guestLabel||"Not provided")}<br>Location: ${escape(data.location||"Not provided")}</p><p style="color:#806d75;font-size:13px">This is an informational lead alert. They were not added to a marketing list.</p></div>`,tags:[{name:"category",value:"wedding-start-plan-alert"}]},`wedding-plan-alert-${fingerprint}`);
  }catch(error){
    console.error("[wedding-plan] owner alert unavailable",error);
  }

  return json({ok:true},200,origin);
}
