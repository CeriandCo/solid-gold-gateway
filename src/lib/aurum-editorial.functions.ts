import { createServerFn } from "@tanstack/react-start";
import type { AurumEditorial } from "@/lib/aurum-editorial";
import type { AurumEditorialType, EditorialPage } from "@/lib/aurum-editorial.server";

const TYPES = ["daily_note", "weekly_brief", "article"] as const;

function parseType(value: unknown): AurumEditorialType {
  const type = TYPES.find((candidate) => candidate === value);
  if (!type) throw new Error("Unsupported editorial type");
  return type;
}

export const fetchEditorialPage = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => {
    const input = (data ?? {}) as Record<string, unknown>;
    const limit = Number(input["limit"] ?? 3);
    const offset = Number(input["offset"] ?? 0);
    return {
      type: parseType(input["type"]),
      limit: Number.isFinite(limit) ? Math.min(Math.max(Math.trunc(limit), 1), 50) : 3,
      offset: Number.isFinite(offset) ? Math.max(Math.trunc(offset), 0) : 0,
      includeSlug: typeof input["includeSlug"] === "string" ? input["includeSlug"] : null,
    };
  })
  .handler(async ({ data }): Promise<EditorialPage> => {
    const { loadEditorialPage } = await import("@/lib/aurum-editorial.server");
    return loadEditorialPage(data);
  });

export const fetchEditorialBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => {
    const input = (data ?? {}) as Record<string, unknown>;
    return {
      type: parseType(input["type"]),
      slug: String(input["slug"] ?? ""),
    };
  })
  .handler(async ({ data }): Promise<AurumEditorial | null> => {
    const { loadEditorialBySlug } = await import("@/lib/aurum-editorial.server");
    return loadEditorialBySlug(data.type, data.slug);
  });
