// Catch and ignore WebSocket / HMR disconnection errors in preview iframe environments
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = String(reason?.message || reason || '');
    const stack = String(reason?.stack || '');
    if (
      msg.includes('WebSocket') ||
      msg.includes('createWebSocketModuleRunnerTransport') ||
      stack.includes('@vite/client') ||
      stack.includes('createWebSocketModuleRunnerTransport')
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });
  window.addEventListener('error', (event) => {
    const filename = String(event.filename || '');
    const msg = String(event.message || '');
    if (
      filename.includes('@vite/client') ||
      msg.includes('WebSocket') ||
      msg.includes('createWebSocketModuleRunnerTransport')
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });
}

import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
