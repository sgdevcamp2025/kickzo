// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ToastProvider } from './components/common/Toast/index.tsx';
import './sentry.ts';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <ToastProvider>
    <App />,
  </ToastProvider>,
  // </StrictMode>,
);
