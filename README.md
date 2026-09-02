# Bar-Gains & Company

Public website MVP for two practices: student training & internships, and digital work for startups and small businesses.

**Phase 1 (current):** complete public UI, navigation, content pages, form validation, SEO metadata.  
**Completed now:** Phase 2 (database SQL files + seeds) and Phase 3 (forms wired to server routes).  
**Remaining:** Supabase Auth wiring, student/admin dashboards, additional admin UIs.

## Requirements

- Node.js 18+ (LTS recommended)
- npm
- A free [Supabase](https://supabase.com) project or local Postgres
- pgAdmin or Supabase SQL editor (optional)

## Installation

1. Clone the repo and open a terminal in the project root.
2. Copy env example and edit values:

   copy .env.example .env.local
   (Edit `.env.local` and fill in Supabase URL and keys)

3. Install dependencies:

   npm install

   Note: On Windows, if `npm` errors in PowerShell with an execution policy message, either run the commands in Command Prompt (cmd.exe) or enable scripts with:

   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

   (Only if you understand the implications.)

4. Run the dev server:

   npm run dev

Open http://localhost:3000.

## Environment variables

See `.env.example`. Important values:

- NEXT_PUBLIC_SUPABASE_URL — your Supabase URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY — public/anon key
- SUPABASE_SERVICE_ROLE_KEY — server-only service role (keep secret)
- NEXT_PUBLIC_SITE_URL — e.g. http://localhost:3000

Do NOT commit `.env.local`.

## Database setup (Supabase or local Postgres)

Files are in `supabase/`:
- `schema.sql` — table definitions, triggers
- `rls.sql` — Row Level Security policies (designed for Supabase auth)
- `seeds.sql` — demo internships, courses and projects

Recommended steps (Supabase):
1. Create a Supabase project.
2. In Supabase SQL editor run, in order:
   - `supabase/schema.sql`
   - `supabase/rls.sql`
   - `supabase/seeds.sql`
3. Create an ADMIN profile after you create an auth user (replace <auth-uid> with the user's UID):

   INSERT INTO public.profiles (id, full_name, email, role) VALUES ('<auth-uid>', 'Admin Name', 'admin@example.com', 'ADMIN');

Local Postgres (pgAdmin):
1. Create a database (e.g., `bar_gains_db`).
2. Run `supabase/schema.sql` and `supabase/seeds.sql` in the Query Tool.
3. To test `rls.sql` locally (optional), create a stub `auth.uid()` function before running it:

   CREATE SCHEMA IF NOT EXISTS auth;
   CREATE OR REPLACE FUNCTION auth.uid() RETURNS text LANGUAGE sql STABLE AS $$ SELECT NULL::text; $$;

Note: server routes use the `SUPABASE_SERVICE_ROLE_KEY` to write data and thus bypass RLS — this is intentional for Phase 3 so forms work before auth is wired.

## What was added in Phase 3 (Forms)

- Server routes to persist submissions:
  - POST /api/contact -> contact_enquiries
  - POST /api/business-leads -> business_leads
  - POST /api/student-applications -> student_applications
- Server-side supabase helper: `src/lib/supabaseServer.ts`
- Client forms updated to POST to those endpoints and show success/error states.

## Running & testing forms

1. Ensure `.env.local` has NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or run against local Postgres and adjust client).
2. Start dev server: `npm run dev`.
3. Fill and submit the Contact, Partner, Business Enquiry, or Apply forms in the site.
4. Verify rows in Supabase Table Editor or pgAdmin.

## Next recommended steps (I can implement on request)

1. Phase 4 — Wire Supabase Auth: implement login/register/forgot using `@supabase/supabase-js`, create profile rows on registration, protect `/dashboard` and `/admin` routes.
2. Phase 5 — Student dashboard: show user profile, applications, program statuses.
3. Phase 6 — Admin dashboard: totals, lists, change statuses, CRUD for programs and courses.
4. Add transactional email abstraction and demo hooks for registration and submissions.

## Troubleshooting

- If server routes return 500, check that `SUPABASE_SERVICE_ROLE_KEY` is present in `.env.local` and the URL keys match your Supabase project.
- If inserts fail with permission errors, confirm RLS policies in Supabase Console or use the service role key for server-side inserts.

---

If you want, I'll proceed to Phase 4 now and wire Supabase Auth and protect dashboard/admin routes. Say "Proceed Phase 4" to continue.