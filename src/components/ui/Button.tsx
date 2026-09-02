import Link from "next/link";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

const variants = {
  primary:
    "bg-ink text-cream hover:bg-ink/90 focus-visible:outline-gold",
  secondary:
    "bg-white text-ink ring-1 ring-ink/10 hover:bg-cream-dark",
  ghost: "bg-transparent text-ink hover:bg-white/60",
  accent: "bg-teal text-white hover:bg-teal-dark",
} as const;

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  href?: string;
  children: ReactNode;
};

export function Button({ variant = "primary", href, className = "", children, ...props }: Props) {
  const classes = `inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium tracking-wide transition ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
