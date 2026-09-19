import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  createDraft,
  deleteDraft,
  slugify,
  updateDraft,
  WEEKLY_BRIEF_REVIEW_LINE,
  type AdminPostEditable,
} from "@/lib/admin.functions";
import { AurumEditorialPreview } from "@/components/aurum-editorial-preview";
import { formatShortDate, type AurumEditorial } from "@/lib/aurum-editorial";


export type AdminPostType = "daily_note" | "weekly_brief";

const TYPE_LABELS: Record<string, string> = {
  daily_note: "Daily Note",
  weekly_brief: "Weekly Brief",
  article: "Article",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  in_review: "In review",
  scheduled: "Scheduled",
  published: "Published",
  archived: "Archived",
};

const SUMMARY_SOFT_LIMIT = 200;

type SourceState = {
  publisher: string;
  title: string;
  date: string;
  url: string;
};

type SourceErrors = Partial<Record<keyof SourceState, string>>;

type FormState = {
  type: AdminPostType;
  title: string;
  slug: string;
  slugTouched: boolean;
  summary: string;
  body: string[];
  pullQuote: string;
  reviewLine: string;
  readMinutesOverride: string;
  publishedAt: string;
  sources: SourceState[];
};

/** timestamptz -> the value a datetime-local input expects, in UTC. */
function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 16);
}

