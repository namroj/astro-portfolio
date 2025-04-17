import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Enable global test APIs like describe, it, expect
    globals: true,
    // Environment to run tests in
    environment: "node",
    // Include files that match these patterns
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    // Exclude files that match these patterns
    exclude: ["node_modules", "dist", ".astro"],
  },
});
