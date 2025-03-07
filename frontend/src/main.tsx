import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/assets/css/style.css'
import '../src/assets/css/bootstrap.min.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
