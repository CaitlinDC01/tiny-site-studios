const crypto = require("node:crypto");

const requestBuckets = new Map();
const json = (res, status, body) => res.status(status).json(body);
const escape = (value) => String(value || "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const sign = (value, secret) => crypto.createHmac("sha256", secret).update(value).digest("hex");

function rateLimited(key){
  const now = Date.now();
  const current = requestBuckets.get(key);
  if(!current || current.resetAt <= now){
    requestBuckets.set(key,{count:1,resetAt:now+3600000});
    return false;
  }
  current.count += 1;
  return current.count > 15;
}

function sender(){
  const configured = (process.env.RESEND_EMAIL_DOMAIN || "").trim();
  if(!configured) throw new Error("Email domain is not configured.");
  const address = configured.includes("@") ? configured : `memories@${configured}`;
  return `Tiny Site Studios <${address}>`;
}

async function sendEmail(email, key){
  const apiKey = process.env.RESEND_API_KEY;
  if(!apiKey) throw new Error("Resend is not configured.");
  const response = await fetch("https://api.resend.com/emails",{
    method:"POST",
    headers:{Authorization:`Bearer ${apiKey}`,"Content-Type":"application/json","Idempotency-Key":key},
    body:JSON.stringify(email)
  });
  const result = await response.json().catch(()=>null);
  if(!response.ok || !result?.id) throw new Error(result?.message || "Email could not be sent.");
}

function validate(body){
  if(!body || typeof body !== "object") return "Please check your information and try again.";
  if(String(body.website || "").trim()) return "Please check your information and try again.";
  const firstName = String(body.firstName || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  if(!firstName || firstName.length > 80 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return "Please check your name and email and try again.";
  if(!Array.isArray(body.nextMoves) || body.nextMoves.length < 1 || body.nextMoves.length > 5) return "Your plan is missing required details.";
  if(!Array.isArray(body.timeline) || body.timeline.length > 5) return "Your plan is missing required details.";
  return null;
}

function cleanArray(value, max, itemMax=220){
  return Array.isArray(value) ? value.slice(0,max).map(v=>String(v||"").trim().slice(0,itemMax)).filter(Boolean) : [];
}

function list(items){
  return `<ul style="margin:10px 0 0;padding-left:20px;color:#5f5258;line-height:1.75">${items.map(item=>`<li style="margin:0 0 7px">${escape(item)}</li>`).join("")}</ul>`;
}

function makeContent(data){
  const nextMoves = cleanArray(data.nextMoves,5);
  const waitOn = cleanArray(data.waitOn,6);
  const priorities = cleanArray(data.priorities,8,120);
  const timeline = Array.isArray(data.timeline) ? data.timeline.slice(0,5).map(section=>({
    label:String(section?.label||"").trim().slice(0,120),
    items:cleanArray(section?.items,8)
  })).filter(section=>section.label && section.items.length) : [];
  const firstName=String(data.firstName||"").trim().slice(0,80);
  const partnerName=String(data.partnerName||"").trim().slice(0,80);
  const names=partnerName ? `${firstName} + ${partnerName}` : firstName;
  const summary=[
    String(data.dateLabel||"").trim().slice(0,120),
    String(data.guestLabel||"").trim().slice(0,120),
    String(data.location||"").trim().slice(0,160),
    String(data.budgetLabel||"").trim().slice(0,160),
    String(data.planningStyle||"").trim().slice(0,160)
  ].filter(Boolean);
  const timelineText=timeline.map(section=>`${section.label}\n${section.items.map(item=>`- ${item}`).join("\n")}`).join("\n\n");
  const timelineHtml=timeline.map(section=>`<div style="margin:18px 0 0;padding:18px;border:1px solid #eadde2;border-radius:14px;background:#fffdfb"><div style="color:#805a6a;font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase">${escape(section.label)}</div>${list(section.items)}</div>`).join("");
  const text=`Hi ${firstName},

Here is your personalized "I Just Got Engaged... Now What?" plan from Tiny Site Weddings.

YOUR WEDDING SNAPSHOT
${summary.map(item=>`- ${item}`).join("\n")}

YOUR NEXT 5 MOVES
${nextMoves.map((item,index)=>`${index+1}. ${item}`).join("\n")}

WHAT CAN WAIT
${waitOn.length?waitOn.map(item=>`- ${item}`).join("\n"):"Nothing urgent is being intentionally pushed back right now."}

UPCOMING TIMELINE
${timelineText}

Your plan is a practical starting point, not a rulebook. Vendor availability, venue requirements, cultural traditions, and your own priorities can change the timing.

Explore Tiny Site Weddings: https://tinysitestudios.com/weddings/

This email confirms the plan you asked us to send. You have not been added to a newsletter or marketing list.
Tiny Site Studios · caitlin@tinysitestudios.com`;

  const html=`<!doctype html><html><body style="margin:0;padding:0;background:#efe8eb;font-family:Arial,sans-serif;color:#352b30"><div style="display:none;max-height:0;overflow:hidden">Your personalized wedding starting plan is ready.</div><div style="max-width:660px;margin:24px auto;background:#fffaf6;border-radius:24px;overflow:hidden;box-shadow:0 18px 48px rgba(58,32,43,.12)"><div style="padding:34px 38px;background:#382638;color:#fffaf6"><div style="font-size:11px;letter-spacing:2.2px">TINY SITE STUDIOS · WEDDINGS</div><div style="margin-top:17px;font-family:Georgia,serif;font-size:34px;line-height:1">I Just Got Engaged... <i style="color:#e8bdc5;font-weight:400">Now What?</i></div><div style="margin-top:12px;color:#dacdd6;font-size:14px">A calm starting plan for ${escape(names)}.</div></div><div style="padding:36px 38px"><p style="margin:0 0 10px;color:#8a5d69;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase">Your personalized starting plan</p><h1 style="margin:0 0 18px;font-family:Georgia,serif;font-size:36px;font-weight:400;line-height:1.15">Start here, ${escape(firstName)}.</h1><p style="margin:0 0 22px;color:#6d5962;font-size:16px;line-height:1.7">You do not need to plan the whole wedding today. These are the things worth focusing on first based on what you told us.</p><div style="padding:18px;border-radius:14px;background:#f6eff1"><strong style="display:block;margin-bottom:8px">Wedding snapshot</strong>${list(summary)}</div><h2 style="margin:30px 0 8px;font-family:Georgia,serif;font-size:27px;font-weight:400">Your next 5 moves</h2>${list(nextMoves)}${waitOn.length?`<h2 style="margin:30px 0 8px;font-family:Georgia,serif;font-size:27px;font-weight:400">What can wait</h2>${list(waitOn)}`:""}<h2 style="margin:30px 0 8px;font-family:Georgia,serif;font-size:27px;font-weight:400">Your upcoming timeline</h2>${timelineHtml}<div style="margin:28px 0 0;padding:20px;border-radius:14px;background:#382638;color:#fffaf6"><strong style="display:block;margin-bottom:8px;font-family:Georgia,serif;font-size:22px">Next up: build your wedding budget.</strong><p style="margin:0 0 14px;color:#e5d9df;line-height:1.6">We’re building the next free Tiny Site Weddings tool to help you figure out what deserves your money and what doesn’t.</p><a href="https://tinysitestudios.com/weddings/" style="color:#fffaf6;font-weight:700">Explore Tiny Site Weddings →</a></div><p style="margin:28px 0 0;padding-top:20px;border-top:1px solid #eadde2;color:#7b6870;font-size:12px;line-height:1.6">This plan is general guidance, not a rulebook. Vendor availability, venue requirements, traditions, and your priorities can change the timing.<br><br>You’re receiving this because you asked us to email your plan. <strong>You have not been added to a newsletter or marketing list.</strong><br>Tiny Site Studios · caitlin@tinysitestudios.com</p></div></div></body></html>`;
  return {firstName,partnerName,names,summary,nextMoves,waitOn,priorities,timeline,text,html};
}

module.exports = async function handler(req,res){
  res.setHeader("Cache-Control","no-store");
  if(req.method !== "POST") return json(res,405,{error:"Method not allowed."});
  const problem=validate(req.body);
  if(problem) return json(res,400,{error:problem});
  const secret=process.env.RATE_LIMIT_SECRET;
  if(!secret) return json(res,503,{error:"Plan email is temporarily unavailable. You can still print or save your plan."});
  const ip=String(req.headers["x-forwarded-for"]||"local").split(",")[0].trim();
  const hour=new Date().toISOString().slice(0,13);
  if(rateLimited(`${ip}:${hour}:wedding-plan`)) return json(res,429,{error:"Too many plan emails were requested from this connection. Please try again in an hour."});

  const data=req.body;
  const email=String(data.email||"").trim().toLowerCase();
  const content=makeContent(data);
  const fingerprint=sign([email,String(data.dateLabel||""),...content.nextMoves].join("|"),secret).slice(0,32);

  try{
    const from=sender();
    await sendEmail({from,to:email,reply_to:"caitlin@tinysitestudios.com",subject:"Your wedding starting plan is ready 💍",html:content.html,text:content.text,tags:[{name:"category",value:"wedding-start-plan"}]},`wedding-plan-${fingerprint}`);
    try{
      const recipient=(process.env.GBL_INQUIRY_EMAIL||"caitlin@tinysitestudios.com").trim();
      await sendEmail({from,to:recipient,reply_to:email,subject:`[Wedding Planning Tool] ${content.names}`,html:`<div style="font:16px/1.6 Arial,sans-serif;max-width:620px;margin:auto;color:#3a202b"><p style="color:#805a6a;font-size:12px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase">Tiny Site Studios lead alert</p><h1 style="font-family:Georgia,serif;font-weight:400">Wedding planning tool email request</h1><p><strong>${escape(content.names)}</strong> emailed themselves a personalized starting plan.</p><p>Email: <a href="mailto:${escape(email)}">${escape(email)}</a><br>Date/timing: ${escape(data.dateLabel)}<br>Guests: ${escape(data.guestLabel||"Not provided")}<br>Location: ${escape(data.location||"Not provided")}</p><p style="color:#806d75;font-size:13px">This is an informational lead alert. They were not added to a marketing list.</p></div>`,tags:[{name:"category",value:"wedding-start-plan-alert"}]},`wedding-plan-alert-${fingerprint}`);
    }catch(error){
      console.error("[wedding-plan] owner alert unavailable",error);
    }
    return json(res,200,{ok:true});
  }catch(error){
    console.error("[wedding-plan] email unavailable",error);
    return json(res,502,{error:"We couldn’t email your plan just yet. You can still print or save it from the page."});
  }
};
