-- supabase/schema.sql
-- Database schema for Bar-Gains & Company (MVP)
-- Created for Phase 2: tables for profiles, internships, courses, projects, student applications, business leads, contact enquiries

-- Enable secure UUID generator
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text,
  email text UNIQUE,
  role text NOT NULL DEFAULT 'STUDENT', -- STUDENT | ADMIN
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles (email);

-- Internships
CREATE TABLE IF NOT EXISTS public.internships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  short_description text,
  description text,
  duration text,
  level text,
  technologies text[],
  curriculum text[],
  learning_outcomes text[],
  assignments text[],
  project text,
  price text,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_internships_published ON public.internships (published);
CREATE INDEX IF NOT EXISTS idx_internships_slug ON public.internships (slug);

-- Courses
CREATE TABLE IF NOT EXISTS public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  short_description text,
  description text,
  duration text,
  level text,
  technologies text[],
  curriculum text[],
  modules text[],
  learning_outcomes text[],
  price text,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_courses_published ON public.courses (published);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.courses (slug);

-- Projects (showcase)
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  technologies text[],
  category text,
  demo boolean NOT NULL DEFAULT true,
  url text,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects (published);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects (slug);

-- Student applications
CREATE TABLE IF NOT EXISTS public.student_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  college text,
  degree text,
  branch text,
  year text,
  program_id uuid REFERENCES public.internships(id) ON DELETE SET NULL,
  message text,
  status text NOT NULL DEFAULT 'NEW', -- NEW | CONTACTED | ENROLLED | REJECTED
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_student_applications_profile ON public.student_applications (profile_id);
CREATE INDEX IF NOT EXISTS idx_student_applications_program ON public.student_applications (program_id);

-- Business leads
CREATE TABLE IF NOT EXISTS public.business_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company_name text,
  email text,
  phone text,
  business_type text,
  service text,
  budget text,
  description text,
  status text NOT NULL DEFAULT 'NEW', -- NEW | CONTACTED | PROPOSAL_SENT | IN_PROGRESS | COMPLETED | LOST
  internal_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_business_leads_status ON public.business_leads (status);

-- Contact enquiries
CREATE TABLE IF NOT EXISTS public.contact_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  subject text,
  message text,
  status text NOT NULL DEFAULT 'NEW', -- NEW | CONTACTED | RESOLVED
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_contact_enquiries_status ON public.contact_enquiries (status);

-- Trigger to keep updated_at current on row modifications
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_profiles') THEN
    CREATE TRIGGER set_updated_at_profiles BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_internships') THEN
    CREATE TRIGGER set_updated_at_internships BEFORE UPDATE ON public.internships FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_courses') THEN
    CREATE TRIGGER set_updated_at_courses BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_projects') THEN
    CREATE TRIGGER set_updated_at_projects BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_student_applications') THEN
    CREATE TRIGGER set_updated_at_student_applications BEFORE UPDATE ON public.student_applications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_business_leads') THEN
    CREATE TRIGGER set_updated_at_business_leads BEFORE UPDATE ON public.business_leads FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END$$;

-- End of schema
