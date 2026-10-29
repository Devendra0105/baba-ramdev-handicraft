import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ShopCategory, ShopImage, ShopProduct } from "@/lib/shop";
import { products as localProducts, collections as localCollections } from "@/data/products";

export const BUCKET = "product-images";

const PRODUCT_SELECT =
  "*, category:categories(id,slug,name), images:product_images(id,storage_path,url,alt,sort_order)";

/** The image bucket is private; resolve storage paths to signed URLs in one batch. */
export async function resolveImageUrls(paths: string[]): Promise<Record<string, string>> {
  const unique = [...new Set(paths.filter((p) => p && !/^https?:/.test(p)))];
  const out: Record<string, string> = {};
  if (!unique.length) return out;
  const { data } = await supabase.storage.from(BUCKET).createSignedUrls(unique, 60 * 60 * 6);
  data?.forEach((d) => { if (d.signedUrl && d.path) out[d.path] = d.signedUrl; });
  return out;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(r: any, urls: Record<string, string>): ShopProduct {
  const imgs: ShopImage[] = [...(r.images ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((i) => {
      const path = i.storage_path ?? i.url;
      return { id: i.id, path, src: /^https?:/.test(i.url) ? i.url : urls[path] ?? "", alt: i.alt || r.name };
    });
  return {
    id: r.id, slug: r.slug, name: r.name,
    price: r.price == null ? null : Number(r.price),
    stock: r.stock, lowStockThreshold: r.low_stock_threshold,
    description: r.description, details: r.details, materials: r.materials, dimensions: r.dimensions, care: r.care,
    specs: Array.isArray(r.specs) ? r.specs : [],
    status: r.status, eligible: r.inquiry_eligible, featured: r.featured, createdAt: r.created_at,
    category: r.category ?? null, images: imgs,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function mapProducts(rows: any[]): Promise<ShopProduct[]> {
  const paths = rows.flatMap((r) => (r.images ?? []).map((i: { storage_path: string | null; url: string }) => i.storage_path ?? i.url));
  const urls = await resolveImageUrls(paths);
  return rows.map((r) => mapProduct(r, urls));
}

function getLocalShopProducts(): ShopProduct[] {
  return localProducts.map((p) => {
    const col = localCollections.find((c) => c.id === p.category);
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: p.price,
      stock: 5,
      lowStockThreshold: 1,
      description: p.description,
      details: p.details,
      materials: "Handcrafted Brass, Carbon Steel, Velvet",
      dimensions: "Traditional Rajput Specifications",
      care: "Wipe with dry soft cloth. Keep oiled.",
      specs: p.specs || [],
      status: "published",
      eligible: true,
      featured: !!p.featured,
      createdAt: new Date().toISOString(),
      category: col ? { id: col.id, slug: col.id, name: col.name } : null,
      images: [{ id: p.id + "-img", path: p.image, src: p.image, alt: p.name }],
    };
  });
}

/** Public catalog. Returns database products, or your local products if database is empty. */
export async function fetchProducts(opts: { publishedOnly?: boolean } = { publishedOnly: true }) {
  try {
    let q = supabase.from("products").select(PRODUCT_SELECT).order("created_at", { ascending: false });
    if (opts.publishedOnly) q = q.eq("status", "published");
    const { data, error } = await q;
    if (error || !data || data.length === 0) {
      return getLocalShopProducts();
    }
    return mapProducts(data);
  } catch {
    return getLocalShopProducts();
  }
}


export function useProducts() {
  return useQuery({ queryKey: ["products", "public"], queryFn: () => fetchProducts({ publishedOnly: true }), staleTime: 60_000 });
}

export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: ["product", slug],
    enabled: !!slug,
    queryFn: async () => {
      try {
        const { data } = await supabase.from("products").select(PRODUCT_SELECT).eq("slug", slug!).eq("status", "published").maybeSingle();
        if (data) return (await mapProducts([data]))[0];
      } catch {}
      const fallback = getLocalShopProducts().find((p) => p.slug === slug);
      return fallback ?? null;
    },
  });
}


export function useCategories() {
  return useQuery({
    queryKey: ["categories", "public"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from("categories").select("*").eq("is_active", true).order("sort_order");
        if (!error && data && data.length > 0) return data as ShopCategory[];
      } catch {}
      return localCollections.map((c, i) => ({
        id: c.id,
        slug: c.id,
        name: c.name,
        description: c.description,
        image_url: c.image,
        sort_order: i,
      }));
    },
    staleTime: 60_000,
  });
}

export type Settings = {
  business_name: string; logo_url: string | null; phone: string | null; whatsapp: string | null; email: string | null;
  address: string | null; instagram: string | null; facebook: string | null; youtube: string | null; intro: string | null;
  privacy_text: string | null; terms_text: string | null; returns_text: string | null;
};

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("business_settings").select("*").eq("id", 1).maybeSingle();
      if (error) throw error;
      return (data ?? { business_name: "Baba Ramdev Handicrafts" }) as Settings;
    },
    staleTime: 5 * 60_000,
  });
}
