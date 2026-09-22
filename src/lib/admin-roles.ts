/**
 * Shared role resolution for CMS workflow server functions.
 *
 * The role is always derived from the caller's own authenticated Supabase
 * client, never accepted as input. Anything unexpected — no allowlist row, an
 * unknown role string, a failed lookup — fails closed.
 *
 * Deliberately small: a helper, not an authorization framework.
 */

export type AdminRole = "admin" | "reviewer" | "editor";

export const ADMIN_ROLES: readonly AdminRole[] = ["admin", "reviewer", "editor"];

export const NOT_AN_EDITOR_MESSAGE = "Forbidden: you are not on the editor list.";
export const FORBIDDEN_ROLE_MESSAGE = "Forbidden: your role cannot do that.";

function asRole(value: unknown): AdminRole | null {
  return ADMIN_ROLES.find((candidate) => candidate === value) ?? null;
}

/**
 * Resolves the caller's role through their own user-scoped client, linking the
 * auth user to the allowlist row on first sign-in. Returns null for anyone not
 * on the list, and for any value that is not a role we recognise.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function resolveRole(supabase: any): Promise<AdminRole | null> {
  const { data, error } = await supabase.rpc("aurum_link_current_editor");
  if (error) throw new Error(error.message);
  return asRole(data);
}

/**
 * Resolves the caller's role and requires it to be in `allowed`.
 * Returns the resolved role so callers can branch on it without a second lookup.
 */
export async function requireRole(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  allowed: readonly AdminRole[],
): Promise<AdminRole> {
  const role = await resolveRole(supabase);
  if (!role) throw new Error(NOT_AN_EDITOR_MESSAGE);
  if (!allowed.includes(role)) throw new Error(FORBIDDEN_ROLE_MESSAGE);
  return role;
}
