import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ShieldErrorBoundary from './components/common/ShieldErrorBoundary'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ShieldErrorBoundary>
      <App />
    </ShieldErrorBoundary>
  </StrictMode>,
)
