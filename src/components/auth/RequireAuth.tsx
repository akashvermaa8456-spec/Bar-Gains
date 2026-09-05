"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/Button";

export function RequireAuth({
  children,
  redirectTo,
  fallbackText,
}: {
  children: React.ReactNode;
  redirectTo: string;
  fallbackText?: string;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?next=${encodeURIComponent(redirectTo)}`);
    }
  }, [loading, user, redirectTo, router]);

  if (loading) {
    return <div className="py-10 text-sm text-ink-muted">Checking your session…</div>;
  }

  if (!user) {
    return (
      <div className="py-10 text-center">
        <p className="text-ink-muted">{fallbackText ?? "You need to log in to continue."}</p>
        <div className="mt-4">
          <Button href={`/login?next=${encodeURIComponent(redirectTo)}`}>Log in</Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
