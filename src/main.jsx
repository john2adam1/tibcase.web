import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './i18n.jsx'
import { BrandProvider } from './brand.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '439240484061-ujut1a9arhm8q83d3dsga7ruhfrjpcmf.apps.googleusercontent.com';

try {
  const tg = window.Telegram?.WebApp;
  tg?.ready?.();
  tg?.expand?.();
} catch { /* not running inside Telegram */ }

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LanguageProvider>
        <BrandProvider>
          <App />
        </BrandProvider>
      </LanguageProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
