import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves the project site under /EthiCross/, so assets need
  // that prefix there — but Vercel (and local preview) serve from the domain
  // root. GITHUB_ACTIONS is only set inside the Pages workflow.
  base: process.env.GITHUB_ACTIONS ? '/EthiCross/' : '/',
  plugins: [react(), tailwindcss()],
})
