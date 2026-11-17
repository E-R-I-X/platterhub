-- The Platter Hub — Order Management Schema
-- Run in Supabase SQL editor. Currency amounts are stored in Naira (integer kobo optional; we use numeric Naira).

create extension if not exists "pgcrypto";

create type public.order_type as enum ('food_delivery', 'event_catering');
create type public.payment_status as enum ('pending', 'partial', 'paid', 'failed');
create type public.order_status as enum ('pending', 'confirmed', 'completed', 'cancelled');
create type public.menu_variant as enum ('small', 'medium', 'large');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'owner',
  created_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.menu_categories (id) on delete cascade,
  name text not null,
  description text,
  price_small numeric(12, 2),
  price_medium numeric(12, 2),
  price_large numeric(12, 2),
  unit_label text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  order_type public.order_type not null,
  customer_id uuid references public.customers (id) on delete set null,
  customer_name text not null,
  phone text not null,
  address text not null,
  event_date date not null,
  event_time text,
  recipient text,
  special_requests text,
  guest_count int,
  theme text,
  table_organisation boolean not null default false,
  table_style text,
  table_count text,
  seating_notes text,
  styling_fee numeric(12, 2) not null default 0,
  delivery_fee numeric(12, 2) not null default 0,
  product_fee numeric(12, 2) not null default 0,
  total_price numeric(12, 2) not null default 0,
  amount_paid numeric(12, 2) not null default 0,
  payment_status public.payment_status not null default 'pending',
  status public.order_status not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_line_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  menu_item_id uuid references public.menu_items (id) on delete set null,
  name text not null,
  description text,
  variant public.menu_variant,
  quantity int not null check (quantity > 0),
  unit_price numeric(12, 2) not null,
  total_price numeric(12, 2) not null
);

create index orders_event_date_idx on public.orders (event_date);
create index orders_order_type_idx on public.orders (order_type);
create index orders_payment_status_idx on public.orders (payment_status);
create index orders_customer_name_idx on public.orders (customer_name);
create index customers_phone_idx on public.customers (phone);
create index menu_items_category_id_idx on public.menu_items (category_id);
create index order_line_items_order_id_idx on public.order_line_items (order_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger customers_set_updated_at
before update on public.customers
for each row execute function public.set_updated_at();

create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_line_items enable row level security;

create policy "Owner full access profiles"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Authenticated full access customers"
  on public.customers for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated full access menu_categories"
  on public.menu_categories for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated full access menu_items"
  on public.menu_items for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated full access orders"
  on public.orders for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated full access order_line_items"
  on public.order_line_items for all
  to authenticated
  using (true)
  with check (true);
