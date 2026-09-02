"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <Container className="py-24 text-center">
      <h1 className="font-serif text-4xl text-ink">Something went wrong</h1>
      <p className="mt-3 text-ink-muted">Please try again. If this continues, use the contact form.</p>
      <div className="mt-8 flex justify-center">
        <Button type="button" onClick={reset}>
          Try again
        </Button>
      </div>
    </Container>
  );
}
