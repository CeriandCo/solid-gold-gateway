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
        if (!cancelled) mod.default({ app_id: INTERCOM_APP_ID });
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
