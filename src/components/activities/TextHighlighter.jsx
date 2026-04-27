import React, { useState, useEffect, useMemo } from 'react';
import { ResultBox } from '../ui/ResultBox';
import { HintBox } from '../ui/HintBox';
import { toArabicNum, renderFormattedText } from '../../utils';
import { Lightbulb, ArrowRight, CheckCircle2, XCircle, Search } from 'lucide-react';
import { ACTIVITY_COLORS } from '../../constants/colorPalette';

const TextHighlighter = ({ sectionData, progress, onUpdateProgress }) => {
  const theme = sectionData.theme || 'indigo';
  const questions = sectionData.questions || [];
  const isComplete = progress.total > 0 && progress.answered === progress.total;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [selectedWords, setSelectedWords] = useState(new Set());
  const [checked, setChecked] = useState(false);
  const [firstAttempt, setFirstAttempt] = useState(true);
  const [animatingOut, setAnimatingOut] = useState(false);

  const currentQuestion = currentIndex < questions.length
    ? questions[currentIndex]
    : questions[questions.length - 1];

  // Parse the text into clickable words with their target status
  const wordItems = useMemo(() => {
    if (!currentQuestion) return [];
    const words = currentQuestion.words || [];
    return words.map((item, idx) => ({
      id: idx,
      text: typeof item === 'string' ? item : item.text,
      isTarget: typeof item === 'string' ? false : !!item.isTarget,
    }));
  }, [currentQuestion]);

  const targetCount = useMemo(() => wordItems.filter(w => w.isTarget).length, [wordItems]);

  // Reset when question changes
  useEffect(() => {
    setSelectedWords(new Set());
    setChecked(false);
    setFirstAttempt(true);
    setShowHint(false);
  }, [currentIndex]);

  const handleWordClick = (wordId) => {
    if (checked) return;
    setSelectedWords(prev => {
      const next = new Set(prev);
      if (next.has(wordId)) {
        next.delete(wordId);
      } else {
        next.add(wordId);
      }
      return next;
    });
  };

  const handleCheck = () => {
    if (selectedWords.size === 0) return;
    setChecked(true);

    // Calculate score: all targets selected AND no false positives
    const selectedTargets = wordItems.filter(w => w.isTarget && selectedWords.has(w.id));
    const falsePositives = wordItems.filter(w => !w.isTarget && selectedWords.has(w.id));
    const isCorrect = selectedTargets.length === targetCount && falsePositives.length === 0;

    if (isCorrect || !firstAttempt) {
      const newAnswered = progress.answered + 1;
      const newScore = progress.score + (isCorrect && firstAttempt ? 1 : (isCorrect ? 0.5 : 0));
      onUpdateProgress(sectionData.id, newAnswered, newScore);
    }
  };

  const handleRetry = () => {
    setSelectedWords(new Set());
    setChecked(false);
    setFirstAttempt(false);
  };

  const handleNext = () => {
    setAnimatingOut(true);
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setAnimatingOut(false);
    }, 400);
  };

  // Determine if the answer was fully correct
  const selectedTargets = wordItems.filter(w => w.isTarget && selectedWords.has(w.id));
  const falsePositives = wordItems.filter(w => !w.isTarget && selectedWords.has(w.id));
  const missedTargets = wordItems.filter(w => w.isTarget && !selectedWords.has(w.id));
  const isFullyCorrect = checked && selectedTargets.length === targetCount && falsePositives.length === 0;
  const isAnswered = checked && (isFullyCorrect || !firstAttempt);

  // Get word style
  const getWordStyle = (word) => {
    const isSelected = selectedWords.has(word.id);

    if (!checked) {
      // Before checking
      if (isSelected) {
        return `bg-${theme}-500 text-white shadow-md ring-2 ring-${theme}-300 scale-105`;
      }
      return `bg-white text-slate-700 md:hover:bg-${theme}-50 md:hover:text-${theme}-700 border-slate-200`;
    }

    // After checking
    if (word.isTarget && isSelected) {
      // Correct selection ✅
      return 'bg-emerald-500 text-white shadow-md ring-2 ring-emerald-300';
    }
    if (word.isTarget && !isSelected) {
      // Missed target ⚠️
      return 'bg-orange-100 text-orange-800 ring-2 ring-orange-300 border-dashed';
    }
    if (!word.isTarget && isSelected) {
      // Wrong selection ❌
      return 'bg-rose-100 text-rose-700 ring-2 ring-rose-300 line-through';
    }
    // Neutral
    return 'bg-white text-slate-500 border-slate-100';
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
        {/* Progress dots */}
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
            {/* Header */}
            <div className={`bg-${theme}-50 px-5 md:px-8 py-5 border-b border-${theme}-100`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-${theme}-600 font-bold text-sm md:text-base`}>
                  {questions.length > 1 ? `السؤال ${toArabicNum(currentIndex + 1)} من ${toArabicNum(questions.length)}` : 'البحث في النص'}
                </span>
                <div className="flex items-center gap-2">
                  {!checked && (
                    <span className={`text-xs md:text-sm font-bold px-3 py-1 rounded-full bg-${theme}-100 text-${theme}-600`}>
                      <Search className="w-3.5 h-3.5 inline ml-1" />
                      {toArabicNum(selectedWords.size)} / {toArabicNum(targetCount)}
                    </span>
                  )}
                  {currentQuestion?.hint && (
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm md:text-base font-bold transition-all active:scale-95 text-orange-500 md:hover:bg-orange-50"
                    >
                      <Lightbulb className="w-4 h-4 md:w-5 md:h-5" /> تلميح
                    </button>
                  )}
                </div>
              </div>
              <h3
                className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderFormattedText(currentQuestion?.text || '', theme) }}
              />
              {showHint && (
                <div className="mt-3 smooth-expand">
                  <HintBox hint={currentQuestion.hint} />
                </div>
              )}
            </div>

            {/* Text Area */}
            <div className="px-4 md:px-6 py-6">
              <div className="flex flex-wrap gap-2 md:gap-2.5 justify-center leading-[2.8] md:leading-[3]" dir="rtl">
                {wordItems.map((word) => (
                  <button
                    key={word.id}
                    onClick={() => handleWordClick(word.id)}
                    disabled={checked && isAnswered}
                    className={`px-3 py-1.5 md:px-4 md:py-2 rounded-xl border-2 font-bold text-base md:text-lg transition-all duration-200 cursor-pointer active:scale-95 ${getWordStyle(word)}`}
                  >
                    {word.text}
                    {checked && word.isTarget && selectedWords.has(word.id) && (
                      <CheckCircle2 className="w-4 h-4 inline mr-1 text-white" />
                    )}
                    {checked && !word.isTarget && selectedWords.has(word.id) && (
                      <XCircle className="w-4 h-4 inline mr-1 text-rose-600" />
                    )}
                  </button>
                ))}
              </div>

              {/* Legend after check */}
              {checked && (
                <div className="flex justify-center gap-4 md:gap-6 mt-5 text-xs md:text-sm font-medium smooth-expand">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-emerald-500" />
                    <span className="text-slate-500">إجابة صحيحة</span>
                  </div>
                  {missedTargets.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-orange-300 border border-dashed border-orange-500" />
                      <span className="text-slate-500">فاتتك</span>
                    </div>
                  )}
                  {falsePositives.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-rose-200" />
                      <span className="text-slate-500">اختيار خاطئ</span>
                    </div>
                  )}
                </div>
              )}

              {/* Result summary */}
              {checked && (
                <div className={`mt-5 p-4 md:p-5 rounded-xl smooth-expand ${
                  isFullyCorrect 
                    ? 'bg-emerald-50 border border-emerald-200' 
                    : 'bg-rose-50 border border-rose-200'
                }`}>
                  <div className={`flex items-center gap-2 mb-2 font-bold text-lg ${
                    isFullyCorrect ? 'text-emerald-700' : 'text-rose-700'
                  }`}>
                    {isFullyCorrect ? (
                      <><CheckCircle2 className="w-5 h-5" /> إجابة صحيحة! 🎉</>
                    ) : (
                      <><XCircle className="w-5 h-5" /> 
                        وجدت {toArabicNum(selectedTargets.length)} من {toArabicNum(targetCount)}
                        {falsePositives.length > 0 && ` مع ${toArabicNum(falsePositives.length)} اختيار خاطئ`}
                      </>
                    )}
                  </div>
                  {currentQuestion?.explanation && (
                    <p className={`text-base md:text-lg leading-relaxed ${isFullyCorrect ? 'text-emerald-800' : 'text-rose-800'}`}>
                      {currentQuestion.explanation}
                    </p>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex justify-center gap-3 mt-6">
                {!checked && (
                  <button
                    onClick={handleCheck}
                    disabled={selectedWords.size === 0}
                    className={`flex-1 max-w-sm py-4 rounded-2xl font-bold text-lg md:text-xl text-white transition-all active:scale-95 ${
                      selectedWords.size === 0
                        ? 'bg-slate-300 cursor-not-allowed'
                        : `bg-${theme}-600 md:hover:bg-${theme}-700 shadow-md`
                    }`}
                  >
                    تحقق
                  </button>
                )}

                {checked && !isFullyCorrect && firstAttempt && (
                  <button
                    onClick={handleRetry}
                    className="flex-1 max-w-sm py-4 rounded-2xl font-bold text-lg md:text-xl text-white bg-orange-500 md:hover:bg-orange-600 shadow-md transition-all active:scale-95"
                  >
                    حاول مرة أخرى
                  </button>
                )}

                {isAnswered && currentIndex < questions.length - 1 && (
                  <button
                    onClick={handleNext}
                    className={`flex-1 max-w-sm flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-lg md:text-xl text-white bg-${theme}-600 md:hover:bg-${theme}-700 shadow-md transition-all active:scale-95`}
                  >
                    السؤال التالي <ArrowRight className="w-5 h-5 rotate-180" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <ResultBox
            title={sectionData.title}
            theme={theme}
            score={progress.score}
            total={progress.total}
          />
        )}
      </div>
    </div>
  );
};

export default TextHighlighter;
