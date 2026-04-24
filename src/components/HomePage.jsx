import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { APP_CONFIG } from '../constants/appConfig';

const HomePage = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = `${APP_CONFIG.headerTitle} — المنصة التعليمية`;
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    const { data, error } = await supabase
      .from('lessons')
      .select('id, page_title, sections')
      .order('id');

    if (!error && data) {
      setLessons(data);
    }
    setLoading(false);
  };

  // لون فريد لكل بطاقة درس
  const cardThemes = ['indigo', 'emerald', 'amber', 'violet', 'cyan', 'rose', 'sky', 'purple'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30" dir="rtl">
      {/* Header */}
      <header className="text-center pt-12 pb-8 px-4">
        <a 
          href={APP_CONFIG.youtubeLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-3xl md:text-4xl font-bold text-purple-900 hover:text-purple-700 transition-colors mb-2"
        >
          {APP_CONFIG.headerTitle}
        </a>
        <p className="text-lg text-slate-500 font-medium">{APP_CONFIG.headerSubtitle}</p>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 pb-16">
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="w-7 h-7 text-indigo-500" />
          <h2 className="text-2xl font-bold text-slate-800">الدروس المتاحة</h2>
          <span className="text-sm font-medium bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
            {lessons.length}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400 text-lg">جاري تحميل الدروس...</p>
          </div>
        ) : lessons.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 text-xl">لا توجد دروس متاحة حالياً</p>
          </div>
        ) : (
          <div className="grid gap-4 md:gap-6 md:grid-cols-2">
            {lessons.map((lesson, idx) => {
              const theme = cardThemes[idx % cardThemes.length];
              const sectionCount = lesson.sections?.length || 0;

              return (
                <Link
                  key={lesson.id}
                  to={`/${lesson.id}`}
                  className={`group block bg-white rounded-2xl p-6 md:p-8 border-2 border-slate-100 shadow-sm hover:shadow-lg hover:border-${theme}-200 transition-all duration-300 hover:-translate-y-1`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-3 leading-relaxed group-hover:text-slate-900 transition-colors">
                        {lesson.page_title?.split('|')[0]?.trim() || 'بدون عنوان'}
                      </h3>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`text-sm font-medium px-3 py-1 rounded-full bg-${theme}-50 text-${theme}-600`}>
                          {sectionCount} قسم
                        </span>
                      </div>
                    </div>
                    <div className={`shrink-0 w-12 h-12 rounded-xl bg-${theme}-50 flex items-center justify-center group-hover:bg-${theme}-100 transition-colors`}>
                      <ArrowLeft className={`w-6 h-6 text-${theme}-400 group-hover:text-${theme}-600 transition-colors group-hover:-translate-x-1 duration-300`} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-sm font-medium">{APP_CONFIG.copyright}</p>
      </footer>
    </div>
  );
};

export default HomePage;
