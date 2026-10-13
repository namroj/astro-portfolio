# Next.js → Astro consolidation

## Preserved

- All nine projects (eight are public; one retains `visible: false`), nine experience entries, and 27 education entries.
- Spanish content and Astro's IDs, logo paths, certificates, and project visibility.
- English translations from Next.js for résumé and project content.
- Skills and tools from Next.js, including its AI tools, plus Astro, mobile platforms, VTEX, Azure, and Docker from the profile.
- The substantive Spanish guard-pattern article; both Next.js test articles are retained as drafts.
- Dark/light/system theme, font selection, code-block features, table of contents, social links, contact email, and optional map/analytics integrations.

## Changes

- `/es/` and `/en/` routes render their language at build time. Canonicals and alternate-language links reflect actual published pages; untranslated articles switch to the other language's home rather than a missing translation.
- Global search covers published article bodies and visible projects. Keyboard shortcuts: Ctrl/Cmd+K or `/`, arrows, Enter, Escape. Indexes are static, separate for each language, and exclude drafts/hidden projects.
- Portfolio and blog filters work across the complete rendered content, then paginate ten results at a time. With JavaScript disabled, all content remains visible.
- RSS, sitemap, tags, article routes, and search share the same publication policy. RSS article links point to `/[lang]/blog/[slug]/`.
- About content and project headings are complete. The existing broken database certificate URL now points to `certificado-bd.pdf`.
- Google Maps is optional. Analytics is opt-in through the existing measurement ID; no credentials are committed.
- The Next.js repository is untouched so the previous implementation remains available during review and rollback.

## Before production cutover

1. Verify the existing `jormanespinoza` Netlify project's ID, domain, environment variables, repository, and production branch.
2. Confirm `SITE_URL` is the working public origin. Keep the Netlify origin until `jorman.dev` is configured and working.
3. Set `PUBLIC_GA_MEASUREMENT_ID=G-SZZ5X56S6P` if analytics should remain enabled; retain the Google Maps browser key if the interactive map is wanted.
4. Run `pnpm verify`, publish a draft deploy, and check desktop/mobile navigation, search, theme/font preferences, articles, filters, and certificates.
5. Publish the validated artifact to production. Point continuous deployment at the Astro repository; use `pnpm build` and `dist`, and remove any Next.js-specific UI plugin/settings.
6. Verify redirects and canonical/RSS URLs on the live domain. Update GitHub profile project links to this repository when ready.
7. Only then archive the Next.js repository or mark its README as superseded. Keep the previous Netlify deploy available for rollback.

## Validation limits

A static build and DOM tests do not establish visual quality or accessibility across all browsers. When browser execution is unavailable, a real desktop/mobile preview remains a release check. Deployment requires access to Netlify's API; a locally verified artifact is not evidence of a successful upload.
