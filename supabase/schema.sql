create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  mobile text,
  email text not null unique,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- The Node backend uses the Supabase secret key server-side and performs profile access there.
-- Do not expose SUPABASE_SECRET_KEY in frontend code.
