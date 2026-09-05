-- Dashboard/application status permissions and compatibility with legacy internship applications.
GRANT SELECT ON public.courses TO authenticated;
GRANT SELECT ON public.internships TO authenticated;
GRANT SELECT ON public.projects TO authenticated;
GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT ON public.course_enrollments TO authenticated;
GRANT SELECT ON public.internship_applications TO authenticated;
GRANT SELECT ON public.project_inquiries TO authenticated;
GRANT SELECT ON public.student_applications TO authenticated;
