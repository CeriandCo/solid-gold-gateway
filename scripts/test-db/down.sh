#!/usr/bin/env bash
# Tears the throwaway test database down and removes its data directory.
set -uo pipefail

ROOT=/tmp/sqoot-test-db

if [ -f "$ROOT/postgrest.pid" ]; then
  kill "$(cat "$ROOT/postgrest.pid")" 2>/dev/null || true
fi
if [ -d "$ROOT/pgdata" ]; then
  runuser -u "${SQOOT_TEST_PGUSER:-lovable}" -- bash -c "pg_ctl -D '$ROOT/pgdata' -m immediate -w stop" >/dev/null 2>&1 || true
fi
rm -rf "$ROOT"
exit 0
