import React from 'react';
import { BookOpen, Volume2, VolumeX, Music } from 'lucide-react';
import { useSound } from '../contexts/SoundContext';
import { APP_CONFIG } from '../constants/appConfig';

const Header = () => {
  const { isMuted, toggleMute, isBGMEnabled, toggleBGM } = useSound();

  return (
    <header className="w-full bg-transparent py-3 px-4 md:px-8 relative z-40">
      <div className="max-w-7xl mx-auto flex justify-center items-center">
        {/* Brand Section */}
        <a 
          href={APP_CONFIG.youtubeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 group w-max mx-auto"
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
        
        {/* Sound Controls */}
        <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 flex items-center gap-1 md:gap-2">
          <button 
            onClick={toggleBGM}
            className={`p-2 rounded-full transition-colors ${isBGMEnabled ? 'text-indigo-500 bg-indigo-50' : 'text-slate-400 md:hover:text-slate-600 md:hover:bg-slate-100'}`}
            title={isBGMEnabled ? "إيقاف موسيقى الخلفية" : "تشغيل موسيقى الخلفية"}
          >
            <Music className="w-5 h-5 md:w-6 md:h-6" />
            {!isBGMEnabled && <span className="absolute inset-0 flex items-center justify-center pointer-events-none"><span className="w-[110%] h-[2px] bg-slate-400 rotate-45 rounded-full"></span></span>}
          </button>
          <button 
            onClick={toggleMute}
            className="p-2 rounded-full text-slate-400 md:hover:text-slate-600 md:hover:bg-slate-100 transition-colors"
            title={isMuted ? "تفعيل المؤثرات" : "كتم المؤثرات"}
          >
            {isMuted ? <VolumeX className="w-5 h-5 md:w-6 md:h-6" /> : <Volume2 className="w-5 h-5 md:w-6 md:h-6" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
