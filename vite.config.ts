import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// GitHub Pages deploys to /repo-name/ subdirectory
const base = process.env.BASE_URL || '/';

export default defineConfig({
  base,
  publicDir: 'assets',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      includeAssets: [
        'img/ui/splash.png',
        'img/ui/ear.png',
        'img/ui/star-correct.png',
        'img/ui/pwa-192.png',
        'img/ui/pwa-512.png'
      ],
      manifest: {
        name: 'Lucy Phonics',
        short_name: 'Phonics',
        description: 'Phoneme sound matching practice for early learners.',
        theme_color: '#0d9488',
        background_color: '#d1fae5',
        display: 'standalone',
        orientation: 'portrait',
        start_url: base,
        scope: base,
        icons: [
          {
            src: 'img/ui/pwa-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'img/ui/pwa-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,gif,mp3,wav,ogg,m4a,aif,json}'],
        maximumFileSizeToCacheInBytes: 15 * 1024 * 1024
      }
    })
  ]
});
