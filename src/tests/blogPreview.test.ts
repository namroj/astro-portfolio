import { describe, expect, it } from "vitest";
import { blogListingPosts, publishedPosts, type PostInfo } from "../utils/blog";

const posts: PostInfo[] = [
  {
    id: "draft-es",
    data: { draft: true, lang: "es", pubDate: new Date("2026-10-23") },
  },
  {
    id: "published-es",
    data: { draft: false, lang: "es", pubDate: new Date("2026-10-22") },
  },
  {
    id: "draft-en",
    data: { draft: true, lang: "en", pubDate: new Date("2026-10-23") },
  },
];

describe("blog draft previews", () => {
  it("shows localized drafts in the development listing but not the production listing", () => {
    expect(blogListingPosts(posts, "es", true).map((post) => post.id)).toEqual([
      "draft-es",
      "published-es",
    ]);
    expect(blogListingPosts(posts, "es", false).map((post) => post.id)).toEqual(
      ["published-es"],
    );
  });

  it("keeps the published-post filter unchanged for public feeds", () => {
    expect(publishedPosts(posts, "es").map((post) => post.id)).toEqual([
      "published-es",
    ]);
  });
});
