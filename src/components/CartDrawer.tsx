import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useStore } from "@/context/StoreContext";
import { formatINR, products } from "@/data/products";

export function CartLines({ compact = false }: { compact?: boolean }) {
  const { cart, updateQty, removeFromCart } = useStore();
  return (
    <ul className="divide-y divide-border">
      {cart.map((line) => {
        const p = products.find((x) => x.id === line.id);
        if (!p) return null;
        return (
          <li key={line.id} className="flex gap-4 py-4">
            <img src={p.image} alt={p.name} width={80} height={80} className={compact ? "h-20 w-20 object-cover" : "h-24 w-24 object-cover"} />
            <div className="flex flex-1 flex-col">
              <div className="flex justify-between gap-2">
                <Link to={`/product/${p.slug}`} className="font-serif text-lg leading-tight hover:text-primary">{p.name}</Link>
                <button onClick={() => removeFromCart(p.id)} aria-label={`Remove ${p.name}`} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-primary">{formatINR(p.price)}</p>
              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="flex items-center border border-border">
                  <button className="p-2 hover:text-primary" aria-label={`Decrease quantity of ${p.name}`} onClick={() => updateQty(p.id, line.qty - 1)}><Minus className="h-3 w-3" /></button>
                  <span className="w-8 text-center text-sm" aria-live="polite">{line.qty}</span>
                  <button className="p-2 hover:text-primary" aria-label={`Increase quantity of ${p.name}`} onClick={() => updateQty(p.id, line.qty + 1)}><Plus className="h-3 w-3" /></button>
                </div>
                <span className="text-sm">{formatINR(p.price * line.qty)}</span>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function CartDrawer() {
  const { cartOpen, setCartOpen, cart, subtotal } = useStore();
  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="flex w-full flex-col border-border bg-background sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl">Your Cart</SheetTitle>
          <SheetDescription>Demo cart — saved on this device only.</SheetDescription>
        </SheetHeader>
        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <ShoppingBag className="h-10 w-10 text-primary" />
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Button asChild variant="outline" onClick={() => setCartOpen(false)}><Link to="/shop">Browse the collection</Link></Button>
          </div>
        ) : (
          <>
            <div className="-mx-6 flex-1 overflow-y-auto px-6"><CartLines compact /></div>
            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-serif text-xl text-primary">{formatINR(subtotal)}</span></div>
              <div className="grid grid-cols-2 gap-2">
                <Button asChild variant="outline" onClick={() => setCartOpen(false)}><Link to="/cart">View Cart</Link></Button>
                <Button asChild onClick={() => setCartOpen(false)}><Link to="/checkout">Checkout</Link></Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
