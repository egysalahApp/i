import React, { useState } from 'react';

const Radar = ({ sectionData }) => {
  const [activeBranch, setActiveBranch] = useState(null);
  const map = sectionData.mapData;

  const handleRadarClick = (idx) => {
    setActiveBranch(idx);
  };

  return (
    <div className="max-w-5xl mx-auto fade-in flex flex-col items-center">
      {sectionData.description && (
        <div className="text-center mb-12 w-full">
          <p className={`text-lg md:text-xl text-${sectionData.theme}-800 font-semibold bg-${sectionData.theme}-50 bg-opacity-60 p-4 md:p-5 rounded-2xl shadow-sm inline-block w-full`}>
            {sectionData.description}
          </p>
        </div>
      )}

      {/* ROOT NODE (العقدة المركزية) */}
      <div className={`relative z-20 w-full max-w-md bg-white border-[4px] md:border-[5px] border-${sectionData.theme}-500 text-slate-800 rounded-[2rem] p-6 md:p-8 text-center shadow-xl transition-transform duration-300 md:hover:scale-105`}>
          <div className={`text-base md:text-lg font-bold text-${sectionData.theme}-500 mb-2 uppercase tracking-widest`}>{map.center.title}</div>
          <h3 className="text-2xl md:text-4xl font-extrabold leading-relaxed">{map.center.text}</h3>
      </div>

      {/* ========================================================= */}
      {/* 1. DESKTOP TREE LAYOUT (شجرة أفقية للكمبيوتر) */}
      {/* ========================================================= */}
      <div className="hidden md:flex flex-col items-center w-full">
          {/* TRUNK (الجذع الرئيسي المتجه لأسفل) */}
          <div className={`w-[4px] h-12 transition-colors duration-500 ${activeBranch !== null ? `bg-${map.branches[activeBranch].color}-400` : 'bg-slate-200'}`}></div>

          {/* BRANCHES WRAPPER (حاوية الأذرع) */}
          <div className="flex justify-center items-start w-full relative">
            {map.branches.map((branch, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === map.branches.length - 1;
                const isActive = activeBranch === idx;
                const isOnly = map.branches.length === 1;

                return (
                  <div key={`desktop-${idx}`} className="flex-1 flex flex-col items-center relative px-4 group">
                    {/* Horizontal Line Segment (الخط الأفقي لكل فرع) */}
                    {/* يستخدم Flex مقسم لنصفين لضمان اتصال الخطوط بدقة. في العربية (RTL) النصف الأول يكون على اليمين */}
                    {!isOnly && (
                      <div className="absolute top-0 left-0 w-full h-[4px] flex z-0">
                          <div className={`h-full w-1/2 transition-colors duration-500 ${isFirst ? 'bg-transparent' : (activeBranch !== null ? `bg-${map.branches[activeBranch].color}-400` : 'bg-slate-200')}`}></div>
                          <div className={`h-full w-1/2 transition-colors duration-500 ${isLast ? 'bg-transparent' : (activeBranch !== null ? `bg-${map.branches[activeBranch].color}-400` : 'bg-slate-200')}`}></div>
                      </div>
                    )}

                    {/* Vertical drop (الخط العمودي النازل للفرع) */}
                    <div className={`w-[4px] h-10 transition-colors duration-500 z-0 ${isActive ? `bg-${branch.color}-400` : (activeBranch !== null ? `bg-${map.branches[activeBranch].color}-400` : 'bg-slate-200')}`}></div>

                    {/* Branch Button (عقدة الفرع) */}
                    <button 
                      onClick={() => handleRadarClick(idx)}
                      className={`relative z-10 w-full max-w-[180px] p-5 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all duration-300 active:scale-95 ${
                          isActive 
                          ? `bg-${branch.color}-500 text-white shadow-2xl transform scale-110 ring-4 ring-${branch.color}-200 ring-offset-4` 
                          : `bg-white text-slate-700 border-[4px] border-slate-100 hover:border-${branch.color}-300 hover:bg-${branch.color}-50 hover:shadow-lg`
                      }`}
                    >
                      <span className={`text-5xl transition-transform duration-300 drop-shadow-sm ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:-translate-y-1'}`}>{branch.icon}</span>
                      <span className="font-bold text-xl md:text-2xl text-center leading-snug">{branch.title}</span>
                    </button>
                  </div>
                )
            })}
          </div>
      </div>

      {/* ========================================================= */}
      {/* 2. MOBILE TREE LAYOUT (شجرة عمودية للموبايل) */}
      {/* ========================================================= */}
      <div className="md:hidden flex flex-col items-center w-full relative pt-6 pb-2">
          {/* Main Vertical Trunk (الجذع العمودي الممتد خلف الأذرع) */}
          <div className={`absolute top-0 bottom-0 w-[4px] z-0 transition-colors duration-500 ${activeBranch !== null ? `bg-${map.branches[activeBranch].color}-400` : 'bg-slate-200'} left-1/2 -translate-x-1/2`}></div>
          
          <div className="flex flex-col gap-10 w-full items-center relative z-10">
            {map.branches.map((branch, idx) => {
                const isActive = activeBranch === idx;
                
                return (
                  <button 
                    key={`mobile-${idx}`}
                    onClick={() => handleRadarClick(idx)}
                    className={`w-[85%] max-w-[320px] p-4 rounded-3xl flex items-center gap-4 transition-all duration-300 active:scale-95 relative ${
                        isActive 
                        ? `bg-${branch.color}-500 text-white shadow-xl transform scale-[1.02] ring-4 ring-${branch.color}-200 ring-offset-2` 
                        : `bg-white text-slate-700 border-[4px] border-slate-100 hover:border-${branch.color}-300 hover:bg-${branch.color}-50 shadow-sm`
                    }`}
                  >
                    {/* أيقونة الفرع */}
                    <span className={`text-4xl shrink-0 drop-shadow-md rounded-2xl p-2 ${isActive ? 'bg-white/20' : `bg-${branch.color}-50`}`}>{branch.icon}</span>
                    <span className="font-bold text-xl md:text-2xl text-right leading-tight flex-1">{branch.title}</span>
                  </button>
                )
            })}
          </div>
      </div>

      {/* ========================================================= */}
      {/* 3. DETAIL BOX (صندوق التفاصيل المنبثق) */}
      {/* ========================================================= */}
      <div className="w-full mt-14 mb-8 flex items-center justify-center transition-all duration-500 min-h-[16rem]">
        {activeBranch !== null ? (
          <div className={`bg-${map.branches[activeBranch].color}-50 border-[4px] border-${map.branches[activeBranch].color}-200 rounded-[2.5rem] p-8 md:p-12 shadow-inner w-full max-w-3xl text-center fade-in flex flex-col items-center justify-center relative`}>
              {/* أيقونة تطفو أعلى الصندوق بشكل جميل */}
              <div className={`absolute -top-12 left-1/2 -translate-x-1/2 text-5xl md:text-6xl bg-white p-4 rounded-full shadow-lg border-4 border-${map.branches[activeBranch].color}-100 shrink-0 transform hover:scale-110 transition-transform duration-300`}>
                {map.branches[activeBranch].icon}
              </div>
              <h4 className={`text-2xl md:text-4xl font-extrabold text-${map.branches[activeBranch].color}-800 mt-6 mb-6 leading-relaxed`}>{map.branches[activeBranch].title}</h4>
              <p className="text-xl md:text-3xl text-slate-700 font-medium leading-relaxed">{map.branches[activeBranch].text}</p>
          </div>
        ) : (
          <div className="border-[4px] border-dashed border-slate-200 rounded-[2.5rem] p-10 w-full max-w-3xl text-center text-slate-400 flex flex-col items-center justify-center fade-in bg-slate-50/50 min-h-[16rem]">
              <span className="text-5xl md:text-6xl mb-6 opacity-40 animate-bounce">👇</span>
              <span className="text-xl md:text-2xl font-bold">انقر على أحد الفروع بالأعلى لعرض تفاصيله هنا</span>
          </div>
        )}
      </div>

    </div>
  );
};

export default Radar;
