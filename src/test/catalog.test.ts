import { describe, it, expect } from "vitest";
import type { Product } from "@/data/products";
import { cartSubtotal, filterProducts, setQty, sortProducts, isValidEmail } from "@/lib/catalog";

describe("catalog rules", () => {
  const products: Product[] = [
    { id: "shield", slug: "shield", name: "Shield", category: "shields", price: 100, description: "", details: "", specs: [], image: "" },
    { id: "talwar", slug: "talwar", name: "Talwar", category: "talwars", price: 250, description: "", details: "", specs: [], image: "" },
  ];

  it("calculates subtotal from quantities", () => {
    const lines = [{ id: "shield", qty: 2 }, { id: "talwar", qty: 1 }];
    expect(cartSubtotal(lines, products)).toBe(450);
  });

  it("removes a line when quantity drops to zero", () => {
    expect(setQty([{ id: "a", qty: 1 }], "a", 0)).toEqual([]);
  });

  it("sorts by price ascending", () => {
    expect(sortProducts(products, "price-asc")[0].price).toBe(100);
  });

  it("searches by category name", () => {
    const r = filterProducts(products, { query: "wall", categoryNames: { shields: "Wall Shields" } });
    expect(r.map((p) => p.id)).toEqual(["shield"]);
  });

  it("validates emails", () => {
    expect(isValidEmail("a@b.co")).toBe(true);
    expect(isValidEmail("nope@")).toBe(false);
  });
});
