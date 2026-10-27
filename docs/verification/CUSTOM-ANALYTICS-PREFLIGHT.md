# Custom analytics preflight — October 27, 2026

## Blocking finding

No custom analytics events were installed. The requested `waitlist_joined` event must represent a successful submission, but the current waitlist handlers do not submit to a service. They display success after a local timer. Tracking that branch would incorrectly report registrations that have not been stored.

## Raw source evidence inspected in this run

`src/hooks/use-waitlist-form.ts`:

```ts
// Waitlist storage is not connected yet; registration completes locally.
await new Promise((resolve) => setTimeout(resolve, 600));
setFormState("success");
```

The homepage and shared waitlist CTA import this hook.

`src/routes/early-access.tsx`, lines 102–104:

```ts
// Waitlist storage is not connected yet; registration completes locally.
await new Promise((resolve) => setTimeout(resolve, 600));
setFormState("success");
```

## Decision needed

Either scope a real waitlist submission separately, or authorize implementing the remaining events while leaving `waitlist_joined` unimplemented until a real successful response exists. No storage, design, copy, layout, or application functionality was changed during this preflight.

## Verification scope

Source inspection only. No submissions, database writes, browser interaction tests, typecheck, build, or test suites were run. Only this report was added.