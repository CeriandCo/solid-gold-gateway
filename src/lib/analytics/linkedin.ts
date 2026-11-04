// Client-only Insight Tag. Exclude internal browsers rather than recording
// internal visits/conversions as advertising activity.
import { isExcludedPath, isInternalBrowser } from "./amplitude";
import { PROD_HOSTS } from "./hosts";

const PARTNER_ID = "559237849";
let started = false;

type Lintrk = {
  (action: string, options: { conversion_id: number }): void;
  q?: unknown[][];
};
type LinkedInWindow = Window & {
  _linkedin_partner_id?: string;
  _linkedin_data_partner_ids?: string[];
  lintrk?: Lintrk;
};

export function shouldLoadLinkedIn(hostname: string, pathname: string) {
  return PROD_HOSTS.includes(hostname) && !isExcludedPath(pathname);
}

export function initLinkedIn() {
  if (started || typeof window === "undefined") return;
  if (!shouldLoadLinkedIn(window.location.hostname, window.location.pathname) || isInternalBrowser()) return;
  started = true;
  const w = window as LinkedInWindow;
  w._linkedin_partner_id = PARTNER_ID;
  w._linkedin_data_partner_ids = w._linkedin_data_partner_ids || [];
  if (!w._linkedin_data_partner_ids.includes(PARTNER_ID)) w._linkedin_data_partner_ids.push(PARTNER_ID);
  if (!w.lintrk) {
    const stub: Lintrk = (...args) => { stub.q?.push(args); };
    stub.q = [];
    w.lintrk = stub;
  }
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
  document.head.appendChild(script);
}

export function trackLinkedInConversion(conversionId: number) {
  if (typeof window === "undefined") return;
  if (!shouldLoadLinkedIn(window.location.hostname, window.location.pathname) || isInternalBrowser()) return;
  (window as LinkedInWindow).lintrk?.("track", { conversion_id: conversionId });
}