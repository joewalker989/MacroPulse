import { createClient } from 'npm:@supabase/supabase-js@2.95.3';
import { createHandler } from './core.mjs';
const env=(key:string)=>Deno.env.get(key)||'';
const client=(request:Request)=>createClient(env('SUPABASE_URL'),env('SUPABASE_ANON_KEY'),{global:{headers:{Authorization:request.headers.get('Authorization')||''}},auth:{persistSession:false,autoRefreshToken:false}});
Deno.serve(createHandler({env,authenticate:async(request:Request)=>{const token=(request.headers.get('Authorization')||'').replace(/^Bearer /,'');const {data,error}=await client(request).auth.getUser(token);return error?null:data.user;},quota:async(user:{id:string})=>{const admin=createClient(env('SUPABASE_URL'),env('SUPABASE_SERVICE_ROLE_KEY'),{auth:{persistSession:false,autoRefreshToken:false}});const {data,error}=await admin.rpc('mp_consume_ai_quota',{p_user_id:user.id});return !error&&data===true;}}));
