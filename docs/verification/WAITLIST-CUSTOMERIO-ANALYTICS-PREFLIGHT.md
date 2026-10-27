# Waitlist + Customer.io + custom analytics preflight

Status: paused for secure credential entry. No application or database changes.

## Checks actually run

Configured-secret name listing returned 12 secrets. Neither `CUSTOMERIO_SITE_ID` nor `CUSTOMERIO_TRACK_API_KEY` was listed. No secret values were read.

Workspace connection listing returned Logo.dev, Stripe live and Stripe sandbox; no Customer.io connection was listed.

Read `src/hooks/use-waitlist-form.ts`; current submission uses:

```typescript
// Waitlist storage is not connected yet; registration completes locally.
await new Promise((resolve) => setTimeout(resolve, 600));
setFormState("success");
```

## Blocker and next action

Add `CUSTOMERIO_SITE_ID` and `CUSTOMERIO_TRACK_API_KEY` using Project Settings → Secrets, not chat. The request already authorizes this integration. No secure in-chat credential form tool is available in this session; Project Settings → Secrets is the available secure entry form.

## Pending / unverified

No waitlist table or policies created; no Customer.io requests sent; no custom tracker or event locations implemented. Success-only firing, responsive browser checks, tests and end-to-end delivery remain unverified. No manual builds or typechecks were run; the harness manages these. Nothing published.

Changed files: `roadmap.md`, this report, and analytics privacy project memory.