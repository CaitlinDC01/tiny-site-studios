/* Local-only palette extraction. Shared by the browser and the pixel tests. */
(function(root){
 'use strict';
 function parse(value){return value.trim().split(/[\s,;]+/).filter(Boolean).map(c=>{c=c.replace(/^#/,'');if(/^[0-9a-f]{3}$/i.test(c))c=[...c].map(x=>x+x).join('');return '#'+c.toUpperCase()})}
 function extract(pixels,limit=6){
  const bins=new Map();
  for(let i=0;i<pixels.length;i+=4){if(pixels[i+3]<128)continue;const r=pixels[i],g=pixels[i+1],b=pixels[i+2],key=(r>>4)*256+(g>>4)*16+(b>>4);let bin=bins.get(key);if(!bin){bin={n:0,r:0,g:0,b:0};bins.set(key,bin)}bin.n++;bin.r+=r;bin.g+=g;bin.b+=b}
  const ranked=[...bins.values()].sort((a,b)=>b.n-a.n).map(c=>({n:c.n,rgb:[c.r,c.g,c.b].map(v=>Math.round(v/c.n))})),chosen=[];
  for(const c of ranked){if(chosen.every(p=>c.rgb.reduce((sum,v,n)=>sum+(v-p[n])**2,0)>42**2))chosen.push(c.rgb);if(chosen.length>=limit)break}
  return chosen.map(c=>'#'+c.map(v=>v.toString(16).padStart(2,'0')).join('').toUpperCase());
 }
 const api={parse,extract};if(typeof module==='object'&&module.exports)module.exports=api;else root.StudioPalette=api;
})(typeof globalThis!=='undefined'?globalThis:this);
