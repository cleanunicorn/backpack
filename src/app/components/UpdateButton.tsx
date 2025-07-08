'use client';

import { useState } from 'react';

interface UpdateButtonProps {
  onUpdate: () => void;
}

export default function UpdateButton({ onUpdate }: UpdateButtonProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await onUpdate();
    } finally {
      // Reset after a short delay to show the updating state
      setTimeout(() => setIsUpdating(false), 1000);
    }
  };

  return (
    <button
      onClick={handleUpdate}
      disabled={isUpdating}
      className="fixed top-4 right-4 z-40 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white p-2 rounded-full shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      title={isUpdating ? 'Checking for updates...' : 'Check for updates'}
    >
      <svg 
        className={`w-5 h-5 ${isUpdating ? 'animate-spin' : ''}`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
        />
      </svg>
    </button>
  );
}