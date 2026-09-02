import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
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
  ["Home", "/"],
  ["Precious Metal", "/precious-metal"],
  ["Fractional Gold", "/fractional-gold"],
  ["Vault", "/vault"],
  ["Gifting", "/gifting"],
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

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="relative z-30 bg-forest text-[#F8F5F1]">
      <div className={cn(WIDE, "flex h-[84px] items-center gap-6 lg:h-[112px]")}>
        <Link to="/" aria-label="SQOOT Pure home" className="shrink-0">
          <img src={logoImage} alt="SQOOT Pure" className="h-auto w-[160px] lg:w-[200px]" />
        </Link>
        <nav className="ml-auto hidden items-center gap-[38px] lg:flex" aria-label="Primary navigation">
          {siteNav.map(([label, to]) => (
            <Link
              key={label}
              to={to}
              className="text-[15px] font-medium leading-none text-[#F8F5F1] transition-colors hover:text-gold-soft focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold [&.active]:text-gold-soft"
            >
              {label}
            </Link>
          ))}
        </nav>
        <GoldButton
          href="/vault#early-access"
          className="ml-[38px] hidden h-12 w-[186px] whitespace-nowrap bg-gradient-to-b from-gold-soft to-gold text-[15px] font-bold lg:inline-flex"
        >
          Get Early Access
        </GoldButton>
        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
          className="ml-auto grid h-11 w-11 place-items-center rounded-[2px] border border-white/25 lg:hidden"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {menuOpen && (
        <nav aria-label="Mobile navigation" className="border-t border-white/10 px-5 py-3 lg:hidden">
          {siteNav.map(([label, to]) => (
            <Link
              key={label}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="block border-b border-white/10 py-3 text-sm font-medium"
            >
              {label}
            </Link>
          ))}
          <GoldButton href="/vault#early-access" className="mt-4 flex h-12 w-full">
            Get Early Access
          </GoldButton>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-forest py-8 text-[#F8F5F1] lg:py-0">
      <div className={cn(STD, "grid items-center gap-6 lg:h-[122px] lg:grid-cols-[auto_1fr_auto]")}>
        <img src={logoImage} alt="SQOOT Pure" className="h-auto w-[150px]" />
        <nav className="flex flex-wrap gap-x-8 gap-y-3 lg:justify-center" aria-label="Footer navigation">
          {siteNav.map(([label, to]) => (
            <Link key={label} to={to} className="text-[13px] font-medium leading-none hover:text-gold-soft">
              {label}
            </Link>
          ))}
        </nav>
        <div className="text-[13px] leading-[1.6] lg:text-right">
          <p>© 2024 Fortress Gold Inc. All rights reserved.</p>
          <p className="mt-1.5 flex gap-6 lg:justify-end">
            <a href="#privacy" className="text-gold-soft hover:underline">
              Privacy Policy
            </a>
            <a href="#terms" className="text-gold-soft hover:underline">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
