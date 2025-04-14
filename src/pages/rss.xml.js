import rss from "@astrojs/rss";
import { pagesGlobToRssItems } from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = await getCollection("blog");
  return rss({
    title:
      "Jorman Espinoza | Ingeniero de Software y Entusiasta de la Tecnología",
    description:
      "Ideas, tutoriales y reflexiones sobre ingeniería de software, desarrollo y tecnología por Jorman Espinoza.",
    site: context.site,
    items: [
      ...(await pagesGlobToRssItems(import.meta.glob("./**/*.md"))),
      ...posts.map((post) => ({
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: `/posts/${post.id}/`,
      })),
    ],
    customData: `<language>es-es</language>`,
  });
}
