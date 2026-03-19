import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './i18n';
import './styles/global.css';

// Set initial direction based on default language (Hebrew = RTL)
document.documentElement.dir = 'rtl';
document.documentElement.lang = 'he';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
