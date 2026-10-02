// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: "https://parasailnumerous.github.io",
  base: "/color2filter-web",
  integrations: [svelte()],

  vite: {
    plugins: [tailwindcss()]
  }
});