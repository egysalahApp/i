import React from 'react';
import { Menu } from 'lucide-react';
import { APP_CONFIG } from '../constants/appConfig';

const Header = () => {
  return (
    <header className="w-full bg-slate-100 py-3 px-6 md:px-12 border-b border-slate-200 relative z-40">
      <div className="max-w-7xl mx-auto flex justify-start items-center gap-3">
        <button 
          className="text-slate-500 hover:text-purple-900 transition-colors p-1 -mr-1"
          title="القائمة"
        >
          <Menu size={24} />
        </button>
        <a 
          href={APP_CONFIG.youtubeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-900 text-lg font-bold tracking-tight hover:text-purple-700 transition-colors"
        >
          {APP_CONFIG.headerTitle}
        </a>
      </div>
    </header>
  );
};

export default Header;
