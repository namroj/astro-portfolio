// @ts-check
import { defineConfig, envField } from "astro/config";
import preact from "@astrojs/preact";
import { rehypeExternalLinks } from "./src/utils/rehypeExternalLinks.mjs";

const siteUrl = process.env.SITE_URL || "https://jormanespinoza.netlify.app";

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  base: process.env.BASE_PATH || "",
  output: "static",
  trailingSlash: "always",
  redirects: {
    "/": "/es/",
    ...Object.fromEntries(
      [
        "about",
        "education",
        "experience",
        "projects",
        "blog",
        "contact",
        "from-venezuela-to-argentina",
      ].map((page) => [`/${page}`, `/es/${page}/`]),
    ),
    "/formation": "/es/education/",
    "/location": "/es/from-venezuela-to-argentina/",
    "/rss.xml": "/es/rss.xml",
    "/search.json": "/es/search.json",
  },
  integrations: [preact()],
  env: {
    schema: {
      GOOGLE_MAPS_API_KEY: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
      GOOGLE_MAPS_LIGHT_MAP_ID: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
      GOOGLE_MAPS_DARK_MAP_ID: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
    },
  },
  markdown: {
    rehypePlugins: [
      [rehypeExternalLinks, { siteOrigin: new URL(siteUrl).origin }],
    ],
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "material-theme-darker",
      },
    },
  },
});
