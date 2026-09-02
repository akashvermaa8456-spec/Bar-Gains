import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set in environment");
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  // Warn but do not throw here — developer can run in limited mode.
  console.warn("Warning: SUPABASE_SERVICE_ROLE_KEY is not set. Server-side inserts may fail if RLS is enabled.");
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  { auth: { persistSession: false } },
);

export default supabaseAdmin;
