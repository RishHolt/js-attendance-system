-- Migration: create users table and seed default admin user
-- NOTE: This is a simple demo/admin user. For production, use Supabase Auth with proper password hashing.

-- Ensure pgcrypto is available for UUID generation (no-op if already enabled)
create extension if not exists "pgcrypto";

create table if not exists public.users (
    id uuid primary key default gen_random_uuid(),
    user_id text not null unique,
    username text not null unique,
    password text not null,
    name text not null,
    email text not null unique,
    contact_no text,
    status text not null default 'active',
    role text not null default 'user',
    position text,
    created_at timestamptz not null default now(),
    constraint users_status_check check (status in ('active', 'inactive')),
    constraint users_role_check check (role in ('user', 'admin'))
);

-- Seed default admin user
insert into public.users (user_id, username, password, name, email, contact_no, status, role, position)
values (
    '0',
    'admin123',
    'admin 123',
    'Admin User',
    'admin@example.com',
    '0000000000',
    'active',
    'admin',
    'Administrator'
)
on conflict (username) do update
set
    password = excluded.password,
    name = excluded.name,
    email = excluded.email,
    contact_no = excluded.contact_no,
    status = excluded.status,
    role = excluded.role,
    position = excluded.position,
    user_id = excluded.user_id;

