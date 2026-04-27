import React from 'react';

export const HintBox = ({ hintText }) => {
  return (
    <div className="bg-orange-50 text-orange-900 p-4 rounded-xl text-xl font-normal border border-orange-200 flex gap-2 items-start text-right smooth-expand">
      <span className="text-orange-500 font-semibold mt-1 shrink-0">💡</span>
      <span className="leading-relaxed">{hintText}</span>
    </div>
  );
};
