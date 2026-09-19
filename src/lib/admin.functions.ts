import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { NEUTRAL_SIGN_IN_MESSAGE } from "@/lib/admin.server";

export type AdminRole = "admin" | "reviewer" | "editor";

export type AdminMe = {
  email: string;
  role: AdminRole | null;
};

export type EditorRow = {
  id: string;
  email: string;
  role: AdminRole;
  signedIn: boolean;
  createdAt: string;
};

const ROLES: AdminRole[] = ["admin", "reviewer", "editor"];

function parseRole(value: unknown): AdminRole {
  const role = ROLES.find((candidate) => candidate === value);
  if (!role) throw new Error("Choose a role of admin, reviewer or editor.");
  return role;
}

/**
 * Resolves the caller's role through the user-scoped client, linking their auth user
 * to the allowlist row on first sign-in. Returns null for anyone not on the list.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function resolveRole(supabase: any): Promise<AdminRole | null> {
  const { data, error } = await supabase.rpc("aurum_link_current_editor");
  if (error) throw new Error(error.message);
  return (data as AdminRole | null) ?? null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function requireAdmin(supabase: any): Promise<void> {
  const role = await resolveRole(supabase);
  if (role !== "admin") throw new Error("Forbidden: this area is for admins only.");
}

/** Public: allowlist-gated, rate-limited magic-link request. Never reveals membership. */
export const requestAdminSignInLink = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const input = (data ?? {}) as Record<string, unknown>;
    return { email: String(input["email"] ?? "") };
  })
  .handler(async ({ data }) => {
    const { normalizeEmail, isValidEmail, sendAdminSignInLink } = await import(
      "@/lib/admin.server"
    );
    const email = normalizeEmail(data.email);
    if (!isValidEmail(email)) return { message: NEUTRAL_SIGN_IN_MESSAGE };

    // The return host comes from the request itself, so the link always comes back to
    // whichever host the person started from (preview now, the live domain later).
    const origin = new URL(getRequest().url).origin;
    const outcome = await sendAdminSignInLink(email, `${origin}/admin`);
    console.info(`[admin] sign-in link request: ${outcome}`);
    return { message: NEUTRAL_SIGN_IN_MESSAGE };
  });

export const getAdminMe = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminMe> => {
    const role = await resolveRole(context.supabase);
    const email = String((context.claims as { email?: string }).email ?? "");
    return { email, role };
  });

export const listEditors = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<EditorRow[]> => {
    await requireAdmin(context.supabase);
    const { data, error } = await context.supabase
      .from("aurum_editors")
      .select("id, email, role, user_id, created_at")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => ({
      id: row.id,
      email: row.email,
      role: row.role as AdminRole,
      signedIn: row.user_id !== null,
      createdAt: row.created_at,
    }));
  });

export const addEditor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => {
    const input = (data ?? {}) as Record<string, unknown>;
    return { email: String(input["email"] ?? ""), role: parseRole(input["role"]) };
  })
  .handler(async ({ data, context }) => {
    await requireAdmin(context.supabase);
    const { normalizeEmail, isValidEmail } = await import("@/lib/admin.server");
    const email = normalizeEmail(data.email);
    if (!isValidEmail(email)) throw new Error("Enter a valid email address.");

    const { error } = await context.supabase
      .from("aurum_editors")
      .insert({ email, role: data.role, created_by: context.userId });
    if (error) {
      throw new Error(
        error.code === "23505" ? "That email is already on the list." : error.message,
      );
    }
    return { ok: true };
  });

export const setEditorRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => {
    const input = (data ?? {}) as Record<string, unknown>;
    return { id: String(input["id"] ?? ""), role: parseRole(input["role"]) };
  })
  .handler(async ({ data, context }) => {
    await requireAdmin(context.supabase);
    const { error } = await context.supabase
      .from("aurum_editors")
      .update({ role: data.role })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const removeEditor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => ({
    id: String(((data ?? {}) as Record<string, unknown>)["id"] ?? ""),
  }))
  .handler(async ({ data, context }) => {
    await requireAdmin(context.supabase);
    const { error } = await context.supabase.from("aurum_editors").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getCmsSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const role = await resolveRole(context.supabase);
    if (!role) throw new Error("Forbidden: you are not on the editor list.");
    const { data, error } = await context.supabase
      .from("aurum_cms_settings")
      .select("allow_self_approval, updated_at")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return {
      allowSelfApproval: data?.allow_self_approval ?? true,
      updatedAt: data?.updated_at ?? null,
    };
  });

export const setAllowSelfApproval = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => ({
    allowSelfApproval: Boolean(((data ?? {}) as Record<string, unknown>)["allowSelfApproval"]),
  }))
  .handler(async ({ data, context }) => {
    await requireAdmin(context.supabase);
    const { error } = await context.supabase
      .from("aurum_cms_settings")
      .update({
        allow_self_approval: data.allowSelfApproval,
        updated_at: new Date().toISOString(),
        updated_by: context.userId,
      })
      .eq("id", true);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
