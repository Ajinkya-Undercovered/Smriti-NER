import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';

function pwaInjectPlugin() {
  return {
    name: 'pwa-inject-sw-assets',
    closeBundle() {
      const distDir = path.resolve('dist');
      const assetsDir = path.join(distDir, 'assets');
      const swPath = path.join(distDir, 'sw.js');

      if (!fs.existsSync(swPath) || !fs.existsSync(assetsDir)) return;

      const assetFiles = fs.readdirSync(assetsDir).map(file => `/assets/${file}`);
      
      let swContent = fs.readFileSync(swPath, 'utf8');
      
      const allAssets = [
        '/',
        '/index.html',
        '/manifest.json',
        '/favicon.svg',
        '/icons.svg',
        '/icon-192.png',
        '/icon-512.png',
        ...assetFiles
      ];
      
      const replacement = `const CORE_SHELL_ASSETS = ${JSON.stringify(allAssets, null, 2)};`;
      swContent = swContent.replace(/const CORE_SHELL_ASSETS = \[[\s\S]*?\];/, replacement);
      
      fs.writeFileSync(swPath, swContent, 'utf8');
      console.log('🌿 PWA Build Hook: Injected ' + assetFiles.length + ' bundle files directly into Service Worker cache!');
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    pwaInjectPlugin(),
  ],
  build: {
    chunkSizeWarningLimit: 2000,
  },
  server: {
    watch: {
      ignored: ['**/* - Copy', '**/* - Copy/**'],
    },
  },
});
