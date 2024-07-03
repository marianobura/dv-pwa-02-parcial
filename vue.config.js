// vue.config.js

import { defineConfig } from '@vue/cli-service';

export default defineConfig({
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/javascript',
    },
  },
  pwa: {
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      exclude: [/\.map$/, /_redirects/],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/dummyjson\.com\/products/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 300,
            },
          },
        },
      ],
    },
  },
});
