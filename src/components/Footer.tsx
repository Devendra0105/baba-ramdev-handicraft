import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useCategories, useSettings } from "@/lib/api";

export function Footer() {
  const { data: s } = useSettings();
  const { data: cats } = useCategories();
  const heading = "mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-brass";
  const link = "text-sm opacity-80 hover:opacity-100 hover:text-brass";
  const socials = [
    { href: s?.instagram, Icon: Instagram, label: "Instagram" },
    { href: s?.facebook, Icon: Facebook, label: "Facebook" },
    { href: s?.youtube, Icon: Youtube, label: "YouTube" },
  ].filter((x) => x.href);
  return (
    <footer className="band-forest">
      <div className="container-wide grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          {s?.intro && <p className="mt-4 max-w-xs text-sm opacity-80">{s.intro}</p>}
          {socials.length > 0 && (
            <div className="mt-5 flex gap-3">
              {socials.map(({ href, Icon, label }) => (
                <a key={label} href={href!} target="_blank" rel="noreferrer" aria-label={label} className="flex h-9 w-9 items-center justify-center border border-current/30 hover:text-brass"><Icon className="h-4 w-4" /></a>
              ))}
            </div>
          )}
        </div>
        <div>
          <h4 className={heading}>Explore</h4>
          <ul className="space-y-2">
            {[["/shop", "Shop"], ["/collections", "Collections"], ["/about", "Our Story"], ["/contact", "Contact"]].map(([to, l]) => <li key={to}><Link to={to} className={link}>{l}</Link></li>)}
          </ul>
        </div>
        <div>
          <h4 className={heading}>Collections</h4>
          <ul className="space-y-2">
            {(cats ?? []).map((c) => <li key={c.id}><Link to={`/shop?category=${c.slug}`} className={link}>{c.name}</Link></li>)}
          </ul>
        </div>
        <div>
          <h4 className={heading}>Contact</h4>
          <ul className="space-y-2 text-sm opacity-80">
            {s?.address && <li className="whitespace-pre-line">{s.address}</li>}
            {s?.phone && <li><a href={`tel:${s.phone}`} className="hover:text-brass">{s.phone}</a></li>}
            {s?.email && <li><a href={`mailto:${s.email}`} className="hover:text-brass">{s.email}</a></li>}
          </ul>
          <ul className="mt-5 space-y-2">
            {[["privacy", "Privacy Policy"], ["terms", "Terms"], ["returns", "Returns"]].map(([k, l]) => <li key={k}><Link to={`/policies/${k}`} className={link}>{l}</Link></li>)}
          </ul>
        </div>
      </div>
      <div className="border-t border-current/15 py-5 text-center text-xs opacity-70">© {new Date().getFullYear()} {s?.business_name ?? "Baba Ramdev Handicrafts"}</div>
    </footer>
  );
}
