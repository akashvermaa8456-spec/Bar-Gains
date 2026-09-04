import { NextRequest, NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseServer";
export const dynamic = "force-dynamic";
type Row = Record<string, any>;
async function rowsForUser(table: string, userId: string, email: string) {
  const [p, e] = await Promise.all([
    supabaseAdmin.from(table).select("*").eq("profile_id", userId),
    email ? supabaseAdmin.from(table).select("*").eq("email", email) : Promise.resolve({ data: [], error: null }),
  ]);
  if (p.error) throw p.error;
  if (e.error) throw e.error;
  const map = new Map<string, Row>();
  for (const r of [...(p.data ?? []), ...(e.data ?? [])] as Row[]) map.set(String(r.id), r);
  return [...map.values()];
}
export async function GET(request: NextRequest) {
  try {
    const auth = request.headers.get("authorization");
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error: authError } = await supabaseAdmin.auth.getUser(token);
    const user = data.user;
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const [courses, internships, projects, legacy] = await Promise.all([
      rowsForUser("course_enrollments", user.id, user.email ?? ""),
      rowsForUser("internship_applications", user.id, user.email ?? ""),
      rowsForUser("project_inquiries", user.id, user.email ?? ""),
      rowsForUser("student_applications", user.id, user.email ?? ""),
    ]);
    const courseIds = [...new Set(courses.map(r => r.course_id).filter(Boolean))];
    const internshipIds = [...new Set([...internships.map(r => r.internship_id), ...legacy.map(r => r.program_id)].filter(Boolean))];
    const [courseMeta, internshipMeta] = await Promise.all([
      courseIds.length ? supabaseAdmin.from("courses").select("id,title,slug").in("id", courseIds) : Promise.resolve({ data: [], error: null }),
      internshipIds.length ? supabaseAdmin.from("internships").select("id,title,slug").in("id", internshipIds) : Promise.resolve({ data: [], error: null }),
    ]);
    if (courseMeta.error) throw courseMeta.error;
    if (internshipMeta.error) throw internshipMeta.error;
    return NextResponse.json({ courses, internships, projects, legacy, courseMeta: courseMeta.data ?? [], internshipMeta: internshipMeta.data ?? [] });
  } catch (error) {
    console.error("My applications lookup failed:", error);
    return NextResponse.json({ error: "Unable to load applications" }, { status: 500 });
  }
}
