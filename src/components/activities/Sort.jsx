import React, { useState, useEffect } from 'react';

import { HintBox } from '../ui/HintBox';
import { toArabicNum } from '../../utils';
import { Lightbulb, AlertTriangle, PartyPopper } from 'lucide-react';

const Sort = ({ sectionData, progress, onUpdateProgress }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState('idle'); // 'idle', 'correct', 'incorrect'
  const [showHint, setShowHint] = useState(false);
  const [animatingOut, setAnimatingOut] = useState(false);

  const theme = sectionData.theme;
  const questions = sectionData.questions;
  const isComplete = currentIndex >= questions.length;
  const currentQuestion = isComplete ? questions[questions.length - 1] : questions[currentIndex];
  const [maxContentHeight, setMaxContentHeight] = useState('auto');

  useEffect(() => {
    const measureMaxHeight = () => {
      const container = document.querySelector('.sort-card-container');
      if (!container) return;

      const tempDiv = document.createElement('div');
      tempDiv.style.visibility = 'hidden';
      tempDiv.style.position = 'absolute';
      tempDiv.style.top = '-9999px';
      
      const containerWidth = container.offsetWidth;
      const padding = window.innerWidth < 768 ? 40 : 64; // p-5 vs p-8
      tempDiv.style.width = `${containerWidth - padding}px`;
      
      tempDiv.className = 'text-2xl md:text-3xl font-medium leading-[2.2] text-center';
      document.body.appendChild(tempDiv);

      let maxH = 0;
      sectionData.questions.forEach(q => {
        tempDiv.innerText = `«${q.text}»`;
        const h = tempDiv.offsetHeight;
        if (h > maxH) maxH = h;
      });

      document.body.removeChild(tempDiv);
      setMaxContentHeight(`${Math.max(maxH, 180)}px`);
    };

    measureMaxHeight();
    window.addEventListener('resize', measureMaxHeight);
    return () => window.removeEventListener('resize', measureMaxHeight);
  }, [sectionData.questions]);

  const handleOptionClick = (optIndex) => {
    if (status === 'correct' || animatingOut) return;

    const isCorrect = optIndex === currentQuestion.correct;

    if (isCorrect) {
      const isFirstAttempt = status === 'idle';
      
      setStatus('correct');
      const isLast = currentIndex === questions.length - 1;
      if (!isLast) setAnimatingOut(true);

      const newAnswered = progress.answered + 1;
      const newScore = progress.score + (isFirstAttempt ? 1 : 0);

      setTimeout(() => {
        onUpdateProgress(sectionData.id, newAnswered, newScore);
        setCurrentIndex(prev => prev + 1);
        setStatus('idle');
        setAnimatingOut(false);
        setShowHint(false);
      }, isLast ? 300 : 500);
    } else {
      setStatus('incorrect');
    }
  };

  const shakeClass = status === 'incorrect' ? 'shake' : '';
  const disablePanelClass = (animatingOut || status === 'correct' || isComplete) ? 'pointer-events-none' : '';

  return (
    <div className="max-w-4xl mx-auto pb-6 min-h-[500px]">
      {sectionData.description && (
        <div className="text-center mb-10 fade-in">
          <p className={`text-lg md:text-xl text-${theme}-800 font-semibold bg-${theme}-50 bg-opacity-60 p-4 md:p-5 rounded-2xl shadow-sm inline-block w-full`}>
            {sectionData.description}
          </p>
        </div>
      )}

      <div className="flex flex-col items-center w-full gap-6 fade-in">
        <div className="relative w-full min-h-[15rem] transition-all duration-500 ease-in-out flex flex-col items-center justify-start pt-4 px-4 pb-8 md:px-6">
          
          <div className={`sort-card-container w-full max-w-2xl bg-white p-5 md:p-8 rounded-[2rem] shadow-lg border-2 border-slate-200 leading-snug flex flex-col justify-start z-10 ${animatingOut ? 'fly-out' : (!isComplete ? 'fade-in' : '')} ${shakeClass}`}>
            
            <div className="grid w-full relative">
              {/* Layer 1: Question Content */}
              <div className={`col-start-1 row-start-1 w-full flex flex-col transition-opacity duration-500 ${isComplete ? 'opacity-0 pointer-events-none z-0' : 'opacity-100 z-10'}`}>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-${theme}-600 font-bold text-lg md:text-xl`}>البطاقة {toArabicNum(isComplete ? questions.length : currentIndex + 1)}</span>
                  <button 
                    onClick={() => setShowHint(!showHint)} 
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-lg md:text-xl font-bold transition-all active:scale-95 text-amber-500 md:hover:bg-amber-50"
                  >
                    <Lightbulb className="w-5 h-5" /> تلميح
                  </button>
                </div>
                

                
                <div style={{ minHeight: maxContentHeight }} className="w-full flex items-center justify-center mb-2 transition-all duration-300">
                  <h3 className="text-2xl md:text-3xl font-medium leading-[2.2] text-slate-800 text-center">
                    «{currentQuestion.text}»
                  </h3>
                </div>
                
                {showHint && (
                  <div className="mb-4 smooth-expand">
                    <HintBox hint={currentQuestion.hint} />
                  </div>
                )}
                
                {status === 'incorrect' && (
                  <div className="mb-4 smooth-expand">
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-center text-orange-700 text-lg md:text-xl font-bold shadow-sm flex items-center justify-center gap-2">
                      <AlertTriangle className="w-6 h-6" />
                      {currentQuestion.explanation || currentQuestion.hint || 'إجابة خاطئة، حاول مرة أخرى.'}
                    </div>
                  </div>
                )}
              </div>

              {/* Layer 2: Success Message */}
              <div className={`col-start-1 row-start-1 w-full flex flex-col items-center justify-center gap-2 transition-opacity duration-500 ${!isComplete ? 'opacity-0 pointer-events-none z-0' : 'opacity-100 z-10'}`}>
                <PartyPopper className="w-16 h-16 text-emerald-500" />
                <span className="text-3xl md:text-4xl font-bold text-emerald-500 text-center">اكتمل الفرز بنجاح!</span>
                <div className="text-2xl md:text-3xl text-slate-500 font-bold mt-2 text-center">
                  النتيجة: {toArabicNum(progress.score)} من {toArabicNum(progress.total)}
                </div>
              </div>
            </div>
          </div>
          
          {/* Options (Categories) */}
          <div className="w-full max-w-4xl mt-8">
            <div className={`flex flex-wrap justify-center gap-4 ${disablePanelClass} ${isComplete ? 'opacity-40 grayscale-[50%]' : ''}`}>
              {currentQuestion.options.map((opt, optIdx) => {
                const colors = ['emerald', 'sky', 'amber', 'rose', 'indigo', 'violet', 'orange', 'cyan'];
                const btnColor = colors[optIdx % colors.length];
                
                let btnClass = `flex-1 min-w-[140px] flex items-center justify-center min-h-[4.5rem] px-4 py-3 rounded-2xl font-bold text-lg md:text-xl transition-all duration-300 border-2 text-center leading-relaxed bg-${btnColor}-50 border-${btnColor}-200 text-${btnColor}-800 `;
                
                if (!animatingOut && status !== 'correct' && !isComplete) {
                  btnClass += `shadow-sm md:hover:shadow-md md:hover:-translate-y-1 active:scale-95 cursor-pointer`;
                } else {
                  btnClass += `cursor-default pointer-events-none`;
                }

                return (
                  <button 
                    key={optIdx}
                    onClick={() => handleOptionClick(optIdx)}
                    disabled={animatingOut || status === 'correct' || isComplete}
                    className={btnClass}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sort;
