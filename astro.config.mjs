// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://wrx6666.github.io',
  base: '/domyozeradeploydemo',
  compressHTML: false,
  vite: {
    build: {
      minify: false,
    },
  },
});
