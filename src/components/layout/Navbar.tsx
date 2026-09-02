"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { navLinks, primaryCta, site } from "@/lib/site";
import supabase from "@/lib/supabaseClient";
import { useAuth } from "@/lib/AuthContext";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-ink/8 bg-cream/90 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4 lg:h-[4.25rem]">
        <Link href="/" className="shrink-0" onClick={() => setOpen(false)}>
          <span className="block font-serif text-lg leading-none text-ink sm:text-xl">{site.shortName}</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-faint">&amp; Company</span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary">
          {navLinks.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1.5 text-sm transition ${
                  active ? "bg-white text-ink shadow-sm" : "text-ink-muted hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          {!loading && user ? (
            <>
              <Button href="/dashboard" variant="ghost">
                Dashboard
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : !loading ? (
            <>
              <Button href="/login" variant="ghost">
                Login
              </Button>
              <Button href={primaryCta.href}>{primaryCta.label}</Button>
            </>
          ) : null}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-white xl:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span className="flex flex-col gap-1.5" aria-hidden>
            <span className={`h-0.5 w-4 bg-ink transition ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 w-4 bg-ink transition ${open ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-4 bg-ink transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </Container>

      {open ? (
        <div id="mobile-nav" className="border-t border-ink/8 bg-cream xl:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-2.5 text-base text-ink hover:bg-white"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 sm:hidden">
              {!loading && user ? (
                <>
                  <Button href="/dashboard" variant="secondary" className="w-full" onClick={() => setOpen(false)}>
                    Dashboard
                  </Button>
                  <Button variant="secondary" className="w-full" onClick={() => { handleLogout(); setOpen(false); }}>
                    Logout
                  </Button>
                </>
              ) : !loading ? (
                <>
                  <Button href="/login" variant="secondary" className="w-full" onClick={() => setOpen(false)}>
                    Login
                  </Button>
                  <Button href={primaryCta.href} className="w-full" onClick={() => setOpen(false)}>
                    {primaryCta.label}
                  </Button>
                </>
              ) : null}
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
