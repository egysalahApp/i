import React from 'react';
import { APP_CONFIG } from '../constants/appConfig';

const Header = () => {
  return (
    <header className="w-full bg-slate-100 py-3 px-6 md:px-12 border-b border-slate-200 z-[60]">
      <div className="max-w-7xl mx-auto flex justify-start items-center">
        <a 
          href={APP_CONFIG.youtubeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-700 text-lg font-bold tracking-tight hover:text-indigo-600 transition-colors"
        >
          {APP_CONFIG.headerTitle}
        </a>
      </div>
    </header>
  );
};

export default Header;
