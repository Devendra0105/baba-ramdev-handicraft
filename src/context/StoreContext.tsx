import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { setQty, type CartLine } from "@/lib/catalog";

/** Guest inquiry cart: only product ids + quantities are stored locally; names/prices come from the database. */
interface StoreValue {
  cart: CartLine[];
  cartCount: number;
  cartOpen: boolean;
  setCartOpen: (o: boolean) => void;
  addToCart: (id: string, qty?: number) => void;
  updateQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);
const KEY = "brh-inquiry-cart";

function load(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY);
    const v = raw ? JSON.parse(raw) : [];
    return Array.isArray(v) ? v.filter((l) => typeof l?.id === "string" && Number.isInteger(l?.qty) && l.qty > 0) : [];
  } catch {
    return [];
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>(load);
  const [cartOpen, setCartOpen] = useState(false);
  useEffect(() => localStorage.setItem(KEY, JSON.stringify(cart)), [cart]);

  const value = useMemo<StoreValue>(() => ({
    cart,
    cartOpen,
    setCartOpen,
    cartCount: cart.reduce((n, l) => n + l.qty, 0),
    addToCart: (id, qty = 1) => {
      setCart((c) => setQty(c, id, (c.find((l) => l.id === id)?.qty ?? 0) + qty));
      setCartOpen(true);
    },
    updateQty: (id, qty) => setCart((c) => setQty(c, id, qty)),
    removeFromCart: (id) => setCart((c) => setQty(c, id, 0)),
    clearCart: () => setCart([]),
  }), [cart, cartOpen]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
