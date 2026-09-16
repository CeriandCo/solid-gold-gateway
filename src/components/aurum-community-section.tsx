import { GoldButton } from "@/components/site-chrome";

const CIRCLE_URL = "https://aurum-be0064.circle.so";

const QUESTIONS = [
  { question: "“Is allocated storage really in my name?”", count: "412 discussions" },
  { question: "“What premium is normal on a one ounce coin?”", count: "338 discussions" },
  { question: "“How do I gift gold without a tax mess?”", count: "227 discussions" },
] as const;

export function AurumCommunitySection() {
  return (
    <section id="community" className="aurum-section aurum-community" aria-labelledby="aurum-community-title">
      <div className="aurum-container aurum-community__pulse">
        <p className="aurum-community__eyebrow">COMMUNITY PULSE</p>
        <h2 id="aurum-community-title" className="aurum-community__title">What people are actually asking</h2>

        <p className="aurum-community__source-text">
          Illustrative questions drawn from public Reddit threads. Live pulse is wired to aurum_community_pulse once
          moderation rules are signed off.
        </p>

        <div className="aurum-community__questions">
          {QUESTIONS.map(({ question, count }) => (
            <article key={count} className="aurum-community__question">
              <blockquote>{question}</blockquote>
              <p>{count}</p>
            </article>
          ))}
        </div>

        <aside className="aurum-community__notice">
          <p className="aurum-community__notice-label">THESE ARE OPINIONS, NOT FACTS</p>
          <p className="aurum-community__notice-text">
            Public community comments may contain opinion or speculation. They are reproduced here to show what people
            ask, not because they are correct. Nothing on this page is verified by SQOOT Pure, and nothing here is
            advice.
          </p>
        </aside>
      </div>

      <div className="aurum-community__room">
        <div className="aurum-container aurum-community__room-inner">
          <div className="aurum-community__room-copy">
            <p className="aurum-community__room-eyebrow">WHERE THE ROOM LIVES</p>
            <h3 className="aurum-community__room-title">The community is hosted on Circle</h3>
            <p className="aurum-community__room-body">
              A separate, moderated space — not a forum bolted onto this site. You will sign in there, and the house
              rules travel with you.
            </p>
            <p className="aurum-community__room-url">
              <a href={CIRCLE_URL} target="_blank" rel="noopener">aurum-be0064.circle.so</a>
            </p>
          </div>
          <div className="aurum-community__room-action">
            <GoldButton
              href={CIRCLE_URL}
              target="_blank"
              rel="noopener"
              variant="primary"
              size="md"
              icon="none"
              className="aurum-community__cta"
            >
              Open the community
            </GoldButton>
          </div>
        </div>
      </div>
    </section>
  );
}
