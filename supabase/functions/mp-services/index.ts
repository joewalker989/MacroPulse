import { createClient } from 'npm:@supabase/supabase-js@2.95.3';
import { createHandler } from './core.mjs';
import { createFitness } from './fitness.mjs';
const env=(key:string)=>Deno.env.get(key)||'';
const client=(request:Request)=>createClient(env('SUPABASE_URL'),env('SUPABASE_ANON_KEY'),{global:{headers:{Authorization:request.headers.get('Authorization')||''}},auth:{persistSession:false,autoRefreshToken:false}});
const admin=createClient(env('SUPABASE_URL'),env('SUPABASE_SERVICE_ROLE_KEY'),{auth:{persistSession:false,autoRefreshToken:false}});
const check=(result:any)=>{if(result.error)throw Error('Private provider storage is unavailable. No local data changed.');return result.data;};
const fitness=createFitness({env,store:{
 lock:async(user:string,lease:string)=>check(await admin.rpc('mp_fitness_lock',{p_user_id:user,p_lease_id:lease}))===true,
 unlock:async(user:string,lease:string)=>check(await admin.from('mp_fitness_leases').delete().eq('user_id',user).eq('lease_id',lease)),
 setState:async(user:string,state_hash:string,expires_at:string)=>check(await admin.from('mp_fitness_states').upsert({user_id:user,state_hash,expires_at})),
 consumeState:async(user:string,state_hash:string)=>(check(await admin.from('mp_fitness_states').delete().eq('user_id',user).eq('state_hash',state_hash).gt('expires_at',new Date().toISOString()).select('user_id'))||[]).length===1,
 readToken:async(user:string)=>check(await admin.from('mp_fitness_tokens').select('revision,payload').eq('user_id',user).maybeSingle()),
 writeToken:async(user:string,payload:any,revision:number|null)=>check(await admin.rpc('mp_put_fitness_token',{p_user_id:user,p_payload:payload,p_revision:revision}))===true,
 deleteToken:async(user:string)=>{check(await admin.from('mp_fitness_tokens').delete().eq('user_id',user));check(await admin.from('mp_fitness_states').delete().eq('user_id',user));},
}});
Deno.serve(createHandler({env,fitness,authenticate:async(request:Request)=>{const token=(request.headers.get('Authorization')||'').replace(/^Bearer /,'');const {data,error}=await client(request).auth.getUser(token);return error?null:data.user;},quota:async(user:{id:string})=>{const {data,error}=await admin.rpc('mp_consume_ai_quota',{p_user_id:user.id});return !error&&data===true;}}));
