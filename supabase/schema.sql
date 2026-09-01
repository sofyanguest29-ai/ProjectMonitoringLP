-- Jalankan file ini di Supabase Dashboard -> SQL Editor

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  deadline date not null,
  status text not null default 'not_started'
    check (status in ('not_started', 'in_progress', 'done', 'delayed')),
  created_by uuid references auth.users(id) default auth.uid(),
  created_at timestamptz default now()
);

-- Aktifkan Row Level Security
alter table public.projects enable row level security;

-- Semua user yang sudah login boleh lihat semua project (internal tool)
create policy "Authenticated users can view all projects"
  on public.projects for select
  using (auth.role() = 'authenticated');

-- User hanya boleh insert project atas nama dirinya sendiri
create policy "Users can insert their own projects"
  on public.projects for insert
  with check (auth.uid() = created_by);

-- User hanya boleh update project yang dia buat sendiri
create policy "Users can update their own projects"
  on public.projects for update
  using (auth.uid() = created_by);

-- User hanya boleh hapus project yang dia buat sendiri
create policy "Users can delete their own projects"
  on public.projects for delete
  using (auth.uid() = created_by);
