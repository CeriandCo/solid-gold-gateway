import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import heroElephants from "@/assets/trust-hero-elephants.png.asset.json";
import scalesImage from "@/assets/trust-scales.png.asset.json";
import sqootMandala from "@/assets/sqoot-pure-mandala.png.asset.json";

export const Route = createFileRoute("/trust-center")({
  head: () => ({
    meta: [
      { title: "Trust Center — SQOOT Pure Verified Gold Ownership" },
      {
        name: "description",
        content:
          "Independent audits, allocated storage and independent legal counsel: see how SQOOT Pure verifies and publishes proof of your gold ownership.",
      },
      { property: "og:title", content: "Trust Center — SQOOT Pure Verified Gold Ownership" },
      {
        property: "og:description",
        content: "Transparent ownership. Verified gold. Always in your name.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TrustCenterPage,
});

/* ------------------------------------------------------------------ */
/* COMPLIANCE-REVIEWABLE CONTENT                                       */
/* All Trust Center copy lives in this object for compliance review.   */
/* ------------------------------------------------------------------ */
const TC = {
  hero: {
    headingLine1: "Built for trust.",
    headingLine2Lead: "Backed by ",
    headingLine2Gold: "verification.",
    body: ["Transparent ownership. Verified gold.", "Always in your name."],
  },
  pillars: [
    {
      icon: "landmark" as const,
      title: "Registered",
      body: "Relevant registrations and company information.",
    },
    {
      icon: "personCheck" as const,
      title: "Verified Customers",
      body: "Identity verification and AML controls to protect our community.",
    },
    {
      icon: "shieldCheck" as const,
      title: "Protected Assets",
      body: "Institutional custody, secure storage and insurance coverage.",
    },
    {
      icon: "seal" as const,
      title: "Independent Oversight",
      body: "Annual third-party audits and ongoing independent verification.",
    },
  ],
  verification: {
    titleTop: "Your gold.",
    titleGold: "Verified. Always.",
    body: "Independent vault audits every 6 months. Every ounce of your gold is verified, allocated, and accounted for — and the full report is published publicly, every time.",
    checklist: [
      "Independent third-party auditor",
      "Published every 6 months",
      "Allocated — never pooled",
      "Independent legal counsel on standby",
    ],
  },
  latestAudit: {
    title: "Latest Audit",
    smallHeading: "Most Recent Report",
    intro: "The latest published audit result. Full report pages are published here within 5 business days of completion.",
    reportName: "Vault Audit — Q4 2026",
    metadata: "Scheduled: December 2026  ·  Auditor: Independent third-party firm",
    status: "Scheduled",
    metrics: [
      { label: "Total Gold Verified", value: "—", note: "Published post-audit" },
      { label: "Client Accounts", value: "—", note: "Published post-audit" },
      { label: "Discrepancies Found", value: "0", note: "Target — published post-audit" },
    ],
  },
  reportPreview: {
    eyebrow: "Audit Report — Full Pages",
    title: ["First audit report", "publishing Q4 2026"],
    body: "SQOOT Pure launched in 2026. Our first biannual audit is scheduled for Q4 2026. The complete report — every page, unredacted — will be published here the day it is received from our auditor.",
  },
  archive: {
    title: "Audit Archive",
    subtitle: "All Published Reports",
    body: "Every audit SQOOT Pure has completed, in order. All reports remain permanently accessible — nothing is removed or altered after publication.",
    rows: [
      {
        name: "Vault Audit — Q4 2026",
        meta: "Scheduled December 2026  ·  Independent auditor",
        badge: "Upcoming",
        tone: "gold" as const,
      },
      {
        name: "Vault Audit — Q2 2026",
        meta: "Scheduled June 2026  ·  Independent auditor",
        badge: "In Progress",
        tone: "green" as const,
      },
    ],
    footnote: "All future audit reports will be added to this archive permanently.",
  },
  process: {
    title: "The Process",
    subtitle: "How our audit works",
    body: "Every 6 months, an independent auditor with no financial relationship to SQOOT Pure verifies every ounce of gold held on behalf of our clients.",
    steps: [
      {
        icon: "auditor" as const,
        title: "Independent auditor engaged",
        body: "A third-party auditing firm with no financial relationship is engaged 30 days in advance.",
      },
      {
        icon: "vault" as const,
        title: "Physical vault inspection",
        body: "The auditor visits the vault and physically verifies every client coin against our allocation records.",
      },
      {
        icon: "signed" as const,
        title: "Signed report issued",
        body: "The auditor issues a signed report confirming total gold held, client accounts, and any discrepancies found.",
      },
      {
        icon: "globe" as const,
        title: "Published in full",
        body: "Every page of the report is published here within 5 business days. Nothing is withheld or redacted.",
      },
    ],
  },
  protection: {
    title: "Client Protection",
    subtitle: "Independent legal counsel",
    body: "In the event SQOOT Pure ceases operations, you do not need to rely on us to access your gold. An independent legal counsel holds your custody claim instructions and can act on your behalf directly.",
    statement: "Your gold is claimable without us.",
    cta: "Request details",
    overviewTitle: "Independent Legal Counsel — Overview",
    rows: [
      { icon: "role" as const, label: "Role:", value: "Independent Client Asset Custodian" },
      { icon: "seal" as const, label: "Jurisdiction:", value: "United States — Wyoming" },
      { icon: "doc" as const, label: "Agreement:", value: "Standing instruction — pre-authorized" },
      { icon: "alert" as const, label: "Trigger:", value: "SQOOT Pure wind-down or insolvency event" },
      {
        icon: "landmark" as const,
        label: "Client action:",
        value: "Contact directly, present verified identity, claim allocated holdings",
      },
    ],
    disclosureLead: "Counsel name, firm, and contact details are disclosed to verified SQOOT Pure account holders upon written request. Email ",
    disclosureEmail: "support@getsqoot.com",
    disclosureMid: " with subject: ",
    disclosureSubject: "Legal Counsel Details Request.",
  },
  safeguards: [
    {
      icon: "cube" as const,
      title: "Allocated storage",
      body: "All gold held through SQOOT Pure is allocated, in each client's name, and is not co-mingled with other clients' holdings or SQOOT Pure's corporate assets.",
    },
    {
      icon: "shieldCheck" as const,
      title: "Audit independence",
      body: "SQOOT Pure's audit partner has no financial interest in SQOOT Pure and is engaged under a fixed-fee arrangement not contingent on audit results.",
    },
    {
      icon: "landmark" as const,
      title: "Regulatory notice",
      body: "SQOOT Pure is operated by Fortress Gold Inc. (Wyoming), a registered precious metals dealer. This Trust Center is published for transparency purposes and does not constitute a legal guarantee.",
    },
    {
      icon: "lock" as const,
      title: "Data security",
      body: "We use bank-grade encryption and strict data handling protocols to protect your information at every step.",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* ICONS                                                               */
/* ------------------------------------------------------------------ */
type IconName =
  | "landmark"
  | "personCheck"
  | "shieldCheck"
  | "seal"
  | "check"
  | "doc"
  | "cube"
  | "lock"
  | "auditor"
  | "vault"
  | "signed"
  | "globe"
  | "role"
  | "alert";

function TcIcon({ name, className }: { name: IconName; className?: string }) {
  const p = { className, viewBox: "0 0 48 48", fill: "none", "aria-hidden": true } as const;
  switch (name) {
    case "landmark":
      return (
        <svg {...p}>
          <path d="M24 6 6 15h36L24 6Z" />
          <path d="M11 19v16m8-16v16m10-16v16m8-16v16" />
          <path d="M6 39h36M8 42h32" />
        </svg>
      );
    case "personCheck":
      return (
        <svg {...p}>
          <circle cx="21" cy="17" r="7.5" />
          <path d="M8.5 39c1.6-6.6 6.7-10.5 12.5-10.5 2 0 3.9.4 5.6 1.2" />
          <circle cx="33" cy="33" r="8" />
          <path d="m29.5 33 2.6 2.7 4.6-5" />
        </svg>
      );
    case "shieldCheck":
      return (
        <svg {...p}>
          <path d="M24 5c5 3.9 10.3 5.8 16 6.2v12c0 10.2-5.9 17.9-16 23-10.1-5.1-16-12.8-16-23v-12C13.7 10.8 19 8.9 24 5Z" />
          <path d="m17 24.5 5 5 10-11" />
        </svg>
      );
    case "seal":
      return (
        <svg {...p}>
          <circle cx="24" cy="19" r="12" />
          <circle cx="24" cy="19" r="7" />
          <path d="m16 29-3 14 11-5 11 5-3-14" />
        </svg>
      );
    case "check":
      return (
        <svg {...p}>
          <path d="m8 25 10 10 22-23" />
        </svg>
      );
    case "doc":
      return (
        <svg {...p}>
          <path d="M12 5h17l9 9v29H12V5Z" />
          <path d="M29 5v9h9" />
          <path d="M18 24h13M18 31h13M18 17h6" />
        </svg>
      );
    case "cube":
      return (
        <svg {...p}>
          <path d="m24 5 17 9.5v19L24 43 7 33.5v-19L24 5Z" />
          <path d="M7 14.5 24 24l17-9.5M24 24v19" />
        </svg>
      );
    case "lock":
      return (
        <svg {...p}>
          <rect x="9" y="20" width="30" height="23" rx="4" />
          <path d="M16 20v-6a8 8 0 0 1 16 0v6" />
          <path d="M24 29v6" />
        </svg>
      );
    case "auditor":
      return (
        <svg {...p}>
          <circle cx="18" cy="15" r="6.5" />
          <path d="M6 37c1.5-6 6-9.5 12-9.5 2.6 0 5 .7 7 1.9" />
          <circle cx="33" cy="19" r="5.5" />
          <path d="M28 42a10 10 0 0 1 16-6.5" />
          <path d="m30 32 2.8 2.9L38 29" />
        </svg>
      );
    case "vault":
      return (
        <svg {...p}>
          <rect x="6" y="8" width="36" height="32" rx="3" />
          <circle cx="24" cy="24" r="9" />
          <circle cx="24" cy="24" r="2.5" />
          <path d="M24 15v4m0 10v4m-9-9h4m10 0h4" />
        </svg>
      );
    case "signed":
      return (
        <svg {...p}>
          <path d="M12 6h15l8 8v14" />
          <path d="M27 6v8h8" />
          <path d="M12 6v36h12" />
          <path d="M18 18h8M18 25h6" />
          <path d="m41 26-12 12-5 1 1-5 12-12 4 4Z" />
        </svg>
      );
    case "globe":
      return (
        <svg {...p}>
          <circle cx="24" cy="24" r="18" />
          <path d="M6 24h36" />
          <path d="M24 6c5 5.6 7.6 11.6 7.6 18S29 36.4 24 42c-5-5.6-7.6-11.6-7.6-18S19 11.6 24 6Z" />
        </svg>
      );
    case "role":
      return (
        <svg {...p}>
          <circle cx="24" cy="16" r="7" />
          <path d="M10 40c2-7.5 7.4-11.5 14-11.5S36 32.5 38 40" />
        </svg>
      );
    case "alert":
      return (
        <svg {...p}>
          <path d="M24 7 43 40H5L24 7Z" />
          <path d="M24 19v10m0 5.5v.5" />
        </svg>
      );
  }
}

/* ------------------------------------------------------------------ */

function useReveal() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".trust-center-page [data-reveal]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((n) => n.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18 },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
}

function TrustCenterPage() {
  useReveal();

  return (
    <main className="trust-center-page">
      <SiteHeader />

      {/* HERO */}
      <section className="tc-hero">
        <img className="tc-hero-img" src={heroElephants.url} alt="Ceremonial elephants adorned with gold at a festival" />
        <div className="tc-hero-overlay" />
        <div className="tc-hero-inner">
          <div className="tc-hero-copy">
            <div className="tc-hero-text">
              <h1>
                <span>{TC.hero.headingLine1}</span>
                <span>
                  {TC.hero.headingLine2Lead}
                  <em>{TC.hero.headingLine2Gold}</em>
                </span>
              </h1>
              <span className="tc-hero-rule" />
              <p>
                {TC.hero.body[0]}
                <br />
                {TC.hero.body[1]}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST PILLARS */}
      <section className="tc-pillars" data-reveal>
        <div className="tc-pillars-grid">
          {TC.pillars.map((pillar, i) => (
            <article key={pillar.title} style={{ transitionDelay: `${i * 75}ms` }}>
              <TcIcon name={pillar.icon} className="tc-pillar-icon" />
              <div>
                <h2>{pillar.title}</h2>
                <p>{pillar.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* AUDIT DASHBOARD */}
      <section className="tc-audit">
        <div className="tc-audit-panel" data-reveal>
          {/* left verification column */}
          <div className="tc-verify" data-reveal>
            <div className="tc-verify-head">
              <span className="tc-medallion">
                <img src={sqootMandala.url} alt="" aria-hidden="true" />
              </span>
              <h2>
                <span>{TC.verification.titleTop}</span>
                <em>{TC.verification.titleGold}</em>
              </h2>
            </div>
            <p className="tc-verify-body">{TC.verification.body}</p>
            <ul className="tc-checklist">
              {TC.verification.checklist.map((item) => (
                <li key={item}>
                  <TcIcon name="check" className="tc-check" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* right column */}
          <div className="tc-report">
            <div className="tc-latest" data-reveal style={{ transitionDelay: "80ms" }}>
              <div className="tc-latest-main">
                <h2 className="tc-display-34">{TC.latestAudit.title}</h2>
                <h3 className="tc-label">{TC.latestAudit.smallHeading}</h3>
                <p className="tc-latest-intro">{TC.latestAudit.intro}</p>
                <h4 className="tc-report-name">{TC.latestAudit.reportName}</h4>
                <p className="tc-meta">{TC.latestAudit.metadata}</p>
                <span className="tc-badge tc-badge-gold">{TC.latestAudit.status}</span>
                <div className="tc-metrics">
                  {TC.latestAudit.metrics.map((m) => (
                    <div key={m.label}>
                      <p className="tc-metric-label">{m.label}</p>
                      <p className="tc-metric-value">{m.value}</p>
                      <p className="tc-metric-note">{m.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="tc-preview">
                <p className="tc-eyebrow">{TC.reportPreview.eyebrow}</p>
                <div className="tc-preview-head">
                  <span className="tc-doc-medallion">
                    <TcIcon name="doc" className="tc-doc-icon" />
                  </span>
                  <h3>
                    <span>{TC.reportPreview.title[0]}</span>
                    <span>{TC.reportPreview.title[1]}</span>
                  </h3>
                </div>
                <p className="tc-preview-body">{TC.reportPreview.body}</p>
              </aside>
            </div>

            <div className="tc-archive" data-reveal style={{ transitionDelay: "160ms" }}>
              <div className="tc-archive-intro">
                <h2 className="tc-display-32">{TC.archive.title}</h2>
                <h3 className="tc-label">{TC.archive.subtitle}</h3>
                <p className="tc-archive-body">{TC.archive.body}</p>
              </div>
              <div className="tc-archive-rows">
                {TC.archive.rows.map((row) => (
                  <div className="tc-archive-row" key={row.name}>
                    <TcIcon name="doc" className="tc-archive-icon" />
                    <div>
                      <p className="tc-archive-name">{row.name}</p>
                      <p className="tc-meta">{row.meta}</p>
                    </div>
                    <span className={`tc-badge ${row.tone === "gold" ? "tc-badge-gold" : "tc-badge-green"}`}>
                      {row.badge}
                    </span>
                  </div>
                ))}
                <p className="tc-archive-note">{TC.archive.footnote}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AUDIT PROCESS */}
      <section className="tc-process">
        <div className="tc-process-panel" data-reveal>
          <div className="tc-process-intro">
            <h2 className="tc-display-34">{TC.process.title}</h2>
            <h3 className="tc-label">{TC.process.subtitle}</h3>
            <p className="tc-process-body">{TC.process.body}</p>
          </div>
          <div className="tc-steps">
            {TC.process.steps.map((step, i) => (
              <div className="tc-step-wrap" key={step.title}>
                {i > 0 && (
                  <span className="tc-connector" style={{ transitionDelay: `${i * 120}ms` }}>
                    <svg viewBox="0 0 60 8" fill="none" aria-hidden="true">
                      <path d="M0 4h50" />
                      <path d="m46 1 4 3-4 3" />
                    </svg>
                  </span>
                )}
                <article style={{ transitionDelay: `${i * 120}ms` }}>
                  <span className="tc-step-circle">
                    <b>{i + 1}</b>
                    <TcIcon name={step.icon} className="tc-step-icon" />
                  </span>
                  <h4>{step.title}</h4>
                  <p>{step.body}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENT PROTECTION */}
      <section className="tc-protection">
        <div className="tc-protection-panel" data-reveal>
          <div className="tc-protection-left">
            <div className="tc-protection-copy">
              <h2>{TC.protection.title}</h2>
              <h3>{TC.protection.subtitle}</h3>
              <p>{TC.protection.body}</p>
              <p className="tc-statement">{TC.protection.statement}</p>
              <a className="tc-request" href="mailto:support@getsqoot.com?subject=Legal%20Counsel%20Details%20Request">
                {TC.protection.cta} <i aria-hidden="true">→</i>
              </a>
            </div>
            <img className="tc-scales" src={scalesImage.url} alt="Bronze scales of justice" />
          </div>
          <div className="tc-protection-right">
            <div className="tc-legal-panel">
              <h3>{TC.protection.overviewTitle}</h3>
              <dl>
                {TC.protection.rows.map((row) => (
                  <div className="tc-legal-row" key={row.label}>
                    <TcIcon name={row.icon} className="tc-legal-icon" />
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="tc-disclosure">
              <TcIcon name="lock" className="tc-legal-icon" />
              <p>
                {TC.protection.disclosureLead}
                <a href="mailto:support@getsqoot.com">{TC.protection.disclosureEmail}</a>
                {TC.protection.disclosureMid}
                <em>{TC.protection.disclosureSubject}</em>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SAFEGUARDS */}
      <section className="tc-safeguards">
        <div className="tc-safeguard-grid">
          {TC.safeguards.map((card, i) => (
            <article key={card.title} data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
              <div className="tc-safeguard-head">
                <TcIcon name={card.icon} className="tc-safeguard-icon" />
                <h3>{card.title}</h3>
              </div>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
      <style>{trustStyles}</style>
    </main>
  );
}

const trustStyles = `
.trust-center-page {
  --u: clamp(.7111px, .069444vw, 1.7778px);
  --tc-ease: cubic-bezier(.22, 1, .36, 1);

  /* Design tokens — Trust Center refinement pass */
  --tc-forest-950: #01120d;
  --tc-forest-900: #041f17;
  --tc-forest-850: #06291f;
  --tc-forest-800: #0a3528;

  --tc-gold: #d5a33b;
  --tc-gold-dark: #b98224;
  --tc-gold-soft: #e6c478;

  --tc-cream: #fcfaf7;
  --tc-paper: #f8f3ea;
  --tc-paper-warm: #f4ecdf;

  --tc-ink: #10261e;
  --tc-body: #25352f;
  --tc-muted: #66706b;

  --tc-border: rgba(111, 88, 48, 0.17);
  --tc-border-dark: rgba(213, 163, 59, 0.28);

  --tc-shadow-soft: 0 2px 8px rgba(21, 30, 25, 0.025), 0 16px 42px rgba(21, 30, 25, 0.075);
  --tc-shadow-hover: 0 4px 12px rgba(21, 30, 25, 0.04), 0 22px 48px rgba(21, 30, 25, 0.11);

  --tc-radius-large: 16px;
  --tc-radius-card: 12px;
  --tc-radius-small: 6px;

  /* Legacy tokens still referenced by current section CSS (migrated in later passes) */
  --tc-forest-black: #06150E;
  --tc-forest-panel: #102F24;
  --tc-cream-warm: #F6F1E8;
  --tc-cream-panel: #F3EFE7;
  --tc-white-panel: #FCFBF8;
  --tc-gold-light: #D9AA4B;
  --tc-gold-muted: #A97828;
  --tc-light-text: #F6F1E8;
  --tc-light-border: rgba(98, 80, 49, .15);
  --tc-gold-border: rgba(199, 145, 47, .43);
  --tc-dark-border: rgba(217, 170, 75, .20);

  background: var(--tc-cream);
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
.trust-center-page h1,.trust-center-page h2,.trust-center-page h3,.trust-center-page h4,.trust-center-page p,.trust-center-page dl,.trust-center-page dd,.trust-center-page dt,.trust-center-page ul{margin:0;padding:0}
.trust-center-page ul{list-style:none}
.trust-center-page p,.trust-center-page li,.trust-center-page h3,.trust-center-page h4,.trust-center-page dt,.trust-center-page dd,.trust-center-page a,.trust-center-page b{font-family:"DM Sans",system-ui,sans-serif}
.trust-center-page svg{fill:none;stroke:currentColor;stroke-width:1.35;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}

/* HERO */
.tc-hero{position:relative;height:clamp(360px,31.9444vw,460px);overflow:hidden;background:var(--tc-forest-950)}
.tc-hero-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:70% center;filter:contrast(1.03);transform-origin:center center;animation:tcHeroImage 900ms var(--tc-ease) forwards}
.tc-hero-overlay{position:absolute;inset:0;background:linear-gradient(90deg,#01120d 0%,#011711 39%,rgba(1,23,17,.94) 48%,rgba(1,23,17,.48) 61%,rgba(1,23,17,.08) 78%)}
.tc-hero-inner{position:absolute;inset:0;z-index:2;display:flex;align-items:center}
.tc-hero-copy{width:100%;max-width:1328px;margin:0 auto;padding-inline:clamp(24px,3.8889vw,56px)}
.tc-hero-text{width:48%;max-width:570px;margin-top:clamp(-30px,-2vh,-16px);opacity:0;transform:translateY(16px);animation:tcHeroText 700ms var(--tc-ease) forwards}
.tc-hero h1{font-family:"Cormorant Garamond",Georgia,serif;font-weight:500;font-size:clamp(56px,4.7vw,68px);line-height:0.98;letter-spacing:-0.025em;color:var(--tc-cream)}
.tc-hero h1 span{display:block}
.tc-hero h1 em{font-style:normal;color:var(--tc-gold)}
.tc-hero-rule{display:block;width:clamp(34px,2.5vw,40px);height:1.5px;margin:clamp(24px,1.9444vw,28px) 0;background:var(--tc-gold)}
.tc-hero p{font-size:18px;font-weight:400;line-height:1.5;color:rgba(252,250,247,.9)}

/* PILLARS */
.tc-pillars{height:clamp(150px,11.1111vw,160px);background:var(--tc-forest-900)}
.tc-pillars-grid{height:100%;max-width:1328px;margin:0 auto;padding-inline:clamp(24px,3.8889vw,56px);display:grid;grid-template-columns:repeat(4,1fr);align-items:center}
.tc-pillars-grid article{position:relative;display:grid;grid-template-columns:40px 1fr;column-gap:16px;align-items:center;padding-inline:24px;transition:opacity .6s var(--tc-ease),transform .6s var(--tc-ease)}
.tc-pillars-grid article:first-child{padding-left:0}
.tc-pillars-grid article+article:before{content:"";position:absolute;left:0;top:50%;transform:translateY(-50%);width:1px;height:68px;background:rgba(213,163,59,.20)}
.trust-center-page .tc-pillar-icon{width:40px;height:40px;color:var(--tc-gold);stroke-width:1.5}
.tc-pillars-grid h2{font-family:"DM Sans",system-ui,sans-serif;font-size:12px;font-weight:600;line-height:1;letter-spacing:.02em;text-transform:uppercase;color:var(--tc-cream)}
.tc-pillars-grid p{margin-top:8px;max-width:225px;font-size:13.5px;font-weight:400;line-height:1.45;color:rgba(252,250,247,.84)}
.tc-pillars:not(.is-visible) article{opacity:0;transform:translateY(12px)}

/* SHARED CREAM BACKGROUND */
.tc-audit,.tc-process,.tc-protection,.tc-safeguards{position:relative;background:radial-gradient(circle at 50% 18%,rgba(244,236,223,.55),rgba(244,236,223,.22) 18%,transparent 38%),var(--tc-cream)}


.tc-display-34{font-family:"Cormorant Garamond",Georgia,serif;font-weight:500;font-size:calc(34*var(--u));line-height:1;color:var(--tc-ink)}
.tc-display-32{font-family:"Cormorant Garamond",Georgia,serif;font-weight:500;font-size:calc(32*var(--u));line-height:1;color:var(--tc-ink)}
.tc-label{font-size:calc(14*var(--u));font-weight:600;color:var(--tc-ink)}
.tc-eyebrow{font-size:calc(11*var(--u));font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--tc-gold-muted)}
.tc-meta{font-size:calc(13*var(--u));line-height:1.4;color:var(--tc-muted)}
.tc-badge{display:inline-flex;align-items:center;height:calc(25*var(--u));padding-inline:calc(11*var(--u));border-radius:999px;font-size:calc(11*var(--u));font-weight:600;letter-spacing:.06em;text-transform:uppercase}
.tc-badge-gold{border:1px solid rgba(199,145,47,.45);background:rgba(217,170,75,.12);color:#90661E}
.tc-badge-green{border:1px solid rgba(45,97,71,.35);background:rgba(45,97,71,.10);color:#2C5A42}

/* AUDIT */
.tc-audit{padding:calc(44*var(--u)) calc(56*var(--u)) calc(30*var(--u))}
.tc-audit-panel{max-width:calc(1328*var(--u));min-height:calc(700*var(--u));margin:0 auto;border:1px solid var(--tc-border);border-radius:var(--tc-radius-large);background:rgba(255,255,255,.72);box-shadow:var(--tc-shadow-soft);overflow:hidden;display:grid;grid-template-columns:34% 66%}
.tc-verify{padding:calc(34*var(--u)) calc(36*var(--u));border-right:1px solid var(--tc-border)}
.tc-verify-head{display:flex;align-items:center;gap:calc(18*var(--u))}
.tc-medallion{flex:none;width:calc(72*var(--u));height:calc(72*var(--u));display:grid;place-items:center;border-radius:50%;border:1px solid var(--tc-border-dark);background:var(--tc-forest-900)}
.tc-medallion img{width:calc(46*var(--u));height:calc(46*var(--u));object-fit:contain}
.tc-verify-head h2{font-family:"Cormorant Garamond",Georgia,serif;font-weight:500;font-size:calc(31*var(--u));line-height:1.02;color:var(--tc-ink)}
.tc-verify-head h2 span,.tc-verify-head h2 em{display:block;font-style:normal}
.tc-verify-head h2 em{color:var(--tc-gold)}
.tc-verify-body{margin-top:calc(26*var(--u));max-width:calc(310*var(--u));font-size:calc(14.5*var(--u));line-height:1.55;color:var(--tc-body)}
.tc-checklist{margin-top:calc(26*var(--u));display:grid;row-gap:calc(16*var(--u))}
.tc-checklist li{display:grid;grid-template-columns:calc(18*var(--u)) 1fr;column-gap:calc(12*var(--u));align-items:center;font-size:calc(14*var(--u));line-height:1.4;color:var(--tc-body)}
.tc-check{width:calc(18*var(--u));height:calc(18*var(--u));color:var(--tc-gold);stroke-width:1.5}
.tc-report{display:grid;grid-template-rows:1fr auto;min-width:0}
.tc-latest{display:grid;grid-template-columns:62% 38%;min-height:0}
.tc-latest-main{padding:calc(30*var(--u)) calc(34*var(--u))}
.tc-latest-main .tc-display-34{font-size:calc(30*var(--u))}
.tc-latest-intro{margin-top:calc(10*var(--u));font-size:calc(13.5*var(--u));line-height:1.5;color:var(--tc-body);max-width:calc(420*var(--u))}
.tc-latest-main .tc-label{margin-top:calc(14*var(--u))}
.tc-report-name{margin-top:calc(18*var(--u));font-family:"Cormorant Garamond",Georgia,serif;font-weight:500;font-size:calc(26*var(--u));line-height:1.05;color:var(--tc-ink)}
.tc-latest-main .tc-meta{margin-top:calc(6*var(--u))}
.tc-latest-main .tc-badge{margin-top:calc(12*var(--u))}
.tc-metrics{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--tc-border);margin-top:calc(22*var(--u));padding-top:calc(20*var(--u))}
.tc-metric-label{font-size:calc(12*var(--u));font-weight:600;color:var(--tc-ink)}
.tc-metric-value{margin-top:calc(8*var(--u));font-family:"Cormorant Garamond",Georgia,serif;font-size:calc(26*var(--u));font-weight:500;line-height:1;color:var(--tc-ink)}
.tc-metric-note{margin-top:calc(8*var(--u));font-size:calc(11.5*var(--u));line-height:1.35;color:var(--tc-muted)}
.tc-preview{padding:calc(32*var(--u)) calc(30*var(--u));background:var(--tc-paper);border-left:1px solid var(--tc-border)}
.tc-preview-head{margin-top:calc(22*var(--u));display:flex;align-items:center;gap:calc(14*var(--u))}
.tc-doc-medallion{flex:none;width:calc(56*var(--u));height:calc(56*var(--u));display:grid;place-items:center;border-radius:50%;background:var(--tc-forest-900)}
.tc-doc-icon{width:calc(28*var(--u));height:calc(28*var(--u));color:var(--tc-cream);stroke-width:1.5}
.tc-preview h3{font-size:calc(16*var(--u));font-weight:600;line-height:1.35;color:var(--tc-ink)}
.tc-preview h3 span{display:block}
.tc-preview-body{margin-top:calc(18*var(--u));font-size:calc(14*var(--u));line-height:1.5;color:var(--tc-body)}
.tc-archive{border-top:1px solid var(--tc-border);display:grid;grid-template-columns:40% 60%}
.tc-archive-intro{padding:calc(24*var(--u)) calc(34*var(--u));border-right:1px solid var(--tc-border)}
.tc-archive-intro .tc-label{margin-top:calc(12*var(--u))}
.tc-archive-body{margin-top:calc(10*var(--u));font-size:calc(13*var(--u));line-height:1.5;color:var(--tc-body);max-width:calc(320*var(--u))}
.tc-archive-rows{padding:calc(18*var(--u)) calc(30*var(--u))}
.tc-archive-row{display:grid;grid-template-columns:calc(26*var(--u)) 1fr auto;column-gap:calc(15*var(--u));align-items:center;min-height:calc(60*var(--u))}
.tc-archive-row+.tc-archive-row{border-top:1px solid var(--tc-border)}
.tc-archive-icon{width:calc(26*var(--u));height:calc(26*var(--u));color:var(--tc-muted)}
.tc-archive-name{font-size:calc(14*var(--u));font-weight:600;color:var(--tc-ink)}
.tc-archive-note{margin-top:calc(12*var(--u));text-align:right;font-size:calc(11.5*var(--u));color:var(--tc-muted)}


/* PROCESS */
.tc-process{height:clamp(280px,22.9167vw,310px);padding:0 calc(56*var(--u)) calc(26*var(--u))}
.tc-process-panel{height:100%;max-width:calc(1328*var(--u));margin:0 auto;border:1px solid var(--tc-border);border-radius:var(--tc-radius-large);background:var(--tc-paper);box-shadow:var(--tc-shadow-soft);display:grid;grid-template-columns:25% 75%;padding:calc(30*var(--u)) calc(34*var(--u)) calc(26*var(--u))}
.tc-process-intro{padding:0 calc(20*var(--u)) 0 0}
.tc-process-intro .tc-display-34{font-size:calc(30*var(--u))}
.tc-process-intro .tc-label{margin-top:calc(10*var(--u))}
.tc-process-body{margin-top:calc(12*var(--u));font-size:calc(14*var(--u));line-height:1.5;max-width:calc(250*var(--u));color:var(--tc-body)}
.tc-steps{display:grid;grid-template-columns:repeat(4,1fr);align-items:start;padding:0}
.tc-step-wrap{position:relative;display:flex;justify-content:center}
.tc-step-wrap article{display:flex;flex-direction:column;align-items:center;text-align:center;opacity:0;transform:translateY(14px);transition:opacity .6s var(--tc-ease),transform .6s var(--tc-ease)}
.tc-process-panel.is-visible article{opacity:1;transform:none}
.tc-step-circle{position:relative;width:calc(86*var(--u));height:calc(86*var(--u));display:grid;place-items:center;border-radius:50%;background:var(--tc-forest-900)}
.tc-step-circle b{position:absolute;top:calc(10*var(--u));left:50%;transform:translateX(-50%);font-size:calc(12*var(--u));font-weight:600;color:var(--tc-gold-light)}
.trust-center-page .tc-step-icon{width:calc(40*var(--u));height:calc(40*var(--u));color:var(--tc-gold-light);stroke-width:1.5}
.tc-step-wrap h4{margin-top:calc(14*var(--u));font-size:calc(14*var(--u));font-weight:600;line-height:1.3;color:var(--tc-ink)}
.tc-step-wrap p{margin-top:calc(8*var(--u));max-width:calc(195*var(--u));font-size:calc(12.5*var(--u));line-height:1.5;color:var(--tc-body)}
.tc-connector{position:absolute;left:calc(-30*var(--u));top:calc(43*var(--u));width:calc(60*var(--u));color:var(--tc-gold);opacity:0;transition:opacity .5s var(--tc-ease)}
.tc-process-panel.is-visible .tc-connector{opacity:.85}
.tc-connector svg{width:100%;height:calc(8*var(--u));stroke-width:1.2}


/* CLIENT PROTECTION */
.tc-protection{height:calc(423*var(--u));padding:0 calc(56*var(--u)) calc(24*var(--u))}
.tc-protection-panel{height:calc(408*var(--u));max-width:calc(1328*var(--u));margin:0 auto;border-radius:calc(13*var(--u));overflow:hidden;border:1px solid rgba(217,170,75,.20);background:radial-gradient(circle at 47% 72%,rgba(39,91,65,.31),transparent 38%),linear-gradient(100deg,#061B13 0%,#09271D 100%);box-shadow:0 16px 34px rgba(16,34,24,.12);display:grid;grid-template-columns:59% 41%}
.tc-protection-left{position:relative}
.tc-protection-copy{position:relative;z-index:2;padding:calc(31*var(--u)) 0 0 calc(37*var(--u));width:calc(390*var(--u));opacity:0;transform:translateX(-16px);transition:opacity .7s var(--tc-ease),transform .7s var(--tc-ease)}
.tc-protection-panel.is-visible .tc-protection-copy{opacity:1;transform:none}
.tc-protection-copy h2{font-family:"Cormorant Garamond",Georgia,serif;font-weight:500;font-size:calc(31*var(--u));line-height:1.05;color:var(--tc-light-text)}
.tc-protection-copy h3{margin-top:calc(10*var(--u));font-size:calc(14*var(--u));font-weight:600;color:var(--tc-gold-light)}
.tc-protection-copy>p{margin-top:calc(14*var(--u));font-size:calc(13.5*var(--u));line-height:1.58;color:rgba(246,241,232,.88)}
.tc-statement{font-family:"Cormorant Garamond",Georgia,serif;font-size:calc(23*var(--u))!important;font-weight:500;color:var(--tc-gold-light)!important;margin-top:calc(20*var(--u))!important}
.tc-request{margin-top:calc(20*var(--u));display:inline-flex;align-items:center;gap:calc(10*var(--u));height:calc(44*var(--u));padding-inline:calc(20*var(--u));border:1px solid var(--tc-gold);border-radius:4px;background:transparent;color:var(--tc-gold-light);font-size:calc(13*var(--u));font-weight:600;transition:transform .22s var(--tc-ease),border-color .22s var(--tc-ease)}
.tc-request i{font-style:normal;transition:transform .22s var(--tc-ease)}
.tc-request:hover{transform:translateY(-1px);border-color:var(--tc-gold-light)}
.tc-request:hover i{transform:translateX(4px)}
.tc-scales{position:absolute;z-index:1;bottom:calc(17*var(--u));left:calc(655*var(--u));transform:translateX(-50%) scale(.97);width:calc(325*var(--u));height:calc(330*var(--u));object-fit:contain;mix-blend-mode:screen;opacity:0;filter:drop-shadow(0 18px 20px rgba(0,0,0,.28));transition:opacity .8s var(--tc-ease),transform .8s var(--tc-ease)}
.tc-protection-panel.is-visible .tc-scales{opacity:1;transform:translateX(-50%) scale(1)}
.tc-protection-right{padding:calc(22*var(--u)) calc(27*var(--u)) calc(22*var(--u)) 0;display:flex;flex-direction:column;opacity:0;transform:translateX(16px);transition:opacity .7s var(--tc-ease),transform .7s var(--tc-ease)}
.tc-protection-panel.is-visible .tc-protection-right{opacity:1;transform:none}
.tc-legal-panel{border:1px solid rgba(217,170,75,.20);border-radius:calc(11*var(--u)) calc(11*var(--u)) 0 0;background:rgba(255,255,255,.045);padding:calc(22*var(--u)) calc(24*var(--u))}
.tc-legal-panel h3{font-family:"Cormorant Garamond",Georgia,serif;font-weight:500;font-size:calc(23*var(--u));line-height:1.1;color:var(--tc-light-text)}
.tc-legal-panel dl{margin-top:calc(14*var(--u))}
.tc-legal-row{display:grid;grid-template-columns:calc(25*var(--u)) calc(105*var(--u)) 1fr;column-gap:calc(10*var(--u));align-items:center;min-height:calc(30*var(--u))}
.tc-legal-icon{width:calc(17*var(--u));height:calc(17*var(--u));color:var(--tc-gold)}
.tc-legal-row dt{font-size:calc(13*var(--u));color:rgba(246,241,232,.78)}
.tc-legal-row dd{font-size:calc(13*var(--u));line-height:1.35;color:var(--tc-light-text)}
.tc-disclosure{margin-top:calc(10*var(--u));display:grid;grid-template-columns:calc(25*var(--u)) 1fr;column-gap:calc(10*var(--u));border:1px solid rgba(217,170,75,.20);border-radius:0 0 calc(11*var(--u)) calc(11*var(--u));background:rgba(255,255,255,.045);padding:calc(18*var(--u)) calc(24*var(--u))}
.tc-disclosure p{font-size:calc(12.5*var(--u));line-height:1.55;color:rgba(246,241,232,.85)}
.tc-disclosure a,.tc-disclosure em{color:var(--tc-gold-light);font-style:normal}

/* SAFEGUARDS */
.tc-safeguards{height:calc(246*var(--u));padding:0 calc(56*var(--u)) calc(22*var(--u))}
.tc-safeguard-grid{max-width:calc(1328*var(--u));height:calc(219*var(--u));margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:calc(16*var(--u))}
.tc-safeguard-grid article{border:1px solid rgba(98,80,49,.10);border-radius:calc(12*var(--u));background:rgba(252,251,248,.96);padding:calc(28*var(--u)) calc(25*var(--u));box-shadow:0 12px 28px rgba(38,30,17,.055),0 2px 6px rgba(38,30,17,.025);opacity:0;transform:translateY(14px);transition:opacity .6s var(--tc-ease),transform .35s var(--tc-ease),box-shadow .35s var(--tc-ease)}
.tc-safeguard-grid article.is-visible{opacity:1;transform:none}
.tc-safeguard-grid article.is-visible:hover{transform:translateY(-4px);box-shadow:0 18px 34px rgba(38,30,17,.09),0 3px 8px rgba(38,30,17,.04)}
.tc-safeguard-grid article:hover .tc-safeguard-icon{transform:translateY(-1px)}
.tc-safeguard-head{display:grid;grid-template-columns:calc(40*var(--u)) 1fr;column-gap:calc(13*var(--u));align-items:start}
.tc-safeguard-icon{width:calc(36*var(--u));height:calc(36*var(--u));color:var(--tc-gold);transition:transform .35s var(--tc-ease)}
.tc-safeguard-grid h3{font-size:calc(15*var(--u));font-weight:600;line-height:1.2;color:var(--tc-ink)}
.tc-safeguard-grid p{margin-top:calc(12*var(--u));font-size:calc(12.5*var(--u));font-weight:400;line-height:1.52;color:var(--tc-body)}

.trust-center-page [data-reveal]{transition:opacity .7s var(--tc-ease),transform .7s var(--tc-ease)}
.tc-audit-panel[data-reveal]{opacity:0;transform:translateY(16px)}
.tc-audit-panel.is-visible{opacity:1;transform:none}
@keyframes tcHeroText{to{opacity:1;transform:none}}
@keyframes tcHeroImage{from{transform:scale(1.025);opacity:.94}to{transform:scale(1);opacity:1}}
.tc-statement{max-width:calc(360*var(--u))}

@media (max-width:1023px){
  .trust-center-page{--u:1px}
  .tc-hero{height:520px}
  .tc-hero-copy{padding-inline:40px}
  .tc-hero-text{width:min(520px,55%);margin-top:-16px}
  .tc-hero h1{font-size:56px}
  .tc-pillars{height:auto;padding:32px 40px}
  .tc-pillars-grid{grid-template-columns:repeat(2,1fr);row-gap:28px;padding-inline:0}
  .tc-pillars-grid article:nth-child(odd){padding-left:0}
  .tc-pillars-grid article:nth-child(3):before{display:none}
  .tc-audit,.tc-process,.tc-protection,.tc-safeguards{height:auto;padding:40px 32px}
  .tc-audit-panel,.tc-process-panel,.tc-protection-panel{height:auto;grid-template-columns:1fr}
  .tc-verify{border-right:0;border-bottom:1px solid var(--tc-light-border)}
  .tc-steps{grid-template-columns:repeat(2,1fr);row-gap:34px}
  .tc-connector{display:none}
  .tc-process-intro{padding:32px}
  .tc-protection-copy{width:auto;padding:28px 28px 0}
  .tc-scales{position:relative;left:auto;bottom:auto;transform:none;display:block;margin:16px auto 0;width:280px;height:280px}
  .tc-protection-panel.is-visible .tc-scales{transform:none}
  .tc-protection-right{padding:0 28px 28px}
  .tc-safeguard-grid{height:auto;grid-template-columns:repeat(2,1fr)}
  .trust-center-page p,.trust-center-page li,.trust-center-page dd,.trust-center-page dt{font-size:13.5px}
  .tc-archive{grid-template-columns:1fr}
  .tc-archive-intro{border-right:0;border-bottom:1px solid var(--tc-light-border)}
  .tc-latest{min-height:0}
}
@media (max-width:767px){
  .tc-hero{min-height:620px;height:620px}
  .tc-hero-img{object-position:70% center}
  .tc-hero-copy{padding-inline:24px}
  .tc-hero-text{width:100%;margin-top:-12px}
  .tc-hero h1{font-size:50px}
  .tc-hero p{font-size:18px}
  .tc-pillars{padding:28px 24px}
  .tc-pillars-grid{padding-inline:0}
  .tc-pillars-grid article{padding-left:0}
  .tc-pillars-grid article+article:before{display:none}
  .tc-audit,.tc-process,.tc-protection,.tc-safeguards{padding:32px 20px}
  .tc-latest{grid-template-columns:1fr}
  .tc-preview{border-left:0;border-top:1px solid var(--tc-light-border)}
  .tc-verify,.tc-latest-main,.tc-archive-intro,.tc-archive-rows{padding:24px}
  .tc-steps{grid-template-columns:1fr;padding:24px}
  .tc-safeguard-grid{grid-template-columns:1fr}
  .tc-request{min-height:44px}
  .tc-archive-row{grid-template-columns:calc(30*var(--u)) 1fr;row-gap:8px}
  .tc-archive-row .tc-badge{grid-column:2}
  .tc-archive-note{text-align:left}
}
@media (max-width:479px){
  .tc-pillars-grid{grid-template-columns:1fr}
  .tc-pillars-grid article{padding-left:0}
  .tc-pillars-grid article+article:before{display:none}
  .tc-legal-row{grid-template-columns:calc(25*var(--u)) 1fr;row-gap:2px}
  .tc-legal-row dd{grid-column:2}
}
@media (prefers-reduced-motion:reduce){
  .trust-center-page *,.trust-center-page *:before,.trust-center-page *:after{animation:none!important;transition:none!important}
  .trust-center-page [data-reveal],.tc-hero-text,.tc-scales,.tc-protection-copy,.tc-protection-right,.tc-step-wrap article,.tc-connector,.tc-safeguard-grid article{opacity:1!important;transform:none!important}
}
`;
