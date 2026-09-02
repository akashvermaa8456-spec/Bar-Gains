import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const { full_name, email, phone, college, degree, branch, year, program, message } = body;
    if (!full_name || !email || !college || !degree || !branch || !year || !program) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let program_id: string | null = null;
    try {
      let slugOrId: string | unknown = program;
      if (typeof program === "string") {
        const m = program.match(/^[a-z]+:(.+)$/i);
        if (m) slugOrId = m[1];
      }

      const isUuid = typeof slugOrId === "string" && /^[0-9a-fA-F\-]{36}$/.test(slugOrId);
      if (isUuid && typeof slugOrId === "string") {
        program_id = slugOrId;
      } else {
        const { data: programRow, error: pErr } = await supabase
          .from("internships")
          .select("id")
          .eq("slug", String(slugOrId))
          .limit(1)
          .maybeSingle();
        if (pErr) {
          console.warn("Program lookup error (may be slug vs id):", pErr.message);
        } else if (programRow) {
          program_id = programRow.id;
        }
      }
    } catch {
      // ignore lookup errors
    }

    const insertObj: Record<string, string | null> = {
      full_name: String(full_name),
      email: String(email),
      phone: phone ? String(phone) : null,
      college: String(college),
      degree: String(degree),
      branch: String(branch),
      year: String(year),
      message: message ? String(message) : "",
      status: "NEW",
    };
    if (program_id) insertObj.program_id = program_id;

    const { error } = await supabase.from("student_applications").insert([insertObj]);

    if (error) {
      console.error("Supabase insert error (student_applications):", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
