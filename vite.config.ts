import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Served at https://yjmrobert.com/priorit-ease/ via GitHub Pages.
// The base path must match the sub-path so that built asset URLs resolve.
export default defineConfig({
  base: '/priorit-ease/',
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: {
        enabled: true,
        type: 'module',
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,svg,png,webmanifest,ico}'],
      },
      manifest: {
        name: 'priorit-ease',
        short_name: 'priorit-ease',
        description: 'Eisenhower-matrix to-do list that works offline.',
        start_url: '/priorit-ease/',
        scope: '/priorit-ease/',
        display: 'standalone',
        orientation: 'any',
        background_color: '#0f172a',
        theme_color: '#0f172a',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
});
