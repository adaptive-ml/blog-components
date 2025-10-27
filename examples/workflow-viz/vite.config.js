import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  server: {
    port: 3000,
    fs: {
      // Allow serving files from the parent directories
      allow: ['../..']
    }
  },
  resolve: {
    alias: {
      '/components': resolve(__dirname, '../../components'),
      '/assets': resolve(__dirname, '../../assets')
    }
  }
});
