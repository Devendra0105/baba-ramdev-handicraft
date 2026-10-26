import { describe, it, expect } from "vitest";
import { products } from "@/data/products";
import { cartSubtotal, filterProducts, setQty, sortProducts, isValidEmail } from "@/lib/catalog";

describe("catalog rules", () => {
  it("has the six demo prices in INR", () => {
    expect(products.map((p) => p.price)).toEqual([12499, 15999, 18499, 10999, 21999, 8999]);
  });

  it("calculates subtotal from quantities", () => {
    const lines = [{ id: "highland-heritage", qty: 2 }, { id: "ceremonial-blade", qty: 1 }];
    expect(cartSubtotal(lines, products)).toBe(12499 * 2 + 8999);
  });

  it("removes a line when quantity drops to zero", () => {
    expect(setQty([{ id: "a", qty: 1 }], "a", 0)).toEqual([]);
  });

  it("sorts by price ascending", () => {
    expect(sortProducts(products, "price-asc")[0].price).toBe(8999);
  });

  it("searches by category name", () => {
    const r = filterProducts(products, { query: "japanese", categoryNames: { japanese: "Japanese-Inspired" } });
    expect(r.map((p) => p.id)).toEqual(["imperial-katana"]);
  });

  it("validates emails", () => {
    expect(isValidEmail("a@b.co")).toBe(true);
    expect(isValidEmail("nope@")).toBe(false);
  });
});
