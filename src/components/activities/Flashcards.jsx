import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, XCircle, Trophy } from 'lucide-react';
import { toArabicNum } from '../../utils';

const Flashcards = ({ sectionData, progress, onUpdateProgress }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatingOut, setAnimatingOut] = useState(false);
  const [flipped, setFlipped] = useState(new Array(sectionData.cards.length).fill(false));
  const theme = sectionData.theme;
  const isComplete = currentIndex >= sectionData.cards.length;

  const handleFlip = () => {
    if (isAnimating || animatingOut || isComplete) return;
    if (!flipped[currentIndex]) {
      setIsAnimating(true);
      const newFlipped = [...flipped];
      newFlipped[currentIndex] = true;
      setFlipped(newFlipped);
      onUpdateProgress(sectionData.id, Math.max(progress.answered, currentIndex + 1), progress.score);
      setTimeout(() => setIsAnimating(false), 700);
    }
  };

  const isLast = currentIndex === sectionData.cards.length - 1;

  const handleAnswer = (knewIt) => {
    if (isAnimating || animatingOut || isComplete) return;
    
    const newScore = progress.score + (knewIt ? 1 : 0);
    onUpdateProgress(sectionData.id, Math.max(progress.answered, currentIndex + 1), newScore);
    
    if (currentIndex < sectionData.cards.length) {
      if (!isLast) setAnimatingOut(true);
      
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setAnimatingOut(false);
      }, isLast ? 300 : 400); 
    }
  };

  const card = isComplete ? sectionData.cards[sectionData.cards.length - 1] : sectionData.cards[currentIndex];
  const isFlipped = isComplete ? flipped[sectionData.cards.length - 1] : flipped[currentIndex];

  return (
    <div className="max-w-3xl mx-auto pb-12 fade-in flex flex-col items-center min-h-[500px]">
      {sectionData.description && (
        <div className="text-center mb-8 w-full px-4">
          <p className={`text-lg md:text-xl text-${theme}-800 font-semibold bg-${theme}-50 bg-opacity-60 p-4 rounded-2xl shadow-sm inline-block w-full`}>
            {sectionData.description}
          </p>
        </div>
      )}

      {/* Grid Container for Card and Success Message */}
      <div className="grid w-full max-w-2xl px-4 relative">
        {/* Layer 1: The Card */}
        <div 
          key={Math.min(currentIndex, sectionData.cards.length - 1)}
          className={`col-start-1 row-start-1 w-full transition-all duration-500 perspective-1000 ${animatingOut ? 'fly-out' : (!isComplete ? 'fade-in' : '')} ${isComplete ? 'opacity-0 pointer-events-none z-0' : 'opacity-100 z-10'}`}
        >
        <div 
          onClick={handleFlip}
          className={`relative h-[24rem] md:h-[26rem] w-full max-w-2xl mx-auto transition-transform duration-700 preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''} shadow-xl rounded-[2.5rem]`}
        >
          {/* Front */}
          <div className={`absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 bg-white border-[3px] border-slate-200 rounded-[2.5rem]`}>
            <div className={`w-16 h-16 md:w-24 md:h-24 rounded-full bg-slate-50 flex items-center justify-center mb-4 md:mb-8`}>
              <RefreshCw className={`w-8 h-8 md:w-12 md:h-12 text-slate-400`} />
            </div>
            <h3 className={`text-3xl md:text-5xl font-bold text-slate-700 text-center leading-relaxed px-4`}>
              {card.front}
            </h3>

          </div>

          {/* Back */}
          <div className={`absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-between pt-4 pb-6 px-6 md:p-10 bg-white border-[3px] border-${theme}-400 rounded-[2.5rem] shadow-2xl`} onClick={(e) => e.stopPropagation()}>
            
            <div className="flex-grow flex flex-col items-center justify-start w-full overflow-y-auto no-scrollbar md:mt-0">
              <div className="w-full md:my-auto flex flex-col items-center">
                <h3 className={`text-3xl md:text-4xl font-bold text-${theme}-600 mb-3 md:mb-4 text-center leading-relaxed shrink-0`}>
                  {card.front}
                </h3>
                <div className="w-full">
                  <p className={`text-2xl md:text-3xl text-slate-600 font-bold text-center leading-relaxed`}>
                    {card.back}
                  </p>
                  {card.explanation && (
                    <p className="mt-2 md:mt-3 text-xl md:text-2xl text-slate-500 font-medium text-center leading-relaxed">
                      {card.explanation}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Buttons inside card */}
            <div className="w-full flex gap-3 mt-4 md:mt-8">
              <button 
                onClick={(e) => { e.stopPropagation(); handleAnswer(true); }}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 md:py-4 rounded-2xl font-bold text-lg md:text-xl flex items-center justify-center gap-2 md:gap-3 shadow-lg transition-all active:scale-95"
              >
                <span>عرفتها</span>
                <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              
              <button 
                onClick={(e) => { e.stopPropagation(); handleAnswer(false); }}
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-3 md:py-4 rounded-2xl font-bold text-lg md:text-xl flex items-center justify-center gap-2 md:gap-3 shadow-lg transition-all active:scale-95"
              >
                <span>أخطأت</span>
                <XCircle className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </div>
        </div>
        </div>

        {/* Layer 2: Success Message */}
        <div className={`col-start-1 row-start-1 w-full flex flex-col items-center justify-center gap-8 transition-opacity duration-500 ${!isComplete ? 'opacity-0 pointer-events-none z-0' : 'opacity-100 z-10'}`}>
          <div className={`text-3xl md:text-4xl font-bold text-${theme}-600 flex flex-col items-center justify-center gap-6 py-12 bg-white border-2 border-${theme}-200 w-full rounded-[2.5rem] shadow-xl h-[24rem] md:h-[26rem]`}>
            <Trophy className={`w-20 h-20 md:w-24 md:h-24 text-${theme}-500`} />
            <span className="text-center px-6">انتهت البطاقات بنجاح!</span>
            <div className="text-2xl md:text-3xl text-slate-500 font-bold">
              النتيجة: {toArabicNum(progress.score)} من {toArabicNum(sectionData.cards.length)}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-10 flex gap-2">
        {sectionData.cards.map((_, idx) => (
          <div 
            key={idx}
            className={`h-2 rounded-full transition-all duration-500 ${
              idx === currentIndex ? `w-10 bg-${theme}-400` : idx < progress.answered ? 'w-4 bg-emerald-400' : 'w-4 bg-slate-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Flashcards;

