import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ResultBox } from '../ui/ResultBox';

// Wordwall-style solid colors with white text — all chosen for excellent contrast
const PAIR_COLORS = [
  { bg: 'bg-sky-500',     active: 'bg-sky-600',     border: 'border-sky-600',     ring: 'ring-sky-300' },
  { bg: 'bg-rose-500',    active: 'bg-rose-600',    border: 'border-rose-600',    ring: 'ring-rose-300' },
  { bg: 'bg-amber-600',   active: 'bg-amber-700',   border: 'border-amber-700',   ring: 'ring-amber-300' },
  { bg: 'bg-emerald-600', active: 'bg-emerald-700',  border: 'border-emerald-700', ring: 'ring-emerald-300' },
  { bg: 'bg-violet-500',  active: 'bg-violet-600',  border: 'border-violet-600',  ring: 'ring-violet-300' },
  { bg: 'bg-orange-500',  active: 'bg-orange-600',  border: 'border-orange-600',  ring: 'ring-orange-300' },
  { bg: 'bg-cyan-600',    active: 'bg-cyan-700',    border: 'border-cyan-700',    ring: 'ring-cyan-300' },
  { bg: 'bg-pink-500',    active: 'bg-pink-600',    border: 'border-pink-600',    ring: 'ring-pink-300' },
  { bg: 'bg-teal-600',    active: 'bg-teal-700',    border: 'border-teal-700',    ring: 'ring-teal-300' },
  { bg: 'bg-indigo-500',  active: 'bg-indigo-600',  border: 'border-indigo-600',  ring: 'ring-indigo-300' },
  { bg: 'bg-red-600',     active: 'bg-red-700',     border: 'border-red-700',     ring: 'ring-red-300' },
  { bg: 'bg-fuchsia-600', active: 'bg-fuchsia-700',  border: 'border-fuchsia-700', ring: 'ring-fuchsia-300' },
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

  // Dynamic uniform height — measured ONCE on mount, then locked
  const gridRef = useRef(null);
  const [uniformHeight, setUniformHeight] = useState(0);
  const heightLocked = useRef(false);

  useEffect(() => {
    if (heightLocked.current || !gridRef.current) return;
    const measure = () => {
      const buttons = gridRef.current?.querySelectorAll('[data-match-btn]');
      if (!buttons || buttons.length === 0) return;
      let maxH = 0;
      buttons.forEach(btn => {
        btn.style.minHeight = 'auto';
      });
      buttons.forEach(btn => {
        const h = btn.scrollHeight;
        if (h > maxH) maxH = h;
      });
      if (maxH > 0) {
        setUniformHeight(maxH + 4);
        heightLocked.current = true; // Lock — never re-measure
      }
    };
    // Allow DOM to render first
    requestAnimationFrame(() => requestAnimationFrame(measure));
  }, []);

  useEffect(() => {
    if (selectedRight && selectedLeft) {
      if (selectedRight === selectedLeft) {
        // Match! Move the left item to face its right pair
        const matchedId = selectedRight;
        setMatchedPairs(prev => [...prev, matchedId]);
        setSelectedRight(null);
        setSelectedLeft(null);

        // Reorder leftItems so matched item sits at the same row as its right pair
        setLeftItems(prev => {
          const rightIdx = rightItems.findIndex(r => r.id === matchedId);
          const leftIdx = prev.findIndex(l => l.id === matchedId);
          if (rightIdx === -1 || leftIdx === -1 || rightIdx === leftIdx) return prev;
          const newArr = [...prev];
          // Swap positions so matched left item faces its right pair
          [newArr[rightIdx], newArr[leftIdx]] = [newArr[leftIdx], newArr[rightIdx]];
          return newArr;
        });

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
  }, [selectedRight, selectedLeft, sectionData.id, progress, onUpdateProgress, rightItems]);

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
      return `${color.bg} ${color.border} text-white cursor-default pointer-events-none shadow-sm`;
    }
    if (isWrong) {
      return `bg-red-700 border-red-800 text-white shake pointer-events-none`;
    }
    if (isSelected) {
      return `${color.active} ${color.border} text-white shadow-xl scale-[1.04] ring-4 ${color.ring}`;
    }
    return `${color.bg} ${color.border} text-white active:scale-95 cursor-pointer md:hover:shadow-lg md:hover:scale-[1.02] md:hover:brightness-110`;
  };

  const getLeftBtnClass = (item) => {
    const isMatched = matchedPairs.includes(item.id);
    const isSelected = selectedLeft === item.id;
    const isWrong = wrongAttempt && isSelected;
    const color = getColorForPair(item.id);

    if (isMatched) {
      // Adopt pair's solid color
      return `${color.bg} ${color.border} text-white cursor-default pointer-events-none shadow-sm`;
    }
    if (isWrong) {
      return `bg-red-700 border-red-800 text-white shake pointer-events-none`;
    }
    if (isSelected) {
      return `bg-slate-600 border-slate-700 text-white shadow-xl scale-[1.04] ring-4 ring-slate-300`;
    }
    return `bg-white border-slate-200 text-slate-700 active:scale-95 cursor-pointer md:hover:border-slate-400 md:hover:shadow-lg md:hover:scale-[1.02]`;
  };

  const btnBase = `w-full px-3 py-2.5 md:px-5 md:py-3 rounded-xl md:rounded-2xl font-bold text-sm md:text-xl transition-all duration-300 border-2 flex items-center justify-center text-center leading-snug md:leading-relaxed`;

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

        {/* Grid rows */}
        {rightItems.map((rItem, rowIdx) => {
          const lItem = leftItems[rowIdx];
          const heightStyle = uniformHeight ? { minHeight: `${uniformHeight}px` } : {};
          return (
            <React.Fragment key={rowIdx}>
              {/* First column (colored) */}
              <button
                data-match-btn
                onClick={() => handleRightClick(rItem.id)}
                className={`${btnBase} ${getRightBtnClass(rItem)}`}
                style={heightStyle}
              >
                <span>{swap ? rItem.left : rItem.right}</span>
                {matchedPairs.includes(rItem.id) && <span className="mr-1.5 text-xs md:text-base">✓</span>}
              </button>

              {/* Second column (neutral until matched) */}
              <button
                data-match-btn
                onClick={() => handleLeftClick(lItem.id)}
                className={`${btnBase} ${getLeftBtnClass(lItem)}`}
                style={heightStyle}
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
