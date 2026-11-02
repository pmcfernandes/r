import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // emit single JS file named r.all.js in the dist root
        entryFileNames: 'r.all.js',
        // use IIFE so it can run immediately in browser and attach globals if needed
        format: 'iife',
        name: 'MicroMVCBundle'
      }
    }
  }
});
