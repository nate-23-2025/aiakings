import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Keep the first paint small. Everything a visitor does not need to
        // read the headline and find the button loads in its own chunk.
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('gsap')) return 'gsap';
          if (id.includes('react-markdown') || id.includes('remark') || id.includes('micromark') || id.includes('mdast') || id.includes('hast') || id.includes('unist')) return 'markdown';
          if (id.includes('@supabase')) return 'supabase';
          if (id.includes('three') || id.includes('@react-three') || id.includes('postprocessing')) return 'three';
        },
      },
    },
  },
})
