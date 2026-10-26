import { Link } from "react-router-dom";
import { Gem, ScrollText, ShieldCheck, MessageCircle } from "lucide-react";
import { Layout, DemoNotice } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { CollectionCard } from "@/components/CollectionCard";
import { Newsletter } from "@/components/Newsletter";
import { collections, products } from "@/data/products";
import hero from "@/assets/hero.jpg";
import craft from "@/assets/craft.jpg";
import about from "@/assets/about.jpg";

const trust = [
  { Icon: Gem, label: "Curated Collectibles" },
  { Icon: ScrollText, label: "Detailed Product Information" },
  { Icon: ShieldCheck, label: "Secure Checkout Experience" },
  { Icon: MessageCircle, label: "Responsive Customer Support" },
];

function SectionHead({ title, text }: { title: string; text?: string }) {
  return (
    <div className="mb-12 text-center md:mb-16">
      <h2 className="heading-lg">{title}</h2>
      <div className="gold-rule mt-6" />
      {text && <p className="mx-auto mt-6 max-w-xl text-muted-foreground">{text}</p>}
    </div>
  );
}

export default function Index() {
  const featured = products.filter((p) => p.featured).slice(0, 6);
  const bestsellers = products.filter((p) => p.bestseller).slice(0, 4);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative flex min-h-[86vh] items-center overflow-hidden">
        <img src={hero} alt="Ornate historical longsword with gilded engraved crossguard on dark slate" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover object-right" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/10" />
        <div className="container-wide relative py-24">
          <div className="max-w-2xl animate-fade-in-up">
            <p className="eyebrow">The Art of the Blade</p>
            <h1 className="heading-xl mt-6">Legends Forged in <em className="text-primary">Steel.</em></h1>
            <p className="mt-8 max-w-lg text-lg text-foreground/80">Explore a curated collection of decorative swords, historical replicas, and timeless pieces inspired by centuries of craftsmanship.</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild size="lg" className="h-12 px-8"><Link to="/shop">Explore Collection</Link></Button>
              <Button asChild size="lg" variant="outline" className="h-12 border-foreground/30 bg-transparent px-8"><Link to="/craft">Discover Our Craft</Link></Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-border bg-card">
        <ul className="container-wide grid grid-cols-2 gap-6 py-8 lg:grid-cols-4">
          {trust.map(({ Icon, label }) => (
            <li key={label} className="flex items-center gap-3">
              <Icon className="h-5 w-5 shrink-0 text-primary" strokeWidth={1.4} />
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground/85">{label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Collections */}
      <section className="section">
        <div className="container-wide">
          <SectionHead title="Explore the Collections" text="Distinctive pieces inspired by history, tradition, and artistry." />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {collections.map((c) => <CollectionCard key={c.id} collection={c} />)}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="section border-t border-border bg-card/40">
        <div className="container-wide">
          <SectionHead title="Selected for Collectors" text="Explore distinctive designs and decorative craftsmanship." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="mx-auto mt-10 max-w-xl"><DemoNotice>Demonstration catalog — products and prices are illustrative</DemoNotice></div>
        </div>
      </section>

      {/* Craft banner */}
      <section className="relative overflow-hidden">
        <img src={craft} alt="Blacksmith shaping a glowing blade on an anvil" loading="lazy" width={1920} height={912} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-background/70" />
        <div className="container-wide relative py-28 text-center md:py-40">
          <p className="eyebrow">Our Craft</p>
          <h2 className="heading-lg mt-4">Where Craft Meets Legacy</h2>
          <p className="mx-auto mt-6 max-w-xl text-foreground/85">Every design tells a story. Discover the artistry, historical inspiration, and fine details behind distinctive collector pieces.</p>
          <Button asChild size="lg" variant="outline" className="mt-10 h-12 border-primary bg-transparent px-8 text-primary hover:bg-primary hover:text-primary-foreground"><Link to="/craft">Explore Our Craft</Link></Button>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="section">
        <div className="container-wide">
          <SectionHead title="Collector Favorites" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {bestsellers.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section border-t border-border">
        <div className="container-wide grid items-center gap-12 md:grid-cols-2 md:gap-20">
          <img src={about} alt="Close-up of decorative engraving on a sword blade and brass hilt" loading="lazy" width={1024} height={1280} className="aspect-[4/5] w-full border border-border object-cover shadow-elegant" />
          <div>
            <p className="eyebrow">About the Brand</p>
            <h2 className="heading-lg mt-4">More Than a Display Piece</h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">FORGE &amp; LEGACY celebrates historical design, traditional artistry, and the stories behind collectible swords. Our collection brings together pieces inspired by different eras and cultures for enthusiasts, historians, and collectors.</p>
            <Button asChild size="lg" className="mt-10 h-12 px-8"><Link to="/about">Our Story</Link></Button>
          </div>
        </div>
      </section>

      <Newsletter />
    </Layout>
  );
}
