/* CSV import stays entirely in the visitor's browser. */
const GuestImport = (() => {
  const columns = [
    ['name','Full Name',['name','guest name']], ['group','Group',[]],
    ['household','Household',['household party','party']], ['meal','Meal',['meal choice']],
    ['dietary','Dietary Needs',['dietary','dietary allergy','allergies']],
    ['accessibility','Accessibility Notes',['accessibility','seating notes']],
    ['keepNear','Keep Near',[]], ['separate','Separate If Possible',['separate']],
    ['notes','Planner Notes',['notes']], ['status','RSVP Status',['status','rsvp']],
    ['table','Table',['table number','table name']]
  ];
  const key = value => String(value).trim().toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  function parseCSV(text) {
    text=String(text).replace(/^\uFEFF/,'');
    if(text.length>1048576)throw new Error('Choose a CSV file smaller than 1 MB.');
    const firstLine=text.split(/\r?\n/)[0]||'';
    const delimiter=firstLine.includes(',')?',':firstLine.includes('\t')?'\t':firstLine.includes(';')?';':',';
    const rows=[];let cells=[],cell='',quoted=false,closed=false,line=1,start=1;
    const field=()=>{cells.push(cell);cell='';closed=false};
    const row=()=>{field();if(cells.some(value=>value.trim()))rows.push({cells,line:start});cells=[];start=line+1;if(rows.length>1001)throw new Error('Import up to 1,000 guests at a time.');};
    for(let i=0;i<text.length;i++){
      const c=text[i];
      if(quoted){if(c==='"'){if(text[i+1]==='"'){cell+='"';i++}else{quoted=false;closed=true}}else{cell+=c;if(c==='\n')line++}continue}
      if(c===delimiter){field();continue}
      if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;row();line++;continue}
      if(closed){if(/\s/.test(c))continue;throw new Error(`Row ${line}: unexpected text after a closing quote. Save the sheet as CSV UTF-8 again.`)}
      if(c==='"'){if(cell.length)throw new Error(`Row ${line}: a quote is misplaced. Save the sheet as CSV UTF-8 again.`);quoted=true;continue}
      cell+=c;
    }
    if(quoted)throw new Error(`Row ${start}: a quoted value is unfinished.`);
    row();return rows;
  }
  function prepare(text,tables){
    const rows=parseCSV(text),errors=[],warnings=[],guests=[];
    if(!rows.length)throw new Error('This file is empty. Add guests below the template headings.');
    const header=rows.shift().cells;
    const mapped=header.map(h=>columns.find(([,label,aliases])=>[label,...aliases].some(alias=>key(alias)===key(h)))?.[0]||null);
    if(!mapped.includes('name'))throw new Error('The first row needs a Full Name column. Use the downloadable template headings.');
    if(mapped.some((field,i)=>field&&mapped.indexOf(field)!==i))throw new Error('Two headings map to the same field. Keep just one column for each template field.');
    const unknown=header.filter((h,i)=>h.trim()&&!mapped[i]);
    if(unknown.length)warnings.push(`These extra columns will not be imported: ${unknown.join(', ')}.`);
    const statuses=['Confirmed','Pending','Declined','Unable to Attend','Added Late'];
    const names=new Set();let duplicates=false;
    rows.forEach(({cells,line})=>{
      const record={};mapped.forEach((field,i)=>{if(field)record[field]=(cells[i]||'').trim()});
      const rowErrors=[];
      if(cells.slice(header.length).some(v=>v.trim()))rowErrors.push('more values than headings');
      if(!record.name)rowErrors.push('Full Name is required');
      if(record.name?.length>100)rowErrors.push('Full Name must be 100 characters or fewer');
      if(Object.values(record).some(v=>v.length>2000))rowErrors.push('a value is longer than 2,000 characters');
      const status=record.status?statuses.find(s=>key(s)===key(record.status)):'Pending';
      if(!status)rowErrors.push('RSVP Status must be Confirmed, Pending, Declined, Unable to Attend, or Added Late');
      const table=record.table?tables.find(t=>[t.id,t.name,String(t.number),`Table ${t.number}`].some(v=>key(v)===key(record.table))):null;
      if(record.table&&!table&&key(record.table)!=='unassigned')rowErrors.push('Table must be a table name, a number from 1 to 6, or blank');
      if(table&&['Declined','Unable to Attend'].includes(status))warnings.push(`Row ${line}: ${record.name} is not attending and will be unassigned.`);
      if(rowErrors.length)errors.push(`Row ${line}: ${rowErrors.join('; ')}.`);
      if(record.name){const normalized=record.name.trim().toLowerCase().replace(/\s+/g,' ');if(names.has(normalized))duplicates=true;names.add(normalized)}
      guests.push({name:record.name||'',group:record.group||'Other',household:record.household||'Single Guest',meal:record.meal||'Not specified',dietary:record.dietary||'',accessibility:record.accessibility||'',keepNear:record.keepNear||'',separate:record.separate||'',notes:record.notes||'',status:status||'Pending',table:table&&!['Declined','Unable to Attend'].includes(status)?table.id:null});
    });
    if(!guests.length)errors.push('Add at least one guest below the headings.');
    if(duplicates)warnings.push('Some names repeat in this file. Each row will become a separate guest.');
    return {guests,errors,warnings,duplicates};
  }
  return {columns,parseCSV,prepare};
})();
