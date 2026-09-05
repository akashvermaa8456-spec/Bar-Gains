"use client";

import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

export function AuthAwarePrice({
  value,
  redirectPath,
  fallbackText = "Login to view prices",
}: {
  value: string;
  redirectPath: string;
  fallbackText?: string;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return <span className="text-ink-muted">{fallbackText}</span>;
  }

  if (!user) {
    return (
      <Link href={`/login?next=${encodeURIComponent(redirectPath)}`} className="text-ink-muted hover:text-ink">
        {fallbackText}
      </Link>
    );
  }

  return <>{value}</>;
}

export function AuthAwarePriceGuide({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return null;
  }

  return <>{children}</>;
}
