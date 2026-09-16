import type { AurumNote } from "@/lib/aurum-notes";
import { AurumEditorialBody, AurumEditorialQuote, AurumEditorialSources } from "@/components/aurum-editorial-content";

export function AurumNoteBody({ note }: { note: AurumNote }) {
  return <AurumEditorialBody article={note} />;
}

export function AurumNoteQuote({ note }: { note: AurumNote }) {
  return <AurumEditorialQuote article={note} />;
}

export function AurumNoteSources({ note, idPrefix }: { note: AurumNote; idPrefix: string }) {
  return <AurumEditorialSources article={note} idPrefix={idPrefix} />;
}
