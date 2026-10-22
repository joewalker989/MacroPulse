/* Supabase REST client. Credentials and encryption passphrase stay in memory. */
(function(root){'use strict';
 function create({url,publishableKey,fetcher=fetch}){
  const base=new URL(url);if(base.protocol!=='https:'||!base.hostname.endsWith('.supabase.co')||base.username||base.password)throw Error('Use the HTTPS URL of your Supabase project.');
  let publicKey=typeof publishableKey==='string'&&/^sb_publishable_[\w-]+$/.test(publishableKey);if(!publicKey)try{publicKey=JSON.parse(atob(publishableKey.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))).role==='anon';}catch{}
  if(!publicKey)throw Error('Only a publishable or anon key is allowed. Never enter a service-role or AI secret here.');
  let session=null;
  async function raw(path,{method='GET',body,authorized=true,headers={}}={}){
   if(authorized&&!session)throw Error('Sign in to your cloud account first.');
   if(authorized&&session.expires_at*1000<Date.now()+30000)await refresh();
   const requestUser=authorized?session.user.id:null;const r=await fetcher(new URL(path,base),{method,credentials:'omit',referrerPolicy:'no-referrer',headers:{apikey:publishableKey,...(authorized?{Authorization:'Bearer '+session.access_token}:{}),...(body!==undefined?{'Content-Type':'application/json'}:{}),...headers},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(60000)});
   if(authorized&&session?.user.id!==requestUser)throw Error('Cloud account changed while the request was running. Retry from the current account.');if(!r.ok){let data;try{data=await r.json();}catch{}throw Object.assign(Error(data?.error_description||data?.error||data?.message||'Cloud request failed ('+r.status+').'),{status:r.status});}
   return r.status===204?null:r.json();
  }
  function use(data){if(!data?.access_token||!data?.refresh_token||!data?.user?.id)throw Error('Cloud sign-in returned no session. Check email confirmation.');session={...data,expires_at:data.expires_at||Math.floor(Date.now()/1000)+(data.expires_in||900)};return {id:session.user.id,email:session.user.email};}
  async function refresh(){if(!session?.refresh_token)throw Error('Sign in again.');const expectedUser=session.user.id,expectedToken=session.refresh_token;const data=await raw('/auth/v1/token?grant_type=refresh_token',{method:'POST',authorized:false,body:{refresh_token:expectedToken}});if(session?.user.id!==expectedUser||session.refresh_token!==expectedToken)throw Error('Cloud account changed during token refresh. Retry from the current account.');use(data);}
  return {
   signIn:async(email,password)=>use(await raw('/auth/v1/token?grant_type=password',{method:'POST',authorized:false,body:{email,password}})),
   signUp:async(email,password)=>{const data=await raw('/auth/v1/signup',{method:'POST',authorized:false,body:{email,password}});return data.access_token?use(data):{confirmationRequired:true};},
   signOut:async()=>{const expectedUser=session?.user.id;try{if(session)await raw('/auth/v1/logout',{method:'POST'});}finally{if(session?.user.id===expectedUser)session=null;}},
   user:()=>session?{id:session.user.id,email:session.user.email}:null,
   archiveRecord:async(name,envelope)=>{if(!session)throw Error('Sign in first.');if(!/^[a-f0-9]{64}\.json$/.test(name)||envelope?.format!=='MacroPulse encrypted')throw Error('Invalid encrypted recovery item.');return raw('/storage/v1/object/macropulse-private/'+session.user.id+'/records/'+name,{method:'POST',headers:{'x-upsert':'false'},body:envelope});},
   recordHistory:async()=>{if(!session)throw Error('Sign in first.');const rows=[];for(let offset=0;offset<10000;offset+=1000){const page=await raw('/storage/v1/object/list/macropulse-private',{method:'POST',body:{prefix:session.user.id+'/records',limit:1000,offset,sortBy:{column:'created_at',order:'desc'}}});rows.push(...page);if(page.length<1000)return rows;}throw Error('Recovery list exceeds 10,000 versions. Manage it in your private cloud storage.');},
   downloadRecord:name=>{if(!session)throw Error('Sign in first.');if(!/^[a-f0-9]{64}\.json$/.test(name))throw Error('Invalid recovery path.');return raw('/storage/v1/object/authenticated/macropulse-private/'+session.user.id+'/records/'+name);},
   capabilities:()=>raw('/functions/v1/mp-services',{method:'POST',body:{action:'capabilities'}}),
   recognize:(action,input)=>raw('/functions/v1/mp-services',{method:'POST',body:{action,consent:true,...input}}),
   fitness:(action,input={})=>raw('/functions/v1/mp-services',{method:'POST',body:{action,...input}}),
   usda:query=>raw('/functions/v1/mp-services',{method:'POST',body:{action:'usda',query}}),
   read:async()=>{const rows=await raw('/rest/v1/mp_snapshots?select=revision,payload,updated_at&user_id=eq.'+encodeURIComponent(session?.user.id||''));return rows[0]||null;},
   backup:async(payload,revision)=>{if(payload?.format!=='MacroPulse encrypted')throw Error('Only encrypted snapshots may be uploaded.');const rows=await raw('/rest/v1/rpc/mp_put_snapshot',{method:'POST',body:{expected_revision:revision,encrypted_payload:payload}});if(!rows?.length)throw Object.assign(Error('Cloud changed on another device. Preview the cloud copy before uploading again.'),{status:409});return rows[0];},
   photoList:async()=>{const rows=[];for(let offset=0;offset<10000;offset+=1000){const page=await raw('/storage/v1/object/list/macropulse-private',{method:'POST',body:{prefix:session.user.id,limit:1000,offset,sortBy:{column:'name',order:'asc'}}});rows.push(...page);if(page.length<1000)return rows;}throw Error('Cloud contains more than 10,000 photo versions. Review them in your cloud dashboard.');},
   uploadPhoto:async(name,envelope)=>{if(!/^[a-f0-9]{64}\.json$/.test(name)||envelope?.format!=='MacroPulse encrypted')throw Error('Invalid encrypted photo item.');return raw('/storage/v1/object/macropulse-private/'+session.user.id+'/'+name,{method:'POST',headers:{'x-upsert':'false'},body:envelope});},
   downloadPhoto:name=>{if(!/^[a-f0-9]{64}\.json$/.test(name))throw Error('Invalid photo path.');return raw('/storage/v1/object/authenticated/macropulse-private/'+session.user.id+'/'+name);},
   deleteBackup:()=>raw('/rest/v1/mp_snapshots?user_id=eq.'+session.user.id,{method:'DELETE'}),
  };
 }
 const api={create};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MacroCloud=api;
})(typeof window!=='undefined'?window:globalThis);
