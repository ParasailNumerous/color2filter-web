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
  },

  security: {
    csp: {
      algorithm: 'SHA-256',
      directives: [
        "default-src 'none'",
        "img-src 'self'"
      ]
    },
    scriptDirective: {
      resources: [
        "'self'", "wasm-unsafe-eval"
      ],
      strictDynamic: true
    }
  }
});
