import React, { useState } from 'react';
import { ResultBox } from '../ui/ResultBox';
import { HintBox } from '../ui/HintBox';
import { FeedbackBox } from '../ui/FeedbackBox';
import { toArabicNum } from '../../utils';
import { ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';

const CardQuiz = ({ sectionData, progress, onUpdateProgress }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(new Array(sectionData.questions.length).fill(null));
  const [showHint, setShowHint] = useState(false);

  const currentQuestion = sectionData.questions[currentIndex];
  const isAnswered = answers[currentIndex] !== null;
  const isCorrect = isAnswered && answers[currentIndex].isCorrect;
  const isLast = currentIndex === sectionData.questions.length - 1;
  const allAnswered = answers.every(a => a !== null);

  const handleAnswer = (optIdx) => {
    if (isAnswered) return;

    const selectedOption = {
      index: optIdx,
      isCorrect: optIdx === currentQuestion.correct
    };

    const newAnswers = [...answers];
    newAnswers[currentIndex] = selectedOption;
    setAnswers(newAnswers);

    // Update global progress
    const totalAnswered = newAnswers.filter(a => a !== null).length;
    const totalScore = newAnswers.reduce((acc, a) => acc + (a?.isCorrect ? 1 : 0), 0);
    onUpdateProgress(sectionData.id, totalAnswered, totalScore);
  };

  const nextCard = () => {
    if (currentIndex < sectionData.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowHint(false);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowHint(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto fade-in">
      {sectionData.description && (
        <div className="text-center mb-8">
          <p className={`text-lg md:text-xl text-${sectionData.theme}-800 font-semibold bg-${sectionData.theme}-50/60 p-4 rounded-2xl border border-${sectionData.theme}-100 shadow-sm inline-block w-full`}>
            {sectionData.description}
          </p>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="flex justify-between items-center mb-6 px-2">
        <div className="flex gap-1.5">
          {sectionData.questions.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? `w-8 bg-${sectionData.theme}-500` : 
                answers[idx] !== null ? (answers[idx].isCorrect ? 'w-2 bg-emerald-400' : 'w-2 bg-rose-400') : 
                'w-2 bg-slate-200'
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-bold text-slate-400">
          البطاقة {toArabicNum(currentIndex + 1)} من {toArabicNum(sectionData.questions.length)}
        </span>
      </div>

      {/* Main Card Container */}
      <div className="relative min-h-[400px] perspective-1000">
        <div className={`bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border-2 transition-all duration-500 transform ${
          isAnswered ? (isCorrect ? 'border-emerald-200 shadow-emerald-100' : 'border-rose-200 shadow-rose-100') : `border-${sectionData.theme}-100`
        }`}>
          
          {/* Card Header */}
          <div className="flex justify-between items-start mb-8">
            <div className={`px-4 py-1.5 rounded-full bg-${sectionData.theme}-50 text-${sectionData.theme}-600 text-sm font-bold border border-${sectionData.theme}-100`}>
              كارد كويز ✨
            </div>
            <button 
              onClick={() => setShowHint(!showHint)}
              className={`p-2 rounded-full transition-colors ${showHint ? 'bg-amber-100 text-amber-600' : 'bg-slate-50 text-slate-400 hover:bg-amber-50 hover:text-amber-500'}`}
            >
              <HelpCircle size={24} />
            </button>
          </div>

          {/* Question Text */}
          <div className="text-center mb-10">
            <h3 
              className="text-3xl md:text-4xl font-bold text-slate-800 leading-snug"
              dangerouslySetInnerHTML={{ 
                __html: currentQuestion.text
                  .replace(/«([^»]+)»/g, `<span class="text-${sectionData.theme}-600 font-extrabold">$1</span>`)
                  .replace(/<b>([^<]+)<\/b>/g, `<span class="text-${sectionData.theme}-600 font-extrabold">$1</span>`)
              }}
            />
            {showHint && (
              <div className="mt-6 smooth-expand">
                <HintBox hintText={currentQuestion.hint} />
              </div>
            )}
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = isAnswered && answers[currentIndex].index === idx;
              const isOptionCorrect = idx === currentQuestion.correct;
              
              let btnClass = `p-4 rounded-2xl border-2 text-xl font-bold transition-all duration-300 flex flex-col items-center justify-center gap-2 `;
              
              if (!isAnswered) {
                btnClass += `border-slate-100 bg-slate-50 text-slate-600 hover:border-${sectionData.theme}-300 hover:bg-${sectionData.theme}-50 hover:text-${sectionData.theme}-700 hover:-translate-y-1`;
              } else {
                if (isOptionCorrect) {
                  btnClass += `border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg shadow-emerald-100 scale-105 z-10`;
                } else if (isSelected) {
                  btnClass += `border-rose-500 bg-rose-50 text-rose-700 shake`;
                } else {
                  btnClass += `border-slate-50 bg-white text-slate-300 opacity-40`;
                }
              }

              return (
                <button 
                  key={idx} 
                  disabled={isAnswered}
                  onClick={() => handleAnswer(idx)}
                  className={btnClass}
                >
                  <span className="text-center">{opt}</span>
                  {isAnswered && isOptionCorrect && <span className="text-xs">✓ إجابة صحيحة</span>}
                </button>
              );
            })}
          </div>

          {/* Feedback Section */}
          {isAnswered && (
            <div className="mt-10 smooth-expand">
              <FeedbackBox isCorrect={isCorrect} explanation={currentQuestion.explanation} />
              
              {!isLast ? (
                <button 
                  onClick={nextCard}
                  className={`mt-6 w-full py-4 rounded-2xl bg-${sectionData.theme}-600 text-white font-bold text-xl shadow-lg hover:bg-${sectionData.theme}-700 transition-all active:scale-95 flex items-center justify-center gap-2`}
                >
                  البطاقة التالية
                  <ChevronLeft size={24} />
                </button>
              ) : allAnswered && (
                 <div className="mt-8">
                    <ResultBox 
                      title={sectionData.title} 
                      theme={sectionData.theme} 
                      score={progress.score} 
                      total={progress.total} 
                    />
                 </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Arrows */}
        <div className="absolute top-1/2 -left-4 -right-4 md:-left-16 md:-right-16 -translate-y-1/2 flex justify-between pointer-events-none">
          <button 
            onClick={prevCard} 
            disabled={currentIndex === 0}
            className={`p-3 rounded-full bg-white shadow-lg border border-slate-100 text-slate-400 transition-all pointer-events-auto ${currentIndex === 0 ? 'opacity-0' : 'hover:text-indigo-600 hover:scale-110 active:scale-95'}`}
          >
            <ChevronRight size={32} />
          </button>
          <button 
            onClick={nextCard} 
            disabled={currentIndex === sectionData.questions.length - 1 || !isAnswered}
            className={`p-3 rounded-full bg-white shadow-lg border border-slate-100 text-slate-400 transition-all pointer-events-auto ${currentIndex === sectionData.questions.length - 1 || !isAnswered ? 'opacity-0' : 'hover:text-indigo-600 hover:scale-110 active:scale-95'}`}
          >
            <ChevronLeft size={32} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardQuiz;
