# Dead external links + unused AppStoreBadge

## 1. Sign Up on Gold.org — NOT changed (blocked)
HTTP checks run this task (Chrome UA):
```
https://www.gold.org/newsletter 404
https://www.gold.org/subscribe 404
https://www.gold.org/goldhub/research/subscribe 404
https://www.gold.org/register 302 -> https://user.gold.org/register?destination=https://www.gold.org
```
gold.org homepage HTML: no subscribe/newsletter/sign-up link found. No authoritative newsletter URL was found, so none was guessed. The href stays "#". The account register page exists but is account creation, not a newsletter sign-up.

## 2. Goldhub — already correct, not changed
```
https://www.goldhub.com/ 301 -> https://www.gold.org/goldhub
https://www.gold.org/goldhub 200
```
The current href is the redirect's final URL, with target=_blank and rel="noopener noreferrer".

## 3. AppStoreBadge — removed
A repo-wide search found no users of AppStoreBadge, AppleIcon or PlayIcon outside site-chrome.tsx. I deleted all three.
`bunx tsgo --noEmit`: pass.
Remaining `href="#"`: only learn.index.tsx:449 (item 1). Test suite and build not run this task.
