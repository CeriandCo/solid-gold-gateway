import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";

export const Route = createFileRoute("/partner-terms")({
  head: () => ({
    meta: [
      { title: "Partner Program Terms — SQOOT Pure" },
      { name: "description", content: "SQOOT Pure Partner Program Terms." },
      { property: "og:title", content: "Partner Program Terms — SQOOT Pure" },
      { property: "og:description", content: "SQOOT Pure Partner Program Terms." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PartnerTermsPage,
});

function PartnerTermsPage() {
  return (
    <main className="bg-cream text-ink">
      <SiteHeader />
      <section className="site-container py-24">
        <h1 className="font-serif text-5xl font-semibold text-forest-deep">Partner Program Terms</h1>
        <p className="mt-6 font-sans text-base">Coming soon.</p>
      </section>
      <SiteFooter />
    </main>
  );
}
