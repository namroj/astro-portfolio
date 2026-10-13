import type { Locale } from "../i18n";
import { route } from "../i18n";
export type PostInfo = {
  id: string;
  data: { draft: boolean; lang: Locale; slug?: string; pubDate: Date };
};
export function publishedPosts<T extends PostInfo>(
  posts: T[],
  locale?: Locale,
): T[] {
  return posts
    .filter((p) => !p.data.draft && (!locale || p.data.lang === locale))
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}
export function postSlug(post: PostInfo) {
  return post.data.slug || post.id;
}
export function postUrl(post: PostInfo) {
  return route(post.data.lang, `blog/${postSlug(post)}`);
}
