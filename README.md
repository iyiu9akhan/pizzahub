# PizzaHub - Pizza Ordering & Delivery Platform

PizzaHub is a role-based pizza ordering and delivery platform. Customers browse menus and place orders, vendors (restaurants) publish menu items and manage incoming orders, and admins moderate users, menu items, and platform transactions.

## Live Demo

- Live Website: https://iyiu9akhan-pizzahub.vercel.app/
- Frontend Repository: https://github.com/iyiu9akhan/pizzahub
- Backend Repository: https://github.com/iyiu9akhan/pizzahub-server

## Demo Accounts

Use the accounts below to explore the platform. All demo accounts share the same password: `Pa$$w0rd!`

### Vendors

| Restaurant              | Email                           |
| ----------------------- | ------------------------------- |
| Dhaka Pizza Co.         | dhakapizza@gmail.com            |
| Sultan's Pizza Kitchen  | sultanpizzakitchen@gmail.com    |
| Old Town Pizza House    | oldtownpizzahouse@gmail.com     |
| Chittagong Pizza Corner | chittagongpizzacorner@gmail.com |

### Customers

| Name          | Email                   |
| ------------- | ----------------------- |
| Mahin Rahman  | mahin.rahman@gmail.com  |
| Farzana Ahmed | farzana.ahmed@gmail.com |
| Sakib Hasan   | sakib.hasan@gmail.com   |
| Tasmia Islam  | tasmia.islam@gmail.com  |

### Stripe Test Payment

Use the test card `4242 4242 4242 4242` with any future expiry date and any CVC when upgrading a vendor to Premium.

## Features

**Public**

- Home page with featured items, categories, and supporting sections
- Browse menu with search, category and location filters, and price sorting
- Item details page with multiple images and vendor information

**Customer**

- Place orders with delivery date, address, and special instructions
- Track order status and cancel pending orders
- Dashboard with order statistics and profile settings

**Vendor**

- Create, update, and delete menu items (images uploaded via ImgBB)
- Accept or reject customer orders
- Free plan (3 active items) and Premium plan (unlimited) via Stripe Checkout
- Dashboard with item and order statistics

**Admin**

- Manage users, including block and unblock
- Approve, reject, or delete menu items
- View platform transactions (read-only)

**Security**

- Better Auth with email/password and Google OAuth
- JWT verification and role-based middleware on the server
- Resource ownership checks before updates and deletes
- Premium activated only after a verified Stripe webhook event

## Tech Stack

**Frontend**

- Next.js (App Router)
- Tailwind CSS, shadcn/ui
- Motion (Framer Motion)
- Better Auth
- Recharts
- Sonner (toast notifications)

**Backend**

- Express.js
- MongoDB (native driver)
- jsonwebtoken
- Stripe
- cors, dotenv

**Services**

- Stripe Checkout and Webhooks
- ImgBB (image hosting)
- Google OAuth

## Getting Started

### Prerequisites

- Node.js 18 or later
- A MongoDB database (Atlas or local)
- Stripe, Google OAuth, and ImgBB accounts

### Client

```bash
git clone https://github.com/iyiu9akhan/pizzahub.git
cd pizzahub
npm install
cp .env.example .env.local
npm run dev
```

The client runs at `http://localhost:3000`.

### Server

```bash
git clone https://github.com/iyiu9akhan/pizzahub-server.git
cd pizzahub-server
npm install
cp .env.example .env
npm run dev
```

The server runs at `http://localhost:5000`.

To test webhooks locally, forward Stripe events with the Stripe CLI:

```bash
stripe listen --forward-to localhost:5000/api/webhooks/stripe
```

## Environment Variables

### Client (`.env.local`)

```
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_APP_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
MONGODB_URI=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_IMGBB_API_KEY=
```

### Server (`.env`)

```
PORT=
MONGODB_URI=
JWT_SECRET=
CLIENT_URL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PREMIUM_PRICE_ID=
```

## Challenge Implementation

### Advanced Search and Sorting

`GET /api/menu-items` accepts the following query parameters:

| Parameter       | Description                         |
| --------------- | ----------------------------------- |
| `search`        | Case-insensitive match on item name |
| `category`      | Filter by category                  |
| `location`      | Filter by area or city              |
| `sort`          | `price_asc` or `price_desc`         |
| `page`, `limit` | Pagination                          |

Only items with status `approved` are returned to the public. The server builds a MongoDB filter from the parameters and applies the sort on the `price` field.

### JWT Verification

1. After sign-in, the client requests a signed JWT containing the user id and role.
2. The token is sent in the `Authorization: Bearer <token>` header.
3. `verifyToken` middleware validates the signature and expiry, then loads the user and rejects blocked accounts. Invalid or expired tokens return `401`.
4. `requireRole('admin' | 'vendor' | 'customer')` middleware checks the role from the database, not from the client. A mismatch returns `403`.
5. Update and delete handlers verify that the resource belongs to the authenticated user before proceeding.

### Premium Subscription Flow

1. A vendor clicks Upgrade to Premium; the server creates a Checkout Session for the authenticated vendor only.
2. The vendor completes payment on Stripe.
3. Stripe sends a webhook event; the server verifies its signature, saves the transaction, and updates the vendor's subscription.
4. The success redirect page only displays confirmation and never activates Premium by itself.

## Author

**Muhammad Sameer Khan** -
Full Stack Developer (MERN)

- Portfolio: https://iyiu9akhan.vercel.app/
- GitHub: https://github.com/iyiu9akhan
- LinkedIn: https://www.linkedin.com/in/iyiu9akhan/
- Email: iyiu9akhan@gmail.com
