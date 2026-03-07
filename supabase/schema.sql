-- ============================================================
-- SCHEMA: departments + employees
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension (usually already enabled in Supabase)
create extension if not exists "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists departments (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  location    text,
  budget      numeric(12, 2),
  created_at  timestamptz not null default now()
);

create table if not exists employees (
  id            uuid primary key default gen_random_uuid(),
  first_name    text not null,
  last_name     text not null,
  email         text unique not null,
  phone         text,
  position      text not null,
  hire_date     date,
  salary        numeric(10, 2),
  department_id uuid references departments(id) on delete set null,
  created_at    timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (permissive for demo purposes)
-- ============================================================

alter table departments enable row level security;
alter table employees enable row level security;

-- Allow all operations for anon and authenticated users (demo)
create policy "allow_all_departments" on departments for all using (true) with check (true);
create policy "allow_all_employees"   on employees   for all using (true) with check (true);

-- ============================================================
-- SEED DATA — Departments
-- ============================================================

insert into departments (name, description, location, budget) values
  ('Engineering',  'Software development and infrastructure',         'Floor 3 — Building A', 850000.00),
  ('Design',       'UX/UI, brand identity and creative direction',    'Floor 2 — Building A', 320000.00),
  ('Marketing',    'Growth, campaigns and customer acquisition',      'Floor 1 — Building B', 480000.00),
  ('Human Resources', 'Talent, culture and people operations',        'Floor 1 — Building A', 260000.00),
  ('Finance',      'Accounting, budgeting and financial planning',    'Floor 4 — Building A', 300000.00);

-- ============================================================
-- SEED DATA — Employees
-- ============================================================

insert into employees (first_name, last_name, email, phone, position, hire_date, salary, department_id)
select
  e.first_name, e.last_name, e.email, e.phone, e.position, e.hire_date::date, e.salary, d.id
from (values
  ('Alejandro', 'Ramírez',   'a.ramirez@company.com',   '+1-555-0101', 'Senior Software Engineer',   '2021-03-15', 95000.00, 'Engineering'),
  ('Sofía',     'Herrera',   's.herrera@company.com',   '+1-555-0102', 'Frontend Developer',          '2022-07-01', 78000.00, 'Engineering'),
  ('Marco',     'Delgado',   'm.delgado@company.com',   '+1-555-0103', 'DevOps Engineer',             '2020-11-10', 88000.00, 'Engineering'),
  ('Valentina', 'Castro',    'v.castro@company.com',    '+1-555-0104', 'UX Designer',                 '2021-09-20', 72000.00, 'Design'),
  ('Nicolás',   'Morales',   'n.morales@company.com',   '+1-555-0105', 'Graphic Designer',            '2023-01-08', 62000.00, 'Design'),
  ('Camila',    'Jiménez',   'c.jimenez@company.com',   '+1-555-0106', 'Growth Marketing Manager',    '2020-06-15', 85000.00, 'Marketing'),
  ('Sebastián', 'Torres',    's.torres@company.com',    '+1-555-0107', 'Content Strategist',          '2022-04-01', 65000.00, 'Marketing'),
  ('Isabella',  'Vargas',    'i.vargas@company.com',    '+1-555-0108', 'HR Business Partner',         '2019-08-01', 70000.00, 'Human Resources'),
  ('Mateo',     'Flores',    'm.flores@company.com',    '+1-555-0109', 'Talent Acquisition Specialist','2023-03-15', 58000.00, 'Human Resources'),
  ('Luciana',   'Reyes',     'l.reyes@company.com',     '+1-555-0110', 'Financial Analyst',           '2021-01-20', 80000.00, 'Finance'),
  ('Daniel',    'Mendoza',   'd.mendoza@company.com',   '+1-555-0111', 'Senior Accountant',           '2020-05-01', 82000.00, 'Finance'),
  ('Gabriela',  'Ruiz',      'g.ruiz@company.com',      '+1-555-0112', 'Backend Developer',           '2022-10-03', 83000.00, 'Engineering')
) as e(first_name, last_name, email, phone, position, hire_date, salary, dept_name)
join departments d on d.name = e.dept_name;
