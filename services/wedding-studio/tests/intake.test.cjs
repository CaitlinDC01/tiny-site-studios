const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const {parseHTML,DOMParser}=require('linkedom');
const base=require('path').resolve(__dirname,'../../../weddings/wedding-studio')+'/';
const {document,Event}=parseHTML(fs.readFileSync(base+'index.html','utf8'));
// Linkedom omits the browser's writable select.value property.
for(const el of document.querySelectorAll('select'))Object.defineProperty(el,'value',{value:'',writable:true});
const ctx=vm.createContext({document,window:{},DOMParser,Event,URL,crypto,console,setTimeout,clearTimeout,AbortController,AbortSignal,location:{search:'',href:'https://tinysitestudios.com/weddings/wedding-studio/'}});
vm.runInContext(fs.readFileSync(base+'intake.js','utf8'),ctx);
vm.runInContext(fs.readFileSync(base+'studio.js','utf8').replace('init();',''),ctx);
const run=s=>vm.runInContext(s,ctx);
const transfer=(plain='',html='',uri='',files=[])=>({files,getData:type=>({'text/plain':plain,'text/html':html,'text/uri-list':uri})[type]||''});
const read=d=>ctx.StudioIntake.read(d);
assert.equal(read(transfer('https://example.com\nhttps://pinterest.com/pin/123/\nhttps://example.com')).entries.length,2);
assert.equal(read(transfer('Candles everywhere\nMake it warm.')).entries[0].kind,'note');
const pin=read(transfer('',`<a href="https://www.pinterest.com/pin/123456/"><img src="https://i.pinimg.com/photo.jpg" alt="Garden flowers"></a><script>alert('x')</script>`)).entries[0];assert.equal(pin.url,'https://www.pinterest.com/pin/123456/');assert.equal(pin.image,'https://i.pinimg.com/photo.jpg');
assert.equal(read(transfer('javascript:alert(1)')).entries[0].kind,'note');
assert.equal(read(transfer('','','',[{name:'one.pdf'},{name:'two.png'}])).entries.length,2);
(async()=>{
 document.querySelector('#search').value='';document.querySelector('#status-filter').value='';
 run('loadDemo()');assert.equal(document.querySelectorAll('#board .card').length,5);
 ctx.capture=read(transfer('https://example.com/flowers\nhttps://www.pinterest.com/pin/123456/'));
 await run('importCapture(capture)');assert.equal(document.querySelectorAll('#board .card').length,7);assert.equal(document.querySelectorAll('.pin-art').length,1);
 const paste=new Event('paste',{bubbles:true,cancelable:true});paste.clipboardData=transfer('Candles on every table');document.dispatchEvent(paste);await new Promise(r=>setTimeout(r,20));assert.equal(document.querySelectorAll('#board .card').length,8);assert.equal(document.querySelector('dialog[open]'),null);
 const input=document.querySelector('#search');const ordinaryPaste=new Event('paste',{bubbles:true,cancelable:true});ordinaryPaste.clipboardData=transfer('Should not add');input.dispatchEvent(ordinaryPaste);await new Promise(r=>setTimeout(r,20));assert.equal(document.querySelectorAll('#board .card').length,8);
 ctx.capture=read(transfer('','','',[new File(['test document'],'quote.txt',{type:'text/plain'}),new File(['image'],'flowers.png',{type:'image/png'})]));await run('importCapture(capture)');assert.equal(document.querySelectorAll('#board .card').length,10);assert.equal(run("items.at(-2).kind"),'file');assert.equal(run("items.at(-1).kind"),'image');
 console.log('Direct URL/text paste, multi-file capture, pin destination + thumbnail, and editable-field checks passed.');
})().catch(e=>{console.error(e);process.exitCode=1});
