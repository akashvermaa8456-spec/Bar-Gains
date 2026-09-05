import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const { name, email, phone, subject, message } = body;
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { error } = await supabase.from("contact_enquiries").insert([
      {
        name: String(name),
        email: String(email),
        phone: phone ? String(phone) : null,
        subject: String(subject),
        message: String(message),
        status: "NEW",
      },
    ]);

    if (error) {
      console.error("Supabase insert error (contact):", error);
      if (process.env.NODE_ENV !== "production") {
        return NextResponse.json({ error: error.message || "Database error", details: error }, { status: 500 });
      }
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    console.error(err);
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json({ error: message, details: String(err) }, { status: 500 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
