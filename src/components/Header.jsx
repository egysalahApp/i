import React from 'react';
import { BookOpen } from 'lucide-react';
import { APP_CONFIG } from '../constants/appConfig';

const Header = () => {
  return (
    <header className="w-full bg-white border-b border-slate-100 py-3 px-4 md:px-8 relative z-40">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand Section */}
        <a 
          href={APP_CONFIG.youtubeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 group"
        >
          {/* Logo Mark */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-50 to-indigo-100 flex items-center justify-center group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-0.5 border border-indigo-50">
            <BookOpen className="w-5 h-5 text-indigo-600" />
          </div>
          
          {/* Typographic Logo */}
          <div className="flex flex-col">
            <span className="text-slate-800 text-lg md:text-xl font-bold tracking-tight group-hover:text-indigo-600 transition-colors leading-tight">
              {APP_CONFIG.headerTitle}
            </span>
            <span className="text-slate-400 text-[10px] md:text-xs font-medium">
              المنصة التعليمية التفاعلية
            </span>
          </div>
        </a>
      </div>
    </header>
  );
};

export default Header;
