-- Run this in Supabase Dashboard -> SQL Editor -> New Query
-- Run the WHOLE file in one go.

create extension if not exists pgcrypto;

-- ============================================================
-- PROFILES  (one row per signed-up user; is_admin controls edit/delete rights)
-- ============================================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  is_admin boolean not null default false,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Automatically create a profile row whenever someone signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- DONATIONS
-- ============================================================
create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  phone text,
  amount numeric not null,
  image_url text,
  submitted_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

alter table public.donations enable row level security;

-- Any signed-in user can view all entries
create policy "Authenticated users can view donations"
  on public.donations for select
  using (auth.role() = 'authenticated');

-- Any signed-in user can add an entry (tagged as their own submission)
create policy "Authenticated users can insert donations"
  on public.donations for insert
  with check (auth.uid() = submitted_by);

-- Only admins can edit
create policy "Admins can update donations"
  on public.donations for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

-- Only admins can delete
create policy "Admins can delete donations"
  on public.donations for delete
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

-- ============================================================
-- STORAGE  (bucket for donation photos)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('chanda-images', 'chanda-images', true)
on conflict (id) do nothing;

create policy "Authenticated users can upload chanda images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'chanda-images');

create policy "Public can view chanda images"
  on storage.objects for select
  using (bucket_id = 'chanda-images');

-- ============================================================
-- MAKE YOURSELF ADMIN (run this AFTER you've signed up once in the app)
-- ============================================================
-- update public.profiles set is_admin = true where email = 'your-email@example.com';
