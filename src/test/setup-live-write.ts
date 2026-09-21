/**
 * Suites that need the real auth server (admin sign-in). They only run when
 * the operator opts in explicitly, and they never touch commerce tables.
 */
import { assertLiveOptIn } from "./live-db-guard";

assertLiveOptIn();
