import { SiteFooter, SiteHeader, GoldButton } from "@/components/site-chrome";
import aurumHero from "@/assets/aurum/aurum-hero.webp.asset.json";
import priceVelvet from "@/assets/aurum/aurum-price-velvet.png.asset.json";
import factsBackground from "@/assets/aurum/aurum-facts-bg.png.asset.json";
import { AurumPriceSection } from "@/components/aurum-price-section";
import { AurumDailyNoteSection } from "@/components/aurum-daily-note-section";
import { AurumWeeklyBriefSection } from "@/components/aurum-weekly-brief-section";
import { AurumLearnSection } from "@/components/aurum-learn-section";
import { AurumGiftsSection } from "@/components/aurum-gifts-section";
import { isAurumRange, isForcedPriceStatus, type AurumRange, type ForcedPriceStatus } from "@/lib/aurum/price-state";
import { AurumCalculatorSection } from "@/components/aurum-calculator-section";
import { AurumPriceProvider, useAurumPrice } from "@/lib/aurum/use-aurum-price";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type MouseEvent } from "react";

export const Route = createFileRoute("/aurum")({
  validateSearch: (search: Record<string, unknown>) => ({
    range: isAurumRange(search["range"]) ? search["range"] : "1Y" as AurumRange,
    note: typeof search["note"] === "string" ? search["note"] : undefined,
    brief: typeof search["brief"] === "string" ? search["brief"] : undefined,
    priceState: isForcedPriceStatus(search["priceState"]) ? (search["priceState"] as ForcedPriceStatus) : undefined,
  }),
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
    links: [
      { rel: "preload", as: "image", href: aurumHero.url, type: "image/webp" },
      { rel: "preload", as: "image", href: priceVelvet.url, type: "image/png" },
      { rel: "preload", as: "image", href: factsBackground.url, type: "image/png" },
    ],
  }),
  component: AurumPage,
  pendingComponent: AurumPendingPage,
  errorComponent: () => <div role="alert">AURUM price information is temporarily unavailable.</div>,
  notFoundComponent: () => <div role="alert">AURUM price information was not found.</div>,
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

function AurumPendingPage() {
  return (
    <div className="aurum-page">
      <SiteHeader />
      <div className="aurum-subheader" aria-hidden="true" />
      <main>
        <section className="aurum-price-current aurum-price-loading" aria-live="polite" aria-busy="true">
          <div className="aurum-container">
            <p className="aurum-price-eyebrow">TODAY&apos;S GOLD PRICE</p>
            <p>Loading price</p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function AurumPage() {
  const { priceState } = Route.useSearch();
  return (
    <AurumPriceProvider forcedStatus={priceState}>
      <AurumPageContent />
    </AurumPriceProvider>
  );
}

function AurumPageContent() {
  const { range, note: openNote, brief: openBrief } = Route.useSearch();
  const navigate = Route.useNavigate();
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

    const updateActiveSection = () => {
      const offset = (subheaderRef.current?.getBoundingClientRect().height ?? 56) + 8;
      const topSection = document.getElementById("top");
      if (topSection && topSection.getBoundingClientRect().bottom > offset) {
        setActiveSection(null);
        return;
      }

      const linkedSections = AURUM_LINKS.map(({ id }) => document.getElementById(id)).filter(
        (section): section is HTMLElement => Boolean(section),
      );
      const current = linkedSections.find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= offset + 2 && rect.bottom > offset + 2;
      });
      setActiveSection(current?.id ?? null);
    };

    const observer = new IntersectionObserver(
      () => requestAnimationFrame(updateActiveSection),
      {
        rootMargin: `-${subheaderRef.current?.getBoundingClientRect().height ?? 56}px 0px -55% 0px`,
        threshold: 0,
      },
    );

    sections.forEach((section) => observer.observe(section));
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    updateActiveSection();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateActiveSection);
    };
  }, []);

  const scrollToSection = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const section = document.getElementById(id);
    if (!section) return;

    window.history.pushState(null, "", `#${id}`);
    setActiveSection(id === "top" ? null : id);
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
            <AurumPriceChip />
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
        <AurumHero />
        <AurumPriceSection range={range} onRangeChange={(nextRange) => navigate({ search: (previous) => ({ ...previous, range: nextRange }), replace: true })} />
        <AurumDailyNoteSection
          openSlug={openNote ?? null}
          onToggle={(slug) =>
            navigate({ search: (previous) => ({ ...previous, note: slug ?? undefined, brief: undefined }), hash: "daily-note" })
          }
        />
        <AurumWeeklyBriefSection
          openSlug={openBrief ?? null}
          onToggle={(slug) =>
            navigate({ search: (previous) => ({ ...previous, brief: slug ?? undefined, note: undefined }), hash: "weekly-brief" })
          }
        />
        <AurumLearnSection />
        <AurumCalculatorSection />
        <AurumGiftsSection />
        <AurumCommunitySection />
        <AurumSection id="subscribe" tone="warm" />
      </main>

      <SiteFooter />
    </div>
  );
}

function AurumHero() {
  return (
    <section id="top" className="aurum-section aurum-hero" aria-labelledby="aurum-hero-title">
      <img
        className="aurum-hero__image"
        src={aurumHero.url}
        alt="Gold bar, AURUM medallion, book, and glasses on a green marble table"
        width={1586}
        height={992}
        fetchPriority="high"
      />
      <div className="aurum-container aurum-hero__container">
        <div className="aurum-hero__content">
          <p className="aurum-hero__eyebrow">THE AURUM BOARD</p>
          <h1 id="aurum-hero-title" className="aurum-hero__title">
            Understand gold before you own it.
          </h1>
          <div className="aurum-hero__ornament" aria-hidden="true">
            <span />
            <i />
            <span />
          </div>
          <p className="aurum-hero__dek">
            Facts, history and plain explanations of physical gold. AURUM is free, does not sell, and never gives advice.
          </p>
          <div className="aurum-hero__actions">
            <GoldButton href="#price" variant="primary" size="hero" icon="none" className="aurum-hero__button">
              See today&apos;s price <span aria-hidden="true">↓</span>
            </GoldButton>
            <GoldButton href="#learn" variant="secondary" size="hero" icon="none" className="aurum-hero__button aurum-hero__button--secondary">
              Start with the basics
            </GoldButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function AurumSection({ id, tone }: { id: (typeof SECTION_IDS)[number]; tone: "dark" | "forest" | "warm" | "ivory" }) {
  return (
    <section id={id} className={`aurum-section aurum-section--${tone}`} aria-label={id.replaceAll("-", " ")}>
      <div className="aurum-container" />
    </section>
  );
}

function AurumPriceChip() {
  const { state, data, showLiveBadge } = useAurumPrice();
  const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  return (
    <div className="aurum-price" aria-live="polite">
      {state.status === "loading" ? <span>Loading price</span> : null}
      {showLiveBadge ? <span className="aurum-live-badge">LIVE</span> : null}
      {state.status === "stale" ? <span className="aurum-stale-badge">DELAYED</span> : null}
      {data ? <span>{money(data.spot)}</span> : null}
      {state.status === "unavailable" ? <span>Price unavailable</span> : null}
    </div>
  );
}