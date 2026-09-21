import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { studioServer } from './scripts/studio-server.js'

export default defineConfig({
  plugins: [react(), tailwindcss(), studioServer()],
  // The voice generator's Python venv (.venv, ~20k files) lives in the project; keep Vite out of it.
  optimizeDeps: { entries: ['index.html'] },
  server: { watch: { ignored: ['**/.venv/**', '**/scripts/**'] } },
})
