import React, { useState, useEffect } from 'react';
import { ResultBox } from '../ui/ResultBox';
import { HintBox } from '../ui/HintBox';
import { FeedbackBox } from '../ui/FeedbackBox';
import { toArabicNum } from '../../utils';

const Spotting = ({ sectionData, progress, onUpdateProgress }) => {
  const isComplete = progress.total > 0 && progress.answered === progress.total;

  const [questions, setQuestions] = useState(() => {
    return (sectionData.questions || []).map(q => ({
      originalQuestion: q,
      answered: false,
      selectedWordIndex: null,
      showHint: false,
      shakeWordIndex: null
    }));
  });

  const handleWordClick = (qIdx, wIdx) => {
    const qState = questions[qIdx];
    if (qState.answered) return;

    const q = qState.originalQuestion;
    const isTarget = q.targetIndices ? q.targetIndices.includes(wIdx) : q.targetIndex === wIdx;

    if (isTarget) {
      const newQuestions = [...questions];
      newQuestions[qIdx] = {
        ...newQuestions[qIdx],
        answered: true,
        selectedWordIndex: wIdx,
        shakeWordIndex: null
      };
      setQuestions(newQuestions);
      
      onUpdateProgress(sectionData.id, progress.answered + 1, progress.score + 1);
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
        const { originalQuestion: q, answered, selectedWordIndex, showHint, shakeWordIndex } = qState;
        const ringClass = answered ? 'ring-2 ring-emerald-400' : '';

        return (
          <div key={idx} className={`bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-200 mb-8 relative transition-colors duration-300 flex flex-col justify-start ${ringClass}`}>
              <div className="bg-slate-50 p-4 md:p-6 rounded-xl border border-slate-100 mb-6 w-full mx-auto">
                  <div className="flex items-center justify-between mb-2">
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
                    const isTarget = q.targetIndices ? q.targetIndices.includes(wIdx) : q.targetIndex === wIdx;
                    const isSelectedCorrect = answered && isTarget;
                    const isShaking = shakeWordIndex === wIdx;

                    let wordClass = "px-4 md:px-6 py-3 md:py-4 text-2xl md:text-3xl font-normal rounded-xl transition-all duration-300 select-none ";
                    if (!answered) {
                        wordClass += `bg-white border-2 border-slate-200 text-slate-700 md:hover:border-${sectionData.theme}-300 md:hover:bg-${sectionData.theme}-50 md:hover:-translate-y-1 md:hover:shadow-md active:scale-95 cursor-pointer `;
                        if (isShaking) wordClass += "bg-rose-100 border-rose-400 text-rose-700 shake ";
                    } else {
                        if (isSelectedCorrect) wordClass += `bg-emerald-500 text-white border-2 border-emerald-600 shadow-md cursor-default `;
                        else wordClass += "bg-white border-2 border-slate-200 text-slate-700 cursor-default ";
                    }

                    return (
                      <button key={wIdx} disabled={answered} onClick={() => handleWordClick(idx, wIdx)} className={wordClass}>
                        {word}
                      </button>
                    );
                  })}
              </div>

              {answered && (
                  <div className="mt-6 smooth-expand w-full">
                      <FeedbackBox isCorrect={true} explanation={q.explanation} />
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

export default Spotting;
