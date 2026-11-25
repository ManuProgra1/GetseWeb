import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// En GitHub Pages el sitio vive en un subdirectorio (/Getsemani-iglesia-/).
const base = process.env.VITE_BASE_PATH || '/'

/**
 * GitHub Pages no conoce las rutas del SPA: copiamos index.html como 404.html
 * para que cualquier ruta profunda cargue la aplicación.
 */
function spaFallback() {
  return {
    name: 'spa-404-fallback',
    apply: 'build',
    closeBundle() {
      const index = path.resolve(process.cwd(), 'dist/index.html')
      const notFound = path.resolve(process.cwd(), 'dist/404.html')
      if (fs.existsSync(index)) fs.copyFileSync(index, notFound)
    },
  }
}

export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), spaFallback()],
  server: {
    port: 5173,
    host: '127.0.0.1',
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
  },
})
