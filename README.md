# PizzaHub — Client Application

A modern, multi-vendor artisan pizza ordering platform built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, and Better Auth, backed by MongoDB and an Express REST API.

---

## Live & Repository Links (Placeholders)

- **Live Website**: `<LIVE_SITE_URL>`
- **Client Repository**: `<CLIENT_REPO_URL>`
- **Server Repository**: `<SERVER_REPO_URL>`
- **Admin Email**: `<ADMIN_EMAIL>`
- **Admin Password**: `<ADMIN_PASSWORD>`
- **Stripe Test Card**: `<STRIPE_TEST_CARD_NUMBER>` (CVC: `424`, Exp: `12/34`)

---

## Important Features

### Customer Role
- **Browse & Discovery**: Search artisan pizzas by keyword, filter by categories and preparation locations, sort by price (ascending/descending).
- **Item Details & Ordering**: Real-time quantity selector, custom delivery address, and contact number. Directly creates orders with initial `pending` status.
- **My Orders**: Dedicated order management tracking fulfillment progress (`cooking` → `on_the_way` → `delivered`). Allows cancellation only while the order is `pending`.
- **Wishlist**: Save favorite pizzas with optimistic UI updates and instant toggle notifications.
- **Reviews & Ratings**: Submit star ratings and feedback for purchased menu items with instant reviewer avatar resolution.
- **Profile Settings**: Manage name and custom avatar uploaded directly via ImgBB.

### Vendor Role
- **Kitchen Overview**: Stat metrics for sales volume, customer orders, delivered pizzas, and menu item quotas.
- **Menu Item Management**: Create, edit, and toggle availability (active/inactive) for menu items with mandatory image upload.
- **Tier Quota Enforcement**: Free tier capped at 3 active menu items; unlimited items for Premium subscribers.
- **Customer Orders**: Review kitchen incoming orders with single-click Accept/Reject transitions for pending orders.
- **Subscription Management**: Compare Free vs. Premium tiers, initiate Stripe Checkout, and view active plan details.
- **Profile Settings**: Update store and business contact information.

### Admin Role
- **Platform Analytics**: High-level platform statistics including order volume trends, donut status distribution, user role breakdowns, and items by status.
- **User Governance**: Browse registered accounts, search by name/email, filter by role (`customer`, `vendor`, `admin`), change user roles, and restrict/unrestrict accounts.
- **Catalog Moderation**: Review all platform pizzas across vendors, approve/reject pending submissions, and delete violations.
- **Orders Oversight**: View all platform orders with fulfillment status tracking.
- **Payment Records**: Read-only log of Stripe Checkout sessions and verified subscription payments.

---

## Technology Stack

The application is built using the following dependencies from `package.json`:

### Core Framework & UI
- **Next.js (`16.4.5`)**: App Router with Turbopack, Server Components, and Server Actions.
- **React & React DOM (`19.3.1`)**: Component architecture and hooks.
- **TypeScript (`^5`)**: Strict end-to-end type safety.
- **Tailwind CSS (`^4`)**: Modern CSS styling with semantic design tokens.
- **ShadCN / Radix UI**: Accessible UI primitives (`@radix-ui/react-alert-dialog`, `@base-ui/react`).
- **Lucide React (`^1.75.0`)**: Modern iconography.
- **Recharts (`^3.8.0`)**: Responsive interactive charts for analytics dashboards.
- **Sonner (`^2.0.8`)**: Toast notification system.
- **tw-animate-css (`^1.4.0`)**: Micro-animations and transition effects.
- **next-themes (`^0.4.6`)**: Dark and light mode switching.

### Authentication & Database
- **Better Auth (`^1.7.25`)**: Authentication engine supporting credentials and Google OAuth.
- **@better-auth/mongo-adapter (`^1.7.25`)**: Native MongoDB persistence for Better Auth.
- **MongoDB Node Driver (`^7.9.0`)**: Direct collection queries for high-performance data enrichment.

### Payments & Validation
- **Stripe (`^23.2.0`) & @stripe/stripe-js (`^10.3.0`)**: Server and client payment integration.
- **Zod (`^4.6.7`)**: Runtime schema validation for forms and payloads.

---

## Installation & Local Development

