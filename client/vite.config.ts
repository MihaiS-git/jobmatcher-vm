import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      filename: "bundle-stats.html", // output file
      template: "treemap",           // "sunburst", "network", or "treemap"
      gzipSize: true,
      brotliSize: true
    }),
  ],
  build: {
    /* sourcemap: true, */
    target: "es2017", // avoid legacy JS if you don't need IE
    
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
