import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products } from "@/data/products";
import { cartSubtotal, setQty, type CartLine } from "@/lib/catalog";
import { toast } from "sonner";

interface StoreValue {
  cart: CartLine[];
  wishlist: string[];
  cartCount: number;
  subtotal: number;
  cartOpen: boolean;
  setCartOpen: (o: boolean) => void;
  addToCart: (id: string, qty?: number) => void;
  updateQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
}

const StoreContext = createContext<StoreValue | null>(null);

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>(() => load("fl-cart", []));
  const [wishlist, setWishlist] = useState<string[]>(() => load("fl-wishlist", []));
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => localStorage.setItem("fl-cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("fl-wishlist", JSON.stringify(wishlist)), [wishlist]);

  const value = useMemo<StoreValue>(() => {
    const name = (id: string) => products.find((p) => p.id === id)?.name ?? "Item";
    return {
      cart,
      wishlist,
      cartOpen,
      setCartOpen,
      cartCount: cart.reduce((n, l) => n + l.qty, 0),
      subtotal: cartSubtotal(cart, products),
      addToCart: (id, qty = 1) => {
        setCart((c) => setQty(c, id, (c.find((l) => l.id === id)?.qty ?? 0) + qty));
        toast.success(`${name(id)} added to cart`);
        setCartOpen(true);
      },
      updateQty: (id, qty) => setCart((c) => setQty(c, id, qty)),
      removeFromCart: (id) => setCart((c) => setQty(c, id, 0)),
      clearCart: () => setCart([]),
      toggleWishlist: (id) =>
        setWishlist((w) => {
          const has = w.includes(id);
          toast(has ? `Removed ${name(id)} from wishlist` : `Saved ${name(id)} to wishlist`);
          return has ? w.filter((x) => x !== id) : [...w, id];
        }),
      isWishlisted: (id) => wishlist.includes(id),
    };
  }, [cart, wishlist, cartOpen]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
