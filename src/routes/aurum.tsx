import { SiteFooter, SiteHeader, GoldButton } from "@/components/site-chrome";
import aurumHero from "@/assets/aurum/aurum-hero.webp.asset.json";
import priceVelvet from "@/assets/aurum/aurum-price-velvet.png.asset.json";
import factsBackground from "@/assets/aurum/aurum-facts-bg.png.asset.json";
import { AurumPriceSection } from "@/components/aurum-price-section";
import { AurumDailyNoteSection } from "@/components/aurum-daily-note-section";
import { AurumWeeklyBriefSection } from "@/components/aurum-weekly-brief-section";
import { AurumLearnSection } from "@/components/aurum-learn-section";
import { AurumGiftsSection } from "@/components/aurum-gifts-section";
import { AurumSubscribeSection } from "@/components/aurum-subscribe-section";
import { AurumFloatingNav } from "@/components/aurum-floating-nav";

import { isAurumRange, isForcedPriceStatus, type AurumRange, type ForcedPriceStatus } from "@/lib/aurum/price-state";
import { AurumCalculatorSection } from "@/components/aurum-calculator-section";
import { AurumPriceProvider } from "@/lib/aurum/use-aurum-price";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { fetchEditorialPage } from "@/lib/aurum-editorial.functions";
import { useEffect } from "react";

const NOTE_PAGE_SIZE = 3;
const BRIEF_LIMIT = 12;

export const Route = createFileRoute("/aurum")({
  validateSearch: (search: Record<string, unknown>) => ({
    range: isAurumRange(search["range"]) ? search["range"] : "1Y" as AurumRange,
    note: typeof search["note"] === "string" ? search["note"] : undefined,
    brief: typeof search["brief"] === "string" ? search["brief"] : undefined,
    priceState: isForcedPriceStatus(search["priceState"]) ? (search["priceState"] as ForcedPriceStatus) : undefined,
  }),
  loaderDeps: ({ search }) => ({ note: search.note ?? null, brief: search.brief ?? null }),
  loader: async ({ deps }) => {
    // Editorial content is server-rendered so there is no loading flash.
    // A read failure degrades the two sections only; the rest of the page still renders.
    const [notes, briefs] = await Promise.all([
      fetchEditorialPage({
        data: { type: "daily_note", limit: NOTE_PAGE_SIZE, offset: 0, includeSlug: deps.note },
      }).catch(() => null),
      fetchEditorialPage({
        data: { type: "weekly_brief", limit: BRIEF_LIMIT, offset: 0, includeSlug: deps.brief },
      }).catch(() => null),
    ]);
    // A deep link to a post far past the capped expansion opens that post's own page.
    if (notes?.deepLinkOverflow && deps.note) {
      throw redirect({ to: "/aurum/notes/$slug", params: { slug: deps.note } });
    }
    if (briefs?.deepLinkOverflow && deps.brief) {
      throw redirect({ to: "/aurum/briefs/$slug", params: { slug: deps.brief } });
    }
    return { notes, briefs: briefs ? briefs.items : null };
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
      { rel: "preload", as: "image", href: priceVelvet.url, type: "image/png" },
      { rel: "preload", as: "image", href: factsBackground.url, type: "image/png" },
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
  const { notes, briefs } = Route.useLoaderData();
  const navigate = Route.useNavigate();

  useEffect(() => {
    // Shared links (?note=slug / ?brief=slug) land on the open row once on load.
    // Interactive toggles never scroll — they pass resetScroll: false instead.
    const openSlug = openNote ?? openBrief;
    if (openSlug) {
      const kind = openNote ? "note" : "brief";
      requestAnimationFrame(() => {
        document
          .querySelector<HTMLElement>(`[aria-controls="aurum-${kind}-panel-${openSlug}"]`)
          ?.scrollIntoView({ behavior: "auto", block: "start" });
      });
    }

  }, []);

  return (
    <div className="aurum-page">
      <SiteHeader />

      <main className="aurum-main">
        <AurumHero />
        <AurumPriceSection
          range={range}
          onRangeChange={(nextRange) =>
            navigate({ search: (previous) => ({ ...previous, range: nextRange }), replace: true, resetScroll: false })
          }
        />
        <AurumDailyNoteSection
          initial={notes}
          openSlug={openNote ?? null}
          onToggle={(slug) =>
            navigate({
              search: (previous) => ({ ...previous, note: slug ?? undefined, brief: undefined }),
              resetScroll: false,
            })
          }
        />
        <AurumWeeklyBriefSection
          briefs={briefs}
          openSlug={openBrief ?? null}
          onToggle={(slug) =>
            navigate({
              search: (previous) => ({ ...previous, brief: slug ?? undefined, note: undefined }),
              resetScroll: false,
            })
          }
        />
        <AurumLearnSection />
        <AurumCalculatorSection />
        <AurumGiftsSection />

        <AurumSubscribeSection />
      </main>

      <AurumFloatingNav />
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