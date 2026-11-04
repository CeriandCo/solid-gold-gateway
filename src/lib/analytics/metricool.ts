// Client-only marketing analytics; internal browsers are excluded because the
// tracker has no equivalent of GA4's internal traffic classification.
import { isExcludedPath, isInternalBrowser } from "./amplitude";
import { PROD_HOSTS } from "./hosts";

const HASH = "d50f9e1e0e1d26d82d2786ce19a34567";
let started = false;
let loaded = false;
let lastTrackedPath: string | undefined;

type MetricoolWindow = Window & {
  beTracker?: { t: (options: { hash: string }) => void };
};

export function shouldLoadMetricool(hostname: string, pathname: string) {
  return PROD_HOSTS.includes(hostname) && !isExcludedPath(pathname);
}

function trackCurrentPath() {
  if (typeof window === "undefined") return;
  if (!shouldLoadMetricool(window.location.hostname, window.location.pathname) || isInternalBrowser()) {
    lastTrackedPath = undefined;
    return;
  }
  const tracker = (window as MetricoolWindow).beTracker;
  if (!tracker || lastTrackedPath === window.location.pathname) return;
  tracker.t({ hash: HASH });
  lastTrackedPath = window.location.pathname;
}

export function initMetricool() {
  if (typeof window === "undefined") return;
  if (!shouldLoadMetricool(window.location.hostname, window.location.pathname) || isInternalBrowser()) {
    lastTrackedPath = undefined;
    return;
  }
  if (loaded) {
    trackCurrentPath();
    return;
  }
  if (started) return;
  started = true;
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://tracker.metricool.com/resources/be.js";
  script.onload = () => {
    loaded = true;
    trackCurrentPath();
  };
  document.head.appendChild(script);
}