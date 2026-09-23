import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * Attacker-path tests: everything here speaks plain HTTP to the real REST
 * endpoint with the public anon key, exactly as a browser or a script would.
 */
const SUPABASE_URL = process.env["SUPABASE_URL"]!;
const ANON_KEY = process.env["SUPABASE_PUBLISHABLE_KEY"]!;

const COMMERCE_TABLES = [
  "commerce_settings",
  "commerce_alerts",
  "checkout_attempts",
  "gift_card_denominations",
  "gift_card_orders",
  "gift_cards",
  "gift_card_ledger",
  "gift_card_delivery_attempts",
  "stripe_events",
];

const AURUM_TABLES = [
  "aurum_posts",
  "aurum_post_sources",
  "aurum_editors",
  "aurum_cms_settings",
  "aurum_admin_link_requests",
  "aurum_spot_prices",
  "aurum_daily_closes",
  "aurum_fetcher_runs",
];

// T3: MELT consent evidence and its rate-limit bucket. Both are locked the same
// way — service_role only, RLS on, no policies — so no browser role may touch them.
const NEWSLETTER_TABLES = ["newsletter_signups", "newsletter_attempts"];

const ALL_TABLES = [...COMMERCE_TABLES, ...AURUM_TABLES, ...NEWSLETTER_TABLES];

type Attempt = { label: string; status: number; rows: number };
const report: Attempt[] = [];

function headers(token?: string) {
  return {
    apikey: ANON_KEY,
    "Content-Type": "application/json",
    Prefer: "return=representation",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function rest(
  method: string,
  path: string,
  token?: string,
  body?: unknown,
): Promise<{ status: number; rows: number; text: string }> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: headers(token),
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const text = await response.text();
  let rows = 0;
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) rows = parsed.length;
  } catch {
    rows = 0;
  }
  return { status: response.status, rows, text };
}

/** Denied, or allowed but returning nothing — both are acceptable outcomes. */
function expectNoData(result: { status: number; rows: number }, label: string) {
  report.push({ label, status: result.status, rows: result.rows });
  const denied = result.status >= 400;
  expect(denied || result.rows === 0, `${label} → ${result.status}/${result.rows} rows`).toBe(true);
}

async function createTempUser(email: string) {
  const password = `Tmp-${crypto.randomUUID()}`;
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) throw error;
  const anon = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const signIn = await anon.auth.signInWithPassword({ email, password });
  if (signIn.error) throw signIn.error;
  return { id: data.user!.id, token: signIn.data.session!.access_token };
}

let functionNames: string[] = [];
let nonEditor: { id: string; token: string };
let editor: { id: string; token: string };
const editorEmail = `b5-editor-${crypto.randomUUID()}@example.com`;
const nonEditorEmail = `b5-visitor-${crypto.randomUUID()}@example.com`;

beforeAll(async () => {
  const { data, error } = await supabaseAdmin.rpc("security_function_grants");
  if (error) throw error;
  functionNames = (data as { function_name: string }[]).map((row) => row.function_name);

  nonEditor = await createTempUser(nonEditorEmail);
  const { error: insertError } = await supabaseAdmin
    .from("aurum_editors")
    .insert({ email: editorEmail, role: "editor" });
  if (insertError) throw insertError;
  editor = await createTempUser(editorEmail);
});

afterAll(async () => {
  await supabaseAdmin.from("aurum_editors").delete().eq("email", editorEmail);
  for (const user of [nonEditor, editor]) {
    if (user?.id) await supabaseAdmin.auth.admin.deleteUser(user.id);
  }
  // eslint-disable-next-line no-console
  console.log(`REST attempts checked: ${report.length}`);
});

