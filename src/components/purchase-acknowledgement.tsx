import {
  ACKNOWLEDGEMENT_CONFIRMATION,
  ACKNOWLEDGEMENT_HEADING,
  ACKNOWLEDGEMENT_TERMS,
  type AcknowledgementKind,
} from "@/lib/commerce/acknowledgement";

/**
 * The acknowledgement panel shown directly above a purchase CTA (task C-9).
 * One checkbox covers the whole list. The wording lives in
 * src/lib/commerce/acknowledgement.ts so the client can edit it without
 * touching this layout.
 */
export function PurchaseAcknowledgement({
  kind,
  checked,
  onChange,
  id = "purchase-acknowledgement",
  className = "",
}: {
  kind: AcknowledgementKind;
  checked: boolean;
  onChange: (next: boolean) => void;
  id?: string;
  className?: string;
}) {
  const headingId = `${id}-heading`;
  return (
    <section
      className={`purchase-ack${className ? ` ${className}` : ""}`}
      aria-labelledby={headingId}
    >
      <h3 id={headingId} className="purchase-ack-heading">
        {ACKNOWLEDGEMENT_HEADING}
      </h3>
      <ul className="purchase-ack-list">
        {ACKNOWLEDGEMENT_TERMS[kind].map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <label className="purchase-ack-confirm" htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span>{ACKNOWLEDGEMENT_CONFIRMATION}</span>
      </label>
    </section>
  );
}
