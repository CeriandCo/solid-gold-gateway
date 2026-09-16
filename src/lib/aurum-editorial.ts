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
  pullQuote?: string;
  sources: AurumEditorialSource[];
  reviewLine?: string;
};

export function formatEditorialDate(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00Z`));
}