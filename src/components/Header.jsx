import React from 'react';
import { APP_CONFIG } from '../constants/appConfig';

const Header = () => {
  return (
    <header className="w-full bg-indigo-700 py-3 px-6 md:px-12 shadow-sm z-[60]">
      <div className="max-w-7xl mx-auto flex justify-start items-center">
        <a 
          href={APP_CONFIG.youtubeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white text-lg font-bold tracking-tight hover:opacity-90 transition-opacity"
        >
          {APP_CONFIG.headerTitle}
        </a>
      </div>
    </header>
  );
};

export default Header;
