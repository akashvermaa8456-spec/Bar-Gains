import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const { full_name, email, phone, college, degree, branch, year, project, message } = body;
    if (!full_name || !email || !project) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Try inserting into project_inquiries; if table doesn't exist, fall back to student_applications
    try {
      const { error } = await supabase.from("project_inquiries").insert([
        {
          project_slug: project,
          full_name: String(full_name),
          email: String(email),
          phone: phone ? String(phone) : null,
          college: college ? String(college) : null,
          degree: degree ? String(degree) : null,
          branch: branch ? String(branch) : null,
          year: year ? String(year) : null,
          message: message ? String(message) : null,
          status: "INTERESTED",
        },
      ]);

      if (error) {
        console.warn("project_inquiries insert failed, falling back:", error.message);
        // Fallback
        const { error: fallbackErr } = await supabase.from("student_applications").insert([
          {
            full_name: String(full_name),
            email: String(email),
            phone: phone ? String(phone) : null,
            college: college ? String(college) : null,
            degree: degree ? String(degree) : null,
            branch: branch ? String(branch) : null,
            year: year ? String(year) : null,
            message: message ? `Project interest: ${project} -- ${String(message)}` : `Project interest: ${project}`,
            status: "NEW",
          },
        ]);
        if (fallbackErr) {
          console.error("Fallback insert failed:", fallbackErr);
          return NextResponse.json({ error: "Database error" }, { status: 500 });
        }
      }

      return NextResponse.json({ ok: true }, { status: 201 });
    } catch (e) {
      console.error("Project inquiry error:", e);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
