create type public.app_role as enum ('admin');
create type public.inquiry_status as enum ('new','contacted','confirmed','packed','dispatched','delivered','cancelled');
create type public.product_status as enum ('draft','published','archived');

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

create policy "own roles readable" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

-- first signed-in user may claim admin only while no admin exists
create or replace function public.claim_first_admin()
returns boolean language plpgsql security definer set search_path = public
as $$
begin
  if auth.uid() is null then return false; end if;
  perform pg_advisory_xact_lock(424242);
  if exists (select 1 from public.user_roles where role = 'admin') then
    return public.has_role(auth.uid(),'admin');
  end if;
  insert into public.user_roles(user_id, role) values (auth.uid(),'admin');
  return true;
end $$;
revoke all on function public.claim_first_admin() from public, anon;
grant execute on function public.claim_first_admin() to authenticated;

create or replace function public.admin_exists()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where role='admin') $$;
grant execute on function public.admin_exists() to anon, authenticated;

create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path = public
as $$ begin new.updated_at = now(); return new; end $$;

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{1,80}$'),
  name text not null check (char_length(name) between 1 and 120),
  description text check (char_length(description) <= 1000),
  image_url text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;
grant all on public.categories to service_role;
alter table public.categories enable row level security;
create policy "public read active categories" on public.categories for select to anon, authenticated using (is_active or public.has_role(auth.uid(),'admin'));
create policy "admin manage categories" on public.categories for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger categories_touch before update on public.categories for each row execute function public.touch_updated_at();

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{1,120}$'),
  name text not null check (char_length(name) between 1 and 160),
  category_id uuid references public.categories(id) on delete set null,
  price numeric(12,2) check (price is null or price >= 0),
  stock int not null default 0 check (stock >= 0),
  low_stock_threshold int not null default 2 check (low_stock_threshold >= 0),
  description text check (char_length(description) <= 2000),
  details text check (char_length(details) <= 6000),
  materials text check (char_length(materials) <= 500),
  dimensions text check (char_length(dimensions) <= 500),
  care text check (char_length(care) <= 1000),
  specs jsonb not null default '[]'::jsonb,
  status product_status not null default 'draft',
  inquiry_eligible boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;
create policy "public read published products" on public.products for select to anon, authenticated using (status = 'published' or public.has_role(auth.uid(),'admin'));
create policy "admin manage products" on public.products for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger products_touch before update on public.products for each row execute function public.touch_updated_at();
create index on public.products(category_id);
create index on public.products(status);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text,
  url text not null,
  alt text check (char_length(alt) <= 300),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.product_images to anon, authenticated;
grant insert, update, delete on public.product_images to authenticated;
grant all on public.product_images to service_role;
alter table public.product_images enable row level security;
create policy "public read images of published" on public.product_images for select to anon, authenticated using (
  public.has_role(auth.uid(),'admin') or exists (select 1 from public.products p where p.id = product_id and p.status='published'));
create policy "admin manage images" on public.product_images for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create index on public.product_images(product_id, sort_order);

