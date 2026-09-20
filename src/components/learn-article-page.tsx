import { useReveal } from "@/hooks/use-reveal";
import { GoldButton, GoldRule, SiteFooter, SiteHeader, WIDE } from "@/components/site-chrome";
import { Fragment } from "react";
import type { PublishedLearnArticle } from "@/lib/learn-articles";

export function LearnArticlePage({ article }: { article: PublishedLearnArticle }) {
  const scope = useReveal<HTMLDivElement>();
  return (
    <div ref={scope} className="flex min-h-screen flex-col bg-warm-white">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-forest-deep py-16 text-warm-white sm:py-20 lg:py-24">
          <div className={WIDE}><div className="max-w-[720px]">
            <p className="eyebrow text-gold mb-4">Learn</p>
            <h1 className="font-display text-3xl font-medium leading-[1.08] tracking-[-0.02em] sm:text-4xl lg:text-[2.75rem]">{article.title}</h1>
          </div></div>
        </section>
        <article className="mx-auto max-w-[720px] px-5 py-14 sm:py-18 lg:py-22">
          {article.blocks.map((block, index) => {
            if (block.type === "h2") return <Fragment key={index}><GoldRule /><h2 className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">{block.text}</h2></Fragment>;
            if (block.type === "h3") return <Fragment key={index}><GoldRule /><h3 className="font-display mt-12 text-xl font-medium leading-[1.15] tracking-[-0.01em] text-forest-deep sm:text-2xl">{block.text}</h3></Fragment>;
            if (block.type === "ul") return <ul key={index} className="body-copy leading-relaxed mt-5 list-disc space-y-3 pl-6 text-charcoal/90">{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
            if (block.type === "blockquote") return <blockquote key={index} className="mt-6 border-l-4 border-gold bg-cream/60 py-5 pr-6 pl-6"><p className="font-display text-xl font-medium italic leading-[1.25] tracking-[-0.01em] text-forest-deep sm:text-2xl">{block.text}</p></blockquote>;
            return <p key={index} className={`body-copy leading-relaxed text-charcoal/90${index > 0 ? " mt-6" : ""}`}>{block.text}</p>;
          })}
        </article>
        <section className="bg-forest-deep py-14 text-warm-white sm:py-18"><div className={WIDE}><div data-reveal className="mx-auto max-w-[720px] text-center">
          <p className="eyebrow text-gold mb-4">Get early access</p>
          <h2 className="font-display text-2xl font-medium leading-[1.1] tracking-[-0.015em] sm:text-3xl">Join the SQOOT Pure waitlist</h2>
          <p className="body-copy mx-auto mt-5 max-w-[600px] text-warm-white/80">Be among the first to explore fractional physical gold ownership when SQOOT Pure launches.</p>
          <div className="mt-8"><GoldButton to="/early-access">Join the SQOOT Pure waitlist</GoldButton></div>
          <p className="compact-copy mt-10 text-warm-white/60">{article.disclaimer}</p>
        </div></div></section>
      </main>
      <SiteFooter />
    </div>
  );
}
