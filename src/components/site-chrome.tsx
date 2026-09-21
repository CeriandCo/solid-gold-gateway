import { Link, useRouterState } from "@tanstack/react-router";
import { Fragment, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, CirclePlay, Instagram, Linkedin, Menu, X, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";
import logoImage from "@/assets/sqoot-pure-logo.png";

export function AppleIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M17.05 12.536c-.049-2.744 2.252-4.057 2.353-4.12-1.29-1.868-3.295-2.124-4.002-2.15-1.677-.174-3.298.994-4.158.994-.878 0-2.205-.973-3.634-.945-1.858.029-3.597 1.091-4.55 2.763-1.952 3.369-.504 8.329 1.375 11.043.93 1.33 2.03 2.818 3.474 2.765 1.399-.057 1.925-.9 3.614-.9 1.67 0 2.158.9 3.61.865 1.499-.024 2.45-1.35 3.35-2.69.91-1.31 1.28-2.59 1.298-2.655-.03-.011-2.49-.95-2.53-3.77zm-2.39-6.78c.76-.933 1.274-2.218 1.132-3.506-1.096-.046-2.44.72-3.23 1.65-.703.826-1.32 2.155-1.155 3.438 1.223.095 2.477-.616 3.253-1.582z"
      />
    </svg>
  );
}

export function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M3 20.5V3.5c0-.83.94-1.3 1.6-.82l14.57 8.5c.6.35.6 1.18 0 1.53L4.6 21.32c-.66.48-1.6.01-1.6-.82z"
      />
    </svg>
  );
}

export function AppStoreBadge({ store }: { store: "apple" | "google" }) {
  const isApple = store === "apple";
  return (
    <a
      href="#"
      className="flex items-center gap-2 rounded-sm border border-warm-white/30 bg-warm-white/5 px-3 py-2 text-warm-white transition-colors hover:border-gold hover:text-gold"
    >
      {isApple ? (
        <AppleIcon className="h-5 w-5 shrink-0" />
      ) : (
        <PlayIcon className="h-5 w-5 shrink-0" />
      )}
      <div className="leading-none">
        <p className="text-[0.55rem] opacity-75">
          {isApple ? "Download on the" : "Get it on"}
        </p>
        <p className="mt-0.5 text-[0.75rem] font-medium">
          {isApple ? "App Store" : "Google Play"}
        </p>
      </div>
    </a>
  );
}

export const WIDE = "site-container";
export const STD = "site-container";

export const siteNav = [
  ["Coin", "/precious-metal"],
  ["Fraction", "/fractional-gold"],
  ["Gifting", "/gifting"],
  ["Vault", "/vault"],
  ["Pricing", "/pricing"],
  ["Aurum", "/aurum"],
  ["Learn", "/learn"],
  ["About Us", "/about-us"],
  ["Trust Center", "/trust-center"],
] as const;

export type NavRoute = (typeof siteNav)[number][1];

/** Header grouping: the buy paths (Coin/Fraction live under the Buy menu) first, then editorial and company pages. */
const NAV_PRIMARY = siteNav.slice(0, 5);
const NAV_SECONDARY = siteNav.slice(5);


export function GoldRule() {
  return <span className="mt-3 block h-px w-9 bg-gold" />;
}

export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("eyebrow text-gold", className)}>{children}</p>;
}

/**
 * Shared SQOOT CTA button.
 * variant: "primary" (gold fill) | "secondary" (bordered) | "video" (bordered, play icon)
 *          | "forest" (forest-black fill, compact — pairs with sm/md/lg sizes)
 * size: "hero" (54px, min-width 200px — the default for primary/secondary/video)
 *       | "sm" | "md" | "lg" (compact scale for the forest variant)
 * icon: "arrow" (default) | "play" | "none"
 */
