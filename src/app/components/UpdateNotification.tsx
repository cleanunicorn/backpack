'use client';

import { useState, useEffect } from 'react';

interface UpdateNotificationProps {
  show: boolean;
  onHide: () => void;
}

export default function UpdateNotification({ show, onHide }: UpdateNotificationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onHide();
      }, 3000); // Hide after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [show, onHide]);

  if (!show) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
      <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span>App updated successfully!</span>
      </div>
    </div>
  );
}