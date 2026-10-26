import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube } from "lucide-react";
import { Logo } from "@/components/Logo";
import { collections } from "@/data/products";
import { siteConfig } from "@/data/site";

export function Footer() {
  const heading = "mb-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary";
  const link = "text-sm text-muted-foreground transition-colors hover:text-primary";
  return (
    <footer className="border-t border-border bg-card">
      <div className="container-wide grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-sm text-muted-foreground">Crafted Through History. Made to Be Remembered. A curated home for decorative swords and historical collectibles.</p>
          <div className="mt-6 flex gap-3">
            {[{ href: siteConfig.social.instagram, Icon: Instagram, label: "Instagram" }, { href: siteConfig.social.facebook, Icon: Facebook, label: "Facebook" }, { href: siteConfig.social.youtube, Icon: Youtube, label: "YouTube" }].map(({ href, Icon, label }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="flex h-9 w-9 items-center justify-center border border-border text-muted-foreground hover:border-primary hover:text-primary">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className={heading}>Quick Links</h4>
          <ul className="space-y-3">
            {[["/shop", "Shop"], ["/collections", "Collections"], ["/craft", "Our Craft"], ["/about", "About"], ["/contact", "Contact"], ["/wishlist", "Wishlist"]].map(([to, l]) => (
              <li key={to}><Link to={to} className={link}>{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className={heading}>Shop Categories</h4>
          <ul className="space-y-3">
            {collections.map((c) => (
              <li key={c.id}><Link to={`/shop?category=${c.id}`} className={link}>{c.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className={heading}>Contact</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>Email: {siteConfig.email}</li>
            <li>Phone: {siteConfig.phone}</li>
            <li>Address: {siteConfig.address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-wide flex flex-col items-center justify-between gap-4 py-6 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} FORGE &amp; LEGACY. All rights reserved. Demo catalog.</p>
          <ul className="flex flex-wrap gap-6">
            <li><Link to="/policies/privacy" className="hover:text-primary">Privacy Policy</Link></li>
            <li><Link to="/policies/terms" className="hover:text-primary">Terms &amp; Conditions</Link></li>
            <li><Link to="/policies/returns" className="hover:text-primary">Returns &amp; Shipping</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