/** About 200 words a minute, never below one. */
function readMinutesFromBody(body: string[]): number {
  const words = body.join(" ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Inline checks, mirroring the server rules so nothing is sent that would be refused. */
function checkSource(source: SourceState): SourceErrors {
  const errors: SourceErrors = {};
  if (!source.publisher.trim()) errors.publisher = "A publisher is required.";
  if (!source.title.trim()) errors.title = "A title is required.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(source.date)) errors.date = "A date is required.";
  else if (source.date > todayUtc()) errors.date = "The date cannot be in the future.";
  const url = source.url.trim();
  let parsed: URL | null = null;
  try {
    parsed = new URL(url);
  } catch {
    parsed = null;
  }
  if (!parsed || parsed.protocol !== "https:") {
    errors.url = "Use a full web address starting with https://.";
  }
  return errors;
}

function initialState(post: AdminPostEditable | null, type: AdminPostType): FormState {
  if (!post) {
    return {
      type,
      title: "",
      slug: "",
      slugTouched: false,
      summary: "",
      body: [""],
      pullQuote: "",
      reviewLine: type === "weekly_brief" ? WEEKLY_BRIEF_REVIEW_LINE : "",
      readMinutesOverride: "",
      publishedAt: "",
      sources: [],
    };
  }
  return {
    type: (post.type as AdminPostType) ?? "daily_note",
    title: post.title,
    slug: post.slug,
    slugTouched: true,
    summary: post.summary,
    body: post.body.length > 0 ? post.body : [""],
    pullQuote: post.pullQuote,
    reviewLine: post.reviewLine,
    readMinutesOverride: post.readMinutes === null ? "" : String(post.readMinutes),
    publishedAt: toLocalInput(post.publishedAt),
    sources: post.sources.map((source) => ({
      publisher: source.publisher,
      title: source.title,
      date: source.date,
      url: source.url,
    })),
  };
}


export function AdminPostForm({ post }: { post: AdminPostEditable | null }) {
  const navigate = useNavigate();
  const readOnly = post !== null && !post.editable;

  const [state, setState] = useState<FormState>(() => initialState(post, "daily_note"));
  const [saved, setSaved] = useState(() => JSON.stringify(initialState(post, "daily_note")));
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showSourceErrors, setShowSourceErrors] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const dirty = !readOnly && JSON.stringify(state) !== saved;
  const autoMinutes = useMemo(() => readMinutesFromBody(state.body), [state.body]);
  const sourceErrors = useMemo(() => state.sources.map(checkSource), [state.sources]);
  const hasSourceErrors = sourceErrors.some((errors) => Object.keys(errors).length > 0);

  const previewArticle: AurumEditorial = useMemo(() => {
    const body = state.body.map((paragraph) => paragraph.trim()).filter(Boolean);
    const override = Number(state.readMinutesOverride);
    return {
      slug: state.slug,
      title: state.title,
      summary: state.summary,
      publishedAt: (state.publishedAt ? state.publishedAt.slice(0, 10) : "") || todayUtc(),
      readMinutes:
        state.readMinutesOverride !== "" && Number.isFinite(override) && override >= 1
          ? Math.trunc(override)
          : readMinutesFromBody(state.body),
      body,
      ...(state.pullQuote.trim() ? { pullQuote: state.pullQuote.trim() } : {}),
      ...(state.reviewLine.trim() ? { reviewLine: state.reviewLine.trim() } : {}),

      sources: state.sources.map((source) => ({
        publisher: source.publisher,
        title: source.title,
        date: /^\d{4}-\d{2}-\d{2}$/.test(source.date) ? formatShortDate(source.date) : source.date,
        url: source.url,
      })),
    };
  }, [state]);

  // Warn before a full page unload; in-app links ask for confirmation themselves.
  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setState((current) => ({ ...current, [key]: value }));
  };

  const setTitle = (title: string) => {
    setState((current) => ({
      ...current,
      title,
      slug: current.slugTouched ? current.slug : slugify(title),
    }));
  };

  const setParagraph = (index: number, value: string) => {
    setState((current) => ({
      ...current,
      body: current.body.map((paragraph, i) => (i === index ? value : paragraph)),
    }));
  };

  const moveParagraph = (index: number, delta: number) => {
    setState((current) => {
      const next = [...current.body];
      const target = index + delta;
      if (target < 0 || target >= next.length) return current;
      const moved = next[index] as string;
      next[index] = next[target] as string;
      next[target] = moved;
      return { ...current, body: next };
    });
  };

  const setSource = (index: number, key: keyof SourceState, value: string) => {
    setState((current) => ({
      ...current,
      sources: current.sources.map((source, i) =>
        i === index ? { ...source, [key]: value } : source,
      ),
    }));
  };

  const moveSource = (index: number, delta: number) => {
    setState((current) => {
      const next = [...current.sources];
      const target = index + delta;
      if (target < 0 || target >= next.length) return current;
      const moved = next[index] as SourceState;
      next[index] = next[target] as SourceState;
      next[target] = moved;
      return { ...current, sources: next };
    });
  };

  const payload = () => ({
    title: state.title,
    slug: state.slug,
    summary: state.summary,
    body: state.body,
    pullQuote: state.pullQuote,
    reviewLine: state.reviewLine,
    readMinutes: state.readMinutesOverride === "" ? null : state.readMinutesOverride,
    publishedAt: state.publishedAt ? new Date(`${state.publishedAt}Z`).toISOString() : null,
    sources: state.sources.map((source) => ({
      publisher: source.publisher.trim(),
      title: source.title.trim(),
      date: source.date,
      url: source.url.trim(),
    })),
  });

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (hasSourceErrors) {
      // Nothing is sent, so neither the post nor its sources change.
      setShowSourceErrors(true);
      setNotice(null);
      setError("Check the sources below. Nothing was saved.");
      return;
    }
    setShowSourceErrors(false);
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      if (post) {
        await updateDraft({ data: { id: post.id, ...payload() } });
        setSaved(JSON.stringify(state));
        setNotice("Draft saved.");
      } else {
        const result = await createDraft({ data: { type: state.type, ...payload() } });
        setSaved(JSON.stringify(state));
        await navigate({ to: "/admin/posts/$postId", params: { postId: result.id } });
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "That draft could not be saved.");
    } finally {
      setBusy(false);
    }

  };

  const remove = async () => {
    if (!post) return;
    setBusy(true);
    setError(null);
    try {
      await deleteDraft({ data: { id: post.id } });
      setSaved(JSON.stringify(state));
      await navigate({ to: "/admin/posts" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "That draft could not be deleted.");
      setBusy(false);
      setConfirmDelete(false);
    }
  };

  const leave = () => {
    if (dirty && !window.confirm("You have unsaved changes. Leave without saving?")) return;
    void navigate({ to: "/admin/posts" });
  };

  return (
    <section className="admin-card">
      <div className="admin-card__header">
        <div>
          <p className="admin-muted">
            <button type="button" className="admin-linkish" onClick={leave}>
              ← All posts
            </button>
          </p>
          <h1 className="admin-heading">{post ? state.title || "Untitled" : "New post"}</h1>
          {post ? (
            <p className="admin-muted">
              <span className={`admin-badge admin-badge--${post.status.replace("_", "-")}`}>
                {STATUS_LABELS[post.status] ?? post.status}
              </span>{" "}
              {TYPE_LABELS[post.type] ?? post.type}
            </p>
          ) : null}
        </div>
      </div>

      {readOnly ? (
        <p className="admin-note" role="note">
          Editing published posts arrives with the review workflow.
        </p>
      ) : null}
      {error ? (
        <p className="admin-alert" role="alert">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p className="admin-note" role="status">
          {notice}
        </p>
      ) : null}

      <div className="admin-form__actions">
        <button
          type="button"
          className="admin-button admin-button--ghost"
          aria-expanded={showPreview}
          onClick={() => setShowPreview((current) => !current)}
        >
          {showPreview ? "Hide preview" : "Show preview"}
        </button>
      </div>

      <div className={showPreview ? "admin-editor-layout" : "admin-editor-layout is-single"}>
      <form className="admin-form admin-post-form" onSubmit={save}>

        <div className="admin-field">
          <label className="admin-label" htmlFor="post-type">
            Type
          </label>
          {post ? (
            <p className="admin-muted">{TYPE_LABELS[post.type] ?? post.type}</p>
          ) : (
            <select
              id="post-type"
              className="admin-input admin-input--select"
              value={state.type}
              onChange={(event) => {
                const type = event.target.value as AdminPostType;
                setState((current) => ({
                  ...current,
                  type,
                  reviewLine:
                    current.reviewLine === "" || current.reviewLine === WEEKLY_BRIEF_REVIEW_LINE
                      ? type === "weekly_brief"
                        ? WEEKLY_BRIEF_REVIEW_LINE
                        : ""
                      : current.reviewLine,
                }));
              }}
            >
              <option value="daily_note">Daily Note</option>
              <option value="weekly_brief">Weekly Brief</option>
            </select>
          )}
          <p className="admin-help">The type is fixed once the post is created.</p>
        </div>

        <div className="admin-field">
          <label className="admin-label" htmlFor="post-title">
            Title
          </label>
          <input
            id="post-title"
            className="admin-input"
            required
            disabled={readOnly}
            value={state.title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className="admin-field">
          <label className="admin-label" htmlFor="post-slug">
            Web address
          </label>
          <input
            id="post-slug"
            className="admin-input"
            required
            disabled={readOnly}
            value={state.slug}
            onChange={(event) =>
              setState((current) => ({
                ...current,
                slug: event.target.value.toLowerCase(),
                slugTouched: true,
              }))
            }
          />
          <p className="admin-help">
            Lowercase letters, numbers and hyphens. Filled in from the title until you change it.
          </p>
        </div>

        <div className="admin-field">
          <label className="admin-label" htmlFor="post-summary">
            Summary
          </label>
          <textarea
            id="post-summary"
            className="admin-input admin-textarea"
            required
            rows={3}
            disabled={readOnly}
            value={state.summary}
            onChange={(event) => set("summary", event.target.value)}
          />
          <p className={state.summary.length > SUMMARY_SOFT_LIMIT ? "admin-help is-warning" : "admin-help"}>
            {state.summary.length} characters
            {state.summary.length > SUMMARY_SOFT_LIMIT
              ? ` — longer than the usual ${SUMMARY_SOFT_LIMIT}. You can still save it.`
              : ""}
          </p>
        </div>

        <fieldset className="admin-field admin-fieldset">
          <legend className="admin-label">Body</legend>
          {state.body.map((paragraph, index) => (
            <div className="admin-paragraph" key={index}>
              <label className="admin-visually-hidden" htmlFor={`post-body-${index}`}>
                Paragraph {index + 1}
              </label>
              <textarea
                id={`post-body-${index}`}
                className="admin-input admin-textarea"
                rows={4}
                disabled={readOnly}
                value={paragraph}
                onChange={(event) => setParagraph(index, event.target.value)}
              />
              {readOnly ? null : (
                <div className="admin-paragraph__actions">
                  <button
                    type="button"
                    className="admin-button admin-button--ghost"
                    disabled={index === 0}
                    onClick={() => moveParagraph(index, -1)}
                  >
                    Move up
                  </button>
                  <button
                    type="button"
                    className="admin-button admin-button--ghost"
                    disabled={index === state.body.length - 1}
                    onClick={() => moveParagraph(index, 1)}
                  >
                    Move down
                  </button>
                  <button
                    type="button"
                    className="admin-button admin-button--ghost"
                    disabled={state.body.length === 1}
                    onClick={() =>
                      setState((current) => ({
                        ...current,
                        body: current.body.filter((_, i) => i !== index),
                      }))
                    }
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          ))}
          {readOnly ? null : (
            <button
              type="button"
              className="admin-button admin-button--ghost"
              onClick={() => setState((current) => ({ ...current, body: [...current.body, ""] }))}
            >
              Add paragraph
            </button>
          )}
          <p className="admin-help">
            Empty paragraphs are dropped when you save. At least one is required.
          </p>
        </fieldset>

        <fieldset className="admin-field admin-fieldset">
          <legend className="admin-label">Sources</legend>
          {state.sources.length === 0 ? (
            <p className="admin-help is-warning">
              At least one source is required before this can be published.
            </p>
          ) : null}
          {state.sources.map((source, index) => {
            const errors = showSourceErrors ? (sourceErrors[index] ?? {}) : {};
            return (
              <div className="admin-source" key={index}>
                <div className="admin-field">
                  <label className="admin-label" htmlFor={`source-publisher-${index}`}>
                    Publisher
                  </label>
                  <input
                    id={`source-publisher-${index}`}
                    className="admin-input"
                    disabled={readOnly}
                    value={source.publisher}
                    onChange={(event) => setSource(index, "publisher", event.target.value)}
                  />
                  {errors.publisher ? (
                    <p className="admin-help is-warning">{errors.publisher}</p>
                  ) : null}
                </div>
                <div className="admin-field">
                  <label className="admin-label" htmlFor={`source-title-${index}`}>
                    Title
                  </label>
                  <input
                    id={`source-title-${index}`}
                    className="admin-input"
                    disabled={readOnly}
                    value={source.title}
                    onChange={(event) => setSource(index, "title", event.target.value)}
                  />
                  {errors.title ? <p className="admin-help is-warning">{errors.title}</p> : null}
                </div>
                <div className="admin-field">
                  <label className="admin-label" htmlFor={`source-date-${index}`}>
                    Date
                  </label>
                  <input
                    id={`source-date-${index}`}
                    className="admin-input"
                    type="date"
                    max={todayUtc()}
                    disabled={readOnly}
                    value={source.date}
                    onChange={(event) => setSource(index, "date", event.target.value)}
                  />
                  {errors.date ? <p className="admin-help is-warning">{errors.date}</p> : null}
                </div>
                <div className="admin-field">
                  <label className="admin-label" htmlFor={`source-url-${index}`}>
                    Web address
                  </label>
                  <input
                    id={`source-url-${index}`}
                    className="admin-input"
                    type="url"
                    placeholder="https://"
                    disabled={readOnly}
                    value={source.url}
                    onChange={(event) => setSource(index, "url", event.target.value)}
                  />
                  {errors.url ? <p className="admin-help is-warning">{errors.url}</p> : null}
                </div>
                {readOnly ? null : (
                  <div className="admin-paragraph__actions">
                    <button
                      type="button"
                      className="admin-button admin-button--ghost"
                      disabled={index === 0}
                      onClick={() => moveSource(index, -1)}
                    >
                      Move up
                    </button>
                    <button
                      type="button"
                      className="admin-button admin-button--ghost"
                      disabled={index === state.sources.length - 1}
                      onClick={() => moveSource(index, 1)}
                    >
                      Move down
                    </button>
                    <button
                      type="button"
                      className="admin-button admin-button--ghost"
                      onClick={() =>
                        setState((current) => ({
                          ...current,
                          sources: current.sources.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          {readOnly ? null : (
            <button
              type="button"
              className="admin-button admin-button--ghost"
              onClick={() =>
                setState((current) => ({
                  ...current,
                  sources: [
                    ...current.sources,
                    { publisher: "", title: "", date: "", url: "" },
                  ],
                }))
              }
            >
              Add source
            </button>
          )}
          <p className="admin-help">
            Sources are saved with the draft, in the order shown here.
          </p>
        </fieldset>



        <div className="admin-field">
          <label className="admin-label" htmlFor="post-pull-quote">
            Pull quote (optional)
          </label>
          <textarea
            id="post-pull-quote"
            className="admin-input admin-textarea"
            rows={2}
            disabled={readOnly}
            value={state.pullQuote}
            onChange={(event) => set("pullQuote", event.target.value)}
          />
        </div>

        <div className="admin-field">
          <label className="admin-label" htmlFor="post-review-line">
            Review line (optional)
          </label>
          <textarea
            id="post-review-line"
            className="admin-input admin-textarea"
            rows={2}
            disabled={readOnly}
            value={state.reviewLine}
            onChange={(event) => set("reviewLine", event.target.value)}
          />
        </div>

        <div className="admin-field">
          <label className="admin-label" htmlFor="post-read-minutes">
            Read time
          </label>
          <p className="admin-muted">Calculated: {autoMinutes} min</p>
          <input
            id="post-read-minutes"
            className="admin-input"
            type="number"
            min={1}
            placeholder="Leave empty to use the calculated time"
            disabled={readOnly}
            value={state.readMinutesOverride}
            onChange={(event) => set("readMinutesOverride", event.target.value)}
          />
          <p className="admin-help">Optional manual override, in minutes.</p>
        </div>

        <div className="admin-field">
          <label className="admin-label" htmlFor="post-published-at">
            Planned publication date (optional)
          </label>
          <input
            id="post-published-at"
            className="admin-input"
            type="datetime-local"
            disabled={readOnly}
            value={state.publishedAt}
            onChange={(event) => set("publishedAt", event.target.value)}
          />
          <p className="admin-help">
            Times are UTC. This only takes effect when the post is published, which arrives in the
            next step.
          </p>
        </div>

        {readOnly ? null : (
          <div className="admin-form__actions">
            <button type="submit" className="admin-button" disabled={busy}>
              {busy ? "Saving…" : "Save draft"}
            </button>
            {post ? (
              <button
                type="button"
                className="admin-button admin-button--ghost"
                disabled={busy}
                onClick={() => setConfirmDelete(true)}
              >
                Delete draft
              </button>
            ) : null}
            {dirty ? <span className="admin-muted">Unsaved changes</span> : null}
          </div>
        )}
      </form>

      {showPreview ? (
        <aside className="admin-preview" aria-label="Preview, not published">
          <p className="admin-preview__label">Preview, not published</p>
          <div className="admin-preview__frame">
            <AurumEditorialPreview article={previewArticle} type={state.type} />
          </div>
        </aside>
      ) : null}
      </div>

      {confirmDelete ? (
        <div className="admin-confirm" role="alertdialog" aria-label="Delete this draft?">
          <p>Delete this draft? This cannot be undone.</p>
          <div className="admin-form__actions">
            <button type="button" className="admin-button" disabled={busy} onClick={() => void remove()}>
              Delete
            </button>
            <button
              type="button"
              className="admin-button admin-button--ghost"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

