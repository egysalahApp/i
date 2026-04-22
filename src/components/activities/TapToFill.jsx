import React, { useState, useEffect } from 'react';
import { ResultBox } from '../ui/ResultBox';
import { HintBox } from '../ui/HintBox';
import { FeedbackBox } from '../ui/FeedbackBox';
import { toArabicNum, shuffleArray } from '../../utils';

const TapToFill = ({ sectionData, progress, onUpdateProgress }) => {
  const [questions, setQuestions] = useState([]);
  const isComplete = progress.total > 0 && progress.answered === progress.total;

  useEffect(() => {
    setQuestions(sectionData.questions.map(q => {
      let opts = q.options.map((opt, oIdx) => ({ text: opt, isCorrect: oIdx === q.correct }));
      return {
        originalQuestion: q,
        options: shuffleArray(opts),
        answered: false,
        selectedOption: null,
        showHint: false,
        wrongAttempt: false
      };
    }));
  }, [sectionData.questions]);

  const handleOptionClick = (qIdx, optIdx, e) => {
    if (e) e.stopPropagation();
    const qState = questions[qIdx];
    if (qState.answered) return;

    const opt = qState.options[optIdx];
    const isCorrect = opt.isCorrect;

    const newQuestions = [...questions];
    newQuestions[qIdx] = {
      ...newQuestions[qIdx],
      answered: true,
      selectedOption: opt,
      wrongAttempt: !isCorrect
    };
    
    setQuestions(newQuestions);

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
        const { originalQuestion: q, options, answered, selectedOption, showHint, wrongAttempt } = qState;
        const isSelectedCorrect = selectedOption && selectedOption.isCorrect;
        
        let ringClass = answered ? (isSelectedCorrect ? 'ring-2 ring-emerald-400' : 'ring-2 ring-rose-400') : '';
        if (wrongAttempt) ringClass += ' shake ';

        const textSegments = q.text.split(/\.{3,}/);
        const maxOptLength = Math.max(...options.map(o => o.text.length));
        const blankStyle = { minWidth: `${Math.max(maxOptLength + 3, 11)}ch` };

        return (
          <div key={idx} className={`bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-200 mb-8 relative transition-colors duration-300 flex flex-col justify-start ${ringClass}`}>
              <div className="bg-slate-50 p-4 md:p-6 rounded-xl border border-slate-100 mb-2 w-full mx-auto">
                  <div className="flex items-center justify-between mb-4">
                      <span className={`text-${sectionData.theme}-600 font-bold text-lg md:text-xl`}>السؤال {toArabicNum(idx + 1)}</span>
                      <button onClick={() => toggleHint(idx)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-lg md:text-xl font-bold transition-all active:scale-95 text-amber-500 md:hover:bg-amber-50">
                        💡 تلميح
                      </button>
                  </div>
                  
                  <div className="text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-800 whitespace-pre-wrap text-right mt-6" style={{ lineHeight: '2.5' }}>
                      {textSegments.map((seg, sIdx) => (
                          <React.Fragment key={sIdx}>
                              <span className="align-middle">{seg}</span>
                              {sIdx < textSegments.length - 1 && (
                                  <span className="relative inline-block mx-2 align-middle z-10">
                                      <span 
                                          style={blankStyle}
                                          className={`inline-flex items-center justify-center border-2 md:border-[3px] rounded-xl transition-all duration-300 min-h-[2.5rem] md:min-h-[3.5rem] px-4 ${
                                            answered 
                                              ? (isSelectedCorrect ? 'border-emerald-500 bg-emerald-100 text-emerald-800 shadow-sm border-solid' : 'border-rose-500 bg-rose-100 text-rose-800 shadow-sm border-solid') 
                                              : `border-slate-400 bg-slate-100 border-dashed text-slate-700 shadow-inner`
                                          }`}
                                      >
                                          {answered && selectedOption ? (
                                              <span className="font-bold text-[1em] whitespace-nowrap animate-in fade-in zoom-in-75 duration-300">{selectedOption.text}</span>
                                          ) : (
                                              <span className="text-[0.75em] md:text-[0.85em] px-2 opacity-50 whitespace-nowrap flex items-center gap-1.5 tracking-[0.2em]">
                                                <span>......</span>
                                              </span>
                                          )}
                                      </span>
                                  </span>
                              )}
                          </React.Fragment>
                      ))}
                  </div>

                  {showHint && (
                      <div className="mt-6 smooth-expand">
                          <HintBox hintText={q.hint} />
                      </div>
                  )}
              </div>

              {/* Bottom Options Grid */}
              <div className="grid gap-3 md:gap-4 w-full grid-cols-1 md:grid-cols-3 mt-6">
                  {options.map((opt, optIdx) => {
                      let btnClass = `p-5 text-center rounded-2xl font-bold text-2xl md:text-3xl transition-all border-2 flex items-center justify-center leading-snug `;
                      if (!answered) {
                          btnClass += `border-slate-200 bg-white text-slate-700 shadow-sm md:hover:border-${sectionData.theme}-400 md:hover:bg-${sectionData.theme}-50 md:hover:text-${sectionData.theme}-700 md:hover:shadow-md cursor-pointer active:scale-95`;
                      } else {
                          if (opt.isCorrect) btnClass += "bg-emerald-500 border-emerald-600 text-white shadow-md scale-[1.02]";
                          else if (selectedOption === opt) btnClass += "bg-rose-500 border-rose-600 text-white shadow-md";
                          else btnClass += "bg-slate-50 border-slate-200 text-slate-400 opacity-50";
                          btnClass += " cursor-default";
                      }
                      
                      return (
                          <button key={optIdx} disabled={answered} onClick={(e) => handleOptionClick(idx, optIdx, e)} className={btnClass}>
                              {opt.text}
                          </button>
                      );
                  })}
              </div>

              {answered && (
                  <div className="mt-6 smooth-expand w-full">
                      <FeedbackBox isCorrect={isSelectedCorrect} explanation={q.explanation} />
                  </div>
              )}
          </div>
        );
      })}

      {isComplete && (
        <ResultBox title={sectionData.title} theme={sectionData.theme} score={progress.score} total={progress.total} />
      )}
    </div>
  );
};

export default TapToFill;
