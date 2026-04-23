import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, XCircle, Trophy } from 'lucide-react';
import { toArabicNum } from '../../utils';
import { ResultBox } from '../ui/ResultBox';

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

  const handleAnswer = (knewIt) => {
    if (isAnimating || animatingOut || isComplete) return;
    
    // In Flashcards, score is purely informational if we want to track 'knew it'
    const newScore = progress.score + (knewIt ? 1 : 0);
    onUpdateProgress(sectionData.id, Math.max(progress.answered, currentIndex + 1), newScore);
    
    if (currentIndex < sectionData.cards.length) {
      setAnimatingOut(true);
      
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setAnimatingOut(false);
      }, 400); // 400ms duration for fly-out animation
    }
  };

  if (isComplete) {
    return (
      <div className="max-w-3xl mx-auto pb-12 fade-in flex flex-col items-center gap-8">
        <div className={`text-3xl md:text-4xl font-bold text-${theme}-600 flex flex-col items-center gap-4 py-10 bg-white border-2 border-${theme}-200 w-full max-w-lg rounded-3xl shadow-lg`}>
          <Trophy className={`w-16 h-16 text-${theme}-500`} />
          <span>انتهت البطاقات!</span>
        </div>
        <div className="w-full max-w-2xl">
          <ResultBox 
            title={sectionData.title} 
            theme={theme} 
            score={progress.score} 
            total={sectionData.cards.length} 
          />
        </div>
      </div>
    );
  }

  const card = sectionData.cards[currentIndex];
  const isFlipped = flipped[currentIndex];

  return (
    <div className="max-w-3xl mx-auto pb-12 fade-in flex flex-col items-center">
      {sectionData.description && (
        <div className="text-center mb-8 w-full px-4">
          <p className={`text-lg md:text-xl text-${theme}-800 font-semibold bg-${theme}-50 bg-opacity-60 p-4 rounded-2xl shadow-sm inline-block w-full`}>
            {sectionData.description}
          </p>
        </div>
      )}

      {/* Card Container */}
      <div 
        key={currentIndex}
        className={`w-full max-w-2xl px-4 perspective-1000 ${animatingOut ? 'fly-out' : 'fade-in'}`}
      >
        <div 
          onClick={handleFlip}
          className={`relative aspect-[16/10] w-full transition-transform duration-700 preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''} shadow-xl rounded-[2.5rem]`}
        >
          {/* Front */}
          <div className={`absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 bg-white border-[3px] border-${theme}-400 rounded-[2.5rem]`}>
            <div className="absolute top-8 right-10 text-slate-400 font-bold text-lg">
              البطاقة {toArabicNum(currentIndex + 1)}
            </div>
            <div className={`w-20 h-20 rounded-full bg-${theme}-50 flex items-center justify-center mb-6`}>
              <RefreshCw className={`w-10 h-10 text-${theme}-400`} />
            </div>
            <h3 className={`text-3xl md:text-4xl font-bold text-slate-700 text-center leading-relaxed`}>
              {card.front}
            </h3>
            <p className="mt-8 text-slate-400 text-sm font-medium">انقر لقلب البطاقة</p>
          </div>

          {/* Back */}
          <div className={`absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-between p-8 md:p-10 bg-white border-[3px] border-${theme}-400 rounded-[2.5rem] shadow-2xl`} onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-8 right-10 text-slate-400 font-bold text-lg">
              البطاقة {toArabicNum(currentIndex + 1)}
            </div>
            
            <div className="flex-grow flex flex-col items-center justify-center w-full">
              <h3 className={`text-3xl md:text-4xl font-bold text-${theme}-600 mb-6 text-center leading-relaxed`}>
                {card.front}
              </h3>
              <div className="w-full">
                <p className={`text-xl md:text-2xl text-slate-600 font-bold text-center leading-relaxed`}>
                  {card.back}
                </p>
                {card.explanation && (
                  <p className="mt-4 text-lg md:text-xl text-slate-500 font-medium text-center leading-relaxed">
                    {card.explanation}
                  </p>
                )}
              </div>
            </div>

            {/* Buttons inside card */}
            <div className="w-full flex gap-4 mt-8">
              <button 
                onClick={(e) => { e.stopPropagation(); handleAnswer(true); }}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 shadow-lg transition-all active:scale-95"
              >
                <span>عرفتها</span>
                <CheckCircle2 className="w-6 h-6" />
              </button>

              <button 
                onClick={(e) => { e.stopPropagation(); handleAnswer(false); }}
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-4 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 shadow-lg transition-all active:scale-95"
              >
                <span>أخطأت</span>
                <XCircle className="w-6 h-6" />
              </button>
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

