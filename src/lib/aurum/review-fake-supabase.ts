/**
 * Test double for the two Supabase clients the review workflow uses: a
 * user-scoped one (role + aurum_can_edit_draft answered by the database in
 * real life) and a privileged one. Only the query shapes the workflow actually
 * issues are supported, and filters are applied faithfully so conditional
 * updates can be tested.
 */

export type FakePost = {
  id: string;
  type: string;
  status: string;
  slug: string;
  title: string;
  summary: string;
  body: unknown;
  pull_quote: string | null;
  review_line: string | null;
  read_minutes: number | null;
  published_at: string | null;
  updated_at: string;
  submitted_at: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  author_id: string | null;
  created_at: string;
};

export type FakeSource = { id: string; post_id: string };

export type FakeDb = {
  posts: FakePost[];
  sources: FakeSource[];
  /** Runs immediately before a privileged update is applied; used for races. */
  beforeUpdate?: (db: FakeDb) => void;
};

export function makePost(overrides: Partial<FakePost> = {}): FakePost {
  return {
    id: overrides.id ?? crypto.randomUUID(),
    type: "daily_note",
    status: "draft",
    slug: "gold-holds-its-ground",
    title: "Gold holds its ground",
    summary: "A short summary of the session.",
    body: ["Gold closed a little higher."],
    pull_quote: null,
    review_line: null,
    read_minutes: 2,
    published_at: null,
    updated_at: "2026-09-01T10:00:00.000Z",
    submitted_at: null,
    reviewed_by: "11111111-1111-4111-8111-111111111111",
    reviewed_at: "2026-08-01T10:00:00.000Z",
    author_id: "22222222-2222-4222-8222-222222222222",
    created_at: "2026-08-01T09:00:00.000Z",
    ...overrides,
  };
}

type Filter = { column: string; value: unknown };

class Builder<T> implements PromiseLike<T> {
  private filters: Filter[] = [];
  private head = false;
  private counting = false;
  private patch: Record<string, unknown> | null = null;
  private returning = false;

  constructor(
    private readonly db: FakeDb,
    private readonly table: "aurum_posts" | "aurum_post_sources",
    private readonly privileged: boolean,
  ) {}

  select(_columns?: string, options?: { count?: string; head?: boolean }): this {
    if (options?.head) this.head = true;
    if (options?.count) this.counting = true;
    this.returning = true;
    return this;
  }

  update(patch: Record<string, unknown>): this {
    this.patch = patch;
    this.returning = false;
    return this;
  }

  eq(column: string, value: unknown): this {
    this.filters.push({ column, value });
    return this;
  }

  private rows(): Record<string, unknown>[] {
    const source: Record<string, unknown>[] =
      this.table === "aurum_posts"
        ? (this.db.posts as unknown as Record<string, unknown>[])
        : (this.db.sources as unknown as Record<string, unknown>[]);
    return source.filter((row) => this.filters.every((f) => row[f.column] === f.value));
  }

  private run(): { data: unknown; error: null; count?: number } {
    if (this.patch) {
      if (!this.privileged) {
        return {
          data: null,
          error: { code: "42501", message: "row-level security" },
        } as unknown as { data: unknown; error: null };
      }
      this.db.beforeUpdate?.(this.db);
      const matched = this.rows();
      for (const row of matched) Object.assign(row, this.patch);
      return { data: this.returning ? matched : null, error: null };
    }
    const matched = this.rows();
    if (this.head) return { data: null, error: null, count: matched.length };
    return { data: matched, error: null };
  }

  async maybeSingle(): Promise<{ data: unknown; error: null }> {
    const result = this.run();
    const list = (result.data ?? []) as unknown[];
    return { data: list[0] ?? null, error: null };
  }

  then<R1 = T, R2 = never>(
    onfulfilled?: ((value: T) => R1 | PromiseLike<R1>) | null,
    onrejected?: ((reason: unknown) => R2 | PromiseLike<R2>) | null,
  ): PromiseLike<R1 | R2> {
    return Promise.resolve(this.run() as unknown as T).then(onfulfilled, onrejected);
  }
}

export type FakeClientOptions = {
  /** What aurum_link_current_editor returns for this caller. */
  role: unknown;
  /** What aurum_can_edit_draft returns for this caller. */
  canEditDraft?: boolean;
  privileged?: boolean;
  rpcError?: string;
};

export function makeFakeClient(db: FakeDb, options: FakeClientOptions) {
  const calls: { name: string; args: unknown }[] = [];
  return {
    calls,
    from(table: "aurum_posts" | "aurum_post_sources") {
      return new Builder(db, table, options.privileged ?? false);
    },
    async rpc(name: string, args?: unknown) {
      calls.push({ name, args });
      if (options.rpcError) return { data: null, error: { message: options.rpcError } };
      if (name === "aurum_link_current_editor") return { data: options.role, error: null };
      if (name === "aurum_can_edit_draft") {
        return { data: options.canEditDraft ?? false, error: null };
      }
      throw new Error(`unexpected rpc ${name}`);
    },
  };
}
