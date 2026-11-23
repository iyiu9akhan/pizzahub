# PizzaHub — Agent Memory File
> Maintained by AI agents. Keep under ~150 lines. Read this before writing any code.

## 1. Project Summary
- Stack: Next.js 16 (App Router), TypeScript, Tailwind v4, ShadCN, MongoDB, Better Auth
- Roles: `customer`, `vendor`, `admin` | Location: `s:\programming\GitHub\pizzahub`

## 2. Folder Map
- `app/dashboard/<role>/<menu>/`: Server Component pages (data fetch + pass props) + `loading.tsx`
- `components/dashboard/<role>/`: UI-only presentation components (props-in, JSX-out)
- `components/menu/`: Shared `MenuItemCard.tsx` + `browse/` + `details/`
- `components/header/navbar/navBtn/`: `NavBtn.tsx`, `CartBtn.tsx` (order count badge), `ThemeToggle.tsx`
- `lib/api/`: Data fetch functions (`items.ts`, `orders.ts`)
- `lib/actions/`: Server actions (`CreateItem.ts`, `OrderPizza.ts`)
- `types/`: Shared TypeScript interfaces (`order.ts`, `menu.ts`, `OrderPizzaType.ts`)

## 3. Architecture Rules
- Server Components fetch data via `lib/api/` (server-only) using `authFetch` for private routes. No fetching in UI components.
- Mutations use server actions in `lib/actions/` returning `{ success, message?, code? }`. Never edit backend server code or `.env`.
- Central 401/403 handler: 401 -> `/login`, 403 FORBIDDEN -> `/unauthorized`, 403 ACCOUNT_RESTRICTED -> sign out + `/restricted`.
- No frontend filters for authorization; backend token enforces ownership.

## 4. Data Flow
`Express API / MongoDB` ➔ `lib/api/` (`authFetch` / `fetch`) ➔ `app/.../page.tsx` ➔ `components/...` (UI)

## 5. Data Models & Relations
- **Item**: `{ _id, itemName, description, price, category, images[], vendorId, vendorName, status, ratingAvg, ratingCount, vendorPremium? }`. Statuses: `pending`, `approved`, `rejected`, `inactive`. Active items for free plan limit = `pending` or `approved`.
- **Order**: `{ _id, customerId, customerName, customerEmail, customerPhone, deliveryAddress, deliveryDate, message, items[], totalAmount, status, fulfillmentStatus, vendorId, vendorName, createdAt }`. Default status: `pending`.
- **User**: `{ id, name, email, image, role: "admin" | "vendor" | "customer", businessName?, premium?: boolean, subscriptionPlan: "free" | "premium", subscriptionExpiresAt: Date | null, banned?: boolean }`.
- **Transaction**: `{ _id, vendorId, plan: "premium", amount, currency, stripeSessionId (unique), stripeSubscriptionId, paymentIntentId, status: "paid" | "refunded" | "failed", createdAt }`.
- **Status values**: `status`: `pending` | `accepted` | `rejected` | `cancelled`. `fulfillmentStatus`: `cooking` | `on_the_way` | `delivered`.

## 6. Role-Wise Dashboard Menus & Routes
- **Customer**: `/dashboard/customer` (Overview), `/dashboard/customer/my-orders` (Orders), `/dashboard/customer/wishlist` (Wishlist), `/dashboard/customer/profile` (Profile)
- **Vendor**: `/dashboard/vendor` (Overview), `/dashboard/vendor/menu-items` (Items), `/dashboard/vendor/add-menu-item` (Add), `/dashboard/vendor/orders` (Orders), `/dashboard/vendor/profile` (Profile), `/dashboard/vendor/subscription`
- **Admin**: `/dashboard/admin` (Overview), `/dashboard/admin/users`, `/dashboard/admin/items` (Products), `/dashboard/admin/orders`, `/dashboard/admin/transactions`, `/dashboard/admin/profile`

