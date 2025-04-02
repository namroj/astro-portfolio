import { file, glob } from "astro/loaders";
import { z, defineCollection } from "astro:content";

export const experience = defineCollection({
    loader: file("src/content/experience.json"),
    schema: z.object({
        id: z.string(),
        "entity": z.object({
            "name": z.string(),
            "url": z.string().url(),
            "image": z.object({
                "path": z.string(),
                "alt": z.string()
            })
        }),
        "location": z.string(),
        "interval": z.string(),
        "positions": z.array(z.object({
            "title": z.string(),
            "description": z.string(),
            "highlight": z.string(),
            "interval": z.string()
        })),
        "tags": z.array(z.string())
    })
});

export const education = defineCollection({
    loader: file("src/content/education.json"),
    schema: z.object({
        id: z.string(),
        title: z.string(),
        interval: z.string(),
        entity: z.object({
            name: z.string(),
            image: z.object({
                path: z.string(),
                alt: z.string()
            }),
            url: z.string().url()
        }),
        location: z.string(),
        description: z.string(),
        tags: z.array(z.string()),
        certificate: z.string().optional()
    })
});

export const socials = defineCollection({
    loader: file("src/content/socials.json"),
    schema: z.object({
        id: z.string(),
        url: z.string().url(),
        username: z.string(),
        platform: z.string()
    })
});

export const projects = defineCollection({
    loader: file("src/content/projects.json"),
    schema: z.object({
        id: z.string(),
        name: z.string(),
        summary: z.string(),
        description: z.string(),
        // TODO unified, bg_color, url, and add an alt propert y in a new object
        url: z.string().url(),
        logo: z.string(),
        bg_color: z.string(),
        year: z.number(),
        tags: z.array(z.string()),
        visible: z.boolean()
    })
});

const blog = defineCollection({
    loader: glob({ pattern: '**/[^_]*.md', base: "src/content/blog" }),
    schema: z.object({
        title: z.string(),
        pubDate: z.date(),
        description: z.string(),
        author: z.string(),
        image: z.object({
            url: z.string(),
            alt: z.string()
        }),
        tags: z.array(z.string()),
        draft: z.boolean()
    })
});

export const collections = { blog, education, experience, socials, projects };
