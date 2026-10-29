import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Layout, PageHeader, StateBox } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCategories, useProducts } from "@/lib/api";
import { filterProducts, sortProducts, type SortKey } from "@/lib/shop";
import { cn } from "@/lib/utils";

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const category = params.get("category") ?? "all";
  const sort = (params.get("sort") as SortKey) ?? "featured";
  const { data: products, isLoading, isError, refetch } = useProducts();
  const { data: cats = [] } = useCategories();

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (!value || value === "all" || (key === "sort" && value === "featured")) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };
  const results = useMemo(() => sortProducts(filterProducts(products ?? [], { query: q, category }), sort), [products, q, category, sort]);
  const chip = (active: boolean) => cn("border px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em]", active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary hover:text-primary");

  return (
    <Layout title="Shop">
      <PageHeader eyebrow="The Shop" title="Shop the Collection" />
      <section className="container-wide py-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => update("q", e.target.value)} placeholder="Search by name or category" aria-label="Search products" className="h-11 pl-9" />
          </div>
          <label className="flex items-center gap-3 text-sm text-muted-foreground">Sort
            <select value={sort} onChange={(e) => update("sort", e.target.value)} className="h-11 border border-input bg-background px-3 text-foreground">
              <option value="featured">Featured</option><option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option>
            </select>
          </label>
        </div>
        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          <button className={chip(category === "all")} aria-pressed={category === "all"} onClick={() => update("category", "all")}>All</button>
          {cats.map((c) => <button key={c.id} className={chip(category === c.slug)} aria-pressed={category === c.slug} onClick={() => update("category", c.slug)}>{c.name}</button>)}
        </div>
        <div className="mt-8">
          {isLoading ? <StateBox title="Loading products…" /> :
            isError ? <StateBox title="Could not load products."><Button variant="outline" onClick={() => refetch()}>Try again</Button></StateBox> :
            results.length ? (
              <>
                <p className="mb-5 text-sm text-muted-foreground" aria-live="polite">{results.length} {results.length === 1 ? "piece" : "pieces"}</p>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{results.map((p) => <ProductCard key={p.id} product={p} />)}</div>
              </>
            ) : <StateBox title={products?.length ? "No pieces match your search." : "New pieces coming soon."}>{products?.length ? <Button variant="outline" onClick={() => setParams({})}>Clear filters</Button> : null}</StateBox>}
        </div>
      </section>
    </Layout>
  );
}
