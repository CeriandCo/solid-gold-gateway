import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties, type HTMLAttributes } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChartNoAxesCombined,
  CircleDollarSign,
  Globe2,
  Landmark,
  PieChart,
  Play,
  Presentation,
  Shield,
  ShieldCheck,
  Umbrella,
} from "lucide-react";
import { GoldButton, SiteFooter, SiteHeader } from "@/components/site-chrome";
import bandGold from "@/assets/band-gold.jpg";
import laptop from "@/assets/walkthrough-laptop.jpg";
import phoneHand from "@/assets/knowledge-phone-hand.jpg.asset.json";
import confidenceGoldBar from "@/assets/knowledge-confidence-gold-bar.png.asset.json";
import coupleBench from "@/assets/knowledge-couple-bench.jpg.asset.json";
import goldNugget from "@/assets/knowledge-gold-nugget.jpg.asset.json";
import cinematicGold from "@/assets/knowledge-cinematic-gold.jpg.asset.json";
import buyingGuide from "@/assets/knowledge-buying-guide.jpg.asset.json";
import investingBars from "@/assets/knowledge-investing-bars.jpg.asset.json";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Knowledge Center — Gold Education | SQOOT Pure" },
      { name: "description", content: "Explore clear, trusted education on gold ownership, performance, safety and long-term value from SQOOT Pure." },
      { property: "og:title", content: "Knowledge Center — Gold Education | SQOOT Pure" },
      { property: "og:description", content: "Clear, trusted education on gold ownership, performance and long-term value." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: KnowledgeCenterPage,
});

function GlobeCoinIcon(props: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className="kc-globe-coin" {...props}>
      <Globe2 aria-hidden="true" />
      <CircleDollarSign aria-hidden="true" />
    </span>
  );
}

const benefits = [
  { label: "Inflation Hedge", icon: Shield },
  { label: "Portfolio Diversifier", icon: PieChart },
  { label: "Long-term Value", icon: Presentation },
  { label: "Global Liquidity", icon: GlobeCoinIcon },
  { label: "Tangible Asset", icon: Landmark },
  { label: "Crisis Protection", icon: Umbrella },
] as const;

const articles = [
  { title: "HOW TO OWN GOLD ONLINE", copy: "Gold can be digitally bought, stored and sold.", image: phoneHand.url, alt: "A hand holding a phone displaying a gold ownership interface" },
  { title: "CONFIDENCE IN GOLD", copy: "Principles and guidance for trust and safety when investing in gold.", image: confidencePhone.url, alt: "A hand holding a phone displaying a gold ownership interface" },
  { title: "GOLD OVER THE LONG AND SHORT TERM", copy: "Easily bought today, investing in gold could help you in the future.", image: coupleBench.url, alt: "A couple sitting together on a park bench" },
] as const;

const returnPoints = [
  <>Since 1971, gold's return has been similar to equities and outperformed bonds. <sup>[1]</sup></>,
  <>In the last 20 years, gold outperformed most major asset classes. <sup>[2]</sup></>,
  <>In the last 20 years, gold's global investment demand increased by an average of 10% per year. <sup>[3]</sup></>,
  <>Through its dual nature as a consumer good and investment, gold has historically preserved its value. Unlike fiat currencies, gold cannot be printed, only mined—this helps explain why it has consistently outperformed major fiat currencies. <sup>[4]</sup></>,
];

const chartData = [
  ["US Cash", 1.3], ["US Treasuries", 2.1], ["Global stocks", 6.6], ["US stocks", 8.6],
  ["EM Stocks", 4.1], ["Commodities", 5.0], ["Gold", 10.6],
] as const;

function useReveals() {
  const rootRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.add("kc-reveal-ready");
    const nodes = [...root.querySelectorAll<HTMLElement>("[data-kc-reveal]")];
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.14 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  return rootRef;
}

