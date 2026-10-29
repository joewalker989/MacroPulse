/* Optional consumption times. Diary dates remain independent of time-zone conversions. */
(function(root){
 'use strict';
 const formats=new Map();
 function formatter(zone){if(typeof zone!=='string'||!zone||zone.length>100)throw Error('Enter a valid time zone, such as America/New_York.');if(!formats.has(zone)){const f=new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});if(formats.size>100)formats.clear();formats.set(zone,f);}return formats.get(zone);}
 function wall(ms,zone){const p=Object.fromEntries(formatter(zone).formatToParts(new Date(ms)).map(x=>[x.type,x.value]));return p.year+'-'+p.month+'-'+p.day+'T'+p.hour+':'+p.minute+':'+p.second;}
 function localMs(local){if(typeof local!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(local))throw Error('Choose the actual date and time eaten.');const n=Date.parse(local+':00Z');if(!Number.isFinite(n)||new Date(n).toISOString().slice(0,16)!==local)throw Error('Choose a valid date and time eaten.');return n;}
 function choices(local,zone){const n=localMs(local),offsets=new Set();formatter(zone);for(let h=-48;h<=48;h+=6){const probe=n+h*3600000;offsets.add(Date.parse(wall(probe,zone)+'Z')-probe);}return [...offsets].map(o=>n-o).filter(ms=>wall(ms,zone)===local+':00').sort((a,b)=>a-b).map(ms=>({version:1,local,zone,instant:new Date(ms).toISOString(),offsetMinutes:(n-ms)/60000}));}
 function valid(t){try{if(!t||typeof t!=='object'||Array.isArray(t)||t.version!==1||typeof t.instant!=='string'||!Number.isFinite(t.offsetMinutes))return false;const n=localMs(t.local),ms=Date.parse(t.instant);return Number.isFinite(ms)&&new Date(ms).toISOString()===t.instant&&wall(ms,t.zone)===t.local+':00'&&(n-ms)/60000===t.offsetMinutes;}catch{return false;}}
 function resolve(local,zone,instant){const rows=choices(local,zone);if(!rows.length)throw Error('That local time does not exist because the clock moves forward. Choose another time.');if(rows.length>1&&!instant)throw Error('That time occurs twice. Choose the earlier or later occurrence.');const result=instant?rows.find(x=>x.instant===instant):rows[0];if(!result)throw Error('Choose an occurrence that matches this time and zone.');return result;}
 function offset(t){const n=t.offsetMinutes,sign=n<0?'-':'+';return 'UTC'+sign+String(Math.floor(Math.abs(n)/60)).padStart(2,'0')+':'+String(Math.floor(Math.abs(n)%60)).padStart(2,'0')+(n%1?':'+String(Math.round(Math.abs(n%1)*60)).padStart(2,'0'):'');}
 function label(t){return t&&valid(t)?t.local.replace('T',' ')+' · '+t.zone+' ('+offset(t)+')':'Time unknown';}
 function now(zone,ms=Date.now()){return wall(ms,zone).slice(0,16);}
 const api={choices,resolve,valid,label,offset,now};if(typeof module==='object'&&module.exports)module.exports=api;root.MacroMealTime=api;
})(typeof globalThis!=='undefined'?globalThis:this);
