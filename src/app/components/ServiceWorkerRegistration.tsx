'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const registerServiceWorker = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('ServiceWorker registration successful');
          
          // Check for updates on page load
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('New version available, reloading...');
                  window.location.reload();
                }
              });
            }
          });
          
          // Check for updates immediately
          registration.update();
        } catch (error) {
          console.log('ServiceWorker registration failed: ', error);
        }
      };

      // Listen for service worker controlling the page
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

      registerServiceWorker();
    }
  }, []);

  return null;
}