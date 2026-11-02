import { Link } from "@tanstack/react-router";

import { WAITLIST_CONSENT } from "@/lib/leads/consent";

/** The one waitlist consent sentence; the stored text is WAITLIST_CONSENT.text. */
export function WaitlistConsent({ className }: { className?: string }) {
  return (
    <p className={className}>
      {WAITLIST_CONSENT.lead}{" "}
      <Link to="/privacy" className="underline underline-offset-4">
        {WAITLIST_CONSENT.linkText}
      </Link>
      .
    </p>
  );
}
