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
      includeAssets: ['img/ui/splash.png', 'img/ui/ear.png', 'img/ui/star-correct.png'],
      manifest: {
        name: 'Lucy Phonics',
        short_name: 'Lucy Phonics',
        description: 'Phoneme sound matching practice for early learners.',
        theme_color: '#0f766e',
        background_color: '#ecfeff',
        display: 'standalone',
        start_url: base,
        scope: base,
        icons: [
          {
            src: 'img/ui/splash.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,png,svg,jpg,jpeg,mp3,json}']
      }
    })
  ]
});
