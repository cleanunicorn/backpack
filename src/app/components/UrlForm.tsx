'use client';

import { useState, useEffect } from 'react';
import { db } from '../lib/db';

interface UrlFormProps {
  onLinkSaved?: () => void;
}

export default function UrlForm({ onLinkSaved }: UrlFormProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    db.init().catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Check if URL already exists
      const exists = await db.linkExists(url);
      if (exists) {
        setMessage({ type: 'error', text: 'This link already exists in your collection' });
        setIsLoading(false);
        return;
      }

      const linkTitle = title.trim() || new URL(url).hostname;

      await db.saveLink({
        title: linkTitle,
        url: url,
        timestamp: Date.now(),
        synced: false,
        visited: false
      });

      setMessage({ type: 'success', text: 'Link saved successfully!' });
      setUrl('');
      setTitle('');
      
      // Call the callback to refresh the link list
      onLinkSaved?.();
    } catch (error) {
      console.error('Error saving link:', error);
      setMessage({ type: 'error', text: 'Error saving link. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {message && (
        <div className={`mb-4 p-3 rounded-md ${
          message.type === 'success'
            ? 'bg-green-100 border border-green-400 text-green-700'
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title (optional)
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Link title"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Enter URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}