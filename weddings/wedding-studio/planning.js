/* Small, shared planning rules; no network or browser storage. */
(function(root){
'use strict';
const tags=(value,fallback='Sort later')=>{const a=Array.isArray(value)?value:String(value||'').split(',');const clean=[...new Map(a.map(x=>String(x).trim().slice(0,40)).filter(x=>x&&x.toLowerCase()!=='all inspiration').map(x=>[x.toLowerCase(),x])).values()].slice(0,20);return clean.length?clean:[fallback]};
const validDate=s=>/^\d{4}-\d{2}-\d{2}$/.test(s||'')&&!Number.isNaN(Date.parse(s+'T12:00:00Z'))&&new Date(s+'T12:00:00Z').toISOString().slice(0,10)===s;
const date=s=>new Date(s+'T12:00:00Z'),iso=d=>d.toISOString().slice(0,10);
function schedule(template,start,end){if(!validDate(start)||!validDate(end)||start>end)throw Error('Choose a start date on or before your wedding/end date.');const a=date(start),b=date(end),span=b-a;return template.groups.flatMap(g=>g.tasks.map(text=>({id:crypto.randomUUID(),text,status:'todo',due:iso(new Date(a.getTime()+span*g.at)),owner:'',fixed:false,group:g.label}))) }
function shiftTasks(tasks,oldEnd,newEnd,start){if(!validDate(oldEnd)||!validDate(newEnd))return tasks;const delta=date(newEnd)-date(oldEnd);return tasks.map(t=>t.status==='done'||t.fixed||!validDate(t.due)?t:{...t,due:iso(new Date(Math.max(date(start||newEnd).getTime(),Math.min(date(newEnd).getTime(),date(t.due).getTime()+delta))))})}
function allowedFile(file){const ext=(file.name||'').split('.').pop().toLowerCase();return !/^video\/|^audio\//.test(file.type||'')&&['jpg','jpeg','png','webp','gif','avif','pdf','doc','docx','xls','xlsx','csv','txt','rtf','odt','ppt','pptx'].includes(ext)}
const api={tags,validDate,schedule,shiftTasks,allowedFile};if(typeof module==='object'&&module.exports)module.exports=api;else root.StudioPlanning=api;
})(typeof globalThis!=='undefined'?globalThis:this);
