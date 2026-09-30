import { createClient } from 'npm:@supabase/supabase-js@2.117.2';
const headers = {'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET, OPTIONS','Access-Control-Allow-Headers':'authorization, apikey, content-type','Content-Type':'application/json','Cache-Control':'no-store'};
Deno.serve(async(req)=>{
 if(req.method==='OPTIONS') return new Response(null,{headers});
 if(req.method!=='GET') return new Response(JSON.stringify({error:'Method not allowed'}),{status:405,headers});
 // A random, unguessable brief token is the read-only authorization credential.
 // It exposes only the owner's explicit snapshot, never their board or other uploads.
 const token=new URL(req.url).searchParams.get('token')||'';
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token)) return new Response(JSON.stringify({error:'Brief not found'}),{status:404,headers});
 try {
 const db=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
 const {data,error}=await db.from('wedding_studio_briefs').select('title,payload,user_id,expires_at,created_at').eq('token',token).gt('expires_at',new Date().toISOString()).maybeSingle();
 if(error) throw error;
 if(!data) return new Response(JSON.stringify({error:'This brief has expired or was removed.'}),{status:404,headers});
 const payload=data.payload;
 const items=await Promise.all((payload.items||[]).slice(0,100).map(async(item:any)=>{
 const copy={...item}; delete copy.user_id;
 if(copy.file_path && copy.file_path.startsWith(data.user_id+'/')){
 const {data:signed}=await db.storage.from('wedding-studio').createSignedUrl(copy.file_path,3600);
 copy.file_url=signed?.signedUrl||null;
 } else { copy.file_url=null; }
 delete copy.file_path;
 return copy;
 }));
 return new Response(JSON.stringify({title:data.title,wedding:payload.wedding,date:payload.date,instructions:payload.instructions,items,created_at:data.created_at,expires_at:data.expires_at}),{headers});
 } catch(error){console.error('Brief retrieval failed',error);return new Response(JSON.stringify({error:'Unable to open this brief. Please try again.'}),{status:503,headers});}
});
