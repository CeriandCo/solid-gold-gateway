/**
 * T5 Phase 3 — semantic destination verdicts.
 *
 * Every rule below is a human judgement recorded as data, made by reading the
 * link text, the surrounding section and the rendered destination identity
 * (title / H1 / fragment section heading). The script only APPLIES these
 * judgements to crawler output; anything that no rule matches is reported as
 * UNREVIEWED so a new or changed link can never silently inherit a verdict.
 */

export type SemanticVerdict =
  | "CORRECT"
  | "INCORRECT"
  | "AMBIGUOUS — CLIENT DECISION"
  | "TECHNICALLY BLOCKED"
  | "UNREVIEWED";

export type Severity = "NONE" | "HIGH" | "MEDIUM" | "LOW" | "CLIENT DECISION";

export interface SemanticOccurrence {
  sourceRoute: string;
  linkText: string | null;
  normalizedTarget: string | null;
  rawTarget: string | null;
  category: string;
  global: boolean;
  surface?: string | null;
  context?: { sectionHeading?: string | null; nearestId?: string | null } | null;
}

export interface SemanticResult {
  semanticVerdict: SemanticVerdict;
  semanticSeverity: Severity;
  semanticRule: string;
  semanticEvidence: string;
  semanticFix: string | null;
}

interface Rule {
  id: string;
  match: (o: SemanticOccurrence) => boolean;
  verdict: Exclude<SemanticVerdict, "UNREVIEWED">;
  severity?: Severity;
  evidence: string;
  fix?: string;
}

const t = (o: SemanticOccurrence) => (o.linkText ?? "").trim();
const tgt = (o: SemanticOccurrence) => o.normalizedTarget ?? o.rawTarget ?? "";
const sec = (o: SemanticOccurrence) => o.context?.sectionHeading ?? "";
const on = (route: string | RegExp) => (o: SemanticOccurrence) =>
  typeof route === "string" ? o.sourceRoute === route : route.test(o.sourceRoute);
const is = (text: string | RegExp, target: string | RegExp) => (o: SemanticOccurrence) =>
  (typeof text === "string" ? t(o) === text : text.test(t(o))) &&
  (typeof target === "string" ? tgt(o) === target : target.test(tgt(o)));
const all = (...fs: Array<(o: SemanticOccurrence) => boolean>) => (o: SemanticOccurrence) => fs.every((f) => f(o));

/** Header / footer labels → expected destination (shared site chrome). */
const GLOBAL_MAP: Array<[string, string, string]> = [
  ["SQOOT Pure home", "/", "logo → homepage (H1 “Own gold the way it was meant to be.”)"],
  ["Coin", "/precious-metal", "coins page (H1 “Real gold. In your hands.”)"],
  ["Buy Gold", "/precious-metal", "coins/bars purchase page (H1 “Real gold. In your hands.”)"],
  ["Fraction", "/fractional-gold", "fractional page (H1 “Gold allocation, made more accessible.”)"],
  ["Fractional", "/fractional-gold", "fractional page (H1 “Gold allocation, made more accessible.”)"],
  ["Gifting", "/gifting", "gifting page (H1 “Celebrate love with a gift that lasts.”)"],
  ["Vault", "/vault", "vault page (H1 “Your gold. Held in your name.”)"],
  ["Pricing", "/pricing", "pricing page (H1 “Every fee, shown before you confirm.”)"],
  ["Aurum", "/aurum", "AURUM (H1 “Understand gold before you own it.”; lands on default 1Y chart)"],
  ["AURUM", "/aurum", "AURUM (H1 “Understand gold before you own it.”; lands on default 1Y chart)"],
  ["Learn", "/learn", "Learn archive (H1 “Gold. Start with clarity.”)"],
  ["About Us", "/about-us", "About page"],
  ["Trust Center", "/trust-center", "Trust Center (H1 “Built for trust. Backed by verification.”)"],
  ["Get Early Access", "/early-access", "waitlist page (H1 “Be first in line.”)"],
  ["Get In Touch", "/contact", "Contact page (H1 “Get in touch.”)"],
  ["Terms of Service", "/terms", "Terms page (H1 “Terms of Use”)"],
  ["Data Privacy Policy", "/privacy", "Privacy page (H1 “Privacy Policy”)"],
];

