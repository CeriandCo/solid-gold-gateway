/**
 * Customer.io Track API (US region) — identify + track. Server-only.
 * Never throws: returns false on any failure so signups are never lost.
 * Never logs the email, payload or credentials.
 */
const TRACK_BASE = "https://track.customer.io/api/v1";

/** Only the live site sends to Customer.io. Preview, lovable.app and localhost never do. */
export const CUSTOMERIO_LIVE_HOSTS = ["trunk.gold", "www.trunk.gold"];

export function isLiveHost(origin: string | null | undefined, host: string | null | undefined): boolean {
  let originHost: string | null = null;
  if (origin) {
    try {
      originHost = new URL(origin).hostname.toLowerCase();
    } catch {
      return false;
    }
  }
  const candidate = originHost ?? (host ? host.split(":")[0]!.toLowerCase() : null);
  return candidate !== null && CUSTOMERIO_LIVE_HOSTS.includes(candidate);
}

export type CioEvent = {
  email: string;
  attributes: Record<string, string | number | boolean>;
  name: string;
  data: Record<string, string | number | boolean>;
};

export async function sendToCustomerIo(event: CioEvent, fetchImpl: typeof fetch = fetch): Promise<boolean> {
  const siteId = process.env["CUSTOMERIO_SITE_ID"];
  const apiKey = process.env["CUSTOMERIO_TRACK_API_KEY"];
  if (!siteId || !apiKey) {
    console.warn("[customerio] credentials missing; event not sent");
    return false;
  }
  const auth = `Basic ${btoa(`${siteId}:${apiKey}`)}`;
  const id = encodeURIComponent(event.email);
  const headers = { Authorization: auth, "Content-Type": "application/json" };
  try {
    const identify = await fetchImpl(`${TRACK_BASE}/customers/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ email: event.email, ...event.attributes }),
      signal: AbortSignal.timeout(5000),
    });
    if (!identify.ok) {
      console.warn(`[customerio] identify failed (${identify.status})`);
      return false;
    }
    const track = await fetchImpl(`${TRACK_BASE}/customers/${id}/events`, {
      method: "POST",
      headers,
      body: JSON.stringify({ name: event.name, data: event.data }),
      signal: AbortSignal.timeout(5000),
    });
    if (!track.ok) {
      console.warn(`[customerio] track failed (${track.status})`);
      return false;
    }
    return true;
  } catch {
    console.warn("[customerio] request error");
    return false;
  }
}
