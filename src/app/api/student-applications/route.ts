import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { full_name, email, phone, college, degree, branch, year, program, message } = body;
    if (!full_name || !email || !college || !degree || !branch || !year || !program) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Resolve program slug -> id if a slug or prefixed value was sent
    let program_id = null;
    try {
      // Accept formats: "slug", "course:slug", "internship:slug", or a UUID id.
      let slugOrId = program;
      if (typeof program === "string") {
        const m = program.match(/^[a-z]+:(.+)$/i);
        if (m) slugOrId = m[1];
      }

      // If it looks like a UUID, treat it as an id directly
      const isUuid = typeof slugOrId === "string" && /^[0-9a-fA-F\-]{36}$/.test(slugOrId);
      if (isUuid) {
        program_id = slugOrId;
      } else {
        const { data: programRow, error: pErr } = await supabase
          .from("internships")
          .select("id")
          .eq("slug", slugOrId)
          .limit(1)
          .maybeSingle();
        if (pErr) {
          console.warn("Program lookup error (may be slug vs id):", pErr.message);
        } else if (programRow) {
          program_id = programRow.id;
        }
      }
    } catch (e) {
      // ignore lookup errors
    }

    const insertObj: any = {
      full_name,
      email,
      phone,
      college,
      degree,
      branch,
      year,
      message,
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
