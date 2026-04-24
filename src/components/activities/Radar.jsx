import React, { useState, useEffect } from 'react';

const Radar = ({ sectionData }) => {
  const [activeBranch, setActiveBranch] = useState(null);
  const [activeMobileBranches, setActiveMobileBranches] = useState([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const map = {
    ...sectionData.mapData,
    branches: sectionData.mapData.branches.map((branch, idx) => ({
      ...branch,
      color: branch.color || branch.theme || ['sky', 'emerald', 'indigo', 'amber', 'violet', 'cyan', 'purple', 'rose'][idx % 8]
    }))
  };

  const colorMap = {
    blue: '#60a5fa',
    sky: '#38bdf8',
    emerald: '#34d399',
    amber: '#fbbf24',
    rose: '#fb7185',
    indigo: '#818cf8',
    purple: '#a78bfa',
    teal: '#2dd4bf',
    orange: '#fb923c'
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleRadarClick = (idx) => {
    setActiveBranch(idx);
  };

  const handleMobileRadarClick = (idx) => {
    setActiveMobileBranches(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="max-w-6xl mx-auto fade-in flex flex-col items-center px-4 relative">
      {/* Subtle Background Pattern (BluePrint Style) */}
      <div className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none overflow-hidden rounded-[3rem]" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

      {sectionData.description && (
        <div className="text-center mb-10 w-full max-w-4xl">
          <p className={`text-lg md:text-xl text-${sectionData.theme}-800 font-semibold bg-white/40 backdrop-blur-md p-4 md:p-5 rounded-2xl shadow-sm inline-block w-full border border-white/60`}>
            {sectionData.description}
          </p>
        </div>
      )}

      {/* ROOT NODE */}
      <div 
        onClick={() => !isRevealed && setIsRevealed(true)}
        className={`relative z-20 w-full max-w-[320px] md:max-w-md bg-white border-[4px] md:border-[5px] border-${sectionData.theme}-500 text-slate-800 rounded-[2.5rem] p-6 md:p-8 text-center shadow-2xl transition-all duration-500 group ${!isRevealed ? 'cursor-pointer hover:scale-105 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] ring-8 ring-white/50 mb-28 md:mb-32' : 'cursor-default md:hover:scale-[1.02] mb-0'}`}
      >
          <div className="flex justify-center mb-3">
             <span className={`px-6 py-2 rounded-full bg-${sectionData.theme}-50 text-${sectionData.theme}-600 text-xl md:text-2xl font-bold border border-${sectionData.theme}-100 shadow-sm transition-colors duration-300 group-hover:bg-${sectionData.theme}-100`}>
                {map.center.title}
             </span>
          </div>
          <h3 className={`leading-relaxed text-slate-800 tracking-tight ${map.center.text.length > 25 ? 'text-2xl md:text-3xl font-semibold' : 'text-3xl md:text-4xl font-bold'}`}>{map.center.text}</h3>
          
          {activeBranch !== null && (
            <div className={`absolute -inset-2 bg-${map.branches[activeBranch].color}-400/10 blur-3xl rounded-[3rem] -z-10 animate-pulse`}></div>
          )}

          {!isRevealed && (
            <>
              <div className={`absolute -inset-4 bg-${sectionData.theme}-400/20 blur-xl rounded-[3.5rem] -z-10 animate-pulse pointer-events-none`}></div>
              <div className="absolute -bottom-20 left-0 right-0 mx-auto w-max flex items-center gap-2 text-slate-600 font-bold fade-in bg-white/90 px-6 py-3 rounded-full shadow-md text-sm md:text-base whitespace-nowrap border border-slate-100">
                <span className="animate-bounce text-2xl">👆</span> انقر هنا لاكتشاف الخريطة
              </div>
            </>
          )}
      </div>

      {/* 1. DESKTOP CURVED TREE */}
      <div className={`hidden md:flex flex-col items-center w-full relative transition-all duration-700 overflow-visible ${isRevealed ? 'h-[220px] opacity-100 z-20' : 'h-0 opacity-0 pointer-events-none -z-10'}`}>


          <div className="absolute bottom-0 left-0 w-full flex justify-around px-2">
            {map.branches.map((branch, idx) => {
                const isActive = activeBranch === idx;
                const isDimmed = activeBranch !== null && !isActive;

                return (
                  <div 
                    key={`desk-node-${idx}`} 
                    style={isRevealed ? { opacity: 0, animation: `fadeIn 0.6s ease-out ${idx * 150}ms forwards` } : { opacity: 0 }}
                    className={`flex-1 flex flex-col items-center transition-all duration-500 ${isDimmed ? 'opacity-30 scale-90 grayscale-[40%]' : ''}`}
                  >
                    <button 
                      onClick={() => handleRadarClick(idx)}
                      className={`group relative z-10 w-[92%] max-w-[210px] p-6 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 transition-all duration-300 active:scale-95 shadow-lg border-[3px] ${
                          isActive 
                          ? `bg-${branch.color}-500 text-white border-transparent transform scale-110 ring-8 ring-${branch.color}-100 ring-offset-4` 
                          : `bg-white text-slate-700 border-slate-50 hover:border-${branch.color}-200 hover:shadow-xl`
                      }`}
                    >
                      <span className={`text-5xl transition-all duration-500 mb-1 ${isActive ? 'scale-110 drop-shadow-lg' : 'group-hover:scale-110 group-hover:-translate-y-2'}`}>{branch.icon}</span>
                      <span className="font-bold text-xl md:text-2xl text-center leading-relaxed">{branch.title}</span>
                      
                      {isActive && (
                        <div className={`absolute -bottom-1.5 w-6 h-6 bg-${branch.color}-500 rotate-45 z-0 rounded-sm`}></div>
                      )}
                    </button>
                  </div>
                )
            })}
          </div>
      </div>

      {/* 2. MOBILE CURVED TREE & ACCORDION */}
      <div className={`md:hidden flex w-full relative pt-8 pb-4 transition-all duration-700 smooth-expand ${isRevealed ? 'block' : 'hidden'}`}>
          
          <div className="flex flex-col gap-6 w-full items-center relative z-10 px-4">
            {map.branches.map((branch, idx) => {
                const isActive = activeMobileBranches.includes(idx);
                const isDimmed = activeMobileBranches.length > 0 && !isActive;
                
                return (
                  <div 
                    key={`mobile-${idx}`} 
                    style={isRevealed ? { opacity: 0, animation: `fadeIn 0.6s ease-out ${idx * 150}ms forwards` } : { opacity: 0 }}
                    className={`w-full flex flex-col items-center transition-opacity duration-500 ${isDimmed ? 'opacity-50' : ''}`}
                  >
                    <button 
                      onClick={() => handleMobileRadarClick(idx)}
                      className={`w-full max-w-[320px] p-5 rounded-[2.2rem] flex items-center gap-4 transition-all duration-300 active:scale-95 relative shadow-md z-10 ${
                          isActive 
                          ? `bg-${branch.color}-500 text-white ring-4 ring-${branch.color}-100 ring-offset-2` 
                          : `bg-white/90 backdrop-blur-sm text-slate-700 border-[3px] border-white`
                      }`}
                    >
                      <span className={`text-4xl shrink-0 drop-shadow-md rounded-2xl p-2 transition-colors ${isActive ? 'bg-white/20' : `bg-${branch.color}-50`}`}>{branch.icon}</span>
                      <span className="font-bold text-xl md:text-2xl text-right leading-relaxed flex-1">{branch.title}</span>
                    </button>
                    
                    {/* Accordion Content */}
                    {isActive && (
                      <div className="w-full max-w-[320px] smooth-expand mt-3">
                        <div className={`bg-white border-[3px] border-${branch.color}-200 rounded-[2rem] p-6 shadow-sm relative`}>
                          <p className="text-lg text-slate-800 font-medium leading-[2.2]">{branch.text}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )
            })}
          </div>
      </div>

      {/* 3. DETAIL BOX (DESKTOP ONLY) */}
      <div className={`hidden md:flex w-full items-center justify-center transition-all duration-700 ${isRevealed ? 'mt-4 mb-8 min-h-[16rem] opacity-100 fade-in' : 'h-0 opacity-0 overflow-hidden pointer-events-none'}`}>
        {activeBranch !== null ? (
          <div className={`bg-white/60 backdrop-blur-xl border-[4px] border-${map.branches[activeBranch].color}-200/50 rounded-[3.5rem] p-8 md:p-14 shadow-2xl w-full max-w-4xl text-center fade-in flex flex-col items-center justify-center relative overflow-visible`}>
              
              {/* Background glows */}
              <div className="absolute inset-0 overflow-hidden rounded-[3rem] -z-10 pointer-events-none">
                <div className={`absolute -bottom-32 -right-32 w-80 h-80 bg-${map.branches[activeBranch].color}-200/30 rounded-full blur-[100px]`}></div>
                <div className={`absolute -top-32 -left-32 w-80 h-80 bg-${map.branches[activeBranch].color}-100/20 rounded-full blur-[80px]`}></div>
              </div>
              
              <div className={`absolute -top-12 left-1/2 -translate-x-1/2 text-5xl md:text-7xl bg-white p-5 rounded-full shadow-xl border-4 border-white shrink-0 transform transition-transform duration-500 z-10`}>
                {map.branches[activeBranch].icon}
              </div>
              
              <h4 className={`text-2xl md:text-4xl font-black text-${map.branches[activeBranch].color}-800 mt-6 mb-2 leading-relaxed relative z-10`}>{map.branches[activeBranch].title}</h4>
              <div className={`h-1.5 w-24 bg-${map.branches[activeBranch].color}-200/50 rounded-full mb-4 relative z-10 mx-auto`}></div>
              <p className="text-xl md:text-3xl text-slate-800 font-medium leading-[2.1] md:leading-[2.6] relative z-10 max-w-3xl mx-auto">{map.branches[activeBranch].text}</p>
          </div>
        ) : (
          <div className="border-[4px] border-dashed border-slate-200/80 rounded-[3.5rem] p-12 w-full max-w-3xl text-center text-slate-400 flex flex-col items-center justify-center fade-in bg-white/40 backdrop-blur-sm min-h-[20rem]">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-8 animate-bounce transition-all">
                <span className="text-5xl">💡</span>
              </div>
              <span className="text-2xl md:text-3xl font-black text-slate-600 mb-3">ابدأ الاستكشاف</span>
              <p className="text-xl md:text-2xl font-bold opacity-70">انقر على فروع الخريطة بالأعلى لعرض التحليل الذهني</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Radar;



