import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import mandala from "@/assets/sqoot-pure-mandala.png.asset.json";

/**
 * Persistent floating entry point to AURUM, bottom right on every page except
 * AURUM itself and the admin area. Shares the AURUM section navigator's
 * mandala, forest surface and gold border, while keeping clear of the bottom
 * edge and Intercom messenger.
 *
 * The link appears after the visitor starts exploring the page and stays
 * visible from then on.
 */
export function AurumFloatingButton() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 180);
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
      search={{ range: "1Y", brief: undefined, priceState: undefined }}
      aria-label="Open AURUM gold price and insights"
      className="aurum-fab"
    >
      <img className="aurum-fab__mark" src={mandala.url} alt="" aria-hidden="true" />
      <span className="aurum-fab__copy">
        <span className="aurum-fab__title">AURUM</span>
        <span className="aurum-fab__subtitle">Gold price &amp; insights</span>
      </span>
      <ArrowRight className="aurum-fab__arrow" aria-hidden="true" strokeWidth={1.8} />
    </Link>
  );
}
