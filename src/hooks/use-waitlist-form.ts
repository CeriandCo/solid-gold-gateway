import { useState, type FormEvent } from "react";

export type WaitlistFormState = "idle" | "invalid" | "submitting" | "error" | "success";

export function useWaitlistForm(onSubmitStart?: () => void) {
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
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) && trimmed.length <= 254;
    if (!valid) {
      setFormState("invalid");
      return;
    }

    setFormState("submitting");
    try {
      // Waitlist storage is not connected yet; registration completes locally.
      await new Promise((resolve) => setTimeout(resolve, 600));
      setFormState("success");
    } catch {
      setFormState("error");
    }
  }

  return { email, formState, setEmail, submitWaitlist };
}