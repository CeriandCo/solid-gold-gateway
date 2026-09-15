// Scoped analytics helper for the site.
// TODO: wire to analytics provider once selected — no provider is installed yet,
// so events fall through to the dev console branch below.

type EventName =
  | "pricing_cta_click"
  | "calculator_estimate_shown"
  | "calculator_amount_preset_clicked"
  | "faq_open"
  | "bottom_cta_click";

type EventProps = Record<string, string | number | boolean | null>;

type AnalyticsWindow = Window & {
  gtag?: (command: string, event: string, props?: EventProps) => void;
  plausible?: (event: string, options?: { props: EventProps }) => void;
  posthog?: { capture: (event: string, props?: EventProps) => void };
  analytics?: { track: (event: string, props?: EventProps) => void };
};

export function track(event: EventName, props: EventProps = {}) {
  if (typeof window === "undefined") return;
  const w = window as AnalyticsWindow;

  if (w.gtag) w.gtag("event", event, props);
  else if (w.plausible) w.plausible(event, { props });
  else if (w.posthog) w.posthog.capture(event, props);
  else if (w.analytics) w.analytics.track(event, props);
  else if (import.meta.env.DEV) console.log("[analytics]", event, props);
}
