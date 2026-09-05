import { NextRequest, NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

type CertificateInput = {
  certificate_type?: "INTERNSHIP" | "TRAINING" | "COURSE";
  student_name?: string;
  program?: string;
  start_date?: string | null;
  end_date?: string | null;
  training_mode?: string | null;
  remarks?: string | null;
  issue_date?: string;
};

async function getAdminUser(request: NextRequest) {
  const auth = request.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) return null;

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return null;

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("id, role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError || profile?.role !== "ADMIN") return null;

  return data.user;
}

function cleanOptional(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

export async function GET(request: NextRequest) {
  const admin = await getAdminUser(request);

  if (!admin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin
    .from("certificates")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Certificate list failed:", error);
    return NextResponse.json({ error: "Unable to load certificates" }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const admin = await getAdminUser(request);

  if (!admin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const body = (await request.json()) as CertificateInput;

    const certificateType =
      body.certificate_type === "TRAINING" || body.certificate_type === "COURSE"
        ? body.certificate_type
        : "INTERNSHIP";

    const studentName = typeof body.student_name === "string" ? body.student_name.trim() : "";
    const program = typeof body.program === "string" ? body.program.trim() : "";

    if (!studentName || !program) {
      return NextResponse.json(
        { error: "Student name and program are required" },
        { status: 400 },
      );
    }

    const issueDate = cleanOptional(body.issue_date) ?? new Date().toISOString().slice(0, 10);

    const { data, error } = await supabaseAdmin
      .from("certificates")
      .insert({
        certificate_type: certificateType,
        student_name: studentName,
        program,
        start_date: cleanOptional(body.start_date),
        end_date: cleanOptional(body.end_date),
        training_mode: cleanOptional(body.training_mode),
        remarks: cleanOptional(body.remarks),
        issue_date: issueDate,
        created_by: admin.id,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Certificate creation failed:", error);
      return NextResponse.json(
        { error: "Unable to create certificate", detail: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("Certificate creation failed:", error);
    return NextResponse.json(
      { error: "Invalid certificate request" },
      { status: 400 },
    );
  }
}
