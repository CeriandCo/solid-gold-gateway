import { Link } from "@tanstack/react-router";
import spotImage from "@/assets/aurum/aurum-caution-1-spot.webp.asset.json";
import allocatedImage from "@/assets/aurum/aurum-caution-2-allocated.webp.asset.json";
import storageImage from "@/assets/aurum/aurum-caution-3-storage.webp.asset.json";
import sellingImage from "@/assets/aurum/aurum-caution-4-selling.webp.asset.json";

const CAUTIONS = [
  {
    image: spotImage.url,
    title: "Spot is not your price",
    body: "The spot price is a wholesale reference. What you pay includes a dealer premium on top.",
  },
  {
    image: allocatedImage.url,
    title: "Fully backed or pooled",
    body: "Gold fully backed in the vault is yours specifically. Pooled metal is a claim on a shared holding. They are not the same.",
  },
  {
    image: storageImage.url,
    title: "Storage has a cost",
    body: "Vaulted gold carries an ongoing fee. Home storage carries insurance and security questions instead.",
  },
  {
    image: sellingImage.url,
    title: "Selling takes time",
    body: "Physical gold is liquid but not instant. Settlement, shipping and verification all take time.",
  },
] as const;

const GUIDES = [
  {
    label: "OWNERSHIP",
    title: "Physical Gold vs Gold ETF: What You Actually Own",
    to: "/learn/physical-gold-vs-gold-etf",
  },
  {
    label: "BUYING",
    title: "How to Buy Physical Gold Online Safely",
    to: "/learn/how-to-buy-gold-safely",
  },
  {
    label: "GIFTING",
    title: "Gifting Gold: A Guide for Weddings, Festivals, and Milestones",
    to: "/learn/gifting-gold-guide",
  },
] as const;

export function AurumLearnSection() {
  return (
    <section id="learn" className="aurum-section aurum-learn" aria-labelledby="aurum-learn-title">
      <div className="site-container">
        <p className="aurum-note-eyebrow">LEARN</p>
        <h2 id="aurum-learn-title" className="aurum-note-title">Four things worth understanding first</h2>
        <p className="aurum-note-dek">Plain explanations for people buying physical gold for the first time.</p>

        <div className="aurum-learn__cautions">
          {CAUTIONS.map((caution) => (
            <article key={caution.title} className="aurum-learn__caution">
              <img src={caution.image} alt="" width={800} height={600} loading="lazy" />
              <h3>{caution.title}</h3>
              <p>{caution.body}</p>
            </article>
          ))}
        </div>

        <div className="aurum-learn__guides">
          <div className="aurum-learn__guides-head">
            <p>GUIDES</p>
            <span>Longer reads published on this site</span>
          </div>
          <nav aria-label="AURUM guides">
            {GUIDES.map((guide) => (
              <Link key={guide.to} to={guide.to} className="aurum-learn__guide">
                <span className="aurum-learn__guide-label">{guide.label}</span>
                <span className="aurum-learn__guide-title">{guide.title}</span>
                <span className="aurum-learn__guide-action">Read the guide →</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}