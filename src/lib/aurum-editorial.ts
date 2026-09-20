export type AurumEditorialSource = {
  publisher: string;
  title: string;
  date: string;
  url: string;
};

export type AurumEditorial = {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  readMinutes: number;
  body: string[];
  blocks?: Array<
    | { type: "p" | "h2" | "h3" | "blockquote"; text: string }
    | { type: "ul"; text: string; items: string[] }
  >;
  pullQuote?: string;
  sources: AurumEditorialSource[];
  reviewLine?: string;
};

// Fixed month table on purpose: some en-GB runtimes render "Sept" via Intl, and a
// server/browser difference would also cause a hydration mismatch. Shared by every
// short-date formatter (server module and client components alike).
export const MONTH_ABBR = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

/** "2026-09-08" -> "8 Sep 2026" (no leading zero). */
export function formatShortDate(value: string): string {
  const [year, month, day] = value.split("-");
  return `${Number(day)} ${MONTH_ABBR[Number(month) - 1]} ${year}`;
}

export function formatEditorialDate(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00Z`));
}
