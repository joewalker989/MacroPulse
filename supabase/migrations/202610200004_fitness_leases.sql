-- Serialize provider refresh/revoke/reconnect across open tabs and devices.
create table if not exists public.mp_fitness_leases (
 user_id uuid primary key references auth.users(id) on delete cascade,
 lease_id uuid not null, expires_at timestamptz not null
);
alter table public.mp_fitness_leases enable row level security;
revoke all on public.mp_fitness_leases from public,anon,authenticated;
grant all on public.mp_fitness_leases to service_role;
create or replace function public.mp_fitness_lock(p_user_id uuid,p_lease_id uuid) returns boolean
language plpgsql security invoker set search_path='' as $$
declare got uuid;
begin
 insert into public.mp_fitness_leases(user_id,lease_id,expires_at) values(p_user_id,p_lease_id,now()+interval '10 minutes')
 on conflict(user_id) do update set lease_id=excluded.lease_id,expires_at=excluded.expires_at
 where public.mp_fitness_leases.expires_at<now() returning lease_id into got;
 return got is not null;
end $$;
revoke all on function public.mp_fitness_lock(uuid,uuid) from public,anon,authenticated;
grant execute on function public.mp_fitness_lock(uuid,uuid) to service_role;
