import { MONTH_ABBR, type AurumEditorial, type AurumEditorialSource } from "@/lib/aurum-editorial";

// Daily Note content comes from the shared published Learn article registry.
// This module keeps only the compatible public type and deterministic date format.
export type AurumNoteSource = AurumEditorialSource;
export type AurumNote = AurumEditorial;

/** "2026-09-10" -> "10 Sep 2026". Fixed month table, never Intl ("Sept" risk). */
export function formatNoteDate(value: string): string {
  const [year, month, day] = value.split("-");
  return `${String(day).padStart(2, "0")} ${MONTH_ABBR[Number(month) - 1]} ${year}`;
}

