import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig({
  plugins: [react()],
  server: {
    cors: true,
    host: '0.0.0.0',
    port: 3001,
    proxy: {
      '/wsock': {
        target: 'ws://10.10.115.40:8080',
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/wsock/, '/wsock')
      },
    }
  },
  // SPA routing uchun fallback
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  build: {
    outDir: 'dist'
  }
});
