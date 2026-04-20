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

  const handleOptionClick = (qIdx, optIdx) => {
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

        // Parse Question text and replace "........" (3 or more dots) with blank
        const textSegments = q.text.split(/\.{3,}/);
        const maxOptLength = Math.max(...options.map(o => o.text.length));
        // Use ch unit relative to text size
        const blankStyle = { width: `${maxOptLength + 4}ch`, minWidth: '100px', maxWidth: '100%' };

        return (
          <div key={idx} className={`bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-200 mb-8 relative transition-colors duration-300 flex flex-col justify-start ${ringClass}`}>
              <div className="bg-slate-50 p-4 md:p-6 rounded-xl border border-slate-100 mb-6 w-full mx-auto">
                  <div className="flex items-center justify-between mb-4">
                      <span className={`text-${sectionData.theme}-600 font-bold text-lg md:text-xl`}>السؤال {toArabicNum(idx + 1)}</span>
                      <button onClick={() => toggleHint(idx)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-lg md:text-xl font-bold transition-all active:scale-95 text-amber-500 md:hover:bg-amber-50">
                        💡 تلميح
                      </button>
                  </div>
                  
                  <div className="text-2xl md:text-4xl font-semibold text-slate-800 leading-relaxed whitespace-pre-line text-right flex flex-wrap items-center gap-y-3 mt-4">
                      {textSegments.map((seg, sIdx) => (
                          <React.Fragment key={sIdx}>
                              <span className="leading-snug">{seg}</span>
                              {sIdx < textSegments.length - 1 && (
                                  <span 
                                      className={`inline-flex items-center justify-center align-middle mx-2 border-b-[3px] md:border-b-4 border-dashed rounded-lg transition-all duration-300 min-h-[2.5rem] md:min-h-[3.5rem] overflow-hidden ${answered ? (isSelectedCorrect ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-rose-500 bg-rose-50 text-rose-700') : 'border-slate-300 bg-slate-50'}`}
                                      style={blankStyle}
                                  >
                                      {answered && selectedOption && (
                                          <span className="fade-in font-bold text-[0.9em] w-full text-center whitespace-nowrap overflow-hidden text-ellipsis px-2">
                                              {selectedOption.text}
                                          </span>
                                      )}
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

              <div className="grid gap-3 mx-auto w-full max-w-2xl grid-cols-1 md:grid-cols-2 mt-2">
                  {options.map((opt, optIdx) => {
                      let btnClass = `w-full p-4 md:p-5 rounded-xl border-2 transition-all font-bold text-xl md:text-2xl flex items-center justify-center text-center `;
                      if (!answered) {
                          btnClass += `border-slate-200 bg-white text-slate-700 md:hover:border-${sectionData.theme}-300 md:hover:bg-${sectionData.theme}-50 active:scale-95 cursor-pointer shadow-sm md:hover:shadow-md`;
                      } else {
                          if (opt.isCorrect) btnClass += "bg-emerald-500 border-emerald-600 text-white shadow-md";
                          else if (selectedOption === opt) btnClass += "bg-rose-500 border-rose-600 text-white shadow-md";
                          else btnClass += "bg-white border-slate-200 text-slate-400 opacity-50";
                          btnClass += " cursor-default";
                      }
                      
                      return (
                          <button key={optIdx} disabled={answered} onClick={() => handleOptionClick(idx, optIdx)} className={btnClass}>
                              {opt.text}
                          </button>
                      );
                  })}
              </div>

              {answered && (
                  <div className="mt-8 smooth-expand w-full">
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
