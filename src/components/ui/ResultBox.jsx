import React from 'react';
import { toArabicNum } from '../../utils';
import { Trophy } from 'lucide-react';

export const ResultBox = ({ title, theme, score, total }) => {
  return (
    <div className={`mt-12 p-8 md:p-10 bg-white border-2 border-${theme}-200 rounded-[2rem] shadow-md text-center max-w-2xl mx-auto w-full smooth-expand flex flex-col items-center justify-center gap-4`}>
      <Trophy className={`w-16 h-16 text-${theme}-500 mb-2`} />
      <h3 className="text-2xl md:text-3xl font-bold text-slate-700">
        نتيجتك في قسم ({title})
      </h3>
      <div className={`text-4xl md:text-5xl font-bold text-${theme}-600 flex items-center justify-center gap-3 mt-4`}>
        <span>{toArabicNum(score)}</span>
        <span className="text-2xl md:text-3xl text-slate-400 font-medium mt-1">من</span>
        <span>{toArabicNum(total)}</span>
      </div>
    </div>
  );
};
