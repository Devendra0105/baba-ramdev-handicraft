import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Layout, PageHeader, DemoNotice } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { collections, products } from "@/data/products";
import { filterProducts, sortProducts, type SortKey } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const categoryNames = Object.fromEntries(collections.map((c) => [c.id, c.name]));

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const category = params.get("category") ?? "all";
  const sort = (params.get("sort") as SortKey) ?? "featured";

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (!value || value === "all" || (key === "sort" && value === "featured")) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const results = useMemo(
    () => sortProducts(filterProducts(products, { query: q, category, categoryNames }), sort),
    [q, category, sort],
  );

  const chip = (active: boolean) =>
    cn("border px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition-colors", active ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground/80 hover:border-primary hover:text-primary");

  return (
    <Layout title="Shop">
      <PageHeader eyebrow="The Armoury" title="Shop the Collection" text="Search, filter and sort our curated selection of decorative swords." />
      <section className="container-wide py-12">
        <DemoNotice>Demonstration catalog — products and prices are illustrative</DemoNotice>
        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => update("q", e.target.value)} placeholder="Search by name or category" aria-label="Search products" className="h-11 pl-9" />
          </div>
          <label className="flex items-center gap-3 text-sm text-muted-foreground">
            Sort
            <select value={sort} onChange={(e) => update("sort", e.target.value)} className="h-11 border border-input bg-background px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </label>
        </div>
        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          <button className={chip(category === "all")} aria-pressed={category === "all"} onClick={() => update("category", "all")}>All</button>
          {collections.map((c) => (
            <button key={c.id} className={chip(category === c.id)} aria-pressed={category === c.id} onClick={() => update("category", c.id)}>{c.name}</button>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground" aria-live="polite">{results.length} {results.length === 1 ? "piece" : "pieces"}</p>
        {results.length ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="mt-6 border border-border p-16 text-center">
            <p className="font-serif text-2xl">No pieces match your search.</p>
            <Button variant="outline" className="mt-6" onClick={() => setParams({})}>Clear filters</Button>
          </div>
        )}
      </section>
    </Layout>
  );
}
