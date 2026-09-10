import { useReveal } from "@/hooks/use-reveal";
import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter, GoldButton } from "@/components/site-chrome";
import { InnerPageHero } from "@/components/inner-page-hero";
import aboutHeroBg from "@/assets/about-hero-velvet-bar.png.asset.json";
import sqootMandala from "@/assets/sqoot-pure-mandala.png.asset.json";

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
        <path d="m4 8 55-3 1 31-18 1-1 5-10-2-5 4-8-4-13 1L4 8Z" />
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
  const scope = useReveal<HTMLElement>();

  return (
    <main ref={scope} id="top" className="about-new">
      <SiteHeader />

      <InnerPageHero
        titleId="about-title"
        eyebrow="Founder-led. Compliance-first."
        title={<><span>Forty years in</span><span>the gold market.</span><span>One platform built</span><span>to get it right.</span></>}
        body={<>Our experience became SQOOT Pure: a simpler, more transparent way to own real gold.</>}
        actions={<GoldButton href="/trust-center#protection">How we protect ownership</GoldButton>}
        imageSrc={aboutHeroBg.url}
        imageAlt="SQOOT Pure gold bar resting on dark green velvet"
        imageVariant="about"
      />

      <section className="about-story" data-reveal>
        <div className="about-story-inner">
          <div className="about-story-lead">
            <h2><span>Our story began</span><span>in Mumbai in 1984,</span><span>at the heart of</span><span>India’s gold market.</span></h2>
            <span className="about-short-rule" />
          </div>
          <div className="about-story-copy">
            <p>For more than four decades, we have worked across every part of the precious metals ecosystem: sourcing, trading, refining, vaulting and delivering.</p>
            <p>We have seen what works, what fails, and what truly serves the everyday buyer.</p>
            <p>SQOOT Pure is the outcome of that experience.<br />Built with a single purpose: to offer a gold ownership platform designed for a new era.</p>
          </div>
          <img className="about-story-etch" src={sqootMandala.url} alt="" aria-hidden="true" />
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
        <img className="about-mandala about-mandala-left" src={sqootMandala.url} alt="" aria-hidden="true" />
        <img className="about-mandala about-mandala-right" src={sqootMandala.url} alt="" aria-hidden="true" />
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
              <article key={title} data-featured={featured ? "true" : undefined}>
                <LineIcon name={icon} /><h2>{title}</h2><p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-trust" data-reveal>
        <div className="about-trust-inner">
          <div className="about-trust-emblem"><img src={sqootMandala.url} alt="" aria-hidden="true" /><LineIcon name="shield" /></div>
          <div className="about-trust-copy">
            <p className="about-eyebrow">Trust close</p>
            <h2>Compliance isn&apos;t a department. It&apos;s the product.</h2>
            <p>We are built to meet the highest regulatory standards—<br />so you can own with confidence, today and for generations to come.</p>
            <div className="about-trust-cta"><GoldButton to="/early-access">Get Early Access</GoldButton></div>
          </div>
        </div>
      </section>


      <SiteFooter />
      <style>{aboutStyles}</style>
    </main>
  );
}

