import { MONTH_ABBR, type AurumEditorial, type AurumEditorialSource } from "@/lib/aurum-editorial";

// Daily Note content lives in the database (aurum_posts) and is read server-side.
// No static copy is kept here on purpose: a fallback array would reintroduce the
// stale-content problem the CMS exists to fix.
export type AurumNoteSource = AurumEditorialSource;
export type AurumNote = AurumEditorial;

/** "2026-09-10" -> "10 Sep 2026". Fixed month table, never Intl ("Sept" risk). */
export function formatNoteDate(value: string): string {
  const [year, month, day] = value.split("-");
  return `${String(day).padStart(2, "0")} ${MONTH_ABBR[Number(month) - 1]} ${year}`;
}

