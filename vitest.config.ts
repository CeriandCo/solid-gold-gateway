import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

const LIVE_READ_ONLY = ["src/lib/security/**/*.test.ts"];
const LIVE_WRITE = ["src/lib/admin-password.server.test.ts"];

// The live-write suites need the real auth server, so they only run when the
// operator opts in. Everything else runs against a throwaway database.
const optedIntoLive = process.env["ALLOW_LIVE_DB_TESTS"] === "1";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    testTimeout: 60_000,
    hookTimeout: 60_000,
    fileParallelism: false,
    projects: [
      {
        plugins: [tsconfigPaths()],
        test: {
          name: "isolated",
          include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
          exclude: ["**/node_modules/**", ...LIVE_READ_ONLY, ...LIVE_WRITE],
          globalSetup: ["src/test/global-setup.ts"],
          setupFiles: ["src/test/setup-isolated.ts"],
          testTimeout: 60_000,
          hookTimeout: 120_000,
          fileParallelism: false,
        },
      },
      {
        plugins: [tsconfigPaths()],
        test: {
          name: "live-readonly",
          include: LIVE_READ_ONLY,
          setupFiles: ["src/test/setup-live-readonly.ts"],
          testTimeout: 60_000,
          hookTimeout: 60_000,
          fileParallelism: false,
        },
      },
      ...(optedIntoLive
        ? [
            {
              plugins: [tsconfigPaths()],
              test: {
                name: "live-write",
                include: LIVE_WRITE,
                setupFiles: ["src/test/setup-live-write.ts"],
                testTimeout: 60_000,
                hookTimeout: 60_000,
                fileParallelism: false,
              },
            },
          ]
        : []),
    ],
  },
});
