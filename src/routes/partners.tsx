import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { SiteHeader, SiteFooter, GoldButton } from "@/components/site-chrome";
import { InnerPageHero, InnerHeroSecondaryLink } from "@/components/inner-page-hero";
import heroImage from "@/assets/trust-centre-hero-gold-register.png.asset.json";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Partners — SQOOT Pure" },
      {
        name: "description",
        content:
          "For advisors, wealth managers and family offices: give clients a simple way to buy fine physical gold, fully backed in the vault. Apply to partner.",
      },
      { property: "og:title", content: "Partners — SQOOT Pure" },
      {
        property: "og:description",
        content: "Fine gold for your clients. Simple to introduce. Apply to the SQOOT Pure partner program.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PartnersPage,
});

const WHO = [
  "Financial advisors and wealth managers",
  "Family offices and private-client teams",
  "CPAs, insurance professionals and other approved advisors",
  "Qualified introducers with established client relationships",
];

const WHY = [
  "Fine physical gold, fully backed in the vault",
  "Live gold pricing, with every applicable fee shown before confirmation",
  "Start with $25, add more anytime and sell when they choose",
  "Use their gold toward an eligible coin delivered to their home",
  "View their gold balance, transaction history and monthly statements in My Gold",
];

const STEPS = [
  ["Apply", "Tell us about you and your firm."],
  ["Get approved", "Approved partners receive a unique partner link."],
  ["Introduce clients", "Clients open their own accounts, complete identity verification and buy directly through SQOOT Pure."],
  ["Earn rewards", "Eligible partners receive monthly referral rewards for qualifying active clients under the Partner Terms."],
] as const;

const ROLES = ["Financial advisor", "Wealth manager", "Family office", "CPA", "Insurance professional", "Qualified introducer", "Other"];
const LICENSES = ["Investment adviser representative", "Registered representative", "CPA", "Insurance producer", "None", "Other"];
const CLIENT_COUNTS = ["1–10", "11–50", "51–200", "200+"];
const STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "District of Columbia",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine",
  "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia",
  "Washington", "West Virginia", "Wisconsin", "Wyoming",
];

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="pt-field">
      <span className="pt-label">
        {label}
        {required ? <span aria-hidden="true"> *</span> : <span className="pt-optional"> (optional)</span>}
      </span>
      {children}
    </label>
  );
}

