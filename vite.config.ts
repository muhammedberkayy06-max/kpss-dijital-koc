import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * GitHub Pages için:
 * - VITE_BASE="/kpss-dijital-koc/" (repo adınızla aynı olmalı)
 * - VITE_APP_NAME vb. gerekmez
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const base = env.VITE_BASE || '/kpss-dijital-koc/';

  return {
    base,
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        manifest: {
          name: 'KPSS Dijital Koç',
          short_name: 'KPSS Koç',
          description: 'Yapay Zeka Destekli KPSS Hazırlık Platformu',
          theme_color: '#ffffff',
          background_color: '#f8fafc',
          display: 'standalone',
          icons: [
            { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: 'icon-512.png', sizes: '512x512', type: 'image/png' }
          ]
        }
      })
    ]
  };
});
