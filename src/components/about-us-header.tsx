import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

function GeometricLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="44" height="44" stroke="currentColor" strokeWidth="2" />
      <path
        d="M14 10h20M14 10v12M34 10v12M14 22h12M26 22v16M14 34h12M34 22v12M34 34H24"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  );
}

const navLinks = [
  { label: "ABOUT SQOOT PURE", href: "#about" },
  { label: "HOW IT WORKS", href: "#how-it-works" },
  { label: "OWNERSHIP PATHS", href: "#ownership-paths" },
  { label: "TRUST & COMPLIANCE", href: "#trust" },
  { label: "FAQ", href: "#faq" },
] as const;

export function AboutUsHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0B2017]">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 lg:px-12">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-4">
          <GeometricLogo className="h-10 w-10 text-[#C9A24D] md:h-12 md:w-12" />
          <div className="flex flex-col">
            <span className="text-lg font-medium uppercase tracking-[0.15em] text-[#C9A24D] md:text-xl">
              SQOOT PURE
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#C9A24D] md:text-[10px]">
              PURE OWNERSHIP. REAL GOLD.
            </span>
          </div>
        </Link>

        {/* Right: Desktop Navigation */}
        <nav
          className="hidden items-center gap-8 lg:flex xl:gap-12"
          aria-label="About Us navigation"
        >
          {navLinks.map((link, index) => {
            const isActive = index === 0;
            return (
              <a
                key={link.label}
                href={link.href}
                className={cn(
                  "relative flex flex-col items-center text-xs font-semibold uppercase tracking-[0.15em] text-[#F4EFE6] transition-colors hover:text-[#C9A24D]",
                  isActive && "text-[#C9A24D]"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-2 h-[2px] w-full bg-[#C9A24D]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-sm border border-[#C9A24D]/30 p-2 text-[#F4EFE6] transition-colors hover:border-[#C9A24D] hover:text-[#C9A24D] lg:hidden"
        >
          {mobileOpen ? (
            <X strokeWidth={1.5} className="h-5 w-5" />
          ) : (
            <Menu strokeWidth={1.5} className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <nav
          aria-label="Mobile About Us navigation"
          className="border-t border-[#C9A24D]/10 lg:hidden"
        >
          <ul className="mx-auto max-w-[1600px] px-6 py-4 lg:px-12">
            {navLinks.map((link, index) => {
              const isActive = index === 0;
              return (
                <li key={link.label} className="border-b border-[#C9A24D]/10 last:border-b-0">
                  <a
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block py-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#F4EFE6] transition-colors hover:text-[#C9A24D]",
                      isActive && "text-[#C9A24D]"
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
