import { Link } from "react-router-dom";
import { Layout, PageHeader } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/lib/api";
import story from "@/assets/about.jpg";


export default function About() {
  const { data: s } = useSettings();
  return (
    <Layout title="Our Story">
      <PageHeader eyebrow="Our Story" title="Baba Ramdev Handicrafts" />
      <section className="container-wide grid items-center gap-12 py-14 md:grid-cols-2">
        <img src={story} alt="Pieces from the shop" className="arch aspect-[4/5] w-full max-w-md object-cover" />
        <div>
          <div className="mt-6 space-y-4 text-base md:text-lg leading-relaxed text-muted-foreground break-words">
    <p>
      For over three decades, we have been serving the people of
      Sirohi with dedication, honesty and a deep understanding of
      what our customers value.
    </p>

    <p>
      What began in 1990 has grown into three shops across Sirohi,
      earning the trust and confidence of customers through years
      of commitment and personal service.
    </p>

    <p>
      We believe every customer deserves genuine value, dependable
      quality and a fair price. Whether looking for their dream
      sword or a distinctive piece of traditional craftsmanship,
      we strive to help them find exactly what they are looking for.
    </p>

    <p>
      Our journey has always been guided by one simple belief:
      customer trust is our greatest achievement, and quality is
      our promise.
    </p>

    <p className="text-foreground font-medium">
      Three Shops. 36 Years of Trust. One Commitment to Quality.
    </p>
  </div>
          <Button asChild size="lg" className="mt-8"><Link to="/shop">Explore the collection</Link></Button>
        </div>
      </section>
    </Layout>
  );
}
