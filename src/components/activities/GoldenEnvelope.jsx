import React from 'react';

const GoldenEnvelope = ({ sectionData }) => {
  return (
    <div className="max-w-4xl mx-auto fade-in">
      <div className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-12 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] relative text-center">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-50 text-orange-500 mb-4 shadow-sm border border-orange-100 text-3xl">✨</div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800">الرسالة الذهبية</h2>
          <div className="w-16 h-1 bg-orange-400 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="mb-10 relative">
          <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-100 relative">
            <span className="absolute -top-6 right-4 text-5xl text-slate-300 font-bold leading-none select-none pointer-events-none">"</span>
            <h4 className="text-slate-500 font-bold text-lg md:text-xl mb-4 uppercase tracking-wider flex items-center justify-center gap-2">
              <span className="bg-slate-200 text-slate-600 px-2 py-1 rounded text-xs">📌</span> اقتباس الدرس
            </h4>
            <p dangerouslySetInnerHTML={{ __html: sectionData.quote }} className="text-xl md:text-2xl font-normal text-slate-800 leading-[2.8]" />
            <span className="absolute -bottom-10 left-4 text-5xl text-slate-300 font-bold leading-none select-none pointer-events-none">"</span>
          </div>
        </div>

        <div className="mb-10 px-2">
          <h4 className="text-slate-500 font-bold text-lg md:text-xl mb-3 uppercase tracking-wider flex items-center justify-center gap-2">
              <span className="bg-slate-200 text-slate-600 px-2 py-1 rounded text-xs">💡</span> الخلاصة
          </h4>
          <p dangerouslySetInnerHTML={{ __html: sectionData.summary }} className="text-lg md:text-xl font-normal text-slate-700 leading-[2.4]" />
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-6 md:p-8 border border-orange-100 shadow-sm transform transition-transform md:hover:-translate-y-1">
          <h4 className="text-orange-600 font-bold text-lg md:text-xl mb-3 uppercase tracking-wider flex items-center justify-center gap-2">
              <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-xs">🤔</span> سؤال للتأمل
          </h4>
          <p dangerouslySetInnerHTML={{ __html: sectionData.question }} className="text-lg md:text-xl font-normal text-slate-800 leading-[2.4]" />
        </div>

      </div>
    </div>
  );
};

export default GoldenEnvelope;
