'use client';

import { useEffect, useState } from 'react';
import UpdateNotification from './UpdateNotification';
import UpdateButton from './UpdateButton';

export default function ServiceWorkerRegistration() {
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  const triggerUpdate = async () => {
    if (registration) {
      try {
        console.log('Manually checking for updates...');
        await registration.update();
        
        // Force reload to get latest version
        window.location.reload();
      } catch (error) {
        console.log('Manual update check failed: ', error);
      }
    }
  };

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const registerServiceWorker = async () => {
        try {
          const reg = await navigator.serviceWorker.register('/sw.js');
          setRegistration(reg);
          console.log('ServiceWorker registration successful');
          
          // Check for updates on page load
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
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
          reg.update();
        } catch (error) {
          console.log('ServiceWorker registration failed: ', error);
        }
      };

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'APP_UPDATED') {
          setShowUpdateNotification(true);
        }
      });

      // Listen for service worker controlling the page
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

      registerServiceWorker();
    }
  }, []);

  return (
    <>
      <UpdateNotification 
        show={showUpdateNotification} 
        onHide={() => setShowUpdateNotification(false)} 
      />
      <UpdateButton onUpdate={triggerUpdate} />
    </>
  );
}