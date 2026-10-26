import { useState, type FormEvent } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useStore } from "@/context/StoreContext";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/collections", label: "Collections" },
  { to: "/craft", label: "Our Craft" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function AnnouncementBar() {
  return (
    <div className="border-b border-primary/30 bg-secondary py-2 text-center text-[11px] font-medium uppercase tracking-[0.25em] text-primary">
      Discover Historical Craftsmanship <span className="mx-2 text-muted-foreground">|</span> Collectible Blades &amp; Decorative Swords
    </div>
  );
}

export function Header() {
  const { cartCount, wishlist, setCartOpen } = useStore();
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
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="container-wide flex items-center justify-between gap-4 py-4">
        <Logo />
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {navLinks.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === "/"}
                  className={({ isActive }) =>
                    cn("text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:text-primary", isActive ? "text-primary" : "text-foreground/80")
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center">
          <button className={iconBtn} aria-label="Search products" onClick={() => setSearchOpen(true)}><Search className="h-5 w-5" /></button>
          <Link to="/wishlist" className={iconBtn} aria-label={`Wishlist, ${wishlist.length} items`}>
            <Heart className="h-5 w-5" />
            {wishlist.length > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />}
          </Link>
          <button className={iconBtn} aria-label={`Cart, ${cartCount} items`} onClick={() => setCartOpen(true)}>
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">{cartCount}</span>
          </button>
          <button className={cn(iconBtn, "lg:hidden")} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((o) => !o)}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav aria-label="Mobile" className="border-t border-border bg-background lg:hidden">
          <ul className="container-wide py-4">
            {navLinks.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.to === "/"} onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => cn("block py-3 font-serif text-xl", isActive ? "text-primary" : "text-foreground")}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="border-border bg-background">
          <DialogTitle className="font-serif text-2xl">Search the collection</DialogTitle>
          <DialogDescription>Search by product name or category.</DialogDescription>
          <form onSubmit={submit} className="flex gap-2">
            <Input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. katana, medieval…" aria-label="Search query" />
            <button type="submit" className="bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Search</button>
          </form>
        </DialogContent>
      </Dialog>
    </header>
  );
}
