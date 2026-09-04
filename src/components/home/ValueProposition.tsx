import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

const values = [
  {
    title: "Learn",
    body: "Industry-focused courses and structured training.",
  },
  {
    title: "Build",
    body: "Practical assignments and real-world projects.",
  },
  {
    title: "Prove",
    body: "Internships, evaluations and certificates that demonstrate what students have achieved.",
  },
];

export function ValueProposition() {
  return (
    <section className="py-16 lg:py-20">
      <Container>
        <SectionHeader eyebrow="How we work" title="A simple loop: learn, build, prove." />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {values.map((item, index) => (
            <article key={item.title} className="rounded-2xl border border-ink/8 bg-white p-7 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">0{index + 1}</p>
              <h3 className="mt-4 font-serif text-3xl text-ink">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
