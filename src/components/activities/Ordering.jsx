import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HintBox } from '../ui/HintBox';
import { toArabicNum, renderFormattedText } from '../../utils';
import { Lightbulb, ChevronUp, ChevronDown, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

const Ordering = ({ sectionData, progress, onUpdateProgress }) => {
  const theme = sectionData.theme || 'indigo';
  const questions = sectionData.questions || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [firstAttempt, setFirstAttempt] = useState(true);
  const [animatingOut, setAnimatingOut] = useState(false);
  const isComplete = currentIndex >= questions.length;
  const currentQuestion = isComplete ? (questions[questions.length - 1] || {}) : (questions[currentIndex] || {});

  // Shuffle the correctOrder to create initial user order
  const shuffleArray = (arr) => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    // Ensure it's not already in correct order
    if (JSON.stringify(shuffled) === JSON.stringify(arr) && arr.length > 1) {
      [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
    }
    return shuffled;
  };

  // Initialize items safely
  const initItems = () => {
    const order = currentQuestion?.correctOrder || [];
    return shuffleArray(order);
  };
  const [items, setItems] = useState(initItems);
  const [correctPositions, setCorrectPositions] = useState([]);

  // Drag state
  const [dragIndex, setDragIndex] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const itemRefs = useRef([]);

  // Reset items whenever the question index changes
  useEffect(() => {
    if (!isComplete) {
      setItems(initItems);
      setChecked(false);
      setIsCorrect(false);
      setFirstAttempt(true);
      setShowHint(false);
      setCorrectPositions([]);
    }
  }, [currentIndex]);

  const moveItem = useCallback((fromIndex, direction) => {
    if (checked) return;
    const toIndex = fromIndex + direction;
    if (toIndex < 0 || toIndex >= items.length) return;

    setItems(prev => {
      const newItems = [...prev];
      [newItems[fromIndex], newItems[toIndex]] = [newItems[toIndex], newItems[fromIndex]];
      return newItems;
    });
  }, [checked, items.length]);

  const handleCheck = () => {
    const correct = currentQuestion.correctOrder;
    const positions = items.map((item, idx) => item === correct[idx]);
    setCorrectPositions(positions);
    const allCorrect = positions.every(p => p);
    setIsCorrect(allCorrect);
    setChecked(true);

    if (allCorrect) {
      const newAnswered = progress.answered + 1;
      const newScore = progress.score + (firstAttempt ? 1 : 0);
      onUpdateProgress(sectionData.id, newAnswered, newScore);
    }
  };

  const handleRetry = () => {
    setChecked(false);
    setIsCorrect(false);
    setFirstAttempt(false);
    setCorrectPositions([]);
    // Re-shuffle only incorrect items, keep correct ones in place
    const correct = currentQuestion.correctOrder;
    const newItems = [...items];
    const incorrectIndices = items
      .map((item, idx) => item !== correct[idx] ? idx : -1)
      .filter(i => i !== -1);
    
    const incorrectItems = incorrectIndices.map(i => newItems[i]);
    // Simple shuffle of incorrect items
    for (let i = incorrectItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [incorrectItems[i], incorrectItems[j]] = [incorrectItems[j], incorrectItems[i]];
    }
    incorrectIndices.forEach((origIdx, i) => {
      newItems[origIdx] = incorrectItems[i];
    });
    setItems(newItems);
  };

  const handleNext = () => {
    setAnimatingOut(true);
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setAnimatingOut(false);
    }, 400);
  };

  // Touch drag handlers
  const handleTouchStart = (e, index) => {
    if (checked) return;
    setDragIndex(index);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (dragIndex === null || checked) return;
    e.preventDefault();
  };

  const handleTouchEnd = (e, index) => {
    if (dragIndex === null || checked) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchEndY - touchStartY;
    const threshold = 40;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        moveItem(index, 1);
      } else {
        moveItem(index, -1);
      }
    }
    setDragIndex(null);
    setTouchStartY(null);
  };

  // Desktop drag handlers
  const handleDragStart = (e, index) => {
    if (checked) return;
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === targetIndex || checked) return;

    setItems(prev => {
      const newItems = [...prev];
      const [removed] = newItems.splice(dragIndex, 1);
      newItems.splice(targetIndex, 0, removed);
      return newItems;
    });
    setDragIndex(null);
  };

  const getItemStyle = (idx) => {
    if (!checked) {
      return `bg-white border-2 border-slate-200 text-slate-800 md:hover:border-${theme}-300 md:hover:shadow-md`;
    }
    if (correctPositions[idx]) {
      return `bg-emerald-50 border-2 border-emerald-400 text-emerald-800`;
    }
    return `bg-rose-50 border-2 border-rose-300 text-rose-800`;
  };

  const getNumberStyle = (idx) => {
    if (!checked) {
      return `bg-${theme}-100 text-${theme}-700`;
    }
    if (correctPositions[idx]) {
      return `bg-emerald-200 text-emerald-800`;
    }
    return `bg-rose-200 text-rose-800`;
  };

  return (
    <div className="max-w-3xl mx-auto pb-6 min-h-[500px]">
      {sectionData.description && (
        <div className="text-center mb-8 fade-in">
          <p className={`text-lg md:text-xl text-${theme}-800 font-semibold bg-${theme}-50 bg-opacity-60 p-4 md:p-5 rounded-2xl shadow-sm inline-block w-full`}>
            {sectionData.description}
          </p>
        </div>
      )}

      <div className={`fade-in ${animatingOut ? 'fly-out' : ''}`}>
        {/* Progress indicator */}
        {questions.length > 1 && (
          <div className="flex items-center justify-center gap-2 mb-6">
            {questions.map((_, idx) => (
              <div
                key={idx}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  idx < currentIndex ? `bg-${theme}-500` :
                  idx === currentIndex ? `bg-${theme}-500 scale-125 ring-4 ring-${theme}-100` :
                  'bg-slate-200'
                }`}
              />
            ))}
          </div>
        )}

        {!isComplete ? (
          <div className="bg-white rounded-[2rem] shadow-lg border border-slate-100 overflow-hidden">
            {/* Question header */}
            <div className={`bg-${theme}-50 px-5 md:px-8 py-5 border-b border-${theme}-100`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-${theme}-600 font-bold text-sm md:text-base`}>
                  {questions.length > 1 ? `السؤال ${toArabicNum(currentIndex + 1)} من ${toArabicNum(questions.length)}` : 'رتب العناصر التالية'}
                </span>
                {currentQuestion.hint && (
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm md:text-base font-bold transition-all active:scale-95 text-amber-500 md:hover:bg-amber-50"
                  >
                    <Lightbulb className="w-4 h-4 md:w-5 md:h-5" /> تلميح
                  </button>
                )}
              </div>
              <h3
                className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderFormattedText(currentQuestion.text, theme) }}
              />
              {showHint && (
                <div className="mt-3 smooth-expand">
                  <HintBox hint={currentQuestion.hint} />
                </div>
              )}
            </div>

            {/* Sortable items */}
            <div className="px-4 md:px-6 py-5 space-y-3" onTouchMove={handleTouchMove}>
              {items.map((item, idx) => (
                <div
                  key={`${item}-${idx}`}
                  ref={el => itemRefs.current[idx] = el}
                  draggable={!checked}
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, idx)}
                  onTouchStart={(e) => handleTouchStart(e, idx)}
                  onTouchEnd={(e) => handleTouchEnd(e, idx)}
                  className={`
                    flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-2xl transition-all duration-300 
                    ${getItemStyle(idx)}
                    ${!checked ? 'cursor-grab active:cursor-grabbing active:shadow-lg active:scale-[1.02]' : ''}
                    ${dragIndex === idx ? 'opacity-50 scale-95' : ''}
                  `}
                >
                  {/* Number badge */}
                  <div className={`shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center font-black text-base md:text-lg ${getNumberStyle(idx)}`}>
                    {toArabicNum(idx + 1)}
                  </div>

                  {/* Item text */}
                  <p className="flex-1 text-base md:text-lg font-medium leading-relaxed">{item}</p>

                  {/* Status icon (when checked) */}
                  {checked && (
                    <div className="shrink-0">
                      {correctPositions[idx] ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      ) : (
                        <XCircle className="w-6 h-6 text-rose-400" />
                      )}
                    </div>
                  )}

                  {/* Move arrows (when not checked) */}
                  {!checked && (
                    <div className="shrink-0 flex flex-col gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); moveItem(idx, -1); }}
                        disabled={idx === 0}
                        className={`p-1 rounded-lg transition-colors ${idx === 0 ? 'text-slate-200' : `text-slate-400 md:hover:text-${theme}-600 md:hover:bg-${theme}-50 active:scale-90`}`}
                      >
                        <ChevronUp className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); moveItem(idx, 1); }}
                        disabled={idx === items.length - 1}
                        className={`p-1 rounded-lg transition-colors ${idx === items.length - 1 ? 'text-slate-200' : `text-slate-400 md:hover:text-${theme}-600 md:hover:bg-${theme}-50 active:scale-90`}`}
                      >
                        <ChevronDown className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Action area */}
            <div className="px-4 md:px-6 pb-6 space-y-4">
              {/* Check / Correct / Wrong feedback */}
              {checked && isCorrect && (
                <div className="p-4 md:p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center smooth-expand">
                  <p className="text-emerald-700 text-lg md:text-xl font-bold mb-1">🎉 ترتيب صحيح!</p>
                  {currentQuestion.explanation && (
                    <p className="text-emerald-600 text-sm md:text-base leading-relaxed mt-2">
                      {currentQuestion.explanation}
                    </p>
                  )}
                </div>
              )}

              {checked && !isCorrect && (
                <div className="p-4 md:p-5 bg-orange-50 border border-orange-200 rounded-2xl text-center smooth-expand">
                  <p className="text-orange-700 text-lg md:text-xl font-bold mb-1">ترتيب غير مكتمل</p>
                  <p className="text-orange-600 text-sm md:text-base">
                    {correctPositions.filter(p => p).length} من {items.length} في الموضع الصحيح. حاول مرة أخرى!
                  </p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex items-center justify-center gap-3">
                {!checked && (
                  <button
                    onClick={handleCheck}
                    className={`flex-1 max-w-sm flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-lg md:text-xl text-white bg-${theme}-600 md:hover:bg-${theme}-700 shadow-md md:hover:shadow-lg transition-all active:scale-95`}
                  >
                    تحقق من الترتيب
                  </button>
                )}

                {checked && !isCorrect && (
                  <button
                    onClick={handleRetry}
                    className="flex-1 max-w-sm flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-lg md:text-xl text-white bg-orange-500 md:hover:bg-orange-600 shadow-md transition-all active:scale-95"
                  >
                    <RotateCcw className="w-5 h-5" /> حاول مرة أخرى
                  </button>
                )}

                {checked && isCorrect && currentIndex < questions.length - 1 && (
                  <button
                    onClick={handleNext}
                    className={`flex-1 max-w-sm flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-lg md:text-xl text-white bg-${theme}-600 md:hover:bg-${theme}-700 shadow-md transition-all active:scale-95`}
                  >
                    السؤال التالي <ArrowRight className="w-5 h-5 rotate-180" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Completion card */
          <div className="bg-white rounded-[2rem] shadow-lg border border-slate-100 p-8 md:p-10 text-center fade-in">
            <div className="text-2xl md:text-3xl font-bold text-slate-400 mb-3">النتيجة النهائية</div>
            <div className={`text-5xl md:text-6xl font-black text-${theme}-600 mb-3`}>
              {toArabicNum(progress.score)} / {toArabicNum(progress.total)}
            </div>
            <div className="text-xl md:text-2xl text-slate-400 font-bold italic">تم إتمام الترتيب بنجاح</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ordering;
