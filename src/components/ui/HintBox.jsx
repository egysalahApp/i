import React from 'react';

export const HintBox = ({ hintText }) => {
  return (
    <div className="bg-amber-50 text-amber-900 p-4 rounded-xl text-xl font-medium border border-amber-200 flex gap-2 items-start text-right smooth-expand">
      <span className="text-amber-500 font-semibold mt-1 shrink-0">💡</span>
      <span className="leading-relaxed">{hintText}</span>
    </div>
  );
};
