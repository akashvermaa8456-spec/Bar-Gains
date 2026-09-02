"use client";

import { useState } from "react";

export function FaqList({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-white">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.question}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : index)}
            >
              <span className="font-medium text-ink">{item.question}</span>
              <span className="text-ink-faint" aria-hidden>
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen ? <p className="px-5 pb-5 text-sm leading-relaxed text-ink-muted">{item.answer}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
