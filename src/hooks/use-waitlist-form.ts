import { useState, type FormEvent } from "react";

import { joinWaitlist } from "@/lib/leads.functions";
import { WAITLIST_CONSENT, type WaitlistSource } from "@/lib/leads/consent";

export type WaitlistFormState = "idle" | "invalid" | "submitting" | "error" | "success";

export function isValidWaitlistEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

/** Sends one waitlist signup to the server; true only when it was saved. */
export async function sendWaitlistSignup(email: string, source: WaitlistSource): Promise<boolean> {
  const result = await joinWaitlist({ data: { email, source, consentVersion: WAITLIST_CONSENT.version } });
  return result.ok;
}

export function useWaitlistForm(source: WaitlistSource, onSubmitStart?: () => void) {
  const [email, setEmailValue] = useState("");
  const [formState, setFormState] = useState<WaitlistFormState>("idle");

  function setEmail(value: string) {
    setEmailValue(value);
    if (formState !== "submitting") setFormState("idle");
  }

  async function submitWaitlist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmitStart?.();
    const trimmed = email.trim();
    if (!isValidWaitlistEmail(trimmed)) {
      setFormState("invalid");
      return;
    }

    setFormState("submitting");
    try {
      setFormState((await sendWaitlistSignup(trimmed, source)) ? "success" : "error");
    } catch {
      setFormState("error");
    }
  }

  return { email, formState, setEmail, submitWaitlist };
}
