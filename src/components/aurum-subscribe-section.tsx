import { GoldButton } from "@/components/site-chrome";
import type { MeltConsentNotice } from "@/lib/newsletter.functions";

const BENEFITS = [
  { title: "Go beyond the headlines", body: "Explore the stories, context and ideas behind physical gold." },
  { title: "Keep building your knowledge", body: "Discover more detailed reads and fresh perspectives as you learn." },
  { title: "Be part of the conversation", body: "Join the AURUM community and explore gold with other curious minds." },
] as const;

export function AurumSubscribeSection(_props: { consentNotice?: MeltConsentNotice }) {
  return (
    <section id="subscribe" className="aurum-section aurum-subscribe" aria-labelledby="aurum-subscribe-title">
      <div className="site-container aurum-subscribe__invitation">
        <div>
          <p className="aurum-subscribe__eyebrow">KEEP YOUR CURIOSITY GROWING</p>
          <h2 id="aurum-subscribe-title" className="aurum-subscribe__title">
            The MELT Newsletter &amp; more
          </h2>
          <p className="aurum-subscribe__dek">
            A deeper understanding of gold starts with a little curiosity. Explore The MELT Newsletter,
            thoughtful insights and ongoing conversations in AURUM — a place to keep learning, one idea at a time.
          </p>
          <GoldButton
            href="https://aurum-be0064.circle.so/"
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="hero"
            aria-label="Join AURUM (opens in a new tab)"
            className="aurum-subscribe__join"
          >
            Join AURUM
          </GoldButton>
        </div>
        <div className="aurum-subscribe__more">
          <p className="aurum-subscribe__eyebrow">MORE TO DISCOVER</p>
          <ul className="aurum-subscribe__benefits">
            {BENEFITS.map(({ title, body }) => (
              <li key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
