# Generate with AI in the manual post editor

## What changed
- `src/lib/aurum/ai/manual.server.ts` (new): input parse, system prompt, user prompt (FACTS + BRIEF blocks), `verifyManualDraft`, `generateManualDraft`. Reuses `createGatewayGenerator` and `parseModelDraft`/`draftSchema`/`DRAFT_JSON_SCHEMA` unchanged.
- `src/lib/admin.functions.ts`: `generateDraftFromPrompt` server fn. Auth pattern identical to `createDraft` (`requireSupabaseAuth` + `resolveRole`, any listed editor role). No post writes. Empty facts return "Add at least one fact before generating." without calling the model.
- `src/components/admin-ai-generate-panel.tsx` (new) + `admin-post-form.tsx`: collapsible panel shown only when `post === null`. Fills title, slug (only if untouched), summary, body. Sources untouched. Errors shown inline, no retry.
- Migration `0027_aurum_ai_manual_runs.sql`: service-role-only usage ledger (same usage columns as `aurum_ai_runs`). New table, no new SQL function.

## Deviations from the brief (decided, please review)
1. Usage is recorded in a separate table, not via `aurum_ai_finish_run`. Reason: `aurum_ai_claim_run` counts every row created today against the scheduled cap (default 1). Writing manual runs there would block that day's scheduled Daily Note.
2. Extra safety check: a draft is discarded (outcome `rejected`, nothing filled in) if any number in title/summary/paragraphs is not printed in the supplied facts, a context paragraph contains a digit, a fact paragraph cites an unknown fact id, or one fact is used twice.
3. The fixed disclaimer is not appended to generated body (editor-owned draft).
4. "Admin-role gated": followed `createDraft` exactly, which allows admin, reviewer and editor.

## Gates (run this turn)
- `bunx tsgo --noEmit`: no output, exit 0
- `bun run test`: Test Files 49 passed (49), Tests 714 passed (714) — previously 710; +4 in `manual.test.ts` (empty facts rejected without model call; well-formed response flattened into body + usage recorded; provider failure/throw returns clean error; out-of-facts number discarded)
- `bun run build`: exit 0

## Live model call (no database write, recorder stubbed to console)
Facts: 24h high $4,310 / 24h low $4,271 / Spot price $4,295.80. Raw output:
```
RECORD {"outcome":"generated","usage":{"provider":"lovable-ai-gateway","model":"openai/gpt-6-astra","inputTokens":555,"outputTokens":287,"totalTokens":842,"costUsd":null},"detail":null}
{ "ok": true, "title": "Range check", "summary": "A brief look at the range and spot price.",
  "body": ["The 24h high is $4,310.", "The 24h low is $4,271.", "The spot price is $4,295.80."] }
```
Every number matches a supplied fact.

## Not verified
- The panel in a real browser at 375/768/1440 and the signed-in click-through (no editor session available this turn; would need approval to sign in as an editor).
- A write into `aurum_ai_manual_runs` from the live server function (not triggered; the insert is covered only by typecheck against the regenerated types).
- "Submit for review still requires sources" was not re-clicked; the generate path does not touch sources or the submit logic.
