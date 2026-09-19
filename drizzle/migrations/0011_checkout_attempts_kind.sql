ALTER TABLE public.checkout_attempts
  ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'checkout';

ALTER TABLE public.checkout_attempts
  DROP CONSTRAINT IF EXISTS checkout_attempts_kind_check;

ALTER TABLE public.checkout_attempts
  ADD CONSTRAINT checkout_attempts_kind_check CHECK (kind IN ('checkout', 'status'));

DROP INDEX IF EXISTS public.checkout_attempts_ip_hash_created_at_idx;

CREATE INDEX IF NOT EXISTS checkout_attempts_ip_hash_kind_created_at_idx
  ON public.checkout_attempts (ip_hash, kind, created_at);