import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { ResidentProvider } from './contexts/ResidentContext';

// On enveloppe l'application entière dans ResidentProvider
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ResidentProvider>
      <App />
    </ResidentProvider>
  </StrictMode>
);
