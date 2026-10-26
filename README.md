# FORGE & LEGACY — Demo Sword Store

React + TypeScript + Vite + Tailwind storefront for decorative swords. **Catalog, prices, checkout, newsletter and contact form are demo-only.**

## Run locally
```
npm install
npm run dev
npm test   # catalog/cart rules
```

## Structure
- `src/data/products.ts` — **all collections and products** (name, price in INR, description, specs, image, badge, featured/bestseller flags). Edit here once; every page updates.
- `src/data/site.ts` — contact email/phone/address and social links (placeholders).
- `src/assets/` — images. Replace a file (same name) or import a new one in `products.ts`.
- `src/lib/catalog.ts` — search, filter, sort, subtotal logic.
- `src/context/StoreContext.tsx` — cart & wishlist (saved in localStorage).
- `src/components/` — Header, Footer, ProductCard, CollectionCard, CartDrawer, Newsletter.
- `src/pages/` — Home, Shop, Collections, Product, Craft, About, Contact, Wishlist, Cart, Checkout, Policies.
- `src/index.css` — colour and font tokens.

## Going live
Replace `handleSubmit` in `src/pages/Checkout.tsx` with a real backend + payment provider, connect a mailing service in `Newsletter.tsx`, and update the policy text in `src/pages/Policy.tsx`.
