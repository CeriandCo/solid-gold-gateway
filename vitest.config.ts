import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

// These suites talk to the real database over the network, so the default
// 5-second limit is too tight for the multi-step commerce scenarios.
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    testTimeout: 60_000,
    hookTimeout: 60_000,
    // Every suite writes to the same real database, and the fraud rules count
    // rows per buyer per day, so suites must not overlap.
    fileParallelism: false,
  },
});
