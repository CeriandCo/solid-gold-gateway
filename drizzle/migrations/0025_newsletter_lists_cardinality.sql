-- Task T3 Phase 2 follow-up: array_length(lists, 1) returns NULL for an empty
-- array, so the original CHECK accepted '{}'. cardinality() returns 0 and the
-- constraint now actually holds. Proven by a DB test that previously passed
-- with an empty selection.
ALTER TABLE public.newsletter_signups
  DROP CONSTRAINT IF EXISTS newsletter_signups_lists_not_empty;

ALTER TABLE public.newsletter_signups
  ADD CONSTRAINT newsletter_signups_lists_not_empty CHECK (cardinality(lists) >= 1);