const SOCIAL: Array<[RegExp, RegExp, string]> = [
  [/^Facebook/, /^https:\/\/www\.facebook\.com\/profile\.php\?id=61586363577228$/, "Facebook icon/label → facebook.com profile"],
  [/^Instagram/, /^https:\/\/www\.instagram\.com\/sqootpure\/$/, "Instagram icon/label → instagram.com/sqootpure"],
  [/^LinkedIn/, /^https:\/\/www\.linkedin\.com\/company\/sqootpure$/, "LinkedIn icon/label → linkedin.com/company/sqootpure"],
  [/^X \(Twitter\)/, /^https:\/\/x\.com\/sqootpure$/, "X icon/label → x.com/sqootpure"],
];

/** Source citations whose label names the resource the URL actually is. */
const SPECIFIC_SOURCES: Array<[RegExp, RegExp]> = [
  [/Good Delivery Current List — Gold/, /lbma\.org\.uk\/good-delivery\/gold-current-list$/],
  [/Good Delivery current list|Good delivery refiner list|Responsible sourcing and good delivery rules/, /lbma\.org\.uk\/good-delivery$/],
  [/production and sales figures|American Eagle production report/, /usmint\.gov\/about\/production-sales-figures$/],
  [/Gold price benchmark data/, /lbma\.org\.uk\/prices-and-data\/precious-metal-prices$/],
  [/Precious metal price methodology/, /lbma\.org\.uk\/prices-and-data$/],
  [/Gold demand trends/, /gold\.org\/goldhub\/research\/gold-demand-trends$/],
  [/central bank statistics/i, /gold\.org\/goldhub\/data\/monthly-central-bank-statistics$/],
  [/International Monetary Fund — International Financial Statistics/, /^https:\/\/data\.imf\.org\/$/],
  [/Bank for International Settlements — International banking/, /bis\.org\/statistics\/$/],
  [/Veriscan/, /pamp\.com\/veriscan$/],
  [/Handbook 44/, /nist\.gov\/pml\/owm\/nist-handbook-44$/],
];

/** Citations naming a specific dated document but linking to a publisher index page. */
const INDEX_SOURCES: Array<[RegExp, RegExp]> = [
  [/Bullion product schedule update/, /usmint\.gov\/news$/],
  [/Bullion operations statement/, /mint\.ca\/en\/discover\/news$/],
  [/Refinery delivery notice/, /pamp\.com\/news$/],
  [/Guide to the London precious metals market/, /lbma\.org\.uk\/publications$/],
  [/Investment guidance on storage structures/, /gold\.org\/goldhub\/research$/],
];

