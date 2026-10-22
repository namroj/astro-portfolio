import { describe, expect, it } from "vitest";
import { locales, localize, route, localeFromPath } from "../i18n";
import { publishedPosts, postUrl } from "../utils/blog";
import { matches, searchItems, type SearchItem } from "../utils/search";
import projects from "../content/projects.json";
import experience from "../content/experience.json";
import education from "../content/education.json";
import { readFileSync } from "node:fs";

describe("localized content migration", () => {
  it("preserves the complete portfolio in both languages", () => {
    expect(projects).toHaveLength(10);
    expect(experience).toHaveLength(9);
    expect(education).toHaveLength(27);
    for (const locale of locales) {
      expect(
        localize(projects, locale).every(
          (item) => typeof item.description === "string",
        ),
      ).toBe(true);
      expect(
        localize(experience, locale).every((item) =>
          item.positions.every(
            (position) => typeof position.title === "string",
          ),
        ),
      ).toBe(true);
      expect(
        localize(education, locale).every(
          (item) => typeof item.description === "string",
        ),
      ).toBe(true);
    }
    const englishExperience = localize(experience, "en");
    expect(
      englishExperience.find((item) => item.id === "freelance")?.positions[0]
        .title,
    ).toBe("Full Stack Developer");
    expect(
      englishExperience.find((item) => item.id === "accenture-song")
        ?.positions[0].title,
    ).toBe("Full Stack Developer [Lead]");
    expect(localize(education, "en")[0].location).toBe("Online");
  });
  it("keeps stable IDs and optional certificates while localizing deeply", () => {
    expect(localize(education, "en").map((item) => item.id)).toEqual(
      education.map((item) => item.id),
    );
    expect(localize(education, "en")[0].certificate).toBe(
      education[0].certificate,
    );
    expect(
      localize({ list: [{ text: { es: "Hola", en: "Hello" } }] }, "en"),
    ).toEqual({ list: [{ text: "Hello" }] });
  });
  it("builds canonical language URLs without duplicate slashes", () => {
    expect(route("es")).toBe("/es/");
    expect(route("en", "/projects/")).toBe("/en/projects/");
    expect(localeFromPath("/en/blog/")).toBe("en");
    expect(localeFromPath("/experience")).toBe("es");
  });
});

describe("publishing policy", () => {
  const posts = [
    {
      id: "spanish",
      data: {
        lang: "es" as const,
        slug: "article",
        draft: false,
        pubDate: new Date("2025-01-01"),
      },
    },
    {
      id: "english",
      data: {
        lang: "en" as const,
        slug: "article",
        draft: false,
        pubDate: new Date("2025-02-01"),
      },
    },
    {
      id: "draft",
      data: {
        lang: "es" as const,
        draft: true,
        pubDate: new Date("2026-01-01"),
      },
    },
  ];
  it("excludes drafts and separates translations", () => {
    expect(publishedPosts(posts).map((p) => p.id)).toEqual([
      "english",
      "spanish",
    ]);
    expect(publishedPosts(posts, "es").map((p) => p.id)).toEqual(["spanish"]);
    expect(postUrl(posts[1])).toBe("/en/blog/article/");
  });
  it("preserves sample posts as unpublished content", () => {
    for (const locale of locales)
      expect(
        readFileSync(
          new URL(`../content/blog/prueba.${locale}.md`, import.meta.url),
          "utf8",
        ),
      ).toContain("draft: true");
  });
});

describe("global search", () => {
  const items: SearchItem[] = [
    {
      id: "project",
      type: "project",
      url: "/en/projects/#demo",
      title: "Demo store",
      description: "An ecommerce project",
      content: "VTEX integration",
      tags: ["React"],
    },
    {
      id: "post",
      type: "post",
      url: "/es/blog/patron/",
      title: "Patrón guardia",
      description: "Código limpio",
      content: "Use early returns",
      tags: ["Java"],
    },
  ];
  it("finds project descriptions, article bodies, and tags", () => {
    expect(searchItems(items, "VTEX")[0].id).toBe("project");
    expect(searchItems(items, "early returns")[0].id).toBe("post");
    expect(searchItems(items, "react")[0].id).toBe("project");
  });
  it("ignores accents and requires every search word", () => {
    expect(matches("Patrón de diseño", "patron diseno")).toBe(true);
    expect(searchItems(items, "patron limpio")).toHaveLength(1);
    expect(searchItems(items, "patron vtex")).toHaveLength(0);
    expect(searchItems(items, "  ")).toHaveLength(0);
  });
});
