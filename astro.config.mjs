// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

// Shim for Cloudflare Workers environment (prevents 'process is not defined' errors)
if (typeof globalThis.process === 'undefined') {
  globalThis.process = {
    stdout: {
      write(message) {
        console.log(message);
      },
    },
    stderr: {
      write(message) {
        console.error(message);
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare()
});