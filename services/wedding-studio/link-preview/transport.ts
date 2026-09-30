// Pin outbound connections to a previously checked public address. TLS still
// verifies the original hostname, including SNI; no insecure certificate bypass.
export async function requestPinned(u:URL,address:string,timeout:number){
 let conn:Deno.Conn|undefined;
 let expired=false;
 const timer=setTimeout(()=>{expired=true;try{conn?.close()}catch{}},timeout);
 const encoder=new TextEncoder(),decoder=new TextDecoder();
 try{
 conn=await Deno.connect({hostname:address,port:u.protocol==='https:'?443:80});
 if(expired)throw Error('Preview timed out.');
 if(u.protocol==='https:')conn=await Deno.startTls(conn as Deno.TcpConn,{hostname:u.hostname,alpnProtocols:['http/1.1']});
 if(expired)throw Error('Preview timed out.');
 const request=encoder.encode(`GET ${u.pathname+u.search} HTTP/1.1\r\nHost: ${u.host}\r\nUser-Agent: WeddingStudioPreview/1.0\r\nAccept: text/html, application/xhtml+xml\r\nAccept-Encoding: identity\r\nConnection: close\r\n\r\n`);
 for(let n=0;n<request.length;)n+=await conn.write(request.subarray(n));
 let bytes=new Uint8Array(0),headerEnd=-1,status=0,headers:Record<string,string>={},body='';
 const buffer=new Uint8Array(16384);
 while(true){
 const n=await conn.read(buffer);if(n===null)break;
 const next=new Uint8Array(bytes.length+n);next.set(bytes);next.set(buffer.subarray(0,n),bytes.length);bytes=next;
 if(headerEnd<0){
 const text=decoder.decode(bytes);const boundary=text.indexOf('\r\n\r\n');
 if(boundary<0){if(bytes.length>32768)throw Error('Headers too large.');continue}
 const head=text.slice(0,boundary);headerEnd=encoder.encode(head+'\r\n\r\n').length;
 status=Number(head.split('\r\n')[0].split(' ')[1]);
 for(const line of head.split('\r\n').slice(1)){const colon=line.indexOf(':');if(colon>0)headers[line.slice(0,colon).toLowerCase()]=line.slice(colon+1).trim()}
 if(status>=300&&status<400)return {status,location:headers.location};
 if(status<200||status>=300||!/(text\/html|application\/xhtml\+xml)/i.test(headers['content-type']||'')||headers['content-encoding']&&headers['content-encoding']!=='identity')throw Error('This site does not provide a preview.');
 }
 const raw=bytes.subarray(headerEnd);
 let payload=raw,complete=false;
 if(/chunked/i.test(headers['transfer-encoding']||'')){
 const chunks:Uint8Array[]=[];let pos=0;
 while(pos<raw.length){let end=pos;while(end+1<raw.length&&(raw[end]!==13||raw[end+1]!==10))end++;
 if(end+1>=raw.length)break;
 const sizeText=decoder.decode(raw.subarray(pos,end)).split(';')[0].trim();if(!/^[\da-f]+$/i.test(sizeText))throw Error('Invalid response.');
 const size=parseInt(sizeText,16);if(size===0){complete=true;break}
 const start=end+2;chunks.push(raw.subarray(start,Math.min(raw.length,start+size)));if(start+size+2>raw.length)break;pos=start+size+2;
 }
 payload=new Uint8Array(chunks.reduce((sum,c)=>sum+c.length,0));let offset=0;for(const chunk of chunks){payload.set(chunk,offset);offset+=chunk.length}
 }else if(headers['content-length'])complete=raw.length>=Number(headers['content-length']);
 body=decoder.decode(payload);
 if(/<\/head\s*>/i.test(body)||bytes.length>1024*1024||complete)break;
 }
 if(expired)throw Error('Preview timed out.');
 return {status,body};
 }finally{clearTimeout(timer);try{conn?.close()}catch{}}
}
