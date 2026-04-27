import React, { useState, useEffect } from 'react';

import { HintBox } from '../ui/HintBox';
import { FeedbackBox } from '../ui/FeedbackBox';
import { toArabicNum, shuffleArray, renderFormattedText } from '../../utils';
import { Inbox } from 'lucide-react';
import { SATURATED_BY_THEME, AUTO_PALETTE } from '../../constants/colorPalette';

const Classify = ({ sectionData, progress, onUpdateProgress }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState('idle'); // idle, correct, incorrect
  const [placedItems, setPlacedItems] = useState({});
  const [animatingOut, setAnimatingOut] = useState(false);
  const [maxContentHeight, setMaxContentHeight] = useState('auto');

  const isComplete = progress.total > 0 && progress.answered === progress.total;

  const categoriesWithTheme = sectionData.categories.map((cat, idx) => {
    let t = cat.theme || AUTO_PALETTE[idx % AUTO_PALETTE.length];
    if (t === 'amber') t = 'orange';
    return { ...cat, theme: t };
  });


  useEffect(() => {
    setQuestions(shuffleArray(sectionData.questions).map(q => ({
      originalQuestion: q,
      showHint: false
    })));
    
    let initialPlaced = {};
    categoriesWithTheme.forEach(c => initialPlaced[c.id] = []);
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
        tempDiv.innerText = q.text;
        const h = tempDiv.offsetHeight;
        if (h > maxH) maxH = h;
      });

      document.body.removeChild(tempDiv);
      setMaxContentHeight(`${Math.max(maxH, 180)}px`);
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
      const isLast = currentIndex === questions.length - 1;
      if (!isLast) setAnimatingOut(true);
      
      const theme = categoriesWithTheme.find(c => c.id === catId).theme;
      
      setTimeout(() => {
        setPlacedItems(prev => ({
          ...prev,
          [catId]: [...prev[catId], { text: currentQState.originalQuestion.text, theme }]
        }));
        
        setStatus('idle');
        setAnimatingOut(false);
        setCurrentIndex(prev => prev + 1);
        
        onUpdateProgress(sectionData.id, progress.answered + 1, progress.score + 1);
      }, isLast ? 300 : 600);
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

  const currentQState = isComplete ? questions[questions.length - 1] : questions[currentIndex];

  return (
    <div className="fade-in mb-8 min-h-[500px]">
      {sectionData.description && (
        <div className="text-center w-full mb-6">
          <p className={`text-lg md:text-xl text-slate-700 font-medium bg-${sectionData.theme}-50/40 border border-${sectionData.theme}-100 p-4 md:p-5 rounded-2xl shadow-sm inline-block leading-relaxed`}>
            {sectionData.description}
          </p>
        </div>
      )}

      <div className="flex flex-col items-center w-full gap-6">
        <div className="relative w-full min-h-[12rem] transition-all duration-500 flex flex-col items-center justify-center p-4 md:p-6">
          <div className={`classify-card-container w-full max-w-2xl bg-white p-5 md:p-8 rounded-2xl shadow-lg border-2 border-slate-200 transition-all transform leading-snug flex flex-col justify-start z-10 ${animatingOut ? 'fly-out' : (!isComplete ? 'fade-in' : '')} ${status === 'incorrect' ? 'shake' : ''}`}>
            <div className="grid w-full relative">
              {/* Layer 1: Question Content */}
              <div className={`col-start-1 row-start-1 w-full flex flex-col transition-opacity duration-500 ${isComplete || !currentQState ? 'opacity-0 pointer-events-none z-0' : 'opacity-100 z-10'}`}>
                <div className="flex items-center justify-between mb-4">
                    <span className={`text-${sectionData.theme}-600 font-bold text-lg md:text-xl`}>البطاقة {toArabicNum(isComplete ? questions.length : currentIndex + 1)}</span>
                    <button onClick={toggleHint} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-lg md:text-xl font-bold transition-all active:scale-95 text-orange-500 hover:bg-orange-50">
                      💡 تلميح
                    </button>
                </div>

                <div className="w-full flex flex-col transition-all duration-300">
                    <div style={{ minHeight: maxContentHeight }} className="w-full flex items-center justify-center mb-2">
                      <h3 
                        className="text-2xl md:text-3xl font-semibold leading-relaxed text-slate-800 text-center"
                        dangerouslySetInnerHTML={{ __html: renderFormattedText(currentQState?.originalQuestion.text || '', sectionData.theme) }}
                      />
                    </div>
                   
                    {currentQState?.showHint && (
                      <div className="mt-4 smooth-expand w-full">
                        <HintBox hintText={currentQState.originalQuestion.hint} />
                      </div>
                    )}
                </div>
                {status === 'incorrect' && currentQState && (
                  <div className="mt-5 smooth-expand w-full text-right">
                    <FeedbackBox isCorrect={false} explanation={currentQState.originalQuestion.explanation || 'حاول مرة أخرى'} />
                  </div>
                )}
              </div>

              {/* Layer 2: Success Message */}
              <div className={`col-start-1 row-start-1 w-full flex flex-col items-center justify-center gap-4 transition-opacity duration-500 ${!isComplete ? 'opacity-0 pointer-events-none z-0' : 'opacity-100 z-10'}`}>
                <div className="text-2xl md:text-3xl font-bold text-slate-400 mb-2">النتيجة النهائية</div>
                <div className={`text-5xl md:text-6xl font-black text-${sectionData.theme || 'emerald'}-500`}>
                  {toArabicNum(progress.score)} / {toArabicNum(progress.total)}
                </div>
                <div className="text-xl md:text-2xl text-slate-400 font-bold mt-2 italic">تم إتمام التصنيف</div>
              </div>
            </div>
          </div>
        </div>

        <div className={`flex flex-row w-full max-w-2xl mx-auto gap-2 md:gap-4 mt-2 relative z-0 flex-wrap justify-center ${isComplete ? 'opacity-40 grayscale-[50%]' : ''}`}>
          {categoriesWithTheme.map((cat, idx) => {
            const colorClass = SATURATED_BY_THEME[cat.theme] || `bg-${cat.theme}-500 border-${cat.theme}-600`;
            const hoverClass = (status !== 'correct' && !animatingOut && !isComplete) 
              ? `md:hover:brightness-110 md:hover:-translate-y-1 cursor-pointer shadow-md md:hover:shadow-lg active:scale-95`
              : `cursor-default pointer-events-none`;
            const maxLabelLen = Math.max(...categoriesWithTheme.map(c => c.label.length));
            const fontSize = maxLabelLen <= 10 ? 'text-base md:text-2xl' : maxLabelLen <= 20 ? 'text-base md:text-xl' : 'text-base md:text-lg';
              
            return (
              <button key={idx} disabled={status === 'correct' || animatingOut || isComplete} onClick={() => handleCategoryClick(cat.id)} className={`flex-1 flex flex-col items-center justify-center p-3 md:p-5 border-2 md:border-4 rounded-xl md:rounded-2xl transition-all duration-300 ${colorClass} text-white min-w-[120px] ${hoverClass}`}>
                <span className={`font-bold ${fontSize} text-center leading-snug`}>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-12 bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-sm p-6 md:p-8 flex flex-col md:flex-row gap-6 relative z-0">
        {categoriesWithTheme.map(cat => (
          <div key={cat.id} className={`flex-1 bg-${cat.theme}-50/40 border-2 border-${cat.theme}-200/50 rounded-[2rem] p-6 md:p-8 flex flex-col items-center min-h-[300px] shadow-sm relative overflow-hidden backdrop-blur-sm max-h-[350px] overflow-y-auto no-scrollbar`}>
            
            <div className={`absolute top-0 left-0 w-full h-2 bg-${cat.theme}-400 opacity-60 z-10`}></div>
            
            <div className={`absolute -bottom-10 -left-10 w-40 h-40 text-${cat.theme}-200 opacity-10 transform -rotate-12 scale-150 pointer-events-none z-0 flex items-center justify-center`}>
                <Inbox className="w-full h-full" />
            </div>

            <div className="flex flex-col items-center justify-center w-full relative z-10 mb-2 gap-3">
                <div className="bg-white shadow-sm rounded-full p-2.5 border border-slate-100 flex items-center justify-center shrink-0">
                    <Inbox className={`w-6 h-6 md:w-7 md:h-7 text-${cat.theme}-600 shrink-0`} />
                </div>
                <h3 className="font-bold text-xl md:text-2xl text-slate-900 text-center">{cat.label}</h3>
            </div>

            <div className="h-px bg-slate-200 w-2/3 mx-auto my-4 relative z-10"></div>
            
            <div className="flex flex-col gap-3 w-full relative z-10 mt-2 pb-4">
              {placedItems[cat.id]?.map((item, i) => (
                 <div 
                    key={i} 
                    className={`bg-white border-2 border-${cat.theme}-200 text-slate-700 text-xl font-normal py-3 px-4 rounded-xl text-center shadow-sm smooth-expand w-full`}
                    dangerouslySetInnerHTML={{ 
                      __html: renderFormattedText(item.text, cat.theme)
                    }}
                  />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Classify;
