/**
 * The two security suites probe the real project on purpose. They may only
 * read: every non-GET request to the live project is blocked in-process.
 */
import { enforceReadOnlyFetch } from "./live-db-guard";

enforceReadOnlyFetch();
