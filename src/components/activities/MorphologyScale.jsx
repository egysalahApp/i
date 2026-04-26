import React, { useState, useEffect } from 'react';
import { ResultBox } from '../ui/ResultBox';
import { HintBox } from '../ui/HintBox';
import { toArabicNum, renderFormattedText } from '../../utils';
import { Lightbulb, ArrowRight, CheckCircle2, XCircle, Volume2 } from 'lucide-react';

const MorphologyScale = ({ sectionData, progress, onUpdateProgress }) => {
  const theme = sectionData.theme || 'indigo';
  const questions = sectionData.questions || [];
  const isComplete = progress.total > 0 && progress.answered === progress.total;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [wrongAttempt, setWrongAttempt] = useState(false);
  const [firstAttempt, setFirstAttempt] = useState(true);
  const [animatingOut, setAnimatingOut] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const currentQuestion = currentIndex < questions.length
    ? questions[currentIndex]
    : questions[questions.length - 1];

  // Reset when question changes
  useEffect(() => {
    setSelectedOption(null);
    setAnswered(false);
    setWrongAttempt(false);
    setFirstAttempt(true);
    setShowHint(false);
    setShowBreakdown(false);
  }, [currentIndex]);

  // Show breakdown with a slight delay for dramatic effect
  useEffect(() => {
    if (answered && selectedOption === currentQuestion?.correct) {
      const timer = setTimeout(() => setShowBreakdown(true), 600);
      return () => clearTimeout(timer);
    }
  }, [answered, selectedOption]);

  const handleAnswer = (optIdx) => {
    if (answered) return;
    setSelectedOption(optIdx);
    const isCorrect = optIdx === currentQuestion.correct;
    setAnswered(true);

    if (isCorrect) {
      const newAnswered = progress.answered + 1;
      const newScore = progress.score + (firstAttempt ? 1 : 0);
      onUpdateProgress(sectionData.id, newAnswered, newScore);
    } else {
      setWrongAttempt(true);
      // Auto-reset after wrong answer
      setTimeout(() => {
        setSelectedOption(null);
        setAnswered(false);
        setWrongAttempt(false);
        setFirstAttempt(false);
      }, 1800);
    }
  };

  const handleNext = () => {
    setAnimatingOut(true);
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setAnimatingOut(false);
    }, 400);
  };

  // Pronounce the word using browser TTS
  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // Build the letter-by-letter breakdown
  const getBreakdown = () => {
    if (!currentQuestion) return [];
    const word = currentQuestion.word?.replace(/[\u064B-\u065F\u0670]/g, '') || ''; // strip tashkeel for letter count
    const pattern = currentQuestion.pattern?.replace(/[\u064B-\u065F\u0670]/g, '') || '';
    const rootLetters = ['ف', 'ع', 'ل'];
    
    const maxLen = Math.max(word.length, pattern.length);
    const breakdown = [];
    
    for (let i = 0; i < maxLen; i++) {
      const wChar = word[i] || '';
      const pChar = pattern[i] || '';
      const isRoot = rootLetters.includes(pChar);
      breakdown.push({ wordLetter: wChar, patternLetter: pChar, isRoot });
    }
    return breakdown;
  };

  const isCorrect = answered && selectedOption === currentQuestion?.correct;

  // Option colors
  const optionPalette = ['sky', 'emerald', 'amber', 'violet', 'rose', 'blue', 'orange', 'indigo'];

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
                  {questions.length > 1 ? `السؤال ${toArabicNum(currentIndex + 1)} من ${toArabicNum(questions.length)}` : 'الميزان الصرفي'}
                </span>
                {currentQuestion?.hint && (
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
                dangerouslySetInnerHTML={{ __html: renderFormattedText(currentQuestion?.text || '', theme) }}
              />
              {showHint && (
                <div className="mt-3 smooth-expand">
                  <HintBox hint={currentQuestion.hint} />
                </div>
              )}
            </div>

            <div className="px-4 md:px-6 py-6">
              {/* Word Display Card */}
              <div className={`relative text-center p-8 md:p-10 rounded-2xl mb-6 border-2 transition-all duration-500 ${
                isCorrect 
                  ? 'bg-emerald-50/50 border-emerald-200' 
                  : `bg-gradient-to-br from-${theme}-50 to-white border-${theme}-200`
              }`}>
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-4xl md:text-5xl font-black text-slate-800 tracking-wider">
                    {currentQuestion?.word}
                  </span>
                  <button
                    onClick={() => handleSpeak(currentQuestion?.word)}
                    className={`p-2 rounded-full transition-all active:scale-90 text-${theme}-400 md:hover:text-${theme}-600 md:hover:bg-${theme}-100`}
                    title="استمع للنطق"
                  >
                    <Volume2 className="w-6 h-6" />
                  </button>
                </div>
                {currentQuestion?.root && (
                  <p className="text-base md:text-lg text-slate-400 font-medium">
                    الجذر: <span className={`font-bold text-${theme}-600`}>{currentQuestion.root}</span>
                  </p>
                )}
              </div>

              {/* Letter-by-letter Breakdown (appears after correct answer) */}
              {showBreakdown && (
                <div className="mb-6 smooth-expand">
                  <div className="bg-slate-50 rounded-2xl p-5 md:p-6 border border-slate-200">
                    <h4 className="text-center text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest">تحليل الميزان</h4>
                    
                    {/* Scale visualization */}
                    <div className="flex justify-center gap-1 md:gap-2 mb-2">
                      {getBreakdown().map((item, i) => (
                        <div key={`w-${i}`} className="flex flex-col items-center gap-2">
                          {/* Word letter */}
                          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center font-black text-lg md:text-xl border-2 transition-all duration-500 ${
                            item.isRoot
                              ? `bg-${theme}-500 border-${theme}-600 text-white`
                              : 'bg-slate-200 border-slate-300 text-slate-600'
                          }`}>
                            {item.wordLetter}
                          </div>
                          
                          {/* Connector */}
                          <div className={`w-0.5 h-4 ${item.isRoot ? `bg-${theme}-300` : 'bg-slate-200'}`} />
                          
                          {/* Pattern letter */}
                          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center font-bold text-lg md:text-xl border-2 ${
                            item.isRoot
                              ? `bg-${theme}-100 border-${theme}-300 text-${theme}-700`
                              : 'bg-white border-slate-200 text-slate-400'
                          }`}>
                            {item.patternLetter}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center gap-6 mt-4 text-xs md:text-sm font-medium">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-3 h-3 rounded bg-${theme}-500`} />
                        <span className="text-slate-500">حروف أصلية (جذر)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded bg-slate-200" />
                        <span className="text-slate-500">حروف زائدة</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Options */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {(currentQuestion?.options || []).map((option, optIdx) => {
                  const optColor = optionPalette[optIdx % optionPalette.length];
                  let optionClass = '';

                  if (!answered) {
                    optionClass = `bg-${optColor}-500 border-${optColor}-600 text-white md:hover:bg-${optColor}-600 shadow-md md:hover:shadow-lg`;
                  } else if (optIdx === currentQuestion.correct) {
                    optionClass = 'bg-emerald-500 border-emerald-600 text-white shadow-md ring-4 ring-emerald-200';
                  } else if (optIdx === selectedOption && wrongAttempt) {
                    optionClass = 'bg-rose-500 border-rose-600 text-white shadow-md animate-shake';
                  } else {
                    optionClass = 'bg-slate-100 border-slate-200 text-slate-400';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleAnswer(optIdx)}
                      disabled={answered}
                      className={`p-4 md:p-5 rounded-2xl border-2 font-bold text-xl md:text-2xl transition-all duration-300 active:scale-95 ${optionClass}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {isCorrect && currentQuestion?.explanation && (
                <div className="mt-4 p-4 md:p-5 rounded-xl bg-emerald-50 border border-emerald-200 smooth-expand">
                  <div className="flex items-center gap-2 mb-2 text-emerald-700 font-bold text-lg">
                    <CheckCircle2 className="w-5 h-5" /> إجابة صحيحة! 🎉
                  </div>
                  <p className="text-emerald-800 text-base md:text-lg leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}

              {/* Next button */}
              {isCorrect && currentIndex < questions.length - 1 && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleNext}
                    className={`flex-1 max-w-sm flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-lg md:text-xl text-white bg-${theme}-600 md:hover:bg-${theme}-700 shadow-md transition-all active:scale-95`}
                  >
                    السؤال التالي <ArrowRight className="w-5 h-5 rotate-180" />
                  </button>
                </div>
              )}
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

export default MorphologyScale;
