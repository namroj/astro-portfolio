import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site?.toString() || 'https://namroj-astro-portfolio.netlify.app';
  
  const posts = await getCollection('blog');
  const publishedPosts = posts.filter((p) => !p.data.draft);

  const staticPages = [
    '',
    'about',
    'education',
    'experience',
    'projects',
    'blog',
    'contact',
    'blog/tags',
  ];

  const urls = [
    ...staticPages.map((path) => ({
      loc: `${baseUrl}${path}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: path === '' ? 'weekly' : 'monthly',
      priority: path === '' ? '1.0' : '0.8',
    })),
    ...publishedPosts.map((post) => ({
      loc: `${baseUrl}blog/${post.id}`,
      lastmod: post.data.pubDate.toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: '0.7',
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
