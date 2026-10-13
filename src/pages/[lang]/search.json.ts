import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { locales, localize, route } from "../../i18n";
import { publishedPosts, postUrl } from "../../utils/blog";
export function getStaticPaths() {
  return locales.map((locale) => ({
    params: { lang: locale },
    props: { locale },
  }));
}
export async function GET({ props }: APIContext) {
  const locale = props.locale as import("../../i18n").Locale;
  const posts = publishedPosts(await getCollection("blog"), locale).map(
    (post) => ({
      id: `post-${post.id}`,
      url: postUrl(post),
      title: post.data.title,
      description: post.data.description,
      tags: post.data.tags,
      content: post.body || "",
      type: "post",
    }),
  );
  const projects = (await getCollection("projects"))
    .filter((p) => p.data.visible)
    .map((p) => {
      const data = localize(p.data, locale);
      return {
        id: `project-${p.id}`,
        url: `${route(locale, "projects")}#${p.id}`,
        title: data.name,
        description: data.summary,
        tags: data.tags,
        content: data.description,
        type: "project",
      };
    });
  return new Response(JSON.stringify([...posts, ...projects]), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
