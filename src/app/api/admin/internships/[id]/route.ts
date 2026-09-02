import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseServer";

const ADMIN_HEADER = "x-admin-key";

function checkAdminAuth(req: Request) {
  const key = req.headers.get(ADMIN_HEADER);
  if (!key || key !== process.env.ADMIN_API_KEY) return false;
  return true;
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!checkAdminAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { error } = await supabase.from("internships").update(body).eq("id", params.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!checkAdminAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { error } = await supabase.from("internships").delete().eq("id", params.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
