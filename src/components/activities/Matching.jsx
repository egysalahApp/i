import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ResultBox } from '../ui/ResultBox';

// Extended color palette for pair identification (enough for 12+ pairs)
const PAIR_COLORS = [
  { bg: 'bg-sky-100',    border: 'border-sky-400',    text: 'text-sky-800',    activeBg: 'bg-sky-200',    activeBorder: 'border-sky-500' },
  { bg: 'bg-rose-100',   border: 'border-rose-400',   text: 'text-rose-800',   activeBg: 'bg-rose-200',   activeBorder: 'border-rose-500' },
  { bg: 'bg-amber-100',  border: 'border-amber-400',  text: 'text-amber-800',  activeBg: 'bg-amber-200',  activeBorder: 'border-amber-500' },
  { bg: 'bg-emerald-100',border: 'border-emerald-400', text: 'text-emerald-800',activeBg: 'bg-emerald-200',activeBorder: 'border-emerald-500' },
  { bg: 'bg-violet-100', border: 'border-violet-400',  text: 'text-violet-800', activeBg: 'bg-violet-200', activeBorder: 'border-violet-500' },
  { bg: 'bg-orange-100', border: 'border-orange-400',  text: 'text-orange-800', activeBg: 'bg-orange-200', activeBorder: 'border-orange-500' },
  { bg: 'bg-cyan-100',   border: 'border-cyan-400',    text: 'text-cyan-800',   activeBg: 'bg-cyan-200',   activeBorder: 'border-cyan-500' },
  { bg: 'bg-pink-100',   border: 'border-pink-400',    text: 'text-pink-800',   activeBg: 'bg-pink-200',   activeBorder: 'border-pink-500' },
  { bg: 'bg-teal-100',   border: 'border-teal-400',    text: 'text-teal-800',   activeBg: 'bg-teal-200',   activeBorder: 'border-teal-500' },
  { bg: 'bg-indigo-100', border: 'border-indigo-400',  text: 'text-indigo-800', activeBg: 'bg-indigo-200', activeBorder: 'border-indigo-500' },
  { bg: 'bg-lime-100',   border: 'border-lime-400',    text: 'text-lime-800',   activeBg: 'bg-lime-200',   activeBorder: 'border-lime-500' },
  { bg: 'bg-fuchsia-100',border: 'border-fuchsia-400', text: 'text-fuchsia-800',activeBg: 'bg-fuchsia-200',activeBorder: 'border-fuchsia-500' },
];

