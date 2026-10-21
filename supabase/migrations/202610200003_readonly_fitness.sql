-- Provider credentials are server-only, separate from user-passphrase backups.
create table if not exists public.mp_fitness_states (
 user_id uuid primary key references auth.users(id) on delete cascade,
 state_hash text not null check(length(state_hash)=64), expires_at timestamptz not null
);
create table if not exists public.mp_fitness_tokens (
 user_id uuid primary key references auth.users(id) on delete cascade,
 revision bigint not null default 1, payload jsonb not null,
 updated_at timestamptz not null default now()
);
alter table public.mp_fitness_states enable row level security;
alter table public.mp_fitness_tokens enable row level security;
revoke all on public.mp_fitness_states,public.mp_fitness_tokens from public,anon,authenticated;
grant all on public.mp_fitness_states,public.mp_fitness_tokens to service_role;
-- No client policies: these tables can only be accessed by the service role.
create or replace function public.mp_put_fitness_token(p_user_id uuid,p_payload jsonb,p_revision bigint default null) returns boolean
language plpgsql security invoker set search_path='' as $$
declare wrote bigint;
begin
 if p_revision is null then
  insert into public.mp_fitness_tokens(user_id,payload) values(p_user_id,p_payload)
  on conflict(user_id) do update set payload=excluded.payload,revision=public.mp_fitness_tokens.revision+1,updated_at=now()
  returning revision into wrote;
 else
  update public.mp_fitness_tokens set payload=p_payload,revision=revision+1,updated_at=now()
  where user_id=p_user_id and revision=p_revision returning revision into wrote;
 end if;
 return wrote is not null;
end $$;
revoke all on function public.mp_put_fitness_token(uuid,jsonb,bigint) from public,anon,authenticated;
grant execute on function public.mp_put_fitness_token(uuid,jsonb,bigint) to service_role;
