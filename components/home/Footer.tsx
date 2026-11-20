// Footer — site-wide footer with logo, nav links, contact info, and social icons.
import Link from "next/link"
import { Pizza, Mail, Phone, MapPin } from "lucide-react"

// Navigation links
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Browse Menu", href: "/menu" },
  { label: "Sign In", href: "/login" },
  { label: "Sign Up", href: "/register" },
]

// Contact details
const CONTACT = [
  { icon: Mail, text: "hello@pizzahub.com", href: "mailto:hello@pizzahub.com" },
  { icon: Phone, text: "+880 1800-PIZZA", href: "tel:+8801800749992" },
  {
    icon: MapPin,
    text: "Dhaka, Bangladesh",
    href: "https://maps.google.com/?q=Dhaka",
  },
]

// Social icon components — using SVG paths for the official logos
const SocialX = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const SocialFacebook = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.03 4.388 11.03 10.125 11.927v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796v8.437C19.612 23.103 24 18.103 24 12.073z" />
  </svg>
)

const SocialInstagram = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
)

// Social links config
const SOCIAL_LINKS = [
  { label: "X (Twitter)", href: "https://x.com/pizzahub", Icon: SocialX },
  {
    label: "Facebook",
    href: "https://facebook.com/pizzahub",
    Icon: SocialFacebook,
  },
  {
    label: "Instagram",
    href: "https://instagram.com/pizzahub",
    Icon: SocialInstagram,
  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line bg-surface transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Top grid: brand, nav, contact */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand column */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white shadow-md shadow-brand/25">
                <Pizza className="h-5 w-5" />
              </span>
              <span className="font-heading text-xl font-extrabold tracking-tight text-ink">
                Pizza<span className="text-brand-fg">Hub</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs font-text text-sm leading-relaxed text-ink-muted">
              Connecting you with the best local pizza shops. Fresh ingredients,
              fast delivery, every time.
            </p>
            {/* Social icons */}
            <div className="mt-6 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-page text-ink-muted transition-colors hover:border-brand/40 hover:bg-brand-soft hover:text-brand-fg"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links column */}
          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-ink">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="font-text text-sm text-ink-muted transition-colors hover:text-brand-fg"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-ink">
              Contact
            </h3>
            <ul className="mt-4 space-y-3">
              {CONTACT.map(({ icon: Icon, text, href }) => (
                <li key={text}>
                  <a
                    href={href}
                    className="inline-flex items-center gap-2.5 font-text text-sm text-ink-muted transition-colors hover:text-brand-fg"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-brand-fg" />
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar: copyright */}
        <div className="mt-10 border-t border-line pt-6 text-center">
          <p className="font-text text-xs text-ink-muted">
            &copy; {year} PizzaHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
