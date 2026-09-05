import Link from "next/link";
import { AuthForm } from "@/components/forms/PublicFormsNew";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Forgot password",
  description: "Reset your Bar-Gains & Company account password.",
  path: "/forgot-password",
});

export default function ForgotPasswordPage() {
  return (
    <Container className="max-w-md py-16">
      <h1 className="font-serif text-4xl text-ink">Forgot password</h1>
      <p className="mt-3 text-sm text-ink-muted">Enter your email to receive a password reset link.</p>
      <div className="mt-8">
        <AuthForm mode="forgot" />
      </div>
      <p className="mt-6 text-sm">
        <Link href="/login" className="text-teal hover:underline">
          Back to login
        </Link>
      </p>
    </Container>
  );
}
