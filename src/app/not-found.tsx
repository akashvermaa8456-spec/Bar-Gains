import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">404</p>
      <h1 className="mt-3 font-serif text-4xl text-ink">Page not found</h1>
      <p className="mt-3 text-ink-muted">That URL is not part of this site.</p>
      <div className="mt-8 flex justify-center">
        <Button href="/">Back home</Button>
      </div>
      <p className="mt-4 text-sm">
        <Link href="/contact" className="text-teal hover:underline">
          Contact
        </Link>
      </p>
    </Container>
  );
}
