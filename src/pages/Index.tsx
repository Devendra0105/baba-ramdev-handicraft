import { Link } from "react-router-dom";
import { Hammer, MessageCircle, Pin, ScrollText } from "lucide-react";
import { Layout, Divider, StateBox } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { useCategories, useProducts, useSettings } from "@/lib/api";
import { sortProducts, whatsappLink } from "@/lib/shop";
import hero from "@/assets/hero.jpg";
import story from "@/assets/p-knight.png";
import uniique_muth from '@/assets/uniique_muth.jpg';
function SectionHead({ eyebrow, title, text }: { eyebrow?: string; title: string; text?: string }) {
  return (
    <div className="mb-10 text-center md:mb-14">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="heading-lg mt-2">{title}</h2>
      <Divider />
      {text && <p className="mx-auto mt-5 max-w-xl text-muted-foreground">{text}</p>}
    </div>
  );
}

export default function Index() {
  const { data: products, isLoading, isError } = useProducts();
  const { data: cats = [] } = useCategories();
  const { data: s } = useSettings();
  const featured = sortProducts(products ?? [], "featured").slice(0, 6);
  const wa = whatsappLink(s?.whatsapp, "Hello, I would like to know more about your products.");
  const catImage = (slug: string) => products?.find((p) => p.category?.slug === slug)?.images[0]?.src;

  return (
    <Layout>
            {/* Full-bleed Sword Background Hero */}

    <section className="blend-dark-to-light relative flex min-h-[82vh] items-center overflow-hidden bg-background">

        <img
          src={hero}
          alt="Handcrafted swords and talwars"
          className="absolute inset-0 h-full w-full object-cover object-right md:object-center"
        />
        {/* Dark radial gradient overlay for high text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/20" />

        <div className="container-wide relative py-20 md:py-28">
          <div className="max-w-2xl">
            <p className="eyebrow text-accent">Sirohi, Rajasthan</p>
                        <h1 className="heading-xl mt-5">
              Baba Ramdev <em className="text-accent">Handicrafts</em>
            </h1>

            {/* Legacy Tagline & Description */}
            <div className="mt-6 max-w-xl space-y-3">
              <p className="font-serif text-xl font-medium tracking-wide text-accent sm:text-2xl">
                The Legacy of Sirohi, Forged in Steel. Rooted in Honour.
              </p>
              <p className="text-base leading-relaxed text-foreground/90 sm:text-lg">
                Sirohi Talwar – An enduring symbol of Rajasthan&apos;s royal heritage, courage and traditional craftsmanship.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" className="h-12 px-8">
                <Link to="/shop">Explore Collection</Link>
              </Button>

              <Button asChild size="lg" variant="outline" className="h-12 border-foreground/30 bg-background/40 backdrop-blur-sm px-8">
                <Link to="/collections">Browse Handicrafts</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>


      {cats.length > 0 && (
        <section className="section">
          <div className="container-wide">
            <SectionHead eyebrow="Collections" title="Explore by Collection" />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {cats.map((c) => {
                const img = c.image_url || catImage(c.slug);
                return (
                  <Link key={c.id} to={`/shop?category=${c.slug}`} className="group block border border-border bg-card p-3 text-center hover:border-accent">
                    <div className="arch aspect-[3/4] overflow-hidden bg-muted">{img && <img src={img} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />}</div>
                    <p className="mt-3 font-serif text-xl">{c.name}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="section border-t border-border bg-secondary/40">
        <div className="container-wide">
          <SectionHead eyebrow="The Shop" title="Featured Pieces" />
          {isLoading ? <StateBox title="Loading products…" /> : isError ? <StateBox title="Could not load products. Please refresh." /> :
            featured.length ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{featured.map((p) => <ProductCard key={p.id} product={p} />)}</div>
            ) : <StateBox title="New pieces coming soon">{wa ? "Message us on WhatsApp to ask about what's available." : null}</StateBox>}
          <div className="mt-10 text-center"><Button asChild variant="outline" size="lg"><Link to="/shop">View all products</Link></Button></div>
        </div>
      </section>

      <section className="section">
        <div className="container-wide grid items-center gap-12 md:grid-cols-2">
          <img src={uniique_muth} alt="Handcrafted pieces from the workshop" loading="lazy" className="aspect-[4/5] w-full border border-border object-cover shadow-elegant" />
          <div>
            <p className="eyebrow">OUR HARITAGE</p>
            <h2 className="heading-lg mt-3">A Legacy Worth Preserving</h2>
            <ul className="mt-8 space-y-6">
              {[{ Icon: Pin, t: "Rooted in Sirohi", d: "known for its association with traditional sword-making and rich cultural heritage. Its name carries a legacy of Rajputana's courage, artistry and royal traditions." },
                { Icon: ScrollText, t: "Tradition in Every Detail", d: "Discover distinctive designs that reflect the timeless elegance of Rajasthan's royal past." },
                { Icon: MessageCircle, t: "Talk to us directly", d: "Send an inquiry or message us on WhatsApp — we confirm every order personally. If you want us to build something Unique for You, Contact us !" }].map(({ Icon, t, d }) => (
                <li key={t} className="flex gap-4"><Icon className="mt-1 h-6 w-6 shrink-0 text-accent" strokeWidth={1.5} /><div><p className="font-serif text-xl">{t}</p><p className="text-muted-foreground">{d}</p></div></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section jaali border-t border-border bg-secondary/40">
        <div className="container-wide grid items-center gap-12 md:grid-cols-2">
          <div className="md:order-2"><img src={story} alt="Pieces from the shop" loading="lazy" className="arch aspect-[4/5] w-full max-w-md object-contain p=6" /></div>
          <div>
            <p className="eyebrow">Our Story</p>
            <h2 className="heading-lg mt-3">A Legacy of Trust Since 1990</h2>
          <div className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-muted-foreground">
  <p>
    For over 36 years, we have proudly served Sirohi with three
    shops built on trust, quality and honest pricing. Our
    commitment is simple: to help every customer find their
    desired sword with the right quality, genuine value and
    personal attention. Your trust is the legacy we cherish.
  </p>

  <p className="mt-4 text-foreground font-medium">
    Three Shops. 36 Years of Trust. One Promise of Quality.
  </p>
</div>
            <Button asChild size="lg" className="mt-8"><Link to="/about">Read our story</Link></Button>
          </div>
        </div>
      </section>

    
     <section className="band-forest py-16 text-center">

        <div className="container-wide">
          <h2 className="heading-lg">Have a question?</h2>
          <div className="mx-auto mt-4 max-w-lg space-y-3 text-center text-sm">
  <p>Looking for a particular sword or blade design?</p>
  <p>Want a specific style, finish or decorative detail?</p>
  <p>Couldn't find what you wanted in our collection?</p>
  <p>Interested in bulk orders or special enquiries?</p>
</div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {wa && <Button asChild size="lg" className="bg-brass text-walnut hover:bg-brass/90"><a href={wa} target="_blank" rel="noreferrer">WhatsApp us</a></Button>}
            <Button asChild size="lg" variant="outline" className="border-current/40 bg-transparent hover:bg-forest-foreground/10"><Link to="/contact">Contact details</Link></Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
