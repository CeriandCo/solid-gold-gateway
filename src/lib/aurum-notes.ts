import { type AurumEditorial, type AurumEditorialSource } from "@/lib/aurum-editorial";

// Daily Note content lives in the database (aurum_posts) and is read server-side.
// No static copy is kept here on purpose: a fallback array would reintroduce the
// stale-content problem the CMS exists to fix.
export type AurumNoteSource = AurumEditorialSource;
export type AurumNote = AurumEditorial;

export function formatNoteDate(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00Z`));
}