export function GoldButton({
  children,
  href,
  to,
  type,
  variant = "primary",
  size = "hero",
  icon,
  onClick,
  disabled,
  ref,
  target,
  rel,
  "aria-label": ariaLabel,
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  to?: string;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "video" | "forest";
  size?: "hero" | "sm" | "md" | "lg";
  icon?: "arrow" | "play" | "none";
  onClick?: () => void;
  disabled?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
  target?: string;
  rel?: string;
  "aria-label"?: string;
  className?: string;
}) {
  const resolvedIcon = icon ?? (variant === "video" ? "play" : "arrow");
  const classes = cn(
    "group inline-flex items-center justify-center gap-2.5 whitespace-nowrap font-sans font-semibold leading-none tracking-[0.01em] focus-visible:outline-2 focus-visible:outline-gold",
    size === "hero"
      ? "h-[54px] min-w-[200px] rounded-[2px] px-8 text-sm focus-visible:outline-offset-2"
      : size === "sm"
        ? "rounded-[6px] px-[18px] py-2.5 text-[13.5px] focus-visible:outline-offset-[3px]"
        : size === "md"
          ? "rounded-[6px] px-6 py-3.5 text-sm focus-visible:outline-offset-[3px]"
          : "rounded-[6px] px-7 py-4 text-[15px] focus-visible:outline-offset-[3px]",
    variant === "primary"
      ? "bg-gradient-to-b from-gold-soft to-gold text-forest-deep transition-all hover:-translate-y-px hover:from-gold hover:to-gold-dark"
      : variant === "forest"
        ? "bg-forest-black text-paper motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-standard hover:bg-forest-black-deep"
        : "border border-gold/70 bg-transparent text-warm-white transition-all hover:-translate-y-px hover:border-gold hover:bg-gold hover:text-forest-deep",
    disabled && (variant === "forest" ? "cursor-not-allowed opacity-50" : "pointer-events-none opacity-60"),
    className,
  );
  const content = (
    <>
      <span>{children}</span>
      {resolvedIcon === "arrow" ? <ArrowRight size={17} strokeWidth={2.5} aria-hidden="true" className="shrink-0" /> : null}
      {resolvedIcon === "play" ? <CirclePlay size={17} strokeWidth={2} aria-hidden="true" className="shrink-0" /> : null}
    </>
  );
  if (to) {
    return (
      <Link to={to} className={classes} aria-label={ariaLabel} onClick={onClick} ref={ref as React.Ref<HTMLAnchorElement>}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={classes} aria-label={ariaLabel} onClick={onClick} ref={ref as React.Ref<HTMLAnchorElement>}>
        {content}
      </a>
    );
  }
  return (
    <button type={type ?? "button"} className={classes} onClick={onClick} disabled={disabled} aria-label={ariaLabel} ref={ref}>
      {content}
    </button>
  );
}

/**
 * Wraps two CTAs so they share one width on desktop (sized to the wider label)
 * and stack full width on mobile.
 */
export function CtaRow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("cta-row", className)}>{children}</div>;
}

/** One desktop header link; secondary (Explore) items sit slightly dimmer until hovered or active. */
function HeaderLink({ label, to, muted = false }: { label: string; to: NavRoute; muted?: boolean }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: false }}
      className={cn(
        "relative flex h-[44px] items-center whitespace-nowrap font-sans text-[13px] font-medium transition-colors duration-300 after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:bg-gold after:transition-[width] after:duration-300 hover:text-gold xl:text-[14px] [&.active]:text-gold [&.active]:after:w-[46px]",
        muted ? "text-warm-white/70" : "text-warm-white/90",
      )}
    >
      {label}
    </Link>
  );
}

/** Thin vertical hairline shown between each desktop nav item. */
function NavSep() {
  return <span aria-hidden="true" className="h-4 w-px shrink-0 bg-warm-white/15" />;
}

