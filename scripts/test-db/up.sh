#!/usr/bin/env bash
# Starts a throwaway Postgres + PostgREST pair for the commerce test suites.
#
# Nothing here ever writes to the live project: the live database is read
# exactly twice, with pg_dump --schema-only and a --data-only dump of the two
# reference tables, both read-only operations.
#
# Writes /tmp/sqoot-test-db/env.json with the local REST url.
set -euo pipefail

ROOT=/tmp/sqoot-test-db
DATA=$ROOT/pgdata
LOG=$ROOT/logs
PGPORT_LOCAL=${SQOOT_TEST_PGPORT:-54329}
RESTPORT=${SQOOT_TEST_RESTPORT:-54330}

rm -rf "$ROOT"
mkdir -p "$DATA" "$LOG"

# Postgres refuses to run as root, so the server runs as an unprivileged user.
PGRUNAS=${SQOOT_TEST_PGUSER:-lovable}
id -u "$PGRUNAS" >/dev/null 2>&1 || {
  echo "No unprivileged user '$PGRUNAS' to run Postgres as." >&2; exit 1;
}
chown -R "$PGRUNAS" "$ROOT"

setpriv --reuid="$PGRUNAS" --regid="$PGRUNAS" --clear-groups bash -c "initdb -D '$DATA' -U postgres --auth=trust" >"$LOG/initdb.log" 2>&1
setpriv --reuid="$PGRUNAS" --regid="$PGRUNAS" --clear-groups bash -c "pg_ctl -D '$DATA' -l '$LOG/postgres.log' -o '-p $PGPORT_LOCAL -k $ROOT -c listen_addresses=127.0.0.1' -w start" >/dev/null

LOCAL="postgres://postgres@127.0.0.1:$PGPORT_LOCAL/postgres"

# --- Supabase-shaped prerequisites the dump assumes exist ---------------------
psql -q "$LOCAL" <<'SQL'
create extension if not exists pgcrypto;
do $$ begin
  create role anon nologin noinherit;
exception when duplicate_object then null; end $$;
do $$ begin
  create role authenticated nologin noinherit;
exception when duplicate_object then null; end $$;
do $$ begin
  create role service_role nologin noinherit bypassrls;
exception when duplicate_object then null; end $$;
do $$ begin
  create role authenticator login noinherit;
exception when duplicate_object then null; end $$;
grant anon, authenticated, service_role to authenticator;
grant usage on schema public to anon, authenticated, service_role;

create schema if not exists auth;
create schema if not exists vault;
create schema if not exists net;
create table if not exists auth.users (
  id uuid primary key default gen_random_uuid(),
  email text
);
create or replace function auth.uid() returns uuid language sql stable as $$ select null::uuid $$;
create or replace function auth.jwt() returns jsonb language sql stable as $$ select '{}'::jsonb $$;
create table if not exists vault.decrypted_secrets (name text primary key, decrypted_secret text);
create or replace function net.http_post(
  url text, headers jsonb default '{}'::jsonb, body jsonb default '{}'::jsonb,
  params jsonb default '{}'::jsonb, timeout_milliseconds int default 5000
) returns bigint language sql as $$ select 0::bigint $$;
grant usage on schema auth, vault, net to postgres, service_role;
SQL

# --- Structure and reference data, copied from the live project (read-only) ---
pg_dump --schema-only --no-owner --no-privileges --schema=public -f "$ROOT/schema.sql"
psql -q -v ON_ERROR_STOP=0 "$LOCAL" -f "$ROOT/schema.sql" >"$LOG/schema-load.log" 2>&1 || true

pg_dump --data-only --no-owner \
  -t public.commerce_settings -t public.gift_card_denominations \
  -f "$ROOT/reference-data.sql"
psql -q -v ON_ERROR_STOP=1 "$LOCAL" -f "$ROOT/reference-data.sql" >"$LOG/data-load.log" 2>&1

psql -q "$LOCAL" <<'SQL'
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to service_role, postgres;
grant all on all sequences in schema public to service_role, postgres;
grant execute on all functions in schema public to service_role, postgres;
SQL

# --- PostgREST -----------------------------------------------------------------
# No jwt-secret is configured, so every request runs as the anonymous role.
# That role is service_role here, which is what supabaseAdmin expects.
cat >"$ROOT/postgrest.conf" <<CONF
db-uri = "postgres://postgres@127.0.0.1:$PGPORT_LOCAL/postgres"
db-schemas = "public"
db-anon-role = "service_role"
server-host = "127.0.0.1"
server-port = $RESTPORT
db-pool = 10
CONF

nix run nixpkgs#postgrest -- "$ROOT/postgrest.conf" >"$LOG/postgrest.log" 2>&1 &
echo $! >"$ROOT/postgrest.pid"

for _ in $(seq 1 60); do
  if curl -sf -o /dev/null "http://127.0.0.1:$RESTPORT/commerce_settings?select=id"; then
    break
  fi
  sleep 1
done
curl -sf -o /dev/null "http://127.0.0.1:$RESTPORT/commerce_settings?select=id" || {
  echo "PostgREST did not come up; see $LOG/postgrest.log" >&2
  tail -20 "$LOG/postgrest.log" >&2
  exit 1
}

cat >"$ROOT/env.json" <<JSON
{ "restUrl": "http://127.0.0.1:$RESTPORT", "pgPort": $PGPORT_LOCAL, "restPort": $RESTPORT }
JSON
echo "test database ready on port $PGPORT_LOCAL, REST on $RESTPORT"
