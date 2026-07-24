import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://shuyang.li',
  vite: {
    build: {
      // lightningcss (the default) truncates numeric precision (breaking
      // sub-pixel image sizing) and rewrites media queries to range syntax
      // that pre-2023 browsers don't support
      cssMinify: 'esbuild',
    },
  },
});
