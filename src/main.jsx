import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { checkRequiredEnvVars } from './utils/envCheck.js'

const missingEnv = checkRequiredEnvVars()
if (missingEnv.length > 0) {
  console.warn('Missing env vars:', missingEnv)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// У dev Service Worker ламає Vite (перехоплює /@vite/client, /src/*.jsx).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
