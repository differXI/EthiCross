import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Repository name, so built asset URLs work under
  // https://<user>.github.io/EthiCross/ (GitHub Pages project site).
  base: '/EthiCross/',
  plugins: [react(), tailwindcss()],
})
