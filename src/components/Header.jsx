import React from 'react';
import { APP_CONFIG } from '../constants/appConfig';

const Header = () => {
  return (
    <header className="w-full py-2.5 px-5 md:px-10 relative z-40">
      <div className="max-w-7xl mx-auto flex justify-start items-center gap-2.5">
        {/* Brand Mark — small colored dot as visual anchor */}
        <div className="w-2 h-2 rounded-full bg-sky-500 shrink-0"></div>
        <a 
          href={APP_CONFIG.youtubeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-800 text-base md:text-lg font-semibold tracking-tight hover:text-sky-600 transition-colors"
        >
          {APP_CONFIG.headerTitle}
        </a>
      </div>
    </header>
  );
};

export default Header;
