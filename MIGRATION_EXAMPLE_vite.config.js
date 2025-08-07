// vite.config.js for Laravel + React
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    laravel({
      input: [
        'resources/css/app.css',
        'resources/js/app.tsx', // React entry point
      ],
      refresh: true,
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './resources/js'),
      '@/components': path.resolve(__dirname, './resources/js/components'),
      '@/pages': path.resolve(__dirname, './resources/js/pages'),
      '@/hooks': path.resolve(__dirname, './resources/js/hooks'),
      '@/lib': path.resolve(__dirname, './resources/js/lib'),
    },
  },
  define: {
    global: 'globalThis',
  },
});
