// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: "https://parasailnumerous.github.io",
  base: "/colour2filter-web",
  integrations: [svelte()],

  vite: {
    plugins: [tailwindcss()]
  },

  /* CSP 
  Disabled because Astro's implementation
  is missing a bunch of features.
  :[ */
  /*security: {
    csp: {
      algorithm: 'SHA-256',
      directives: [
        "default-src 'none'",
        "connect-src 'self'",
        "img-src 'self'"
      ]
    },
    scriptDirective: {
      resources: [
        /* Astro doesn't seem to actually support wasm-unsafe-eval... 
        "'self'", "wasm-unsafe-eval", "unsafe-eval"
      ],
      strictDynamic: true
    }
  }*/
});
