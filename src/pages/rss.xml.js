import rss, { pagesGlobToRssItems } from '@astrojs/rss';

export async function GET(context) {
    return rss({
        title: '[Blog] Jorman Espinoza | Software Engineer',
        description: 'Personal blog of Jorman Espinoza, Software Engineer',
        site: context.site,
        items: await pagesGlobToRssItems(import.meta.glob('./**/*.md')),
        customData: `<language>en-us</language>`,
    });
}