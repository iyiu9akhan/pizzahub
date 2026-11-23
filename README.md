# 🍕 PizzaHub

**A modern pizza ordering and restaurant management platform.**

PizzaHub is a full-stack food ordering application designed to connect customers with pizza vendors through an intuitive ordering experience. The platform supports customer accounts, vendor management, menu administration, online payments, order processing, and a dedicated admin dashboard for managing the entire system.

---

## 🌐 Live Demo

- **Live Website:** [Add your deployed website URL]
- **Frontend Repository:** [Add your frontend repository URL]
- **Backend Repository:** [Add your backend repository URL]

---

## ✨ Features

### 👤 Authentication & User Management
- Secure email and password authentication.
- Google social login.
- User role management with Admin, Vendor, and Customer roles.
- User profile management.
- Admin-controlled user restrictions.
- Protected routes and role-based access control.

### 🍕 Menu & Food Discovery
- Browse available pizza items.
- View detailed information about each menu item.
- Explore menu items by category.
- Search and filter menu items.
- View item prices, descriptions, images, ratings, and vendor information.
- Premium vendor identification.
- Responsive menu browsing experience.

### 🛒 Customer Features
- Add menu items to wishlist.
- Manage wishlist items.
- Place food orders.
- Secure online payment integration.
- View and manage orders.
- Track order status.
- Review and rate menu items.
- Access detailed menu item information without requiring authentication.

### 🏪 Vendor Dashboard
- Dedicated vendor dashboard.
- Create and manage menu items.
- Update existing menu items.
- Upload and manage menu item images.
- Track menu item approval status.
- View and manage incoming orders.
- Update order processing status.
- Manage vendor profile information.
- Premium vendor support.

### 🛡️ Admin Dashboard
- Centralized dashboard for platform management.
- Manage registered users.
- Change user roles.
- Restrict or activate user accounts.
- Manage vendor menu items.
- Approve or reject submitted menu items.
- Ban and unban approved menu items.
- Edit menu items belonging to any vendor.
- Delete menu items.
- Manage orders and platform activities.
- Monitor premium vendor status.

### 💳 Payment Integration
- Secure payment processing with Stripe.
- Payment intent creation and processing.
- Payment status management.
- Backend payment handling.
- Protected payment endpoints.

### 🎨 User Experience
- Modern and responsive UI.
- Clean dashboard layouts.
- Dark and light theme support.
- Loading states and skeleton components.
- Toast notifications for user feedback.
- Form validation.
- Confirmation dialogs for destructive actions.
- Responsive design for mobile, tablet, and desktop.

---

## 🛠️ Tech Stack

### Frontend
- **Next.js** – React framework
- **React** – UI development
- **TypeScript** – Type safety
- **Tailwind CSS** – Styling
- **Lucide React** – Icons
- **React Hot Toast** – Notifications

### Backend
- **Node.js** – Runtime environment
- **Express.js** – REST API framework
- **MongoDB** – Database
- **Stripe** – Payment processing

### Authentication & Security
- Authentication system with email/password and Google login
- Session-based authentication
- Role-based authorization
- Protected API routes
- Server-side authentication checks
- Environment-based configuration

### Deployment
- **Frontend:** Vercel
- **Backend:** Node.js hosting platform
- **Database:** MongoDB Atlas

---

## 👥 User Roles

| Role | Permissions |
|---|---|
| Customer | Browse menu, wishlist, order food, make payments, review items, manage orders |
| Vendor | Manage own menu items, view orders, update order statuses, manage vendor profile |
| Admin | Manage users, vendors, menu items, orders, permissions, and platform operations |

---

## 📂 Project Structure

### Frontend

```text
PizzaHub/
├── app/
│   ├── (auth)/
│   ├── dashboard/
│   ├── menu/
│   ├── login/
│   ├── register/
│   └── ...
├── components/
│   ├── auth/
│   ├── dashboard/
│   ├── header/
│   ├── home/
│   ├── menu/
│   └── ui/
├── lib/
│   ├── actions/
│   ├── api/
│   ├── auth/
│   └── core/
├── types/
├── public/
├── styles/
├── package.json
└── ...
```

### Backend

```text
PizzaHub-Server/
├── routes/
│   └── payments.js
├── index.js
├── package.json
├── .env
└── ...
```

---

## ⚙️ Installation & Setup

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB Atlas account or local MongoDB installation
- Stripe account

### 1. Clone the Frontend Repository

```bash
git clone <frontend-repository-url>
cd PizzaHub
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the frontend root directory.

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
BETTER_AUTH_SECRET=your_auth_secret
BETTER_AUTH_URL=http://localhost:3000
```

Configure the actual environment variables required by your authentication setup.

### 4. Run the Frontend

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:3000
```

---

### 5. Clone the Backend Repository

```bash
git clone <backend-repository-url>
cd PizzaHub-Server
```

### 6. Install Backend Dependencies

```bash
npm install
```

### 7. Configure Backend Environment Variables

Create a `.env` file in the backend root directory.

```env
PORT=5000
FRONTEND_URL=http://localhost:3000

MONGODB_URI=your_mongodb_connection_string
DB_NAME=your_database_name

STRIPE_SECRET_KEY=your_stripe_secret_key
```

Add any additional environment variables required by the backend configuration.

### 8. Start the Backend Server

```bash
npm run dev
```

Or, if your backend uses a different development script:

```bash
node index.js
```

The backend API will be available at:

```text
http://localhost:5000
```

---

## 🔐 Security

PizzaHub follows security practices including:

- Protected routes for authenticated users.
- Role-based access control for Admin, Vendor, and Customer.
- Server-side permission validation.
- Restricted access to administrative operations.
- Authentication verification for protected API requests.
- Secure payment processing through Stripe.
- Environment variables for sensitive configuration.
- Input validation for API requests.
- Unauthorized access handling.

---

## 📱 Responsive Design

PizzaHub is designed to provide a consistent experience across different screen sizes.

- Desktop
- Tablet
- Mobile

The interface adapts to different screen sizes while maintaining usability across customer pages and dashboard interfaces.

---

## 🚀 Future Improvements

- Advanced analytics for vendors and administrators.
- Improved order tracking.
- Promotional discounts and coupon management.
- Enhanced vendor subscription management.
- Notifications for order updates.
- Additional payment methods.
- Advanced menu search and filtering.

---

## 👨‍💻 Developer

Developed as a full-stack web application using modern web technologies, focusing on user experience, secure authentication, role-based management, and efficient food ordering workflows.

---


