import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  publicDir: "public",
  // Relative base so the PWA works from file hosts / subpaths when previewed.
  base: "./",
});
