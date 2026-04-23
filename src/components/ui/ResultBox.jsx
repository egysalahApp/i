import React from 'react';
import { toArabicNum } from '../../utils';
import { Trophy } from 'lucide-react';

export const ResultBox = ({ title, theme, score, total }) => {
  return (
    <div className={`mt-12 p-8 md:p-10 bg-white border-2 border-${theme}-200 rounded-[2rem] shadow-md text-center max-w-2xl mx-auto w-full smooth-expand flex flex-col items-center justify-center gap-2`}>
      <div className={`text-xl md:text-2xl font-bold text-slate-400 mb-2 uppercase tracking-widest`}>النتيجة النهائية</div>
      <h3 className="text-2xl md:text-3xl font-bold text-slate-700 mb-4">
        {title}
      </h3>
      <div className={`text-5xl md:text-6xl font-black text-${theme}-600`}>
        {toArabicNum(score)} / {toArabicNum(total)}
      </div>
    </div>
  );
};
