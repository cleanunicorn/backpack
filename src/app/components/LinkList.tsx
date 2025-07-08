'use client';

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { db, Link } from '../lib/db';

export interface LinkListRef {
  refreshLinks: () => void;
}

const LinkList = forwardRef<LinkListRef>((_, ref) => {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      await db.init();
      const savedLinks = await db.getAllLinks();
      // Sort by timestamp, newest first
      setLinks(savedLinks.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error) {
      console.error('Error loading links:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    refreshLinks: loadLinks
  }));

  const handleDelete = async (id: number) => {
    try {
      await db.deleteLink(id);
      setLinks(links.filter(link => link.id !== id));
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto mt-8">
        <h3 className="text-lg font-semibold text-center mb-4 text-gray-900 dark:text-white">
          Your Links
        </h3>
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto mt-8">
        <h3 className="text-lg font-semibold text-center mb-4 text-gray-900 dark:text-white">
          Your Links
        </h3>
        <div className="text-center text-gray-500">No links saved yet</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <h3 className="text-lg font-semibold text-center mb-4 text-gray-900 dark:text-white">
        Your Links
      </h3>
      <div className="space-y-3">
        {links.map((link) => (
          <div
            key={link.id}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                  {link.title}
                </h4>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm break-all"
                >
                  {link.url}
                </a>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {formatDate(link.timestamp)}
                </p>
              </div>
              <button
                onClick={() => link.id && handleDelete(link.id)}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 ml-2"
                title="Delete link"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

LinkList.displayName = 'LinkList';

export default LinkList;