import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Global Fetch Interceptor for JWT and 401 handling
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const [resource, config] = args;
  const token = localStorage.getItem('token');
  
  const headers = new Headers((config as any)?.headers || {});
  const url = typeof resource === 'string' ? resource : (resource instanceof Request ? resource.url : '');
  
  if (token && !url.includes('/api/auth/login')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await originalFetch(resource, {
    ...config,
    headers
  });

  if (response.status === 401 && !url.includes('/api/auth/login')) {
    window.dispatchEvent(new CustomEvent('session-expired'));
  }

  return response;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
