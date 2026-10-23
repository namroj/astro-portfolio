import { describe, expect, it } from "vitest";
import { rehypeExternalLinks } from "../utils/rehypeExternalLinks.mjs";

function link(href, properties = {}) {
  return { type: "element", tagName: "a", properties: { href, ...properties } };
}

describe("Markdown external links", () => {
  it("opens external HTTP links in a new tab with safe rel values", () => {
    const external = link("https://developers.google.com/maps", {
      rel: ["nofollow"],
    });
    const tree = {
      type: "root",
      children: [{ type: "element", tagName: "p", children: [external] }],
    };

    rehypeExternalLinks({ siteOrigin: "https://jormanespinoza.netlify.app" })(
      tree,
    );

    expect(external.properties.target).toBe("_blank");
    expect(external.properties.rel).toEqual([
      "nofollow",
      "noopener",
      "noreferrer",
    ]);
  });

  it("keeps relative and same-origin links in the current tab", () => {
    const internal = link("/en/from-venezuela-to-argentina/");
    const sameOrigin = link("https://jormanespinoza.netlify.app/es/blog/");
    const email = link("mailto:hello@example.com");
    const tree = { type: "root", children: [internal, sameOrigin, email] };

    rehypeExternalLinks({ siteOrigin: "https://jormanespinoza.netlify.app" })(
      tree,
    );

    for (const node of tree.children) {
      expect(node.properties.target).toBeUndefined();
      expect(node.properties.rel).toBeUndefined();
    }
  });
});
