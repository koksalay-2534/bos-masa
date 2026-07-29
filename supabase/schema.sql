create extension if not exists pgcrypto;
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text check (role in ('user','business','admin')) default 'user',
  created_at timestamptz default now()
);
create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  name text not null,
  city text,
  category text,
  approved boolean default false,
  created_at timestamptz default now()
);
create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade,
  title text not null,
  description text,
  category text,
  city text,
  starts_at timestamptz default now(),
  ends_at timestamptz,
  usage_limit integer default 20,
  used_count integer default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);
create table if not exists claims (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references campaigns(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  code text unique not null,
  used boolean default false,
  created_at timestamptz default now()
);
alter table profiles enable row level security;
alter table businesses enable row level security;
alter table campaigns enable row level security;
alter table claims enable row level security;
create policy "public campaigns read" on campaigns for select using (is_active = true);
create policy "users own profile" on profiles for select using (auth.uid() = id);
create policy "business owner manage" on businesses for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "claim owner read" on claims for select using (auth.uid() = user_id);
create policy "claim owner insert" on claims for insert with check (auth.uid() = user_id);
