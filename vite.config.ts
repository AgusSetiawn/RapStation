// 3. Edit vite.config.ts (tambahkan 2 baris ini)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // tambah ini

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Optimasi output build
    target: 'esnext',
    minify: 'esbuild', // Faster minification
    cssMinify: true,
    rollupOptions: {
      output: {
        // Code Splitting - Memisahkan vendor (library) dari code aplikasi
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor';
            }
            if (id.includes('lucide-react')) {
              return 'ui';
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
