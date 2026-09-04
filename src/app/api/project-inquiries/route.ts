import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const { full_name, email, phone, college, degree, branch, year, project, project_slug, message, profile_id } = body;
    const projectSlug = String(project ?? project_slug ?? "").trim();
    const emailValue = String(email ?? "").trim();
    const profileId = profile_id ? String(profile_id) : null;

    if (!full_name || !emailValue || !projectSlug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let resolvedProfileId: string | null = profileId;
    if (!resolvedProfileId) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", emailValue)
        .maybeSingle();
      resolvedProfileId = profileData?.id ?? null;
    }

    if (profileId && !resolvedProfileId) {
      await supabase.from("profiles").upsert(
        {
          id: profileId,
          email: emailValue,
          full_name: String(full_name),
          role: "STUDENT",
        },
        { onConflict: "id" },
      );
      resolvedProfileId = profileId;
    }

    try {
      // Prevent duplicate project applications/interests.
      const duplicateQuery = supabase
        .from("project_inquiries")
        .select("id")
        .eq("project_slug", projectSlug)
        .limit(1);

      if (resolvedProfileId) {
        duplicateQuery.eq("profile_id", resolvedProfileId);
      } else {
        duplicateQuery.eq("email", emailValue);
      }

      const { data: duplicateRows, error: duplicateError } = await duplicateQuery;
      if (duplicateError) {
        console.error("Project duplicate check failed:", duplicateError);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }
      if (duplicateRows && duplicateRows.length > 0) {
        return NextResponse.json({ ok: true, alreadyApplied: true, message: "Already applied" }, { status: 200 });
      }

      const { error } = await supabase.from("project_inquiries").insert([
        {
          profile_id: resolvedProfileId,
          project_slug: projectSlug,
          project_title: projectSlug,
          full_name: String(full_name),
          email: emailValue,
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
