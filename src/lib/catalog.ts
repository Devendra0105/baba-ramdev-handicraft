import type { Product } from "@/data/products";

export type SortKey = "featured" | "price-asc" | "price-desc";

export interface CartLine {
  id: string;
  qty: number;
}

export function filterProducts(
  list: Product[],
  opts: { query?: string; category?: string; categoryNames?: Record<string, string> },
) {
  const q = (opts.query ?? "").trim().toLowerCase();
  return list.filter((p) => {
    if (opts.category && opts.category !== "all" && p.category !== opts.category) return false;
    if (!q) return true;
    const catName = opts.categoryNames?.[p.category] ?? p.category;
    return p.name.toLowerCase().includes(q) || catName.toLowerCase().includes(q);
  });
}

export function sortProducts(list: Product[], sort: SortKey) {
  const copy = [...list];
  if (sort === "price-asc") return copy.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") return copy.sort((a, b) => b.price - a.price);
  return copy.sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || Number(!!b.badge) - Number(!!a.badge));
}

export function cartSubtotal(lines: CartLine[], list: Product[]) {
  return lines.reduce((sum, l) => {
    const p = list.find((x) => x.id === l.id);
    return p ? sum + p.price * l.qty : sum;
  }, 0);
}

export function setQty(lines: CartLine[], id: string, qty: number): CartLine[] {
  if (qty <= 0) return lines.filter((l) => l.id !== id);
  const exists = lines.some((l) => l.id === id);
  return exists ? lines.map((l) => (l.id === id ? { ...l, qty } : l)) : [...lines, { id, qty }];
}

export const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());
