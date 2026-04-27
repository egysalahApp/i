import React, { useState, useEffect } from 'react';
import { ResultBox } from '../ui/ResultBox';
import { HintBox } from '../ui/HintBox';
import { FeedbackBox } from '../ui/FeedbackBox';
import { toArabicNum, renderFormattedText } from '../../utils';
import { Lightbulb, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

const SentenceBuilder = ({ sectionData, progress, onUpdateProgress }) => {
  const theme = sectionData.theme || 'indigo';
  const isWordMode = sectionData.type === 'word_builder';
  const questions = sectionData.questions || [];
  const isComplete = progress.total > 0 && progress.answered === progress.total;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [firstAttempt, setFirstAttempt] = useState(true);
  const [animatingOut, setAnimatingOut] = useState(false);

  const currentQuestion = currentIndex < questions.length ? questions[currentIndex] : questions[questions.length - 1];

  // Shuffle fragments for the bank
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

  // selected = fragments the user tapped (in order)
  // bank = remaining fragments available to tap
  const [selected, setSelected] = useState([]);
  const [bank, setBank] = useState(() => shuffleArray(currentQuestion?.fragments || []));

  // Reset when question changes
  useEffect(() => {
    if (currentIndex < questions.length) {
      setSelected([]);
      setBank(shuffleArray(questions[currentIndex]?.fragments || []));
      setChecked(false);
      setIsCorrect(false);
      setFirstAttempt(true);
      setShowHint(false);
    }
  }, [currentIndex]);

  // Tap a fragment in the bank → move it to selected
  const handleSelectFragment = (index) => {
    if (checked) return;
    const fragment = bank[index];
    setBank(prev => prev.filter((_, i) => i !== index));
    setSelected(prev => [...prev, fragment]);
  };

  // Tap a fragment in the selected zone → return it to bank
  const handleDeselectFragment = (index) => {
    if (checked) return;
    const fragment = selected[index];
    setSelected(prev => prev.filter((_, i) => i !== index));
    setBank(prev => [...prev, fragment]);
  };

  const handleCheck = () => {
    const correctOrder = currentQuestion.correctOrder;
    const userOrder = selected;
    const allCorrect = correctOrder.length === userOrder.length && 
      correctOrder.every((item, idx) => item === userOrder[idx]);
    
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
    // Return all selected back to bank (shuffled)
    const allFragments = [...selected, ...bank];
    setSelected([]);
    setBank(shuffleArray(allFragments));
  };

  const handleNext = () => {
    setAnimatingOut(true);
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setAnimatingOut(false);
    }, 400);
  };

  // Chip styles — each fragment gets a unique color based on its original index
  const fragmentColors = (currentQuestion?.fragments || []).map((_, i) => {
    const palette = ['sky', 'indigo', 'emerald', 'orange', 'violet', 'blue', 'rose', 'orange'];
    return palette[i % palette.length];
  });

  const getFragmentColor = (fragment) => {
    const idx = (currentQuestion?.fragments || []).indexOf(fragment);
    return fragmentColors[idx >= 0 ? idx : 0];
  };

  const getBankChipStyle = (fragment) => {
    const c = getFragmentColor(fragment);
    return `bg-${c}-500 border-2 border-${c}-600 text-white md:hover:bg-${c}-600 active:scale-95 cursor-pointer shadow-md md:hover:shadow-lg`;
  };

  const getSelectedChipStyle = (idx, fragment) => {
    if (!checked) {
      const c = getFragmentColor(fragment);
      return `bg-${c}-100 border-2 border-${c}-300 text-${c}-800 md:hover:bg-rose-50 md:hover:border-rose-300 active:scale-95 cursor-pointer shadow-sm`;
    }
    const correctOrder = currentQuestion.correctOrder;
    if (selected[idx] === correctOrder[idx]) {
      return `bg-emerald-50 border-2 border-emerald-400 text-emerald-800`;
    }
    return `bg-rose-50 border-2 border-rose-300 text-rose-800`;
  };

  const chipSize = isWordMode
    ? 'px-4 py-2.5 text-xl md:text-2xl rounded-xl min-w-[3rem]'
    : 'px-4 py-3 text-base md:text-lg rounded-2xl';

  return (
    <div className="max-w-3xl mx-auto pb-6 min-h-[500px]">
      {sectionData.description && (
        <div className="text-center mb-8 fade-in">
          <p className={`text-lg md:text-xl text-slate-700 font-medium bg-${theme}-50/40 border border-${theme}-100 p-4 md:p-5 rounded-2xl shadow-sm inline-block w-full leading-relaxed`}>
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
                  {questions.length > 1 ? `السؤال ${toArabicNum(currentIndex + 1)} من ${toArabicNum(questions.length)}` : (isWordMode ? 'كوّن الكلمة' : 'كوّن الجملة')}
                </span>
                {currentQuestion?.hint && (
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm md:text-base font-bold transition-all active:scale-95 text-orange-500 md:hover:bg-orange-50"
                  >
                    <Lightbulb className="w-4 h-4 md:w-5 md:h-5" /> تلميح
                  </button>
                )}
              </div>
              <h3
                className="text-xl md:text-2xl font-medium leading-[2.8] md:leading-[3] text-slate-800"
                dangerouslySetInnerHTML={{ __html: renderFormattedText(currentQuestion?.text || '', theme) }}
              />
              {showHint && (
                <div className="mt-3 smooth-expand">
                  <HintBox hint={currentQuestion.hint} />
                </div>
              )}
            </div>

            <div className="px-4 md:px-6 py-5">
              {/* Build Zone */}
              <div className={`min-h-[80px] md:min-h-[100px] p-4 md:p-5 rounded-2xl border-2 border-dashed mb-6 transition-colors duration-300 ${
                selected.length === 0 
                  ? 'border-slate-200 bg-slate-50' 
                  : checked 
                    ? (isCorrect ? 'border-emerald-300 bg-emerald-50/30' : 'border-rose-300 bg-rose-50/30')
                    : `border-${theme}-200 bg-${theme}-50/30`
              }`}>
                <div className="flex items-center justify-center gap-1 text-sm text-slate-400 mb-3">
                  {selected.length === 0 && (
                    <span>{isWordMode ? 'انقر على الحروف بالترتيب الصحيح' : 'انقر على الكلمات بالترتيب الصحيح'}</span>
                  )}
                </div>
                <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                  {selected.map((fragment, idx) => (
                    <button
                      key={`selected-${idx}-${fragment}`}
                      onClick={() => handleDeselectFragment(idx)}
                      disabled={checked}
                      className={`${chipSize} font-bold transition-all duration-200 ${getSelectedChipStyle(idx, fragment)}`}
                    >
                      {fragment}
                      {checked && (
                        <span className="inline-block mr-1">
                          {currentQuestion.correctOrder[idx] === fragment 
                            ? <CheckCircle2 className="w-4 h-4 inline text-emerald-500" /> 
                            : <XCircle className="w-4 h-4 inline text-rose-400" />
                          }
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fragment Bank */}
              <div className="mb-5">
                <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                  {bank.map((fragment, idx) => (
                    <button
                      key={`bank-${idx}-${fragment}`}
                      onClick={() => handleSelectFragment(idx)}
                      disabled={checked}
                      className={`${chipSize} font-bold transition-all duration-200 ${getBankChipStyle(fragment)}`}
                    >
                      {fragment}
                    </button>
                  ))}
                </div>
                {bank.length === 0 && !checked && (
                  <p className={`text-center text-${theme}-500 font-medium text-sm mt-3`}>
                    تم اختيار جميع {isWordMode ? 'الحروف' : 'الكلمات'}. اضغط «تحقق» أو انقر على أي {isWordMode ? 'حرف' : 'كلمة'} لإعادتها.
                  </p>
                )}
              </div>

              {/* Feedback */}
              {checked && (
                <div className="smooth-expand">
                  <FeedbackBox
                    isCorrect={isCorrect}
                    explanation={currentQuestion.explanation}
                    correctLabel="ترتيب صحيح! 🎉"
                    incorrectLabel={`الترتيب الصحيح: ${currentQuestion.correctOrder.join(isWordMode ? '' : ' ')}`}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3 mt-6">
                {!checked && (
                  <button
                    onClick={handleCheck}
                    disabled={selected.length !== (currentQuestion?.fragments?.length || 0)}
                    className={`flex-1 max-w-sm flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-lg md:text-xl text-white transition-all active:scale-95 ${
                      selected.length === (currentQuestion?.fragments?.length || 0)
                        ? `bg-${theme}-600 md:hover:bg-${theme}-700 shadow-md md:hover:shadow-lg`
                        : 'bg-slate-300 cursor-not-allowed'
                    }`}
                  >
                    تحقق
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

export default SentenceBuilder;