create table public.business_settings (
  id int primary key default 1 check (id = 1),
  business_name text not null default 'Baba Ramdev Handicrafts',
  logo_url text,
  phone text, whatsapp text, email text, address text,
  instagram text, facebook text, youtube text,
  intro text,
  privacy_text text, terms_text text, returns_text text,
  updated_at timestamptz not null default now()
);
grant select on public.business_settings to anon, authenticated;
grant update on public.business_settings to authenticated;
grant all on public.business_settings to service_role;
alter table public.business_settings enable row level security;
create policy "public read settings" on public.business_settings for select to anon, authenticated using (true);
create policy "admin update settings" on public.business_settings for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger settings_touch before update on public.business_settings for each row execute function public.touch_updated_at();
insert into public.business_settings(id) values (1);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  idempotency_key uuid not null unique,
  status inquiry_status not null default 'new',
  customer_name text not null check (char_length(customer_name) between 1 and 100),
  phone text not null check (char_length(phone) between 6 and 20),
  email text check (char_length(email) <= 255),
  address text not null check (char_length(address) between 5 and 600),
  message text check (char_length(message) <= 1500),
  estimated_total numeric(12,2),
  ip_hash text,
  admin_notes text check (char_length(admin_notes) <= 4000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, update on public.inquiries to authenticated;
grant all on public.inquiries to service_role;
alter table public.inquiries enable row level security;
create policy "admin read inquiries" on public.inquiries for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin update inquiries" on public.inquiries for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger inquiries_touch before update on public.inquiries for each row execute function public.touch_updated_at();
create index on public.inquiries(created_at desc);
create index on public.inquiries(ip_hash, created_at);

create table public.inquiry_items (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.inquiries(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_slug text,
  unit_price numeric(12,2),
  quantity int not null check (quantity between 1 and 50)
);
grant select on public.inquiry_items to authenticated;
grant all on public.inquiry_items to service_role;
alter table public.inquiry_items enable row level security;
create policy "admin read items" on public.inquiry_items for select to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.inquiry_status_history (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.inquiries(id) on delete cascade,
  from_status inquiry_status,
  to_status inquiry_status not null,
  changed_by uuid,
  created_at timestamptz not null default now()
);
grant select on public.inquiry_status_history to authenticated;
grant all on public.inquiry_status_history to service_role;
alter table public.inquiry_status_history enable row level security;
create policy "admin read history" on public.inquiry_status_history for select to authenticated using (public.has_role(auth.uid(),'admin'));

create or replace function public.log_inquiry_status() returns trigger language plpgsql security definer set search_path = public
as $$ begin
  if tg_op = 'INSERT' then
    insert into public.inquiry_status_history(inquiry_id, from_status, to_status, changed_by) values (new.id, null, new.status, null);
  elsif new.status is distinct from old.status then
    insert into public.inquiry_status_history(inquiry_id, from_status, to_status, changed_by) values (new.id, old.status, new.status, auth.uid());
  end if;
  return new;
end $$;
create trigger inquiries_status_log after insert or update of status on public.inquiries for each row execute function public.log_inquiry_status();

-- Server-only inquiry submission: validates publication, eligibility, stock and DB prices atomically
create or replace function public.submit_inquiry(
  _idempotency_key uuid, _name text, _phone text, _email text, _address text, _message text,
  _items jsonb, _ip_hash text
) returns table(reference text, duplicate boolean)
language plpgsql security definer set search_path = public
as $$
declare
  existing text; inq_id uuid; ref text; total numeric(12,2) := 0; has_unpriced boolean := false;
  it jsonb; p record; q int; n int;
begin
  select i.reference into existing from public.inquiries i where i.idempotency_key = _idempotency_key;
  if existing is not null then return query select existing, true; return; end if;

  if (select count(*) from public.inquiries where ip_hash = _ip_hash and created_at > now() - interval '1 hour') >= 5 then
    raise exception 'RATE_LIMIT';
  end if;

  n := jsonb_array_length(_items);
  if n < 1 or n > 20 then raise exception 'INVALID_ITEMS'; end if;

  ref := upper(encode(gen_random_bytes(9), 'hex'));
  insert into public.inquiries(reference, idempotency_key, customer_name, phone, email, address, message, ip_hash)
    values (ref, _idempotency_key, _name, _phone, nullif(_email,''), _address, nullif(_message,''), _ip_hash)
    returning id into inq_id;

  for it in select * from jsonb_array_elements(_items) loop
    q := (it->>'quantity')::int;
    select * into p from public.products where id = (it->>'product_id')::uuid for update;
    if p.id is null or p.status <> 'published' or not p.inquiry_eligible then raise exception 'UNAVAILABLE:%', coalesce(p.name, 'item'); end if;
    if q < 1 or q > 50 then raise exception 'INVALID_QTY'; end if;
    if p.stock < q then raise exception 'STOCK:%', p.name; end if;
    insert into public.inquiry_items(inquiry_id, product_id, product_name, product_slug, unit_price, quantity)
      values (inq_id, p.id, p.name, p.slug, p.price, q);
    if p.price is null then has_unpriced := true; else total := total + p.price * q; end if;
  end loop;

  update public.inquiries set estimated_total = case when has_unpriced then null else total end where id = inq_id;
  return query select ref, false;
end $$;
revoke all on function public.submit_inquiry(uuid,text,text,text,text,text,jsonb,text) from public, anon, authenticated;
grant execute on function public.submit_inquiry(uuid,text,text,text,text,text,jsonb,text) to service_role;

-- storage policies for product-images bucket
create policy "public read product images" on storage.objects for select using (bucket_id = 'product-images');
create policy "admin insert product images" on storage.objects for insert to authenticated with check (bucket_id = 'product-images' and public.has_role(auth.uid(),'admin'));
create policy "admin update product images" on storage.objects for update to authenticated using (bucket_id = 'product-images' and public.has_role(auth.uid(),'admin'));
create policy "admin delete product images" on storage.objects for delete to authenticated using (bucket_id = 'product-images' and public.has_role(auth.uid(),'admin'));
