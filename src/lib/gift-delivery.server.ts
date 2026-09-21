/**
 * Gift card delivery. Server-only.
 *
 * Security model: a plaintext gift code exists only inside this module, in
 * memory, for the duration of one send. It is never stored, logged, returned
 * to a caller, or put into an error message. The database holds only
 * HMAC-SHA256(normalised code, GIFT_CODE_PEPPER) and the last four characters.
 */
import {
  formatGiftCode,
  generateGiftCode,
  giftCodeLast4,
  isWellFormedGiftCode,
  normaliseGiftCode,
} from "@/lib/commerce/gift-code";

const CLAIM_LIMIT = 25;
const LEASE_MINUTES = 10;

export type EmailMessage = {
  to: string;
  from: string;
  subject: string;
  html: string;
  text: string;
};

export type EmailSendResult =
  | { ok: true; id: string }
  | { ok: false; category: string };

export type EmailProvider = {
  send(message: EmailMessage): Promise<EmailSendResult>;
};

export type DeliveryTickResult =
  | { outcome: "awaiting_email_provider" }
  | { outcome: "idle"; claimed: 0 }
  | { outcome: "processed"; claimed: number; sent: number; failed: number };

/** HMAC-SHA256 of the normalised code. The pepper never leaves the server. */
export async function hashGiftCode(code: string): Promise<string> {
  const pepper = process.env["GIFT_CODE_PEPPER"];
  if (!pepper) throw new Error("GIFT_CODE_PEPPER is not configured");
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(pepper),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(normaliseGiftCode(code)),
  );
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function formatAmount(amountCents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountCents / 100);
}

export const GIFT_EMAIL_SUBJECT = "You've received a SQOOT Pure Gift Card";
// COPY PENDING CLIENT APPROVAL
const REDEMPTION_COPY =
  "Keep this code safe. You'll be able to redeem it with SQOOT Pure.";

export function buildGiftEmail(input: {
  to: string;
  from: string;
  recipientName: string | null;
  amountCents: number;
  currency: string;
  giftMessage: string | null;
  code: string;
}): EmailMessage {
  const displayCode = formatGiftCode(normaliseGiftCode(input.code));
  const amount = formatAmount(input.amountCents, input.currency);
  const name = input.recipientName?.trim() || "there";

  const text = [
    `Hello ${name},`,
    "",
    `You've received a SQOOT Pure Gift Card worth ${amount}.`,
    input.giftMessage ? `Message: ${input.giftMessage}` : null,
    "",
    `Your code: ${displayCode}`,
    "",
    REDEMPTION_COPY,
    "",
    "SQOOT Pure",
  ]
    .filter((line) => line !== null)
    .join("\n");

  // Every user-supplied value is escaped. No remote images, no tracking pixels.
  const html = `<!doctype html>
<html lang="en"><body style="margin:0;padding:0;background:#F6F1E7;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6F1E7;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFDF8;border:1px solid #E3DAC8;">
        <tr><td style="padding:40px 40px 8px 40px;">
          <p style="margin:0 0 24px 0;font-family:Georgia,'Times New Roman',serif;font-size:14px;letter-spacing:0.18em;text-transform:uppercase;color:#1F3B2C;">SQOOT Pure</p>
          <h1 style="margin:0 0 20px 0;font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1.2;font-weight:400;color:#1F3B2C;">${escapeHtml(GIFT_EMAIL_SUBJECT)}</h1>
          <p style="margin:0 0 16px 0;font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.6;color:#2B3B33;">Hello ${escapeHtml(name)},</p>
          <p style="margin:0 0 24px 0;font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.6;color:#2B3B33;">You've received a SQOOT Pure Gift Card worth <strong>${escapeHtml(amount)}</strong>.</p>
          ${
            input.giftMessage
              ? `<blockquote style="margin:0 0 24px 0;padding:16px 20px;background:#F6F1E7;border-left:3px solid #1F3B2C;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.6;color:#2B3B33;">${escapeHtml(input.giftMessage)}</blockquote>`
              : ""
          }
          <div style="margin:0 0 24px 0;padding:20px;background:#1F3B2C;text-align:center;">
            <p style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#C9BFA8;">Your gift code</p>
            <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:22px;letter-spacing:0.14em;color:#F6F1E7;">${escapeHtml(displayCode)}</p>
          </div>
          <p style="margin:0 0 32px 0;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.6;color:#4A5A50;">${escapeHtml(REDEMPTION_COPY)}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  return {
    to: input.to,
    from: input.from,
    subject: GIFT_EMAIL_SUBJECT,
    html,
    text,
  };
}

/** Resend over plain fetch. The API key is read at call time and never logged. */
export function createResendProvider(apiKey: string): EmailProvider {
  return {
    async send(message) {
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            authorization: `Bearer ${apiKey}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            from: message.from,
            to: [message.to],
            subject: message.subject,
            html: message.html,
            text: message.text,
          }),
        });
        if (!response.ok) {
          return {
            ok: false,
            category: response.status >= 500 ? "provider_5xx" : `provider_${response.status}`,
          };
        }
        const body = (await response.json()) as { id?: string };
        return body?.id ? { ok: true, id: body.id } : { ok: false, category: "no_message_id" };
      } catch {
        return { ok: false, category: "network_error" };
      }
    },
  };
}

