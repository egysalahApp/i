import React, { useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { APP_CONFIG } from '../constants/appConfig';
import Header from './Header';

const HomePage = () => {
  useEffect(() => {
    document.title = `${APP_CONFIG.headerTitle} — المنصة التعليمية`;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex flex-col" dir="rtl">
      <Header />


      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="text-center bg-white p-10 rounded-3xl shadow-sm border-2 border-slate-100 max-w-lg w-full">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-indigo-500" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">أهلاً بك يا بطل! 👋</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            للدخول إلى الدرس الخاص بك، يرجى استخدام الرابط المباشر الذي شاركه معك معلمك.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-100 text-center">
        <a href={APP_CONFIG.youtubeLink} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors text-sm font-medium">
          {APP_CONFIG.copyright}
        </a>
      </footer>
    </div>
  );
};

export default HomePage;
