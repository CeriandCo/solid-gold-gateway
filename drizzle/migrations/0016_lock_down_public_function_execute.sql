DO $$
DECLARE
  fn text;
  names text[] := ARRAY[
    'gift_card_order_settle','gift_card_ledger_append_only','gift_cards_guard',
    'commerce_prune_checkout_attempts','commerce_prune_delivery_attempts','commerce_delivery_tick',
    'gift_card_record','gift_card_activate_due','gift_card_claim_for_delivery',
    'gift_card_release_delivery_claim','gift_card_set_code',
    'aurum_fetcher_tick','aurum_backfill_tick','aurum_prune_old_rows','aurum_protect_last_admin',
    'aurum_posts_guard_workflow_fields','aurum_posts_require_source','aurum_posts_set_updated_at'
  ];
BEGIN
  FOR fn IN
    SELECT format('public.%I(%s)', p.proname, pg_get_function_identity_arguments(p.oid))
    FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = ANY(names)
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon, authenticated', fn);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', fn);
  END LOOP;
END $$;

DO $$
DECLARE
  fn text;
  names text[] := ARRAY[
    'aurum_current_editor_role','aurum_can_edit_draft','aurum_can_edit_post_sources',
    'aurum_link_current_editor','aurum_replace_post_sources'
  ];
BEGIN
  FOR fn IN
    SELECT format('public.%I(%s)', p.proname, pg_get_function_identity_arguments(p.oid))
    FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = ANY(names)
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon', fn);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated, service_role', fn);
  END LOOP;
END $$;

ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM authenticated;