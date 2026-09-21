import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";

/**
 * Persistent floating entry point to AURUM, bottom right on every page except
 * AURUM itself and the admin area. Uses the design system's gold gradient
 * treatment (same as the header CTA), keeps clear of the bottom edge and the
 * Intercom messenger, respects safe-area insets and prefers-reduced-motion.
 *
 * The button appears once the visitor has scrolled past the first screen so it
 * never covers hero content (the homepage hero carries its own floating spot
 * card in the same corner) — from then on it stays visible for the page.
 */
export function AurumFloatingButton() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/aurum" || pathname.startsWith("/aurum/") || pathname.startsWith("/admin")) {
    return null;
  }
  if (!visible) return null;

  return (
    <Link
      to="/aurum"
      search={{ range: "1Y", note: undefined, brief: undefined, priceState: undefined }}
      aria-label="AURUM — live gold price"
      className="aurum-fab fixed bottom-[calc(88px+env(safe-area-inset-bottom))] right-5 z-40 inline-flex h-10 items-center justify-center whitespace-nowrap rounded-[4px] border border-gold bg-gradient-to-b from-gold-soft to-gold px-4 font-sans text-[12px] font-semibold leading-none tracking-[0.08em] text-forest-deep shadow-[0_2px_10px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-px hover:from-gold hover:to-gold-dark hover:shadow-[0_4px_14px_rgba(0,0,0,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
    >
      AURUM
    </Link>
  );
}
