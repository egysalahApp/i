import React, { useState, useEffect } from 'react';
import { ResultBox } from '../ui/ResultBox';

const Matching = ({ sectionData, progress, onUpdateProgress }) => {
  const theme = sectionData.theme;
  const isComplete = progress.total > 0 && progress.answered === progress.total;

  const shuffle = (array) => array.map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  const [leftItems, setLeftItems] = useState(() => shuffle([...(sectionData.pairs || [])]));
  const [rightItems, setRightItems] = useState(() => shuffle([...(sectionData.pairs || [])]));
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [wrongAttempt, setWrongAttempt] = useState(false);

  useEffect(() => {
    if (selectedLeft && selectedRight) {
      if (selectedLeft === selectedRight) {
        // Match!
        const matchedId = selectedLeft;
        setMatchedPairs(prev => [...prev, matchedId]);
        setSelectedLeft(null);
        setSelectedRight(null);
        
        onUpdateProgress(sectionData.id, progress.answered + 1, progress.score + 1);

        // Move matched items to bottom (reorder)
        setLeftItems(prev => {
          const idx = prev.findIndex(item => item.id === matchedId);
          if (idx > -1) {
            const arr = [...prev];
            const item = arr.splice(idx, 1)[0];
            return [...arr, item];
          }
          return prev;
        });

        setRightItems(prev => {
          const idx = prev.findIndex(item => item.id === matchedId);
          if (idx > -1) {
            const arr = [...prev];
            const item = arr.splice(idx, 1)[0];
            return [...arr, item];
          }
          return prev;
        });

      } else {
        // Mismatch!
        setWrongAttempt(true);
        setTimeout(() => {
          setSelectedLeft(null);
          setSelectedRight(null);
          setWrongAttempt(false);
        }, 600);
      }
    }
  }, [selectedLeft, selectedRight, sectionData.id, progress, onUpdateProgress]);

  const handleLeftClick = (id) => {
    if (wrongAttempt || matchedPairs.includes(id)) return;
    setSelectedLeft(prev => prev === id ? null : id);
  };

  const handleRightClick = (id) => {
    if (wrongAttempt || matchedPairs.includes(id)) return;
    setSelectedRight(prev => prev === id ? null : id);
  };

  return (
    <div className="max-w-5xl mx-auto pb-6">
      {sectionData.description && (
        <div className="text-center mb-10 fade-in">
          <p className={`text-lg md:text-xl text-${theme}-800 font-semibold bg-${theme}-50 bg-opacity-60 p-4 md:p-5 rounded-2xl shadow-sm inline-block w-full`}>
            {sectionData.description}
          </p>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 md:gap-12 w-full fade-in justify-center items-start">
        {/* Right Column (Usually concepts) */}
        <div className="flex flex-col gap-4 w-full md:w-1/2">
          <div className="text-center text-slate-400 font-bold text-xs uppercase tracking-widest mb-2 opacity-80">المجموعة الأولى</div>

          {rightItems.map((item) => {
            const isMatched = matchedPairs.includes(item.id);
            const isSelected = selectedRight === item.id;
            const isWrong = wrongAttempt && isSelected;
            
            let btnClass = `w-full min-h-[4.5rem] md:min-h-[5rem] px-5 py-3 rounded-2xl font-bold text-lg md:text-xl transition-all duration-300 border-2 flex items-center justify-center text-center leading-relaxed `;
            
            if (isMatched) {
              btnClass += `bg-emerald-50 border-emerald-500 text-emerald-800 shadow-inner translate-y-1 cursor-default pointer-events-none`;
            } else if (isWrong) {
              btnClass += `bg-rose-100 border-rose-500 text-rose-800 shake pointer-events-none`;
            } else if (isSelected) {
              btnClass += `bg-${theme}-100 border-${theme}-500 text-${theme}-900 shadow-md transform scale-[1.02]`;
            } else {
              btnClass += `bg-white border-slate-200 text-slate-700 md:hover:border-${theme}-300 md:hover:bg-${theme}-50 md:hover:-translate-y-1 md:hover:shadow-md active:scale-95 cursor-pointer`;
            }

            return (
              <button 
                key={`r-${item.id}`} 
                onClick={() => handleRightClick(item.id)}
                className={btnClass}
              >
                {item.right}
              </button>
            );
          })}
        </div>

        {/* Left Column (Usually definitions) */}
        <div className="flex flex-col gap-4 w-full md:w-1/2 bg-slate-50/50 md:bg-transparent p-4 md:p-0 rounded-[2.5rem] md:rounded-none border border-slate-100 md:border-transparent">
          <div className="text-center text-slate-400 font-bold text-xs uppercase tracking-widest mb-2 opacity-80">المجموعة الثانية</div>

          {leftItems.map((item) => {
            const isMatched = matchedPairs.includes(item.id);
            const isSelected = selectedLeft === item.id;
            const isWrong = wrongAttempt && isSelected;
            
            let btnClass = `w-full min-h-[4.5rem] md:min-h-[5rem] px-5 py-3 rounded-2xl font-bold text-lg md:text-xl transition-all duration-300 border-2 flex items-center justify-center text-center leading-relaxed `;
            
            if (isMatched) {
              btnClass += `bg-emerald-50 border-emerald-500 text-emerald-800 shadow-inner translate-y-1 cursor-default pointer-events-none`;
            } else if (isWrong) {
              btnClass += `bg-rose-100 border-rose-500 text-rose-800 shake pointer-events-none`;
            } else if (isSelected) {
              btnClass += `bg-${theme}-100 border-${theme}-500 text-${theme}-900 shadow-md transform scale-[1.02]`;
            } else {
              btnClass += `bg-white border-slate-200 text-slate-700 md:hover:border-${theme}-300 md:hover:bg-${theme}-50 md:hover:-translate-y-1 md:hover:shadow-md active:scale-95 cursor-pointer`;
            }

            return (
              <button 
                key={`l-${item.id}`} 
                onClick={() => handleLeftClick(item.id)}
                className={btnClass}
              >
                {item.left}
              </button>
            );
          })}
        </div>
      </div>

      {isComplete && (
        <div className="mt-12 fade-in smooth-expand">
          <ResultBox 
            title={sectionData.title} 
            theme={theme} 
            score={progress.score} 
            total={progress.total} 
          />
        </div>
      )}
    </div>
  );
};

export default Matching;