## 7. Key Logic Notes
- **Item management**: Vendor sees own items, admin sees all items via `GET /items/manage`. Vendor toggles availability between `approved` and `inactive` via `PATCH /items/:id/availability` (subject to free plan limit).
- **Order management**: Vendor sees own orders (accept/reject while pending), admin sees all orders via `GET /orders`. Customer cancels only own pending orders. Order validation: deliveryDate (today or later), address, phone, message (max 500); 403 on self-ordering; 409 on duplicate order on same day.
- **Header badge**: `ClipboardList` in header links to customer orders or vendor orders with live count.
- **Vendor premium**: Webhook only (`/payments/webhook`, Stripe signature check, 1-year duration, renewal extends later of expiry or now). Active check helper `isPremiumActive(user)` auto-downgrades past expiries. Free tier limit is 3 items (`pending` or `approved`). Premium vendors have unlimited items and `vendorPremium` badge.
- **Featured Menu**: Homepage featured section shows at least 6 approved items, active Premium vendors first with subtle "Featured" label.
- **Server search & sort**: `GET /items` supports `q` (case-insensitive regex on name, desc, location, vendor), `category`, `location`, `sort` (`price_asc`, `price_desc`, newest), `vendorId`. Distinct approved locations via `GET /items/locations`.
- **Reviews**: `getItemReviews` in `lib/api/items.ts` enriches reviews with real reviewer name & avatar from `user` collection.

## 8. Coding Conventions
- Currency: `formatUSD()` and `formatUSDCents()` from `lib/format.tsx` everywhere. Never use `alert()` (use `lib/toast.ts`).
- Tokens: `text-ink`, `text-ink-muted`, `bg-surface`, `border-line`, `bg-brand`, `bg-brand-soft`, `font-heading`, `font-text`.
- Hydration: Use `useSyncExternalStore` for mount check, never synchronous `setState` in `useEffect`.

## 9. Changelog
- 2026-11-20: Shared MenuItemCard, LoadingButton, UserAvatar, navbar rewrite, home sections, browse menu.
- 2026-11-20: Created customer overview, my-orders page, loading.tsx, and MyOrderCard with stage badges.
- 2026-11-21: Vendor premium flag (Better Auth user.additionalFields, Stripe payment success DB update, unlimited items limit check).
- 2026-11-21: Shared ProfileAvatarUploader for admin, vendor, customer profile pages with type/size validation and cache refresh.
- 2026-11-21: Unified header order icon (ClipboardList) with role-specific badge counts passed down from Server Components.
- 2026-11-22: Data layer security: lib/api/ server-only with authFetch & handleApiResponse; removed frontend security filters.
- 2026-11-22: Server actions in lib/actions/ for items, orders, user roles/restrictions, reviews, wishlist.
- 2026-11-22: Updated item details with quantity, phone, address, and rating stars; Customer My Orders cancel button for pending orders.
- 2026-11-22: Built Admin Manage Products, Manage Orders, Transactions table, and Overview stats & charts.
- 2026-11-22: Implemented Customer Wishlist (toggle, optimistic UI, dashboard page) & Reviews (stars, Zod validation, delete, 403 hint).
- 2026-11-22: Dashboard statistics & Recharts for Admin, Vendor, Customer (daily area, status donut, topItems bar, users donut).
- 2026-11-22: Custom 404/500/403 error pages, Zod validation on all forms, skeleton loaders, and payment verifying state.
- 2026-11-22: Unified profile images (role SVGs, resolveAvatar, server upload helper, updateProfileImage action, ProfileImageUploader).
- 2026-11-22: Homepage featured menu premium filtering, MenuItemCard premium badge, review customer profile resolution.
- 2026-11-22: Complete currency migration to USD (formatUSD, formatUSDCents), fixed LoginForm stray tag and unused imports.
- 2026-11-22: Fixed Error 441/500/404, Recharts sizing, Google OAuth role preservation & account linking, protected /menu/[id].
- 2026-11-22: Menu item images flow: 2MB limit, upload status feedback, safe fallback icons across cards, details, wishlist, orders, products.
