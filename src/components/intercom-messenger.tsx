import { useEffect } from "react";

// Intercom app_id is public (it ships in the page bundle by design).
const INTERCOM_APP_ID = "i3945gpo";

/**
 * Loads the Intercom messenger on every page, client-side only.
 * Rendered once from the root layout.
 */
export function IntercomMessenger() {
  useEffect(() => {
    let cancelled = false;
    import("@intercom/messenger-js-sdk")
      .then((mod) => {
        // The SDK ships as CommonJS; bundlers can hand the default export
        // back as a namespace object, so resolve the function both ways.
        const init = typeof mod.default === "function"
          ? mod.default
          : (mod.default as { Intercom?: unknown } | undefined)?.Intercom;
        if (typeof init === "function" && !cancelled) {
          (init as (props: { app_id: string }) => void)({ app_id: INTERCOM_APP_ID });
        } else if (!cancelled) {
          console.warn("Intercom SDK loaded but no init function was found");
        }
      })
      .catch((err) => {
        console.warn("Intercom failed to load:", err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
