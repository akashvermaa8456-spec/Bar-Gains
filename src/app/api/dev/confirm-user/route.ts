import { NextResponse } from "next/server";

const ADMIN_HEADER = "x-admin-key";

function checkAdminAuth(req: Request) {
  const key = req.headers.get(ADMIN_HEADER);
  if (!key || key !== process.env.ADMIN_API_KEY) return false;
  return true;
}

export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This development-only user confirmation helper is disabled in production." },
      { status: 403 }
    );
  }

  if (!process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: "Server misconfigured: ADMIN_API_KEY missing" }, { status: 500 });
  }

  if (!checkAdminAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json(
    { error: "Dev-only confirmation helper is disabled. Use the normal Supabase auth flow in production." },
    { status: 410 }
  );
}

// Development-only helper: GET /api/dev/confirm-user?email=...
// Protected by x-admin-key header (ADMIN_API_KEY).
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Disabled in production" }, { status: 403 });
  }

  if (!process.env.ADMIN_API_KEY) return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  if (!checkAdminAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const email = url.searchParams.get("email");
  const profile_id = url.searchParams.get("profile_id");

  if (!email && !profile_id) return NextResponse.json({ error: "Provide email or profile_id" }, { status: 400 });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    let q = supabase.from("course_enrollments").select("*, course:course_id(id, title, slug)");
    if (profile_id) q = q.eq("profile_id", profile_id);
    else q = q.eq("email", email!);

    const { data, error } = await q;
    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json({ data });
  } catch (err) {
    console.error("dev confirm-user GET error:", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