function Select({ name, options }: { name: string; options: string[] }) {
  return (
    <select name={name} required defaultValue="" className="pt-input">
      <option value="" disabled>
        Select…
      </option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function PartnersPage() {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      return;
    }
    setSubmitted(true);
  }

  return (
    <main id="top" className="pt-page">
      <SiteHeader />

      <InnerPageHero
        titleId="partners-hero-title"
        eyebrow="For advisors · Wealth managers · Family offices"
        title={<><span>Fine gold for your clients.</span><span><em>Simple to introduce.</em></span></>}
        body="SQOOT Pure gives your clients a simple way to buy fine physical gold, from $25 to larger holdings. Each client's gold balance is fully backed in the vault, priced using live gold prices, and available to sell when they choose. Apply to become a partner and, if approved, earn referral rewards for eligible clients you introduce."
        actions={
          <>
            <GoldButton href="#apply">Apply to partner</GoldButton>
            <InnerHeroSecondaryLink href="#how-it-works">How the program works</InnerHeroSecondaryLink>
          </>
        }
        imageSrc={heroImage.url}
        imageAlt="A gloved hand holds a gold bar beside an open register"
        imageVariant="trust"
      />

      <section className="pt-section" aria-labelledby="pt-who">
        <div className="site-container pt-two">
          <div>
            <p className="pt-eyebrow">Partners</p>
            <h2 id="pt-who" className="pt-h2">Who it's for</h2>
            <ul className="pt-list">
              {WHO.map((item) => (
                <li key={item}><Check strokeWidth={2.5} aria-hidden="true" />{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="pt-eyebrow">For your clients</p>
            <h2 className="pt-h2">Why your clients will like it</h2>
            <ul className="pt-list">
              {WHY.map((item) => (
                <li key={item}><Check strokeWidth={2.5} aria-hidden="true" />{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="pt-section pt-dark" aria-labelledby="pt-how">
        <div className="site-container">
          <p className="pt-eyebrow">The program</p>
          <h2 id="pt-how" className="pt-h2">How the partner program works</h2>
          <ol className="pt-steps">
            {STEPS.map(([title, text], i) => (
              <li key={title} className="pt-step">
                <span className="pt-step-num">{String(i + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
          <p className="pt-note">Partners never collect, hold or transmit client money. Clients buy, hold and sell directly through SQOOT Pure.</p>
          <p className="pt-small">
            Participation is subject to approval, Partner Terms and any required employer or firm authorization. Partners must clearly disclose their compensated relationship with SQOOT Pure whenever they share their partner link.
          </p>
        </div>
      </section>

      <section id="apply" className="pt-section" aria-labelledby="pt-apply">
        <div className="site-container">
          <p className="pt-eyebrow">Apply</p>
          <h2 id="pt-apply" className="pt-h2">Apply to partner</h2>
          {submitted ? (
            <p className="pt-success" role="status">Thank you. We'll review your application and contact you within two business days.</p>
          ) : (
            <form className="pt-form" onSubmit={onSubmit} noValidate>
              <Field label="Full name" required><input name="fullName" required autoComplete="name" className="pt-input" /></Field>
              <Field label="Firm name" required><input name="firmName" required autoComplete="organization" className="pt-input" /></Field>
              <Field label="Firm website"><input name="website" type="url" autoComplete="url" className="pt-input" /></Field>
              <Field label="Role" required><Select name="role" options={ROLES} /></Field>
              <Field label="Registration or license" required><Select name="license" options={LICENSES} /></Field>
              <Field label="Work email" required><input name="email" type="email" required autoComplete="email" className="pt-input" /></Field>
              <Field label="Phone"><input name="phone" type="tel" autoComplete="tel" className="pt-input" /></Field>
              <Field label="State" required><Select name="state" options={STATES} /></Field>
              <Field label="Approximate number of clients interested in gold" required><Select name="clients" options={CLIENT_COUNTS} /></Field>
              <label className="pt-field pt-full">
                <span className="pt-label">Message <span className="pt-optional">(optional)</span></span>
                <textarea name="message" rows={4} className="pt-input" />
              </label>
              <label className="pt-check pt-full">
                <input type="checkbox" name="authorization" required />
                <span>I confirm that I have obtained, or will obtain, any authorization required by my employer or firm before referring clients.</span>
              </label>
              <label className="pt-check pt-full">
                <input type="checkbox" name="terms" required />
                <span>
                  I agree to the <Link to="/partner-terms">Partner Program Terms</Link> and acknowledge the <Link to="/privacy">Privacy Notice</Link>.
                </span>
              </label>
              <div className="pt-full">
                <GoldButton type="submit">Submit application</GoldButton>
              </div>
            </form>
          )}
        </div>
      </section>

      <SiteFooter />
      <style>{styles}</style>
    </main>
  );
}

const styles = `
.pt-page{background:var(--cream);color:var(--ink)}
.pt-section{padding-block:clamp(72px,8.3vw,120px);scroll-margin-top:24px}
.pt-dark{background:var(--forest-deep);color:var(--warm-white)}
.pt-eyebrow{margin:0 0 12px;color:var(--gold-dark);font-family:"Inter",Arial,sans-serif;font-size:12px;font-weight:600;letter-spacing:.2em;text-transform:uppercase}
.pt-dark .pt-eyebrow{color:var(--gold)}
.pt-h2{margin:0 0 32px;color:var(--forest-deep);font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(32px,3.4vw,52px);font-weight:600;line-height:1.05;letter-spacing:-.02em}
.pt-dark .pt-h2{color:var(--warm-white)}
.pt-two{display:grid;grid-template-columns:1fr 1fr;gap:clamp(40px,6vw,96px)}
.pt-list{list-style:none;margin:0;padding:0;display:grid;gap:14px}
.pt-list li{display:flex;gap:12px;align-items:flex-start;font-family:"Inter",Arial,sans-serif;font-size:16px;line-height:1.55}
.pt-list svg{width:18px;height:18px;flex:none;margin-top:3px;color:var(--gold-dark)}
.pt-steps{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
.pt-step{border:1px solid color-mix(in srgb,var(--warm-white) 15%,transparent);border-radius:8px;padding:28px}
.pt-step-num{display:block;color:var(--gold);font-family:"Cormorant Garamond",Georgia,serif;font-size:36px;font-weight:600;line-height:1}
.pt-step h3{margin:16px 0 8px;font-family:"Inter",Arial,sans-serif;font-size:18px;font-weight:600}
.pt-step p{margin:0;color:color-mix(in srgb,var(--warm-white) 80%,transparent);font-family:"Inter",Arial,sans-serif;font-size:15px;line-height:1.55}
.pt-note{margin:40px 0 0;max-width:720px;font-family:"Inter",Arial,sans-serif;font-size:16px;line-height:1.6}
.pt-small{margin:14px 0 0;max-width:720px;color:color-mix(in srgb,var(--warm-white) 65%,transparent);font-family:"Inter",Arial,sans-serif;font-size:13px;line-height:1.6}
.pt-form{display:grid;grid-template-columns:1fr 1fr;gap:20px 24px;max-width:880px}
.pt-full{grid-column:1/-1}
.pt-field{display:flex;flex-direction:column;gap:8px}
.pt-label{font-family:"Inter",Arial,sans-serif;font-size:14px;font-weight:600;color:var(--forest-deep)}
.pt-optional{font-weight:400;color:color-mix(in srgb,var(--ink) 60%,transparent)}
.pt-input{width:100%;min-height:48px;padding:12px 14px;border:1px solid color-mix(in srgb,var(--forest) 25%,transparent);border-radius:2px;background:var(--warm-white);color:var(--ink);font-family:"Inter",Arial,sans-serif;font-size:15px}
.pt-input:focus-visible{outline:2px solid var(--gold);outline-offset:1px}
.pt-form:has(:user-invalid) .pt-input:user-invalid{border-color:var(--destructive)}
.pt-check{display:flex;gap:12px;align-items:flex-start;font-family:"Inter",Arial,sans-serif;font-size:14px;line-height:1.55}
.pt-check input{width:18px;height:18px;margin-top:2px;flex:none;accent-color:var(--gold-dark)}
.pt-check a{color:var(--forest-deep);text-decoration:underline;text-underline-offset:3px}
.pt-check a:hover{color:var(--gold-dark)}
.pt-success{max-width:640px;padding:24px 28px;border:1px solid var(--gold);border-radius:8px;background:var(--cream-2);font-family:"Inter",Arial,sans-serif;font-size:16px;line-height:1.6}
@media(max-width:1023px){.pt-steps{grid-template-columns:repeat(2,1fr)}}
@media(max-width:767px){.pt-two,.pt-form,.pt-steps{grid-template-columns:1fr}}
`;
