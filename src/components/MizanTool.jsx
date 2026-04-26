import React, { useState } from 'react';
import { Scale, Volume2, Search, Loader2, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { APP_CONFIG } from '../constants/appConfig';

const MizanTool = () => {
  const [word, setWord] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  const handleAnalyze = async () => {
    const trimmed = word.trim();
    if (!trimmed) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/mizan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'حدث خطأ أثناء التحليل');
        return;
      }

      setResult(data);
      // Add to history (avoid duplicates)
      setHistory(prev => {
        const filtered = prev.filter(h => h.word !== data.word);
        return [data, ...filtered].slice(0, 10);
      });
    } catch (err) {
      setError('تعذر الاتصال بالخادم. تأكد من اتصالك بالإنترنت.');
    } finally {
      setLoading(false);
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex flex-col" dir="rtl">
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mb-4">
            <Scale className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-2">الميزان الصرفي</h1>
          <p className="text-lg text-slate-500">اكتب أي كلمة عربية واحصل على تحليلها الصرفي فوراً</p>
        </div>

        {/* Search Box */}
        <div className="relative mb-12">
          <div className="flex items-center bg-white rounded-[2rem] shadow-xl shadow-indigo-100/50 border-2 border-slate-100 p-2 transition-all focus-within:border-indigo-400 focus-within:ring-8 focus-within:ring-indigo-50">
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="اكتب كلمة مثل: استغفر، مدرسة..."
              className="flex-1 text-xl md:text-2xl font-bold text-slate-800 bg-transparent px-4 md:px-6 py-3 md:py-4 focus:outline-none placeholder:text-slate-300 placeholder:font-medium"
              dir="rtl"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !word.trim()}
              className={`h-14 w-14 md:w-auto md:px-10 rounded-[1.5rem] font-bold text-lg text-white transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0 ${
                loading || !word.trim()
                  ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-200'
              }`}
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Search className="w-6 h-6" />
              )}
              <span className="hidden md:inline">حلّل الآن</span>
            </button>
          </div>
          {error && (
            <div className="absolute -bottom-10 left-0 right-0 flex justify-center">
              <p className="text-rose-600 font-bold text-sm bg-rose-50 px-4 py-1.5 rounded-full border border-rose-100 shadow-sm animate-in fade-in slide-in-from-top-2">
                {error}
              </p>
            </div>
          )}
        </div>

        {/* Result */}
        {result && (
          <div className="bg-white rounded-[2rem] shadow-lg border border-slate-100 overflow-hidden mb-6 smooth-expand">
            {/* Word + Pattern Header */}
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 px-6 md:px-8 py-6 border-b border-indigo-100">
              <div className="flex items-center justify-center gap-4 mb-3">
                <span className="text-4xl md:text-5xl font-black text-slate-800">{result.word}</span>
                <button
                  onClick={() => handleSpeak(result.word)}
                  className="p-2.5 rounded-full bg-white/60 hover:bg-white text-indigo-500 hover:text-indigo-700 transition-all active:scale-90 shadow-sm"
                >
                  <Volume2 className="w-6 h-6" />
                </button>
              </div>
              <div className="flex items-center justify-center gap-6 text-base md:text-lg">
                <span className="text-slate-500">الوزن: <strong className="text-indigo-700 text-xl">{result.pattern}</strong></span>
                <span className="text-slate-500">الجذر: <strong className="text-indigo-700 text-xl">{result.root}</strong></span>
              </div>
              {result.type && (
                <div className="text-center mt-3">
                  <span className="inline-block bg-indigo-100 text-indigo-700 font-bold text-sm px-4 py-1.5 rounded-full">
                    {result.type}
                  </span>
                </div>
              )}
            </div>

            {/* Letter Breakdown */}
            {result.letterBreakdown && result.letterBreakdown.length > 0 && (() => {
              const count = result.letterBreakdown.length;
              const bx = count > 6 
                ? 'w-10 h-10 text-lg md:w-12 md:h-12 md:text-xl' 
                : 'w-12 h-12 text-xl md:w-14 md:h-14 md:text-2xl';
              return (
              <div className="px-4 md:px-8 py-5 md:py-6 border-b border-slate-100">
                <h3 className="text-center text-xs md:text-sm font-bold text-slate-400 mb-4 md:mb-5 uppercase tracking-widest">تحليل الميزان</h3>
                <div className="flex justify-center gap-1 md:gap-2.5">
                  {result.letterBreakdown.map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5 md:gap-2">
                      {/* Word letter */}
                      <div className={`${bx} rounded-lg md:rounded-xl flex items-center justify-center font-black border-2 ${
                        item.isRoot
                          ? 'bg-indigo-500 border-indigo-600 text-white shadow-md'
                          : 'bg-slate-100 border-slate-200 text-slate-500'
                      }`}>
                        {item.wordLetter}
                      </div>
                      {/* Connector */}
                      <div className={`w-0.5 h-3 md:h-5 ${item.isRoot ? 'bg-indigo-300' : 'bg-slate-200'}`} />
                      {/* Pattern letter */}
                      <div className={`${bx} rounded-lg md:rounded-xl flex items-center justify-center font-bold border-2 ${
                        item.isRoot
                          ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}>
                        {item.patternLetter}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-4 md:gap-6 mt-4 md:mt-5 text-xs md:text-sm font-medium">
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

            {/* Morphological Notes */}
            {result.morphNotes && !['لا يوجد', 'لا توجد', 'لا شيء', 'فارغ', 'none', 'n/a'].includes(result.morphNotes.trim().toLowerCase()) && !result.morphNotes.includes('لا يوجد تغيير') && (
              <div className="px-6 md:px-8 py-4 bg-amber-50/50 border-b border-amber-100">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-amber-800 text-base md:text-lg leading-relaxed font-medium">{result.morphNotes}</p>
                </div>
              </div>
            )}

            {/* Explanation */}
            {result.explanation && (
              <div className="px-6 md:px-8 py-5">
                <div className="flex items-start gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
                  <p className="text-slate-600 text-base md:text-lg leading-relaxed">{result.explanation}</p>
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
                  className="px-4 py-2 bg-white border-2 border-slate-100 rounded-xl font-bold text-slate-600 hover:border-indigo-300 hover:text-indigo-700 transition-all active:scale-95 shadow-sm text-base"
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
              {['استغفر', 'كاتِب', 'مَكتوب', 'انطلق', 'تَعاوَن', 'مُستشفى', 'اجتهد', 'مِفتاح'].map((example) => (
                <button
                  key={example}
                  onClick={() => { setWord(example); }}
                  className="px-4 py-2 bg-white border-2 border-dashed border-slate-200 rounded-xl font-bold text-slate-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all active:scale-95 text-base"
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
        <a href={APP_CONFIG.youtubeLink} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors text-sm font-medium">
          {APP_CONFIG.copyright}
        </a>
      </footer>
    </div>
  );
};

export default MizanTool;
