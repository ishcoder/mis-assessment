import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages friendly config:
// - base: './' makes assets resolve correctly regardless of repo name.
export default defineConfig({
  base: './',
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.')
    }
  }
});
