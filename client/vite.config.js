import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react       from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path        from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    splitVendorChunkPlugin(), // auto-split vendor chunk
  ],

  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },

  server: {
    port: 5173,
    proxy: {
      '/api': {
        target:       'http://localhost:5000',
        changeOrigin: true,
        secure:       false,
      },
    },
  },

  build: {
    // Target modern browsers (drops IE11 polyfills)
    target: 'es2020',

    // Inline assets smaller than 4 kB
    assetsInlineLimit: 4096,

    // Slightly larger warning threshold for a dashboard app
    chunkSizeWarningLimit: 650,

    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // React core
          'react-vendor':  ['react', 'react-dom', 'react-router-dom'],
          // Animation
          'motion':        ['framer-motion'],
          // Charts
          'recharts':      ['recharts'],
          // Icons
          'lucide':        ['lucide-react'],
        },
      },
    },

    // Source maps only in development
    sourcemap: process.env.NODE_ENV !== 'production',
  },

  // Optimise dependencies that use CJS
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'recharts', 'lucide-react'],
  },

  // Expose env prefix
  envPrefix: 'VITE_',
});