1. **Clone the repository**:
   ```bash
   git clone <CLIENT_REPO_URL>
   cd pizzahub
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory (refer to `.env.example`):
   ```bash
   cp .env.example .env.local
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable Name | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection string for session and user collections |
| `BETTER_AUTH_SECRET` | Secret key used to encrypt and sign auth session cookies |
| `BETTER_AUTH_URL` | Canonical origin for Better Auth (e.g., `http://localhost:3000`) |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of the Express backend API (no trailing slash) |
| `NEXT_PUBLIC_APP_URL` | Client origin URL used for redirect callbacks |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret from Google Cloud Console |
| `IMGBB_API_KEY` | Server-only API key for hosting images on ImgBB |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Public key for client-side Stripe checkout initialization |
| `STRIPE_SECRET_KEY` | Server-side secret key for creating Checkout sessions |

---

## Challenge Requirements

### 1. Advanced Search, Filtering, and Sorting
- **API Contract**: The client queries the backend catalog via `GET /items` with URL query parameters:
  - `search`: Keyword string matched case-insensitively against `itemName` and `description`.
  - `category`: Filter by pizza category (e.g., `Classic Pizzas`, `Vegetarian Pizzas`).
  - `location`: Filter by vendor kitchen location.
  - `sort`: Ordering direction (`price_asc` for lowest price, `price_desc` for highest price).
  - `page` & `limit`: Pagination parameters.
- **MongoDB Query Pipeline**:
  - Only approved and active items (`status: "approved"`, `isActive: true`) are included in public queries.
  - The query object dynamically builds regex criteria:
    ```javascript
    const query = { status: "approved" };
    if (search) query.itemName = { $regex: search, $options: "i" };
    if (category && category !== "All") query.category = category;
    if (location && location !== "All") query.location = location;
    ```
  - Sorting applies numeric sort operators: `{ price: 1 }` for ascending or `{ price: -1 }` for descending.

### 2. Token & Role Verification Flow
- **Authentication**: HTTP-only session cookies managed by Better Auth are verified on the Next.js server via `getSession()` from `lib/core/server.ts`.
- **API Authorization**: When the Next.js server calls private Express endpoints, it attaches the bearer token: `Authorization: Bearer <session_token>`.
- **Middleware Flow**:
  1. **Token Extraction**: The server retrieves the token from the `Authorization` header.
  2. **Signature Verification**: Validates the token against the active session store; returns `401 Unauthorized` if absent, expired, or tampered.
  3. **Role Enforcement**: Middleware checks `user.role` against required permissions (e.g., `requireRole("admin")`); returns `403 Forbidden` if the role lacks privileges.
  4. **Account Status Check**: If `user.banned` or `user.restricted` is true, the request is rejected with `403 ACCOUNT_RESTRICTED`, triggering automatic client sign-out and redirection to `/restricted`.
  5. **Resource Ownership**: For mutations (updating/deleting an item or order), the handler asserts that `item.vendorId === req.user.id` or `order.customerId === req.user.id`.

---

## Payment Flow (Vendor Premium)

1. **Session Creation**: Authenticated vendor clicks "Upgrade to Premium". The server creates a Stripe Checkout Session via `POST /api/checkout_sessions`, securely embedding `metadata: { vendorId: session.user.id }`.
2. **Checkout Redirect**: The client redirects the vendor to Stripe's hosted payment page.
3. **Webhook Verification**: Upon successful payment, Stripe issues a `checkout.session.completed` event.
4. **Activation**: The backend verifies the event signature using `STRIPE_WEBHOOK_SECRET` and the raw request body. Upon verification, the vendor's record is updated with `premium: true`, unlocking unlimited menu items and featured placement.
5. **Idempotency**: Duplicate event deliveries are ignored by recording the Stripe `sessionId` in the `payments` collection.

---

## Google OAuth Setup

To enable Google Sign-In and Sign-Up:
1. Create a project in [Google Cloud Console](https://console.cloud.google.com/).
2. Configure the OAuth Consent Screen (External, Support Email, Scopes: `email`, `profile`, `openid`).
3. Create OAuth 2.0 Client Credentials:
   - **Authorized JavaScript Origins**:
     - `http://localhost:3000`
     - `<LIVE_SITE_URL>`
   - **Authorized Redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google`
     - `<LIVE_SITE_URL>/api/auth/callback/google`
