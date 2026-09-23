import { afterAll, describe, expect, it, vi } from "vitest";
const headers: Record<string, string | undefined> = {};
vi.mock("@tanstack/react-start/server", () => ({ getRequestHeader: (n: string) => headers[n.toLowerCase()] }));
const { runMeltSignup, newsletterPeppered } = await import("./signup.server");
const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
const hashes: string[] = [];
afterAll(async () => { for (const h of hashes) await supabaseAdmin.from("newsletter_attempts").delete().eq("ip_hash", h); });
describe("probe", () => {
  it("burst", async () => {
    process.env["NEWSLETTER_HASH_PEPPER"] = "probe-pepper";
    for (let round = 0; round < 5; round++) {
      const ip = `198.51.100.${round}-${crypto.randomUUID()}`;
      headers["cf-connecting-ip"] = ip; hashes.push((await newsletterPeppered(ip))!);
      for (let i=0;i<3;i++) await runMeltSignup({}, { consent: null });
      const res = await Promise.all(Array.from({ length: 6 }, () => runMeltSignup({}, { consent: null })));
      const passed = res.filter((r) => !(r.ok === false && r.code === "rate_limited")).length;
      console.log(`ROUND ${round}: passed limiter ${passed} / 6 after 3 prior (expect exactly 2)`);
    }
    expect(true).toBe(true);
  });
});
