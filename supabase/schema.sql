-- Run this in the Supabase SQL editor (once).

create table if not exists public.list_states (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.list_states enable row level security;

drop policy if exists "Users can read own lists" on public.list_states;
create policy "Users can read own lists"
  on public.list_states
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own lists" on public.list_states;
create policy "Users can insert own lists"
  on public.list_states
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own lists" on public.list_states;
create policy "Users can update own lists"
  on public.list_states
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table public.list_states replica identity full;

do $$
begin
  alter publication supabase_realtime add table public.list_states;
exception
  when duplicate_object then null;
end $$;
