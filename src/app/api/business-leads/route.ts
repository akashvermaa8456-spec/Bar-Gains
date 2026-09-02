import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, company, email, phone, business_type, service, budget, description } = body;
    if (!name || !company || !email || !phone || !business_type || !service || !budget || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { error } = await supabase.from("business_leads").insert([
      {
        name,
        company_name: company,
        email,
        phone,
        business_type,
        service,
        budget,
        description,
        status: "NEW",
      },
    ]);

    if (error) {
      console.error("Supabase insert error (business_leads):", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
