# PizzaHub - Project Documentation & Agent Guide

## 1. Project Overview
- **Project**: PizzaHub, a modern pizza ordering web application.
- **Stack**: Next.js (App Router), React 19, TypeScript, Tailwind CSS v4, lucide-react.
- **Current Scope**: UI-only (Navbar, Banner, FeatureMenu, Login, Register). No auth API or backend validation yet.

## 2. Theme & Design System
- **Single Source of Truth**: The brand color is defined exclusively in `app/globals.css` via CSS variables (`--brand: #106033`).
- **Theme Tokens**:
  - Light mode (`:root`):
    - `--surface: #ffffff;`
    - `--ink: #14201A;`
    - `--ink-muted: #5F6F66;`
    - `--line: color-mix(in srgb, var(--brand) 18%, white);`
    - `--page-bg: color-mix(in srgb, var(--brand) 6%, white);`
    - `--brand-soft: color-mix(in srgb, var(--brand) 10%, var(--surface));`
    - `--brand-fg: var(--brand);`
  - Dark mode (`.dark`):
    - `--surface: #141D18;`
    - `--ink: #E9F1EC;`
    - `--ink-muted: #9DAEA4;`
    - `--line: #26362D;`
    - `--page-bg: #0C1310;`
    - `--brand-fg: color-mix(in srgb, var(--brand) 45%, white);`
    - `--brand-soft: color-mix(in srgb, var(--brand) 16%, var(--surface));`
- **Dark-Mode Utility Classes**:
  - `bg-surface`: Card/container backgrounds (replaces `bg-white`).
  - `text-ink`: Primary text color on surfaces.
  - `text-ink-muted`: Secondary/muted text color.
  - `border-line`: Structural borders and dividers.
  - `text-brand-fg`: Brand color for text, links, and icons on surfaces.
  - `bg-brand`, `hover:bg-brand-dark`, `text-white`: Main buttons, fills, and CTAs.
  - `bg-page`: Page background.
- **Rule**: NEVER hardcode hex color values in any component (only `bg-white` is allowed on the register image panel so the white-background slice photo blends in). Use theme classes everywhere else.

## 3. Typography, Currency & Interactivity Rules
- **Typography**:
  - `font-heading`: Montserrat (`--font-montserrat`), weights 500, 600, 700, 800.
    - Used for: headings (h1-h6), nav links, button text, badges, labels, brand title, stats, prices.
  - `font-text`: Quicksand (`--font-quicksand`), weights 400, 500, 600, 700.
    - Used for: paragraphs, subtext, taglines, muted descriptions, input placeholders.
- **Currency Rule**:
  - ALWAYS use `formatPrice(amount)` from `src/lib/currency.ts` which renders BDT symbol `৳` formatted to `en-BD` (e.g. `৳599`).
  - Prices in data models/arrays MUST be numbers, never strings containing currency signs.
- **Cursor & Focus-Visible Rule**:
  - Set globally in `globals.css` base layer: all buttons, links, labels, and inputs have `cursor: pointer`.
  - All interactive elements must have `focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand/40`.

## 4. Foodbar Layout Design Notes
- **Navbar (Desktop lg+)**:
  - Fully transparent (`bg-transparent border-none`), `relative z-30 h-20`, sitting in `mx-auto max-w-7xl px-6`.
  - BrandLogo sits at `left-6` in white (`text-white`, `isWhiteOnDesktop`), directly inside the banner's green rectangle.
- **Banner (Desktop lg+)**:
  - Outer wrapper has `-mt-20 pt-20` so the `bg-brand` rectangle starts flush at the very top of the page.
  - Green rectangle: absolutely positioned at `left-6 top-0 w-80 xl:w-96 bottom-0 rounded-b-2xl`.
  - Overlapping pizza: `/images/pizza/hero-pizza.png` with gentle vertical float (`animate-hero-float`), NO rotation.
  - Hero right column: "Cheesy Margherita", description, `formatPrice(599)`, and "Order Now" button.
  - No pagination/slider dots.
- **FeatureMenu (Bottom Cards)**:
  - 4 cards with `bg-brand rounded-2xl min-h-[11rem] p-5 shadow-xl`, with `/images/pizza/menu-pizza.png` overlapping the top-left corner (`-top-10 -left-4`) without clipping (`overflow-visible`).
  - Price at top-right, title/subtitle/rating bottom-left, round cart button bottom-right.

## 5. Final Folder Structure
```
src/
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── page.tsx
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
├── lib/
│   ├── currency.ts
│   └── utils.ts
├── types/
│   └── auth.ts
└── components/
    ├── header/
    │   └── navbar/
    │       ├── Navbar.tsx
    │       ├── brandLogo/
    │       │   └── BrandLogo.tsx
    │       ├── navitems/
    │       │   └── Navitems.tsx
    │       └── navBtn/
    │           ├── NavBtn.tsx
    │           ├── CartBtn.tsx
    │           ├── AuthBtns.tsx
    │           └── ThemeToggle.tsx
    ├── banner/
    │   └── Banner.tsx
    ├── feature-menu/
    │   ├── FeatureMenu.tsx
    │   └── menuCard/
    │       └── MenuCard.tsx
    ├── auth/
    │   ├── AuthLayout.tsx
    │   ├── LoginForm.tsx
    │   ├── RegisterForm.tsx
    │   ├── RoleSelect.tsx
    │   └── SocialButtons.tsx
    └── ui/
        ├── button.tsx
        └── Checkbox.tsx
public/
└── images/
    ├── pizza/
    │   ├── hero-pizza.png
    │   └── menu-pizza.png
    └── auth/
        ├── login.jpg
        └── register.jpg
```

## 6. Done So Far
- [x] Currency system: `formatPrice()` with BDT `৳` implemented across banner and menu cards.
- [x] Navbar: Foodbar-style layout, transparent on desktop with white BrandLogo inside the green rectangle, responsive mobile drawer.
- [x] ThemeToggle: Light/dark mode toggle button with localStorage persistence and no-flash inline script.
- [x] Banner: Exact foodbar layout with full-height top-aligned `bg-brand` rectangle, overlapping floating pizza PNG (no rotation, no slider dots), price block, and Order Now button.
- [x] FeatureMenu: 4 cards with non-clipped overlapping pizza images, BDT prices, titles, ratings, and cart buttons.
- [x] Auth Pages: Login with poster-style pizza image (`login.jpg`, `object-top`), Register with white-background pizza slice (`register.jpg`, `object-contain`), role selection, and custom checkbox.
- [x] Cursor Pointer & Focus Rings: Globally enforced on buttons, links, labels, and inputs.
- [x] Image cleanup: Old images and unused files removed.

## 7. Next TODO
- [ ] Connect Better Auth or backend authentication logic.
- [ ] Implement cart state (Zustand or React Context) and Cart Drawer.
- [ ] Full pizza menu catalog, filters, and product details modal/page.
- [ ] Checkout flow and order tracking.

## 8. Agent Instructions
Read this file first. Do not re-read or rewrite files that are not related to the current task. Make minimal, targeted edits. Do not repeat explanations. Keep replies short.