/** "Buy" menu with the two buy paths — Coin (physical coins) and Fraction (fractional gold) — as sub-selections. */
function BuyDropdown() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const buyActive = pathname.startsWith("/precious-metal") || pathname.startsWith("/fractional-gold");

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "relative flex h-[44px] items-center gap-1.5 whitespace-nowrap font-sans text-[13px] font-medium transition-colors duration-300 after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:bg-gold after:transition-[width] after:duration-300 hover:text-gold xl:text-[14px]",
          buyActive || open ? "text-gold after:w-[46px]" : "text-warm-white/90",
        )}
      >
        Buy
        <ChevronDown strokeWidth={2} aria-hidden="true" className={cn("h-3.5 w-3.5 transition-transform duration-300", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute left-1/2 top-full z-50 w-44 -translate-x-1/2 pt-2">
          <div className="border border-warm-white/10 bg-forest-deep py-2 shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
            {NAV_PRIMARY.slice(0, 2).map(([label, to]) => (
              <Link
                key={label}
                to={to}
                activeOptions={{ exact: false }}
                onClick={() => setOpen(false)}
                className="block px-5 py-2.5 font-sans text-[13px] font-medium text-warm-white/85 transition-colors hover:bg-warm-white/5 hover:text-gold [&.active]:text-gold"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Shared SQOOT Pure navbar — single source for every page.
 * variant="overlay" is used on the homepage (transparent, over the hero image);
 * variant="solid" is used on all other pages via SiteHeader.
 */
export function SiteNav({ variant = "solid" }: { variant?: "solid" | "overlay" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className={cn("relative text-warm-white", variant === "solid" ? "bg-forest-deep" : "bg-transparent")}>
      <div className="site-container">
        <div className="relative z-10 flex min-h-[76px] w-full items-center justify-between gap-6 py-2 lg:min-h-[112px] lg:py-5">
          <Link to="/" aria-label="SQOOT Pure home" className="shrink-0">
            <img
              src={logoImage}
              alt="SQOOT Pure"
              width={567}
              height={200}
              className="h-auto w-[200px] sm:w-[230px] lg:w-[210px] xl:w-[250px] min-[1440px]:w-[290px]"
            />
          </Link>
          <nav
            className="hidden flex-1 items-center justify-center lg:flex lg:gap-2 xl:gap-3 min-[1440px]:gap-8"
            aria-label="Primary navigation"
          >
            {NAV_PRIMARY.map(([label, to]) => (
              <HeaderLink key={label} label={label} to={to} />
            ))}
            <span aria-hidden="true" className="h-5 w-px shrink-0 bg-warm-white/15" />
            {NAV_SECONDARY.map(([label, to]) => (
              <HeaderLink key={label} label={label} to={to} muted />
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-3">
            <Link
              to="/early-access"
              className="hidden h-[43px] items-center justify-center whitespace-nowrap rounded-[4px] border border-gold bg-gradient-to-b from-gold-soft to-gold font-sans text-[12px] font-semibold leading-none text-forest-deep shadow-[0_2px_10px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-px hover:from-gold hover:to-gold-dark hover:shadow-[0_4px_14px_rgba(0,0,0,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold lg:inline-flex lg:px-4 xl:px-5 xl:text-[13px] min-[1440px]:px-6"
            >
              Get Early Access
            </Link>
            <button
              type="button"
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded-sm border border-warm-white/25 p-2.5 text-warm-white/80 transition-colors hover:border-gold hover:text-gold lg:hidden"
            >
              {menuOpen ? (
                <X strokeWidth={1.25} className="h-5 w-5" />
              ) : (
                <Menu strokeWidth={1.25} className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <nav aria-label="Mobile navigation" className="border-t border-warm-white/10 bg-forest-deep lg:hidden">
          <ul className="site-container py-2">
            {([["Buy & Vault", NAV_PRIMARY], ["Explore", NAV_SECONDARY]] as const).map(([heading, items]) => (
              <Fragment key={heading}>
                <li aria-hidden="true" className="pt-4 pb-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold/70">{heading}</p>
                </li>
                {items.map(([label, to]) => (
                  <li key={label} className="border-b border-warm-white/10">
                    <Link
                      to={to}
                      activeOptions={{ exact: false }}
                      onClick={() => setMenuOpen(false)}
                      className="block py-3.5 text-sm font-medium text-warm-white/85 transition-colors hover:text-gold [&.active]:text-gold"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </Fragment>
            ))}
            <li className="pt-4 pb-5">
              <Link
                to="/early-access"
                onClick={() => setMenuOpen(false)}
                className="inline-flex h-[43px] items-center justify-center whitespace-nowrap rounded-[4px] border border-gold bg-gradient-to-b from-gold-soft to-gold px-5 text-sm font-semibold leading-none text-forest-deep"
              >
                Get Early Access
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="relative z-30">
      <SiteNav variant="solid" />
    </header>
  );
}

type SiteRoute = "/" | "/terms" | "/privacy" | (typeof siteNav)[number][1];
type FooterLink = { label: string; to?: SiteRoute; href?: string };

/** Footer columns — mirrors the homepage footer, now shared by every page. */
const footerColumns: { heading: string; links: FooterLink[] }[] = [
  {
    heading: "Discover More",
    links: [
      { label: "Buy Gold", to: "/precious-metal" },
      { label: "Fractional", to: "/fractional-gold" },
      { label: "Gifting", to: "/gifting" },
      { label: "Vault", to: "/vault" },
      { label: "AURUM", to: "/aurum" },
      { label: "Learn", to: "/learn" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", to: "/about-us" },
      { label: "Trust Center", to: "/trust-center" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms of Service", to: "/terms" },
      { label: "Data Privacy Policy", to: "/privacy" },
    ],
  },
];

const socialIcons = [
  { Icon: Instagram, label: "Instagram" },
  { Icon: Linkedin, label: "LinkedIn" },
  { Icon: Youtube, label: "YouTube" },
];

/**
 * Shared SQOOT Pure footer — single source for every page.
 * Styled by the `footer.site-footer` block in src/styles.css so that
 * page-scoped stylesheets cannot alter its typography or spacing.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div className="site-footer__brand">
          <Link to="/" aria-label="SQOOT Pure home" className="site-footer__logo-link">
            <img src={logoImage} alt="SQOOT Pure" width={567} height={200} className="site-footer__logo" />
          </Link>
          <p className="site-footer__tagline">
            A compliance-first platform for buying, storing, and redeeming real physical gold.
          </p>
        </div>

        {footerColumns.map((column) => (
          <nav key={column.heading} aria-label={column.heading}>
            <p className="site-footer__heading">{column.heading}</p>
            <ul className="site-footer__list">
              {column.links.map((link) => (
                <li key={link.label}>
                  {link.to ? (
                    <Link to={link.to} className="site-footer__link">
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.href ?? "#"} className="site-footer__link">
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="site-footer__bottom">
        <p className="site-footer__copy">© {year} SQOOT Pure. All rights reserved.</p>
        <div className="site-footer__social">
          {socialIcons.map(({ Icon, label }) => (
            <a key={label} href="#" aria-label={label}>
              <Icon strokeWidth={1.5} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
