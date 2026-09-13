/* Seating Studio: shared room geometry, seat assignments and sample PDF export. */
(function (scope) {
  'use strict';
  const KEY = 'tss-seating-studio-room-v1';
  const WIDTH = 1200, HEIGHT = 1000;
  const copy = value => JSON.parse(JSON.stringify(value));
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const numeric = (value, fallback, min, max) => Number.isFinite(value) ? clamp(value, min, max) : fallback;
  const zones = [
    {id:'sweetheart', name:'Sweetheart table', x:600, y:110, width:260, height:90},
    {id:'dance', name:'Dance floor', x:600, y:880, width:300, height:180},
    {id:'entrance', name:'Entrance', x:140, y:100, width:160, height:80}
  ];
  function seatPoints(shape, capacity, rotation = 0) {
    const points = Array.from({length:capacity}, (_, i) => {
      if (shape === 'round') {const a = -Math.PI/2 + i * 2*Math.PI/capacity; return {x:Math.cos(a)*106,y:Math.sin(a)*106};}
      const top = Math.ceil(capacity/2), bottom = capacity-top;
      const n = i<top ? top : bottom, index = i<top ? i : capacity-1-i;
      return {x:n===1?0:-96+192*index/(n-1), y:i<top?-85:85};
    });
    const r=rotation*Math.PI/180;
    return points.map(p=>({x:p.x*Math.cos(r)-p.y*Math.sin(r),y:p.x*Math.sin(r)+p.y*Math.cos(r)}));
  }
  function create(d) {
    let downloadURL=null;
    let state, selected='magnolia', selectedGuest=d.unassignedGuests()[0]?.id||'', container=null, ignoreClick=false;
    const initial = () => ({tables:d.tables.map((t,i)=>({id:t.id,x:240+(i%3)*360,y:i<3?350:650,shape:i%3===1?'rect':'round',capacity:8,rotation:0,seats:Array(8).fill(null)})),zones:copy(zones)});
    function normalize(raw) {
      const base=initial();
      if(!raw || typeof raw!=='object') return base;
      for(const t of base.tables) {
        const value=Array.isArray(raw.tables)&&raw.tables.find(x=>x&&x.id===t.id);
        if(!value) continue;
        t.x=numeric(value.x,t.x,150,WIDTH-150); t.y=numeric(value.y,t.y,150,HEIGHT-150);
        t.shape=value.shape==='rect'?'rect':'round';
        t.capacity=Math.round(numeric(value.capacity,8,4,12));
        t.rotation=[0,90,180,270].includes(value.rotation)?value.rotation:0;
        t.seats=Array.from({length:t.capacity},(_,i)=>typeof value.seats?.[i]==='string'?value.seats[i]:null);
      }
      for(const z of base.zones) {
        const value=Array.isArray(raw.zones)&&raw.zones.find(x=>x&&x.id===z.id);
        if(value) {z.x=numeric(value.x,z.x,z.width/2+10,WIDTH-z.width/2-10);z.y=numeric(value.y,z.y,z.height/2+10,HEIGHT-z.height/2-10);}
      }
      return base;
    }
    try {state=normalize(JSON.parse(localStorage.getItem(KEY)||'null'));} catch {state=initial();}
    function sync() {
      for(const t of state.tables) {
        d.tables.find(x=>x.id===t.id).capacity=t.capacity;
        const people=d.tableGuests(t.id), seen=new Set();
        t.seats=Array.from({length:t.capacity},(_,i)=>{
          const id=t.seats[i]; if(!people.some(g=>g.id===id)||seen.has(id))return null;
          seen.add(id); return id;
        });
        for(const g of people) if(!seen.has(g.id)) {const empty=t.seats.indexOf(null);if(empty!==-1) {t.seats[empty]=g.id;seen.add(g.id);}}
      }
    }
    sync();
    function persist() {sync();localStorage.setItem(KEY,JSON.stringify(state));}
    function restore(value) {state=normalize(value);sync();}
    function reset() {state=initial();selected='magnolia';selectedGuest='';sync();}
    const snapshot=()=>{sync();return copy(state);};
    const guest=id=>d.guests().find(g=>g.id===id);
    const table=id=>state.tables.find(t=>t.id===id);
    const object=()=>table(selected)||state.zones.find(z=>z.id===selected)||state.tables[0];
    const esc=d.esc;
    function save(label,before) {sync();d.saveChange(label,before);}
    function seatGuest(id,tableId,index) {
      sync();const g=guest(id),t=table(tableId);
      if(!g||!d.isAttending(g)||!t||!Number.isInteger(index)||index<0||index>=t.capacity)return false;
      if(t.seats[index]&&t.seats[index]!==id){d.toast('That seat is taken. Choose an open seat.');return false;}
      if(t.seats[index]===id)return false;
      const before=d.snapshot();
      for(const item of state.tables)item.seats=item.seats.map(value=>value===id?null:value);
      g.table=t.id; t.seats[index]=id;
      save(`seat ${g.name}`,before);d.toast(`${g.name} is at ${d.tableById(t.id).name}, seat ${index+1}.`);return true;
    }
    function changeTable(id,patch) {
      const t=table(id);if(!t)return false;
      if(patch.capacity!==undefined&&(!Number.isInteger(patch.capacity)||patch.capacity<4||patch.capacity>12))return false;
      if(patch.capacity!==undefined&&d.tableGuests(id).length>patch.capacity){d.toast('Move guests out before reducing this table’s seats.');return false;}
      const before=d.snapshot();
      if(patch.shape) t.shape=patch.shape==='rect'?'rect':'round';
      if(patch.capacity!==undefined)t.capacity=patch.capacity;
      if(patch.rotation!==undefined)t.rotation=((patch.rotation%360)+360)%360;
      save('change table layout',before);return true;
    }
    function moveObject(id,x,y) {
      const item=table(id)||state.zones.find(z=>z.id===id);if(!item)return false;
      const before=d.snapshot(),rx=item.width?item.width/2+10:150,ry=item.height?item.height/2+10:150;
      item.x=numeric(x,item.x,rx,WIDTH-rx);item.y=numeric(y,item.y,ry,HEIGHT-ry);
      if(before===d.snapshot())return false;
      save('move '+(item.name||d.tableById(id).name),before);return true;
    }
    function overlaps() {
      const items=[...state.tables.map(t=>({...t,width:270,height:270})),...state.zones];
      const pairs=[];
      for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++) {
        const a=items[i],b=items[j];
        if(Math.abs(a.x-b.x)<(a.width+b.width)/2&&Math.abs(a.y-b.y)<(a.height+b.height)/2)pairs.push([a.id,b.id]);
      }
      return pairs;
    }
    function mapSVG() {
      return `<svg viewBox="0 0 ${WIDTH} ${HEIGHT}" aria-hidden="true" class="room-drawing"><rect x="5" y="5" width="1190" height="990" rx="22" fill="#fdfbf8" stroke="#d9cdcf" stroke-width="3"/>${state.zones.map(z=>`<rect x="${z.x-z.width/2}" y="${z.y-z.height/2}" width="${z.width}" height="${z.height}" rx="12" fill="${z.id==='dance'?'#ede6de':'#f0e2e8'}" stroke="#d4c2ca" stroke-width="2"/>`).join('')}${state.tables.map(t=>{const fill=selected===t.id?'#e7d3dd':'#f1eae4';return `<g transform="translate(${t.x} ${t.y})"><g transform="rotate(${t.rotation})">${t.shape==='round'?`<circle r="73" fill="${fill}" stroke="#ae8c9c" stroke-width="3"/>`:`<rect x="-115" y="-55" width="230" height="110" rx="12" fill="${fill}" stroke="#ae8c9c" stroke-width="3"/>`}</g>${seatPoints(t.shape,t.capacity,t.rotation).map((p,i)=>`<circle cx="${p.x}" cy="${p.y}" r="17" fill="${t.seats[i]?'#785362':'#fff'}" stroke="${t.seats[i]?'#785362':'#6b8775'}" stroke-width="3"/>`).join('')}</g>`;}).join('')}</svg>`;
    }
    function markup() {
      sync();
      if(selectedGuest&&(!guest(selectedGuest)||!d.isAttending(guest(selectedGuest))))selectedGuest=d.unassignedGuests()[0]?.id||'';
      const item=object(),t=table(selected),info=t?d.tableById(t.id):null;
      const issues=overlaps(),overflow=t?d.tableGuests(t.id).filter(g=>!t.seats.includes(g.id)):[];
      const guestOptions=[...d.guests()].filter(d.isAttending).sort((a,b)=>Number(!!a.table)-Number(!!b.table)||a.name.localeCompare(b.name)).map(g=>`<option value="${g.id}" ${selectedGuest===g.id?'selected':''}>${esc(g.name)} · ${g.table?d.tableById(g.table).name:'Unassigned'}</option>`).join('');
      return `<section id="room-studio" class="room-studio" aria-label="Room layout planner">
        <div class="room-tools"><label>Guest to place<select id="room-guest"><option value="">Choose a guest</option>${guestOptions}</select></label><label>Selected table or area<select id="room-object">${d.tables.map(x=>`<option value="${x.id}" ${selected===x.id?'selected':''}>Table ${x.number} · ${x.name}</option>`).join('')}${state.zones.map(z=>`<option value="${z.id}" ${selected===z.id?'selected':''}>${z.name}</option>`).join('')}</select></label><button class="secondary-button" type="button" id="room-unassign" ${selectedGuest&&guest(selectedGuest)?.table?'':'disabled'}>Unassign guest</button></div>
        <div class="room-heading"><div><span class="eyebrow">Reception room</span><h2>Your room, thoughtfully arranged.</h2></div><span class="room-key">● Seated &nbsp; ○ Open</span></div>
        <p class="room-help">Drag a table or area to move it. Select a table to arrange individual seats below. Arrow keys also move the selected object.</p>
        <div class="room-map" aria-label="Reception room overview">${mapSVG()}${[...state.tables,...state.zones].map(o=>{const meta=d.tableById(o.id);return `<button type="button" class="room-object ${meta?'room-table-object':'room-zone-object'} ${selected===o.id?'is-selected':''}" style="left:${o.x/WIDTH*100}%;top:${o.y/HEIGHT*100}%" data-room-object="${o.id}" aria-pressed="${selected===o.id}" aria-label="${meta?`Table ${meta.number}, ${meta.name}, ${d.tableGuests(o.id).length} of ${o.capacity} seated`:o.name}. Select or use arrow keys to move.">${meta?`<strong>${meta.number}</strong><span>${meta.name}</span><small>${d.tableGuests(o.id).length}/${o.capacity}</small>`:`<span>${o.name}</span>`}</button>`;}).join('')}</div>
        <p class="room-notice ${issues.length?'has-warning':''}">${issues.length?`${issues.length} possible overlap${issues.length===1?'':'s'} — move objects apart to leave more room. `:''}Illustrative layout, not to scale. Confirm table spacing and access routes with your venue.</p>
        <section class="room-detail" aria-label="Selected table details"><div class="room-detail-heading"><div><span class="eyebrow">${t?`Table ${info.number}`:'Reception area'}</span><h2>${t?info.name:item.name}</h2></div><div class="room-edit-fields">${t?`<label>Shape<select id="room-shape"><option value="round" ${t.shape==='round'?'selected':''}>Round</option><option value="rect" ${t.shape==='rect'?'selected':''}>Rectangular</option></select></label><label>Seats<select id="room-capacity">${Array.from({length:9},(_,i)=>i+4).map(n=>`<option ${n===t.capacity?'selected':''}>${n}</option>`).join('')}</select></label><button type="button" class="secondary-button" id="room-rotate">Rotate 90°</button>`:''}</div></div>
        <div class="room-nudge" role="group" aria-label="Move selected object"><span>Move ${t?'table':'area'}</span><button type="button" data-room-nudge="left" aria-label="Move selected object left">←</button><button type="button" data-room-nudge="up" aria-label="Move selected object up">↑</button><button type="button" data-room-nudge="down" aria-label="Move selected object down">↓</button><button type="button" data-room-nudge="right" aria-label="Move selected object right">→</button></div>
        ${t?`<p class="room-seat-help">${selectedGuest?`Placing <strong>${esc(guest(selectedGuest).name)}</strong>. Choose an open seat. This moves one guest.`:'Choose a guest above, then an open seat.'} Select an occupied seat to move that guest.</p><label class="room-mobile-guest">Guest to place<select id="room-detail-guest"><option value="">Choose a guest</option>${guestOptions}</select></label><div class="room-seat-diagram ${t.shape==='rect'&&t.rotation%180===0?'rect-horizontal':''}" aria-label="Seats at ${info.name}"><div class="room-table-center ${t.shape==='rect'?'rectangular':''}" style="transform:translate(-50%,-50%) rotate(${t.rotation}deg)"><span style="transform:rotate(${-t.rotation}deg)">${info.name}<small>${d.tableGuests(t.id).length} / ${t.capacity} seated</small></span></div>${seatPoints(t.shape,t.capacity,t.rotation).map((p,i)=>{const g=guest(t.seats[i]);return `<button type="button" class="room-seat ${g?'occupied':'empty'} ${g?.id===selectedGuest?'selected-seat':''}" style="left:${50+p.x*.39}%;top:${50+p.y*.39}%" data-room-seat="${i}" aria-label="${g?`Seat ${i+1}: ${esc(g.name)}. Select to move.`:`Seat ${i+1}: open${selectedGuest?`. Seat ${esc(guest(selectedGuest).name)} here`:''}`}" ${!g&&!selectedGuest?'disabled':''}><small>${i+1}</small><span>${g?esc(g.name.split(' ')[0]+' '+g.name.split(' ').at(-1)[0]+'.'):'＋ Open'}</span></button>`;}).join('')}</div>${overflow.length?`<div class="room-overflow" role="status"><strong>${overflow.length} guest${overflow.length===1?'':'s'} over capacity</strong><p>${overflow.map(g=>esc(g.name)).join(', ')} ${overflow.length===1?'needs':'need'} an open seat. Increase capacity or move to another table.</p></div>`:''}<div class="room-roster">${t.seats.map((id,i)=>`<span><b>${i+1}</b> ${id?esc(guest(id).name):'Open seat'}</span>`).join('')}</div>`:'<p class="room-seat-help">Move this area on the map or with the arrow buttons above.</p>'}</section>
      </section>`;
    }
    function refresh(focus) {
      const scroll=d.app.scrollTop;d.render();d.app.scrollTop=scroll;
      if(focus)d.app.querySelector(focus)?.focus({preventScroll:true});
    }
    function bind() {
      container=d.app.querySelector('#room-studio'); if(!container)return;
      container.onchange=event=>{
        const input=event.target;
        if(input.id==='room-guest'||input.id==='room-detail-guest')selectedGuest=input.value;
        else if(input.id==='room-object')selected=input.value;
        else if(input.id==='room-shape')changeTable(selected,{shape:input.value});
        else if(input.id==='room-capacity')changeTable(selected,{capacity:Number(input.value)});
        else return;
        refresh('#'+input.id);
      };
      container.onclick=event=>{
        const obj=event.target.closest('[data-room-object]');
        if(obj){if(ignoreClick){ignoreClick=false;return;} selected=obj.dataset.roomObject;refresh(`[data-room-object="${selected}"]`);container.querySelector('.room-detail')?.scrollIntoView({behavior:'smooth',block:'start'});return;}
        const seat=event.target.closest('[data-room-seat]');
        if(seat){const t=table(selected),index=Number(seat.dataset.roomSeat);if(t.seats[index])selectedGuest=t.seats[index];else seatGuest(selectedGuest,t.id,index);refresh(`[data-room-seat="${index}"]`);return;}
        if(event.target.closest('#room-unassign')){const g=guest(selectedGuest);if(g){const before=d.snapshot();g.table=null;save('unassign '+g.name,before);refresh('#room-guest');d.toast(g.name+' is now unassigned.');}return;}
        if(event.target.closest('#room-rotate')){const t=table(selected);changeTable(selected,{rotation:t.rotation+90});refresh('#room-rotate');return;}
        const nudge=event.target.closest('[data-room-nudge]');if(nudge){nudgeObject(nudge.dataset.roomNudge);refresh(`[data-room-nudge="${nudge.dataset.roomNudge}"]`);}
      };
      function nudgeObject(direction){const o=object();moveObject(o.id,o.x+(direction==='left'?-20:direction==='right'?20:0),o.y+(direction==='up'?-20:direction==='down'?20:0));}
      container.onkeydown=event=>{
        const btn=event.target.closest('[data-room-object]');if(!btn||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;
        event.preventDefault();selected=btn.dataset.roomObject;nudgeObject(event.key.replace('Arrow','').toLowerCase());refresh(`[data-room-object="${selected}"]`);
      };
      container.querySelectorAll('[data-room-object]').forEach(button=>{
        button.onpointerdown=event=>{
          if(event.button!==0)return;
          const map=container.querySelector('.room-map'),rect=map.getBoundingClientRect();
          const id=button.dataset.roomObject,o=table(id)||state.zones.find(z=>z.id===id),start={x:event.clientX,y:event.clientY,ox:o.x,oy:o.y},before=d.snapshot();
          let moved=false;
          button.setPointerCapture(event.pointerId);
          button.onpointermove=e=>{
            const dx=(e.clientX-start.x)/rect.width*WIDTH,dy=(e.clientY-start.y)/rect.height*HEIGHT;
            if(Math.abs(dx)+Math.abs(dy)<8&&!moved)return;
            moved=true;const rx=o.width?o.width/2+10:150,ry=o.height?o.height/2+10:150;
            o.x=clamp(start.ox+dx,rx,WIDTH-rx);o.y=clamp(start.oy+dy,ry,HEIGHT-ry);
            button.style.left=o.x/WIDTH*100+'%';button.style.top=o.y/HEIGHT*100+'%';
            map.querySelector('svg').outerHTML=mapSVG();
          };
          const finish=(cancel)=>{
            button.onpointermove=null;button.onpointerup=null;button.onpointercancel=null;
            if(!moved)return;
            if(cancel){o.x=start.ox;o.y=start.oy;}else {selected=id;save('move '+(o.name||d.tableById(id).name),before);}
            ignoreClick=true;refresh(`[data-room-object="${id}"]`);setTimeout(()=>{ignoreClick=false;},0);
          };
          button.onpointerup=()=>finish(false);button.onpointercancel=()=>finish(true);
        };
      });
    }
    function makePDF(PDF) {
      sync();const pdf=new PDF({orientation:'landscape',unit:'pt',format:'letter'});
      pdf.setProperties({title:'Bea + Milo - Sample seating plan',author:'Tiny Site Studios',subject:'Seating Studio sample wedding'});
      const text=(value,x,y,size=11,color='#3a2830')=>{pdf.setFont('helvetica','normal');pdf.setFontSize(size);pdf.setTextColor(color);pdf.text(String(value).replace(/[’‘]/g,"'").replace(/[–—]/g,'-').replace(/·/g,' / '),x,y);};
      function header(title,subtitle){pdf.setFillColor('#faf6f1');pdf.rect(0,0,792,612,'F');text('SEATING STUDIO / TINY SITE STUDIOS',34,32,10,'#744b5e');pdf.setFont('times','normal');pdf.setFontSize(28);pdf.setTextColor('#362830');pdf.text(title,34,67);text(subtitle,34,88,10);}
      header('Bea + Milo | Reception room','October 24, 2026 / Sample wedding / Illustrative layout - not to scale');
      const scale=.45,ox=126,oy=112;
      const rect=(x,y,w,h,fill)=>{pdf.setFillColor(fill);pdf.setDrawColor('#cdbdc4');pdf.roundedRect(ox+x*scale,oy+y*scale,w*scale,h*scale,5,5,'FD');};
      rect(0,0,WIDTH,HEIGHT,'#ffffff');
      for(const z of state.zones){rect(z.x-z.width/2,z.y-z.height/2,z.width,z.height,'#f0e8e2');const label=pdf.splitTextToSize(z.name,z.width*scale-10);text(label.join('\n'),ox+(z.x-z.width/2)*scale+8,oy+z.y*scale+3,9);}
      for(const t of state.tables){const x=ox+t.x*scale,y=oy+t.y*scale;pdf.setFillColor('#eadbe2');pdf.setDrawColor('#ac8a9b');
        if(t.shape==='round')pdf.circle(x,y,73*scale,'FD');else {const rotated=t.rotation%180!==0;pdf.roundedRect(x-(rotated?55:115)*scale,y-(rotated?115:55)*scale,(rotated?110:230)*scale,(rotated?230:110)*scale,4,4,'FD');}
        for(const [i,p] of seatPoints(t.shape,t.capacity,t.rotation).entries()){pdf.setFillColor(t.seats[i]?'#775162':'#ffffff');pdf.circle(x+p.x*scale,y+p.y*scale,17*scale,'FD');text(i+1,x+p.x*scale-(i>=9?4:2),y+p.y*scale+2.5,7,t.seats[i]?'#ffffff':'#486652');}
        text('Table '+d.tableById(t.id).number,x-16,y-6,9);text(d.tableById(t.id).name,x-22,y+6,9);text(d.tableGuests(t.id).length+' / '+t.capacity,x-10,y+18,8);
      }
      const roomWarnings=overlaps().length;
      text(`${d.guests().filter(g=>d.isAttending(g)&&g.table).length} seated / ${d.unassignedGuests().length} unassigned${roomWarnings?' / '+roomWarnings+' possible layout overlaps':''}`,34,584,10);
      // One table per page keeps long names and catering notes readable.
      for(const t of state.tables){pdf.addPage();const meta=d.tableById(t.id);header(`Table ${meta.number} | ${meta.name}`,`${t.shape==='round'?'Round':'Rectangular'} / ${t.capacity} seats / ${d.tableGuests(t.id).length} guests`);
        text('SEAT',36,122,10);text('GUEST',84,122,10);text('MEAL',302,122,10);text('DIETARY / SEATING NOTES',420,122,10);
        const rows=t.seats.map((id,i)=>({seat:String(i+1),g:guest(id)}));
        rows.push(...d.tableGuests(t.id).filter(g=>!t.seats.includes(g.id)).map(g=>({seat:'Over',g})));
        let y=146;
        for(const row of rows){const g=row.g,notes=g?[g.dietary,g.accessibility].filter(Boolean).join('; '):'';
          const lines=pdf.splitTextToSize(notes||'-',330);const height=Math.max(29,lines.length*11+10);
          if(y+height>557){pdf.addPage();header(`Table ${meta.number} | continued`,'Sample wedding / Table guest list');y=124;}
          pdf.setDrawColor('#e5dce0');pdf.line(34,y+height-14,758,y+height-14);
          text(row.seat,36,y,10);text(g?g.name:'Open seat',84,y,11);text(g?g.meal:'-',302,y,10);text(lines.join('\n'),420,y,10);y+=height;
        }
        if(rows.some(r=>r.seat==='Over'))text('Over capacity: move the extra guests or increase the number of seats.',34,574,10,'#9a4434');
      }
      const unassigned=d.unassignedGuests();
      if(unassigned.length){pdf.addPage();header('Guests still to place',`${unassigned.length} unassigned / Sample wedding`);let y=124;
        for(const g of unassigned){if(y>553){pdf.addPage();header('Guests still to place | continued','Sample wedding');y=124;}text(g.name,36,y,12);text(g.group,300,y,10);y+=25;}
      }
      const pages=pdf.getNumberOfPages();
      for(let p=1;p<=pages;p++){pdf.setPage(p);text('SAMPLE DEMO - Not a client wedding plan',34,602,9,'#744b5e');text('tinysitestudios.com',328,602,9,'#744b5e');text(`${p} / ${pages}`,727,602,9,'#744b5e');}
      return pdf;
    }
    function exportPDF(){
      try {
        if(!scope.jspdf?.jsPDF)throw new Error('PDF library unavailable');
        const pdf=makePDF(scope.jspdf.jsPDF);
        if(downloadURL)URL.revokeObjectURL(downloadURL);
        downloadURL=URL.createObjectURL(pdf.output('blob'));
        document.querySelectorAll('.pdf-download-link').forEach(link=>link.remove());
        const link=document.createElement('a');link.href=downloadURL;link.download='bea-milo-sample-seating-plan.pdf';link.className='pdf-download-link';link.textContent='Save PDF';
        (document.querySelector('.seating-view-controls')||d.app).append(link);link.click();
        d.toast('Your sample PDF is ready. If the download does not start, choose Save PDF.',6000);
      }
      catch(error){console.error(error);d.toast('The PDF could not be created. Refresh this page and try again.',6000);}
    }
    return {markup,bind,sync,persist,restore,reset,snapshot,seatGuest,changeTable,moveObject,overlaps,makePDF,exportPDF};
  }
  scope.SeatingRoom={create,seatPoints};
})(globalThis);
