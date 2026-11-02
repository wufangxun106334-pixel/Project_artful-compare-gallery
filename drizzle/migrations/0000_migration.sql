create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create policy "Users read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

-- The first account ever created becomes the administrator; later sign-ups get no role.
create or replace function public.grant_first_admin()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end $$;
create trigger on_auth_user_created_grant_admin after insert on auth.users
for each row execute function public.grant_first_admin();

create table public.artworks (
  id text primary key,
  slug text not null unique,
  title text not null,
  description text not null default '',
  category text not null default 'early-netherlandish',
  image_url text not null default '',
  thumbnail_url text not null default '',
  image_path text,
  sort_order integer not null default 0,
  status text not null default 'published',
  maker_display text not null default '',
  year_start integer,
  year_end integer,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index artworks_category_sort on public.artworks (category, sort_order);
create index artworks_status_sort on public.artworks (status, sort_order);

grant select on public.artworks to anon;
grant select, insert, update, delete on public.artworks to authenticated;
grant all on public.artworks to service_role;
alter table public.artworks enable row level security;

create policy "Anyone reads published artworks" on public.artworks for select to anon, authenticated using (status = 'published');
create policy "Admins read all artworks" on public.artworks for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins insert artworks" on public.artworks for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins update artworks" on public.artworks for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete artworks" on public.artworks for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path = public
as $$ begin new.updated_at = now(); return new; end $$;
create trigger artworks_touch before update on public.artworks for each row execute function public.touch_updated_at();

alter table public.artworks add constraint artworks_status_check check (status in ('published','draft'));