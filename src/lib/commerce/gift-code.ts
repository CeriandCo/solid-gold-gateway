/**
 * Gift code shape. Pure functions only — no secrets, no I/O.
 *
 * A code is 16 Crockford Base32 characters (~80 bits of entropy) displayed as
 * XXXX-XXXX-XXXX-XXXX. The plaintext never leaves server memory: only the
 * HMAC of the normalised form and the last four characters are stored.
 */

/** Crockford Base32: no I, L, O or U. */
export const CROCKFORD_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
export const GIFT_CODE_LENGTH = 16;

/** 16 random Crockford characters, unbiased (32 divides 256 evenly). */
export function generateGiftCode(): string {
  const bytes = new Uint8Array(GIFT_CODE_LENGTH);
  crypto.getRandomValues(bytes);
  let out = "";
  for (const byte of bytes) out += CROCKFORD_ALPHABET[byte % 32];
  return out;
}

/** XXXX-XXXX-XXXX-XXXX for display. */
export function formatGiftCode(code: string): string {
  return (code.match(/.{1,4}/g) ?? []).join("-");
}

/**
 * Canonical form used for hashing and lookup: uppercase, dashes and spaces
 * removed, and the Crockford confusables folded (I/L -> 1, O -> 0).
 */
export function normaliseGiftCode(input: string): string {
  return input
    .toUpperCase()
    .replace(/[\s-]/g, "")
    .replace(/[IL]/g, "1")
    .replace(/O/g, "0");
}

export function isWellFormedGiftCode(input: string): boolean {
  const normalised = normaliseGiftCode(input);
  return (
    normalised.length === GIFT_CODE_LENGTH &&
    [...normalised].every((char) => CROCKFORD_ALPHABET.includes(char))
  );
}

/** Last four characters of the normalised code — safe to store and display. */
export function giftCodeLast4(code: string): string {
  return normaliseGiftCode(code).slice(-4);
}