const aboutStyles = `
.about-new{--forest-950:var(--forest);--paper:#F2E9D4;--gold-line:#B18E39;--gold-deep:#76521B;--cream:#F4ECDA;--ink:#1B1A16;--about-gutter:clamp(71px,6.9444vw,178px);color:var(--ink);background:var(--paper);font-family:"Inter",Arial,sans-serif;font-synthesis:none;-webkit-font-smoothing:antialiased;overflow-x:clip}
.about-new h1,.about-new h2{margin:0;font-family:"Cormorant Garamond",Georgia,serif;font-weight:500}.about-new p{margin:0}.about-shell{width:100%;max-width:var(--container);margin-inline:auto;padding-inline:var(--gutter);height:auto}.about-eyebrow{font-size:13px;font-weight:600;line-height:1.2;letter-spacing:.2em;text-transform:uppercase;color:#8D6720}.about-new>header{background:var(--forest-950);animation:aboutFade .45s ease both}.about-new .inner-page-hero-eyebrow{margin:0 0 16px}
.about-hero{position:relative;height:clamp(560px,80vh,820px);overflow:hidden;color:var(--cream);background:var(--forest-950)}
.about-hero-velvet{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.72}.about-hero:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(6,27,17,.98) 0%,rgba(6,27,17,.91) 38%,rgba(6,27,17,.28) 67%,rgba(6,27,17,.03) 100%)}
.about-hero-mandala{position:absolute;z-index:1;left:clamp(-267px,-10.4167vw,-107px);top:clamp(71px,6.9444vw,178px);width:clamp(441px,45.1389vw,1156px);height:clamp(441px,45.1389vw,1156px);object-fit:contain;opacity:.12;mix-blend-mode:screen}
.about-hero-copy{position:absolute;z-index:3;left:var(--about-gutter);top:clamp(110px,22vh,230px)}.about-hero .about-eyebrow{color:var(--gold);font-size:clamp(12px,1.18vw,30px);letter-spacing:.22em}.about-hero h1{margin-top:21px;color:var(--cream);font-size:clamp(58px,5.6944vw,146px);line-height:.98;letter-spacing:-.02em}.about-hero h1 span{display:block}
.about-hero-bar{position:absolute;z-index:2;left:59.375%;top:6.7%;width:clamp(485px,33.6806vw,862px);height:90.8%;object-fit:contain;transform:rotate(4deg);filter:drop-shadow(0 25px 38px rgba(0,0,0,.42))}.about-hero-item{opacity:0;transform:translateY(16px);animation:aboutReveal .65s cubic-bezier(.22,1,.36,1) forwards}.about-hero-item:nth-child(1){animation-delay:.12s}.about-hero-item:nth-child(2){animation-delay:.2s}
.about-story,.about-process,.about-paths,.about-trust{position:relative;background-color:var(--paper);background-image:radial-gradient(ellipse at 18% 32%,rgba(118,82,27,.06),transparent 42%),linear-gradient(112deg,rgba(255,255,255,.07),transparent 40%,rgba(118,82,27,.035))}
.about-story{position:relative;height:auto;min-height:0;overflow:clip}.about-story-inner{position:relative;width:calc(100% - 142px);height:100%;margin-left:clamp(72px,7.0833vw,181px);padding-block:clamp(48px,4vw,88px);display:grid;grid-template-columns:38% 1px minmax(0,1fr);column-gap:clamp(48px,4.7222vw,121px);align-items:center}.about-story-inner:before{content:"";grid-column:2;grid-row:1;width:1px;height:clamp(238px,23.2639vw,596px);background:rgba(198,150,44,.62);transform-origin:top}.about-story-lead{grid-column:1;grid-row:1;z-index:1}.about-story-lead h2{font-size:clamp(42px,4.1667vw,107px);line-height:1.1;letter-spacing:-.02em;color:var(--gold-deep)}.about-story-lead h2 span{display:block}.about-short-rule{display:block;width:84px;height:1px;margin-top:24px;background:var(--gold-line)}.about-story-copy{grid-column:3;grid-row:1;z-index:1;max-width:600px;font-size:clamp(15px,1.3889vw,35.6px);font-weight:400;line-height:1.52}.about-story-copy p+p{margin-top:20px}.about-story-etch{position:absolute;left:-170px;bottom:-150px;width:340px;opacity:.06;mix-blend-mode:multiply}
.about-company{position:relative;z-index:1;height:auto;margin:0;padding-block:clamp(56px,4.8vw,88px);overflow:clip;isolation:isolate;color:var(--cream);background:var(--forest-950)}.about-company .about-shell{width:100%;padding:0 clamp(24px,6vw,100px)}.about-company .about-eyebrow{color:var(--gold)}.about-company-grid{height:auto;margin-top:clamp(28px,2.4vw,40px);display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-items:stretch}.about-company-grid article{min-width:0;height:auto;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;text-align:center;gap:20px;padding:8px clamp(16px,2vw,32px);border-left:1px solid rgba(216,159,46,.36);transition:opacity .65s cubic-bezier(.22,1,.36,1),transform .65s cubic-bezier(.22,1,.36,1)}.about-company-grid article:first-child{border-left:0}.about-company-grid svg{width:clamp(56px,4.4vw,68px);height:clamp(56px,4.4vw,68px);flex:none;color:var(--gold);stroke:currentColor;stroke-width:1.4;vector-effect:non-scaling-stroke}.about-company-grid h2{max-width:16ch;color:var(--cream);font-size:clamp(20px,1.75vw,32px);line-height:1.15;text-wrap:balance;white-space:normal;overflow-wrap:break-word}
.about-compliance{position:relative;height:auto;min-height:clamp(240px,22vw,420px);margin:0;padding-block:clamp(64px,6vw,120px);display:grid;place-items:center;overflow:clip;color:var(--gold);background:linear-gradient(180deg,rgba(255,255,255,.045),transparent 34%),radial-gradient(circle at 50% 18%,rgba(31,79,55,.22),transparent 65%),var(--forest-950)}.about-mandala{position:absolute;top:50%;width:clamp(240px,20vw,420px);height:clamp(240px,20vw,420px);object-fit:contain;opacity:.05;mix-blend-mode:screen}.about-mandala-left{left:clamp(-240px,-9.375vw,-96px);transform:translateY(-50%)}.about-mandala-right{right:clamp(-222px,-8.6806vw,-89px);transform:translateY(-50%)}.about-compliance-copy{position:relative;z-index:2;text-align:center}.about-compliance h2{max-width:900px;padding-inline:var(--gutter);font-size:clamp(40px,4.4vw,96px);line-height:.96;letter-spacing:-.025em;color:var(--gold)}.about-compliance h2 span{display:block}.about-ornament{display:flex;align-items:center;justify-content:center;gap:16px;margin-top:24px}.about-ornament span{width:120px;height:1px;background:rgba(216,159,46,.72)}.about-ornament i{width:8px;height:8px;border:1px solid var(--gold);transform:rotate(45deg)}
.about-process{padding:clamp(56px,5vw,88px) 0 clamp(40px,3.4vw,56px)}.about-process .about-shell{width:100%}.about-process-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-items:stretch;margin-top:clamp(24px,2.2vw,36px)}.about-process-grid article{height:auto;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;text-align:center;padding:8px clamp(16px,2vw,28px);border-left:1px solid rgba(151,108,34,.3)}.about-process-grid article:first-child{border-left:0}.about-icon-ring{width:122px;height:122px;display:grid;place-items:center;border:1px solid rgba(177,142,57,.65);border-radius:50%;transition:transform .65s cubic-bezier(.22,1,.36,1)}.about-icon-ring svg{width:69px;height:69px;color:#13251B;stroke:currentColor;stroke-width:1.4}.about-process-grid h2{margin-top:20px;color:#13251B;font-size:clamp(29px,2.7083vw,48px);line-height:1.05}.about-process-grid p{max-width:34ch;margin-top:12px;font-size:clamp(14px,1.1806vw,18px);font-weight:400;line-height:1.5;color:var(--ink)}
.about-paths{padding:clamp(48px,4vw,72px) 0 clamp(56px,5vw,96px)}.about-paths .about-shell{width:100%}.about-path-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(16px,1.6vw,24px);align-items:stretch;margin-top:clamp(24px,2.2vw,36px)}.about-path-grid article{height:100%;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:clamp(28px,2.4vw,36px) clamp(20px,2vw,28px);border:1px solid rgba(177,142,57,.55);border-radius:14px;text-align:center;color:var(--cream);background:#061E14;box-shadow:0 10px 26px rgba(19,37,27,.10);transition:transform .32s ease,border-color .32s ease,box-shadow .32s ease}.about-path-grid article:hover{transform:translateY(-4px);border-color:#C49D46;box-shadow:0 18px 36px rgba(19,37,27,.16)}.about-path-grid svg{width:clamp(64px,5.4vw,78px);height:clamp(64px,5.4vw,78px);color:var(--gold);stroke:currentColor;stroke-width:1.4}.about-path-grid h2{margin-top:16px;color:var(--gold);font-size:clamp(26px,2.2vw,38px);line-height:1.08}.about-path-grid p{max-width:32ch;margin-top:12px;font-size:clamp(14px,1.05vw,17px);font-weight:400;line-height:1.5}
.about-trust{height:auto;padding-block:clamp(56px,5vw,96px)}.about-trust-inner{width:1160px;max-width:var(--container);height:auto;margin:auto;padding-inline:var(--gutter);display:grid;grid-template-columns:230px minmax(0,1fr);column-gap:55px;align-items:center}.about-trust-emblem{position:relative;width:clamp(150px,13vw,194px);height:clamp(150px,13vw,194px);display:grid;place-items:center;color:var(--gold-deep)}.about-trust-emblem>img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;opacity:.08;mix-blend-mode:multiply}.about-trust-emblem>svg{width:102px;height:102px;stroke:currentColor;stroke-width:1.4}.about-trust-copy .about-eyebrow{margin-bottom:8px}.about-trust-copy h2{color:var(--gold-deep);font-size:clamp(28px,2.4vw,52px);line-height:1.1;white-space:normal;text-wrap:balance}.about-trust-copy h2+p{margin-top:12px;max-width:62ch;font-size:clamp(14px,1.05vw,18px);line-height:1.55}.about-trust-cta{margin-top:clamp(24px,2vw,32px)}
.about-new.reveal-ready .about-company:not(.is-visible) article{opacity:0;transform:translateY(var(--reveal-rise))}.about-new .about-company article{transition:opacity var(--reveal-duration) var(--reveal-ease),transform var(--reveal-duration) var(--reveal-ease)}.about-process:not(.is-visible) .about-icon-ring{transform:scale(.96)}
@keyframes aboutFade{from{opacity:0}to{opacity:1}}@keyframes aboutReveal{to{opacity:1;transform:none}}
@media(max-width:1023px) and (min-width:768px){.about-shell{width:100%;padding-inline:var(--gutter)}.about-company .about-shell{width:100%;padding-inline:48px}.about-company-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:0}.about-company-grid article{gap:16px;padding-inline:12px;text-align:center;flex-direction:column}.about-company-grid article:nth-child(3){border-left:0;border-top:1px solid rgba(216,159,46,.36)}.about-company-grid h2{font-size:21px;text-align:center}.about-company-grid svg{width:56px;height:56px}.about-process{padding-block:42px}.about-process-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.about-process-grid article{padding-inline:16px;min-height:0}.about-process-grid h2{font-size:26px}.about-process-grid p{font-size:13px}.about-paths{padding-block:42px}.about-path-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.about-path-grid article{padding-inline:16px;min-height:0;border-radius:14px}.about-path-grid h2{font-size:26px}.about-path-grid p{font-size:13px}.about-trust-inner{max-width:calc(100% - 96px);grid-template-columns:170px 1fr;column-gap:32px}.about-trust-copy h2{font-size:28px}}
@media(max-width:767px){.about-new{--about-gutter:20px}.about-shell{width:100%;padding-inline:var(--gutter)}.about-hero{height:auto;min-height:660px}.about-hero-copy{left:20px;top:52px}.about-hero h1{font-size:42px}.about-hero .about-eyebrow{font-size:11px}.about-hero-mandala{left:-170px;top:30px;width:480px;height:480px}.about-hero-bar{left:auto;right:-45px;top:auto;bottom:-4px;width:390px;height:48%;transform:rotate(4deg)}.about-story,.about-company,.about-compliance,.about-process,.about-paths,.about-trust{height:auto}.about-story-inner{width:calc(100% - 40px);margin:auto;padding-block:48px;display:grid;grid-template-columns:1fr;gap:28px}.about-story-inner:before{grid-column:1;grid-row:2;width:84px;height:1px}.about-story-lead{grid-column:1}.about-story-lead h2{font-size:40px}.about-story-copy{grid-column:1;grid-row:3;font-size:15px}.about-story-etch{width:330px}.about-company .about-shell{width:100%;padding:0 20px}.about-company-grid,.about-process-grid,.about-path-grid{height:auto;grid-template-columns:1fr}.about-company-grid article{min-height:0;flex-direction:column;justify-content:flex-start;gap:14px;padding:22px 8px;border-left:0;border-top:1px solid rgba(216,159,46,.3)}.about-company-grid article:first-child{border-top:0}.about-company-grid h2{font-size:27px;white-space:normal}.about-company-grid svg{width:62px;height:62px}.about-compliance{min-height:330px}.about-compliance h2{font-size:44px}.about-mandala{width:280px;height:280px}.about-process{padding:42px 20px}.about-process-grid{margin-top:20px}.about-process-grid article{height:auto;min-height:0;padding:30px 12px;border-left:0;border-top:1px solid rgba(151,108,34,.3)}.about-process-grid article:first-child{border-top:0}.about-process-grid h2{font-size:34px}.about-process-grid p{font-size:15px}.about-paths{padding:38px 20px}.about-path-grid{width:100%;max-width:none;height:auto;margin-top:24px;gap:14px}.about-path-grid article{height:auto;min-height:0;transform:none;border-radius:14px}.about-path-grid article:hover{transform:translateY(-4px)}.about-path-grid h2{font-size:34px}.about-path-grid p{font-size:15px}.about-trust-inner{width:calc(100% - 40px);max-width:none;padding-block:0;padding-inline:0;grid-template-columns:1fr;gap:20px;text-align:center;justify-items:center}.about-trust-emblem{margin:auto}.about-trust-copy h2{font-size:34px;white-space:normal}.about-trust-copy>p:last-child{font-size:15px}.about-trust-copy br{display:none}.about-trust-cta a{width:100%}}
@media(prefers-reduced-motion:reduce){.about-new *{scroll-behavior:auto!important;animation-duration:.01ms!important;animation-delay:0ms!important;transition-duration:.01ms!important}.about-new [data-reveal],.about-hero-item{opacity:1;transform:none}}
`;
