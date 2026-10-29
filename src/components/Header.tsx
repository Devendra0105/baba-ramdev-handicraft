import { useState, type FormEvent } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, MessageCircle, Search, ShoppingBag, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useStore } from "@/context/InquiryCartContext";
import { useSettings } from "@/lib/api";
import { whatsappLink } from "@/lib/shop";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/collections", label: "Collections" },
  { to: "/about", label: "Our Story" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const { cartCount, setCartOpen } = useStore();
  const { data: settings } = useSettings();
  const wa = whatsappLink(settings?.whatsapp, "Hello, I have a question about your products.");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSearchOpen(false);
    navigate(`/shop?q=${encodeURIComponent(q.trim())}`);
  };
  const iconBtn = "relative flex h-10 w-10 items-center justify-center text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="container-wide flex items-center justify-between gap-3 py-3">
        <Logo />
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {navLinks.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.to === "/"} className={({ isActive }) => cn("text-xs font-semibold uppercase tracking-[0.18em] hover:text-primary", isActive ? "text-primary" : "text-foreground/75")}>{l.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center">
          <button className={iconBtn} aria-label="Search products" onClick={() => setSearchOpen(true)}><Search className="h-5 w-5" /></button>
          <button className={iconBtn} aria-label={`Inquiry cart, ${cartCount} items`} onClick={() => setCartOpen(true)}>
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && <span className="absolute -right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">{cartCount}</span>}
          </button>
          {wa && (
            <a href={wa} target="_blank" rel="noreferrer" className="ml-2 hidden items-center gap-2 bg-primary px-3 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 sm:flex">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          )}
          <button className={cn(iconBtn, "lg:hidden")} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((o) => !o)}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav aria-label="Mobile" className="border-t border-border bg-background lg:hidden">
          <ul className="container-wide py-3">
            {navLinks.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.to === "/"} onClick={() => setMenuOpen(false)} className={({ isActive }) => cn("block py-3 font-serif text-xl", isActive ? "text-primary" : "text-foreground")}>{l.label}</NavLink>
              </li>
            ))}
            {wa && <li><a href={wa} target="_blank" rel="noreferrer" className="block py-3 font-serif text-xl text-primary">WhatsApp us</a></li>}
          </ul>
        </nav>
      )}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent>
          <DialogTitle className="font-serif text-2xl">Search the shop</DialogTitle>
          <DialogDescription>Search by product name or category.</DialogDescription>
          <form onSubmit={submit} className="flex gap-2">
            <Input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. talwar, shield…" aria-label="Search query" />
            <button type="submit" className="bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Search</button>
          </form>
        </DialogContent>
      </Dialog>
    </header>
  );
}
