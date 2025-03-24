// @ts-check
import { defineConfig } from 'astro/config';

import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  site: 'https://namroj-astro-portfolio.netlify.app/', // TODO change to https://jorman.dev
  integrations: [preact()],
});