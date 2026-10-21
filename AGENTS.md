<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Editor "Generate with AI" usage is logged in `aurum_ai_manual_runs`, not `aurum_ai_runs` — so manual generations never consume the scheduled Daily Note daily cap.
- The AURUM subscribe presentation is an external community invitation, not a local signup form; keep the existing newsletter server/storage contracts intact because this change is presentation-only.
- Retired preview pages have no route modules or redirects; the shared not-found page handles their URLs to avoid retaining obsolete content.
- Trust Center audit cadence and dates use the tested vault-audit configuration to keep report labels consistent.
