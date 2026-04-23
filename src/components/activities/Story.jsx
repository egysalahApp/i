import React, { useState, useRef } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { toArabicNum } from '../../utils';

const Story = ({ sectionData, progress, onUpdateProgress, onNextSection, isLastSection }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const theme = sectionData.theme;
  const slide = sectionData.slides[currentIndex];
  const isComplete = currentIndex >= sectionData.slides.length - 1;

  const handleNav = (dir) => {
    const newIndex = currentIndex + dir;
    if (newIndex >= 0 && newIndex < sectionData.slides.length) {
      setCurrentIndex(newIndex);
      if (newIndex > progress.answered - 1) {
        onUpdateProgress(sectionData.id, newIndex + 1, progress.score);
      }
    }
  };

  const handleSwipeStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleSwipeEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipeGesture();
  };

  const handleSwipeGesture = () => {
    const threshold = 50;
    if (touchEndX.current < touchStartX.current - threshold) {
      if (!isComplete) handleNav(1); // Swipe left -> Next
    } else if (touchEndX.current > touchStartX.current + threshold) {
      if (currentIndex > 0) handleNav(-1); // Swipe right -> Prev
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      {/* Progress Bar */}
      <div className="flex w-full gap-2 mb-6 px-4">
        {sectionData.slides.map((_, idx) => {
          const isActive = idx === currentIndex;
          const isPassed = idx < currentIndex;
          let bgClass = 'bg-slate-200';
          if (isActive) bgClass = `bg-${theme}-500`;
          else if (isPassed) bgClass = `bg-${theme}-300`;
          return (
            <div key={idx} className={`h-2 md:h-3 rounded-full flex-grow transition-colors duration-300 ${bgClass}`} />
          );
        })}
      </div>



      {/* Main Slide Card */}
      <div 
        className={`bg-white border-2 border-${theme}-200 rounded-[2.5rem] p-8 md:p-12 shadow-lg w-full flex flex-col items-center text-center relative min-h-[450px] justify-center transform transition-all duration-500 overflow-hidden select-none`}
        onTouchStart={handleSwipeStart}
        onTouchEnd={handleSwipeEnd}
      >
        {/* Click area left (Next) */}
        <button 
          disabled={isComplete} 
          onClick={() => handleNav(1)} 
          className={`absolute top-0 left-0 w-24 md:w-32 h-full z-10 flex flex-col items-start justify-start opacity-0 hover:opacity-100 transition-opacity duration-300 outline-none ${isComplete ? 'cursor-default pointer-events-none' : 'cursor-pointer'}`}
        >
          <div className={`mt-8 w-12 h-16 md:w-16 md:h-20 flex items-center justify-center rounded-r-2xl md:rounded-r-3xl bg-gradient-to-r from-slate-100 to-transparent text-${theme}-600 border-l-4 border-${theme}-400`}>
            <ArrowLeft className="w-8 h-8 md:w-10 md:h-10 drop-shadow ml-1 md:ml-2" strokeWidth={2.5} />
          </div>
        </button>

        {/* Click area right (Prev) */}
        <button 
          disabled={currentIndex === 0} 
          onClick={() => handleNav(-1)} 
          className={`absolute top-0 right-0 w-24 md:w-32 h-full z-10 flex flex-col items-end justify-start opacity-0 hover:opacity-100 transition-opacity duration-300 outline-none ${currentIndex === 0 ? 'cursor-default pointer-events-none' : 'cursor-pointer'}`}
        >
          <div className="mt-8 w-12 h-16 md:w-16 md:h-20 flex items-center justify-center rounded-l-2xl md:rounded-l-3xl bg-gradient-to-l from-slate-100 to-transparent text-slate-500 border-r-4 border-slate-300">
            <ArrowRight className="w-8 h-8 md:w-10 md:h-10 drop-shadow mr-1 md:mr-2" strokeWidth={2.5} />
          </div>
        </button>

        {/* Content */}
        <div key={currentIndex} className="fade-in w-full flex flex-col items-center pointer-events-none">
          <div className="text-7xl md:text-8xl mb-8 drop-shadow-md transition-transform hover:scale-110 z-0">
            {slide.icon}
          </div>
          <h3 className={`text-3xl md:text-4xl font-bold text-${theme}-800 mb-6 z-0 px-6 md:px-12`}>
            {slide.title}
          </h3>
          <p className="text-xl md:text-2xl font-medium text-slate-700 leading-relaxed z-0 px-6 md:px-16">
            {slide.text}
          </p>
        </div>
      </div>

      {/* Swipe Instruction (Moved below card) */}
      <div className="mt-6 w-full flex justify-center items-center opacity-50 text-slate-500 gap-3 text-sm md:text-base font-semibold pointer-events-none fade-in">
        <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
        <span>اسحب أو انقر على أطراف البطاقة للتنقل</span>
        <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
      </div>

      {/* Next Section Button */}
      {isComplete && !isLastSection && (
        <div className="mt-8 pt-4 w-full flex justify-center fade-in">
          <button 
            onClick={onNextSection} 
            className={`bg-${theme}-600 md:hover:bg-${theme}-700 text-white font-semibold text-xl md:text-2xl py-4 px-10 rounded-full shadow-lg flex items-center gap-3 active:scale-95 transition-all`}
          >
            القسم التالي <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Story;
