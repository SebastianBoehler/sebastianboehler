// src/components/Footer.tsx
"use client";

import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 text-center border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <a
            href="https://www.sunderlabs.com/imprint"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Imprint
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
