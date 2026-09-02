import { Container } from "@/components/ui/Container";

export default function Loading() {
  return (
    <Container className="py-24">
      <p className="text-sm text-ink-muted">Loading…</p>
      <div className="mt-6 h-40 animate-pulse rounded-2xl bg-cream-dark" aria-hidden />
    </Container>
  );
}
