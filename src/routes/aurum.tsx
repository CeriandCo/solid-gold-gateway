import { SiteFooter, SiteHeader, GoldButton } from "@/components/site-chrome";
import aurumHero from "@/assets/aurum/aurum-hero.webp.asset.json";
import { AurumPriceSection } from "@/components/aurum-price-section";
import { AurumWeeklyBriefSection } from "@/components/aurum-weekly-brief-section";
import { AurumLearnSection } from "@/components/aurum-learn-section";
import { AurumGiftsSection } from "@/components/aurum-gifts-section";
import { AurumSubscribeSection } from "@/components/aurum-subscribe-section";
import { AurumFloatingNav } from "@/components/aurum-floating-nav";
import { InnerPageHero } from "@/components/inner-page-hero";

import { isAurumRange, isForcedPriceStatus, type AurumRange, type ForcedPriceStatus } from "@/lib/aurum/price-state";
import { AurumCalculatorSection } from "@/components/aurum-calculator-section";
import { AurumPriceProvider } from "@/lib/aurum/use-aurum-price";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { fetchEditorialPage } from "@/lib/aurum-editorial.functions";
import { fetchMeltConsentNotice } from "@/lib/newsletter.functions";
import { useEffect, useState } from "react";

const BRIEF_LIMIT = 12;

export const Route = createFileRoute("/aurum")({
  validateSearch: (search: Record<string, unknown>) => ({
    range: isAurumRange(search["range"]) ? search["range"] : "1Y" as AurumRange,
    brief: typeof search["brief"] === "string" ? search["brief"] : undefined,
    priceState: isForcedPriceStatus(search["priceState"]) ? (search["priceState"] as ForcedPriceStatus) : undefined,
  }),
  loaderDeps: ({ search }) => ({ brief: search.brief ?? null }),
  loader: async ({ deps }) => {
    // Editorial content is server-rendered so there is no loading flash.
    // A read failure degrades the Weekly Brief section only; the rest of the page still renders.
    const [briefs, consentNotice] = await Promise.all([
      fetchEditorialPage({
        data: { type: "weekly_brief", limit: BRIEF_LIMIT, offset: 0, includeSlug: deps.brief },
      }).catch(() => null),
      // The consent wording the MELT form shows. Null while signup is disabled.
      fetchMeltConsentNotice().catch(() => null),
    ]);
    // A deep link to a post far past the capped expansion opens that post's own page.
    if (briefs?.deepLinkOverflow && deps.brief) {
      throw redirect({ to: "/aurum/briefs/$slug", params: { slug: deps.brief } });
    }
    return { briefs: briefs ? briefs.items : null, consentNotice };
  },

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
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [
      { rel: "preload", as: "image", href: aurumHero.url, type: "image/webp" },
    ],
  }),
  component: AurumPage,
  pendingComponent: AurumPendingPage,
  errorComponent: () => <div role="alert">AURUM price information is temporarily unavailable.</div>,
  notFoundComponent: () => <div role="alert">AURUM price information was not found.</div>,
});

function AurumPendingPage() {
  return (
    <div className="aurum-page">
      <SiteHeader />
      <main>
        <section className="aurum-price-current aurum-price-loading" aria-live="polite" aria-busy="true">
          <div className="site-container">
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
  const { range, brief: openBrief } = Route.useSearch();
  const { briefs, consentNotice } = Route.useLoaderData();
  const [selectedRange, setSelectedRange] = useState<AurumRange>(range);
  const [expandedBrief, setExpandedBrief] = useState<string | null>(openBrief ?? null);

  useEffect(() => {
    setSelectedRange(range);
  }, [range]);

  useEffect(() => {
    setExpandedBrief(openBrief ?? null);
  }, [openBrief]);

  const navigate = useNavigate({ from: Route.fullPath });

  // Range selection is an in-section control, never navigation. The choice is
  // recorded in the URL through the router with replace + resetScroll false, and
  // with hashScrollIntoView disabled: when the visitor arrived through the
  // "#price" anchor, any location change that keeps the hash would otherwise make
  // the router re-scroll to the price section.
  const changeRange = (nextRange: AurumRange) => {
    setSelectedRange(nextRange);
    void navigate({
      search: (prev) => ({ ...prev, range: nextRange }),
      hash: (prev) => prev ?? "",
      replace: true,
      resetScroll: false,
      hashScrollIntoView: false,
    });
  };



  return (
    <div className="aurum-page">
      <SiteHeader />

      <main className="aurum-main">
        <AurumHero />
        <AurumPriceSection
          range={selectedRange}
          onRangeChange={changeRange}
        />
        <AurumWeeklyBriefSection
          briefs={briefs}
          openSlug={expandedBrief}
          onToggle={(slug) => setExpandedBrief(slug)}
        />
        <AurumLearnSection />
        <AurumCalculatorSection />
        <AurumGiftsSection />

        <AurumSubscribeSection consentNotice={consentNotice} />
      </main>

      <AurumFloatingNav />
      <SiteFooter />
    </div>
  );
}

function AurumHero() {
  return (
    <InnerPageHero
      id="top"
      titleId="aurum-hero-title"
      eyebrow="THE AURUM BOARD"
      title="Understand gold before you own it."
      body={<>Facts, history and plain explanations of physical gold. AURUM is free, does not sell, and never gives advice.</>}
      imageSrc={aurumHero.url}
      imageAlt="Gold bar, AURUM medallion, book, and glasses on a green marble table"
      actions={
        <>
          <GoldButton href="#price" variant="primary" size="hero" icon="none">
            See today&apos;s price <span aria-hidden="true">↓</span>
          </GoldButton>
          <GoldButton href="#learn" variant="secondary" size="hero" icon="none">
            Start with the basics
          </GoldButton>
        </>
      }
    />
  );
}