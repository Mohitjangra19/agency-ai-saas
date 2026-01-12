-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Clients Table
create table clients (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text,
  industry text,
  website text,
  user_id uuid references auth.users(id)
);

-- Projects Table
create table projects (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  client_id uuid references clients(id) on delete cascade not null,
  name text not null,
  description text,
  status text check (status in ('pending', 'in-progress', 'completed', 'cancelled')) default 'pending',
  start_date date,
  estimated_end_date date,
  budget numeric
);

-- Tasks Table
create table tasks (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  project_id uuid references projects(id) on delete cascade not null,
  title text not null,
  description text,
  status text check (status in ('todo', 'in-progress', 'done')) default 'todo',
  assigned_to text
);

-- Invoices Table
create table invoices (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  project_id uuid references projects(id) on delete cascade not null,
  amount numeric not null,
  status text check (status in ('draft', 'sent', 'paid', 'overdue')) default 'draft',
  due_date date,
  pdf_url text
);

-- Enable Row Level Security (RLS)
alter table clients enable row level security;
alter table projects enable row level security;
alter table tasks enable row level security;
alter table invoices enable row level security;

-- Policies (Simple policies for now - can be refined later)
-- Allow authenticated users to view/edit their own data (assuming user_id is set on clients)
-- For this MVP, we might just allow all authenticated users to read/write for simplicity if multiple users aren't a hard requirement yet.
-- But let's add a basic policy for clients linked to auth.users if possible. 
-- Since we are building a SaaS for *agencies*, we assume the logged-in user is the agency owner.

-- Policy: Users can see clients they created
create policy "Users can view their own clients" on clients
  for select using (auth.uid() = user_id);

create policy "Users can insert their own clients" on clients
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own clients" on clients
  for update using (auth.uid() = user_id);

-- For related tables, we can join or just allow auth users for now to keep it simple, 
-- or strictly enforce ownership via client_id. 
-- For MVP speed, let's allow authenticated users to perform actions.

create policy "Authenticated users can view projects" on projects for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert projects" on projects for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update projects" on projects for update using (auth.role() = 'authenticated');

create policy "Authenticated users can view tasks" on tasks for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert tasks" on tasks for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update tasks" on tasks for update using (auth.role() = 'authenticated');

create policy "Authenticated users can view invoices" on invoices for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert invoices" on invoices for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update invoices" on invoices for update using (auth.role() = 'authenticated');
