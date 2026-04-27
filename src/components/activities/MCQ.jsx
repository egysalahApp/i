import React, { useState, useEffect } from 'react';
import { ResultBox } from '../ui/ResultBox';
import { HintBox } from '../ui/HintBox';
import { FeedbackBox } from '../ui/FeedbackBox';
import { toArabicNum, shuffleArray, renderFormattedText } from '../../utils';

const MCQ = ({ sectionData, progress, onUpdateProgress }) => {
  const isComplete = progress.total > 0 && progress.answered === progress.total;

  const [questions, setQuestions] = useState(() => {
    return (sectionData.questions || []).map(q => {
      let opts = (q.options || []).map((opt, oIdx) => ({ text: opt, isCorrect: oIdx === q.correct }));
      
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
    });
  });

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
          <p className={`text-lg md:text-xl text-slate-700 font-medium bg-${sectionData.theme}-50/40 border border-${sectionData.theme}-100 p-4 md:p-5 rounded-2xl shadow-sm inline-block w-full leading-relaxed`}>
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
                      <button onClick={() => toggleHint(idx)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-lg md:text-xl font-bold transition-all active:scale-95 text-orange-500 md:hover:bg-orange-50">
                        💡 تلميح
                      </button>
                  </div>
                  <h3 
                    className="text-2xl md:text-3xl font-medium leading-[2.2] text-slate-800 whitespace-pre-line text-right"
                    dangerouslySetInnerHTML={{ __html: renderFormattedText(q.text, sectionData.theme) }}
                  />
                  {showHint && (
                      <div className="mt-4 smooth-expand">
                          <HintBox hintText={q.hint} />
                      </div>
                  )}
              </div>

              <div className={`grid gap-3 mx-auto w-full ${isTF ? 'max-w-[280px]' : 'max-w-md md:max-w-2xl'} flex-grow grid-cols-1 content-start`}>
                  {options.map((opt, optIdx) => {
                    let btnClass = `w-full p-4 md:p-5 rounded-xl border-2 transition-all font-normal text-xl md:text-2xl flex items-center gap-3 ${isTF ? 'justify-center' : 'justify-start'} `;
                    if (!answered) { 
                      btnClass += `border-slate-100 bg-slate-50/50 text-slate-700 active:scale-95 md:hover:bg-${sectionData.theme}-50/80 md:hover:border-${sectionData.theme}-200 md:hover:text-${sectionData.theme}-800 md:hover:shadow-sm cursor-pointer`; 
                    } else {
                        if (opt.isCorrect) btnClass += "bg-emerald-50 border-emerald-400 text-emerald-800 shadow-sm";
                        else if (selectedOption === opt) btnClass += "bg-rose-50 border-rose-400 text-rose-800 shadow-sm";
                        else btnClass += "bg-slate-50/50 border-slate-100 text-slate-400 opacity-50";
                        btnClass += " cursor-default";
                    }
                    let numClass = `w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full text-xl md:text-2xl font-bold shrink-0 transition-all `;
                    if (answered) numClass += opt.isCorrect ? 'bg-emerald-500 text-white shadow-sm' : (selectedOption === opt ? 'bg-rose-500 text-white shadow-sm' : 'bg-slate-100 text-slate-400 border border-slate-200');
                    else numClass += `bg-${sectionData.theme}-500 text-white shadow-md`;
                    
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
