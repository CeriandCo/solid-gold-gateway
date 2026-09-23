/**
 * T5 link audit — authoritative public route inventory.
 *
 * Sources:
 *  1. src/routeTree.gen.ts (every file route the router knows)
 *  2. src/lib/learn-articles.ts (Learn articles, also served at /aurum/notes/<slug>)
 *  3. docs/verification/t5-published-posts.json — a read-only snapshot of
 *     published aurum_posts rows (type, slug, title), refreshed by the operator
 *     with a SELECT before each crawl. Drafts/in_review are never included.
 *
 * Usage: bun scripts/link-audit/routes.ts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { classifyRoutePath, parseFullPaths } from "../../src/lib/link-audit/analyze";
import { PUBLISHED_LEARN_ARTICLES } from "../../src/lib/learn-articles";

type Post = { type: "daily_note" | "weekly_brief"; slug: string; title: string };

const fullPaths = parseFullPaths(readFileSync("src/routeTree.gen.ts", "utf8"));
const posts: Post[] = JSON.parse(readFileSync("docs/verification/t5-published-posts.json", "utf8"));

const pub: { path: string; source: string; pattern: string }[] = [];
const internal: string[] = [];
const aliases: string[] = [];
for (const p of fullPaths) {
  const kind = classifyRoutePath(p);
  if (kind === "internal") internal.push(p);
  else if (kind === "layout-alias") aliases.push(p);
  else if (kind === "public-static") pub.push({ path: p, source: "file-route", pattern: p });
  else if (p === "/aurum/notes/$slug") {
    for (const a of PUBLISHED_LEARN_ARTICLES) pub.push({ path: `/aurum/notes/${a.slug}`, source: "learn-articles.ts (learn-fed note)", pattern: p });
    for (const x of posts.filter((x) => x.type === "daily_note")) pub.push({ path: `/aurum/notes/${x.slug}`, source: "aurum_posts published daily_note", pattern: p });
  } else if (p === "/aurum/briefs/$slug") {
    for (const x of posts.filter((x) => x.type === "weekly_brief")) pub.push({ path: `/aurum/briefs/${x.slug}`, source: "aurum_posts published weekly_brief", pattern: p });
  } else throw new Error(`Unhandled dynamic route ${p}`);
}
// Index aliases ("/learn/") resolve to their non-slash path; add the index if not already present.
for (const a of aliases) {
  const bare = a.replace(/\/$/, "");
  if (!pub.some((r) => r.path === bare)) pub.push({ path: bare, source: `index route ${a}`, pattern: a });
}
pub.sort((a, b) => a.path.localeCompare(b.path));
writeFileSync(
  "docs/verification/t5-routes.json",
  JSON.stringify({ generatedFrom: ["src/routeTree.gen.ts", "src/lib/learn-articles.ts", "docs/verification/t5-published-posts.json"], public: pub, internal, indexAliases: aliases }, null, 1) + "\n",
);
console.log(`public ${pub.length}, internal ${internal.length}, aliases ${aliases.length}`);
