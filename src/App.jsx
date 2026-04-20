import React, { useState } from 'react';
import { APP_DATA } from './data';
import Intro from './components/activities/Intro';
import Radar from './components/activities/Radar';
import StyleLab from './components/activities/StyleLab';
import ContrastCards from './components/activities/ContrastCards';
import Classify from './components/activities/Classify';
import Spotting from './components/activities/Spotting';
import MCQ from './components/activities/MCQ';
import ErrorCorrection from './components/activities/ErrorCorrection';
import Hotspot from './components/activities/Hotspot';
import TapToFill from './components/activities/TapToFill';
import GoldenEnvelope from './components/activities/GoldenEnvelope';
import SectionFooter from './components/ui/SectionFooter';

function App() {
  const [activeTab, setActiveTab] = useState(APP_DATA.sections[0].id);
  const [resetKeys, setResetKeys] = useState({});
  const [progress, setProgress] = useState(
    APP_DATA.sections.reduce((acc, section) => {
      // Scorable generic logic
      const isScorable = !['intro', 'story', 'golden_envelope', 'style_lab', 'radar', 'contrast_cards', 'toolbelt'].includes(section.type);
      const total = isScorable ? (section.questions?.length || section.pairs?.length || 0) : 1;
      const answered = isScorable ? 0 : 1;
      
      acc[section.id] = { answered, total, score: 0, isScorable };
      return acc;
    }, {})
  );

  const activeSection = APP_DATA.sections.find(s => s.id === activeTab);
  const currentProgress = progress[activeTab];
  const progressPercent = currentProgress && currentProgress.isScorable ? (currentProgress.answered / currentProgress.total) * 100 : 0;

  const handleUpdateProgress = (sectionId, newAnswered, newScore) => {
    setProgress(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        answered: newAnswered,
        score: newScore
      }
    }));
  };

  const handleResetSection = () => {
    setResetKeys(prev => ({
      ...prev,
      [activeTab]: (prev[activeTab] || 0) + 1
    }));
    scrollToContent();
    // Also reset progress for this section
    setProgress(prev => {
      const isScorable = !['intro', 'story', 'golden_envelope', 'style_lab', 'radar', 'contrast_cards', 'toolbelt'].includes(activeSection.type);
      return {
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          answered: isScorable ? 0 : 1,
          score: isScorable ? 0 : 1
        }
      }
    });
  };

  const activeSectionIndex = APP_DATA.sections.findIndex(s => s.id === activeTab);
  const isLast = activeSectionIndex === APP_DATA.sections.length - 1;

  const scrollToContent = () => {
    // استخدمنا requestAnimationFrame لمنع الرعشة التي تحدث قبل إعادة رسم DOM
    requestAnimationFrame(() => {
        setTimeout(() => {
          const stickyTabs = document.getElementById('sticky-tabs-container');
          const contentArea = document.getElementById('section-content-wrapper');
          if (contentArea) {
            const headerOffset = stickyTabs ? stickyTabs.offsetHeight : 80;
            const elementPosition = contentArea.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset - 16;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          }
        }, 10);
    });
  };

  const handleNextSection = () => {
    if (!isLast) {
      setActiveTab(APP_DATA.sections[activeSectionIndex + 1].id);
      scrollToContent();
    }
  };

  const handleTabClick = (sectionId) => {
    setActiveTab(sectionId);
    scrollToContent();
  };

  return (
    <div className="flex-grow flex flex-col min-h-[100dvh]">
      <div className="w-full text-center py-6 bg-transparent flex flex-col items-center">
        <a href={APP_DATA.youtubeLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 text-2xl font-bold text-purple-900 md:hover:text-purple-800 md:hover:scale-105 active:scale-95 transition-transform duration-300 mb-1">
            <span>{APP_DATA.headerTitle}</span>
        </a>
        <h2 className="text-lg font-bold text-slate-600 md:hover:text-slate-700 md:hover:-translate-x-1 transition-transform duration-300 cursor-default inline-block">{APP_DATA.headerSubtitle}</h2>
      </div>

      <div id="sticky-tabs-container" className="sticky top-0 z-50 bg-[#f8fafc]/95 backdrop-blur-md shadow-sm border-b border-slate-200">
        <div className="mx-auto w-max max-w-full overflow-x-auto px-4 no-scrollbar scroll-smooth">
            <div className="flex items-center gap-3 py-3 flex-nowrap">
              {APP_DATA.sections.map((section) => {
                const isActive = activeTab === section.id;
                const isDone = progress[section.id]?.isScorable && progress[section.id].answered >= progress[section.id].total;
                const activeClass = isActive ? `bg-${section.theme}-600 text-white shadow-md` : "bg-white text-slate-600 border-slate-200";
                
                return (
                  <button key={section.id} onClick={() => handleTabClick(section.id)} className={`shrink-0 whitespace-nowrap px-6 py-2 rounded-full font-semibold text-lg md:text-xl border-2 transition-all flex items-center justify-center gap-2 active:scale-95 ${activeClass}`}>
                    {section.title}
                    {isDone && !isActive && <span className="text-emerald-600">✓</span>}
                  </button>
                )
              })}
            </div>
        </div>
        {currentProgress?.isScorable && (
          <div className="w-full h-[4px] bg-slate-200">
            <div className={`h-full transition-all duration-500 ease-out bg-${activeSection.theme}-500`} style={{ width: `${progressPercent}%` }}></div>
          </div>
        )}
      </div>

      <main id="main-content-area" className="container mx-auto px-4 pb-8 max-w-4xl flex-grow min-h-[85vh]">
        <h1 className="text-center text-2xl md:text-3xl font-semibold text-slate-700 pt-6 mb-6 bg-transparent">{APP_DATA.pageTitle.split('|')[0]}</h1>
        
        <div id="section-content-wrapper" className="fade-in" key={`${activeTab}-${resetKeys[activeTab] || 0}`}>
          {activeSection.type === 'intro' && <Intro sectionData={activeSection} />}
          {activeSection.type === 'radar' && <Radar sectionData={activeSection} />}
          {activeSection.type === 'style_lab' && <StyleLab sectionData={activeSection} />}
          {activeSection.type === 'contrast_cards' && <ContrastCards sectionData={activeSection} />}
          {activeSection.type === 'classify' && <Classify sectionData={activeSection} progress={currentProgress} onUpdateProgress={handleUpdateProgress} />}
          {activeSection.type === 'spotting' && <Spotting sectionData={activeSection} progress={currentProgress} onUpdateProgress={handleUpdateProgress} />}
          {activeSection.type === 'mcq' && <MCQ sectionData={activeSection} progress={currentProgress} onUpdateProgress={handleUpdateProgress} />}
          {activeSection.type === 'error_correction' && <ErrorCorrection sectionData={activeSection} progress={currentProgress} onUpdateProgress={handleUpdateProgress} />}
          {activeSection.type === 'hotspot' && <Hotspot sectionData={activeSection} progress={currentProgress} onUpdateProgress={handleUpdateProgress} />}
          {activeSection.type === 'tap_to_fill' && <TapToFill sectionData={activeSection} progress={currentProgress} onUpdateProgress={handleUpdateProgress} />}
          {activeSection.type === 'golden_envelope' && <GoldenEnvelope sectionData={activeSection} />}
        </div>
        
        {activeSection.type !== 'golden_envelope' && (
          <SectionFooter 
            theme={activeSection.theme} 
            onNext={handleNextSection} 
            onReset={activeSection.type !== 'intro' ? handleResetSection : null}
            isLast={isLast}
            showNext={activeSection.type === 'intro' || currentProgress.answered >= currentProgress.total} 
          />
        )}
      </main>

      <footer className="mt-auto py-8 bg-white border-t border-slate-200 text-center">
          <p className="text-slate-400 text-sm font-medium block w-full">{APP_DATA.copyright}</p>
      </footer>
    </div>
  )
}

export default App;
