import React, { useState } from 'react';

const Radar = ({ sectionData }) => {
  const [activeBranch, setActiveBranch] = useState(null);
  const map = sectionData.mapData;

  const handleRadarClick = (idx) => {
    setActiveBranch(idx);
  };

  return (
    <div className="max-w-4xl mx-auto fade-in flex flex-col items-center">
      {sectionData.description && (
        <div className="text-center mb-10 w-full">
          <p className={`text-lg md:text-xl text-${sectionData.theme}-800 font-semibold bg-${sectionData.theme}-50 bg-opacity-60 p-4 md:p-5 rounded-2xl shadow-sm inline-block w-full`}>
            {sectionData.description}
          </p>
        </div>
      )}

      <div className={`w-full max-w-md bg-white border-4 border-${sectionData.theme}-500 text-slate-800 rounded-[2.5rem] p-6 md:p-8 text-center shadow-lg z-10 relative mb-12 md:hover:scale-105 transition-transform duration-300`}>
          <div className={`text-xs md:text-sm font-bold text-${sectionData.theme}-500 mb-2 uppercase tracking-widest`}>{map.center.title}</div>
          <h3 className="text-2xl md:text-3xl font-bold leading-relaxed">{map.center.text}</h3>
      </div>

      <div className="flex flex-wrap justify-center gap-4 w-full relative z-10 mb-8">
        {map.branches.map((branch, idx) => {
          const isActive = activeBranch === idx;
          const btnClass = isActive
              ? `bg-${branch.color}-500 text-white shadow-md transform scale-105 ring-4 ring-${branch.color}-200`
              : `bg-white text-slate-700 border-2 border-${branch.color}-200 md:hover:bg-${branch.color}-50`;
          return (
            <button key={idx} onClick={() => handleRadarClick(idx)} className={`flex-1 min-w-[140px] max-w-[180px] p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300 active:scale-95 ${btnClass}`}>
                <span className="text-3xl md:text-4xl">{branch.icon}</span>
                <span className="font-bold text-sm md:text-base text-center leading-snug">{branch.title}</span>
            </button>
          )
        })}
      </div>

      <div className="w-full min-h-[14rem] flex items-center justify-center transition-all duration-500 mb-6">
        {activeBranch !== null ? (
          <div className={`bg-${map.branches[activeBranch].color}-50 border-2 border-${map.branches[activeBranch].color}-200 rounded-3xl p-6 md:p-8 shadow-inner w-full max-w-2xl text-center fade-in flex flex-col items-center justify-center min-h-[14rem]`}>
              <div className={`text-4xl md:text-5xl mb-4 bg-white p-4 rounded-full shadow-sm border border-${map.branches[activeBranch].color}-100 shrink-0`}>
                {map.branches[activeBranch].icon}
              </div>
              <h4 className={`text-2xl font-bold text-${map.branches[activeBranch].color}-800 mb-4`}>{map.branches[activeBranch].title}</h4>
              <p className="text-xl md:text-2xl text-slate-700 font-normal leading-relaxed">{map.branches[activeBranch].text}</p>
          </div>
        ) : (
          <div className="border-2 border-dashed border-slate-300 rounded-3xl p-8 w-full max-w-2xl text-center text-slate-400 flex flex-col items-center justify-center fade-in bg-slate-50/50 min-h-[14rem]">
              <span className="text-4xl md:text-5xl mb-3 opacity-60">👆</span>
              <span className="text-lg md:text-xl font-normal">انقر على أحد الأذرع بالأعلى لعرض تفاصيله</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Radar;
