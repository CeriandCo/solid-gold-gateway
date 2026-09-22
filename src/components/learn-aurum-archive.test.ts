import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import type { AurumArchiveRow } from "@/lib/aurum-editorial";
import {
  PAGE_SIZE,
  archiveRoutePattern,
  filterArchiveRows,
} from "@/components/learn-aurum-archive";

const component = readFileSync(new URL("./learn-aurum-archive.tsx", import.meta.url), "utf8");
const server = readFileSync(new URL("../lib/aurum-editorial.server.ts", import.meta.url), "utf8");

function row(
  slug: string,
  type: AurumArchiveRow["type"],
  publishedAt = "2026-09-10",
): AurumArchiveRow {
  return { slug, title: `Title ${slug}`, summary: `Summary ${slug}`, publishedAt, type };
}

const notes = Array.from({ length: 6 }, (_, index) => row(`note-${index}`, "daily_note"));
const briefs = Array.from({ length: 3 }, (_, index) => row(`brief-${index}`, "weekly_brief"));
const rows = [...notes, ...briefs];

describe("Learn AURUM archive filtering", () => {
  it("shows every supplied note and brief under All", () => {
    expect(filterArchiveRows(rows, "all")).toEqual(rows);
  });

  it("shows only Daily Notes under the Daily Note filter", () => {
    const filtered = filterArchiveRows(rows, "daily_note");
    expect(filtered).toHaveLength(6);
    expect(filtered.every((item) => item.type === "daily_note")).toBe(true);
  });

  it("shows only Weekly Briefs under the Weekly Brief filter", () => {
    const filtered = filterArchiveRows(rows, "weekly_brief");
    expect(filtered).toHaveLength(3);
    expect(filtered.every((item) => item.type === "weekly_brief")).toBe(true);
  });

  it("produces an empty result the empty state can render", () => {
    expect(filterArchiveRows(notes, "weekly_brief")).toHaveLength(0);
    expect(component).toContain("No published posts of this type yet.");
  });
});

describe("Learn AURUM archive paging", () => {
  const many = Array.from({ length: 20 }, (_, index) => row(`many-${index}`, "daily_note"));

  it("starts at twelve visible rows", () => {
    expect(PAGE_SIZE).toBe(12);
    expect(many.slice(0, PAGE_SIZE)).toHaveLength(12);
  });

  it("exposes the next rows after one load more", () => {
    const next = many.slice(0, PAGE_SIZE * 2);
    expect(next).toHaveLength(20);
    expect(next[12]?.slug).toBe("many-12");
  });

  it("keeps load more in component state, never in the URL or router", () => {
    expect(component).toContain("useState(PAGE_SIZE)");
    expect(component).not.toContain("useNavigate");
    expect(component).not.toContain("scrollIntoView");
    expect(component).not.toContain("location.hash");
  });
});

describe("Learn AURUM archive URLs", () => {
  it("maps each type to its existing public route pattern", () => {
    expect(archiveRoutePattern("daily_note")).toBe("/aurum/notes/$slug");
    expect(archiveRoutePattern("weekly_brief")).toBe("/aurum/briefs/$slug");
  });

  it("builds the row links from that helper rather than a duplicated ternary", () => {
    expect(component).toContain("to={archiveRoutePattern(row.type)}");
  });
});

describe("Learn AURUM archive server read", () => {
  it("returns only published, already-live posts", () => {
    expect(server).toContain('query.eq("status", "published").lte("published_at"');
    expect(server).toContain("visible(");
  });

  it("returns only Daily Notes and Weekly Briefs", () => {
    expect(server).toContain('.in("type", ["daily_note", "weekly_brief"])');
  });

  it("orders newest first with a deterministic tie-break", () => {
    const archive = server.slice(server.indexOf("export async function loadEditorialArchive"));
    expect(archive).toContain('.order("published_at", { ascending: false })');
    expect(archive).toContain('.order("id", { ascending: false })');
  });
});
