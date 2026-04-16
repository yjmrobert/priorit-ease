import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Served at https://yjmrobert.com/priorit-ease/ via GitHub Pages.
// The base path must match the sub-path so that built asset URLs resolve.
export default defineConfig({
  base: '/priorit-ease/',
  plugins: [react()],
});
