-- Additive MacroPulse-owned objects only. Existing project tables are untouched.
create table if not exists public.mp_snapshots (
 user_id uuid primary key references auth.users(id) on delete cascade,
 revision bigint not null default 1 check(revision > 0),
 payload jsonb not null check(jsonb_typeof(payload)='object' and payload->>'format'='MacroPulse encrypted' and octet_length(payload::text)<9000000),
 updated_at timestamptz not null default now()
);
alter table public.mp_snapshots enable row level security;
create policy mp_snapshot_owner on public.mp_snapshots for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
grant select,insert,update,delete on public.mp_snapshots to authenticated;
revoke all on public.mp_snapshots from anon;

create or replace function public.mp_put_snapshot(expected_revision bigint, encrypted_payload jsonb)
returns table(revision bigint,updated_at timestamptz)
language plpgsql security invoker set search_path='' as $$
declare owner_id uuid := auth.uid();
begin
 if owner_id is null then raise exception 'Authentication required' using errcode='28000'; end if;
 if expected_revision=0 then
  return query insert into public.mp_snapshots(user_id,payload) values(owner_id,encrypted_payload)
   on conflict(user_id) do nothing returning mp_snapshots.revision,mp_snapshots.updated_at;
 else
  return query update public.mp_snapshots set payload=encrypted_payload,revision=mp_snapshots.revision+1,updated_at=now()
   where user_id=owner_id and mp_snapshots.revision=expected_revision returning mp_snapshots.revision,mp_snapshots.updated_at;
 end if;
end $$;
revoke all on function public.mp_put_snapshot(bigint,jsonb) from public,anon;
grant execute on function public.mp_put_snapshot(bigint,jsonb) to authenticated;

create table if not exists public.mp_api_quota (
 user_id uuid not null references auth.users(id) on delete cascade,
 day date not null default (now() at time zone 'UTC')::date,
 calls integer not null default 0 check(calls>=0),
 primary key(user_id,day)
);
alter table public.mp_api_quota enable row level security;
create policy mp_quota_owner on public.mp_api_quota for select to authenticated using ((select auth.uid())=user_id);
grant select on public.mp_api_quota to authenticated;
revoke all on public.mp_api_quota from anon;
create or replace function public.mp_consume_ai_quota() returns boolean
language plpgsql security definer set search_path='' as $$
declare owner_id uuid := auth.uid(); used integer;
begin
 if owner_id is null then return false; end if;
 insert into public.mp_api_quota(user_id,day,calls) values(owner_id,(now() at time zone 'UTC')::date,1)
 on conflict(user_id,day) do update set calls=public.mp_api_quota.calls+1 where public.mp_api_quota.calls<20 returning calls into used;
 return used is not null;
end $$;
revoke all on function public.mp_consume_ai_quota() from public,anon;
grant execute on function public.mp_consume_ai_quota() to authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 values('macropulse-private','macropulse-private',false,40000000,array['application/json']) on conflict(id) do nothing;
create policy mp_photo_read on storage.objects for select to authenticated using(bucket_id='macropulse-private' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy mp_photo_insert on storage.objects for insert to authenticated with check(bucket_id='macropulse-private' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy mp_photo_update on storage.objects for update to authenticated using(bucket_id='macropulse-private' and (storage.foldername(name))[1]=(select auth.uid())::text) with check(bucket_id='macropulse-private' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy mp_photo_delete on storage.objects for delete to authenticated using(bucket_id='macropulse-private' and (storage.foldername(name))[1]=(select auth.uid())::text);
