"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/forms/FormFields";
import Link from "next/link";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const handleSessionFromUrl = async () => {
      const code = searchParams.get("code");
      if (code) {
        try {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            setError("Invalid or expired reset link. Please request a new one.");
          } else {
            setReady(true);
            setMessage("Reset link verified. Enter your new password.");
          }
        } catch (e) {
          setError("An error occurred. Please try again.");
          console.error(e);
        }
      } else {
        setError("No reset token found in URL. Please use the link from your email.");
      }
    };

    handleSessionFromUrl();
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError("Password must include at least one uppercase letter and one number.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(error.message || "Failed to update password.");
      } else {
        setMessage("Password updated successfully! Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch (e) {
      setError("An error occurred. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="max-w-md py-16">
      <h1 className="font-serif text-4xl text-ink">Reset Password</h1>
      
      {error ? (
        <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
          <Link href="/forgot-password" className="text-teal hover:underline text-sm mt-2 inline-block">
            Request a new reset link
          </Link>
        </div>
      ) : null}

      {message && !error ? (
        <p className="mt-4 text-sm text-teal-dark">{message}</p>
      ) : null}

      {ready && !error ? (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <FormInput
            id="new-password"
            name="password"
            type="password"
            label="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <FormInput
            id="confirm-password"
            name="confirm"
            type="password"
            label="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            autoComplete="new-password"
          />
          <Button type="submit" disabled={loading || !ready}>
            {loading ? "Updating…" : "Update Password"}
          </Button>
        </form>
      ) : null}

      {!ready && !error ? (
        <p className="mt-6 text-sm text-ink-muted">Verifying reset link...</p>
      ) : null}

      <p className="mt-6 text-sm">
        <Link href="/login" className="text-teal hover:underline">
          Back to login
        </Link>
      </p>
    </Container>
  );
}
