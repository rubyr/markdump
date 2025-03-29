// @ts-check
import { defineConfig, envField } from 'astro/config';

import preact from '@astrojs/preact';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  integrations: [preact()],
  output: 'server',
  adapter: cloudflare(),
  vite: {
    define: {
      'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL),
      'process.env.SUPABASE_SECRET': JSON.stringify(process.env.SUPABASE_SECRET)
    }
  }
});
