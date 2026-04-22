import React, { useState, useEffect } from 'react';
import { ResultBox } from '../ui/ResultBox';
import { HintBox } from '../ui/HintBox';
import { FeedbackBox } from '../ui/FeedbackBox';
import { toArabicNum, shuffleArray } from '../../utils';
import { CheckCircle, XCircle } from 'lucide-react';

const ErrorCorrection = ({ sectionData, progress, onUpdateProgress }) => {
  const [questions, setQuestions] = useState([]);
  const isComplete = progress.total > 0 && progress.answered === progress.total;

  useEffect(() => {
    setQuestions(sectionData.questions.map(q => {
      let opts = q.options.map((opt, oIdx) => ({ text: opt, isCorrect: oIdx === (q.correctOptionIndex ?? q.correct) }));
      return {
        originalQuestion: q,
        options: shuffleArray(opts),
        step: 1,
        selectedWordIndex: null,
        selectedOption: null,
        showHint: false,
        shakeWordIndex: null,
        wrongAttempt: false
      };
    }));
  }, [sectionData.questions]);

  const handleWordClick = (qIdx, wIdx) => {
    const qState = questions[qIdx];
    if (qState.step !== 1) return;

    const q = qState.originalQuestion;
    const isTarget = wIdx === (q.errorWordIndex ?? q.targetIndex);

    if (isTarget) {
      const newQuestions = [...questions];
      newQuestions[qIdx] = {
        ...newQuestions[qIdx],
        selectedWordIndex: wIdx,
        step: 2,
        shakeWordIndex: null
      };
      setQuestions(newQuestions);
    } else {
      const newQuestions = [...questions];
      newQuestions[qIdx].shakeWordIndex = wIdx;
      setQuestions(newQuestions);
      setTimeout(() => {
        setQuestions(prev => {
          const reset = [...prev];
          if (reset[qIdx]) reset[qIdx].shakeWordIndex = null;
          return reset;
        });
      }, 500);
    }
  };

  const handleOptionClick = (qIdx, optIdx) => {
    const qState = questions[qIdx];
    if (qState.step !== 2) return;

    const opt = qState.options[optIdx];
    const newQuestions = [...questions];
    newQuestions[qIdx] = {
      ...newQuestions[qIdx],
      step: 3,
      selectedOption: opt,
      wrongAttempt: !opt.isCorrect
    };
    
    setQuestions(newQuestions);

    const isCorrect = opt.isCorrect;
    const newAnswered = progress.answered + 1;
    const newScore = progress.score + (isCorrect ? 1 : 0);
    onUpdateProgress(sectionData.id, newAnswered, newScore);
    
    if (!isCorrect) {
        setTimeout(() => {
            setQuestions(prev => {
                const reset = [...prev];
                if (reset[qIdx]) reset[qIdx].wrongAttempt = false;
                return reset;
            });
        }, 500);
    }
  };

  const toggleHint = (qIdx) => {
    const newQuestions = [...questions];
    newQuestions[qIdx].showHint = !newQuestions[qIdx].showHint;
    setQuestions(newQuestions);
  };

  return (
    <div className="fade-in">
      {sectionData.description && (
        <div className="text-center mb-8">
          <p className={`text-lg md:text-xl text-${sectionData.theme}-800 font-semibold bg-${sectionData.theme}-50 bg-opacity-60 p-4 md:p-5 rounded-2xl shadow-sm inline-block w-full`}>
            {sectionData.description}
          </p>
        </div>
      )}

      {questions.map((qState, idx) => {
        const { originalQuestion: q, step, selectedWordIndex, selectedOption, showHint, shakeWordIndex, wrongAttempt, options } = qState;
        const isStep3 = step === 3;
        const isSelectedCorrect = selectedOption && selectedOption.isCorrect;
        
        let ringClass = isStep3 ? (isSelectedCorrect ? 'ring-2 ring-emerald-400' : 'ring-2 ring-rose-400') : '';
        if (wrongAttempt && isStep3) ringClass += ' shake ';

        return (
          <div key={idx} className={`bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-200 mb-8 relative transition-colors duration-300 flex flex-col justify-start ${ringClass}`}>
              <div className="bg-slate-50 p-4 md:p-6 rounded-xl border border-slate-100 mb-6 w-full mx-auto">
                  <div className="flex items-center justify-between mb-4">
                      <span className={`text-${sectionData.theme}-600 font-bold text-lg md:text-xl`}>السؤال {toArabicNum(idx + 1)}</span>
                      <button onClick={() => toggleHint(idx)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-lg md:text-xl font-bold transition-all active:scale-95 text-amber-500 md:hover:bg-amber-50">
                        💡 تلميح
                      </button>
                  </div>
                  {showHint && (
                      <div className="mt-4 smooth-expand">
                          <HintBox hintText={q.hint} />
                      </div>
                  )}
              </div>
              
              <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4 leading-loose mx-auto w-full max-w-2xl" dir="rtl">
                  {q.words.map((word, wIdx) => {
                    const isTarget = wIdx === (q.errorWordIndex ?? q.targetIndex);
                    const isSelected = selectedWordIndex === wIdx;
                    const isShaking = shakeWordIndex === wIdx;

                    let wordClass = "px-4 md:px-6 py-3 md:py-4 text-2xl md:text-3xl font-bold rounded-xl transition-all duration-300 select-none border-2 ";
                    
                    if (step === 1) {
                        wordClass += `bg-white border-slate-200 text-slate-700 md:hover:border-${sectionData.theme}-300 md:hover:bg-${sectionData.theme}-50 md:hover:-translate-y-1 md:hover:shadow-md active:scale-95 cursor-pointer `;
                        if (isShaking) wordClass += "bg-orange-100 border-orange-400 text-orange-700 shake ";
                    } else {
                        if (isSelected) {
                            if (isStep3) {
                                wordClass += isSelectedCorrect ? "bg-emerald-500 text-white border-emerald-600 " : "bg-rose-500 text-white border-rose-600 ";
                            } else {
                                wordClass += "bg-rose-500 text-white border-rose-600 ";
                            }
                        } else {
                            wordClass += "bg-white border-slate-200 text-slate-700 cursor-default ";
                        }
                    }

                    return (
                      <button key={wIdx} disabled={step !== 1} onClick={() => handleWordClick(idx, wIdx)} className={wordClass}>
                        {isSelected && isStep3 && selectedOption ? selectedOption.text : word}
                      </button>
                    );
                  })}
              </div>

              {step >= 2 && (
                  <div className="smooth-expand w-full">
                      <div className="mt-8 mb-4 text-center font-bold text-xl text-slate-600">اختر التصويب الصحيح:</div>
                      <div className="grid gap-3 grid-cols-1 md:grid-cols-3 w-full">
                          {options.map((opt, optIdx) => {
                              let btnClass = `p-4 rounded-xl border-2 transition-all font-bold text-2xl md:text-3xl flex items-center justify-center gap-2 `;
                              if (step === 2) { 
                                  btnClass += `border-slate-200 bg-white text-slate-600 md:hover:bg-slate-50 active:scale-95 cursor-pointer`; 
                              } else { 
                                  if (opt.isCorrect) btnClass += "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm"; 
                                  else if (selectedOption === opt) btnClass += "bg-rose-50 border-rose-500 text-rose-800 shadow-sm"; 
                                  else btnClass += "bg-slate-50 border-slate-100 text-slate-400 opacity-50"; 
                                  btnClass += " cursor-default"; 
                              }
                              
                              return (
                                  <button key={optIdx} disabled={step === 3} onClick={() => handleOptionClick(idx, optIdx)} className={btnClass}>
                                      {opt.text}
                                      {step === 3 && opt.isCorrect && <CheckCircle className="w-6 h-6 text-emerald-600" />}
                                      {step === 3 && selectedOption === opt && !opt.isCorrect && <XCircle className="w-6 h-6 text-rose-600" />}
                                  </button>
                              );
                          })}
                      </div>
                  </div>
              )}

              {isStep3 && (
                  <div className="mt-6 smooth-expand w-full">
                      <FeedbackBox isCorrect={isSelectedCorrect} explanation={q.explanation} />
                  </div>
              )}
          </div>
        )
      })}

      {isComplete && (
        <ResultBox title={sectionData.title} theme={sectionData.theme} score={progress.score} total={progress.total} />
      )}
    </div>
  );
};

export default ErrorCorrection;
