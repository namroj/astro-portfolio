import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";
import assert from "node:assert/strict";
const root = resolve("dist");
const read = (path) => readFileSync(resolve(root, path), "utf8");
function target(path) {
  const file = resolve(root, decodeURIComponent(path).replace(/^\//, ""));
  return (
    existsSync(file) &&
    (statSync(file).isFile() || existsSync(resolve(file, "index.html")))
  );
}
const locales = ["es", "en"];
const visibleProjects = JSON.parse(
  readFileSync("src/content/projects.json", "utf8"),
).filter((p) => p.visible).length;
for (const locale of locales) {
  for (const page of [
    "",
    "about",
    "education",
    "experience",
    "projects",
    "blog",
    "contact",
    "from-venezuela-to-argentina",
  ]) {
    const html = read(`${locale}/${page ? page + "/" : ""}index.html`);
    assert(
      html.includes(`lang="${locale}"`),
      `${locale}/${page}: wrong language`,
    );
    assert.equal(
      (html.match(/<h1[\s>]/g) || []).length,
      1,
      `${locale}/${page}: expected one heading`,
    );
    assert(
      !html.includes("[object Object]"),
      `${locale}/${page}: untranslated content`,
    );
  }
  const search = JSON.parse(read(`${locale}/search.json`));
  assert.equal(
    search.filter((item) => item.type === "project").length,
    visibleProjects,
  );
  assert(
    !search.some((item) => item.url.includes("prueba")),
    "Draft leaked into search",
  );
  for (const item of search)
    assert(
      target(new URL(item.url, "https://example.com").pathname),
      `Broken search URL: ${item.url}`,
    );
  const rss = read(`${locale}/rss.xml`);
  assert(
    !rss.includes("prueba") && !rss.includes("/posts/"),
    "RSS contains drafts or obsolete links",
  );
  for (const [, link] of rss.matchAll(/<link>([^<]+)<\/link>/g))
    assert(target(new URL(link).pathname), `Broken RSS URL: ${link}`);
  assert(
    !existsSync(resolve(root, `${locale}/blog/prueba/index.html`)),
    "Draft has a published page",
  );

  const guardArticle = read(`${locale}/blog/guard-pattern/index.html`);
  assert(
    guardArticle.includes('data-language="mermaid"'),
    `${locale} Guard Clauses article is missing its Mermaid source fallback`,
  );
}
const sitemap = read("sitemap.xml");
assert(
  !sitemap.includes("prueba") && !sitemap.includes("/posts/"),
  "Sitemap contains draft or legacy URLs",
);
for (const [, url] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g))
  assert(target(new URL(url).pathname), `Broken sitemap URL: ${url}`);
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(resolve(dir, e.name)) : [resolve(dir, e.name)],
  );
}
let count = 0;
for (const file of walk(root).filter((file) => file.endsWith(".html"))) {
  const html = readFileSync(file, "utf8");
  for (const [, value] of html.matchAll(
    /(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g,
  )) {
    assert(target(value), `${file}: missing local target ${value}`);
    count++;
  }
}
for (const legacy of [
  "",
  "formation",
  "location",
  "blog/guard-pattern",
  "posts/guard-pattern",
  "blog/prueba",
]) {
  assert(
    read(`${legacy ? legacy + "/" : ""}index.html`).includes(
      'http-equiv="refresh"',
    ),
    `Missing legacy redirect ${legacy}`,
  );
}
console.log(
  `Static site verified: localized pages, drafts, search, RSS, sitemap, redirects, and ${count} local links/assets.`,
);
