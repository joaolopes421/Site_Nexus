import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { AppErrorBoundary } from './presentation/components/AppErrorBoundary'
import './presentation/styles/index.css'

let root = document.getElementById('root')
if (!root) {
  root = document.createElement('div')
  root.id = 'root'
  document.body.append(root)
  console.error('O ponto #root não estava no HTML e foi criado automaticamente.')
}

createRoot(root).render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </StrictMode>,
)
