import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { error } = await supabase.from("contact_enquiries").insert([
      { name, email, phone, subject, message, status: "NEW" },
    ]);

    if (error) {
      console.error("Supabase insert error (contact):", error);
      // In development return full error message to help debugging. Never enable in production.
      if (process.env.NODE_ENV !== "production") {
        return NextResponse.json({ error: error.message || "Database error", details: error }, { status: 500 });
      }
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error(err);
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json({ error: err?.message || "Server error", details: String(err) }, { status: 500 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
