# E-commerce Frontend Assignment

A React + TypeScript e-commerce app where users can:
- browse products
- open product detail pages
- add/remove cart items
- filter and sort with URL-based state

## Screenshot/Demo:

<video controls width="100%">
  <source src="./public/assets/desktop_demo.mp4" type="video/mp4">
</video>


<video controls width="100%">
  <source src="./public/assets/mobile_demo.mp4" type="video/mp4">
</video>

![Playwright test case](/public/assets/playwright.png)

## UI Screenshots

| Page | Desktop | Mobile |
|------|---------|--------|
| **Homepage** | ![Desktop Homepage](/public/assets/desktop_homepage.png) | ![Mobile Homepage](/public/assets/mobile_Homepage.png) |
| **Product Detail** | ![Desktop Product Page](/public/assets/desktop_product_page.png) | ![Mobile Product Page](/public/assets/mobile_products_page.png) |
| **Shopping Cart** | ![Desktop Cart Page](/public/assets/desktop_cartpage.png) | ![Mobile Cart Page](/public/assets/mobile_cartpage.png) |



## Tech Stack
- React 19
- TypeScript
- React Router
- Context API (cart state)
- Tailwind CSS
- Playwright (E2E)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` in project root:
   ```env
   VITE_APP_BASE_URL=https://api.escuelajs.co/api/v1
   ```
3. Start dev server:
   ```bash
   npm run dev
   ```

## Available Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Run app locally |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test:e2e` | Run Playwright tests |
| `npm run test:e2e:ui` | Run Playwright UI mode |

## E2E Testing (Playwright)

1. Install Playwright browser:
   ```bash
   npx playwright install chromium
   ```
2. Run tests:
   ```bash
   npm run test:e2e
   ```

Current E2E coverage includes:
- product listing to product detail to cart flow
- sort query persistence after refresh

## Feature Checklist (Requirement Mapping)

### 1) Home Page (Product Listing)
- Product grid with name, price, image, and detail link
- Multi-category filter + price range + sorting
- Filters/sort stored in URL query params (`categoryIds`, `priceMin`, `priceMax`, `sort`)
- Query-param state survives refresh, back/forward, and shareable links

### 2) Product Detail Page
- Dynamic route: `/product/:id`
- Product data fetched by id
- Title, description, price, image, quantity selector, and Add to Cart button

### 3) Cart Functionality
- Add from product detail page
- Remove items from cart page
- Update quantity in cart page
- Cart total shown in order summary
- Cart item count shown in header badge
- Cart persisted in `localStorage` (bonus)

### 4) Navigation
- Header navigation: Home and Cart
- Back-to-home link from product detail page
- 404 route handling for unknown routes

### 5) Technical Requirements
- Built with TypeScript + React
- Uses React Router for navigation
- Uses Context API for cart state
- Uses API for products, product details, and categories
- Filters trigger API requests (no local category filtering)
- Mobile responsive layout (drawer filters on mobile, sidebar on desktop)
- E2E setup added using Playwright

## Project Flow (Simple Overview)

1. `src/App.tsx` defines route tree.
2. `src/components/Layout.tsx` handles shared header/navigation and route outlet.
3. `src/pages/HomePage.tsx` renders listing + filter UI.
4. `src/hooks/useUrlFilters.ts` keeps filter/sort state synced with URL.
5. `src/hooks/useProducts.ts` handles paginated product fetching/infinite scroll.
6. `src/pages/ProductDetailPage.tsx` fetches product by URL `id`.
7. `src/context/CartContext.tsx` manages cart state/actions + localStorage persistence.
8. `src/pages/CartPage.tsx` shows cart items, totals, and remove/update actions.

## Assumptions
- API base URL is provided through `VITE_APP_BASE_URL`.
- Product sorting options are applied client-side after API fetch.
- Cart checkout is UI-only (no payment/order backend integration).

## Limitations
- Playwright tests are smoke tests, not full behavioral coverage.
- Product images/descriptions depend on external API quality.

## Additional Implemented Features
- Infinite scrolling on listing page
- Desktop filter panel scroll support
- Dual-thumb price range slider
- localStorage caching for API responses and cart state
