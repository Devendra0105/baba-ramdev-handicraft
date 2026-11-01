import { Link } from "react-router-dom";
import brandEmblem from "../assets/brand-emblem.png";

export function Emblem({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <img
      src={brandEmblem}
      alt="Baba Ramdev Handicrafts emblem"
      className={className}
      draggable={false}
    />
  );
}

export function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-2.5" aria-label="Baba Ramdev Handicrafts home">
      <Emblem className="h-8 w-8 shrink-0 rounded-full object-cover transition-transform duration-500 group-hover:rotate-6" />
      <span className="max-w-40 font-serif text-base font-semibold leading-tight text-foreground sm:max-w-72 sm:text-xl">
        Baba Ramdev Handicrafts
      </span>
    </Link>
  );
}
