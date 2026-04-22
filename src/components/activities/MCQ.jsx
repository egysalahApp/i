import React, { useState, useEffect } from 'react';
import { ResultBox } from '../ui/ResultBox';
import { HintBox } from '../ui/HintBox';
import { FeedbackBox } from '../ui/FeedbackBox';
import { toArabicNum, shuffleArray } from '../../utils';

const MCQ = ({ sectionData, progress, onUpdateProgress }) => {
  const [questions, setQuestions] = useState([]);
  const isComplete = progress.total > 0 && progress.answered === progress.total;

  useEffect(() => {
    // Initialize if empty
    setQuestions(sectionData.questions.map(q => {
      let opts = q.options.map((opt, oIdx) => ({ text: opt, isCorrect: oIdx === q.correct }));
      
      let isTF = false;
      if (opts.length === 2 && opts.some(o => ['صواب', 'صح'].includes(o.text.trim())) && opts.some(o => ['خطأ'].includes(o.text.trim()))) {
        isTF = true;
        opts.sort((a, b) => {
          if (['صواب', 'صح'].includes(a.text.trim())) return -1;
          if (['صواب', 'صح'].includes(b.text.trim())) return 1;
          return 0;
        });
      } else {
        opts = shuffleArray(opts);
      }

      return {
        originalQuestion: q,
        options: opts,
        isTF: isTF,
        answered: false,
        selectedOption: null,
        showHint: false,
        wrongAttempt: false
      };
    }));
  }, [sectionData.questions]);

  const handleAnswer = (qIdx, optIdx) => {
    const qState = questions[qIdx];
    if (qState.answered) return;

    const opt = qState.options[optIdx];
    const newQuestions = [...questions];
    newQuestions[qIdx] = {
      ...newQuestions[qIdx],
      answered: true,
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
        const { originalQuestion: q, options, isTF, answered, selectedOption, showHint, wrongAttempt } = qState;
        const isSelectedCorrect = selectedOption && selectedOption.isCorrect;
        let ringClass = answered ? (isSelectedCorrect ? 'ring-2 ring-emerald-400' : 'ring-2 ring-rose-400') : '';
        if (wrongAttempt) ringClass += ' shake ';

        return (
          <div key={idx} className={`bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-200 mb-8 relative transition-colors duration-300 flex flex-col justify-start ${ringClass}`}>
              <div className="bg-slate-50 p-4 md:p-6 rounded-xl border border-slate-100 mb-6 w-full mx-auto">
                  <div className="flex items-center justify-between mb-4">
                      <span className={`text-${sectionData.theme}-600 font-bold text-lg md:text-xl`}>السؤال {toArabicNum(idx + 1)}</span>
                      <button onClick={() => toggleHint(idx)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-lg md:text-xl font-bold transition-all active:scale-95 text-amber-500 md:hover:bg-amber-50">
                        💡 تلميح
                      </button>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-normal text-slate-800 leading-snug whitespace-pre-line text-right">{q.text}</h3>
                  {showHint && (
                      <div className="mt-4 smooth-expand">
                          <HintBox hintText={q.hint} />
                      </div>
                  )}
              </div>

              <div className={`grid gap-3 mx-auto w-full ${isTF ? 'max-w-[280px]' : 'max-w-md'} flex-grow grid-cols-1 content-start`}>
                  {options.map((opt, optIdx) => {
                    let btnClass = `w-full p-4 md:p-5 rounded-xl border-2 transition-all font-normal text-xl md:text-2xl flex items-center gap-3 ${isTF ? 'justify-center' : 'justify-start'} `;
                    if (!answered) { 
                      btnClass += `border-slate-200 bg-white text-slate-600 active:scale-95 md:hover:bg-slate-50 cursor-pointer`; 
                    } else {
                        if (opt.isCorrect) btnClass += "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm";
                        else if (selectedOption === opt) btnClass += "bg-rose-50 border-rose-500 text-rose-800 shadow-sm";
                        else btnClass += "bg-slate-50 border-slate-100 text-slate-400 opacity-60";
                        btnClass += " cursor-default";
                    }
                    let numClass = `w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full text-xl md:text-2xl font-bold shrink-0 transition-all `;
                    if (answered) numClass += opt.isCorrect ? 'bg-emerald-500 text-white shadow-sm' : (selectedOption === opt ? 'bg-rose-500 text-white shadow-sm' : 'bg-slate-100 text-slate-400 border border-slate-200');
                    else numClass += `bg-white text-${sectionData.theme}-600 shadow-md border border-slate-100`;
                    
                    return (
                      <button key={optIdx} disabled={answered} onClick={() => handleAnswer(idx, optIdx)} className={btnClass}>
                        {!isTF && <div className={numClass}>{toArabicNum(optIdx + 1)}</div>}
                        <span className={`relative z-10 flex-grow ${isTF ? 'text-center' : 'text-right'}`}>{opt.text}</span>
                        {answered && opt.isCorrect && <span className="text-emerald-600">✓</span>}
                        {answered && selectedOption === opt && !opt.isCorrect && <span className="text-rose-600">✗</span>}
                      </button>
                    )
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

export default MCQ;
