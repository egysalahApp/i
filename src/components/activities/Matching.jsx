import React, { useState, useEffect, useRef } from 'react';
import { ResultBox } from '../ui/ResultBox';
import { ACTIVITY_COLORS } from '../../constants/colorPalette';

// Use centralized palette
const PAIR_COLORS = ACTIVITY_COLORS;

const Matching = ({ sectionData, progress, onUpdateProgress }) => {
  const theme = sectionData.theme;
  const swap = sectionData.swapColumns || false;
  const isComplete = progress.total > 0 && progress.answered === progress.total;

  const shuffle = (array) => array.map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  // Assign a stable color index to each pair based on original order synchronously
  const pairColorMap = React.useMemo(() => {
    const map = {};
    (sectionData.pairs || []).forEach((pair, idx) => {
      map[pair.id] = idx % PAIR_COLORS.length;
    });
    return map;
  }, [sectionData.pairs]);

  const [rightItems, setRightItems] = useState(() => shuffle([...(sectionData.pairs || [])]));
  const [leftItems, setLeftItems] = useState(() => shuffle([...(sectionData.pairs || [])]));
  const [selectedRight, setSelectedRight] = useState(null);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [wrongAttempt, setWrongAttempt] = useState(false);

  // Calculate fixed height based on longest text in all pairs
  const allTexts = (sectionData.pairs || []).flatMap(p => [p.right, p.left]);
  const maxChars = Math.max(...allTexts.map(t => t.length), 1);
  // Base height + extra per ~10 chars (accounts for text wrapping on mobile)
  const fixedHeight = maxChars > 30 ? 90 : maxChars > 20 ? 76 : maxChars > 10 ? 64 : 56;
  const gridRef = useRef(null);

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
    const idx = pairColorMap[pairId] ?? 0;
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

  const btnBase = `w-full px-2.5 py-1 md:px-5 md:py-1.5 rounded-xl md:rounded-2xl font-bold text-sm md:text-xl transition-all duration-300 border-2 flex items-center justify-center text-center leading-snug md:leading-relaxed`;

  return (
    <div className="max-w-4xl mx-auto pb-6" dir="rtl">
      {sectionData.description && (
        <div className="text-center mb-8 fade-in">
          <p className={`text-lg md:text-xl text-slate-700 font-medium bg-${theme}-50/40 border border-${theme}-100 p-4 md:p-5 rounded-2xl shadow-sm inline-block w-full leading-relaxed`}>
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
          const heightStyle = { minHeight: `${fixedHeight}px` };
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
