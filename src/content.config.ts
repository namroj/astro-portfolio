import { glob } from "astro/loaders";
import { z, defineCollection } from "astro:content";

const blog = defineCollection({
    loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/blog" }),
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

export const experience = defineCollection({
    loader: glob({ pattern: '**/experience.json', base: "./src/content" }),
    schema: z.array(z.object({
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
    }))
});

export const education = defineCollection({
    loader: glob({ pattern: '**/education.json', base: "./src/content" }),
    schema: z.array(z.object({
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
    }))
});

export const socials = defineCollection({
    loader: glob({ pattern: '**/socials.json', base: "./src/content" }),
    schema: z.array(z.object({
        url: z.string().url(),
        username: z.string(),
        platform: z.string()
    }))
});

export const collections = { blog, education, experience, socials };
