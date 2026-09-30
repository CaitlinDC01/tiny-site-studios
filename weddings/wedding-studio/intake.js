/* Normalize browser clipboard/drag data without injecting its HTML. */
(function(root){
 const url=v=>{try{const u=new URL(v);return ['http:','https:'].includes(u.protocol)&&u.href.length<=3000?u.href:''}catch{return ''}};
 function read(data){
 if(!data)return {entries:[]};
 const files=Array.from(data.files||[]);
 if(files.length)return {entries:files.map(file=>({file,kind:'file',title:(file.name||'Pasted image').replace(/\.[^.]+$/,'')}))};
 const plain=(data.getData('text/plain')||'').trim(),uri=(data.getData('text/uri-list')||'').split(/\r?\n/).filter(s=>s&&!s.startsWith('#')).map(url).filter(Boolean),html=data.getData('text/html')||'';
 const doc=html?new DOMParser().parseFromString(html,'text/html'):null;
 const lines=plain.split(/\r?\n/).map(s=>s.trim()).filter(Boolean),textURLs=lines.map(url);
 let links=uri.length?uri:lines.length&&textURLs.every(Boolean)?textURLs:[];
 // A dragged linked picture keeps the destination (especially a Pin), plus its cover.
 if(!links.length&&doc){const anchors=Array.from(doc.querySelectorAll('a[href]'));if(anchors.length===1&&(doc.querySelector('img')||!plain))links=[url(anchors[0].getAttribute('href'))].filter(Boolean)}
 if(links.length)return {entries:[...new Set(links)].map(href=>{const anchor=Array.from(doc?.querySelectorAll('a[href]')||[]).find(a=>url(a.getAttribute('href'))===href),img=anchor?.querySelector('img')||((links.length===1)?doc?.querySelector('img'):null);return {kind:'link',url:href,title:(anchor?.textContent?.trim()||img?.getAttribute('alt')||new URL(href).hostname.replace(/^www\./,'')).slice(0,200),image:url(img?.getAttribute('src'))}})};
 const image=doc?.querySelector('img');if(image&&url(image.getAttribute('src')))return {entries:[{kind:'link',url:url(image.getAttribute('src')),image:url(image.getAttribute('src')),title:image.getAttribute('alt')||'Image inspiration'}]};
 if(plain)return {entries:[{kind:'note',title:lines[0].slice(0,200),notes:plain.slice(0,10000)}]};
 return {entries:[]};
 }
 root.StudioIntake={read};if(typeof module!=='undefined')module.exports={read};
})(globalThis);
