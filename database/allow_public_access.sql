-- Allow public read/write access to clients
create policy "Allow public access to clients"
on clients
for all
to public
using (true)
with check (true);

-- Allow public read/write access to projects
create policy "Allow public access to projects"
on projects
for all
to public
using (true)
with check (true);

-- Allow public read/write access to tasks
create policy "Allow public access to tasks"
on tasks
for all
to public
using (true)
with check (true);

-- Allow public read/write access to invoices
create policy "Allow public access to invoices"
on invoices
for all
to public
using (true)
with check (true);
