# Shopping Cart

A responsive shopping cart app: browse products, search and filter, manage a cart, and complete a 3-step checkout.

## Technologies
React 19, TypeScript, Vite, Tailwind CSS, Zustand (cart state + `persist`), TanStack Query (API data), Zod (validation), pnpm.

## Setup
```bash
pnpm install
pnpm dev       # start dev server
pnpm build     # type-check + production build
pnpm preview   # preview the build
```

## API
[DummyJSON products](https://dummyjson.com/products) — fetched with TanStack Query and validated with Zod.

## Features
- Product grid with loading, error (with retry), empty and success states
- Search by title, category filter, max-price filter, clear filters (`useProductFilters` hook)
- Cart: add, remove, +/- quantity (min 1, max 5), clear; item count in header
- Summary: subtotal, 5% tax, 10% discount when subtotal > $100, final total; min checkout $10 with explanatory message
- Cart persisted in `localStorage` via Zustand `persist`
- Checkout: Cart Review → Shipping (React state + Zod errors per field) → read-only Payment Summary → Place Order clears the cart

## How it works
- `src/hooks/useProducts.ts` — fetch + Zod parse inside the query function; TanStack Query handles caching/loading/error.
- `src/store/cartStore.ts` — Zustand store; only the cart lives here, not fetched products.
- `src/lib/cart.ts` — pure calculation function `calcTotals` and constants.
- `src/schemas.ts` — Zod schemas for the API response and shipping form.

## Known limitations
- No automated tests; no routing (views switch via state); product list capped at 100 items from the API.
- Cart stores a snapshot of price/title, so it won't update if the API price changes.
