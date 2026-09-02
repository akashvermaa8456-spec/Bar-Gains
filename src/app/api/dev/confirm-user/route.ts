import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseServer";

const ADMIN_HEADER = "x-admin-key";

function checkAdminAuth(req: Request) {
  const key = req.headers.get(ADMIN_HEADER);
  if (!key || key !== process.env.ADMIN_API_KEY) return false;
  return true;
}

export async function POST(req: Request) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Server misconfigured: SUPABASE_SERVICE_ROLE_KEY missing" }, { status: 500 });
  }

  if (!checkAdminAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const email = (body?.email || "").toString().trim();
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    // Find user in auth.users
    const { data: users, error: selectError } = await supabase.from("auth.users").select("id, email").eq("email", email).limit(1);
    if (selectError) {
      console.error("selectError", selectError);
      return NextResponse.json({ error: "Failed to query auth.users" }, { status: 500 });
    }

    const user = Array.isArray(users) ? users[0] : users;
    if (!user || !user.id) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const confirmedAt = new Date().toISOString();

    // Try admin API first (if available), otherwise update auth.users directly
    try {
      // @ts-ignore - supabase-js may expose auth.admin on the server client
      if (supabase.auth && (supabase as any).auth.admin && (supabase as any).auth.admin.updateUserById) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const res = await (supabase as any).auth.admin.updateUserById(user.id, { email_confirmed_at: confirmedAt });
        if (res?.error) {
          console.warn("admin.updateUserById error", res.error);
        } else {
          return NextResponse.json({ ok: true });
        }
      }
    } catch (e) {
      console.warn("admin.updateUserById threw", e);
    }

    // Fallback: direct update of auth.users table using service role key
    const { error: updateError } = await supabase.from("auth.users").update({ email_confirmed_at: confirmedAt }).eq("id", user.id);
    if (updateError) {
      console.error("updateError", updateError);
      return NextResponse.json({ error: "Failed to update user confirmation" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
