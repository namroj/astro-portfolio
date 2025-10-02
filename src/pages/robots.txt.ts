import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const baseUrl = site?.toString() || 'https://namroj-astro-portfolio.netlify.app';
  const content = `User-agent: *
Allow: /

Sitemap: ${baseUrl}sitemap.xml
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
