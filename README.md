# Bar-Gains & Company — application status fix

This version centralizes application status checks through authenticated server routes.

Behavior:
- Dashboard shows applied programs with an `Applied` status only; no disabled button.
- Course/internship/project detail pages check Supabase on load and show a disabled `Applied` button when an application exists.
- Internship status checks both `internship_applications` and legacy `student_applications`.
- Dashboard also reads both internship sources and matches applications by authenticated profile ID or email, so older rows with a missing profile_id are still visible.
- Server routes verify the Supabase access token before using the service-role client.

No additional Supabase SQL is required for these status routes because they use the server-side service-role client after authentication. Existing table/RLS setup can remain as-is.
