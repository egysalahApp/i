import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export const FeedbackBox = ({ isCorrect, explanation, correctLabel = 'إجابة صحيحة', incorrectLabel = 'إجابة خاطئة' }) => {
  const bgClass = isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-orange-50 border-orange-200';
  const textClass = isCorrect ? 'text-emerald-700' : 'text-orange-700';
  const expClass = isCorrect ? 'text-emerald-800' : 'text-orange-800';

  return (
    <div className={`mt-6 p-5 rounded-xl border text-right smooth-expand ${bgClass}`}>
      <div className={`flex items-center justify-start gap-2 mb-3 font-bold text-xl md:text-2xl ${textClass}`}>
        {isCorrect ? <CheckCircle2 className="w-7 h-7" /> : <XCircle className="w-7 h-7" />}
        <span>{isCorrect ? correctLabel : incorrectLabel}</span>
      </div>
      <div className={`text-xl md:text-2xl font-normal leading-relaxed pr-1 ${expClass}`}>
        {explanation}
      </div>
    </div>
  );
};
