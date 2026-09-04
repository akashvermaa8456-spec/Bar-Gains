import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const { full_name, email, phone, college, degree, branch, year, internship, message, profile_id } = body;

    if (!full_name || !email || !internship) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const internshipSlug = String(internship);
    const { data: internshipRow, error: lookupError } = await supabase
      .from("internships")
      .select("id")
      .eq("slug", internshipSlug)
      .maybeSingle();

    if (lookupError) {
      console.error("Internship lookup failed:", lookupError);
      return NextResponse.json({ error: "Internship not found" }, { status: 400 });
    }

    const { error } = await supabase.from("internship_applications").insert([
      {
        profile_id: profile_id ? String(profile_id) : null,
        internship_id: internshipRow?.id ?? null,
        full_name: String(full_name),
        email: String(email),
        phone: phone ? String(phone) : null,
        college: college ? String(college) : null,
        degree: degree ? String(degree) : null,
        branch: branch ? String(branch) : null,
        year: year ? String(year) : null,
        message: message ? String(message) : null,
        status: "NEW",
      },
    ]);

    if (error) {
      console.error("Internship application insert error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("Internship application error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
