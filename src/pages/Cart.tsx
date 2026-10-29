import { Link } from "react-router-dom";
import { Layout, PageHeader } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { CartLines, CartTotal } from "@/components/CartDrawer";
import { useStore } from "@/context/InquiryCartContext";

export default function Cart() {
  const { cartCount } = useStore();
  return (
    <Layout title="Inquiry Cart">
      <PageHeader eyebrow="Your selection" title="Inquiry Cart" />
      <section className="container-wide max-w-3xl py-10">
        <CartLines />
        {cartCount > 0 ? (
          <div className="mt-6 space-y-4 border-t border-border pt-6">
            <CartTotal />
            <Button asChild size="lg" className="w-full"><Link to="/checkout">Continue to inquiry</Link></Button>
          </div>
        ) : <div className="text-center"><Button asChild variant="outline"><Link to="/shop">Browse the shop</Link></Button></div>}
      </section>
    </Layout>
  );
}
