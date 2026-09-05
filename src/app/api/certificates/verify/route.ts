import { NextRequest, NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const certificateId = request.nextUrl.searchParams.get("certificateId")?.trim();

  if (!certificateId) {
    return NextResponse.json({ error: "Certificate ID is required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("certificates")
    .select(
      "certificate_id, certificate_type, student_name, program, start_date, end_date, training_mode, remarks, issue_date, status",
    )
    .eq("certificate_id", certificateId)
    .maybeSingle();

  if (error) {
    console.error("Certificate verification failed:", error);
    return NextResponse.json({ error: "Unable to verify certificate" }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ valid: false, error: "Certificate not found" }, { status: 404 });
  }

  return NextResponse.json({
    valid: data.status === "VALID",
    certificate: data,
  });
}
