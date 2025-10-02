# Design Updates - Brittany Chiang Inspired

## Overview
The portfolio has been redesigned with a split-screen layout inspired by Brittany Chiang's portfolio, featuring a fixed sidebar on desktop and improved visual hierarchy.

## Key Design Changes

### 1. Split-Screen Layout (Desktop)

**Desktop (≥1024px)**:
- **Left Sidebar (45% width, max 600px)**:
  - Fixed position, sticky navigation
  - Contains: Name, tagline, description, main navigation, social links
  - Scrollable if content exceeds viewport height
  
- **Right Content Area (55% width, max 1400px)**:
  - Scrollable main content
  - Generous padding (6rem 4rem)
  - Clean, focused reading experience

**Mobile (<1024px)**:
- Traditional stacked layout
- Top navigation bar
  - Bottom footer
- Sidebar hidden, content takes full width

### 2. Navigation Redesign

**Desktop Sidebar Navigation**:
- Minimal, uppercase labels with letter-spacing
- Animated indicator lines (2rem → 4rem on hover)
- Active state highlighting
- Smooth transitions on all interactions

**Mobile Navigation**:
- Hamburger menu (unchanged)
- Overlay navigation
- Search integrated in header

### 3. Typography & Spacing

**Headings**:
- H1: `clamp(2.5rem, 5vw, 4.5rem)` - Fluid, responsive sizing
- Tighter line-height (1.1) for large headings
- Improved letter-spacing (-0.02em)

**Body Text**:
- Base font size: 16px (up from 14px)
- Line height: 1.6 (up from 1.5)
- Better readability with increased spacing

**Sections**:
- 6rem bottom margin (desktop)
- 4rem bottom margin (mobile)
- Sticky section headers with background

### 4. Color Refinements

**Accent Colors**:
- Primary: `#64ffda` (teal/mint) - Brittany Chiang's signature color
- Secondary: `#8892b0` (slate blue) - Muted text
- Dark background: `#0a192f` (navy blue)

**Usage**:
- Accent color for interactive elements
- Secondary color for descriptive text
- Foreground color for primary content

### 5. Component Styling

**Blog Post Cards**:
- Horizontal layout with arrow indicator
- Hover effects: shift left, color change, arrow animation
- Clean borders with subtle opacity
- Monospace font for dates

**Tags**:
- Rounded pills with accent color background
- 0.75rem font size
- Monospace font family
- Subtle hover effects

**Links**:
- Inline arrow indicators
- Smooth hover transitions
- Arrow slides right on hover

### 6. Section Components

**New Section Utilities** (`sections.css`):
- `.section` - Main section wrapper
- `.section-header` - Sticky headers with numbers
- `.section-number` - Numbered indicators (01, 02, etc.)
- `.section-title` - Uppercase, tracked titles
- `.section-divider` - Horizontal rule
- `.card` - Reusable card component
- `.link-with-arrow` - Links with animated arrows

### 7. Responsive Behavior

**Breakpoints**:
- Mobile: < 1024px
- Desktop: ≥ 1024px
- Large desktop: ≥ 1280px

**Adaptations**:
- Sidebar only visible on desktop
- Mobile shows traditional header/footer
- Content padding adjusts by screen size
- Typography scales fluidly

## File Structure

### New Files
```
src/
├── components/
│   └── Sidebar.astro          # Desktop sidebar with nav
├── styles/
│   └── sections.css           # Section styling utilities
```

### Modified Files
```
src/
├── layouts/
│   └── Layout.astro           # Integrated sidebar, conditional h1
├── pages/
│   ├── index.astro            # Split mobile/desktop headers
│   └── blog.astro             # Updated styling
├── components/
│   ├── Nav.astro              # Hidden on desktop
│   └── BlogPost.astro         # Enhanced card design
├── styles/
│   ├── global.css             # Split-screen layout, typography
│   ├── variables.css          # Updated color palette
│   └── footer.css             # Hidden on desktop
```

## Visual Hierarchy

### Desktop Layout
```
┌─────────────────────────────────────────────┐
│  Sidebar (Fixed)    │  Main Content (Scroll)│
│                     │                        │
│  Name               │  Page Title            │
│  Tagline            │                        │
│  Description        │  Content...            │
│                     │                        │
│  Navigation         │  Sections...           │
│  - About            │                        │
│  - Experience       │                        │
│  - Projects         │                        │
│  - Blog             │                        │
│                     │                        │
│  Social Links       │                        │
└─────────────────────────────────────────────┘
```

### Mobile Layout
```
┌─────────────────────┐
│  Header (Fixed)     │
├─────────────────────┤
│                     │
│  Content (Scroll)   │
│                     │
│  - Mobile Header    │
│  - Sections...      │
│                     │
├─────────────────────┤
│  Footer (Fixed)     │
└─────────────────────┘
```

## Design Principles Applied

1. **Progressive Disclosure**: Sidebar navigation reveals content hierarchy
2. **Spatial Consistency**: Fixed sidebar provides constant orientation
3. **Visual Rhythm**: Consistent spacing and typography scale
4. **Subtle Animations**: Smooth transitions enhance interactivity
5. **Accessibility**: Keyboard navigation, semantic HTML, ARIA labels
6. **Performance**: CSS-only animations, minimal JavaScript

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox
- CSS Custom Properties (variables)
- CSS `clamp()` for fluid typography
- Backdrop filter for glassmorphism effects

## Accessibility Features

- Semantic HTML structure
- Keyboard-navigable sidebar links
- Focus indicators on all interactive elements
- Sufficient color contrast (WCAG AA)
- Responsive text sizing
- Screen reader friendly navigation

## Performance Considerations

- CSS-only layout (no JavaScript for split-screen)
- Minimal DOM manipulation
- Efficient CSS selectors
- Optimized media queries
- Lazy-loaded images (Astro default)

## Future Enhancements

Potential improvements:
- [ ] Smooth scroll to sections when clicking sidebar nav
- [ ] Highlight active section in sidebar based on scroll position
- [ ] Add subtle parallax effects
- [ ] Implement view transitions (Astro 3.0+)
- [ ] Add micro-interactions on hover
- [ ] Create animated page transitions

## Testing Checklist

- [x] Desktop layout (≥1024px)
- [x] Mobile layout (<1024px)
- [x] Sidebar navigation
- [x] Content scrolling
- [x] Responsive typography
- [x] Color theme switching
- [x] Blog post cards
- [x] Search functionality
- [x] Footer visibility
- [x] Build process

---

**Design Status**: ✅ Complete
**Build Status**: ✅ Passing
**Last Updated**: 2025-10-01