function KnowledgeCenterPage() {
  const rootRef = useReveals();
  const [activeBenefit, setActiveBenefit] = useState(0);
  const [period, setPeriod] = useState("20yr");
  const moveBenefit = (direction: number) => setActiveBenefit((current) => (current + direction + benefits.length) % benefits.length);

  return (
    <main ref={rootRef} id="top" className="knowledge-center-page">
      <SiteHeader />

      <section className="kc-hero">
        <div className="kc-container kc-hero-inner">
          <div className="kc-hero-text">
            <h1 className="kc-display">Gold.</h1>
            <p className="kc-hero-copy">It's famous for being a <em>'safe haven'</em> investment thanks to years of strong performance in both good and bad economic times.</p>
            <span className="kc-gold-rule" aria-hidden="true" />
            <p className="kc-body">Discover how investing in gold today could be the first step on your financial journey.</p>
            <a href="#benefits" className="kc-circle-control" aria-label="Explore the Knowledge Center"><ArrowDown aria-hidden="true" /></a>
          </div>
          <div className="kc-hero-media">
            <img src={bandGold} alt="Macro detail of polished physical gold bars" width={1400} height={800} fetchPriority="high" />
            <span className="kc-media-vignette" aria-hidden="true" />
            <button type="button" className="kc-play" aria-label="Preview the introduction to gold"><Play aria-hidden="true" /></button>
          </div>
        </div>
      </section>

      <div className="kc-disclaimer"><div className="kc-container"><a href="#disclaimer"><ShieldCheck aria-hidden="true" />Important Disclaimer: Please Read</a></div></div>

      <section id="benefits" className="kc-section kc-benefits" data-kc-reveal>
        <div className="kc-container kc-benefits-layout">
          <div className="kc-benefits-intro">
            <h2 className="kc-section-title">Discover more of gold's potential benefits</h2>
            <a href="#articles" className="kc-text-link">Learn about gold's qualities <ArrowRight aria-hidden="true" /></a>
            <div className="kc-benefit-controls">
              <button type="button" onClick={() => moveBenefit(-1)} aria-label="Previous gold benefit"><ArrowLeft /></button>
              <span aria-live="polite">{activeBenefit + 1} of 6</span>
              <button type="button" onClick={() => moveBenefit(1)} aria-label="Next gold benefit"><ArrowRight /></button>
            </div>
          </div>
          <div className="kc-benefit-grid">
            {benefits.map(({ label, icon: Icon }, index) => (
              <article key={label} className={index === activeBenefit ? "is-active" : ""} style={{ "--kc-index": index } as CSSProperties}>
                <Icon aria-hidden="true" />
                <h3>{label}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="articles" className="kc-section kc-articles">
        <div className="kc-container kc-article-grid">
          {articles.map((article, index) => (
            <article className="kc-article-card" data-kc-reveal key={article.title} style={{ "--kc-index": index } as CSSProperties}>
              <div className="kc-article-image"><img src={article.image} alt={article.alt} width={1408} height={912} loading="lazy" /></div>
              <div className="kc-article-copy"><h2>{article.title}</h2><p>{article.copy}</p><a href="#resources">Learn More <ArrowRight aria-hidden="true" /></a></div>
            </article>
          ))}
        </div>
      </section>

      <section className="kc-section kc-returns"><div className="kc-container kc-returns-panel" data-kc-reveal>
        <div className="kc-returns-copy">
          <span className="kc-label">Returns</span>
          <h2 className="kc-section-title">A proven asset with competitive returns</h2>
          <ul>{returnPoints.map((point, i) => <li key={i}><span><ShieldCheck aria-hidden="true" /></span><p>{point}</p></li>)}</ul>
          <a className="kc-dark-link" href="#performance-chart">See More <ArrowRight aria-hidden="true" /></a>
        </div>
        <div id="performance-chart" className="kc-chart-panel">
          <div className="kc-tabs" role="tablist" aria-label="Gold performance period">
            {["20yr", "10yr", "5yr", "3yr", "1yr"].map((tab) => <button key={tab} type="button" role="tab" aria-selected={period === tab} onClick={() => setPeriod(tab)}>{tab}</button>)}
          </div>
          {period === "20yr" ? <div className="kc-chart" role="tabpanel">
            <h3>CAGR (%)</h3>
            <div className="kc-bars">{chartData.map(([name, value]) => <div className={`kc-bar-row ${name === "Gold" ? "is-gold" : ""}`} key={name}><span>{name}</span><div><i style={{ "--bar-width": `${(value / 35 * 100).toFixed(3)}%` } as CSSProperties} /></div><b>{value.toFixed(1)}</b></div>)}</div>
            <div className="kc-axis" aria-hidden="true"><span>-5</span><span>0</span><span>5</span><span>10</span><span>15</span><span>20</span><span>25</span><span>30%</span></div>
            <table className="kc-sr-table"><caption>20-year compound annual growth rates</caption><tbody>{chartData.map(([name,value])=><tr key={name}><th>{name}</th><td>{value}%</td></tr>)}</tbody></table>
          </div> : <div className="kc-chart-empty" role="tabpanel"><ChartNoAxesCombined aria-hidden="true" /><p>Performance data coming soon.</p></div>}
        </div>
      </div></section>

      <section id="resources" className="kc-section kc-promos"><div className="kc-container kc-promo-grid">
        <article className="kc-promo-card" data-kc-reveal><img src={goldNugget.url} alt="Natural raw gold nugget" width={1200} height={912} loading="lazy" /><div><h2>Consider gold's potential benefits</h2><p>Gold is used in everything from electronics to jewellery, but you can also invest in it. The unique nature of gold could help in times of economic turmoil and growth.</p><a href="#benefits">The Case for Gold <ArrowRight /></a></div></article>
        <article className="kc-promo-card kc-guide-card" data-kc-reveal><img src={buyingGuide.url} alt="Dark green SQOOT Pure Buying Gold Safely guide" width={1400} height={900} loading="lazy" /><div><h2>Get the guide for investing in gold</h2><p>Investing in gold can be simple and safe—provided you ask the right questions. Find out more with our 5-step guide to buying gold safely.</p><a href="#articles">Buying Gold Safely <ArrowRight /></a></div></article>
      </div></section>

      <section className="kc-section kc-investing"><div className="kc-container kc-investing-panel" data-kc-reveal>
        <div className="kc-investing-copy"><h2>Simple, straightforward investing</h2><p>History shows that people turn to gold as an investment because of its unique qualities.</p><p>If you're looking for a safer way to grow what you have and protect it, gold could be the investment for you.</p><p>Offering the potential for competitive returns and the ability to buy and sell online, gold could help you navigate your future.</p><p>Choose your own path, with gold.</p></div>
        <img src={investingBars.url} alt="Upright SQOOT Pure gold bar with stacked bars and two coins" width={1920} height={900} loading="lazy" />
      </div></section>

      <section className="kc-section kc-external"><div className="kc-container kc-external-grid">
        <article className="kc-external-card kc-newsletter" data-kc-reveal><div><span className="kc-label">Stay up to date</span><h2>Get weekly insights on gold's performance</h2><p>Follow market context and the forces shaping gold, delivered in a clear weekly briefing.</p><GoldButton href="#" className="h-[54px] px-8">Sign Up on Gold.org</GoldButton></div><div className="kc-report-art" role="img" aria-label="Pale market report with a line chart and gold stationery"><span className="kc-report-sheet"><svg viewBox="0 0 180 112" aria-hidden="true"><path className="kc-chart-grid" d="M16 16H168M16 42H168M16 68H168M16 94H168M16 16V94M54 16V94M92 16V94M130 16V94M168 16V94"/><path className="kc-chart-line kc-chart-line-muted" d="M16 83L38 67L59 72L81 48L103 58L125 35L146 44L168 20"/><path className="kc-chart-line" d="M16 88L38 76L59 61L81 66L103 43L125 49L146 29L168 24"/></svg></span><span className="kc-report-notebook" aria-hidden="true" /><span className="kc-report-pen" aria-hidden="true" /><span className="kc-report-clip kc-report-clip-one" aria-hidden="true" /><span className="kc-report-clip kc-report-clip-two" aria-hidden="true" /></div></article>
        <article className="kc-external-card kc-goldhub" data-kc-reveal><div><span className="kc-label">Explore the home of gold research</span><h2>Get the latest insights from the World Gold Council</h2><p>Explore trusted research, market analysis and educational resources about gold.</p><GoldButton href="#" className="h-[54px] px-8">Goldhub</GoldButton></div><img src={laptop} alt="Laptop displaying an institutional gold dashboard" width={1200} height={800} loading="lazy" /></article>
        <article className="kc-film-card" data-kc-reveal><img src={cinematicGold.url} alt="Abstract black silk and textured gold leaf" width={912} height={1200} loading="lazy" /><span className="kc-film-overlay" /><div><h2>Elton John / Touched by Gold: Watch the Film</h2><button type="button" aria-label="Preview Touched by Gold"><Play /></button><p>Touched by Gold</p></div></article>
      </div></section>

      <div id="disclaimer" className="kc-footnote kc-container">Past performance is not a guarantee of future results. Educational content is provided for general information only.</div>
      <SiteFooter />
      <style>{knowledgeStyles}</style>
    </main>
  );
}

const knowledgeStyles = `
.knowledge-center-page{--kc-forest-950:#01120d;--kc-forest-900:#021c15;--kc-forest-850:#05291f;--kc-forest-800:#0a3528;--kc-gold:#d5a33b;--kc-gold-dark:#b98224;--kc-gold-soft:#e5c171;--kc-cream:#fcfaf6;--kc-paper:#f8f3ea;--kc-paper-dark:#f1e9dc;--kc-ink:#10261e;--kc-body:#34413c;--kc-muted:#6b726d;--kc-border:rgba(112,87,45,.17);--kc-border-dark:rgba(213,163,59,.28);--kc-shadow:0 2px 6px rgba(21,28,24,.025),0 14px 38px rgba(21,28,24,.075);--kc-radius-large:18px;--kc-radius-card:12px;--kc-radius-small:6px;background:radial-gradient(circle at 12% 18%,rgba(213,163,59,.035),transparent 28%),radial-gradient(circle at 86% 72%,rgba(4,41,31,.025),transparent 32%),#faf7f0;color:var(--kc-ink);overflow-x:clip;font-family:"Inter",Arial,sans-serif;font-weight:400}
.knowledge-center-page *{box-sizing:border-box}.kc-container{width:min(1296px,calc(100% - 144px));margin-inline:auto}.kc-section{margin-top:24px}.kc-display,.kc-hero-copy,.kc-section-title,.kc-promo-card h2,.kc-investing h2,.kc-external-card h2,.kc-film-card h2{font-family:"Cormorant Garamond",Georgia,serif;letter-spacing:-.02em}.kc-display{font-size:clamp(58px,4.8vw,70px);line-height:.98;font-weight:500}.kc-hero-copy{font-size:clamp(32px,2.75vw,40px);line-height:1.08;font-weight:500}.kc-section-title{font-size:clamp(31px,2.5vw,38px);line-height:1.05;font-weight:500}.kc-body{font-size:15px;line-height:1.55}.kc-label{font-size:11px;line-height:1;font-weight:600;letter-spacing:.12em;text-transform:uppercase}.knowledge-center-page a,.knowledge-center-page button{outline-offset:4px}.knowledge-center-page a:focus-visible,.knowledge-center-page button:focus-visible{outline:2px solid var(--kc-gold-soft)}
.kc-hero{height:520px;background:radial-gradient(circle at 78% 48%,rgba(181,126,30,.15),transparent 36%),radial-gradient(circle at 15% 85%,rgba(10,53,40,.6),transparent 42%),var(--kc-forest-950);color:var(--kc-cream)}.kc-hero-inner{height:100%;display:grid;grid-template-columns:36% 64%;gap:42px;align-items:center}.kc-hero-text{max-width:405px;animation:kc-rise .82s cubic-bezier(.22,1,.36,1) both}.kc-hero .kc-display{color:var(--kc-gold);margin-bottom:18px}.kc-hero-copy em{font-family:"Cormorant Garamond",Georgia,serif;font-style:italic;font-weight:500}.kc-gold-rule{display:block;width:42px;height:1.5px;margin:24px 0 22px;background:var(--kc-gold)}.kc-hero-text>.kc-body{max-width:370px;color:rgba(252,250,246,.86)}.kc-circle-control{display:grid;width:44px;height:44px;margin-top:24px;place-items:center;border:1px solid var(--kc-gold);border-radius:50%;color:var(--kc-gold);transition:background .2s,color .2s}.kc-circle-control:hover{background:var(--kc-gold);color:var(--kc-forest-950)}.kc-circle-control svg{width:18px}.kc-hero-media{position:relative;height:460px;border:1px solid rgba(213,163,59,.2);border-radius:21px;overflow:hidden;animation:kc-media .85s cubic-bezier(.22,1,.36,1) both}.kc-hero-media>img{width:100%;height:100%;object-fit:cover}.kc-media-vignette{position:absolute;inset:0;background:linear-gradient(90deg,rgba(1,18,13,.22),transparent 35%,rgba(1,18,13,.08)),linear-gradient(0deg,rgba(1,18,13,.24),transparent 40%)}.kc-play{position:absolute;inset:50% auto auto 50%;translate:-50% -50%;display:grid;width:92px;height:92px;place-items:center;border:1px solid var(--kc-gold);border-radius:50%;background:rgba(1,18,13,.92);color:var(--kc-gold-soft);transition:transform .25s,border-color .25s}.kc-play:hover{transform:scale(1.035);border-color:var(--kc-gold-soft)}.kc-play svg{width:26px;fill:currentColor}
.kc-disclaimer{height:50px;border-top:1px solid rgba(213,163,59,.16);background:var(--kc-forest-850)}.kc-disclaimer .kc-container{height:100%;display:flex;align-items:center}.kc-disclaimer a{display:inline-flex;align-items:center;gap:9px;color:var(--kc-gold-soft);font-size:12px;font-weight:500}.kc-disclaimer svg{width:17px}
.kc-benefits{height:300px;display:flex;align-items:center}.kc-benefits-layout{display:grid;grid-template-columns:260px minmax(0,1fr);gap:36px;align-items:center}.kc-benefits-intro .kc-section-title{font-size:36px}.kc-text-link{display:inline-flex;align-items:center;gap:7px;margin-top:16px;color:var(--kc-gold-dark);font-size:15px;font-weight:500}.kc-text-link svg{width:15px}.kc-benefit-controls{display:flex;align-items:center;gap:13px;margin-top:22px;color:var(--kc-muted);font-size:12px}.kc-benefit-controls button{display:grid;width:38px;height:38px;place-items:center;border:1px solid var(--kc-gold-dark);border-radius:50%;color:var(--kc-gold-dark);transition:background .2s,color .2s}.kc-benefit-controls button:hover{background:var(--kc-gold);color:var(--kc-forest-950)}.kc-benefit-controls svg{width:15px}.kc-benefit-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));height:180px;align-items:center}.kc-benefit-grid article{height:125px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding:20px;border-left:1px solid rgba(112,87,45,.14);text-align:center;opacity:.64;transition:opacity .25s}.kc-benefit-grid article:first-child{border-left:0}.kc-benefit-grid article.is-active,.kc-benefit-grid article:hover{opacity:1}.kc-benefit-grid svg{width:42px;height:42px;color:var(--kc-gold);stroke-width:1.4;transition:transform .2s}.kc-benefit-grid article:hover svg,.kc-benefit-grid article.is-active svg{transform:translateY(-2px)}.kc-benefit-grid h3{font-size:16px;font-weight:500;line-height:1.16;color:var(--kc-forest-950)}.kc-globe-coin{position:relative;display:inline-flex;width:42px;height:42px;align-items:center;justify-content:center}.kc-globe-coin svg:first-child{width:42px;height:42px}.kc-globe-coin svg:last-child{position:absolute;bottom:-3px;right:-3px;width:18px;height:18px;stroke-width:1.6;background:var(--kc-cream);border-radius:50%}
.kc-article-grid{height:440px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}.kc-article-card{height:440px;border:1px solid var(--kc-border);border-radius:var(--kc-radius-card);overflow:hidden;background:var(--kc-forest-900);box-shadow:var(--kc-shadow);transition:transform .3s}.kc-article-card:hover{transform:translateY(-2px)}.kc-article-image{height:62%;overflow:hidden}.kc-article-image img{width:100%;height:100%;object-fit:cover;transition:transform .3s}.kc-article-card:hover img{transform:scale(1.025)}.kc-article-copy{height:38%;display:flex;flex-direction:column;padding:22px 24px;color:var(--kc-cream)}.kc-article-copy h2{font-size:12px;line-height:1.25;letter-spacing:.11em;color:var(--kc-gold-soft);font-weight:600}.kc-article-copy p{margin-top:11px;font-size:15px;line-height:1.45;color:rgba(252,250,246,.88)}.kc-article-copy a,.kc-promo-card a{display:inline-flex;align-items:center;gap:7px;margin-top:auto;color:var(--kc-gold-soft);font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase}.kc-article-copy a svg,.kc-promo-card a svg{width:15px;transition:transform .3s}.kc-article-card:hover a svg,.kc-promo-card:hover a svg{transform:translateX(4px)}
.kc-returns-panel{height:558px;display:grid;grid-template-columns:35% 65%;gap:32px;padding:36px;border:1px solid rgba(213,163,59,.22);border-radius:14px;background:linear-gradient(135deg,var(--kc-forest-950),var(--kc-forest-800));color:var(--kc-cream);overflow:hidden}.kc-returns-copy>.kc-label{color:var(--kc-gold-soft)}.kc-returns-copy>.kc-section-title{margin-top:13px;max-width:390px;color:var(--kc-cream)}.kc-returns-copy ul{display:grid;gap:13px;margin-top:22px}.kc-returns-copy li{display:grid;grid-template-columns:19px minmax(0,1fr);gap:10px}.kc-returns-copy li>span{display:grid;width:18px;height:18px;place-items:center;border:1px solid var(--kc-gold-dark);border-radius:50%;color:var(--kc-gold)}.kc-returns-copy li svg{width:11px}.kc-returns-copy li p{font-size:14px;line-height:1.42;color:rgba(252,250,246,.85)}.kc-returns-copy sup{color:var(--kc-gold-soft);font-weight:600}.kc-dark-link{display:inline-flex;align-items:center;gap:8px;margin-top:18px;color:var(--kc-gold-soft);font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase}.kc-dark-link svg{width:15px}.kc-chart-panel{height:100%;border:1px solid rgba(213,163,59,.3);border-radius:12px;background:rgba(10,53,40,.72);padding:0 26px 24px;overflow:hidden}.kc-tabs{display:grid;grid-template-columns:repeat(5,1fr);height:56px;border-bottom:1px solid rgba(229,193,113,.2)}.kc-tabs button{position:relative;border-left:1px solid rgba(229,193,113,.12);color:rgba(252,250,246,.62);font-size:13px;font-weight:600}.kc-tabs button:first-child{border-left:0}.kc-tabs button[aria-selected=true]{color:var(--kc-gold-soft)}.kc-tabs button[aria-selected=true]:after{content:"";position:absolute;left:18%;right:18%;bottom:-1px;height:2px;background:var(--kc-gold)}.kc-chart{padding-top:21px}.kc-chart h3{font-size:13px;font-weight:600;color:var(--kc-gold-soft)}.kc-bars{display:grid;gap:10px;margin-top:18px}.kc-bar-row{display:grid;grid-template-columns:105px minmax(0,1fr) 35px;align-items:center;gap:12px;font-size:12px;color:rgba(252,250,246,.78)}.kc-bar-row>div{--bar-start:14.2857%;position:relative;height:20px;background:repeating-linear-gradient(90deg,transparent 0,transparent calc(14.2857% - 1px),rgba(252,250,246,.08) 14.2857%)}.kc-bar-row>div:before{content:"";position:absolute;left:var(--bar-start);top:0;bottom:0;width:1px;background:rgba(252,250,246,.18)}.kc-bar-row i{display:block;margin-left:var(--bar-start);width:0;height:100%;background:#527466;transition:width .8s cubic-bezier(.22,1,.36,1)}.kc-returns-panel.is-visible .kc-bar-row i{width:var(--bar-width)}.kc-bar-row.is-gold{color:var(--kc-gold-soft)}.kc-bar-row.is-gold i{background:linear-gradient(90deg,var(--kc-gold-dark),var(--kc-gold-soft))}.kc-bar-row b{font-weight:600}.kc-axis{display:flex;justify-content:space-between;margin:9px 47px 0 117px;color:rgba(252,250,246,.42);font-size:10px}.kc-chart-empty{height:calc(100% - 56px);display:grid;place-content:center;justify-items:center;gap:12px;color:rgba(252,250,246,.62)}.kc-chart-empty svg{width:46px}.kc-chart-empty p{font-size:14px}.kc-sr-table{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}
.kc-promo-grid{height:298px;display:grid;grid-template-columns:.84fr 1.16fr;gap:18px}.kc-promo-card{height:100%;display:grid;grid-template-columns:42% 58%;overflow:hidden;border:1px solid var(--kc-border);border-radius:var(--kc-radius-card);background:var(--kc-paper);box-shadow:var(--kc-shadow)}.kc-promo-card>img{width:100%;height:100%;object-fit:cover}.kc-promo-card>div{display:flex;flex-direction:column;padding:28px 26px}.kc-promo-card h2{font-size:29px;line-height:1.06;font-weight:500}.kc-promo-card p{margin-top:13px;font-size:14px;line-height:1.5;color:var(--kc-body)}.kc-promo-card a{color:var(--kc-gold-dark)}.kc-guide-card{grid-template-columns:40% 60%}
.kc-investing-panel{position:relative;height:336px;display:grid;grid-template-columns:55% 45%;overflow:hidden;border:1px solid rgba(213,163,59,.22);border-radius:14px;background:linear-gradient(105deg,var(--kc-forest-950),var(--kc-forest-800));color:var(--kc-cream)}.kc-investing-copy{position:relative;z-index:2;padding:34px 38px;background:linear-gradient(90deg,var(--kc-forest-950) 25%,rgba(1,18,13,.84) 75%,transparent)}.kc-investing h2{font-size:40px;font-weight:500;line-height:1.05;color:var(--kc-gold-soft)}.kc-investing-copy p{max-width:610px;margin-top:11px;font-size:15px;line-height:1.42;color:rgba(252,250,246,.86)}.kc-investing-panel>img{width:100%;height:100%;object-fit:cover;object-position:72% center;mask-image:linear-gradient(90deg,transparent 0,#000 22%,#000 100%)}
.kc-external-grid{height:340px;display:grid;grid-template-columns:1.04fr 1.16fr .88fr;gap:18px}.kc-external-card,.kc-film-card{position:relative;height:100%;overflow:hidden;border:1px solid var(--kc-border);border-radius:var(--kc-radius-card);box-shadow:var(--kc-shadow)}.kc-external-card{display:grid;grid-template-columns:58% 42%;background:var(--kc-paper)}.kc-external-card>div{position:relative;z-index:2;display:flex;flex-direction:column;padding:27px 24px}.kc-external-card .kc-label{color:var(--kc-gold-dark);line-height:1.3}.kc-external-card h2{margin-top:13px;font-size:28px;line-height:1.06;font-weight:500}.kc-external-card p{margin-top:12px;font-size:14px;line-height:1.5;color:var(--kc-body)}.kc-external-card>img{width:100%;height:100%;object-fit:cover}.kc-report-art{position:relative!important;z-index:1!important;display:block!important;padding:0!important;overflow:hidden;background:linear-gradient(145deg,#fdfbf6,#e9dfcf)}.kc-report-sheet{position:absolute;left:8%;right:8%;top:24%;height:51%;padding:10%;border:1px solid rgba(112,87,45,.12);border-radius:2px;background:#fffdf8;box-shadow:0 10px 24px rgba(58,46,28,.12);transform:rotate(-4deg)}.kc-report-sheet svg{width:100%;height:100%;overflow:visible}.kc-chart-grid{fill:none;stroke:rgba(16,38,30,.13);stroke-width:1}.kc-chart-line{fill:none;stroke:var(--kc-gold-dark);stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}.kc-chart-line-muted{stroke:var(--kc-forest-800);stroke-width:1.8}.kc-report-notebook{position:absolute;width:40%;height:26%;right:-7%;top:-5%;border-radius:3px;background:#f2eadf;box-shadow:0 6px 15px rgba(58,46,28,.1);transform:rotate(8deg)}.kc-report-pen{position:absolute;width:4px;height:39%;right:10%;bottom:-5%;border-radius:4px;background:linear-gradient(90deg,var(--kc-gold-dark),var(--kc-gold-soft),var(--kc-gold-dark));transform:rotate(17deg);box-shadow:0 2px 5px rgba(58,46,28,.15)}.kc-report-clip{position:absolute;width:11px;height:25px;border:2px solid var(--kc-gold-dark);border-radius:6px;transform:rotate(19deg)}.kc-report-clip-one{right:29%;bottom:6%}.kc-report-clip-two{right:21%;bottom:4%}.kc-film-card>img{width:100%;height:100%;object-fit:cover}.kc-film-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(1,18,13,.14),rgba(1,18,13,.88))}.kc-film-card>div{position:absolute;z-index:2;inset:0;display:flex;flex-direction:column;padding:26px;color:var(--kc-cream)}.kc-film-card h2{max-width:260px;font-size:27px;line-height:1.08;font-weight:500}.kc-film-card button{display:grid;width:58px;height:58px;margin:auto;place-items:center;border:1px solid var(--kc-gold-soft);border-radius:50%;color:var(--kc-gold-soft)}.kc-film-card button svg{width:18px;fill:currentColor}.kc-film-card p{font-family:"Cormorant Garamond",Georgia,serif;font-size:21px;font-weight:600;text-transform:uppercase;color:var(--kc-gold-soft)}.kc-footnote{padding-block:22px 28px;color:var(--kc-muted);font-size:12px;line-height:1.5}
.kc-reveal-ready [data-kc-reveal]{opacity:0;transform:translateY(14px);transition:opacity .65s cubic-bezier(.22,1,.36,1),transform .65s cubic-bezier(.22,1,.36,1)}.kc-reveal-ready [data-kc-reveal].is-visible{opacity:1;transform:none}.kc-article-card[data-kc-reveal],.kc-external-grid>[data-kc-reveal]{transition-delay:calc(var(--kc-index,0)*60ms)}
@keyframes kc-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}@keyframes kc-media{from{opacity:0;transform:scale(1.02)}to{opacity:1;transform:scale(1)}}
@media(max-width:1279px){.kc-container{width:calc(100% - 80px)}.kc-hero-inner{grid-template-columns:40% 60%;gap:32px}.kc-benefit-grid{grid-template-columns:repeat(3,1fr);height:auto}.kc-benefit-grid article:nth-child(4){border-left:0}.kc-benefits{height:auto;min-height:310px}.kc-returns-panel{grid-template-columns:40% 60%;height:auto;min-height:558px}.kc-external-grid{height:auto;grid-template-columns:repeat(2,1fr)}.kc-film-card{height:340px}}
@media(max-width:1023px){.kc-container{width:calc(100% - 56px)}.kc-hero{height:auto}.kc-hero-inner{grid-template-columns:1fr;padding-block:48px}.kc-hero-text{max-width:680px}.kc-hero-media{height:auto;aspect-ratio:16/9}.kc-benefits-layout{grid-template-columns:1fr;padding-block:32px}.kc-benefit-grid article{border-left:1px solid rgba(112,87,45,.14)}.kc-article-grid{height:auto;grid-template-columns:repeat(2,1fr)}.kc-article-card{height:440px}.kc-returns-panel{height:auto;grid-template-columns:1fr}.kc-chart-panel{min-height:455px}.kc-promo-grid{height:auto;grid-template-columns:1fr}.kc-promo-card{height:300px}.kc-investing-panel{height:auto;min-height:340px;grid-template-columns:55% 45%}.kc-external-grid{grid-template-columns:repeat(2,1fr)}.kc-external-card,.kc-film-card{height:340px}}
@media(max-width:767px){.kc-container{width:calc(100% - 40px)}.kc-section{margin-top:22px}.kc-display{font-size:clamp(48px,13vw,54px)}.kc-hero-copy{font-size:clamp(29px,8.2vw,34px)}.kc-hero-inner{padding-block:38px;gap:30px}.kc-hero-media{border-radius:14px}.kc-play{width:72px;height:72px}.kc-disclaimer{height:50px}.kc-benefits-layout{gap:22px}.kc-benefits-intro .kc-section-title{font-size:32px}.kc-benefit-grid{grid-template-columns:repeat(2,1fr)}.kc-benefit-grid article:nth-child(odd){border-left:0}.kc-article-grid{grid-template-columns:1fr}.kc-article-card{height:auto;min-height:430px}.kc-article-image{height:auto;aspect-ratio:1.5}.kc-article-copy{height:164px}.kc-returns-panel{padding:28px 20px}.kc-returns-copy li p{font-size:14px}.kc-chart-panel{min-height:445px;padding-inline:14px}.kc-tabs{height:52px}.kc-tabs button{font-size:12px}.kc-bar-row{grid-template-columns:82px minmax(0,1fr) 31px;gap:7px}.kc-bar-row>span{font-size:11px;overflow-wrap:anywhere}.kc-axis{margin-left:89px;margin-right:38px}.kc-promo-card,.kc-guide-card{height:auto;grid-template-columns:1fr}.kc-promo-card>img{height:auto;aspect-ratio:1.55}.kc-promo-card>div{min-height:260px}.kc-investing-panel{grid-template-columns:1fr}.kc-investing-copy{padding:30px 22px}.kc-investing h2{font-size:36px}.kc-investing-panel>img{height:auto;aspect-ratio:1.4}.kc-external-grid{grid-template-columns:1fr}.kc-external-card,.kc-film-card{height:350px}.kc-external-card{grid-template-columns:60% 40%}.kc-footnote{font-size:12px}}
@media(prefers-reduced-motion:reduce){.knowledge-center-page *,.knowledge-center-page *:before,.knowledge-center-page *:after{animation:none!important;transition:none!important}.kc-reveal-ready [data-kc-reveal]{opacity:1!important;transform:none!important}.kc-bar-row i{width:var(--bar-width)!important}}
`;