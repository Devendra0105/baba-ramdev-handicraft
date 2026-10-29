import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/InquiryCartContext";
import { useProducts } from "@/lib/api";
import { cartEstimate, formatINR } from "@/lib/shop";

export function CartLines() {
  const { cart, updateQty, removeFromCart } = useStore();
  const { data: products = [] } = useProducts();
  const lines = cart.map((l) => ({ ...l, p: products.find((p) => p.id === l.id) })).filter((l) => l.p);
  if (!lines.length) return <p className="py-10 text-center text-muted-foreground">Your inquiry cart is empty.</p>;
  return (
    <ul className="divide-y divide-border">
      {lines.map(({ id, qty, p }) => (
        <li key={id} className="flex gap-4 py-4">
          {p!.images[0] && <img src={p!.images[0].src} alt="" className="h-20 w-20 shrink-0 object-cover" />}
          <div className="flex-1">
            <Link to={`/product/${p!.slug}`} className="font-serif text-lg leading-tight hover:text-primary">{p!.name}</Link>
            <p className="text-sm text-muted-foreground">{formatINR(p!.price)}</p>
            <div className="mt-2 flex items-center gap-2">
              <button aria-label="Decrease" className="border border-border p-1" onClick={() => updateQty(id, qty - 1)}><Minus className="h-3 w-3" /></button>
              <span className="w-6 text-center text-sm">{qty}</span>
              <button aria-label="Increase" className="border border-border p-1" disabled={qty >= p!.stock} onClick={() => updateQty(id, qty + 1)}><Plus className="h-3 w-3" /></button>
              <button aria-label={`Remove ${p!.name}`} className="ml-auto text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(id)}><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function CartTotal() {
  const { cart } = useStore();
  const { data: products = [] } = useProducts();
  const est = cartEstimate(cart, products);
  return (
    <div className="flex justify-between font-serif text-xl">
      <span>Estimated total</span><span>{est == null ? "On request" : formatINR(est)}</span>
    </div>
  );
}

export function CartDrawer() {
  const { cartOpen, setCartOpen, cartCount } = useStore();
  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl">Inquiry Cart</SheetTitle>
          <SheetDescription>An inquiry is not an order or payment. We will contact you to confirm.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto"><CartLines /></div>
        {cartCount > 0 && (
          <div className="space-y-3 border-t border-border pt-4">
            <CartTotal />
            <Button asChild className="w-full" onClick={() => setCartOpen(false)}><Link to="/checkout">Send Inquiry</Link></Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
