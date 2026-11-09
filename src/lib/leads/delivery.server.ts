import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendToCustomerIo, type CioEvent } from "./customerio.server";

type DeliveryTable = "waitlist_signups" | "partner_applications" | "newsletter_signups";

/** Claims the row for sending, sends, and records the outcome. Never throws. */
export async function deliver(table: DeliveryTable, id: string, event: CioEvent): Promise<void> {
  try {
    const { data: claimed } = await supabaseAdmin
      .from(table)
      .update({ cio_status: "sending" })
      .eq("id", id)
      .in("cio_status", ["pending", "failed", "skipped"])
      .select("id, cio_attempts")
      .maybeSingle();
    if (!claimed) return; // already sent or in flight: no duplicate event
    const ok = await sendToCustomerIo(event);
    await supabaseAdmin
      .from(table)
      .update({
        cio_status: ok ? "sent" : "failed",
        cio_attempts: (claimed.cio_attempts ?? 0) + 1,
        cio_sent_at: ok ? new Date().toISOString() : null,
      })
      .eq("id", id);
  } catch {
    console.warn("[leads] refused: customerio delivery bookkeeping failed");
  }
}