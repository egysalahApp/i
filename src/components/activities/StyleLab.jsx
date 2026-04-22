import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { toArabicNum } from '../../utils';

const StyleLab = ({ sectionData }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedId, setSelectedId] = useState(null);

  const excerpt = sectionData.excerpts[currentIdx];
  const selectedSeg = excerpt.segments.find(s => s.id === selectedId);
  const total = sectionData.excerpts.length;

  const scrollToContent = () => {
    setTimeout(() => {
      const stickyTabs = document.getElementById('sticky-tabs-container');
      const cardArea = document.getElementById('stylelab-card-area');
      if (cardArea) {
        const headerOffset = stickyTabs ? stickyTabs.offsetHeight : 80;
        const elementPosition = cardArea.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset - 20;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }, 50);
  };

  const handleNav = (dir) => {
    const newIdx = currentIdx + dir;
    if (newIdx >= 0 && newIdx < total) {
      setCurrentIdx(newIdx);
      setSelectedId(null);
      scrollToContent();
    }
  };

  return (
    <div className="max-w-4xl mx-auto fade-in">
      {sectionData.description && (
        <div className="text-center mb-8">
          <p className={`text-lg md:text-xl text-${sectionData.theme}-800 font-semibold bg-${sectionData.theme}-50 bg-opacity-60 p-4 md:p-5 rounded-2xl shadow-sm inline-block w-full`}>
            {sectionData.description}
          </p>
        </div>
      )}

      <div className="w-full relative min-h-[300px]">
        <div id="stylelab-card-area" className="bg-white rounded-3xl border border-slate-200 shadow-sm px-4 py-6 md:p-10 transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
              <span className={`text-${sectionData.theme}-600 font-bold text-lg md:text-xl`}>
                القطعة {toArabicNum(currentIdx + 1)} من {toArabicNum(total)}
              </span>
          </div>
          
          <div className="text-2xl md:text-3xl leading-[2.5] md:leading-[3] text-right font-normal text-slate-800 mb-8 bg-slate-50 px-4 py-6 md:p-8 rounded-2xl border border-slate-100 shadow-inner">
            {excerpt.segments.map((seg, i) => {
              if (seg.isHighlight) {
                const isSelected = selectedId === seg.id;
                let classes = `inline font-bold px-3 py-1 md:py-2 mx-1 rounded-lg cursor-pointer transition-all duration-300 select-none `;
                if (isSelected) {
                    classes += `bg-${sectionData.theme}-500 text-white shadow-md`;
                } else {
                    classes += `bg-${sectionData.theme}-100 text-${sectionData.theme}-800 border-b-2 border-${sectionData.theme}-300 hover:bg-${sectionData.theme}-200`;
                }
                return <span key={i} className={classes} onClick={() => setSelectedId(seg.id)}>{seg.text}</span>;
              }
              return <span key={i} className="text-slate-800">{seg.text}</span>;
            })}
          </div>
          
          <div className="min-h-[8rem] w-full transition-all duration-300">
              {selectedSeg ? (
              <div className={`bg-${sectionData.theme}-50 border border-${sectionData.theme}-200 rounded-2xl p-6 text-right smooth-expand`}>
                  <h4 className={`text-${sectionData.theme}-800 font-bold text-xl md:text-2xl mb-3 flex items-center gap-2`}>
                    <span className="text-2xl">💡</span> التفسير:
                  </h4>
                  <p className="text-xl md:text-2xl text-slate-700 font-normal leading-relaxed">{selectedSeg.explanation}</p>
              </div>
              ) : (
              <div className="flex items-center justify-center h-full text-slate-400 font-medium text-lg md:text-xl border-2 border-dashed border-slate-200 rounded-2xl p-6 min-h-[8rem]">
                  انقر على الكلمات الملونة في النص لاكتشاف وظيفتها البلاغية واللغوية.
              </div>
              )}
          </div>
          
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100">
              <button disabled={currentIdx === 0} onClick={() => handleNav(-1)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 active:scale-95 transition-all text-lg ${currentIdx === 0 ? 'opacity-50 pointer-events-none' : ''}`}>
                <ArrowRight className="w-5 h-5" /> السابق
              </button>
              <button disabled={currentIdx === total - 1} onClick={() => handleNav(1)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full bg-${sectionData.theme}-100 text-${sectionData.theme}-700 font-bold hover:bg-${sectionData.theme}-200 active:scale-95 transition-all text-lg ${currentIdx === total - 1 ? 'opacity-50 pointer-events-none' : ''}`}>
                التالي <ArrowLeft className="w-5 h-5" />
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleLab;