describe("anon key against the REST endpoint", () => {
  it("cannot execute any function in public", async () => {
    const executed: string[] = [];
    for (const name of functionNames) {
      const result = await rest("POST", `rpc/${name}`, undefined, {});
      report.push({ label: `anon rpc ${name}`, status: result.status, rows: result.rows });
      if (result.status < 400) executed.push(`${name} (${result.status})`);
    }
    expect(executed).toEqual([]);
  });

  it("reads nothing from any commerce or aurum table", async () => {
    for (const table of ALL_TABLES) {
      expectNoData(await rest("GET", `${table}?select=*&limit=5`), `anon GET ${table}`);
    }
  });

  it("cannot insert, update or delete in any table", async () => {
    for (const table of ALL_TABLES) {
      expectNoData(await rest("POST", table, undefined, {}), `anon POST ${table}`);
      expectNoData(
        await rest("PATCH", `${table}?id=not.is.null`, undefined, { id: crypto.randomUUID() }),
        `anon PATCH ${table}`,
      );
      expectNoData(await rest("DELETE", `${table}?id=not.is.null`), `anon DELETE ${table}`);
    }
  });
});

describe("signed-in non-editor", () => {
  it("cannot execute any function in public", async () => {
    const executed: string[] = [];
    for (const name of functionNames) {
      const result = await rest("POST", `rpc/${name}`, nonEditor.token, {});
      const allowed = [
        "aurum_current_editor_role",
        "aurum_link_current_editor",
        "aurum_can_edit_draft",
        "aurum_can_edit_post_sources",
        "aurum_replace_post_sources",
      ];
      report.push({ label: `non-editor rpc ${name}`, status: result.status, rows: result.rows });
      if (result.status < 400 && !allowed.includes(name)) executed.push(name);
    }
    expect(executed).toEqual([]);
  });

  it("sees nothing in any commerce table and nothing in the CMS", async () => {
    for (const table of ALL_TABLES) {
      expectNoData(
        await rest("GET", `${table}?select=*&limit=5`, nonEditor.token),
        `non-editor GET ${table}`,
      );
      expectNoData(
        await rest("POST", table, nonEditor.token, {}),
        `non-editor POST ${table}`,
      );
      expectNoData(
        await rest("DELETE", `${table}?id=not.is.null`, nonEditor.token),
        `non-editor DELETE ${table}`,
      );
    }
  });

  it("gets no role from the editor helper", async () => {
    const result = await rest("POST", "rpc/aurum_current_editor_role", nonEditor.token, {});
    expect(result.text.replace(/"/g, "")).toBe("null");
  });
});

describe("signed-in editor", () => {
  it("cannot see any commerce table", async () => {
    for (const table of COMMERCE_TABLES) {
      expectNoData(
        await rest("GET", `${table}?select=*&limit=5`, editor.token),
        `editor GET ${table}`,
      );
      expectNoData(await rest("POST", table, editor.token, {}), `editor POST ${table}`);
      expectNoData(
        await rest("DELETE", `${table}?id=not.is.null`, editor.token),
        `editor DELETE ${table}`,
      );
    }
  });

  it("can read CMS posts once linked, and still cannot delete published posts", async () => {
    const link = await rest("POST", "rpc/aurum_link_current_editor", editor.token, {});
    expect(link.text.replace(/"/g, "")).toBe("editor");

    const posts = await rest("GET", "aurum_posts?select=id,status&limit=50", editor.token);
    expect(posts.status).toBe(200);
    expect(posts.rows).toBeGreaterThan(0);

    const before = await supabaseAdmin
      .from("aurum_posts")
      .select("id", { count: "exact", head: true });
    await rest("DELETE", "aurum_posts?status=eq.published", editor.token);
    const after = await supabaseAdmin
      .from("aurum_posts")
      .select("id", { count: "exact", head: true });
    expect(after.count).toBe(before.count);
  });

  it("cannot execute commerce or cron functions", async () => {
    const dangerous = [
      "gift_card_order_settle",
      "gift_card_record",
      "gift_card_activate_due",
      "commerce_delivery_tick",
      "aurum_fetcher_tick",
      "aurum_backfill_tick",
    ];
    for (const name of dangerous) {
      const result = await rest("POST", `rpc/${name}`, editor.token, {});
      report.push({ label: `editor rpc ${name}`, status: result.status, rows: result.rows });
      expect(result.status).toBeGreaterThanOrEqual(400);
    }
  });
});
