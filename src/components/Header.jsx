import React from 'react';
import { APP_CONFIG } from '../constants/appConfig';

const Header = () => {
  return (
    <header className="w-full bg-indigo-700 py-3 md:py-4 px-4 shadow-lg z-[60]">
      <div className="max-w-7xl mx-auto flex justify-center items-center">
        <a 
          href={APP_CONFIG.youtubeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white text-xl md:text-2xl font-black tracking-tight hover:scale-105 active:scale-95 transition-transform duration-200"
        >
          {APP_CONFIG.headerTitle}
        </a>
      </div>
    </header>
  );
};

export default Header;
