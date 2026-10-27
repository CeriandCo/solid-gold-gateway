// Amplitude analytics + Session Replay, client-only. Loaded once per page load.
// Privacy: no custom track calls; URLs are stripped of non-UTM params and hashes;
// forms are blocked from replay; private (signed-in staff) routes never load it.
const API_KEY = "d6a71b487ca2fd826e85491ecbb4b38a";
const CDN = `https://cdn.amplitude.com/script/${API_KEY}.js`;
let started = false;

// Real private routes in this project: only the /admin CMS (sign-in + editorial tools).
export const EXCLUDED = [/^\/admin(\/|$)/];
const PROD_HOSTS = ["trunk.gold", "www.trunk.gold"];
const KEEP_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid", "li_fat_id"];

export function isExcludedPath(pathname: string) {
  return EXCLUDED.some((r) => r.test(pathname));
}

export function isInternalBrowser() {
  try {
    return localStorage.getItem("trunk_internal") === "1";
  } catch {
    return false;
  }
}

export function cleanUrl(raw?: string, origin = "https://trunk.gold") {
  if (!raw) return raw;
  try {
    const u = new URL(raw, origin);
    [...u.searchParams.keys()].forEach((k) => {
      if (!KEEP_PARAMS.includes(k)) u.searchParams.delete(k);
    });
    u.hash = "";
    return u.toString();
  } catch {
    return undefined;
  }
}

const sanitizePlugin = {
  name: "trunk-sanitize",
  type: "enrichment",
  async setup() {},
  async execute(event: any) {
    const p = event.event_properties || {};
    for (const k of Object.keys(p)) {
      if (/url|location|referrer|href/i.test(k) && typeof p[k] === "string") p[k] = cleanUrl(p[k], location.origin);
      if (/search/i.test(k)) delete p[k];
    }
    if (isExcludedPath(location.pathname)) return null;
    return event;
  },
};

export function initAmplitude() {
  if (started || typeof window === "undefined") return;
  if (isExcludedPath(location.pathname)) return;
  started = true;

  try {
    const q = new URLSearchParams(location.search);
    if (q.get("internal") === "1") localStorage.setItem("trunk_internal", "1");
    if (q.get("internal") === "0") localStorage.removeItem("trunk_internal");
  } catch {}
  const internal = isInternalBrowser();
  const env = PROD_HOSTS.includes(location.hostname) ? "production" : "preview";

  const s = document.createElement("script");
  s.src = CDN;
  s.onload = () => {
    const amp = (window as any).amplitude;
    const sr = (window as any).sessionReplay;
    if (!amp) return;
    if (sr)
      amp.add(
        sr.plugin({
          sampleRate: 1,
          privacyConfig: {
            defaultMaskLevel: "medium",
            blockSelector: ["form", "[data-amp-block]"],
            maskSelector: ["[data-amp-mask]"],
          },
        }),
      );
    amp.add(sanitizePlugin);
    amp.init(API_KEY, {
      fetchRemoteConfig: true,
      autocapture: {
        attribution: true,
        pageViews: true,
        sessions: true,
        formInteractions: false,
        fileDownloads: false,
        elementInteractions: { cssSelectorAllowlist: ["a", "button", "[data-amp-track]"] },
      },
    });
    const id = new amp.Identify().set("environment", env).set("is_internal", internal);
    amp.identify(id);
  };
  document.head.appendChild(s);
}
