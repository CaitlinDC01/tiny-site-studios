'use strict';
// Only the public planner shell is cached. Recipes, API responses, and planner data are not.
const OFFLINE_CACHE='merry-managed-offline-v1';
const OFFLINE_PREFIX='merry-managed-offline-';
const APP_ROOT=new URL(self.registration.scope);
const SHELL_URL=new URL('index.html',APP_ROOT).href;
function isPlannerNavigation(request){const u=new URL(request.url);return request.method==='GET'&&request.mode==='navigate'&&u.origin===APP_ROOT.origin&&(u.pathname===APP_ROOT.pathname||u.pathname===new URL(SHELL_URL).pathname)}
function validShell(response){return response.ok&&!response.redirected&&(response.headers.get('content-type')||'').includes('text/html')}
async function storeShell(response){if(!validShell(response))throw Error('Planner page unavailable');const cache=await caches.open(OFFLINE_CACHE);await cache.put(SHELL_URL,response.clone());return response}
async function refreshShell(){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000);try{return await storeShell(await fetch(SHELL_URL,{cache:'no-store',signal:controller.signal}))}finally{clearTimeout(timer)}}
async function cachedShell(){return(await caches.open(OFFLINE_CACHE)).match(SHELL_URL)}
function offlineFallback(){return new Response('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Merry & Managed · Connect once</title><body style="font:18px/1.6 system-ui;background:#faf7ef;color:#234d3d;max-width:620px;margin:12vh auto;padding:24px"><h1>Let’s tuck your planner away for later.</h1><p>Connect to the internet and open Merry & Managed once to prepare offline access in this browser. Your saved planner entries have not been changed.</p><p><a href="'+APP_ROOT.href+'">Try opening your planner again</a></p></body></html>',{status:503,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}})}
async function navigationResponse(network){let timer;try{return await Promise.race([network,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Slow connection')),3000)})])}catch{return await cachedShell()||await network.catch(()=>offlineFallback())}finally{clearTimeout(timer)}}
self.addEventListener('install',event=>{event.waitUntil(refreshShell().then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{for(const name of await caches.keys())if(name.startsWith(OFFLINE_PREFIX)&&name!==OFFLINE_CACHE)await caches.delete(name);await self.clients.claim()})())});
self.addEventListener('fetch',event=>{if(!isPlannerNavigation(event.request))return;const network=fetch(event.request,{cache:'no-store'}).then(async response=>{if(!validShell(response))throw Error('Planner page unavailable');try{await storeShell(response)}catch{}return response});event.waitUntil(network.catch(()=>{}));event.respondWith(navigationResponse(network))});
self.addEventListener('message',event=>{if(!event.ports?.[0]||!['OFFLINE_STATUS','PREPARE_OFFLINE'].includes(event.data?.type))return;event.waitUntil((async()=>{let refreshed=false;try{if(event.data.type==='PREPARE_OFFLINE'){await refreshShell();refreshed=true}event.ports[0].postMessage({ready:!!await cachedShell(),refreshed})}catch{event.ports[0].postMessage({ready:!!await cachedShell(),refreshed:false,error:'Could not refresh the offline copy.'})}})())});
