import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mime from 'mime';

// Ensure MIME types are compatible
mime.define({
  'application/javascript': ['js'],
  'text/css': ['css'],
  'application/json': ['json'],
  'image/jpeg': ['jpg', 'jpeg'],
  'audio/mpeg': ['mp3']
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
