import { NextRequest, NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

async function hasByProfileOrEmail(
  table: string,
  filters: Record<string, string>,
  userId: string,
  email: string,
) {
  // Do NOT use a PostgREST `.or()` expression here. Keeping the two checks
  // separate makes UUID/email matching reliable and much easier to debug.
  const profileQuery = supabaseAdmin
    .from(table)
    .select("id")
    .match({ ...filters, profile_id: userId })
    .limit(1);

  const { data: byProfile, error: profileError } = await profileQuery;
  if (profileError) throw profileError;
  if (byProfile?.length) return { applied: true, matchedBy: "profile_id" };

  if (!email) return { applied: false, matchedBy: null };

  const { data: byEmail, error: emailError } = await supabaseAdmin
    .from(table)
    .match({ ...filters, email })
    .limit(1);

  if (emailError) throw emailError;
  return { applied: Boolean(byEmail?.length), matchedBy: byEmail?.length ? "email" : null };
}

export async function GET(request: NextRequest) {
  try {
    const auth = request.headers.get("authorization");
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) {
      return NextResponse.json({ error: "Missing bearer token" }, { status: 401 });
    }

    const { data, error: authError } = await supabaseAdmin.auth.getUser(token);
    const user = data.user;
    if (authError || !user) {
      console.error("Application status auth failed:", authError?.message);
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const type = request.nextUrl.searchParams.get("type");
    const slug = request.nextUrl.searchParams.get("slug")?.trim();
    if (!slug || !["course", "internship", "project"].includes(type ?? "")) {
      return NextResponse.json({ error: "Invalid type or slug" }, { status: 400 });
    }

    const email = user.email?.trim() ?? "";

    if (type === "course") {
      const { data: course, error } = await supabaseAdmin
        .from("courses")
        .select("id, slug")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      if (!course) {
        return NextResponse.json({ applied: false, reason: "course_not_found" });
      }

      const result = await hasByProfileOrEmail(
        "course_enrollments",
        { course_id: course.id },
        user.id,
        email,
      );

      console.log("[application-status] course", {
        userId: user.id,
        slug,
        courseId: course.id,
        ...result,
      });
      return NextResponse.json(result);
    }

    if (type === "internship") {
      const { data: internship, error } = await supabaseAdmin
        .from("internships")
        .select("id, slug")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      if (!internship) {
        return NextResponse.json({ applied: false, reason: "internship_not_found" });
      }

      const dedicated = await hasByProfileOrEmail(
        "internship_applications",
        { internship_id: internship.id },
        user.id,
        email,
      );
      if (dedicated.applied) {
        console.log("[application-status] internship", {
          userId: user.id,
          slug,
          internshipId: internship.id,
          source: "internship_applications",
          matchedBy: dedicated.matchedBy,
        });
        return NextResponse.json({ applied: true, source: "internship_applications", matchedBy: dedicated.matchedBy });
      }

      const legacy = await hasByProfileOrEmail(
        "student_applications",
        { program_id: internship.id },
        user.id,
        email,
      );

      console.log("[application-status] internship", {
        userId: user.id,
        slug,
        internshipId: internship.id,
        source: legacy.applied ? "student_applications" : null,
        matchedBy: legacy.matchedBy,
      });
      return NextResponse.json({
        applied: legacy.applied,
        source: legacy.applied ? "student_applications" : null,
        matchedBy: legacy.matchedBy,
      });
    }

    const result = await hasByProfileOrEmail(
      "project_inquiries",
      { project_slug: slug },
      user.id,
      email,
    );

    console.log("[application-status] project", {
      userId: user.id,
      slug,
      ...result,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Application status lookup failed:", error);
    return NextResponse.json(
      {
        error: "Unable to check application status",
        // Safe diagnostic detail; no service-role key or token is exposed.
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
