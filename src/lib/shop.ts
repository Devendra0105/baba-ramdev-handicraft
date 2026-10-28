/** Pure shop rules — no React, no network. Tested in src/test/catalog.test.ts */

export interface ShopImage { id: string; path: string; src: string; alt: string }
export interface ShopCategory { id: string; slug: string; name: string; description: string | null; image_url: string | null; sort_order: number }
export interface ShopProduct {
  id: string;
  slug: string;
  name: string;
  price: number | null;
  stock: number;
  lowStockThreshold: number;
  description: string | null;
  details: string | null;
  materials: string | null;
  dimensions: string | null;
  care: string | null;
  specs: { label: string; value: string }[];
  status: "draft" | "published" | "archived";
  eligible: boolean;
  featured: boolean;
  createdAt: string;
  category: { id: string; slug: string; name: string } | null;
  images: ShopImage[];
}

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc";

export interface CartLine { id: string; qty: number }

export const MAX_QTY = 50;

export function filterProducts(list: ShopProduct[], opts: { query?: string; category?: string }) {
  const q = (opts.query ?? "").trim().toLowerCase();
  return list.filter((p) => {
    if (opts.category && opts.category !== "all" && p.category?.slug !== opts.category) return false;
    if (!q) return true;
    return p.name.toLowerCase().includes(q) || (p.category?.name.toLowerCase().includes(q) ?? false);
  });
}

/** Unpriced items always sort after priced ones. */
export function sortProducts(list: ShopProduct[], sort: SortKey) {
  const copy = [...list];
  const price = (p: ShopProduct, dir: 1 | -1) => (p.price == null ? Infinity : p.price * dir);
  if (sort === "price-asc") return copy.sort((a, b) => price(a, 1) - price(b, 1));
  if (sort === "price-desc") return copy.sort((a, b) => price(a, -1) - price(b, -1));
  if (sort === "newest") return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return copy.sort((a, b) => Number(b.featured) - Number(a.featured) || b.createdAt.localeCompare(a.createdAt));
}

export type Availability = { label: string; tone: "ok" | "low" | "out" | "enquire"; canAdd: boolean };

export function availability(p: Pick<ShopProduct, "stock" | "lowStockThreshold" | "eligible">): Availability {
  if (!p.eligible) return { label: "Enquire on WhatsApp", tone: "enquire", canAdd: false };
  if (p.stock <= 0) return { label: "Out of stock", tone: "out", canAdd: false };
  if (p.stock <= p.lowStockThreshold) return { label: `Only ${p.stock} left`, tone: "low", canAdd: true };
  return { label: "In stock", tone: "ok", canAdd: true };
}

/** Estimated total; null when any line has no price (price on request). */
export function cartEstimate(lines: CartLine[], list: Pick<ShopProduct, "id" | "price">[]): number | null {
  let total = 0;
  for (const l of lines) {
    const p = list.find((x) => x.id === l.id);
    if (!p) continue;
    if (p.price == null) return null;
    total += p.price * l.qty;
  }
  return total;
}

export function setQty(lines: CartLine[], id: string, qty: number): CartLine[] {
  const q = Math.min(MAX_QTY, Math.floor(qty));
  if (q <= 0) return lines.filter((l) => l.id !== id);
  const exists = lines.some((l) => l.id === id);
  return exists ? lines.map((l) => (l.id === id ? { ...l, qty: q } : l)) : [...lines, { id, qty: q }];
}

export const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());
export const isValidPhone = (p: string) => /^[+0-9 ()-]{6,20}$/.test(p.trim()) && p.replace(/\D/g, "").length >= 6;

/** wa.me link; returns null when no number is configured. Never includes customer data. */
export function whatsappLink(number: string | null | undefined, text?: string) {
  const digits = (number ?? "").replace(/\D/g, "");
  if (digits.length < 8) return null;
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export const formatINR = (n: number | null) =>
  n == null ? "Price on request" : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2, minimumFractionDigits: 0 }).format(n);

export const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120);

export const INQUIRY_STATUSES = ["new", "contacted", "confirmed", "packed", "dispatched", "delivered", "cancelled"] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];
export const statusLabel = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
