# People Hub — Supabase CRUD Demo

A clean, minimal CRUD application built with Supabase, React and Vite. Manages employees and departments with a real PostgreSQL database — no custom backend needed.

**Live demo:** https://supabaseexample-one.vercel.app/

---

## Features

- Full CRUD for **employees** and **departments**
- Search and filter employees by name, position or department
- Dashboard with payroll stats and headcount by department
- Clean modal forms with validation
- Delete confirmation dialogs
- Realtime data from Supabase (no page reloads needed)

## Tech stack

| Layer | Technology |
|-------|-----------|
| Database | Supabase (PostgreSQL) |
| DB client | `@supabase/supabase-js` |
| Frontend | React 19 + Vite + TypeScript |
| Styles | Tailwind CSS v4 |
| Forms | React Hook Form |
| Routing | React Router v7 |
| Icons | Lucide React |
| Deploy | Vercel |

## Database schema

```
departments
├── id           uuid  PK
├── name         text
├── description  text
├── location     text
├── budget       numeric
└── created_at   timestamptz

employees
├── id            uuid  PK
├── first_name    text
├── last_name     text
├── email         text  UNIQUE
├── phone         text
├── position      text
├── hire_date     date
├── salary        numeric
├── department_id uuid  FK → departments.id
└── created_at    timestamptz
```

## Local setup

**1. Clone and install**

```bash
git clone https://github.com/ssangas-projects/supabase_example.git
cd supabase_example
npm install
```

**2. Create a Supabase project**

Go to [supabase.com](https://supabase.com), create a new project, then run the SQL in `supabase/schema.sql` from the SQL Editor. This creates both tables, enables Row Level Security and seeds 5 departments and 12 employees.

**3. Configure environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials (Settings → Data API):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_public_key
```

**4. Start the dev server**

```bash
npm run dev
```

Open http://localhost:5173

## Project structure

```
src/
├── lib/
│   └── supabase.ts          # Supabase client
├── types/
│   └── index.ts             # TypeScript interfaces
├── hooks/
│   ├── useDepartments.ts    # CRUD hook for departments
│   └── useEmployees.ts      # CRUD hook for employees
├── components/
│   ├── Layout.tsx           # Sidebar + navigation
│   ├── Modal.tsx            # Reusable modal
│   ├── ConfirmDialog.tsx    # Delete confirmation
│   ├── departments/
│   │   ├── DepartmentTable.tsx
│   │   └── DepartmentForm.tsx
│   └── employees/
│       ├── EmployeeTable.tsx
│       └── EmployeeForm.tsx
└── pages/
    ├── Dashboard.tsx        # Stats overview
    ├── Departments.tsx      # Departments CRUD page
    └── Employees.tsx        # Employees CRUD page with search
```

## Deploy

The app is deployed on Vercel. Every push to `main` triggers an automatic redeployment.

To deploy your own instance:

1. Fork this repo
2. Import it in [vercel.com](https://vercel.com) → Add New Project
3. Set the two environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
4. Deploy — Vercel detects Vite automatically

## Security note

This demo uses Supabase's `anon` public key with permissive Row Level Security policies, which is fine for a demo. For a production app you would restrict RLS policies based on authenticated users and never expose the `service_role` key in the frontend.
