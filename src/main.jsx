import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './app'
import { AuthProvider } from './context/auth-context'
import { SettingsProvider } from './context/settings-context'
import { ToastProvider } from './context/toast-context'
import './styles/index.css'

const basePath = import.meta.env.BASE_URL
const basename = basePath.endsWith('/') ? basePath.slice(0, -1) || '/' : basePath

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <ToastProvider>
        <AuthProvider>
          <SettingsProvider>
            <App />
          </SettingsProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
)
