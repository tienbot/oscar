import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'          // ← добавь этот импорт

export default defineConfig({
  plugins: [react()],
  base: "/oscar",
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),    // ← главный алиас на src
    }
  }
})