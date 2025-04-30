// @ts-check
import { defineConfig, envField } from "astro/config";
import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  // TODO change to https://jorman.dev
  site: "https://namroj-astro-portfolio.netlify.app",
  integrations: [preact()],
  env: {
    schema: {
      GOOGLE_MAPS_API_KEY: envField.string({
        context: "client",
        access: "public",
      }),
    },
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "material-theme-darker",
      },
    },
  },
});