type ClaimedCard = {
  gift_card_id: string;
  order_id: string;
  amount_cents: number;
  currency: string;
  recipient_name: string | null;
  recipient_email: string | null;
  gift_message: string | null;
};

/**
 * One delivery pass. Claims at most 25 active, undelivered cards under a
 * 10-minute lease, mints a fresh code for each, sends it and records the
 * result. A failed send releases the lease; the next tick mints a NEW code,
 * which invalidates the previous one — no stored code is ever resent.
 */
export async function runDeliveryTick(
  deps: { provider?: EmailProvider } = {},
): Promise<DeliveryTickResult> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  // Safety net on the existing 5-minute schedule: if anything has cleared the
  // Stripe price mapping, re-assert it. Read-only when the catalog is healthy.
  const { runScheduledCatalogCheck } = await import("./commerce/catalog-guard.server");
  await runScheduledCatalogCheck();

  const { data: settings } = await supabaseAdmin
    .from("commerce_settings")
    .select("delivery_enabled, email_from")
    .eq("id", true)
    .maybeSingle();

  const apiKey = process.env["RESEND_API_KEY"];
  const provider = deps.provider ?? (apiKey ? createResendProvider(apiKey) : null);
  const from = settings?.email_from ?? null;

  if (!settings?.delivery_enabled || !from || !provider) {
    return { outcome: "awaiting_email_provider" };
  }

  const { data: claimed, error: claimError } = await supabaseAdmin.rpc(
    "gift_card_claim_for_delivery",
    { _limit: CLAIM_LIMIT, _lease_minutes: LEASE_MINUTES },
  );
  if (claimError) {
    console.error("[gift-delivery] claim failed", claimError.message);
    return { outcome: "idle", claimed: 0 };
  }

  const cards = (claimed ?? []) as ClaimedCard[];
  if (cards.length === 0) return { outcome: "idle", claimed: 0 };

  let sent = 0;
  let failed = 0;

  for (const card of cards) {
    const recipient = card.recipient_email;
    if (!recipient) {
      await supabaseAdmin.rpc("gift_card_release_delivery_claim", {
        _gift_card_id: card.gift_card_id,
      });
      await logAttempt(card.gift_card_id, "skipped", null, "no_recipient");
      failed += 1;
      continue;
    }

    // Plaintext lives only in this scope.
    const code = generateGiftCode();
    const codeHash = await hashGiftCode(code);

    const { data: stored, error: storeError } = await supabaseAdmin.rpc("gift_card_set_code", {
      _gift_card_id: card.gift_card_id,
      _code_hash: codeHash,
      _code_last4: giftCodeLast4(code),
    });
    if (storeError || stored !== true) {
      await supabaseAdmin.rpc("gift_card_release_delivery_claim", {
        _gift_card_id: card.gift_card_id,
      });
      await logAttempt(card.gift_card_id, "skipped", null, "code_write_refused");
      failed += 1;
      continue;
    }

    const result = await provider.send(
      buildGiftEmail({
        to: recipient,
        from,
        recipientName: card.recipient_name,
        amountCents: card.amount_cents,
        currency: card.currency,
        giftMessage: card.gift_message,
        code,
      }),
    );

    if (!result.ok) {
      await supabaseAdmin.rpc("gift_card_release_delivery_claim", {
        _gift_card_id: card.gift_card_id,
      });
      await logAttempt(card.gift_card_id, "failed", null, result.category.slice(0, 64));
      failed += 1;
      continue;
    }

    const { error: recordError } = await supabaseAdmin.rpc("gift_card_record", {
      _gift_card_id: card.gift_card_id,
      _entry_type: "deliver",
      _actor: "system:delivery",
      _amount_cents: 0,
      _new_status: "delivered",
      _reference: result.id.slice(0, 200),
    });
    if (recordError) {
      await logAttempt(card.gift_card_id, "failed", result.id, "record_failed");
      failed += 1;
      continue;
    }

    await logAttempt(card.gift_card_id, "sent", result.id, null);
    sent += 1;
  }

  return { outcome: "processed", claimed: cards.length, sent, failed };
}

async function logAttempt(
  giftCardId: string,
  outcome: "sent" | "failed" | "skipped",
  providerMessageId: string | null,
  errorCategory: string | null,
) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin.from("gift_card_delivery_attempts").insert({
    gift_card_id: giftCardId,
    outcome,
    provider_message_id: providerMessageId ? providerMessageId.slice(0, 200) : null,
    error_category: errorCategory,
  });
  if (error) console.error("[gift-delivery] attempt log failed", error.message);
}

/**
 * Future redemption primitive. Server-only by design: no route and no client
 * server function exposes this. Rate limiting and lockout arrive with
 * redemption itself.
 */
export async function verifyGiftCode(code: string): Promise<{
  found: boolean;
  status?: string;
  balanceCents?: number;
  currency?: string;
}> {
  if (!isWellFormedGiftCode(code)) return { found: false };
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const codeHash = await hashGiftCode(code);
  const { data } = await supabaseAdmin
    .from("gift_cards")
    .select("status, balance_cents, currency")
    .eq("code_hash", codeHash)
    .maybeSingle();
  if (!data) return { found: false };
  return {
    found: true,
    status: data.status,
    balanceCents: data.balance_cents,
    currency: data.currency,
  };
}
