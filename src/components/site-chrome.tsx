import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Instagram, Linkedin, Menu, X, Youtube } from "lucide-react";
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

export const WIDE = "mx-auto w-full max-w-[1340px] px-5 sm:px-8 xl:px-0";
export const STD = "mx-auto w-full max-w-[1240px] px-5 sm:px-8 xl:px-0";

export const siteNav = [
  ["Precious Metal", "/precious-metal"],
  ["Fractional Gold", "/fractional-gold"],
  ["Gifting", "/gifting"],
  ["Vault", "/vault"],
  ["About Us", "/about-us"],
  ["Learn", "/learn"],
] as const;


export function GoldRule() {
  return <span className="mt-3 block h-px w-9 bg-gold" />;
}

export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("eyebrow text-gold", className)}>{children}</p>;
}

export function GoldButton({
  children,
  href,
  to,
  type,
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  to?: string;
  type?: "button" | "submit";
  className?: string;
}) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2.5 rounded-[2px] bg-gold px-7 text-sm font-semibold leading-none tracking-[0.01em] text-[#0B2015] transition-colors hover:bg-gold-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
    className,
  );
  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <button type={type ?? "button"} className={classes}>
      {children}
    </button>
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
    <div className="relative bg-forest-deep text-warm-white">
      <div className="relative z-10 flex min-h-[76px] w-full items-center justify-between gap-6 px-5 sm:px-8 lg:min-h-[112px] lg:px-[60px]">
        <Link to="/" aria-label="SQOOT Pure home" className="shrink-0">
          <img src={logoImage} alt="SQOOT Pure" className="h-auto w-[150px] sm:w-[168px] lg:w-[184px]" />
        </Link>
        <nav className="hidden flex-1 items-center justify-center gap-12 lg:flex xl:gap-[54px]" aria-label="Primary navigation">
          {siteNav.map(([label, to]) => (
            <Link
              key={label}
              to={to}
              className="relative flex h-[44px] items-center whitespace-nowrap font-sans text-[14px] font-medium text-warm-white/90 transition-colors duration-300 after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:bg-gold after:transition-[width] after:duration-300 hover:text-gold [&.active]:text-gold [&.active]:after:w-[46px]"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-3">
          <a
            href="#login"
            className="hidden h-[43px] w-[84px] items-center justify-center rounded-[4px] border border-gold/55 bg-transparent font-sans text-[14px] font-medium leading-none text-gold transition-colors duration-300 hover:border-gold hover:bg-gold/10 lg:inline-flex"
          >
            Log In
          </a>
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

      {menuOpen && (
        <nav
          aria-label="Mobile navigation"
          className={cn(
            "border-t border-warm-white/10 lg:hidden",
            variant === "solid" ? "bg-forest-deep" : "bg-forest-deep",
          )}
        >
          <ul className="mx-auto max-w-[1200px] px-6 py-2">
            {siteNav.map(([label, to]) => (
              <li key={label} className="border-b border-warm-white/10 last:border-b-0">
                <Link
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className="block py-4 text-sm font-medium text-warm-white/85 transition-colors hover:text-gold [&.active]:text-gold"
                >
                  {label}
                </Link>
              </li>
            ))}
            <li className="py-4">
              <a
                href="#login"
                onClick={() => setMenuOpen(false)}
                className="inline-flex h-[43px] w-[84px] items-center justify-center rounded-[4px] border border-gold/55 bg-transparent text-sm font-medium leading-none text-gold"
              >
                Log In
              </a>
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

export function SiteFooter() {
  const footerLinks = ["About Us", "Security", "Help", "Contact"];
  const socialIcons = [
    { Icon: Instagram, label: "Instagram" },
    { Icon: Linkedin, label: "LinkedIn" },
    { Icon: Youtube, label: "YouTube" },
  ];

  return (
    <footer className="bg-[#0B2017]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-8 sm:px-6 md:flex-row lg:px-8">
        <Link to="/" aria-label="SQOOT Pure home" className="shrink-0">
          <img src={logoImage} alt="SQOOT Pure" className="h-auto w-[150px]" />
        </Link>

        <nav className="flex items-center gap-4 md:gap-6" aria-label="Footer navigation">
          {footerLinks.map((label, index) => (
            <span key={label} className="flex items-center gap-4 md:gap-6">
              <a
                href="#"
                className="cursor-pointer font-sans text-sm font-normal text-[#EAE4D9] transition-colors hover:text-white"
              >
                {label}
              </a>
              {index < footerLinks.length - 1 && <span className="h-4 w-px bg-[#C9A24D]/40" />}
            </span>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          {socialIcons.map(({ Icon, label }) => (
            <a
              key={label}
              href="#"
              aria-label={label}
              className="cursor-pointer text-[#C9A24D] transition-colors hover:text-[#F4EFE6]"
            >
              <Icon className="h-5 w-5 stroke-[1.5]" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
