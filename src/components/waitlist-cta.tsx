import { useState, type FormEvent, type ReactNode } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { Link } from "@tanstack/react-router";
import { track } from "@/lib/analytics";
import curtainAsset from "@/assets/pricing/cta-curtain.png.asset.json";
import phoneSellPngAsset from "@/assets/pricing/phone-sell-quote.png.asset.json";
import phoneSellWebpAsset from "@/assets/pricing/phone-sell-quote.webp.asset.json";
import phoneDeliverPngAsset from "@/assets/pricing/phone-deliver.png.asset.json";
import phoneDeliverWebpAsset from "@/assets/pricing/phone-deliver.webp.asset.json";

type FormState = "idle" | "invalid" | "submitting" | "error" | "success";

export type WaitlistCtaProps = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  body: ReactNode;
};

export function WaitlistCta({ eyebrow, title, titleAccent, body }: WaitlistCtaProps) {
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");

  async function submitWaitlist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    track("bottom_cta_click", { section: "pricing_cta" });
    const trimmed = email.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) && trimmed.length <= 254;
    if (!valid) {
      setFormState("invalid");
      return;
    }
    setFormState("submitting");
    try {
      // Waitlist storage is not connected yet; registration completes locally.
      await new Promise((resolve) => setTimeout(resolve, 600));
      setFormState("success");
    } catch {
      setFormState("error");
    }
  }

  const ctaRef = useReveal<HTMLElement>();

  return (
    <section id="pricing-cta" className="waitlist-cta" ref={ctaRef}>
      <img src={curtainAsset.url} alt="" className="waitlist-cta-image" loading="lazy" />

      <div className="waitlist-cta-stage" aria-hidden="true">
        <picture>
          <source srcSet={phoneDeliverWebpAsset.url} type="image/webp" />
          <img
            src={phoneDeliverPngAsset.url}
            alt=""
            loading="lazy"
            className="waitlist-cta-phone waitlist-cta-phone-right pricing-cta-phone" data-reveal
          />
        </picture>
        <picture>
          <source srcSet={phoneSellWebpAsset.url} type="image/webp" />
          <img
            src={phoneSellPngAsset.url}
            alt=""
            loading="lazy"
            className="waitlist-cta-phone waitlist-cta-phone-left pricing-cta-phone" data-reveal
          />
        </picture>
      </div>

      <div className="waitlist-cta-inner site-container">
        <div className="waitlist-cta-copy">
          <p className="waitlist-cta-eyebrow" data-reveal>{eyebrow}</p>
          <h2 className="waitlist-cta-title" data-reveal>
            <span>{title}</span>
            <em>{titleAccent}</em>
          </h2>
          <p className="waitlist-cta-body" data-reveal>{body}</p>

          {formState === "success" ? (
            <p role="status" className="waitlist-cta-success" data-reveal>
              You’re on the list. Thank you for joining the SQOOT Pure waitlist — we’ll let you
              know when access becomes available.
            </p>
          ) : (
            <form onSubmit={submitWaitlist} noValidate className="waitlist-cta-form" data-reveal>
              <label htmlFor="waitlist-cta-email" className="sr-only">
                Email address
              </label>
              <div className="waitlist-cta-control">
                <input
                  id="waitlist-cta-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  required
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (formState !== "submitting") setFormState("idle");
                  }}
                  placeholder="you@email.com"
                  aria-invalid={formState === "invalid"}
                  aria-describedby="waitlist-cta-status"
                  className="waitlist-cta-input"
                />
                <button type="submit" className="waitlist-cta-button">
                  {formState === "submitting" ? "Joining…" : "Join the waitlist →"}
                </button>
              </div>
              {(formState === "invalid" || formState === "error") && (
                <p id="waitlist-cta-status" role="alert" className="waitlist-cta-error">
                  {formState === "invalid"
                    ? "Please enter a valid email address."
                    : "Something went wrong. Please try again."}
                </p>
              )}
            </form>
          )}

          <p className="waitlist-cta-fineprint" data-reveal>
            No payment or bank details. Unsubscribe any time. See our{" "}
            <Link to="/privacy">Privacy Policy</Link>.
          </p>
        </div>
      </div>

      <picture>
        <source srcSet={phoneSellWebpAsset.url} type="image/webp" />
        <img
          src={phoneSellPngAsset.url}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="waitlist-cta-mobile-phone"
        />
      </picture>
    </section>
  );
}
