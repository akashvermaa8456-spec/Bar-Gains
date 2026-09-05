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

-- Dedicated internship applications
CREATE TABLE IF NOT EXISTS public.internship_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  internship_id uuid REFERENCES public.internships(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  college text,
  degree text,
  branch text,
  year text,
  message text,
  status text NOT NULL DEFAULT 'NEW',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_internship_applications_profile ON public.internship_applications (profile_id);
CREATE INDEX IF NOT EXISTS idx_internship_applications_internship ON public.internship_applications (internship_id);

-- Project interest submissions
CREATE TABLE IF NOT EXISTS public.project_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  project_slug text,
  project_title text,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  college text,
  degree text,
  branch text,
  year text,
  message text,
  status text NOT NULL DEFAULT 'INTERESTED',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_project_inquiries_profile ON public.project_inquiries (profile_id);
CREATE INDEX IF NOT EXISTS idx_project_inquiries_slug ON public.project_inquiries (project_slug);

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
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_internship_applications') THEN
    CREATE TRIGGER set_updated_at_internship_applications BEFORE UPDATE ON public.internship_applications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_project_inquiries') THEN
    CREATE TRIGGER set_updated_at_project_inquiries BEFORE UPDATE ON public.project_inquiries FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_business_leads') THEN
    CREATE TRIGGER set_updated_at_business_leads BEFORE UPDATE ON public.business_leads FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END$$;

-- End of schema


-- Migration: certificate generation and public verification
-- Run this once in Supabase SQL Editor.

CREATE SEQUENCE IF NOT EXISTS public.certificate_serial_seq;

CREATE TABLE IF NOT EXISTS public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id text UNIQUE,
  certificate_type text NOT NULL DEFAULT 'INTERNSHIP',
  student_name text NOT NULL,
  program text NOT NULL,
  start_date date,
  end_date date,
  training_mode text,
  remarks text,
  issue_date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'VALID',
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT certificates_type_check
    CHECK (certificate_type IN ('INTERNSHIP', 'TRAINING', 'COURSE')),
  CONSTRAINT certificates_status_check
    CHECK (status IN ('VALID', 'REVOKED'))
);

CREATE INDEX IF NOT EXISTS idx_certificates_certificate_id
  ON public.certificates (certificate_id);
CREATE INDEX IF NOT EXISTS idx_certificates_student_name
  ON public.certificates (student_name);
CREATE INDEX IF NOT EXISTS idx_certificates_status
  ON public.certificates (status);

CREATE OR REPLACE FUNCTION public.set_certificate_id()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  prefix text;
BEGIN
  IF NEW.certificate_id IS NULL OR btrim(NEW.certificate_id) = '' THEN
    prefix := CASE NEW.certificate_type
      WHEN 'INTERNSHIP' THEN 'INT'
      WHEN 'TRAINING' THEN 'TRN'
      WHEN 'COURSE' THEN 'CRS'
      ELSE 'CERT'
    END;

    NEW.certificate_id :=
      'BGC-' || prefix || '-' ||
      to_char(COALESCE(NEW.issue_date, CURRENT_DATE), 'YYYY') || '-' ||
      lpad(nextval('public.certificate_serial_seq')::text, 5, '0');
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_certificate_id ON public.certificates;
CREATE TRIGGER set_certificate_id
BEFORE INSERT ON public.certificates
FOR EACH ROW
EXECUTE FUNCTION public.set_certificate_id();

DROP TRIGGER IF EXISTS set_updated_at_certificates ON public.certificates;
CREATE TRIGGER set_updated_at_certificates
BEFORE UPDATE ON public.certificates
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can verify valid certificates" ON public.certificates;
CREATE POLICY "Public can verify valid certificates"
ON public.certificates
FOR SELECT
TO anon, authenticated
USING (status = 'VALID');

GRANT SELECT ON public.certificates TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.certificate_serial_seq TO service_role;
