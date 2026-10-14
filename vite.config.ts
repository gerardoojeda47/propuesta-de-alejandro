import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  // Nombre exacto del repositorio en GitHub Pages
  base: '/propuesta-de-alejandro/',
  plugins: [react(), tailwindcss()],
})
