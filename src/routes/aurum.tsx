import { SiteFooter, SiteHeader, GoldButton } from "@/components/site-chrome";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type MouseEvent } from "react";

export const Route = createFileRoute("/aurum")({
  head: () => ({
    meta: [
      { title: "AURUM Gold Education | SQOOT Pure" },
      {
        name: "description",
        content: "Free gold education from SQOOT Pure, with clear learning resources and no investment advice.",
      },
      { property: "og:title", content: "AURUM Gold Education | SQOOT Pure" },
      {
        property: "og:description",
        content: "Free, clear gold education published by SQOOT Pure.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AurumPage,
});

const AURUM_LINKS = [
  { label: "Price", id: "price" },
  { label: "Daily Note", id: "daily-note" },
  { label: "Weekly Brief", id: "weekly-brief" },
  { label: "Learn", id: "learn" },
  { label: "Calculator", id: "calculator" },
  { label: "Gifts", id: "gifts" },
  { label: "Community", id: "community" },
] as const;

const SECTION_IDS = ["top", ...AURUM_LINKS.map(({ id }) => id), "subscribe"] as const;

function AurumPage() {
  const subheaderRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const subheader = subheaderRef.current;
    if (!subheader) return;

    const updateHeight = () => {
      document.documentElement.style.setProperty(
        "--aurum-subheader-height",
        `${subheader.getBoundingClientRect().height}px`,
      );
    };

    updateHeight();
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(subheader);

    const hashId = window.location.hash.slice(1);
    if (SECTION_IDS.some((id) => id === hashId)) {
      requestAnimationFrame(() => document.getElementById(hashId)?.scrollIntoView({ behavior: "auto" }));
    }

    return () => {
      resizeObserver.disconnect();
      document.documentElement.style.removeProperty("--aurum-subheader-height");
    };
  }, []);

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (section): section is HTMLElement => Boolean(section),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const topEntry = entries.find((entry) => entry.target.id === "top");
        if (topEntry?.isIntersecting) {
          setActiveSection(null);
          return;
        }

        const visible = entries
          .filter((entry) => entry.isIntersecting && entry.target.id !== "subscribe")
          .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      {
        rootMargin: `-${subheaderRef.current?.getBoundingClientRect().height ?? 56}px 0px -55% 0px`,
        threshold: 0,
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const section = document.getElementById(id);
    if (!section) return;

    window.history.pushState(null, "", `#${id}`);
    section.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <div className="aurum-page">
      <SiteHeader />
      <nav ref={subheaderRef} className="aurum-subheader" aria-label="AURUM sections">
        <div className="aurum-container aurum-subheader__inner">
          <div className="aurum-subheader__brand">
            <a href="#top" onClick={(event) => scrollToSection(event, "top")} className="aurum-wordmark">
              AURUM
            </a>
            <span className="aurum-subheader__divider" aria-hidden="true" />
            <span className="aurum-subheader__descriptor">Free gold education from SQOOT Pure</span>
          </div>

          <div className="aurum-subheader__scroller">
            <ul className="aurum-subheader__links">
              {AURUM_LINKS.map(({ label, id }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    aria-current={activeSection === id ? "location" : undefined}
                    onClick={(event) => scrollToSection(event, id)}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="aurum-subheader__actions">
            <AurumPriceChip state="unavailable" />
            <GoldButton
              href="#subscribe"
              variant="primary"
              size="sm"
              icon="none"
              onClick={() => undefined}
              className="aurum-subscribe-button"
            >
              Subscribe
            </GoldButton>
          </div>
        </div>
      </nav>

      <main className="aurum-main">
        <AurumSection id="top" tone="dark" />
        <AurumSection id="price" tone="dark" />
        <AurumSection id="daily-note" tone="warm" />
        <AurumSection id="weekly-brief" tone="ivory" />
        <AurumSection id="learn" tone="warm" />
        <AurumSection id="calculator" tone="ivory" />
        <AurumSection id="gifts" tone="ivory" />
        <AurumSection id="community" tone="forest" />
        <AurumSection id="subscribe" tone="warm" />
      </main>

      <SiteFooter />
    </div>
  );
}

function AurumSection({ id, tone }: { id: (typeof SECTION_IDS)[number]; tone: "dark" | "forest" | "warm" | "ivory" }) {
  return (
    <section id={id} className={`aurum-section aurum-section--${tone}`} aria-label={id.replaceAll("-", " ")}>
      <div className="aurum-container" />
    </section>
  );
}

function AurumPriceChip({ state }: { state: "loading" | "unavailable" }) {
  return (
    <div className="aurum-price" aria-live="polite" aria-busy={state === "loading"}>
      <span>{state === "loading" ? "Loading price" : "Price unavailable"}</span>
    </div>
  );
}