const Matching = ({ sectionData, progress, onUpdateProgress }) => {
  const theme = sectionData.theme;
  const swap = sectionData.swapColumns || false;
  const isComplete = progress.total > 0 && progress.answered === progress.total;

  const shuffle = (array) => array.map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  // Assign a stable color index to each pair based on original order
  const pairColorMap = useRef({});
  useEffect(() => {
    (sectionData.pairs || []).forEach((pair, idx) => {
      pairColorMap.current[pair.id] = idx % PAIR_COLORS.length;
    });
  }, [sectionData.pairs]);

  const [rightItems, setRightItems] = useState(() => shuffle([...(sectionData.pairs || [])]));
  const [leftItems, setLeftItems] = useState(() => shuffle([...(sectionData.pairs || [])]));
  const [selectedRight, setSelectedRight] = useState(null);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [wrongAttempt, setWrongAttempt] = useState(false);

  // Dynamic uniform height
  const gridRef = useRef(null);
  const [uniformHeight, setUniformHeight] = useState(0);

  const measureHeight = useCallback(() => {
    if (!gridRef.current) return;
    const buttons = gridRef.current.querySelectorAll('[data-match-btn]');
    let maxH = 0;
    // Reset heights first to get natural height
    buttons.forEach(btn => { btn.style.minHeight = 'auto'; });
    // Measure
    requestAnimationFrame(() => {
      buttons.forEach(btn => {
        const h = btn.scrollHeight;
        if (h > maxH) maxH = h;
      });
      if (maxH > 0) setUniformHeight(maxH);
    });
  }, []);

  useEffect(() => {
    measureHeight();
    window.addEventListener('resize', measureHeight);
    return () => window.removeEventListener('resize', measureHeight);
  }, [measureHeight, rightItems, leftItems]);

  useEffect(() => {
    if (selectedRight && selectedLeft) {
      if (selectedRight === selectedLeft) {
        // Match!
        const matchedId = selectedRight;
        setMatchedPairs(prev => [...prev, matchedId]);
        setSelectedRight(null);
        setSelectedLeft(null);
        onUpdateProgress(sectionData.id, progress.answered + 1, progress.score + 1);
      } else {
        // Mismatch!
        setWrongAttempt(true);
        setTimeout(() => {
          setSelectedRight(null);
          setSelectedLeft(null);
          setWrongAttempt(false);
        }, 600);
      }
    }
  }, [selectedRight, selectedLeft, sectionData.id, progress, onUpdateProgress]);

  const handleRightClick = (id) => {
    if (wrongAttempt || matchedPairs.includes(id)) return;
    setSelectedRight(prev => prev === id ? null : id);
  };

  const handleLeftClick = (id) => {
    if (wrongAttempt || matchedPairs.includes(id)) return;
    setSelectedLeft(prev => prev === id ? null : id);
  };

  const getColorForPair = (pairId) => {
    const idx = pairColorMap.current[pairId] ?? 0;
    return PAIR_COLORS[idx % PAIR_COLORS.length];
  };

  const getRightBtnClass = (item) => {
    const isMatched = matchedPairs.includes(item.id);
    const isSelected = selectedRight === item.id;
    const isWrong = wrongAttempt && isSelected;
    const color = getColorForPair(item.id);

    if (isMatched) {
      return `${color.bg} ${color.border} ${color.text} opacity-60 cursor-default pointer-events-none`;
    }
    if (isWrong) {
      return `bg-rose-100 border-rose-500 text-rose-800 shake pointer-events-none`;
    }
    if (isSelected) {
      return `${color.activeBg} ${color.activeBorder} ${color.text} shadow-lg scale-[1.03]`;
    }
    // Default: colored background (right column is always colored)
    return `${color.bg} ${color.border} ${color.text} active:scale-95 cursor-pointer md:hover:shadow-md md:hover:scale-[1.02]`;
  };

  const getLeftBtnClass = (item) => {
    const isMatched = matchedPairs.includes(item.id);
    const isSelected = selectedLeft === item.id;
    const isWrong = wrongAttempt && isSelected;
    const color = getColorForPair(item.id);

    if (isMatched) {
      // When matched, adopt the pair's color
      return `${color.bg} ${color.border} ${color.text} opacity-60 cursor-default pointer-events-none`;
    }
    if (isWrong) {
      return `bg-rose-100 border-rose-500 text-rose-800 shake pointer-events-none`;
    }
    if (isSelected) {
      return `bg-slate-200 border-slate-500 text-slate-900 shadow-lg scale-[1.03]`;
    }
    // Default: neutral/white (left column starts uncolored)
    return `bg-white border-slate-200 text-slate-700 active:scale-95 cursor-pointer md:hover:border-slate-400 md:hover:shadow-md md:hover:scale-[1.02]`;
  };

  return (
    <div className="max-w-4xl mx-auto pb-6" dir="rtl">
      {sectionData.description && (
        <div className="text-center mb-8 fade-in">
          <p className={`text-lg md:text-xl text-${theme}-800 font-semibold bg-${theme}-50 bg-opacity-60 p-4 md:p-5 rounded-2xl shadow-sm inline-block w-full`}>
            {sectionData.description}
          </p>
        </div>
      )}

      <div ref={gridRef} className="grid grid-cols-2 gap-2.5 md:gap-4 w-full fade-in">
        {/* Header labels */}
        <div className="text-center text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1 opacity-80">{swap ? 'المجموعة الثانية' : 'المجموعة الأولى'}</div>
        <div className="text-center text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1 opacity-80">{swap ? 'المجموعة الأولى' : 'المجموعة الثانية'}</div>

        {/* Interleaved rows: right item then left item for each row */}
        {rightItems.map((rItem, rowIdx) => {
          const lItem = leftItems[rowIdx];
          return (
            <React.Fragment key={rowIdx}>
              {/* First column (colored) */}
              <button
                data-match-btn
                onClick={() => handleRightClick(rItem.id)}
                className={`w-full px-3 py-2.5 md:px-5 md:py-3 rounded-xl md:rounded-2xl font-bold text-sm md:text-xl transition-all duration-200 border-2 flex items-center justify-center text-center leading-snug md:leading-relaxed ${getRightBtnClass(rItem)}`}
                style={uniformHeight ? { minHeight: `${uniformHeight}px` } : {}}
              >
                <span>{swap ? rItem.left : rItem.right}</span>
                {matchedPairs.includes(rItem.id) && <span className="mr-1.5 text-xs md:text-base">✓</span>}
              </button>

              {/* Second column (neutral until matched) */}
              <button
                data-match-btn
                onClick={() => handleLeftClick(lItem.id)}
                className={`w-full px-3 py-2.5 md:px-5 md:py-3 rounded-xl md:rounded-2xl font-bold text-sm md:text-xl transition-all duration-200 border-2 flex items-center justify-center text-center leading-snug md:leading-relaxed ${getLeftBtnClass(lItem)}`}
                style={uniformHeight ? { minHeight: `${uniformHeight}px` } : {}}
              >
                <span>{swap ? lItem.right : lItem.left}</span>
                {matchedPairs.includes(lItem.id) && <span className="mr-1.5 text-xs md:text-base">✓</span>}
              </button>
            </React.Fragment>
          );
        })}
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
