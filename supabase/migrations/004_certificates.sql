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
