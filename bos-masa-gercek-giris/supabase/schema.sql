-- Boş Masa temel profil tablosu ve güvenlik politikaları
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'user' check (role in ('user','business')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Kullanıcı kendi profilini görebilir"
on public.profiles for select
to authenticated
using (auth.uid() = id);

create policy "Kullanıcı kendi profilini güncelleyebilir"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    coalesce(new.raw_user_meta_data ->> 'role', 'user')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
