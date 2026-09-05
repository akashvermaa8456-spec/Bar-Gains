import Link from "next/link";
import { AuthForm } from "@/components/forms/PublicFormsNew";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
    title: "Login",
    description: "Log in to your Bar-Gains & Company student account.",
    path: "/login",
});

export default function LoginPage() {
    return (
        <Container className="max-w-md py-16">
            <h1 className="font-serif text-4xl text-ink">Login</h1>

            <div className="mt-8">
                <AuthForm mode="login" />
            </div>

            <p className="mt-6 text-sm text-ink-muted">
                <Link href="/forgot-password" className="text-teal hover:underline">
                    Forgot password
                </Link>
                {" · "}
                <Link href="/register" className="text-teal hover:underline">
                    Register
                </Link>
            </p>
        </Container>
    );
}