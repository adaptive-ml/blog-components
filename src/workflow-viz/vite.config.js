import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  build: {
    lib: {
      entry: './main.js',
      name: 'WorkflowViz',
      fileName: () => 'workflow-viz.js',
      formats: ['iife']
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    },
    cssCodeSplit: false,
    outDir: '../../components',
    emptyOutDir: false,
    assetsInlineLimit: 100000
  }
});
