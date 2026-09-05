import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCourse } from "@/lib/content/courses";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await request.json();

    const {
      full_name,
      email,
      phone,
      college,
      degree,
      branch,
      year,
      course,
      course_slug,
      message,
      profile_id,
    } = body as Record<string, unknown>;

    const courseSlug = String(course ?? course_slug ?? "").trim();
    const emailValue = String(email ?? "").trim();
    const profileId = profile_id ? String(profile_id) : null;

    if (!full_name || !emailValue || !courseSlug) {
      return NextResponse.json({ error: "Missing required fields: full_name, email, course" }, { status: 400 });
    }

    // Resolve or create profile
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

    // Find course in DB; if missing, try to create from in-repo content
    const { data: courseData } = await supabase.from("courses").select("id").eq("slug", courseSlug).maybeSingle();
    let courseId = courseData?.id ?? null;

    if (!courseId) {
      // Try to find course in content
      const contentCourse = getCourse(courseSlug);
      if (contentCourse) {
        const insertBody: Record<string, unknown> = {
          slug: contentCourse.slug,
          title: contentCourse.title,
          short_description: contentCourse.shortDescription ?? null,
          description: contentCourse.overview ?? null,
          duration: contentCourse.duration ?? null,
          level: contentCourse.level ?? null,
          // content Course doesn't expose `technologies` or `curriculum` — leave null to match schema
          technologies: null,
          curriculum: null,
          // DB expects modules as text[]; use module titles from content (module objects) if present
          modules: contentCourse.modules ? contentCourse.modules.map((m) => m.title) : null,
          learning_outcomes: contentCourse.learningOutcomes ?? null,
          price: contentCourse.price ?? null,
          published: true,
        };

        const { data: inserted, error: insertErr } = await supabase.from("courses").insert([insertBody]).select().maybeSingle();
        if (insertErr) {
          console.error("Failed to insert course from content:", insertErr);
        } else {
          courseId = inserted?.id ?? null;
        }
      }
    }

    if (!courseId) {
      return NextResponse.json({ error: `Course not found: ${courseSlug}` }, { status: 400 });
    }

    // Prevent duplicate enrollment: same email or profile_id for same course
    const dupQuery = supabase.from("course_enrollments").select("id").eq("course_id", courseId);
    if (resolvedProfileId) dupQuery.eq("profile_id", resolvedProfileId);
    else dupQuery.eq("email", emailValue);
    const { data: dupData } = await dupQuery.limit(1);
    if (dupData && dupData.length > 0) {
      return NextResponse.json({ ok: true, message: "Already enrolled" }, { status: 200 });
    }

    const { data, error } = await supabase
      .from("course_enrollments")
      .insert([
        {
          profile_id: resolvedProfileId,
          course_id: courseId,
          full_name: String(full_name),
          email: emailValue,
          phone: phone || null,
          college: college || null,
          degree: degree || null,
          branch: branch || null,
          year: year || null,
          message: message || null,
          status: "ENROLLED",
        },
      ])
      .select();

    if (error) {
      console.error("Course enrollment error:", error);
      return NextResponse.json({ error: "Failed to enroll" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    console.error("Course enrollment error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
