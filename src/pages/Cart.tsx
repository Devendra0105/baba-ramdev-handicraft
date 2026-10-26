import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Layout, PageHeader, DemoNotice } from "@/components/Layout";
import { CartLines } from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";
import { formatINR } from "@/data/products";

export default function Cart() {
  const { cart, subtotal, clearCart } = useStore();
  return (
    <Layout title="Cart">
      <PageHeader eyebrow="Your Selection" title="Shopping Cart" />
      <section className="container-wide py-16">
        {cart.length === 0 ? (
          <div className="border border-border p-16 text-center">
            <ShoppingBag className="mx-auto h-10 w-10 text-primary" />
            <p className="mt-4 font-serif text-2xl">Your cart is empty.</p>
            <Button asChild className="mt-6"><Link to="/shop">Browse the collection</Link></Button>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
            <div>
              <CartLines />
              <button onClick={clearCart} className="mt-4 text-sm text-muted-foreground underline hover:text-destructive">Clear cart</button>
            </div>
            <aside className="h-fit space-y-4 border border-border bg-card p-6">
              <h2 className="font-serif text-2xl">Summary</h2>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>{formatINR(subtotal)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span>Calculated later</span></div>
              <div className="flex justify-between border-t border-border pt-4"><span>Total</span><span className="font-serif text-2xl text-primary">{formatINR(subtotal)}</span></div>
              <Button asChild size="lg" className="w-full"><Link to="/checkout">Proceed to Checkout</Link></Button>
              <DemoNotice>Demo mode — no real orders</DemoNotice>
            </aside>
          </div>
        )}
      </section>
    </Layout>
  );
}
