// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://iga-vegetable.jp',
  trailingSlash: 'always',
  integrations: [sitemap()],
  build: { format: 'directory' },
});
