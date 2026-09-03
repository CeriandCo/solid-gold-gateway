import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Award,
  Baby,
  Check,
  CirclePlay,
  Gem,
  Gift,
  Globe2,
  GraduationCap,
  HandHeart,
  Heart,
  LockKeyhole,
  PartyPopper,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import heroGift from "@/assets/gifting-target-hero.jpg";
import weddingPhoto from "@/assets/occasion-weddings.jpg";
import arrivalsPhoto from "@/assets/occasion-new-arrivals.jpg";
import birthdayPhoto from "@/assets/occasion-birthdays.jpg";
import achievementPhoto from "@/assets/occasion-achievements.jpg";
import festivalPhoto from "@/assets/occasion-festivals.jpg";
import familyPhoto from "@/assets/occasion-family.jpg";
import engravedGold from "@/assets/personal-engraved-bar.jpg";
import giftCard from "@/assets/personal-note-card.jpg";
import boxedGold from "@/assets/personal-boxed-bar.jpg";
import closingGift from "@/assets/gifting-closing-banner.jpg";

export const Route = createFileRoute("/gifting-new")({
  head: () => ({
    meta: [
      { title: "Gift Real Gold — SQOOT Pure" },
      {
        name: "description",
        content:
          "Celebrate life's most precious moments with real gold, personalised and beautifully delivered by SQOOT Pure.",
      },
      { property: "og:title", content: "Gift Real Gold — SQOOT Pure" },
      {
        property: "og:description",
        content: "A thoughtful, meaningful and timeless gift of real gold.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://solid-gold-gateway.lovable.app/gifting-new" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://solid-gold-gateway.lovable.app/gifting-new" }],
  }),
  component: GiftingNewPage,
});

function Mandala({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className} fill="none">
      <circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="1" />
      <path
        d="M16 2.5c2.7 3.7 3.5 6.7 0 10-3.5-3.3-2.7-6.3 0-10ZM16 29.5c-2.7-3.7-3.5-6.7 0-10 3.5 3.3 2.7 6.3 0 10ZM2.5 16c3.7-2.7 6.7-3.5 10 0-3.3 3.5-6.3 2.7-10 0ZM29.5 16c-3.7 2.7-6.7 3.5-10 0 3.3-3.5 6.3-2.7 10 0ZM6.45 6.45c4.5.7 7.2 2.25 7.1 7.1-4.85.1-6.4-2.6-7.1-7.1ZM25.55 25.55c-4.5-.7-7.2-2.25-7.1-7.1 4.85-.1 6.4 2.6 7.1 7.1ZM25.55 6.45c-.7 4.5-2.25 7.2-7.1 7.1-.1-4.85 2.6-6.4 7.1-7.1ZM6.45 25.55c.7-4.5 2.25-7.2 7.1-7.1.1 4.85-2.6 6.4-7.1 7.1Z"
        stroke="currentColor"
        strokeWidth="0.85"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16" r="12.75" stroke="currentColor" strokeWidth="0.55" />
    </svg>
  );
}

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const features: Feature[] = [
  { icon: Gift, title: "Meaningful", description: "A timeless symbol of love and blessings" },
  { icon: ShieldCheck, title: "Real & Secure", description: "Real gold, fully insured in U.S. vaults" },
  { icon: HandHeart, title: "Personalised", description: "Add a name, message or special date" },
  { icon: Truck, title: "Beautifully Delivered", description: "Premium packaging, ready to gift" },
  { icon: RefreshCw, title: "Redeemable", description: "Redeem or upgrade anytime" },
  { icon: Globe2, title: "Global Access", description: "Send love anywhere in the world" },
];

const occasions = [
  { label: "Weddings", image: weddingPhoto, icon: Heart },
  { label: "New Arrivals", image: arrivalsPhoto, icon: Baby },
  { label: "Birthdays", image: birthdayPhoto, icon: PartyPopper },
  { label: "Achievements", image: achievementPhoto, icon: GraduationCap },
  { label: "Festivals", image: festivalPhoto, icon: Sparkles },
  { label: "Family Milestones", image: familyPhoto, icon: Award },
];

const assurances: Feature[] = [
  { icon: Gem, title: "100% Real Gold", description: "Allocated, audited and insured" },
  { icon: ShieldCheck, title: "Secure Vaulted", description: "Stored in fully insured U.S. vaults" },
  { icon: LockKeyhole, title: "Fully Insured", description: "Your gold is protected every step of the way" },
  { icon: RefreshCw, title: "Redeem or Upgrade", description: "Redeem, sell or upgrade at any time" },
  { icon: Send, title: "Send Anywhere", description: "Delivered globally with care and discretion" },
];

function GiftingNewPage() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".gifting-new [data-reveal]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sections.forEach((section) => section.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.18 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <main id="top" className="gifting-new">
      <SiteHeader />

      <section className="gift-hero" aria-labelledby="gift-hero-title">
        <img src={heroGift} alt="Forest green SQOOT Pure gift box with bronze ribbon and gold bar" width={1920} height={720} fetchPriority="high" />
        <div className="gift-hero-shade" />
        <div className="gift-hero-inner">
          <div className="gift-hero-copy">
              <div className="gift-overline gift-hero-item">
                <span />
                <p>Gifting gold</p>
                <Mandala />
              </div>
              <h1 id="gift-hero-title" className="gift-hero-item">
                Celebrate love
                <span>with a gift</span>
                <span>that lasts.</span>
              </h1>
              <p className="gift-hero-body gift-hero-item">
                Thoughtful, meaningful and timeless. Real gold that marks life&apos;s most precious moments.
              </p>
              <div className="gift-hero-actions gift-hero-item">
                <a href="#occasions" className="gift-button gift-button-gold">
                  Explore Gifting <ArrowRight />
                </a>
                <a href="#personalise" className="gift-button gift-button-outline">
                  How It Works <CirclePlay />
                </a>
              </div>
          </div>
        </div>
      </section>

      <section className="gift-benefits" data-reveal aria-label="Gifting benefits">
        <div className="gift-benefits-inner">
          {features.map(({ icon: Icon, title, description }) => (
            <article key={title} className="gift-benefit">
              <Icon size={32} strokeWidth={1.35} absoluteStrokeWidth />
              <h2>{title}</h2>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="occasions" className="gift-occasions" data-reveal>
        <div className="gift-occasions-inner">
          <header>
            <div className="gift-section-overline">
              <span />
              <p>For every occasion</p>
              <Mandala />
              <span />
            </div>
            <h2>Mark life&apos;s most precious moments</h2>
          </header>

          <div className="gift-occasion-grid">
            {occasions.map(({ label, image, icon: Icon }) => (
              <article key={label} className="gift-occasion-card">
                <div className="gift-occasion-image">
                  <img
                    src={image}
                    alt={`${label} gold gifting inspiration`}
                    width={1024}
                    height={1024}
                    loading="lazy"
                  />
                </div>
                <div className="gift-occasion-label"><h3>{label}</h3></div>
                 <span className="gift-occasion-icon"><Icon size={18} strokeWidth={1.3} absoluteStrokeWidth /></span>
              </article>
            ))}
          </div>

          <a href="#personalise" className="gift-view-all">View all occasions <ArrowRight /></a>
        </div>
      </section>

      <section id="personalise" className="gift-personal" data-reveal>
        <div className="gift-personal-copy">
          <BotanicalLine />
          <div>
            <div className="gift-personal-overline"><p>Make it personal</p><Mandala /></div>
            <h2>Add a personal touch<span>that will be remembered</span><span>forever.</span></h2>
            <p className="gift-personal-body">
              Engrave a name, date or message to make your gift truly unique and unforgettable.
            </p>
            <ul>
              {["Name, initial, date or short message", "Beautiful engraving on gold", "Premium gift packaging", "Include a personalised note"].map((item) => (
                <li key={item}>
                  <span><Check strokeWidth={2} /></span>
                  {item}
                </li>
              ))}
            </ul>
            <a href="#closing-gift" className="gift-button gift-button-dark">
              Personalise Your Gift <ArrowRight />
            </a>
          </div>
        </div>

        <div className="gift-mosaic-main">
          <img
            src={engravedGold}
            alt="Gold gift bar engraved for Aanya on dark green velvet"
            width={1200}
            height={1600}
            loading="lazy"
          />
        </div>
        <div className="gift-mosaic-side">
          <div>
          <img
            src={giftCard}
            alt="SQOOT Pure presentation card with a handwritten personal note"
            width={1200}
            height={912}
            loading="lazy"
          />
          </div>
          <div>
          <img
            src={boxedGold}
            alt="Small gold bar inside an open forest green presentation box"
            width={1200}
            height={912}
            loading="lazy"
          />
          </div>
        </div>
      </section>

      <section className="gift-trust" data-reveal aria-label="Gold ownership assurances">
        <div className="gift-trust-inner">
          {assurances.map(({ icon: Icon, title, description }) => (
            <article key={title}>
              <Icon strokeWidth={1.3} absoluteStrokeWidth />
              <h2>{title}</h2>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="closing-gift" className="gift-closing" data-reveal>
        <img
          src={closingGift}
          alt="Forest green gift box, bronze ribbon and gold bar beside an olive sprig"
          width={1920}
          height={800}
          loading="lazy"
        />
        <div className="gift-closing-shade" />
        <div className="gift-closing-inner">
          <div>
            <div className="gift-closing-overline"><span /><p>A gift that lasts generations</p></div>
            <h2>More than a gift.<span>A legacy of love.</span></h2>
            <p>
              Give real gold that will be cherished today and passed down through generations.
            </p>
            <a href="#top" className="gift-button gift-button-gold">
              Start Gifting Gold <ArrowRight />
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
      <style>{giftingStyles}</style>
    </main>
  );
}

function BotanicalLine() {
  return (
    <svg className="gift-botanical" viewBox="0 0 150 332" aria-hidden="true" fill="none">
      <path d="M11 332C19 272 23 217 50 169C71 132 108 103 128 40" />
      <path d="M37 199C15 186 4 168 4 145C28 149 43 164 49 184M57 159C48 132 53 111 71 94C84 116 80 137 63 154M85 121C79 96 87 75 107 61C117 84 110 105 91 118M109 80C112 54 125 37 147 29C150 54 137 71 113 81M29 242C50 227 69 225 89 235C72 253 51 256 29 242M18 286C38 272 57 272 75 282C59 299 39 301 18 286" />
    </svg>
  );
}

const giftingStyles = `
.gifting-new {
  --forest-950: #0D2117; --forest-900: #112118; --forest-800: #173126; --forest-700: #244637;
  --cream-50: #FBF6EE; --cream-100: #F8EEE2; --cream-150: #F4E9DB; --cream-200: #EFE4D3;
  --gold-500: #C9A84C; --gold-400: #D9B260; --gold-300: #E6C77D; --gold-deep: #A97827;
  --ink: #16271F; --body-dark: #30382F; --cream-text: #FAF5EA;
  --muted-cream: rgba(250,245,234,.76); --light-divider: rgba(120,91,48,.22); --dark-divider: rgba(201,168,76,.27);
  --page-max: clamp(1320px,91.6667vw,2347px); --page-padding: clamp(32px,4.2vw,108px);
  color: var(--body-dark); background: var(--cream-50); font-family: "DM Sans", system-ui, sans-serif;
  font-synthesis: none; -webkit-font-smoothing: antialiased; overflow-x: clip;
}
.gifting-new h1,.gifting-new h2,.gifting-new h3 { font-family: "Cormorant Garamond", Georgia, serif; letter-spacing: 0; }
.gifting-new > header { height: clamp(76px,7.25vw,186px); background: var(--forest-950); animation: giftFade .3s ease both; }
.gifting-new > header > div > div { min-height: clamp(76px,7.25vw,186px); max-width: clamp(1440px,100vw,2560px); width: calc(100% - 72px); margin-inline: auto; padding-inline: 0; }
.gifting-new > header img { width: clamp(145px,13.9vw,356px); }
.gifting-new > header nav[aria-label="Primary navigation"] { gap: clamp(22px,3.35vw,86px); }
.gifting-new > header nav[aria-label="Primary navigation"] a { font-family: "DM Sans",sans-serif; font-size: clamp(11px,1vw,26px); opacity: .92; }
.gifting-new > header nav[aria-label="Primary navigation"] a[href="/gifting"] { color: var(--gold-500); }
.gifting-new > header nav[aria-label="Primary navigation"] a[href="/gifting"]::after { width: 36px; height: 1.5px; bottom: 0; }
.gifting-new > header a[href="#login"] { width: auto; height: clamp(42px,3.34vw,86px); padding-inline: clamp(17px,1.74vw,45px); white-space: nowrap; border-color: var(--gold-500); color: var(--gold-500); transition: color .22s cubic-bezier(.22,1,.36,1),background-color .22s cubic-bezier(.22,1,.36,1); }
.gifting-new > header a[href="#login"]:hover { background: var(--gold-500); color: var(--forest-950); }
.gift-hero { position: relative; height: clamp(384px,37.5vw,960px); overflow: hidden; color: var(--cream-text); background: var(--forest-950); }
.gift-hero > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; animation: giftHeroImage 1.1s cubic-bezier(.22,1,.36,1) both; }
.gift-hero-shade { position: absolute; inset: 0; background: linear-gradient(90deg,rgba(8,34,24,.98) 0%,rgba(8,34,24,.94) 27%,rgba(8,34,24,.70) 42%,rgba(8,34,24,.20) 61%,rgba(8,34,24,0) 76%); }
.gift-hero-inner { position: relative; height: 100%; max-width: var(--page-max); margin: auto; padding-inline: var(--page-padding); display: flex; align-items: center; }
.gift-hero-copy { width: clamp(360px,35.16vw,900px); margin-top: -4px; margin-left: clamp(36px,3.515625vw,90px); }
.gift-overline,.gift-section-overline,.gift-personal-overline,.gift-closing-overline { display: flex; align-items: center; text-transform: uppercase; color: var(--gold-400); }
.gift-overline { gap: 9px; margin-bottom: 17px; }
.gift-overline > span { width: 28px; height: 1px; background: var(--gold-500); }
.gift-overline p { font-size: clamp(11px,.97vw,25px); line-height: 1; font-weight: 600; letter-spacing: .18em; }
.gift-overline svg { width: 17px; height: 17px; }
.gift-hero h1 { max-width: 100%; color: var(--cream-text); font-size: clamp(54px,5.28vw,136px); font-weight: 500; line-height: .96; letter-spacing: -.025em; }
.gift-hero h1 span { display: block; }
.gift-hero-body { max-width: 93%; margin-top: 16px; color: rgba(250,245,234,.88); font-size: clamp(13px,1.1vw,29px); font-weight: 400; line-height: 1.55; }
.gift-hero-actions { display: flex; gap: 12px; margin-top: 24px; }
.gift-button { display: inline-flex; align-items: center; justify-content: center; gap: 12px; height: clamp(42px,3.89vw,100px); padding-inline: clamp(20px,1.75vw,45px); border-radius: 3px; font-size: clamp(12px,1.05vw,27px); font-weight: 600; line-height: 1; transition: color .22s,background-color .22s,border-color .22s,transform .22s; }
.gift-button svg { width: 16px; height: 16px; stroke-width: 1.5; transition: transform .22s; }
.gift-button:hover { transform: translateY(-1px); }.gift-button:hover svg { transform: translateX(4px); }
.gift-button-gold { color: var(--forest-950); background: var(--gold-500); }.gift-button-gold:hover { background: var(--gold-300); }
.gift-button-outline { color: var(--cream-text); border: 1px solid var(--gold-500); background: transparent; }.gift-button-outline:hover { color: var(--forest-950); background: var(--gold-500); }
.gift-button-dark { height: clamp(42px,3.75vw,96px); margin-top: 17px; color: var(--cream-text); background: var(--forest-900); }.gift-button-dark svg { color: var(--gold-400); }
.gift-hero-item { opacity: 0; transform: translateY(16px); animation: giftReveal .6s cubic-bezier(.22,1,.36,1) forwards; }.gift-hero-item:nth-child(1){animation-delay:.12s}.gift-hero-item:nth-child(2){animation-delay:.2s}.gift-hero-item:nth-child(3){animation-delay:.28s}.gift-hero-item:nth-child(4){animation-delay:.36s}
.gift-benefits { height: clamp(140px,calc(13.75vw - .75px),351px); background: var(--cream-150); }
.gift-benefits-inner { width: min(89.84%,1294px); height: 100%; margin: auto; display: grid; grid-template-columns: repeat(6,1fr); align-items: center; }
.gift-benefit { min-width: 0; height: clamp(76px,7.4vw,190px); padding-inline: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; border-left: 1px solid var(--light-divider); }
.gift-benefit:first-child { border-left: 0; }.gift-benefit > svg { width: 32px; height: 32px; flex: 0 0 32px; color: var(--forest-800); }
.gift-benefit h2 { margin-top: 9px; color: var(--forest-900); font-size: clamp(16px,1.25vw,32px); font-weight: 600; line-height: 1.1; }
.gift-benefit p { max-width: 82%; margin-top: 3px; font-size: clamp(10.5px,.77vw,20px); font-weight: 400; line-height: 1.35; }
.gift-occasions { height: clamp(304px,29.72vw,761px); padding: clamp(17px,1.67vw,43px) var(--page-padding) clamp(15px,1.46vw,38px); background-color: var(--cream-100); background-image: radial-gradient(rgba(120,91,48,.035) .6px,transparent .7px); background-size: 5px 5px; }
.gift-occasions-inner { max-width: var(--page-max); height: 100%; margin: auto; display: flex; flex-direction: column; align-items: center; }
.gift-occasions header { text-align: center; }.gift-section-overline { justify-content: center; gap: 8px; }
.gift-section-overline > span { width: 27px; height: 1px; background: var(--gold-500); opacity: .8; }.gift-section-overline p { font-size: clamp(10px,.76vw,20px); font-weight: 600; letter-spacing: .2em; }.gift-section-overline svg { width: 15px; height: 15px; }
.gift-occasions h2 { margin-top: 5px; margin-bottom: clamp(10px,1.1vw,29px); color: var(--ink); font-size: clamp(29px,2.92vw,75px); font-weight: 500; line-height: 1.05; }
.gift-occasion-grid { width: clamp(924px,90.23vw,2310px); max-width: 100%; display: grid; grid-template-columns: repeat(6,minmax(0,1fr)); gap: clamp(5px,.49vw,13px); }
.gift-occasion-card { position: relative; height: clamp(185px,18.07vw,463px); overflow: hidden; border-radius: 8px; background: var(--forest-900); transition: transform .42s cubic-bezier(.22,1,.36,1),box-shadow .42s; }
.gift-occasion-image { height: 67.57%; overflow: hidden; }.gift-occasion-image img { width: 100%; height: 100%; object-fit: cover; transition: transform .42s cubic-bezier(.22,1,.36,1); }
.gift-occasion-label { height: 32.43%; display: grid; place-items: center; padding: 13px 5px 2px; color: var(--cream-text); background: var(--forest-900); text-align: center; }.gift-occasion-label h3 { font-size: clamp(14px,1.04vw,27px); font-weight: 500; line-height: 1.05; }
.gift-occasion-icon { position: absolute; left: 50%; top: 67.57%; width: clamp(36px,2.78vw,72px); height: clamp(36px,2.78vw,72px); display: grid; flex: none; place-items: center; border: 1px solid var(--gold-500); border-radius: 50%; color: var(--gold-400); background: var(--forest-900); transform: translate(-50%,-50%); transition: border-color .42s; }.gift-occasion-icon svg { width: 18px; height: 18px; flex: none; }
.gift-occasion-card:hover { transform: translateY(-4px); box-shadow: 0 18px 38px rgba(18,33,24,.16); }.gift-occasion-card:hover img { transform: scale(1.045); }.gift-occasion-card:hover .gift-occasion-icon { border-color: var(--gold-300); }
.gift-view-all { display: inline-flex; align-items: center; gap: 5px; margin-top: clamp(10px,1.18vw,31px); color: var(--gold-deep); font-size: 12px; font-weight: 500; text-decoration: underline; text-underline-offset: 4px; }.gift-view-all svg { width: 15px; height: 15px; }
.gift-personal { height: clamp(332px,32.36vw,829px); min-height: 0; display: grid; grid-template-columns: 43% 27% 30%; overflow: hidden; background: var(--cream-200); }
.gift-personal > * { min-width: 0; min-height: 0; height: 100%; }.gift-personal-copy { position: relative; display: flex; align-items: center; }.gift-personal-copy > div { position: relative; width: 68.2%; margin-left: 27.7%; }
.gift-botanical { position: absolute; inset-block: 0; left: 0; width: 35%; height: 100%; color: var(--gold-deep); opacity: .5; }.gift-botanical path { stroke: currentColor; stroke-width: .9; vector-effect: non-scaling-stroke; }
.gift-personal-overline { gap: 7px; color: var(--gold-deep); }.gift-personal-overline p { font-size: clamp(10px,.76vw,20px); font-weight: 600; letter-spacing: .2em; }.gift-personal-overline svg { width: 14px; height: 14px; }
.gift-personal h2 { margin-top: 7px; color: var(--forest-900); font-size: clamp(32px,3.2vw,82px); font-weight: 500; line-height: 1.02; letter-spacing: -.02em; }.gift-personal h2 span { display: block; }
.gift-personal-body { max-width: 90%; margin-top: clamp(9px,1.04vw,27px); font-size: clamp(12px,1.04vw,27px); line-height: 1.5; }
.gift-personal ul { display: grid; gap: clamp(4px,.48vw,13px); margin-top: clamp(8px,.7vw,18px); }.gift-personal li { display: flex; align-items: center; gap: 7px; font-size: clamp(11px,.9vw,23px); line-height: 1.15; }.gift-personal li > span { width: clamp(14px,1.18vw,31px); height: clamp(14px,1.18vw,31px); flex: none; display: grid; place-items: center; border-radius: 50%; color: var(--cream-text); background: var(--forest-900); }.gift-personal li svg { width: 65%; height: 65%; }
.gift-mosaic-main,.gift-mosaic-side > div { overflow: hidden; }.gift-mosaic-main img,.gift-mosaic-side img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s cubic-bezier(.22,1,.36,1); }.gift-mosaic-main img { object-position: center 64%; }.gift-mosaic-main:hover img,.gift-mosaic-side > div:hover img { transform: scale(1.025); }
.gift-mosaic-side { display: grid; grid-template-rows: 1fr 1fr; gap: 2px; padding-left: 2px; background: var(--cream-200); }.gift-mosaic-side img { object-position: center; }
.gift-trust { height: clamp(119px,calc(11.67vw - .5px),298px); color: var(--cream-text); background-color: var(--forest-950); background-image: linear-gradient(115deg,rgba(255,255,255,.018),transparent 40%),radial-gradient(ellipse at 30% 10%,rgba(201,168,76,.035),transparent 45%); }
.gift-trust-inner { width: min(78.13%,2000px); height: 100%; margin: auto; display: grid; grid-template-columns: repeat(5,1fr); align-items: center; }.gift-trust article { min-width: 0; height: clamp(76px,7.4vw,190px); padding-inline: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; border-left: 1px solid rgba(201,168,76,.35); }.gift-trust article:first-child { border-left: 0; }.gift-trust svg { width: clamp(28px,2.22vw,57px); height: clamp(28px,2.22vw,57px); color: var(--gold-400); }.gift-trust h2 { margin-top: 5px; color: var(--gold-400); font-family: "DM Sans",sans-serif; font-size: clamp(12px,.9vw,23px); font-weight: 600; line-height: 1.1; }.gift-trust p { max-width: 80%; margin-top: 3px; color: rgba(250,245,234,.82); font-size: clamp(9.5px,.73vw,19px); line-height: 1.35; }
.gift-closing { position: relative; height: clamp(210px,19.44vw,498px); overflow: hidden; color: var(--cream-text); }.gift-closing > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 67% center; }.gift-closing-shade { position: absolute; inset: 0; background: linear-gradient(90deg,rgba(63,31,12,.92) 0%,rgba(63,31,12,.79) 31%,rgba(25,39,26,.34) 57%,rgba(15,31,22,.06) 78%); }.gift-closing-inner { position: relative; max-width: var(--page-max); height: 100%; margin: auto; padding-inline: var(--page-padding); display: flex; align-items: center; }.gift-closing-inner > div { width: clamp(340px,33.2vw,850px); margin-left: calc(5% + clamp(36px,3.515625vw,90px)); }.gift-closing-overline { gap: 9px; color: var(--gold-400); }.gift-closing-overline > span { width: 42px; height: 1px; background: var(--gold-500); }.gift-closing-overline p { font-size: clamp(10px,.76vw,20px); font-weight: 600; letter-spacing: .18em; }.gift-closing h2 { margin-top: 7px; color: var(--cream-text); font-size: clamp(34px,3.35vw,86px); font-weight: 500; line-height: .98; }.gift-closing h2 span { display: block; }.gift-closing-inner > div > p { max-width: 88%; margin-top: 7px; color: rgba(250,245,234,.86); font-size: clamp(11px,.97vw,25px); line-height: 1.45; }.gift-closing .gift-button { margin-top: 10px; height: clamp(42px,3.61vw,93px); }
.gifting-new > footer > div { min-height: 84px; padding-block: 15px; }.gifting-new > footer img { width: 132px; }.gifting-new > footer a { font-size: 12px; }
.gifting-new [data-reveal] { opacity: 0; transform: translateY(18px); transition: opacity .65s cubic-bezier(.22,1,.36,1),transform .65s cubic-bezier(.22,1,.36,1); }.gifting-new [data-reveal].is-visible { opacity: 1; transform: none; }
@keyframes giftFade { from{opacity:0}to{opacity:1} } @keyframes giftHeroImage { from{transform:scale(1.025)}to{transform:scale(1)} } @keyframes giftReveal { to{opacity:1;transform:none} }
@media (min-width: 1025px) {
  .gift-personal-body { margin-top: min(14px,calc(10.67px + (100vw - 1024px) * .002)); }
  .gift-personal ul { gap: min(5px,calc(4.92px + (100vw - 1024px) * .0002)); margin-top: 8px; }
  .gift-button-dark { margin-top: max(7px,calc(17px - (100vw - 1024px) * .024)); }
}
@media (max-width: 1023px) {
  .gifting-new > header { height: 76px; }.gifting-new > header > div > div { min-height: 76px; width: 100%; padding-inline: 24px; }.gifting-new > header img { width: 145px; }.gifting-new > header a[href="#login"] { width: auto; }
  .gift-hero { height: 620px; }.gift-hero > img { object-position: 60% center; }.gift-hero-copy { width: 52%; margin-left: 0; }.gift-hero h1 { font-size: clamp(52px,6vw,58px); }
  .gift-benefits { height: auto; }.gift-benefits-inner { width: 100%; grid-template-columns: repeat(3,1fr); padding: 12px 28px; }.gift-benefit { height: 106px; border-bottom: 1px solid var(--light-divider); }.gift-benefit:nth-child(3n+1) { border-left: 0; }.gift-benefit:nth-child(n+4) { border-bottom: 0; }
  .gift-occasions { height: auto; padding-block: 28px; }.gift-occasion-grid { grid-template-columns: repeat(3,1fr); gap: 10px; }.gift-occasion-card { height: 250px; }.gift-view-all { margin-top: 20px; }
  .gift-personal { height: auto; grid-template-columns: 45% 32% 23%; min-height: 520px; }.gift-personal-copy > div { width: 76%; margin-left: 18%; }.gift-personal h2 { font-size: 38px; }.gift-personal-copy { padding-block: 30px; }
  .gift-trust { height: auto; }.gift-trust-inner { width: 100%; grid-template-columns: repeat(3,1fr); padding: 14px 30px; }.gift-trust article { height: 112px; }.gift-trust article:nth-child(4) { border-left: 0; }
  .gift-closing { height: 300px; }.gift-closing-inner > div { margin-left: 0; }
}
@media (max-width: 767px) {
  .gifting-new { --page-padding: 20px; }.gifting-new > header { height: 72px; }.gifting-new > header > div > div { min-height: 72px; padding-inline: 18px; }.gifting-new > header img { width: 138px; }.gifting-new > header button { width: 44px; height: 44px; padding: 0; display: grid; place-items: center; }.gifting-new > header nav[aria-label="Mobile navigation"] { position: absolute; left: 0; right: 0; z-index: 50; }.gifting-new > header nav[aria-label="Mobile navigation"] a[href="#login"] { min-width: 148px; height: 44px; }
  .gift-hero { height: 700px; }.gift-hero > img { object-position: 66% bottom; }.gift-hero-shade { background: linear-gradient(180deg,rgba(8,34,24,.98) 0%,rgba(8,34,24,.91) 45%,rgba(8,34,24,.42) 68%,rgba(8,34,24,.08) 100%); }.gift-hero-inner { align-items: flex-start; padding-top: 55px; }.gift-hero-copy { width: 100%; max-width: 390px; }.gift-hero h1 { font-size: clamp(48px,13vw,52px); }.gift-hero-body { max-width: 320px; }.gift-hero-actions { flex-direction: column; width: min(100%,330px); }.gift-button { min-height: 48px; }
  .gift-benefits-inner { grid-template-columns: repeat(2,1fr); padding: 12px 14px; }.gift-benefit { height: 122px; }.gift-benefit:nth-child(3n+1) { border-left: 1px solid var(--light-divider); }.gift-benefit:nth-child(odd) { border-left: 0; }.gift-benefit:nth-child(n+4) { border-bottom: 1px solid var(--light-divider); }.gift-benefit:nth-child(n+5) { border-bottom: 0; }
  .gift-occasions { padding-inline: 0; }.gift-occasions header { padding-inline: 20px; }.gift-occasions h2 { font-size: 34px; }.gift-occasion-grid { width: 100%; display: flex; gap: 10px; overflow-x: auto; padding: 0 20px 18px; scroll-snap-type: x mandatory; scrollbar-width: none; }.gift-occasion-grid::-webkit-scrollbar { display:none; }.gift-occasion-card { flex: 0 0 82%; height: 330px; scroll-snap-align: start; }.gift-view-all { margin-top: 2px; }
  .gift-personal { display: flex; flex-direction: column; }.gift-personal-copy { min-height: 445px; padding: 44px 20px; }.gift-personal-copy > div { width: min(100%,350px); margin: auto; }.gift-personal h2 { font-size: 40px; }.gift-personal-body { font-size: 14px; }.gift-personal li { font-size: 13px; }.gift-botanical { width: 42%; }.gift-mosaic-main { height: 520px; }.gift-mosaic-side { height: 520px; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr; padding-left: 0; padding-top: 2px; gap: 2px; }
  .gift-trust-inner { grid-template-columns: repeat(2,1fr); padding: 14px; }.gift-trust article { height: 125px; }.gift-trust article:nth-child(odd) { border-left: 0; }.gift-trust article:nth-child(4) { border-left: 1px solid rgba(201,168,76,.35); }.gift-trust article:last-child { grid-column: 1/-1; }
  .gift-closing { height: 440px; }.gift-closing > img { object-position: 66% bottom; }.gift-closing-shade { background: linear-gradient(180deg,rgba(63,31,12,.94) 0%,rgba(63,31,12,.78) 46%,rgba(25,39,26,.22) 73%,rgba(15,31,22,.04) 100%); }.gift-closing-inner { align-items: flex-start; padding-top: 44px; }.gift-closing-inner > div { width: min(100%,340px); }.gift-closing h2 { font-size: 40px; }.gift-closing .gift-button { min-height: 48px; }
  .gifting-new > footer > div { min-height: 0; padding-block: 24px; }.gifting-new > footer nav { flex-wrap: wrap; justify-content: center; }
}
@media (prefers-reduced-motion: reduce) { .gifting-new * { scroll-behavior: auto !important; animation-duration: .01ms !important; animation-delay: 0ms !important; transition-duration: .01ms !important; }.gifting-new [data-reveal] { opacity: 1; transform: none; } }
`;