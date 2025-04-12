import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/project/', // Set to repository name for GitHub Pages
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    },
    // Ensure static assets are copied to build
    assetsInclude: ['**/*.mp3', '**/*.jpg', '**/*.json']
  },
  // Properly configure public directory
  publicDir: 'public'
});
