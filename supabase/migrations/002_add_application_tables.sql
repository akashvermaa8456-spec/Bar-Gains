-- Migration: Add dedicated project and internship application tables
-- This matches the application flows used by the site and ensures each submission is stored in the correct table.

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

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_project_inquiries') THEN
    CREATE TRIGGER set_updated_at_project_inquiries
    BEFORE UPDATE ON public.project_inquiries
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_internship_applications') THEN
    CREATE TRIGGER set_updated_at_internship_applications
    BEFORE UPDATE ON public.internship_applications
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;
