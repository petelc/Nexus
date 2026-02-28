import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    basicSsl(), // Enables HTTPS with self-signed certificate
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@features': path.resolve(__dirname, './src/features'),
      '@api': path.resolve(__dirname, './src/api'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
      '@theme': path.resolve(__dirname, './src/theme'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@app': path.resolve(__dirname, './src/app'),
      '@routes': path.resolve(__dirname, './src/routes'),
    },
  },
  server: {
    https: true, // Enable HTTPS
    port: 3000,
    host: true, // Listen on all addresses
    proxy: {
      '/api': {
        target: 'https://localhost:57679',
        changeOrigin: true,
        secure: false, // Allow self-signed certificates
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
      '/hubs': {
        target: 'https://localhost:57679',
        changeOrigin: true,
        secure: false, // Allow self-signed certificates
        ws: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'redux-vendor': ['react-redux', '@reduxjs/toolkit'],
          'mui-vendor': ['@mui/material', '@mui/icons-material'],
          'editor-vendor': ['@monaco-editor/react', 'lexical'],
          'diagram-vendor': ['reactflow'],
        },
      },
    },
  },
});