const RULES: Rule[] = [
  // ——— Global chrome ———
  ...GLOBAL_MAP.map<Rule>(([label, target, ident]) => ({
    id: `global:${label}`,
    match: (o) => o.global && t(o) === label && tgt(o) === target,
    verdict: "CORRECT",
    evidence: `Shared ${"header/footer"} label “${label}” → ${ident}.`,
  })),
  ...SOCIAL.map<Rule>(([label, url, ident]) => ({
    id: `social:${label.source}`,
    match: (o) => label.test(t(o)) && url.test(tgt(o)),
    verdict: "CORRECT",
    evidence: `${ident}. Platform matches icon; account ownership not independently verifiable from the repository (Phase 4 checks the profile resolves).`,
  })),
  {
    id: "global:aurum-fab",
    match: is("Open AURUM gold price and insights", "/aurum?range=1Y"),
    verdict: "CORRECT",
    evidence: "Floating AURUM button → AURUM page, default 1Y price chart (label implies no other period).",
  },

  // ——— Homepage ———
  { id: "home:waitlist", match: all(on(/^\/(home-old-ver)?$/), is(/^(Join the waitlist|Get Early Access)$/, "/early-access")), verdict: "CORRECT", evidence: "Waitlist CTA → /early-access (H1 “Be first in line.”)." },
  { id: "home:how-it-works", match: all(on("/"), is("How it works", "/#how-it-works")), verdict: "CORRECT", evidence: "Lands on section “HOW IT WORKS — From waitlist to your first ounce.”" },
  {
    id: "home:compare",
    match: all(on("/"), is("Compare the three", "/pricing#pricing-compare")),
    verdict: "CORRECT",
    evidence: "Lands on pricing section “COMPARE — Two ways to own. One clear list of costs.” — the cost comparison. Copy says “three”, section says “two”: wording note only, destination is the comparison.",
  },
  { id: "home:coins", match: all(on("/"), is("Browse coins", "/precious-metal")), verdict: "CORRECT", evidence: "Card “Coins, delivered home” → coins page." },
  { id: "home:fractional", match: all(on("/"), is("How fractional works", "/fractional-gold")), verdict: "CORRECT", evidence: "Card “Buy by weight” → fractional page." },
  { id: "home:vault", match: all(on("/"), is("See the vault", "/vault")), verdict: "CORRECT", evidence: "Card “Keep it in the vault” → vault page." },
  { id: "home:aurum", match: all(on("/"), is(/^(Read what moved it in AURUM|Open AURUM)$/, "/aurum?range=1Y")), verdict: "CORRECT", evidence: "AURUM CTA → AURUM (gold price + Daily Note “What moved, and why”)." },
  { id: "home:gifting", match: all(on("/"), is("Explore gifting", "/gifting")), verdict: "CORRECT", evidence: "Gifting section CTA → gifting page." },
  { id: "home:trust", match: all(on("/"), is("Visit the Trust Center", "/trust-center")), verdict: "CORRECT", evidence: "Trust section CTA → Trust Center." },
  {
    id: "home:note-spread",
    match: all(on("/"), is("Read the note", "/aurum/notes/spread-on-a-one-ounce-coin")),
    verdict: "CORRECT",
    evidence: "Card “Why the spread on a one-ounce coin moved” (DAILY NOTE · 3 MIN) → published note “Why the spread on a one ounce coin moved this week” (3 min read). Phase 3 fix: previously pointed at the notes archive.",
  },
  {
    id: "home:note-spread-prefix",
    match: all(on("/"), is("Read the note", "/aurum/notes?page=1")),
    verdict: "INCORRECT",
    severity: "MEDIUM",
    evidence: "Card names one specific published note but linked to the Daily Note archive.",
    fix: "Link to /aurum/notes/spread-on-a-one-ounce-coin.",
  },
  {
    id: "home:note-learn",
    match: all(on("/"), is("Read the note", "/aurum?range=1Y#learn")),
    verdict: "CORRECT",
    evidence: "Cards “Spot is not your price” / “Allocated or pooled” → AURUM #learn “Four things worth understanding first”, which contains cautions titled “Spot is not your price” and “Allocated or pooled”.",
  },
  { id: "home:mail", match: all(on("/"), is("support@getsqoot.com", "mailto:support@getsqoot.com")), verdict: "CORRECT", evidence: "Visible address equals mailto target; FAQ/privacy-request context." },
  {
    id: "home:see-all-questions",
    match: all(on("/"), is("See all questions", "/contact")),
    verdict: "AMBIGUOUS — CLIENT DECISION",
    severity: "CLIENT DECISION",
    evidence: "Label promises a full list of questions; /contact (“Get in touch.”) has no FAQ list and no FAQ page exists. No correct destination to choose.",
    fix: "Client: relabel (e.g. “Ask us a question”) or provide an FAQ page.",
  },
  { id: "privacy-link", match: is("Privacy Policy", "/privacy"), verdict: "CORRECT", evidence: "“Privacy Policy” → /privacy (H1 “Privacy Policy”)." },

  // ——— About / Early access / Pricing / Precious metal / Fractional ———
  { id: "about:protection", match: is("How we protect ownership", "/trust-center#protection"), verdict: "CORRECT", evidence: "Lands on Trust Center section “Client Protection”." },
  { id: "early-access-cta", match: is(/^(Get Early Access|Join the Waitlist|Join the waitlist to buy →|Join the SQOOT Pure waitlist)$/, "/early-access"), verdict: "CORRECT", evidence: "Waitlist CTA (site is pre-launch; purchase opens via waitlist) → /early-access." },
  { id: "pricing:mail", match: all(on("/pricing"), is("support@getsqoot.com", "mailto:support@getsqoot.com")), verdict: "CORRECT", evidence: "Visible address equals mailto target (fees FAQ)." },
  { id: "fractional:jbt", match: is(/Jewelers Board of Trade/, "https://www.jewelersboard.com/were-legit"), verdict: "CORRECT", evidence: "JBT member badge → Jewelers Board of Trade site." },
  { id: "fractional:ncba", match: is(/National Coin & Bullion Association/, "https://www.ncbassoc.org/membership"), verdict: "CORRECT", evidence: "NCBA member badge → NCBA membership page." },
  { id: "fractional:lbma", match: is("Learn about the standard →", "https://www.lbma.org.uk/good-delivery"), verdict: "CORRECT", evidence: "Good Delivery standard copy → LBMA Good Delivery page." },

  // ——— AURUM ———
  { id: "aurum:hero-price", match: is("See today's price ↓", "/aurum#price"), verdict: "CORRECT", evidence: "Lands on “TODAY'S GOLD PRICE” section." },
  { id: "aurum:hero-learn", match: is("Start with the basics", "/aurum#learn"), verdict: "CORRECT", evidence: "Lands on LEARN “Four things worth understanding first”." },
  {
    id: "aurum:fab",
    match: all(on("/aurum"), (o) => /^(Price|Daily Note|Weekly Brief|Learn|Calculator|Gifts|Subscribe)( →)?$/.test(t(o)) && /^\/aurum#/.test(tgt(o))),
    verdict: "CORRECT",
    evidence: "Floating nav label → same-named section (#price TODAY'S GOLD PRICE, #daily-note DAILY NOTE, #weekly-brief WEEKLY BRIEF, #learn LEARN, #calculator LOOK BACK CALCULATOR, #gifts GIFTS THAT LAST, #subscribe STAY IN TOUCH).",
  },
  { id: "aurum:open-as-page", match: (o) => t(o) === tgt(o) && /^\/aurum\/(notes|briefs)\/[a-z0-9-]+$/.test(tgt(o)), verdict: "CORRECT", evidence: "“OPEN AS A PAGE” shows the exact path of the expanded item and opens that item’s own page." },
  { id: "aurum:older-notes", match: is("Show older notes →", "/aurum/notes?page=1"), verdict: "CORRECT", evidence: "→ “Daily Note archive”." },
  { id: "aurum:all-notes", match: is("Browse all notes →", "/learn#aurum-archive"), verdict: "CORRECT", evidence: "→ Learn section “AURUM ARCHIVE — Every published note and brief”." },
  { id: "aurum:guides", match: (o) => /Read the guide/.test(t(o)) && /^\/learn\/[a-z0-9-]+$/.test(tgt(o)) && guideTitleMatches(o), verdict: "CORRECT", evidence: "Guide card title equals destination article H1." },
  { id: "aurum:gifts", match: is("See gifting options →", "/gifting"), verdict: "CORRECT", evidence: "Gifts section CTA → gifting page." },
  { id: "aurum:back", match: (o) => (t(o) === "← Back to AURUM") && ((o.sourceRoute === "/aurum/notes" && tgt(o) === "/aurum#daily-note") || (o.sourceRoute === "/aurum/briefs" && tgt(o) === "/aurum#weekly-brief")), verdict: "CORRECT", evidence: "Archive back-link returns to the matching AURUM section." },
  { id: "detail:back-notes", match: all(on(/^\/aurum\/notes\/[a-z0-9-]+$/), is("← Back to the notes archive", "/aurum/notes?page=1")), verdict: "CORRECT", evidence: "→ “Daily Note archive”." },
  { id: "detail:back-briefs", match: all(on(/^\/aurum\/briefs\/[a-z0-9-]+$/), is("← Back to the briefs archive", "/aurum/briefs?page=1")), verdict: "CORRECT", evidence: "→ “Weekly Brief archive”." },

  // ——— Source citations (published posts + Learn-article notes) ———
  ...SPECIFIC_SOURCES.map<Rule>(([label, url]) => ({
    id: `source:${label.source}`,
    match: (o) => o.category === "external" && label.test(t(o)) && url.test(tgt(o)),
    verdict: "CORRECT",
    evidence: "Citation names the publisher and resource; URL is that publisher’s page for that resource.",
  })),
  ...INDEX_SOURCES.map<Rule>(([label, url]) => ({
    id: `source-index:${label.source}`,
    match: (o) => o.category === "external" && label.test(t(o)) && url.test(tgt(o)),
    verdict: "AMBIGUOUS — CLIENT DECISION",
    severity: "CLIENT DECISION",
    evidence: "Publisher is correct, but the label names a specific dated document and the URL is the publisher’s general news/index page. Engineering cannot identify the exact document without editorial input.",
    fix: "Editorial: supply the exact document URL, or accept publisher-level citation.",
  })),

  // ——— Learn ———
  { id: "learn:intro", match: is("Watch the introduction", "/learn#learn-introduction"), verdict: "CORRECT", evidence: "Lands on the introduction video control (aria-label “Preview the introduction to gold”)." },
  { id: "learn:disclaimer", match: is("Important Disclaimer: Please Read", "/learn#disclaimer"), verdict: "CORRECT", evidence: "Lands on disclaimer block “Past performance is not a guarantee…”." },
  {
    id: "learn:qualities",
    match: is("Learn about gold's qualities", "/learn#articles"),
    verdict: "AMBIGUOUS — CLIENT DECISION",
    severity: "CLIENT DECISION",
    evidence: "Inside “Discover more of gold's potential benefits”; target #articles holds ETF / buying / gifting guides, none about gold’s qualities. No qualities page exists.",
    fix: "Client: choose destination or relabel.",
  },
  { id: "learn:articles", match: (o) => o.sourceRoute === "/learn" && t(o) === "LEARN MORE" && /^\/learn\/[a-z0-9-]+$/.test(tgt(o)) && learnCardMatches(o), verdict: "CORRECT", evidence: "Card heading matches destination article H1." },
  { id: "learn:see-more", match: is("SEE MORE", "/learn#performance-chart"), verdict: "CORRECT", evidence: "“A proven asset with competitive returns” → 20-year CAGR performance chart." },
  { id: "learn:case", match: is("THE CASE FOR GOLD", "/learn#benefits"), verdict: "CORRECT", evidence: "→ “Discover more of gold's potential benefits”." },
  { id: "learn:buying", match: is("BUYING GOLD SAFELY", "/learn#articles"), verdict: "CORRECT", evidence: "“Get the guide for investing in gold” → guides section whose second card is “HOW TO BUY GOLD SAFELY”." },
  {
    id: "learn:gold-org",
    match: is("Sign Up on Gold.org", "#"),
    verdict: "TECHNICALLY BLOCKED",
    severity: "CLIENT DECISION",
    evidence: "Card promises weekly insights; no authoritative public Gold.org weekly-briefing sign-up URL established (Phase 2). Still href=\"#\".",
    fix: "Client supplies the intended Gold.org URL, or the link is removed.",
  },
  { id: "learn:goldhub", match: is("Goldhub", "https://www.gold.org/goldhub"), verdict: "CORRECT", evidence: "“Goldhub” / World Gold Council insights → gold.org/goldhub (title “Goldhub | The Definitive Source for Gold Data and Insight”, verified Phase 2)." },
  { id: "learn:archive-cards", match: (o) => o.sourceRoute === "/learn" && /^(DAILY NOTE|WEEKLY BRIEF) /.test(t(o)) && archiveCardMatches(o), verdict: "CORRECT", evidence: "Card type + title match the destination note/brief (type and H1)." },
  { id: "learn:read-notes", match: is("READ THE NOTES →", "/aurum/notes?page=1"), verdict: "CORRECT", evidence: "→ “Daily Note archive”." },
  { id: "learn:read-briefs", match: is("READ THE BRIEFS →", "/aurum/briefs?page=1"), verdict: "CORRECT", evidence: "→ “Weekly Brief archive”." },

  // ——— Contact ———
  { id: "contact:mail", match: all(on("/contact"), is("hello@sqoot.us", "mailto:hello@sqoot.us")), verdict: "CORRECT", evidence: "Visible address equals mailto target. Which address is canonical is a separate client content decision." },
  { id: "contact:domains", match: all(on("/contact"), (o) => (t(o) === "sqootpure.com" && tgt(o) === "https://sqootpure.com/") || (t(o) === "aurum.sqootpure.com" && tgt(o) === "https://aurum.sqootpure.com/")), verdict: "CORRECT", evidence: "Visible domain equals target domain. Reachability/ownership left to Phase 4." },

  // ——— Gifting ———
  { id: "gifting:gift-card", match: is("Buy a Gift Card", "/gifting#gift-card"), verdict: "CORRECT", evidence: "→ “SQOOT PURE GIFT CARD — Give them the freedom to choose.” (purchase section)." },
  { id: "gifting:occasions", match: is("Explore Gold Gifts", "/gifting#occasions"), verdict: "CORRECT", evidence: "→ “FOR EVERY OCCASION — Mark life's most precious moments”." },
  {
    id: "gifting:view-all",
    match: is("View all occasions", "/gifting#gift-card"),
    verdict: "AMBIGUOUS — CLIENT DECISION",
    severity: "CLIENT DECISION",
    evidence: "Sits under the occasions grid; goes to the gift-card purchase section, not a list of occasions. No all-occasions page exists.",
    fix: "Client: relabel or supply an occasions destination.",
  },
  { id: "gifting:start", match: is("Start Gifting Gold", "/gifting#top"), verdict: "CORRECT", evidence: "Closing CTA → gifting hero containing “Buy a Gift Card” / “Explore Gold Gifts”." },
  { id: "old-gifting:explore", match: all(on("/gifting-old-ver"), is("Explore Gifts", "/precious-metal")), verdict: "CORRECT", evidence: "Legacy page sells gold pieces as gifts; → coins/bars catalogue. Route lifecycle is a separate IA decision." },
  { id: "old-gifting:how", match: is("How Gifting Works", "/gifting-old-ver#gifting-process"), verdict: "CORRECT", evidence: "→ “HOW GIFTING WORKS — Simple steps. Lasting impact.” (Choose Your Gift, …)." },

  // ——— Old homepage ———
  { id: "old-home:paths", match: all(on("/home-old-ver"), (o) => /^(Precious Metal|Fractional Gold|Vault|Gifting) /.test(t(o)) && ({ "Precious Metal": "/precious-metal", "Fractional Gold": "/fractional-gold", Vault: "/vault", Gifting: "/gifting" } as Record<string, string>)[t(o).split(" ").slice(0, t(o).startsWith("Precious") || t(o).startsWith("Fractional") ? 2 : 1).join(" ")] === tgt(o)), verdict: "CORRECT", evidence: "“Four paths to real gold” card title → same-named product page." },

  // ——— Legal ———
  { id: "legal:toc", match: (o) => (o.sourceRoute === "/privacy" || o.sourceRoute === "/terms") && o.category === "same-page-fragment" && /^\d+\. /.test(t(o)), verdict: "CORRECT", evidence: "Table-of-contents entry → H2 with the identical numbered heading (verified per fragment)." },

  // ——— Trust Center ———
  { id: "trust:audit", match: is("Explore the audit programme", "/trust-center#audit-programme"), verdict: "CORRECT", evidence: "→ “Your gold. Verified. Always. Independent vault audits every 6 months.”" },
  { id: "trust:mail", match: all(on("/trust-center"), (o) => /^mailto:support@getsqoot\.com(\?subject=Legal%20Counsel%20Detail)?$/.test(tgt(o)) && (t(o) === "support@getsqoot.com" || t(o) === "Request details")), verdict: "CORRECT", evidence: "Client Protection: visible address equals target; “Request details” pre-fills subject “Legal Counsel Detail” to the same published support address." },

  // ——— Vault ———
  { id: "vault:walkthrough", match: is("See how it works", "/vault#walkthrough"), verdict: "CORRECT", evidence: "→ “FOUNDER WALKTHROUGH — See it, don’t just read about it.” (2 min walkthrough)." },
  { id: "vault:allocation", match: is("How allocation works", "/vault#how-it-works"), verdict: "CORRECT", evidence: "→ “TWO WAYS TO HOLD YOUR GOLD — Choose the path…” (Delivered to me / Stored for me)." },
  {
    id: "vault:details",
    match: is("View vault details", "/early-access"),
    verdict: "AMBIGUOUS — CLIENT DECISION",
    severity: "CLIENT DECISION",
    evidence: "On the IDS and Vaultify facility cards; goes to the waitlist, not facility details. No facility detail page exists.",
    fix: "Client: relabel (waitlist) or supply facility-detail destinations.",
  },
  {
    id: "vault:faq",
    match: is("Learn more", "/vault#faq"),
    verdict: "AMBIGUOUS — CLIENT DECISION",
    severity: "CLIENT DECISION",
    evidence: "In “Redemption process”; target FAQ (“Questions worth asking.”) covers delivery and fees but has no redemption question.",
    fix: "Client: add a redemption FAQ or choose another destination.",
  },
  {
    id: "vault:watch",
    match: is("Watch the walkthrough", "/early-access"),
    verdict: "AMBIGUOUS — CLIENT DECISION",
    severity: "CLIENT DECISION",
    evidence: "Label promises a video; goes to waitlist. Adjacent copy says “Join the waitlist to be notified when the app opens.” No walkthrough video exists in the repository.",
    fix: "Client: supply the video or relabel.",
  },
];

// Title helpers — compare visible card text against the rendered destination H1.
let destinationH1: (o: SemanticOccurrence) => string = () => "";
export function setDestinationLookup(fn: (o: SemanticOccurrence) => string) {
  destinationH1 = fn;
}
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
function guideTitleMatches(o: SemanticOccurrence) {
  const h1 = norm(destinationH1(o));
  return h1.length > 0 && norm(t(o)).includes(h1.slice(0, 40));
}
function learnCardMatches(o: SemanticOccurrence) {
  const card = norm(sec(o));
  const map: Record<string, string> = {
    "physical gold vs gold etf": "/learn/physical-gold-vs-gold-etf",
    "how to buy gold safely": "/learn/how-to-buy-gold-safely",
    "gifting gold": "/learn/gifting-gold-guide",
  };
  return map[card] === tgt(o);
}
function archiveCardMatches(o: SemanticOccurrence) {
  const isNote = t(o).startsWith("DAILY NOTE");
  if (isNote !== tgt(o).startsWith("/aurum/notes/") || (!isNote && !tgt(o).startsWith("/aurum/briefs/"))) return false;
  const h1 = norm(destinationH1(o));
  return h1.length > 0 && norm(t(o)).includes(h1.slice(0, 30));
}

export function classifySemantic(o: SemanticOccurrence): SemanticResult {
  const hits = RULES.filter((r) => r.match(o));
  if (hits.length === 0) {
    return { semanticVerdict: "UNREVIEWED", semanticSeverity: "NONE", semanticRule: "none", semanticEvidence: "No Phase 3 judgement covers this occurrence.", semanticFix: null };
  }
  const r = hits[0];
  return {
    semanticVerdict: r.verdict,
    semanticSeverity: r.severity ?? (r.verdict === "INCORRECT" ? "LOW" : "NONE"),
    semanticRule: r.id,
    semanticEvidence: r.evidence,
    semanticFix: r.fix ?? null,
  };
}
