import rss from '@astrojs/rss';

export async function GET(context) {
    const posts = await import.meta.glob('../blog/**/*.md', { eager: true });

    const items = Object.values(posts).map((post) => ({
        title: post.frontmatter.title,
        description: post.frontmatter.description,
        pubDate: post.frontmatter.pubDate,
        link: `/blog/${post.file.split('/').pop().split('.').shift()}`,
    }));

    return rss({
        title: '[Blog] Jorman Espinoza',
        description: 'Personal blog of Jorman Espinoza, Software Engineer',
        site: context.site,
        items: items,
        customData: `<language>en-us</language>`,
    });
}