import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const { full_name, email, phone, college, degree, branch, year, project, message, profile_id } = body;
    if (!full_name || !email || !project) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
      const { error } = await supabase.from("project_inquiries").insert([
        {
          profile_id: profile_id ? String(profile_id) : null,
          project_slug: String(project),
          project_title: String(project),
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
        console.error("Project inquiry insert failed:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
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
