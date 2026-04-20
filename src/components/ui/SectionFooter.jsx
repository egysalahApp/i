import React from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';

const SectionFooter = ({ theme, onNext, onReset, isLast, showNext }) => {
  return (
    <div className="mt-8 flex flex-col md:flex-row justify-center items-center gap-4 mx-auto w-full fade-in">
      {onReset && (
        <button onClick={onReset} className="w-full md:w-auto px-8 py-3 md:py-4 rounded-full font-semibold text-xl md:text-2xl text-slate-600 bg-slate-100 md:hover:bg-slate-200 active:scale-95 transition-transform flex items-center justify-center gap-3">
          <RefreshCw className="w-6 h-6" /> إعادة المحاولة
        </button>
      )}
      {showNext && !isLast && (
        <button onClick={onNext} className={`w-full md:w-auto px-8 md:px-10 py-3 md:py-4 rounded-full font-semibold text-xl md:text-2xl text-white shadow-md transition-transform flex items-center justify-center gap-3 active:scale-95 bg-${theme}-600 md:hover:bg-${theme}-700`}>
          القسم التالي <ArrowLeft className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default SectionFooter;
