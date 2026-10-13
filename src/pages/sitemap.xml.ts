import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { locales, route } from "../i18n";
import { publishedPosts, postUrl } from "../utils/blog";
import { slugify } from "../utils/slugify";
export async function GET({ site }: APIContext) {
  const posts = publishedPosts(await getCollection("blog"));
  const paths = locales.flatMap((locale) => [
    ...[
      "",
      "about",
      "education",
      "experience",
      "projects",
      "blog",
      "blog/tags",
      "contact",
      "from-venezuela-to-argentina",
    ].map((page) => route(locale, page)),
    ...[
      ...new Set(
        posts
          .filter((p) => p.data.lang === locale)
          .flatMap((p) => p.data.tags.map(slugify)),
      ),
    ].map((tag) => route(locale, `blog/tags/${tag}`)),
  ]);
  const escape = (value: string) =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll('"', "&quot;");
  const urls = [...paths, ...posts.map(postUrl)]
    .map((path) => `<url><loc>${escape(new URL(path, site!).href)}</loc></url>`)
    .join("\n");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
}
