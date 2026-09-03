import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import aboutHeroBg from "@/assets/about-hero-velvet-bg.jpg.asset.json";
import aboutHeroGoldBar from "@/assets/about-hero-gold-bar-v2.png.asset.json";

export const Route = createFileRoute("/about-us")({
  head: () => ({
    meta: [
      { title: "About SQOOT Pure — Built on Gold Expertise" },
      {
        name: "description",
        content: "Four decades of precious metals expertise, built into a transparent platform for owning real, allocated and insured gold.",
      },
      { property: "og:title", content: "About SQOOT Pure — Built on Gold Expertise" },
      {
        property: "og:description",
        content: "Founder-led and compliance-first: discover the experience behind SQOOT Pure.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

type IconName = "bank" | "wyoming" | "shield" | "vault" | "coinbar" | "cubes";

function LineIcon({ name, className = "" }: { name: IconName; className?: string }) {
  if (name === "wyoming") {
    return (
      <svg className={className} viewBox="0 0 64 48" fill="none" aria-hidden="true">
        <path d="M4 8.5 59 5l1 32-18 1.5-1.5 4.5-11-2-4 3-8-3.5-12 .5L4 8.5Z" />
      </svg>
    );
  }
  if (name === "shield") {
    return (
      <svg className={className} viewBox="0 0 52 52" fill="none" aria-hidden="true">
        <path d="M26 3.5c5.5 4.2 11.3 6.3 17.5 6.8v13.1c0 11.1-6.5 19.5-17.5 25.1C15 42.9 8.5 34.5 8.5 23.4V10.3C14.7 9.8 20.5 7.7 26 3.5Z" />
        <path d="m17.5 25.8 5.7 5.7 11.7-12.3" />
      </svg>
    );
  }
  if (name === "vault") {
    return (
      <svg className={className} viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <rect x="6" y="5" width="44" height="46" rx="2" />
        <circle cx="28" cy="28" r="14" />
        <circle cx="28" cy="28" r="3" />
        <path d="M28 14v7m0 14v7M14 28h7m14 0h7m-4.1-9.9-5 5m-9.8 9.8-5 5m0-19.8 5 5m9.8 9.8 5 5" />
      </svg>
    );
  }
  if (name === "coinbar") {
    return (
      <svg className={className} viewBox="0 0 64 52" fill="none" aria-hidden="true">
        <circle cx="21" cy="28" r="15" /><circle cx="21" cy="28" r="10" />
        <path d="M19 22h4m-2-2v16m-3-3h6c2.2 0 4-1.5 4-3.5S26.2 26 24 26h-6c-2.2 0-4-1.5-4-3.5s1.8-3.5 4-3.5h6" />
        <path d="m37 12 18 3-5 27-17-3 4-27Z" />
      </svg>
    );
  }
  if (name === "cubes") {
    return (
      <svg className={className} viewBox="0 0 64 54" fill="none" aria-hidden="true">
        <path d="m20 4 13 7-13 7-13-7 13-7Zm-13 7v14l13 7 13-7V11M20 18v14" />
        <path d="m44 19 13 7-13 7-13-7 13-7Zm-13 7v14l13 7 13-7V26M44 33v14" />
        <path d="m20 25 13 7-13 7-13-7m0 0v14l13 7 13-7V32M20 39v14" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 60 52" fill="none" aria-hidden="true">
      <path d="m6 20 24-15 24 15H6Zm4 0v25m10-25v25m20-25v25m10-25v25M5 45h50M2 50h56" />
    </svg>
  );
}

function Mandala({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 160" fill="none" aria-hidden="true">
      <circle cx="80" cy="80" r="17" />
      <circle cx="80" cy="80" r="49" />
      <circle cx="80" cy="80" r="70" />
      <path d="M80 10c14 19 18 34 0 52-18-18-14-33 0-52Zm0 140c-14-19-18-34 0-52 18 18 14 33 0 52ZM10 80c19-14 34-18 52 0-18 18-33 14-52 0Zm140 0c-19 14-34 18-52 0 18-18 33-14 52 0ZM30.5 30.5c23 3.5 36.7 11.5 36.2 36.2-24.7.5-32.7-13.2-36.2-36.2Zm99 99c-23-3.5-36.7-11.5-36.2-36.2 24.7-.5 32.7 13.2 36.2 36.2Zm0-99c-3.5 23-11.5 36.7-36.2 36.2-.5-24.7 13.2-32.7 36.2-36.2Zm-99 99c3.5-23 11.5-36.7 36.2-36.2.5 24.7-13.2 32.7-36.2 36.2Z" />
    </svg>
  );
}

const companyItems: Array<{ icon: IconName; label: string }> = [
  { icon: "bank", label: "Fortress Gold Inc." },
  { icon: "wyoming", label: "Wyoming Corporation" },
  { icon: "shield", label: "FinCEN-Registered Dealer" },
];

const processItems: Array<{ icon: IconName; title: string; body: string }> = [
  { icon: "bank", title: "Dillon Gage", body: "Sourced from established suppliers with a long standing presence in the precious metals industry." },
  { icon: "vault", title: "IDS", body: "Allocated, vaulted, and held in independently operated, professional vaults with secure custody." },
  { icon: "shield", title: "Lloyd's of London", body: "Your gold is insured by Lloyd's of London." },
];

const ownershipItems: Array<{ icon: IconName; title: string; body: string; featured?: boolean }> = [
  { icon: "coinbar", title: "Coins & Bars", body: "Own specific, identifiable gold in the form of coins or bars. Fully allocated and withdrawable." },
  { icon: "bank", title: "Vaulted Gold", body: "Allocated gold securely held in professional vaults. Redeemable on your terms.", featured: true },
  { icon: "cubes", title: "Fractional Gold", body: "Own a precise fraction of allocated gold. Access real exposure with flexible entry." },
];

function AboutPage() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".about-new [data-reveal]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sections.forEach((section) => section.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }),
      { threshold: 0.18 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <main id="top" className="about-new">
      <SiteHeader />

      <section className="about-hero" aria-labelledby="about-title">
        <img className="about-hero-velvet" src={aboutHeroBg.url} alt="" aria-hidden="true" />
        <Mandala className="about-hero-mandala" />
        <div className="about-hero-copy">
          <p className="about-eyebrow about-hero-item">Founder-led. Compliance-first.</p>
          <h1 id="about-title" className="about-hero-item">
            <span>Forty years in</span><span>the gold market.</span><span>One platform built</span><span>to get it right.</span>
          </h1>
        </div>
        <img className="about-hero-bar" src={aboutHeroGoldBar.url} alt="Angled SQOOT Pure gold bar on dark green velvet" width={390} height={780} fetchPriority="high" />
      </section>

      <section className="about-story" data-reveal>
        <div className="about-story-inner">
          <div className="about-story-lead">
            <h2><span>Our story began</span><span>in Mumbai in 1984,</span><span>at the heart of</span><span>India&apos;s gold market.</span></h2>
            <span className="about-short-rule" />
          </div>
          <div className="about-story-copy">
            <p>For more than four decades, we have worked across every part of the precious metals ecosystem: sourcing, trading, refining, vaulting and delivering.</p>
            <p>We have seen what works, what fails, and what truly serves the everyday buyer.</p>
            <p>SQOOT Pure is the outcome of that experience.<br />Built with a single purpose: to offer a gold ownership platform designed for a new era.</p>
          </div>
        </div>
      </section>

      <section className="about-company" data-reveal>
        <div className="about-shell">
          <p className="about-eyebrow">Company structure</p>
          <div className="about-company-grid">
            {companyItems.map(({ icon, label }) => (
              <article key={label}><LineIcon name={icon} /><h2>{label}</h2></article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-compliance" data-reveal>
        <Mandala className="about-mandala about-mandala-left" />
        <Mandala className="about-mandala about-mandala-right" />
        <div className="about-compliance-copy">
          <h2><span>Compliance first.</span><span>Transparency always.</span><span>Real ownership.</span></h2>
          <div className="about-ornament"><span /><i /><span /></div>
        </div>
      </section>

      <section className="about-process" data-reveal>
        <div className="about-shell">
          <p className="about-eyebrow">How it works</p>
          <div className="about-process-grid">
            {processItems.map(({ icon, title, body }) => (
              <article key={title}>
                <div className="about-icon-ring"><LineIcon name={icon} /></div>
                <h2>{title}</h2><p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-paths" data-reveal>
        <div className="about-shell">
          <p className="about-eyebrow">Three ownership paths</p>
          <div className="about-path-grid">
            {ownershipItems.map(({ icon, title, body, featured }) => (
              <article key={title} className={featured ? "is-featured" : ""}>
                <LineIcon name={icon} /><h2>{title}</h2><p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-trust" data-reveal>
        <div className="about-trust-inner">
          <div className="about-trust-emblem"><Mandala /><LineIcon name="shield" /></div>
          <div className="about-trust-copy">
            <p className="about-eyebrow">Trust close</p>
            <h2>Compliance isn&apos;t a department. It&apos;s the product.</h2>
            <p>We are built to meet the highest regulatory standards—<br />so you can own with confidence, today and for generations to come.</p>
          </div>
        </div>
      </section>

      <section className="about-waitlist" data-reveal>
        <a href="/vault#early-access">Join the waitlist</a>
      </section>

      <SiteFooter />
      <style>{aboutStyles}</style>
    </main>
  );
}

const aboutStyles = `
.about-new {
  --forest-950:#0D2117; --cream-100:#F8EEE2; --cream-150:#F4E9DB; --gold-500:#C9A84C;
  --gold-400:#D9B260; --gold-300:#E6C77D; --gold-deep:#A97827; --cream-text:#FAF5EA; --ink:#16271F;
  --gutter:clamp(71px,6.9444vw,178px); --shell:clamp(882px,86.1111vw,2204px);
  color:var(--ink); background:var(--cream-100); font-family:"DM Sans",system-ui,sans-serif;
  font-synthesis:none; -webkit-font-smoothing:antialiased; overflow-x:clip;
}
.about-new h1,.about-new h2,.about-new h3 { margin:0; font-family:"Cormorant Garamond",Georgia,serif; font-weight:500; letter-spacing:0; }
.about-new p { margin:0; }
.about-shell { width:var(--shell); height:100%; margin-inline:auto; }
.about-eyebrow { font-size:clamp(9.2px,.7639vw,19.6px); font-weight:600; line-height:1.2; letter-spacing:.2em; text-transform:uppercase; color:var(--gold-deep); }
.about-new > header { background:var(--forest-950); animation:aboutFade .45s ease both; }
.about-hero { position:relative; height:clamp(514px,50.2083vw,1285px); overflow:hidden; color:var(--cream-text); background:var(--forest-950); }
.about-hero-velvet { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:.67; }
.about-hero::after { content:""; position:absolute; inset:0; background:linear-gradient(90deg,rgba(13,33,23,.98) 0%,rgba(13,33,23,.92) 38%,rgba(13,33,23,.34) 65%,rgba(13,33,23,.06) 100%); }
.about-hero-mandala { position:absolute; z-index:1; left:clamp(-208px,-8.5vw,-87px); top:47%; width:clamp(365px,35.69vw,914px); height:clamp(365px,35.69vw,914px); color:var(--gold-500); opacity:.095; transform:translateY(-50%); }
.about-hero-mandala *,.about-mandala * { stroke:currentColor; stroke-width:.85; vector-effect:non-scaling-stroke; }
.about-hero-copy { position:absolute; z-index:3; left:var(--gutter); top:clamp(100px,10.4167vw,267px); }
.about-hero .about-eyebrow { color:var(--gold-400); font-size:clamp(11px,1.1806vw,30px); letter-spacing:.22em; }
.about-hero h1 { margin-top:clamp(16px,1.4583vw,37px); color:var(--cream-text); font-size:clamp(48px,5.8333vw,149px); line-height:1.15; }
.about-hero h1 span { display:block; }
.about-hero-bar { position:absolute; z-index:2; right:0; top:50%; width:clamp(480px,48.5vw,1242px); height:96%; object-fit:contain; object-position:96% center; transform:translateY(-50%); filter:drop-shadow(0 30px 40px rgba(0,0,0,.45)); }
.about-hero-item { opacity:0; transform:translateY(16px); animation:aboutReveal .6s cubic-bezier(.22,1,.36,1) forwards; }
.about-hero-item:nth-child(1){animation-delay:.12s}.about-hero-item:nth-child(2){animation-delay:.2s}
.about-story { height:clamp(380px,39.5vw,1011px); background:var(--cream-100); }
.about-story-inner { width:var(--shell); height:100%; margin:auto; display:grid; grid-template-columns:42.75% 1px 1fr; column-gap:clamp(45px,4.5139vw,116px); align-items:center; }
.about-story-inner::before { content:""; grid-column:2; grid-row:1; width:1px; height:clamp(210px,20.14vw,516px); background:color-mix(in srgb,var(--gold-500) 55%,transparent); }
.about-story-lead { grid-column:1; grid-row:1; }
.about-story-lead h2 { color:var(--gold-deep); font-size:clamp(30px,3.3333vw,120px); line-height:1.35; }
.about-story-lead h2 span { display:block; }
.about-short-rule { display:block; width:clamp(57px,5.5556vw,142px); height:1px; margin-top:clamp(19px,1.8056vw,46px); background:var(--gold-deep); }
.about-story-copy { grid-column:3; grid-row:1; font-size:clamp(14px,1.4583vw,37.3px); line-height:1.75; }
.about-story-copy p + p { margin-top:clamp(13px,1.25vw,32px); }
.about-company { height:clamp(200px,19.4vw,497px); color:var(--cream-text); background:var(--forest-950); }
.about-company .about-shell { padding-top:clamp(28px,2.7vw,69px); }
.about-company .about-eyebrow { color:var(--gold-400); }
.about-company-grid { height:clamp(120px,11.8vw,302px); display:grid; grid-template-columns:repeat(3,1fr); margin-top:clamp(14px,1.3889vw,36px); }
.about-company-grid article { min-width:0; display:flex; align-items:center; gap:clamp(18px,1.7361vw,44px); padding-inline:clamp(22px,2.0833vw,53px); border-left:1px solid color-mix(in srgb,var(--gold-500) 45%,transparent); }
.about-company-grid article:first-child { padding-left:0; border-left:0; }
.about-company-grid svg { width:clamp(57px,5.8333vw,150px); height:clamp(48px,4.8611vw,125px); flex:none; color:var(--gold-400); stroke:currentColor; stroke-width:1.35; vector-effect:non-scaling-stroke; }
.about-company-grid h2 { color:var(--cream-text); font-size:clamp(22px,2.1528vw,55px); line-height:1.15; white-space:nowrap; }
.about-compliance { position:relative; height:clamp(340px,35.4vw,907px); display:grid; place-items:center; overflow:hidden; color:var(--gold-500); background:#091B12; }
.about-mandala { position:absolute; top:50%; width:clamp(315px,30.9vw,791px); height:clamp(315px,30.9vw,791px); color:var(--gold-500); opacity:.075; }
.about-mandala-left { left:clamp(-190px,-7.6vw,-78px); transform:translateY(-50%); }.about-mandala-right { right:clamp(-190px,-7.6vw,-78px); transform:translateY(-50%) rotate(22.5deg); }
.about-compliance-copy { position:relative; z-index:2; text-align:center; }
.about-compliance h2 { font-size:clamp(48px,6.6667vw,171px); line-height:1.12; color:var(--gold-500); }
.about-compliance h2 span { display:block; }
.about-ornament { display:flex; align-items:center; justify-content:center; gap:clamp(10px,1.0417vw,27px); margin-top:clamp(19px,1.9444vw,50px); }
.about-ornament span { width:clamp(81px,7.9167vw,203px); height:1px; background:color-mix(in srgb,var(--gold-500) 72%,transparent); }
.about-ornament i { width:clamp(8px,.6944vw,18px); height:clamp(8px,.6944vw,18px); border:1px solid var(--gold-500); transform:rotate(45deg); }
.about-process { height:clamp(289px,28.2639vw,724px); background:var(--cream-100); }
.about-process .about-shell { padding-top:clamp(28px,2.7778vw,71px); }
.about-process-grid { height:clamp(231px,22.57vw,578px); display:grid; grid-template-columns:repeat(3,1fr); margin-top:clamp(10px,.9722vw,25px); }
.about-process-grid article { display:flex; flex-direction:column; align-items:center; text-align:center; padding-inline:clamp(35px,3.47vw,89px); border-left:1px solid color-mix(in srgb,var(--gold-deep) 30%,transparent); }
.about-process-grid article:first-child { border-left:0; }
.about-icon-ring { width:clamp(88px,8.6111vw,220px); height:clamp(88px,8.6111vw,220px); display:grid; place-items:center; border:1px solid color-mix(in srgb,var(--gold-deep) 50%,transparent); border-radius:50%; }
.about-icon-ring svg { width:clamp(34px,3.3333vw,85px); height:clamp(34px,3.3333vw,85px); color:var(--gold-deep); stroke:currentColor; stroke-width:1.3; }
.about-process-grid h2 { margin-top:clamp(12px,1.1806vw,30px); color:var(--ink); font-size:clamp(18.5px,1.8056vw,46px); line-height:1.1; }
.about-process-grid p { max-width:clamp(206px,20.14vw,516px); margin-top:clamp(7px,.6944vw,18px); font-size:clamp(9.2px,.9028vw,23px); line-height:1.6; }
.about-paths { height:clamp(284px,27.7778vw,711px); background:var(--cream-100); }
.about-paths .about-shell { padding-top:clamp(17px,1.6667vw,43px); }
.about-path-grid { height:clamp(221px,21.6667vw,555px); display:grid; grid-template-columns:repeat(3,1fr); gap:clamp(16px,1.5278vw,39px); align-items:end; margin-top:clamp(14px,1.3889vw,36px); }
.about-path-grid article { height:clamp(184px,18.0556vw,462px); display:flex; flex-direction:column; align-items:center; justify-content:center; padding:clamp(18px,1.8056vw,46px) clamp(38px,3.75vw,96px); border-radius:clamp(7px,.6944vw,18px); text-align:center; color:var(--cream-text); background:var(--forest-950); }
.about-path-grid article.is-featured { height:clamp(221px,21.6667vw,555px); color:var(--ink); border:1px solid var(--gold-500); background:var(--cream-150); box-shadow:0 18px 45px rgba(22,39,31,.13); }
.about-path-grid svg { width:clamp(43px,4.1667vw,107px); height:clamp(35px,3.4722vw,89px); color:var(--gold-400); stroke:currentColor; stroke-width:1.3; }
.about-path-grid h2 { margin-top:clamp(9px,.9028vw,23px); color:var(--gold-400); font-size:clamp(18.5px,1.8056vw,46px); }
.about-path-grid .is-featured h2 { color:var(--gold-deep); }
.about-path-grid p { margin-top:clamp(7px,.6944vw,18px); font-size:clamp(9.2px,.9028vw,23px); line-height:1.6; }
.about-trust { height:clamp(149px,14.5833vw,373px); background:var(--cream-100); }
.about-trust-inner { width:var(--shell); height:100%; margin:auto; display:grid; grid-template-columns:25% 1fr; align-items:center; gap:clamp(75px,7.2917vw,187px); }
.about-trust-emblem { position:relative; width:clamp(98px,9.5139vw,244px); height:clamp(98px,9.5139vw,244px); margin-left:clamp(38px,3.6806vw,94px); display:grid; place-items:center; color:var(--gold-deep); }
.about-trust-emblem > svg:first-child { position:absolute; inset:0; width:100%; height:100%; opacity:.32; }.about-trust-emblem > svg:first-child * { stroke:currentColor; stroke-width:.8; }
.about-trust-emblem > svg:last-child { width:43%; height:43%; stroke:currentColor; stroke-width:1.2; }
.about-trust-copy .about-eyebrow { margin-bottom:clamp(7px,.6944vw,18px); }
.about-trust-copy h2 { color:var(--gold-deep); font-size:clamp(21.3px,2.0833vw,53px); line-height:1.12; }
.about-trust-copy > p:last-child { margin-top:clamp(7px,.6944vw,18px); font-size:clamp(9.6px,.9375vw,24px); line-height:1.7; }
.about-waitlist { height:clamp(77px,7.5vw,192px); display:grid; place-items:center; background:var(--forest-950); }
.about-waitlist a { width:clamp(297px,29.0278vw,743px); height:clamp(49px,4.7917vw,123px); display:grid; place-items:center; border-radius:3px; color:var(--forest-950); background:var(--gold-500); font-size:clamp(10px,.9028vw,23px); font-weight:600; letter-spacing:.12em; text-transform:uppercase; transition:background-color .22s,transform .22s; }
.about-waitlist a:hover { background:var(--gold-300); transform:translateY(-1px); }
.about-new [data-reveal] { opacity:0; transform:translateY(18px); transition:opacity .65s cubic-bezier(.22,1,.36,1),transform .65s cubic-bezier(.22,1,.36,1); }
.about-new [data-reveal].is-visible { opacity:1; transform:none; }
@keyframes aboutFade { from{opacity:0}to{opacity:1} } @keyframes aboutReveal { to{opacity:1;transform:none} }
@media (max-width:1023px) {
  .about-new { --gutter:clamp(32px,6vw,61px); --shell:calc(100% - (var(--gutter) * 2)); }
  .about-hero { height:auto; min-height:760px; display:flex; flex-direction:column; }
  .about-hero-copy { position:relative; left:auto; top:auto; width:var(--shell); margin:74px auto 0; }
  .about-hero h1 { font-size:clamp(48px,7vw,62px); }
  .about-hero-bar { top:auto; right:0; bottom:0; width:70%; height:54%; transform:none; }
  .about-story { height:auto; }.about-story-inner { padding-block:64px; display:grid; grid-template-columns:1fr; gap:38px; }
  .about-story-inner::before { grid-column:1; grid-row:2; width:80px; height:1px; }.about-story-lead { grid-column:1; }.about-story-copy { grid-column:1; grid-row:3; max-width:720px; }
  .about-company { height:auto; }.about-company .about-shell { padding-block:32px; }.about-company-grid { height:auto; }
  .about-company-grid article { padding:24px 22px; flex-direction:column; gap:14px; text-align:center; }.about-company-grid h2 { white-space:normal; }
  .about-compliance { height:330px; }.about-compliance h2 { font-size:48px; }
  .about-process { height:auto; }.about-process .about-shell { padding-block:50px; }.about-process-grid { height:auto; gap:30px; }.about-process-grid article { padding-inline:18px; }
  .about-paths { height:auto; }.about-paths .about-shell { padding-block:45px; }.about-path-grid { height:auto; align-items:stretch; }.about-path-grid article,.about-path-grid article.is-featured { height:250px; }
  .about-trust { height:auto; }.about-trust-inner { padding-block:45px; }
  .about-waitlist { height:108px; }.about-waitlist a { width:340px; height:60px; }
}
@media (max-width:767px) {
  .about-new { --gutter:20px; --shell:calc(100% - 40px); }
  .about-hero { min-height:660px; }.about-hero-copy { margin-top:54px; }.about-hero h1 { font-size:42px; }.about-hero-bar { width:100%; height:48%; object-position:center bottom; }
  .about-story-inner { padding-block:48px; }.about-story-lead h2 { font-size:32px; }.about-story-copy { font-size:14px; }
  .about-company-grid,.about-process-grid,.about-path-grid { grid-template-columns:1fr; }
  .about-company-grid article { flex-direction:row; justify-content:flex-start; min-height:92px; border-left:0; border-top:1px solid color-mix(in srgb,var(--gold-500) 35%,transparent); text-align:left; }.about-company-grid article:first-child { border-top:0; padding-left:22px; }
  .about-company-grid svg { width:50px; height:42px; }.about-company-grid h2 { font-size:22px; }
  .about-compliance { height:300px; }.about-compliance h2 { font-size:34px; }.about-mandala { width:270px; height:270px; }
  .about-process-grid { gap:0; }.about-process-grid article { padding-block:34px; border-left:0; border-top:1px solid color-mix(in srgb,var(--gold-deep) 25%,transparent); }.about-process-grid article:first-child { border-top:0; }
  .about-icon-ring { width:112px; height:112px; }.about-icon-ring svg { width:46px; height:46px; }.about-process-grid h2 { font-size:26px; }.about-process-grid p { max-width:290px; font-size:13px; }
  .about-path-grid { gap:14px; }.about-path-grid article,.about-path-grid article.is-featured { height:auto; min-height:230px; padding:32px 35px; }.about-path-grid h2 { font-size:26px; }.about-path-grid p { font-size:13px; }
  .about-trust-inner { grid-template-columns:1fr; gap:22px; text-align:center; }.about-trust-emblem { margin:auto; }.about-trust-copy h2 { font-size:30px; }.about-trust-copy > p:last-child { font-size:13.5px; }.about-trust-copy br { display:none; }
  .about-waitlist a { width:min(340px,calc(100% - 40px)); min-height:44px; }
}
@media (prefers-reduced-motion:reduce) {
  .about-new * { scroll-behavior:auto!important; animation-duration:.01ms!important; animation-delay:0ms!important; transition-duration:.01ms!important; }
  .about-new [data-reveal],.about-hero-item { opacity:1; transform:none; }
}
`;
