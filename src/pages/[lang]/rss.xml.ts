import type { APIContext } from "astro";
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { locales, messages } from "../../i18n";
import { publishedPosts, postUrl } from "../../utils/blog";
export function getStaticPaths() {
  return locales.map((locale) => ({
    params: { lang: locale },
    props: { locale },
  }));
}
export async function GET({ props, site }: APIContext) {
  const locale = props.locale as import("../../i18n").Locale;
  return rss({
    title: `Jorman Espinoza • ${messages[locale].blog}`,
    description: messages[locale].description,
    site: site!,
    items: publishedPosts(await getCollection("blog"), locale).map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: postUrl(post),
    })),
    customData: `<language>${locale}</language>`,
  });
}
