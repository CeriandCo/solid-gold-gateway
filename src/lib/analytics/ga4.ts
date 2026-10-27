// Google Analytics 4, client-only, production hosts only, loaded once per page load.
// Page views come from GA4 Enhanced Measurement (history changes); no manual page_view or custom events.
// If a CSP is added, allow www.googletagmanager.com and *.google-analytics.com.
import { isExcludedPath, isInternalBrowser } from "./amplitude";
import { PROD_HOSTS } from "./hosts";

const MEASUREMENT_ID = "G-J3Y6EZZ2CW";
let started = false;

export function shouldLoadGA4(hostname: string, pathname: string) {
  return PROD_HOSTS.includes(hostname) && !isExcludedPath(pathname);
}

export function initGA4() {
  if (started || typeof window === "undefined") return;
  if (!shouldLoadGA4(location.hostname, location.pathname)) return;
  started = true;
  const internal = isInternalBrowser();

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(s);

  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  function gtag(..._args: unknown[]) {
    // eslint-disable-next-line prefer-rest-params -- gtag.js needs the Arguments object
    w.dataLayer.push(arguments);
  }
  w.gtag = gtag;
  gtag("js", new Date());
  gtag("config", MEASUREMENT_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    ...(internal ? { traffic_type: "internal" } : {}),
  });
}
