import { file, glob } from "astro/loaders";
import { z, defineCollection } from "astro:content";

const text = z.union([
  z.string(),
  z.object({ es: z.string(), en: z.string() }),
]);

export const experience = defineCollection({
  loader: file("src/content/experience.json"),
  schema: z.object({
    id: z.string(),
    entity: z.object({
      name: z.string(),
      url: z.string().url(),
      image: z.object({
        path: z.string(),
        alt: z.string(),
      }),
    }),
    location: text,
    interval: text,
    positions: z.array(
      z.object({
        title: text,
        description: text,
        highlight: text,
        interval: text,
      }),
    ),
    tags: z.array(z.string()),
  }),
});

export const education = defineCollection({
  loader: file("src/content/education.json"),
  schema: z.object({
    id: z.string(),
    title: text,
    interval: text,
    entity: z.object({
      name: z.string(),
      image: z.object({
        path: z.string(),
        alt: z.string(),
      }),
      url: z.string().url(),
    }),
    location: text,
    description: text,
    tags: z.array(z.string()),
    certificate: z.string().optional(),
  }),
});

export const socials = defineCollection({
  loader: file("src/content/socials.json"),
  schema: z.object({
    id: z.string(),
    url: z.string().url(),
    username: z.string(),
    network: z.string(),
  }),
});

export const projects = defineCollection({
  loader: file("src/content/projects.json"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    summary: text,
    description: text,
    url: z.string().url().optional(),
    repositoryUrl: z.string().url().optional(),
    demoUrl: z.union([z.string().url(), z.string().startsWith("/")]).optional(),
    websiteStatus: z
      .enum(["available", "unavailable", "unverified"])
      .default("unverified"),
    logo: z.object({
      path: z.string(),
      bg_color: z.string(),
    }),
    year: z.number(),
    tags: z.array(z.string()),
    visible: z.boolean(),
  }),
});

const blog = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.md",
    base: "src/content/blog",
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    description: z.string(),
    author: z.string(),
    image: z.object({
      url: z.string(),
      alt: z.string(),
    }),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
    lang: z.enum(["es", "en"]).default("es"),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .optional(),
  }),
});

export const collections = { blog, education, experience, socials, projects };
