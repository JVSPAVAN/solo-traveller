import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), {
    name: 'not-found-document',
    // Reuse the built shell so Netlify can return the same design with HTTP 404.
    writeBundle(options) { copyFileSync(resolve(options.dir, 'index.html'), resolve(options.dir, '404.html')); }
  }],
  server: {
    proxy: {
      '/n8n': {
        target: 'https://exilecoder.app.n8n.cloud',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/n8n/, ''),
      },
    },
  },
})
