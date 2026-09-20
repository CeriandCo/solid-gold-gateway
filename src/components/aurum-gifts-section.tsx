import { GoldButton } from "@/components/site-chrome";
import weddingsImage from "@/assets/aurum/aurum-gift-weddings.webp.asset.json";
import newArrivalsImage from "@/assets/aurum/aurum-gift-new-arrivals.webp.asset.json";
import festivalsImage from "@/assets/aurum/aurum-gift-festivals.webp.asset.json";

const GIFTS = [
  {
    image: weddingsImage.url,
    title: "Weddings",
    body: "Across South Asia and the Gulf, gold given at a wedding is both a blessing and a household reserve.",
  },
  {
    image: newArrivalsImage.url,
    title: "New arrivals",
    body: "A small coin set aside at birth is a long-standing way to mark a life beginning.",
  },
  {
    image: festivalsImage.url,
    title: "Festivals",
    body: "Buying gold on Akshaya Tritiya and Dhanteras is a tradition measured in centuries, not seasons.",
  },
] as const;

export function AurumGiftsSection() {
  return (
    <section id="gifts" className="aurum-section aurum-gifts" aria-labelledby="aurum-gifts-title">
      <div className="site-container">
        <p className="aurum-note-eyebrow">GIFTS THAT LAST</p>
        <h2 id="aurum-gifts-title" className="aurum-note-title">Why gold marks a milestone</h2>
        <p className="aurum-note-dek">
          Weddings, births and festivals — the thinking behind the tradition, and what to understand before you give it.
        </p>

        <div className="aurum-gifts__cards">
          {GIFTS.map((gift) => (
            <article key={gift.title} className="aurum-gifts__card">
              <img src={gift.image} alt="" width={800} height={500} loading="lazy" />
              <div className="aurum-gifts__copy">
                <h3>{gift.title}</h3>
                <p>{gift.body}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="aurum-gifts__handoff">

          <GoldButton
            to="/gifting"
            variant="primary"
            size="md"
            icon="none"
            className="aurum-gifts__cta"
          >
            See gifting options <span aria-hidden="true">→</span>
          </GoldButton>
        </div>
      </div>
    </section>
  );
}
