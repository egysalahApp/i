import React, { useState, useEffect } from 'react';
import { ResultBox } from '../ui/ResultBox';
import { HintBox } from '../ui/HintBox';
import { FeedbackBox } from '../ui/FeedbackBox';
import { toArabicNum, shuffleArray } from '../../utils';
import { Inbox } from 'lucide-react';

const Classify = ({ sectionData, progress, onUpdateProgress }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState('idle'); // idle, correct, incorrect
  const [placedItems, setPlacedItems] = useState({});
  const [animatingOut, setAnimatingOut] = useState(false);
  const [maxContentHeight, setMaxContentHeight] = useState('auto');

  const isComplete = progress.total > 0 && progress.answered === progress.total;

  useEffect(() => {
    setQuestions(shuffleArray(sectionData.questions).map(q => ({
      originalQuestion: q,
      showHint: false
    })));
    
    let initialPlaced = {};
    sectionData.categories.forEach(c => initialPlaced[c.id] = []);
    setPlacedItems(initialPlaced);

    // قياس ديناميكي لأكبر نص سؤال لتوحيد الارتفاع الأساسي للبطاقة
    const measureMaxHeight = () => {
      const container = document.querySelector('.classify-card-container');
      if (!container) return;

      const tempDiv = document.createElement('div');
      tempDiv.style.visibility = 'hidden';
      tempDiv.style.position = 'absolute';
      tempDiv.style.top = '-9999px';
      
      // نستخدم العرض الفعلي للحاوية لضمان دقة القياس على مختلف أحجام الشاشات
      const containerWidth = container.offsetWidth;
      const padding = window.innerWidth < 768 ? 40 : 64; // p-5 (20px*2) vs p-8 (32px*2)
      tempDiv.style.width = `${containerWidth - padding}px`;
      
      tempDiv.className = 'text-2xl md:text-3xl leading-[2.2] px-8 text-center font-normal';
      document.body.appendChild(tempDiv);

      let maxH = 0;
      sectionData.questions.forEach(q => {
        tempDiv.innerText = `«${q.text}»`;
        const h = tempDiv.offsetHeight;
        if (h > maxH) maxH = h;
      });

      document.body.removeChild(tempDiv);
      setMaxContentHeight(`${Math.max(maxH, 80)}px`);
    };

    measureMaxHeight();
    window.addEventListener('resize', measureMaxHeight);
    return () => window.removeEventListener('resize', measureMaxHeight);
  }, [sectionData.questions, sectionData.categories]);

  const handleCategoryClick = (catId) => {
    if ((status !== 'idle' && status !== 'incorrect') || isComplete) return;

    const currentQState = questions[currentIndex];
    const isCorrect = currentQState.originalQuestion.categoryId === catId;

    if (isCorrect) {
      setStatus('correct');
      setAnimatingOut(true);
      
      const categoryLabel = sectionData.categories.find(c => c.id === catId).label;
      const theme = sectionData.categories.find(c => c.id === catId).theme;
      
      setTimeout(() => {
        setPlacedItems(prev => ({
          ...prev,
          [catId]: [...prev[catId], { text: currentQState.originalQuestion.text, theme }]
        }));
        
        setStatus('idle');
        setAnimatingOut(false);
        setCurrentIndex(prev => prev + 1);
        
        onUpdateProgress(sectionData.id, progress.answered + 1, progress.score + 1);
      }, 600);
    } else {
      setStatus('incorrect');
    }
  };

  const toggleHint = () => {
    if (isComplete) return;
    const newQuestions = [...questions];
    newQuestions[currentIndex].showHint = !newQuestions[currentIndex].showHint;
    setQuestions(newQuestions);
  };

  return (
    <div className="fade-in mb-8">
      {sectionData.description && (
        <div className="text-center w-full mb-6">
          <p className={`text-lg md:text-xl text-${sectionData.theme}-800 font-semibold bg-${sectionData.theme}-50 bg-opacity-60 p-4 md:p-5 rounded-2xl shadow-sm inline-block`}>
            {sectionData.description}
          </p>
        </div>
      )}

      <div className="flex flex-col items-center w-full gap-6">
        <div className="relative w-full min-h-[12rem] bg-slate-50 rounded-3xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-4 md:p-6 transition-all duration-500">
          {!isComplete && questions[currentIndex] ? (
            <div className={`classify-card-container w-full max-w-2xl bg-white p-5 md:p-8 rounded-2xl shadow-lg border-2 border-slate-200 transition-all transform leading-snug flex flex-col justify-start z-10 ${animatingOut ? 'opacity-0 translate-y-4' : 'fade-in'} ${status === 'incorrect' ? 'shake' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                  <span className={`text-${sectionData.theme}-600 font-bold text-lg md:text-xl`}>البطاقة {toArabicNum(currentIndex + 1)}</span>
                  <button onClick={toggleHint} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-lg md:text-xl font-bold transition-all active:scale-95 text-amber-500 hover:bg-amber-50">
                    💡 تلميح
                  </button>
              </div>
              <span className="block mb-4 text-slate-500 text-sm md:text-base font-normal text-center">انقر على الصندوق المناسب لتصنيف هذه الجملة</span>
              <div className="w-full flex flex-col transition-all duration-300">
                  {/* حاوية نص السؤال: تحتفظ بارتفاع ثابت بناءً على أطول نص */}
                  <div style={{ minHeight: maxContentHeight }} className="w-full flex items-center justify-center mb-2">
                    <h3 className="text-2xl md:text-3xl font-normal leading-[2.2] text-slate-800 text-center">
                      «{questions[currentIndex].originalQuestion.text}»
                    </h3>
                  </div>
                 
                  {/* التلميح: يظهر أسفل النص ويتمدد الصندوق معه ديناميكياً */}
                  {questions[currentIndex].showHint && (
                    <div className="mt-4 smooth-expand w-full">
                      <HintBox hintText={questions[currentIndex].originalQuestion.hint} />
                    </div>
                  )}
              </div>
              {status === 'incorrect' && (
                <div className="mt-5 smooth-expand w-full text-right">
                  <FeedbackBox isCorrect={false} explanation={questions[currentIndex].originalQuestion.explanation || 'حاول مرة أخرى'} />
                </div>
              )}
            </div>
          ) : (
            <div className="text-3xl md:text-4xl font-bold text-emerald-500 flex flex-col items-center gap-4 fade-in py-6">
              <span className="text-6xl">🎉</span>
              <span>اكتمل التصنيف!</span>
            </div>
          )}
        </div>

        {!isComplete && (
          <div className="flex flex-row w-full max-w-2xl mx-auto gap-2 md:gap-4 mt-2 relative z-0 flex-wrap justify-center">
            {sectionData.categories.map((cat, idx) => {
              const btnClass = (status !== 'correct' && !animatingOut) 
                ? `md:hover:border-${cat.theme}-400 md:hover:bg-${cat.theme}-100 md:hover:-translate-y-1 cursor-pointer shadow-sm md:hover:shadow-md active:scale-95`
                : `cursor-default pointer-events-none`;
                
              return (
                <button key={idx} disabled={status === 'correct' || animatingOut} onClick={() => handleCategoryClick(cat.id)} className={`flex-1 flex flex-col items-center justify-center p-3 md:p-5 border-2 md:border-4 rounded-xl md:rounded-2xl transition-all duration-300 border-${cat.theme}-200 text-${cat.theme}-700 bg-${cat.theme}-50 min-w-[120px] ${btnClass}`}>
                  <span className="font-bold text-lg md:text-xl text-center leading-snug">{cat.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-12 bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-sm p-6 md:p-8 flex flex-col md:flex-row gap-6 relative z-0">
        {sectionData.categories.map(cat => (
          <div key={cat.id} className={`flex-1 bg-${cat.theme}-50/40 border-2 border-${cat.theme}-200/50 rounded-[2rem] p-6 md:p-8 flex flex-col items-center min-h-[300px] shadow-sm relative overflow-hidden backdrop-blur-sm max-h-[350px] overflow-y-auto no-scrollbar`}>
            
            <div className={`absolute top-0 left-0 w-full h-2 bg-${cat.theme}-400 opacity-60 z-10`}></div>
            
            <div className={`absolute -bottom-10 -left-10 w-40 h-40 text-${cat.theme}-200 opacity-10 transform -rotate-12 scale-150 pointer-events-none z-0 flex items-center justify-center`}>
                <Inbox className="w-full h-full" />
            </div>

            <div className="flex flex-col items-center justify-center w-full relative z-10 mb-1">
                <div className="flex items-center justify-center gap-3">
                    <div className="bg-white shadow-sm rounded-full p-2 border border-slate-100 flex items-center justify-center shrink-0">
                        <Inbox className={`w-6 h-6 md:w-8 md:h-8 text-${cat.theme}-600 shrink-0`} />
                    </div>
                    <h3 className="font-bold text-2xl md:text-3xl text-slate-900 text-center">{cat.label}</h3>
                </div>
            </div>

            <div className="h-px bg-slate-200 w-2/3 mx-auto my-4 relative z-10"></div>
            
            <div className="flex flex-col gap-3 w-full relative z-10 mt-2 pb-4">
              {placedItems[cat.id]?.map((item, i) => (
                 <div key={i} className={`bg-white border-2 border-${cat.theme}-200 text-slate-700 text-xl font-normal py-3 px-4 rounded-xl text-center shadow-sm smooth-expand w-full`}>
                    {item.text}
                 </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isComplete && (
        <ResultBox title={sectionData.title} theme={sectionData.theme} score={progress.score} total={progress.total} />
      )}
    </div>
  );
};

export default Classify;
