import { useParams } from "react-router-dom";
import { Layout, PageHeader } from "@/components/Layout";
import NotFound from "./NotFound";

const policies: Record<string, { title: string; body: string[] }> = {
  privacy: {
    title: "Privacy Policy",
    body: [
      "This is a placeholder privacy policy for a demonstration store. Replace it with your own policy before launch.",
      "In this demo, your cart and wishlist are stored only in your own browser. No personal data, emails or payment details are collected or sent to a server.",
    ],
  },
  terms: {
    title: "Terms & Conditions",
    body: [
      "This is a placeholder for your store's terms and conditions. Replace it with terms reviewed for your business and jurisdiction.",
      "All products and prices shown are demonstration content. No sales are currently offered through this website.",
    ],
  },
  returns: {
    title: "Returns & Shipping",
    body: [
      "This is a placeholder for your returns and shipping policy. Shipping and returns are not operational in this demo.",
      "Add your delivery regions, timelines, costs and return conditions here once your store is live.",
    ],
  },
};

export default function Policy() {
  const { slug = "" } = useParams();
  const policy = policies[slug];
  if (!policy) return <NotFound />;
  return (
    <Layout title={policy.title}>
      <PageHeader eyebrow="Policies" title={policy.title} />
      <section className="container-wide max-w-3xl space-y-6 py-16 text-muted-foreground">
        {policy.body.map((p) => <p key={p}>{p}</p>)}
      </section>
    </Layout>
  );
}
