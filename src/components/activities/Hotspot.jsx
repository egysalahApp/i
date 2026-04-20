import React, { useState, useEffect } from 'react';
import { ResultBox } from '../ui/ResultBox';
import { HintBox } from '../ui/HintBox';
import { FeedbackBox } from '../ui/FeedbackBox';
import { toArabicNum } from '../../utils';

const Hotspot = ({ sectionData, progress, onUpdateProgress }) => {
  const [questions, setQuestions] = useState([]);
  const isComplete = progress.total > 0 && progress.answered === progress.total;

  useEffect(() => {
    setQuestions(sectionData.questions.map(q => ({
      originalQuestion: q,
      answered: false,
      selectedTargetId: null,
      showHint: false,
      shakeSegmentId: null
    })));
  }, [sectionData.questions]);

  const handleSegmentClick = (qIdx, seg) => {
    const qState = questions[qIdx];
    if (qState.answered) return;

    if (seg.isTarget) {
      const newQuestions = [...questions];
      newQuestions[qIdx] = {
        ...newQuestions[qIdx],
        answered: true,
        selectedTargetId: seg.id,
        shakeSegmentId: null
      };
      setQuestions(newQuestions);
      onUpdateProgress(sectionData.id, progress.answered + 1, progress.score + 1);
    } else {
      const newQuestions = [...questions];
      newQuestions[qIdx].shakeSegmentId = seg.id;
      setQuestions(newQuestions);
      setTimeout(() => {
        setQuestions(prev => {
          const reset = [...prev];
          if (reset[qIdx]) reset[qIdx].shakeSegmentId = null;
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
        const { originalQuestion: q, answered, selectedTargetId, showHint, shakeSegmentId } = qState;
        const ringClass = answered ? 'ring-2 ring-emerald-400' : '';

        return (
          <div key={idx} className={`bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-200 mb-8 relative transition-colors duration-300 flex flex-col justify-start ${ringClass}`}>
              <div className="bg-slate-50 p-4 md:p-6 rounded-xl border border-slate-100 mb-6 w-full mx-auto">
                  <div className="flex items-center justify-between mb-4">
                      <span className={`text-${sectionData.theme}-600 font-bold text-lg md:text-xl`}>المهمة {toArabicNum(idx + 1)}</span>
                      <button onClick={() => toggleHint(idx)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-lg md:text-xl font-bold transition-all active:scale-95 text-amber-500 md:hover:bg-amber-50">
                        💡 تلميح
                      </button>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-semibold text-slate-800 leading-snug whitespace-pre-line text-right mb-4">🎯 {q.task}</h3>
                  {showHint && (
                      <div className="mt-4 smooth-expand">
                          <HintBox hintText={q.hint} />
                      </div>
                  )}
              </div>
              
              <div className="bg-white border-2 border-slate-100 rounded-xl p-6 md:p-8 text-2xl md:text-3xl leading-[2.5] md:leading-[3] text-right text-slate-700 mx-auto w-full max-w-4xl shadow-inner">
                  {q.paragraph.map((seg, sIdx) => {
                      if (!seg.isTarget && seg.text.length < 3) {
                          // Very short segments like punctuation shouldn't be buttons, just text
                          return <span key={sIdx} className="text-slate-800">{seg.text}</span>;
                      }

                      const isSelectedTarget = selectedTargetId === seg.id;
                      const isShaking = shakeSegmentId === seg.id;

                      let btnClass = "inline font-bold px-1.5 py-0.5 rounded transition-all duration-300 select-none pb-1 ";
                      
                      if (!answered) {
                          btnClass += `text-slate-800 border-b-2 border-slate-300 md:hover:bg-${sectionData.theme}-100 md:hover:border-${sectionData.theme}-400 md:hover:text-${sectionData.theme}-800 cursor-pointer `;
                          if (isShaking) btnClass += "bg-rose-100 border-rose-400 text-rose-700 shake ";
                      } else {
                          if (isSelectedTarget) btnClass += "bg-emerald-500 text-white border-emerald-600 shadow-md cursor-default ";
                          else btnClass += "text-slate-500 border-slate-200 cursor-default opacity-50 ";
                      }

                      return (
                          <button key={sIdx} disabled={answered} onClick={() => handleSegmentClick(idx, seg)} className={btnClass}>
                              {seg.text}
                          </button>
                      );
                  })}
              </div>

              {answered && (
                  <div className="mt-6 smooth-expand w-full">
                      <FeedbackBox isCorrect={true} explanation={q.explanation} correctLabel="أحسنت الاستخراج" />
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

export default Hotspot;
