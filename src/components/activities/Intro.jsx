import React from 'react';
import { AUTO_PALETTE } from '../../constants/colorPalette';

const Intro = ({ sectionData, onNext }) => {
  return (
    <div className="max-w-4xl mx-auto pb-6">
      {sectionData.description && (
        <div className="text-center mb-10 fade-in">
          <p className={`text-lg md:text-xl text-${sectionData.theme}-800 font-semibold bg-${sectionData.theme}-50 bg-opacity-60 p-4 md:p-5 rounded-2xl shadow-sm inline-block w-full`}>
            {sectionData.description}
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full fade-in">
        {sectionData.content.map((block, idx) => {
          const theme = block.theme || AUTO_PALETTE[idx % AUTO_PALETTE.length];
          return (
            <div key={idx} className={`bg-white border-2 border-${theme}-200 rounded-[2rem] p-6 md:p-8 shadow-sm md:hover:-translate-y-2 md:hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group cursor-default`}>
              <div className={`w-16 h-16 md:w-20 md:h-20 bg-${theme}-100 rounded-full flex items-center justify-center text-3xl md:text-4xl mb-8 md:group-hover:scale-110 md:group-hover:-rotate-3 transition-transform duration-300 shrink-0`}>
                  {block.icon}
              </div>
              <h3 className={`text-2xl md:text-3xl font-bold text-${theme}-800 mb-4 leading-relaxed w-full`}>{block.title}</h3>
              <p className="text-xl md:text-xl font-normal text-slate-600 leading-relaxed mb-6 flex-grow w-full">{block.desc}</p>
              <div className={`w-full bg-${theme}-50/80 rounded-2xl p-5 text-center space-y-3 mt-auto`}>
                  <div dangerouslySetInnerHTML={{ __html: block.examples }} className={`text-xl md:text-xl font-normal text-${theme}-900 leading-relaxed`} />
              </div>
            </div>
          );
        })}
      </div>
      
    </div>
  );
};

export default Intro;
