import { defineConfig } from "vite";

// Local/preview: relative base. GitHub Pages: set VITE_BASE=/emt-field-bilingual-aid/
const base = process.env.VITE_BASE || "./";

export default defineConfig({
  root: ".",
  publicDir: "public",
  base,
});
