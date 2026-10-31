# Baba Ramdev Handicrafts

Storefront and owner portal for Baba Ramdev Handicrafts in Sirohi, Rajasthan. Visitors can browse talwars, decorative swords, shields and handicrafts, filter collections, and send product inquiries. The owner manages products, photographs, stock, categories, customer requests and shop details at `/admin`.

**Inquiries are not paid orders.** No online payment is collected. Requests are saved to the connected backend and reviewed in the owner portal; automatic email/SMS notifications are not configured.

## Technology stack

- React 18, TypeScript and Vite 5
- Tailwind CSS 3, shadcn/ui and Radix UI
- React Router and TanStack React Query
- Lovable Cloud / Supabase for authentication, PostgreSQL data, product image storage and the `submit-inquiry` Edge Function
- Vitest and Testing Library

The Royal Dark Heritage theme uses Obsidian Black, Royal Crimson, Antique Gold, Royal Ivory and Antique Walnut. Global colors and typography live in `src/index.css`.

## Local setup

Use Node.js 20.19+ or 22.12+ and npm.

1. Clone the repository and open its root directory.
2. Install dependencies: `npm install`.
3. Create a local `.env` with the existing project's **public** connection values:

   ```dotenv
   VITE_SUPABASE_URL=<existing project URL>
   VITE_SUPABASE_PUBLISHABLE_KEY=<existing public publishable key>
   VITE_SUPABASE_PROJECT_ID=<existing project reference>
   ```

   Obtain these from the existing project configuration. Do not create a replacement backend or commit `.env`. Never use service-role keys or private credentials in browser configuration.
4. Start the website: `npm run dev`. Open the URL printed in the terminal.
5. Run tests: `npm test`.

## Project structure

- `src/App.tsx` — public and owner routes
- `src/lib/api.ts` — connected catalog, category and shop settings queries; local catalog fallback
- `src/lib/shop.ts` — current storefront rules and formatting
- `src/lib/catalog.ts` — legacy local catalog helpers, covered by `src/test`
- `src/context/InquiryCartContext.tsx` — inquiry cart persisted in browser storage
- `src/pages/admin/Admin.tsx` — authenticated owner portal
- `src/data/products.ts` — local fallback catalog, not the owner-managed live catalog
- `src/assets/` — local photographs used by pages and fallback catalog
- `src/components/` — shared storefront elements and UI controls
- `src/integrations/supabase/` — managed backend client and types
- `supabase/functions/submit-inquiry/` — server-side inquiry submission
- `public/favicon.svg` — icon derived from the site's existing shield-and-sword emblem

## Owner management

Sign in at `/admin` using the existing owner account. Change product details, assign categories, manage photos and publication, review customer requests, or update contact and policy text. Products and business settings in the connected backend are the live source of truth. Preserve the existing owner account and access controls.

## Production and deployment

```sh
npm run build
npm run preview
```

`npm run build` creates the static production site in `dist/`. `npm run preview` lets you check that output locally; it is not a production server.

- **Lovable hosting:** publish the existing project through its Publish dialog when ready. Keep its current connected backend.
- **Other static hosting:** configure the same public environment values before building; use `npm run build` as the build command and `dist` as the output directory. Rewrite application URLs to `/index.html` so direct links such as `/product/...` and `/admin` work.
- If the hosted origin changes, update the existing authentication site's allowed redirect URLs, including the `/admin` email confirmation destination.
- Frontend deployment does not recreate data or redeploy Edge Functions. Keep the current database, image bucket, authentication settings and deployed `submit-inquiry` function; deploy that function separately only when its code changes.

Before going live, review the real catalog, contact details and policies, and test an inquiry from the deployed site. The frontend rebrand does not rename the GitHub repository, Lovable project display name or hosted domain; those are separate account settings.
