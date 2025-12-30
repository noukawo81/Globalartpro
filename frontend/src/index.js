import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App.jsx';
import { AuthProvider } from '@/core/context/AuthContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);