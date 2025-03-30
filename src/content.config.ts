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
    loader: glob({ pattern: '**/*.json', base: "./src/content/experience" }),
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
    loader: glob({ pattern: '**/*.json', base: "./src/content/education" }),
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

export const collections = { blog, education, experience };
