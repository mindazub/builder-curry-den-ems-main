import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8084,
    proxy: {
      // Proxy API calls to the external plants server (more specific, should come first)
      '/api/plants': {
        target: 'http://185.69.53.225:5001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/plants/, ''),
        headers: {
          'Authorization': 'Bearer f9c2f80e1c0e5b6a3f7f40e6f2e9c9d0af7eaabc6b37a4d9728e26452b81fc13'
        }
      },
      // Proxy API calls to our Express server (less specific, should come second)
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));
