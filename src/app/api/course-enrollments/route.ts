import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
      message,
      profile_id,
    } = body;

    if (!full_name || !email || !course) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Look up course by slug
    const { data: courseData } = await supabase
      .from("courses")
      .select("id")
      .eq("slug", course)
      .maybeSingle();

    const courseId = courseData?.id;
    if (!courseId) {
      return NextResponse.json({ error: "Course not found" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("course_enrollments")
      .insert([
        {
          profile_id: profile_id || null,
          course_id: courseId,
          full_name,
          email,
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
