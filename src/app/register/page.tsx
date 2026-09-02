import Link from "next/link";
import { AuthForm } from "@/components/forms/PublicFormsNew";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Register",
  description: "Create a student account with Bar-Gains & Company.",
  path: "/register",
});

export default function RegisterPage() {
  return (
    <Container className="max-w-md py-16">
      <h1 className="font-serif text-4xl text-ink">Register</h1>
      <p className="mt-3 text-sm text-ink-muted">
        After authentication is connected, new students will land on the dashboard. Registration does not create an
        account yet.
      </p>
      <div className="mt-8">
        <AuthForm mode="register" />
      </div>
      <p className="mt-6 text-sm">
        <Link href="/login" className="text-teal hover:underline">
          Already have an account?
        </Link>
      </p>
    </Container>
  );
}
