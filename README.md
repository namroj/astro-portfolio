# Jorman Espinoza — personal site

The maintained portfolio and blog, built with Astro and Preact. This project consolidates the Spanish and English portfolio content from `namroj.github.io` into a static site.

## Development

Use Node.js 22 or later and pnpm 9.12.3.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Visit `/es/` or `/en/`. Language selection uses real URLs and rendered HTML, rather than translating the page after hydration. Search, filtering, themes, fonts, and code controls run in the browser; no search server or database is needed.

## Content

- `src/content/{projects,experience,education}.json`: stable IDs and shared assets, with `{ "es": "…", "en": "…" }` for translated text. Existing Spanish content is retained and English translations came from the Next.js repository.
- `src/content/blog/*.md`: articles with `lang`, `slug`, `draft`, `title`, `description`, `pubDate`, `author`, `image`, and `tags`. Translations share a slug and have different filenames, for example `article.es.md` and `article.en.md`.
- Blog articles can include diagrams in fenced `mermaid` code blocks. Mermaid 11.17.2 is loaded on demand from jsDelivr only for articles that contain a diagram. The rendered diagram includes a source disclosure; if Mermaid cannot load, the original code block remains visible.
- `src/data/{skills,tools}.json`: technology and tooling links migrated from Next.js and supplemented with the technologies in the profile README.
- `public/`: certificates, images, fonts, and Netlify redirects.

Draft articles are excluded from pages, tags, search, RSS, and sitemap. The Next.js sample article translations are preserved as drafts. The existing guard-pattern article remains published in Spanish; the English blog stays empty until an English article is ready.

## Verification

```sh
pnpm verify
```

Runs Astro/TypeScript diagnostics, unit and DOM interaction tests, the production build, and an artifact check for translated pages, internal links/assets, redirects, search entries, sitemap, RSS, and draft exclusion. GitHub Actions runs the same checks.

## Configuration and deployment

See `.env.example`. Environment variables are optional:

| Variable                   | Purpose                                                                                                          |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `SITE_URL`                 | Canonical origin; defaults to `https://jormanespinoza.netlify.app`. Set to the working custom domain when ready. |
| `BASE_PATH`                | Optional path prefix for static project sites (for example, `/demo-repo` on `namroj.github.io/demo-repo/`). Leave empty for the portfolio's root deployment. |
| `GOOGLE_MAPS_API_KEY`      | Enables the interactive Venezuela-to-Argentina map. Without it, the page offers an OpenStreetMap link.           |
| `PUBLIC_GA_MEASUREMENT_ID` | Enables Google Analytics. The previous site used `G-SZZ5X56S6P`; leave unset to disable it.                      |

`netlify.toml` builds with `pnpm build` and publishes `dist`. Target the existing **jormanespinoza** Netlify project. Review the existing site's domain, environment, and repository connection before changing its build settings or publishing.

```sh
pnpm verify
netlify deploy --site jormanespinoza --dir dist --no-build
# After validating the draft deploy:
netlify deploy --site jormanespinoza --dir dist --no-build --prod
```

Netlify's project ID can be used in place of its name. Configure continuous deployment to use this repository, the chosen production branch, `pnpm build`, and `dist`. Remove the old Next.js build plugin from that project's UI if configured there. This repository does not change the existing remote site's settings automatically.

Legacy unprefixed URLs, `/formation`, `/location`, and old `/posts/` article links redirect to the corresponding Spanish pages. Netlify serves permanent HTTP redirects from `public/_redirects`; generated static redirect pages also work on simpler static hosts.

See [the migration notes](docs/migration.md) for the cutover checklist.

### Project links and demos

Project entries in `src/content/projects.json` can specify `repositoryUrl` for public source code and `demoUrl` for a working demo. Add a demo URL after verifying that it works for a visitor without access to your private accounts. Keep private repository URLs out of public project entries.

The original `url` is shown only when `websiteStatus` is `available`. Use `unavailable` for a known broken site (the project remains visible with a localized notice), or `unverified` until it has been checked. Verify actual page content: a suspended account or application error can still return HTTP 200. These statuses are editorial snapshots, not automatic uptime monitoring.

GitHub Pages can host static HTML, CSS, and JavaScript, but it cannot run PHP or a MySQL server. For MySQL projects, publish a static, read-only walkthrough with sanitized sample data to Pages, or keep the interactive application on a backend-capable host and link to it from the portfolio. Do not put database credentials in the browser bundle or GitHub repository. For a static project repository, set `BASE_PATH` to `/<repository-name>` during the build; for `namroj.github.io`, leave it empty. See [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) for the hosting limits.
