import React, { useState } from 'react';
import { BookOpen, Volume2, Search, Loader2, Scale, Sparkles, ArrowLeftRight, GitBranch, MessageCircle, Info } from 'lucide-react';
import { APP_CONFIG } from '../constants/appConfig';

const LexiconTool = () => {
  const [word, setWord] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('meanings');
  const [mizanResult, setMizanResult] = useState(null);
  const [mizanLoading, setMizanLoading] = useState(false);
  const [mizanError, setMizanError] = useState(false);

  const handleAnalyze = async (searchQuery) => {
    const queryToUse = typeof searchQuery === 'string' ? searchQuery : word;
    const trimmed = queryToUse.trim();
    if (!trimmed) return;

    if (trimmed !== word) {
      setWord(trimmed);
    }

    // 1. Fetch Lexicon (Primary)
    setLoading(true);
    setError('');
    setResult(null);
    setMizanResult(null);
    setMizanError(false);
    setMizanLoading(true);

    try {
      const res = await fetch('/api/lexicon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'حدث خطأ أثناء التحليل');
        setMizanLoading(false);
        return;
      }

      setResult(data);
      setActiveTab('meanings');
      setHistory(prev => {
        const filtered = prev.filter(h => h.word !== data.word);
        return [{ ...data, mizanResult: null }, ...filtered].slice(0, 10);
      });

      // 2. Fetch Mizan Independently (Background)
      fetchMizan(trimmed);

    } catch (err) {
      setError('تعذر الاتصال بالخادم. تأكد من اتصالك بالإنترنت.');
      setMizanLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchMizan = async (query) => {
    setMizanLoading(true);
    setMizanError(false);
    try {
      const res = await fetch('/api/mizan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: query }),
      });
      if (res.ok) {
        const data = await res.json();
        setMizanResult(data);
      } else {
        setMizanError(true);
      }
    } catch (e) {
      setMizanError(true);
    } finally {
      setMizanLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAnalyze();
  };

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleHistoryClick = (item) => {
    setWord(item.word);
    setResult(item);
    setMizanResult(item.mizanResult || null);
    setActiveTab('meanings');
  };

  const tabs = [
    { id: 'meanings', label: 'المعاني', icon: BookOpen },
    { id: 'derivatives', label: 'المشتقات', icon: GitBranch },
    { id: 'synonyms', label: 'مترادفات', icon: ArrowLeftRight },
    { id: 'mizan', label: 'الميزان', icon: Scale },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex flex-col" dir="rtl">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400..700&display=swap');
          .font-naskh {
            font-family: 'Noto Naskh Arabic', serif;
            font-size: 1.25em;
            font-weight: 700;
            line-height: 1.8;
          }
        `}
      </style>
      {/* Header */}
      <header className="text-center pt-8 pb-4 px-4">
        <a 
          href="/"
          className="inline-flex items-center gap-2 text-2xl md:text-3xl font-bold text-purple-900 hover:text-purple-700 transition-colors mb-1"
        >
          {APP_CONFIG.headerTitle}
        </a>
        <p className="text-sm text-slate-400 font-medium">{APP_CONFIG.headerSubtitle}</p>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 pb-12">
        {/* Title Card */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4">
            <BookOpen className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-2">المعجم الذكي</h1>
          <p className="text-lg text-slate-500">اكتب أي كلمة عربية واكتشف معانيها ومشتقاتها فورًا</p>
        </div>

        {/* Search Box */}
        <div className="relative mb-12">
          <div className="flex items-center bg-white rounded-[2rem] shadow-xl shadow-emerald-100/50 border-2 border-slate-100 p-2 transition-all focus-within:border-emerald-400 focus-within:ring-8 focus-within:ring-emerald-50">
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="اكتب كلمة مثل: حرية، أدب، علم..."
              className="flex-1 text-xl md:text-2xl font-bold text-slate-800 bg-transparent px-4 md:px-6 py-3 md:py-4 focus:outline-none placeholder:text-slate-300 placeholder:font-medium"
              dir="rtl"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !word.trim()}
              className={`h-14 w-14 md:w-auto md:px-10 rounded-[1.5rem] font-bold text-lg text-white transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0 ${
                loading || !word.trim()
                  ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-200'
              }`}
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Search className="w-6 h-6" />
              )}
              <span className="hidden md:inline">ابحث</span>
            </button>
          </div>
          {error && (
            <div className="absolute -bottom-10 left-0 right-0 flex justify-center">
              <p className="text-rose-600 font-bold text-sm bg-rose-50 px-4 py-1.5 rounded-full border border-rose-100 shadow-sm">
                {error}
              </p>
            </div>
          )}
        </div>

        {/* Result */}
        {result && (
          <div className="bg-white rounded-[2rem] shadow-lg border border-slate-100 overflow-hidden mb-6 smooth-expand">
            {/* Word Header */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 px-6 md:px-8 py-6 border-b border-emerald-100">
              <div className="flex items-center justify-center gap-4 mb-3">
                <span className="text-4xl md:text-5xl font-black text-slate-800">{result.word}</span>
                <button
                  onClick={() => handleSpeak(result.word)}
                  className="p-2.5 rounded-full bg-white/60 hover:bg-white text-emerald-500 hover:text-emerald-700 transition-all active:scale-90 shadow-sm"
                >
                  <Volume2 className="w-6 h-6" />
                </button>
              </div>
              <div className="flex items-center justify-center gap-4 md:gap-6 text-sm md:text-base flex-wrap">
                {result.root && (
                  <span className="text-slate-500">الجذر: <strong className="text-emerald-700 text-lg">{result.root}</strong></span>
                )}
                {result.pattern && (
                  <span className="text-slate-500">الوزن: <strong className="text-emerald-700 text-lg">{result.pattern}</strong></span>
                )}
              </div>
              <div className="flex items-center justify-center gap-2 mt-3">
                {result.type && (
                  <span className="inline-block bg-emerald-100 text-emerald-700 font-bold text-sm px-4 py-1.5 rounded-full">
                    {result.type}
                  </span>
                )}
                {/* Link to Mizan tab instead of new page */}
                <button
                  onClick={() => setActiveTab('mizan')}
                  className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 font-bold text-sm px-4 py-1.5 rounded-full hover:bg-indigo-100 transition-colors"
                >
                  <Scale className="w-3.5 h-3.5" />
                  تحليل الميزان
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100 overflow-x-auto scrollbar-hide">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-0 flex items-center justify-center gap-1 md:gap-2 px-1 md:px-6 py-3.5 md:py-4 font-bold text-xs md:text-base transition-all border-b-3 ${
                      activeTab === tab.id
                        ? 'text-emerald-700 border-emerald-500 bg-emerald-50/50'
                        : 'text-slate-400 border-transparent hover:text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 md:w-5 md:h-5 shrink-0" />
                    <span className="whitespace-nowrap">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="px-5 md:px-8 py-6">
              {/* Meanings Tab */}
              {activeTab === 'meanings' && (
                <div className="space-y-5">
                  {(result.meanings || []).map((item, idx) => (
                    <div key={idx} className="group">
                      <div className="flex gap-3 items-start">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 font-black text-sm flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-lg md:text-xl font-bold text-slate-800 leading-relaxed mb-2">
                            {item.meaning}
                          </p>
                          {item.example && (
                            <div className="flex items-start gap-2 bg-slate-50 rounded-xl p-3 md:p-4 border border-slate-100">
                              <MessageCircle className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                              <div className="flex-1">
                                <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium font-naskh">
                                  {item.example}
                                </p>
                                <button
                                  onClick={() => handleSpeak(item.example)}
                                  className="mt-2 text-emerald-400 hover:text-emerald-600 transition-colors"
                                >
                                  <Volume2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      {idx < (result.meanings || []).length - 1 && (
                        <div className="border-b border-slate-100 mt-5" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Derivatives Tab */}
              {activeTab === 'derivatives' && (
                <div className="space-y-3">
                  {(result.derivatives || []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-emerald-200 transition-colors">
                      <div className="text-center shrink-0">
                        <button
                          onClick={() => handleAnalyze(item.word)}
                          className="text-2xl md:text-3xl font-black text-slate-800 hover:text-emerald-600 transition-colors text-right md:text-center block"
                        >
                          {item.word}
                        </button>
                        <button
                          onClick={() => handleSpeak(item.word)}
                          className="block mx-auto mt-1 text-emerald-400 hover:text-emerald-600 transition-colors"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="w-px h-10 bg-slate-200 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="inline-block bg-emerald-100 text-emerald-700 font-bold text-xs px-2.5 py-1 rounded-full mb-1">
                          {item.type}
                        </span>
                        <p className="text-base text-slate-600 font-medium leading-relaxed">{item.meaning}</p>
                      </div>
                    </div>
                  ))}
                  {(!result.derivatives || result.derivatives.length === 0) && (
                    <p className="text-center text-slate-400 py-8">لا توجد مشتقات متاحة</p>
                  )}
                </div>
              )}

              {/* Synonyms & Antonyms Tab */}
              {activeTab === 'synonyms' && (
                <div className="space-y-6">
                  {/* Synonyms */}
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
                      <Sparkles className="w-4 h-4" />
                      المرادفات
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(result.synonyms || []).map((syn, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAnalyze(syn)}
                          className="px-4 py-2.5 bg-emerald-50 border-2 border-emerald-100 rounded-xl font-bold text-emerald-700 text-lg hover:bg-emerald-100 hover:border-emerald-200 transition-all active:scale-95"
                        >
                          {syn}
                        </button>
                      ))}
                      {(!result.synonyms || result.synonyms.length === 0) && (
                        <p className="text-slate-400">لا توجد مرادفات متاحة</p>
                      )}
                    </div>
                  </div>

                  {/* Antonyms */}
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
                      <ArrowLeftRight className="w-4 h-4" />
                      الأضداد
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(result.antonyms || []).map((ant, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAnalyze(ant)}
                          className="px-4 py-2.5 bg-rose-50 border-2 border-rose-100 rounded-xl font-bold text-rose-700 text-lg hover:bg-rose-100 hover:border-rose-200 transition-all active:scale-95"
                        >
                          {ant}
                        </button>
                      ))}
                      {(!result.antonyms || result.antonyms.length === 0) && (
                        <p className="text-slate-400">لا توجد أضداد متاحة</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Mizan Tab */}
              {activeTab === 'mizan' && (
                <div className="space-y-6">
                  {mizanLoading ? (
                    <div className="text-center py-12">
                      <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mx-auto mb-4" />
                      <p className="text-slate-400 font-medium">جاري التحليل الصرفي...</p>
                    </div>
                  ) : mizanResult && mizanResult.letterBreakdown && mizanResult.letterBreakdown.length > 0 ? (
                    <div>
                      {(() => {
                        const count = mizanResult.letterBreakdown.length;
                        const bx = count > 6 
                          ? 'w-10 h-10 text-lg md:w-12 md:h-12 md:text-xl' 
                          : 'w-12 h-12 text-xl md:w-14 md:h-14 md:text-2xl';
                        return (
                          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                            <h4 className="text-center text-xs md:text-sm font-bold text-slate-400 mb-6 uppercase tracking-widest">تفكيك الأحرف</h4>
                            <div className="flex justify-center gap-1 md:gap-2.5">
                              {mizanResult.letterBreakdown.map((item, i) => (
                                <div key={i} className="flex flex-col items-center gap-1.5 md:gap-2">
                                  <div className={`${bx} rounded-lg md:rounded-xl flex items-center justify-center font-black border-2 ${
                                    item.isRoot
                                      ? 'bg-indigo-500 border-indigo-600 text-white shadow-md'
                                      : 'bg-white border-slate-200 text-slate-500'
                                  }`}>
                                    {item.wordLetter}
                                  </div>
                                  <div className={`w-0.5 h-3 md:h-5 ${item.isRoot ? 'bg-indigo-300' : 'bg-slate-200'}`} />
                                  <div className={`${bx} rounded-lg md:rounded-xl flex items-center justify-center font-bold border-2 ${
                                    item.isRoot
                                      ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                                      : 'bg-slate-100 border-slate-200 text-slate-400'
                                  }`}>
                                    {item.patternLetter}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-center gap-4 md:gap-6 mt-6 text-xs md:text-sm font-medium">
                              <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded bg-indigo-500" />
                                <span className="text-slate-500">حروف أصلية (جذر)</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded bg-slate-200" />
                                <span className="text-slate-500">حروف زائدة</span>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {mizanResult.morphNotes && !['لا يوجد', 'لا توجد', 'لا شيء', 'فارغ', 'none', 'n/a'].includes(mizanResult.morphNotes.trim().toLowerCase()) && !mizanResult.morphNotes.includes('لا يوجد تغيير') && (
                        <div className="mt-6 flex items-start gap-2 bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                          <Sparkles className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                          <p className="text-amber-800 text-base leading-relaxed font-medium">{mizanResult.morphNotes}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Scale className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                      <p className="text-slate-400 font-medium">التحليل الصرفي غير متوفر حاليًا لهذه الكلمة</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Usage Notes */}
            {result.usage_notes && !['لا يوجد', 'لا توجد', 'لا شيء', 'فارغ', 'none', 'n/a'].includes(result.usage_notes.trim().toLowerCase()) && (
              <div className="px-5 md:px-8 py-4 bg-amber-50/50 border-t border-amber-100">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-amber-800 text-base md:text-lg leading-relaxed font-medium">{result.usage_notes}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-widest">الكلمات السابقة</h3>
            <div className="flex flex-wrap gap-2">
              {history.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleHistoryClick(item)}
                  className="px-4 py-2 bg-white border-2 border-slate-100 rounded-xl font-bold text-slate-600 hover:border-emerald-300 hover:text-emerald-700 transition-all active:scale-95 shadow-sm text-base"
                >
                  {item.word}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Examples (when no result) */}
        {!result && !loading && (
          <div className="text-center mt-6">
            <p className="text-sm text-slate-400 mb-3">جرّب مثلاً:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['حرية', 'أدب', 'علم', 'قلب', 'نور', 'حياة', 'صبر', 'عدل'].map((example) => (
                <button
                  key={example}
                  onClick={() => handleAnalyze(example)}
                  className="px-4 py-2 bg-white border-2 border-dashed border-slate-200 rounded-xl font-bold text-slate-500 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50 transition-all active:scale-95 text-base"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-100 text-center">
        <a href={APP_CONFIG.youtubeLink} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-600 transition-colors text-sm font-medium">
          {APP_CONFIG.copyright}
        </a>
      </footer>
    </div>
  );
};

export default LexiconTool;
