import { Link } from "react-router-dom";

export function Emblem({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M16 2 L28 8 V17 C28 24 22 28.5 16 30 C10 28.5 4 24 4 17 V8 Z" />
      <path d="M16 6 V25" strokeWidth="1.6" />
      <path d="M11 19 H21" strokeWidth="1.6" />
      <circle cx="16" cy="22.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-2.5" aria-label="FORGE & LEGACY home">
      <Emblem className="h-8 w-8 text-primary transition-transform duration-500 group-hover:rotate-6" />
      <span className="whitespace-nowrap font-serif text-base font-semibold tracking-[0.14em] text-foreground sm:text-xl md:text-2xl md:tracking-[0.18em]">
        FORGE <span className="text-primary">&amp;</span> LEGACY
      </span>
    </Link>
  );
}
