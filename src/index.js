import React from "react";
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import AppRouter from "./router";
import { ZirhProvider } from "./context/ZirhContext";
import './styles/app.css'

function RootApp() {
  return (
    <ZirhProvider>
      <AppRouter />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10B981',
              color: '#fff',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#EF4444',
              color: '#fff',
            },
          },
        }}
      />
    </ZirhProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>
);
