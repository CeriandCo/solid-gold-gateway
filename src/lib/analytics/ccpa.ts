/** CCPA "Do Not Sell or Share" preference, stored first-party on this browser. */
export const CCPA_KEY = "trunk_ccpa_optout";
const MAX_AGE = 60 * 60 * 24 * 365; // 12 months

type DataLayerWindow = Window & { dataLayer?: unknown[] };

export function hasGpcSignal(): boolean {
  if (typeof navigator === "undefined") return false;
  return (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
}

function readStored(): boolean {
  if (typeof document === "undefined") return false;
  if (document.cookie.split("; ").some((c) => c === `${CCPA_KEY}=1`)) return true;
  try {
    return window.localStorage.getItem(CCPA_KEY) === "1";
  } catch {
    return false;
  }
}

/** True when this browser has opted out, by saved choice or GPC signal. */
export function isAdOptOut(): boolean {
  return hasGpcSignal() || readStored();
}

export function pushCcpaStatus(): void {
  if (typeof window === "undefined") return;
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: "ccpa_status", ccpa_opt_out: isAdOptOut() });
}

export function setAdOptOut(optOut: boolean): void {
  if (typeof document === "undefined") return;
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = optOut
    ? `${CCPA_KEY}=1; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`
    : `${CCPA_KEY}=; Max-Age=0; Path=/; SameSite=Lax${secure}`;
  try {
    if (optOut) window.localStorage.setItem(CCPA_KEY, "1");
    else window.localStorage.removeItem(CCPA_KEY);
  } catch {
    /* storage unavailable */
  }
  pushCcpaStatus();
}
