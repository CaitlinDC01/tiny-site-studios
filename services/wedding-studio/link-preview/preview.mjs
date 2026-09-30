import https from 'node:https';
import http from 'node:http';
import { resolve4 } from 'node:dns/promises';

export function publicIPv4(address) {
 const n=address.split('.').map(Number);
 if(n.length!==4||n.some(x=>!Number.isInteger(x)||x<0||x>255))return false;
 const [a,b,c]=n;
 return !(a===0||a===10||a===127||a>=224||(a===100&&b>=64&&b<=127)||(a===169&&b===254)||(a===172&&b>=16&&b<=31)||(a===192&&(b===168||b===0||b===2))||(a===198&&(b===18||b===19||(b===51&&c===100)))||(a===203&&b===0&&c===113));
}
export function webURL(value,base) {
 const u=new URL(value,base);
 if(!['http:','https:'].includes(u.protocol)||u.username||u.password||u.port||u.href.length>3000||!u.hostname.includes('.')||/^[\d.]+$/.test(u.hostname)||u.hostname.includes(':')||/\.(localhost|local|internal|test|invalid)$/i.test(u.hostname))throw Error('Use a public website link.');
 return u;
}
const decode=s=>s.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi,(_,v)=>{if(v[0]==='#'){const n=v[1].toLowerCase()==='x'?parseInt(v.slice(2),16):Number(v.slice(1));return n>0&&n<=0x10ffff?String.fromCodePoint(n):''}return {amp:'&',quot:'"',apos:"'",lt:'<',gt:'>',nbsp:' '}[v.toLowerCase()]||''});
const clean=(v,n)=>decode(v||'').replace(/\s+/g,' ').trim().slice(0,n);
export function parsePreview(html,url) {
 const meta={};
 // Parse only head metadata; never execute page scripts or return raw HTML.
 const head=html.split(/<\/head\s*>/i)[0];
 for(const tag of head.match(/<meta\b[^>]*>/gi)||[]){const a={};for(const m of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g))a[m[1].toLowerCase()]=m[2]??m[3]??m[4];const key=(a.property||a.name||'').toLowerCase();if(key&&!meta[key])meta[key]=a.content||'';}
 let image='';const candidate=meta['og:image:secure_url']||meta['og:image']||meta['twitter:image'];if(candidate)try{image=webURL(decode(candidate),url).href}catch{}
 const title=clean(meta['og:title']||meta['twitter:title']||head.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1],200);
 return {title,description:clean(meta['og:description']||meta['twitter:description']||meta.description,350),image,site:clean(meta['og:site_name'],80)||new URL(url).hostname.replace(/^www\./,''),url,checked_at:new Date().toISOString()};
}
export async function fetchPreview(value,transport) {
 const deadline=Date.now()+10000;
 let u=webURL(value);
 for(let hop=0;hop<5;hop++){
 const remaining=()=>Math.max(1,deadline-Date.now());
 let dnsTimer;
 const addresses=await Promise.race([resolve4(u.hostname),new Promise((_,reject)=>{dnsTimer=setTimeout(()=>reject(Error('Preview timed out.')),remaining())})]).finally(()=>clearTimeout(dnsTimer));
 if(!addresses.length||addresses.some(ip=>!publicIPv4(ip)))throw Error('Use a public website link.');
 // Connect to the vetted address, preserving TLS SNI/certificate verification and Host.
 // No second DNS lookup, cookies, credentials, or authorization forwarded to sites.
 const response=transport?await transport(u,addresses[0],remaining()):await new Promise((resolve,reject)=>{
 const request=(u.protocol==='https:'?https:http).request({hostname:addresses[0],port:u.protocol==='https:'?443:80,servername:u.hostname,path:u.pathname+u.search,method:'GET',agent:false,headers:{Host:u.host,'User-Agent':'WeddingStudioPreview/1.0','Accept':'text/html, application/xhtml+xml','Accept-Encoding':'identity'}},res=>{
 const status=res.statusCode||500;
 if(status>=300&&status<400){res.resume();resolve({status,location:res.headers.location});return}
 if(status<200||status>=300||!String(res.headers['content-type']).match(/text\/html|application\/xhtml\+xml/i)){res.destroy();reject(Error('This site does not provide a preview.'));return}
 let body='',bytes=0;res.setEncoding('utf8');res.on('data',chunk=>{bytes+=Buffer.byteLength(chunk);if(bytes>1024*1024){res.destroy();resolve({status,body});return}body+=chunk;if(/<\/head\s*>/i.test(body)){res.destroy();resolve({status,body})}});res.on('end',()=>resolve({status,body}));res.on('error',reject);
 });
 const timer=setTimeout(()=>request.destroy(Error('Preview timed out.')),remaining());request.on('close',()=>clearTimeout(timer));request.on('error',reject);request.end();
 });
 if(response.location){u=webURL(response.location,u);continue}
 return parsePreview(response.body||'',u.href);
 }
 throw Error('Too many redirects.');
}
