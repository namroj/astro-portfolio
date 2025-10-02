import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog');
  const items = posts
    .filter((p) => !p.data.draft)
    .map((p) => ({
      id: p.id,
      url: `/blog/${p.id}`,
      title: p.data.title,
      description: p.data.description,
      tags: p.data.tags,
      date: p.data.pubDate,
    }));

  return new Response(JSON.stringify(items), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
};
