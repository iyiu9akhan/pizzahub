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
- Server Components fetch data via `lib/api/` and pass props to `components/`. No fetching in UI components.
- Mutations use server actions in `lib/actions/`. Never edit backend server code or `.env`.
- Do not restructure existing folders. Keep changes targeted and minimal.

## 4. Data Flow
`DB (MongoDB)` ➔ `lib/api/` (GET fetch) ➔ `app/.../page.tsx` (fetch + filter by id) ➔ `components/...` (UI)

## 5. Data Models & Relations
- **Item**: `{ _id, itemName, description, price, category, images[], vendorId, vendorName, status }`
- **Order**: `{ _id, customerId, customerName, customerEmail, customerPhone, deliveryAddress, items[], totalAmount, status, fulfillmentStatus, vendorName, createdAt }`
- **User**: `{ id, name, email, image, role: "admin" | "vendor" | "customer", businessName?, premium?: boolean }`
- **Relations**: `Item.vendorId === User.id`, `Order.customerId === User.id`. Orders live in ONE collection.
- **Status values**: `status`: `pending` | `accepted` | `rejected` | `cancelled`. `fulfillmentStatus`: `cooking` | `on_the_way` | `delivered`.

## 6. Role-Wise Dashboard Menus & Routes
- **Customer**: `/dashboard/customer` (Overview), `/dashboard/customer/my-orders` (Orders), `/dashboard/customer/profile` (Profile)
- **Vendor**: `/dashboard/vendor` (Overview), `/dashboard/vendor/menu-items` (Items), `/dashboard/vendor/add-menu-item` (Add), `/dashboard/vendor/orders` (Orders), `/dashboard/vendor/profile` (Profile)
- **Admin**: `/dashboard/admin` (Overview), `/dashboard/admin/users`, `/dashboard/admin/vendors`, `/dashboard/admin/products`, `/dashboard/admin/orders`, `/dashboard/admin/profile`

## 7. Key Logic Notes
- **Vendor own items**: `app/dashboard/vendor/menu-items/page.tsx` filters `item.vendorId === session.user.id`.
- **Customer own orders**: `my-orders/page.tsx` filters `order.customerId === session.user.id`.
- **Status sync**: All orders in one DB collection. Pages use `dynamic = "force-dynamic"` & `cache: "no-store"`.
- **Header badge**: `ClipboardList` in header links to `/dashboard/customer/my-orders` (pending count) or `/dashboard/vendor/orders` (undelivered count). Fetched in Server Components and passed as prop.
- **Vendor premium**: Free tier has 3-item limit. Premium vendors have unlimited items and active plan badge.

## 8. Coding Conventions
- Currency: `formatBDT()` from `lib/format.tsx` everywhere. Never use `alert()` (use `lib/toast.ts`).
- Tokens: `text-ink`, `text-ink-muted`, `bg-surface`, `border-line`, `bg-brand`, `bg-brand-soft`, `font-heading`, `font-text`.
- Hydration: Use `useSyncExternalStore` for mount check, never synchronous `setState` in `useEffect`.

## 9. Changelog
- 2026-11-20: Shared MenuItemCard, LoadingButton, UserAvatar, navbar rewrite, home sections, browse menu.
- 2026-11-20: Filter vendor items by vendorId in menu-items/page.tsx.
- 2026-11-20: Added getOrdersByCustomerId & getCustomerActiveOrdersCount in lib/api/orders.ts.
- 2026-11-20: Created customer overview, my-orders page, loading.tsx, and MyOrderCard with stage badges.
- 2026-11-20: Updated DashboardSidebar customer links and connected CartBtn with real active order count badge.
- 2026-11-20: Fixed client mount hydration in menu item details using useSyncExternalStore; ESLint passes clean.
- 2026-11-20: Vendor menu items filter by vendorId (String comparison), getItems({ vendorId }) added, vendorId saved on item creation.
- 2026-11-21: Vendor premium flag (Better Auth user.additionalFields, Stripe payment success DB update, unlimited items limit check).
- 2026-11-21: Shared ProfileAvatarUploader for admin, vendor, customer profile pages with type/size validation and cache refresh.
- 2026-11-21: Unified header order icon (ClipboardList) with role-specific badge counts passed down from Server Components.
