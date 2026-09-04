-- supabase/rls.sql
-- Row Level Security policies for Bar-Gains & Company
-- These policies assume Supabase auth is enabled and auth.uid() returns the current user's UUID (as text).

-- Helper: is_admin() to check if the current auth user is an ADMIN in profiles
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()::uuid AND role = 'ADMIN');
$$;

-- Enable RLS on sensitive tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_enquiries ENABLE ROW LEVEL SECURITY;

-- For public content tables allow read of published rows to everyone, admin can do anything
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published or admin can select internships" ON public.internships FOR SELECT USING (published = true OR public.is_admin());
CREATE POLICY "Admin full access internships" ON public.internships FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published or admin can select courses" ON public.courses FOR SELECT USING (published = true OR public.is_admin());
CREATE POLICY "Admin full access courses" ON public.courses FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published or admin can select projects" ON public.projects FOR SELECT USING (published = true OR public.is_admin());
CREATE POLICY "Admin full access projects" ON public.projects FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Profiles: users can view/edit their own profile; admins can view/edit all
CREATE POLICY "Users can select own profile" ON public.profiles FOR SELECT USING (auth.uid()::uuid = id OR public.is_admin());
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid()::uuid = id OR public.is_admin());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid()::uuid = id OR public.is_admin()) WITH CHECK (auth.uid()::uuid = id OR public.is_admin());
CREATE POLICY "Admin can delete profiles" ON public.profiles FOR DELETE USING (public.is_admin());

-- Student applications: allow applicants to create applications (authenticated), view their own, admins can manage
CREATE POLICY "Anyone can insert application (authenticated)" ON public.student_applications FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND (profile_id IS NULL OR profile_id = auth.uid()::uuid) OR public.is_admin());
CREATE POLICY "Owner or admin select applications" ON public.student_applications FOR SELECT USING (profile_id = auth.uid()::uuid OR public.is_admin());
CREATE POLICY "Owner or admin update applications" ON public.student_applications FOR UPDATE USING (profile_id = auth.uid()::uuid OR public.is_admin()) WITH CHECK (profile_id = auth.uid()::uuid OR public.is_admin());
CREATE POLICY "Admin delete applications" ON public.student_applications FOR DELETE USING (public.is_admin());

CREATE POLICY "Users can insert internship applications" ON public.internship_applications FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND (profile_id IS NULL OR profile_id = auth.uid()::uuid) OR public.is_admin());
CREATE POLICY "Users can select their internship applications" ON public.internship_applications FOR SELECT USING (profile_id = auth.uid()::uuid OR public.is_admin());
CREATE POLICY "Users can update their internship applications" ON public.internship_applications FOR UPDATE USING (profile_id = auth.uid()::uuid OR public.is_admin()) WITH CHECK (profile_id = auth.uid()::uuid OR public.is_admin());
CREATE POLICY "Admin can manage internship applications" ON public.internship_applications FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Users can insert project inquiries" ON public.project_inquiries FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND (profile_id IS NULL OR profile_id = auth.uid()::uuid) OR public.is_admin());
CREATE POLICY "Users can select their project inquiries" ON public.project_inquiries FOR SELECT USING (profile_id = auth.uid()::uuid OR public.is_admin());
CREATE POLICY "Users can update their project inquiries" ON public.project_inquiries FOR UPDATE USING (profile_id = auth.uid()::uuid OR public.is_admin()) WITH CHECK (profile_id = auth.uid()::uuid OR public.is_admin());
CREATE POLICY "Admin can manage project inquiries" ON public.project_inquiries FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Users can insert course enrollments" ON public.course_enrollments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND (profile_id IS NULL OR profile_id = auth.uid()::uuid) OR public.is_admin());
CREATE POLICY "Users can select their course enrollments" ON public.course_enrollments FOR SELECT USING (profile_id = auth.uid()::uuid OR public.is_admin());
CREATE POLICY "Users can update their course enrollments" ON public.course_enrollments FOR UPDATE USING (profile_id = auth.uid()::uuid OR public.is_admin()) WITH CHECK (profile_id = auth.uid()::uuid OR public.is_admin());
CREATE POLICY "Admin can manage course enrollments" ON public.course_enrollments FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Business leads & contact enquiries: allow public inserts (forms) but only admins can read/manage
CREATE POLICY "Public can insert business leads" ON public.business_leads FOR INSERT USING (true) WITH CHECK (true);
CREATE POLICY "Admin can manage business leads" ON public.business_leads FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public can insert contact enquiries" ON public.contact_enquiries FOR INSERT USING (true) WITH CHECK (true);
CREATE POLICY "Admin can manage contact enquiries" ON public.contact_enquiries FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Make sure RLS is active (tables above have it enabled). You can run these policies in Supabase SQL editor.

-- Notes for operators:
-- 1. Create an ADMIN user by signing up through Supabase Auth, then update profiles.role = 'ADMIN' for that user's profile row.
-- 2. These policies keep public content readable (published) while protecting sensitive data.
-- 3. Review and adapt policies as auth setup evolves.
