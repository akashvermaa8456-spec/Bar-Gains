-- Migration: Add course enrollments table
-- Created for Phase 4: Course enrollment tracking

-- Course enrollments
CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  college text,
  degree text,
  branch text,
  year text,
  message text,
  status text NOT NULL DEFAULT 'ENROLLED', -- ENROLLED | COMPLETED | DROPPED
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_profile ON public.course_enrollments (profile_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course ON public.course_enrollments (course_id);

-- Add trigger for course_enrollments updated_at
CREATE TRIGGER set_updated_at_course_enrollments 
BEFORE UPDATE ON public.course_enrollments 
FOR EACH ROW 
EXECUTE FUNCTION public.set_updated_at();
