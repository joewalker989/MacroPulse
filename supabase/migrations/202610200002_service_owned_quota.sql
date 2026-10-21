-- Only the authenticated Edge Function's server client can consume quota.
alter function public.mp_consume_ai_quota() security invoker;
revoke all on function public.mp_consume_ai_quota() from public,anon,authenticated;
create or replace function public.mp_consume_ai_quota(p_user_id uuid) returns boolean
language plpgsql security invoker set search_path='' as $$
declare used integer;
begin
 if p_user_id is null then return false; end if;
 insert into public.mp_api_quota(user_id,day,calls) values(p_user_id,(now() at time zone 'UTC')::date,1)
 on conflict(user_id,day) do update set calls=public.mp_api_quota.calls+1 where public.mp_api_quota.calls<20 returning calls into used;
 return used is not null;
end $$;
revoke all on function public.mp_consume_ai_quota(uuid) from public,anon,authenticated;
grant execute on function public.mp_consume_ai_quota(uuid) to service_role;
