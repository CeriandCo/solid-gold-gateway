import { GoldButton } from "@/components/site-chrome";

const QUESTIONS = [
  "“Is allocated storage really in my name?”",
  "“What premium is normal on a one ounce coin?”",
  "“How do I gift gold without a tax mess?”",
] as const;

export function AurumCommunitySection() {
  return (
    <section id="community" className="aurum-section aurum-community" aria-labelledby="aurum-community-title">
      <div className="aurum-container aurum-community__pulse">
        <p className="aurum-community__eyebrow">COMMUNITY PULSE</p>
        <h2 id="aurum-community-title" className="aurum-community__title">What people are actually asking</h2>

        <p className="aurum-community__source-text">
          Illustrative questions drawn from public Reddit threads.
        </p>

        <div className="aurum-community__questions">
          {QUESTIONS.map((question) => (
            <article key={question} className="aurum-community__question">
              <blockquote>{question}</blockquote>
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
            <h3 className="aurum-community__room-title">The community is being prepared on Circle</h3>
            <p className="aurum-community__room-body">
              A separate, moderated space — not a forum bolted onto this site. It is still being set up, and the house
              rules travel with you when it opens. Join The Melt and we will send you an invite.
            </p>
          </div>
          <div className="aurum-community__room-action">
            <GoldButton
              href="#subscribe"
              variant="primary"
              size="md"
              icon="none"
              className="aurum-community__cta"
            >
              Join The Melt to get an invite
            </GoldButton>
          </div>
        </div>
      </div>
    </section>
  );
}
