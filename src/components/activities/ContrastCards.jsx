import React from 'react';
import { CONTRAST_PASTEL_PAIRS } from '../../constants/colorPalette';

const ContrastCards = ({ sectionData }) => {
  return (
    <div className="max-w-4xl mx-auto fade-in">
      {sectionData.description && (
        <div className="text-center mb-10 fade-in">
          <p className={`text-lg md:text-xl text-slate-700 font-medium bg-${sectionData.theme}-50/40 border border-${sectionData.theme}-100 p-4 md:p-5 rounded-2xl shadow-sm inline-block w-full leading-relaxed`}>
            {sectionData.description}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-6 md:gap-8">
        {sectionData.pairs.map((pair, idx) => {
          const colors = CONTRAST_PASTEL_PAIRS[idx % CONTRAST_PASTEL_PAIRS.length];
          return (
            <div key={idx} className="relative bg-white rounded-3xl border border-slate-200 shadow-md p-5 md:p-8 flex flex-col gap-5 overflow-hidden md:hover:shadow-lg transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`${colors.right.bg} border-2 ${colors.right.border} rounded-2xl p-6 text-center shadow-sm flex items-center justify-center min-h-[6rem]`}>
                        <h4 className={`text-xl md:text-2xl font-semibold ${colors.right.text || 'text-white'} leading-relaxed`}>{pair.right}</h4>
                    </div>
                    <div className={`${colors.left.bg} border-2 ${colors.left.border} rounded-2xl p-6 text-center shadow-sm flex items-center justify-center min-h-[6rem]`}>
                        <h4 className={`text-xl md:text-2xl font-semibold ${colors.left.text || 'text-white'} leading-relaxed`}>{pair.left}</h4>
                    </div>
                </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[calc(50%+2rem)] bg-white rounded-full w-14 h-14 shadow-lg border border-slate-100 hidden md:flex items-center justify-center font-black text-slate-400 text-xl z-10">
                  VS
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 md:p-6 text-center mt-2">
                  <p className="text-xl md:text-2xl text-slate-700 font-normal leading-relaxed">{pair.desc}</p>
              </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContrastCards;
