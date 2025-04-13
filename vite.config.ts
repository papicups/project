import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    base: '/project/',
    define: {
      'process.env.EMAIL_USER': JSON.stringify(env.EMAIL_USER),
      'process.env.EMAIL_PASS': JSON.stringify(env.EMAIL_PASS)
    },
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
      }
    },
    assetsInclude: ['**/*.mp3', '**/*.jpg', '**/*.json', '**/*.typeface.json'],
    publicDir: 'public'
  }
});
