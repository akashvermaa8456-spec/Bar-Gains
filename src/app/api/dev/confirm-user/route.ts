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
