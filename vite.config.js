import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      // single JS entry that imports all modules
      input: resolve(__dirname, 'src/entry-all.js'),
      output: {
        // emit single file named dest.js in the dist root
        entryFileNames: 'r.all.js',
        // use IIFE so it can run immediately in browser and attach globals if needed
        format: 'iife',
        name: 'MicroMVCBundle'
      }
    }
  }
});
