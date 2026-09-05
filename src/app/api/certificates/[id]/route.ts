import { NextRequest, NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseServer";

async function getAdmin(request: NextRequest) {
  const auth = request.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return null;

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return null;

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  return profile?.role === "ADMIN" ? data.user : null;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const status = body.status === "REVOKED" ? "REVOKED" : "VALID";

  const { data, error } = await supabaseAdmin
    .from("certificates")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: "Unable to update certificate", detail: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
