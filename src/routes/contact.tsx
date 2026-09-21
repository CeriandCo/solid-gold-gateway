import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import logoImage from "@/assets/sqoot-pure-logo.png";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Get In Touch — SQOOT Pure" },
      {
        name: "description",
        content:
          "Contact SQOOT Pure: email hello@sqoot.us, find us in Sugar Land, TX, or follow us on X, Facebook, LinkedIn and YouTube.",
      },
      { property: "og:title", content: "Get In Touch — SQOOT Pure" },
      {
        property: "og:description",
        content: "Email hello@sqoot.us, find us in Sugar Land, TX, or follow SQOOT Pure on social.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const contactChannels = [
  {
    label: "Email",
    value: "hello@sqoot.us",
    href: "mailto:hello@sqoot.us",
    note: "For everything — orders, accounts, gifting and general questions.",
  },
  {
    label: "Website",
    value: "sqootpure.com",
    href: "https://sqootpure.com",
    note: "Our home on the web.",
  },
  {
    label: "Learn",
    value: "aurum.sqootpure.com",
    href: "https://aurum.sqootpure.com",
    note: "Live gold prices, history and daily market notes.",
  },
  {
    label: "Address",
    value: "SQOOT PURE, Sugar Land TX 77478",
    note: "Our office in Sugar Land, Texas.",
  },
];

const socialLinks = [
  { Icon: Twitter, label: "X (Twitter)", href: "https://x.com/sqootpure", handle: "x/sqootpure" },
  { Icon: Facebook, label: "Facebook", href: "https://www.facebook.com/sqootpure", handle: "facebook/sqootpure" },
  { Icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/sqootpure", handle: "linkedin/sqootpure" },
  { Icon: Youtube, label: "YouTube", href: "https://www.youtube.com/@sqootpure", handle: "youtube/sqootpure" },
];

function ContactPage() {
  return (
    <main id="top" className="contact-page">
      <SiteHeader />

      <section className="contact-hero" aria-labelledby="contact-title">
        <img src={logoImage} alt="SQOOT Pure" width={567} height={200} className="contact-hero__logo" />
        <p className="contact-hero__eyebrow">Contact</p>
        <h1 id="contact-title">Get in touch.</h1>
        <p className="contact-hero__body">
          Questions about gold, gifting or your account — write to us and a real person will reply.
        </p>
      </section>

      <section className="contact-channels" aria-label="How to reach us">
        <div className="contact-channels__grid">
          {contactChannels.map((channel) => (
            <article key={channel.label} className="contact-card">
              <p className="contact-card__label">{channel.label}</p>
              {channel.href ? (
                <a className="contact-card__value" href={channel.href}>
                  {channel.value}
                </a>
              ) : (
                <p className="contact-card__value">{channel.value}</p>
              )}
              <p className="contact-card__note">{channel.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-social" aria-label="Follow SQOOT Pure">
        <p className="contact-social__heading">Follow us</p>
        <ul className="contact-social__list">
          {socialLinks.map(({ Icon, label, href, handle }) => (
            <li key={label}>
              <a className="contact-social__link" href={href} target="_blank" rel="noopener noreferrer">
                <span className="contact-social__icon" aria-hidden="true">
                  <Icon strokeWidth={1.5} />
                </span>
                <span className="contact-social__text">
                  <span className="contact-social__name">{label}</span>
                  <span className="contact-social__handle">{handle}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <SiteFooter />
      <style>{contactStyles}</style>
    </main>
  );
}

const contactStyles = `
.contact-page{background:var(--cream);color:var(--ink)}

.contact-hero{background:var(--forest-deep);color:var(--warm-white);padding-block:clamp(64px,8.3vw,120px);text-align:center}
.contact-hero__logo{width:clamp(180px,16vw,240px);height:auto;margin:0 auto clamp(32px,4vw,48px)}
.contact-hero__eyebrow{margin:0 0 14px;color:var(--gold);font-family:"Inter",Arial,sans-serif;font-size:12px;font-weight:600;line-height:18px;letter-spacing:.22em;text-transform:uppercase}
.contact-hero h1{margin:0;color:var(--warm-white);font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(40px,4.5vw,64px);font-weight:600;line-height:1.02;letter-spacing:-.02em}
.contact-hero__body{max-width:520px;margin:20px auto 0;color:color-mix(in srgb,var(--warm-white) 80%,transparent);font-family:"Inter",Arial,sans-serif;font-size:16px;line-height:1.6}

.contact-channels{padding-block:clamp(72px,8.3vw,120px)}
.contact-channels__grid{display:grid;grid-template-columns:repeat(2,1fr);gap:24px;max-width:var(--container);margin-inline:auto;padding-inline:var(--gutter)}
.contact-card{background:var(--cream-2);border:1px solid color-mix(in srgb,var(--forest) 10%,transparent);border-radius:4px;padding:clamp(24px,3vw,40px)}
.contact-card__label{margin:0 0 10px;color:var(--gold-dark);font-family:"Inter",Arial,sans-serif;font-size:12px;font-weight:600;letter-spacing:.18em;text-transform:uppercase}
.contact-card__value{margin:0;color:var(--forest-deep);font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(22px,2.2vw,30px);font-weight:600;line-height:1.15;text-decoration:none}
a.contact-card__value:hover{color:var(--gold-dark)}
.contact-card__note{margin:10px 0 0;color:color-mix(in srgb,var(--ink) 70%,transparent);font-family:"Inter",Arial,sans-serif;font-size:14px;line-height:1.55}

.contact-social{background:var(--forest);color:var(--warm-white);padding-block:clamp(56px,6vw,88px)}
.contact-social__heading{margin:0 0 28px;max-width:var(--container);margin-inline:auto;padding-inline:var(--gutter);color:var(--gold);font-family:"Inter",Arial,sans-serif;font-size:12px;font-weight:600;letter-spacing:.22em;text-transform:uppercase}
.contact-social__list{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;max-width:var(--container);margin-inline:auto;padding-inline:var(--gutter);list-style:none}
.contact-social__link{display:flex;align-items:center;gap:14px;padding:18px 20px;border:1px solid color-mix(in srgb,var(--warm-white) 15%,transparent);border-radius:4px;color:var(--warm-white);text-decoration:none;transition:border-color .22s,background-color .22s}
.contact-social__link:hover{border-color:var(--gold);background:color-mix(in srgb,var(--gold) 8%,transparent)}
.contact-social__icon{display:grid;place-items:center;width:40px;height:40px;flex:none;border:1px solid color-mix(in srgb,var(--gold) 60%,transparent);border-radius:9999px;color:var(--gold)}
.contact-social__icon svg{width:18px;height:18px}
.contact-social__text{display:flex;flex-direction:column;min-width:0}
.contact-social__name{font-family:"Inter",Arial,sans-serif;font-size:14px;font-weight:600}
.contact-social__handle{color:color-mix(in srgb,var(--warm-white) 62%,transparent);font-family:"Inter",Arial,sans-serif;font-size:13px}

@media(max-width:900px){
  .contact-channels__grid{grid-template-columns:1fr}
  .contact-social__list{grid-template-columns:repeat(2,1fr)}
}
@media(max-width:560px){
  .contact-social__list{grid-template-columns:1fr}
}
@media(prefers-reduced-motion:reduce){
  .contact-social__link{transition:none}
}
`;
