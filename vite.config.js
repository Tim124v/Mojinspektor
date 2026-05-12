import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  server: {
    host: true,
    port: 5173,
    // No proxy needed — dev mode calls Anthropic directly via VITE_ANTHROPIC_API_KEY.
    // The /api/claude-proxy Edge Function is only used on Vercel (production).
  },
  build: {
    outDir: 'dist',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/src/data/autoQuestionTranslations.json')) return 'data-translations-pl'
          if (id.includes('/src/data/questionsFromPDF.js')) return 'data-questions-pdf'
          if (id.includes('/src/data/sharedQuestions.js')) return 'data-questions-shared'
          if (id.includes('/src/data/inspectorQuestions.js')) return 'data-questions-inspector'
          if (id.includes('/src/data/questions.js')) return 'data-questions-core'
          if (id.includes('node_modules/firebase')) return 'firebase-vendor'
          if (id.includes('node_modules/zustand')) return 'zustand-vendor'
          if (id.includes('node_modules')) return 'vendor'
        },
      },
    },
  },
})
