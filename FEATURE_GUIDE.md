# Feature Guide - Portfolio Enhancements

## Quick Start

Your portfolio now includes modern SEO, search functionality, and a refreshed design inspired by Brittany Chiang's aesthetic.

## New Features

### 1. Blog Search

**Location**: Navigation bar and blog page

**How to use**:
- Type in the search box to find blog posts
- Results appear instantly as you type
- Use ↑/↓ arrow keys to navigate results
- Press Enter to open a post
- Press Escape to close search

**What it searches**:
- Post titles
- Post descriptions
- Post tags

### 2. SEO Optimization

**Automatic features**:
- Meta tags on every page
- Open Graph for social sharing
- Twitter Cards
- Canonical URLs
- JSON-LD structured data
- XML sitemap at `/sitemap.xml`
- Robots.txt at `/robots.txt`

**Per-page customization**:
```astro
<Layout 
  title={title} 
  seo={{
    title: "Custom Title",
    description: "Custom description",
    image: { url: "/image.jpg", alt: "Alt text" },
    type: "article"
  }}
/>
```

### 3. Structured Data

**Homepage**: Person schema
- Helps search engines understand you're a person
- Includes job title and social profiles

**Blog posts**: BlogPosting schema
- Rich snippets in search results
- Shows author, date, and description
- Better SEO for articles

### 4. Design Updates

**Color scheme**:
- Teal accent color (#64ffda)
- Navy blue dark theme (#0a192f)
- Improved contrast and readability

**Typography**:
- Larger base font (16px)
- Better line height (1.6)
- Improved heading hierarchy

**Blog cards**:
- Modern hover effects
- Arrow indicators
- Smooth transitions
- Better spacing

## Configuration

### Update Site URL

Edit `astro.config.mjs`:
```js
export default defineConfig({
  site: "https://your-domain.com",
  // ...
});
```

### Customize SEO Defaults

Edit `src/components/SEO.astro`:
```astro
const {
  description = 'Your custom default description',
  siteName = 'Your Name',
  twitter = { card: 'summary_large_image', site: '@yourhandle' },
} = Astro.props;
```

### Update Person Schema

Edit `src/pages/index.astro`:
```astro
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Your Name",
  jobTitle: "Your Job Title",
  url: "https://your-site.com",
  sameAs: [
    "https://github.com/yourusername",
    "https://linkedin.com/in/yourusername",
    // Add more social profiles
  ],
};
```

## File Structure

```
src/
├── components/
│   ├── SEO.astro          # SEO meta tags component
│   └── Search.tsx         # Search UI component
├── pages/
│   ├── search.json.ts     # Search data endpoint
│   ├── sitemap.xml.ts     # Sitemap generator
│   └── robots.txt.ts      # Robots.txt generator
├── layouts/
│   └── Layout.astro       # Main layout with SEO integration
└── styles/
    ├── variables.css      # Updated color palette
    └── global.css         # Enhanced typography
```

## Testing

### Local Development
```bash
pnpm dev
```
Visit: http://localhost:4321

### Production Build
```bash
pnpm build
pnpm preview
```

### Test SEO
1. Build the site: `pnpm build`
2. Check `/dist/sitemap.xml`
3. Check `/dist/robots.txt`
4. Check `/dist/search.json`
5. Inspect page source for meta tags

### Test Search
1. Navigate to `/blog`
2. Type in search box
3. Verify results appear
4. Test keyboard navigation
5. Test on mobile

## Browser DevTools

### Check Structured Data
1. Open DevTools
2. View page source
3. Search for `application/ld+json`
4. Copy JSON and validate at https://search.google.com/test/rich-results

### Check Meta Tags
1. Open DevTools
2. Inspect `<head>` section
3. Verify Open Graph tags
4. Verify Twitter Card tags

## Deployment

After deployment, verify:
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Robots.txt accessible at `/robots.txt`
- [ ] Search works on `/blog`
- [ ] Meta tags render correctly
- [ ] Social sharing shows correct preview

### Submit to Search Engines

**Google Search Console**:
1. Add property
2. Submit sitemap URL
3. Request indexing

**Bing Webmaster Tools**:
1. Add site
2. Submit sitemap
3. Verify ownership

## Troubleshooting

### Search not working
- Check `/search.json` is generated
- Verify Preact integration in `astro.config.mjs`
- Check browser console for errors

### SEO tags missing
- Verify `SEO.astro` is imported in `Layout.astro`
- Check props are passed correctly
- Inspect page source (not DevTools Elements)

### Sitemap not generating
- Run `pnpm build`
- Check `dist/sitemap.xml`
- Verify `site` is set in `astro.config.mjs`

### Styles not applying
- Clear browser cache
- Check CSS variables in DevTools
- Verify theme switcher works

## Performance Tips

1. **Search**: Already optimized with build-time generation
2. **Images**: Use Astro's Image component
3. **Fonts**: Consider font subsetting
4. **CSS**: Already using CSS variables for theming

## Accessibility

All new features follow accessibility best practices:
- Keyboard navigation in search
- ARIA labels where needed
- Semantic HTML
- Color contrast meets WCAG AA
- Focus indicators visible

## Next Steps

Consider adding:
- [ ] Blog post reading time
- [ ] Related posts section
- [ ] Blog categories/series
- [ ] Newsletter signup
- [ ] Comments system
- [ ] Analytics integration
- [ ] Performance monitoring

---

**Questions?** Check `IMPROVEMENTS.md` for technical details.
