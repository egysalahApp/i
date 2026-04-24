import React, { useState, useEffect } from 'react';
import { Trophy, RefreshCw } from 'lucide-react';
import { toArabicNum } from '../utils';
import Intro from './activities/Intro';
import Radar from './activities/Radar';
import StyleLab from './activities/StyleLab';
import ContrastCards from './activities/ContrastCards';
import Classify from './activities/Classify';
import Spotting from './activities/Spotting';
import MCQ from './activities/MCQ';
import ErrorCorrection from './activities/ErrorCorrection';
import Hotspot from './activities/Hotspot';
import TapToFill from './activities/TapToFill';
import GoldenEnvelope from './activities/GoldenEnvelope';
import Story from './activities/Story';
import Flashcards from './activities/Flashcards';
import Sort from './activities/Sort';
import Matching from './activities/Matching';
import CardQuiz from './activities/CardQuiz';
import SectionFooter from './ui/SectionFooter';
import ErrorBoundary from './ui/ErrorBoundary';

function LessonViewer({ APP_DATA }) {
  useEffect(() => {
    if (APP_DATA.pageTitle) {
      document.title = APP_DATA.pageTitle;
    }
  }, [APP_DATA.pageTitle]);

  const [activeTab, setActiveTab] = useState(APP_DATA.sections[0].id);
  const [resetKeys, setResetKeys] = useState({});
  const [progress, setProgress] = useState(
    APP_DATA.sections.reduce((acc, section) => {
      // Scorable generic logic
      const isScorable = !['intro', 'story', 'golden_envelope', 'style_lab', 'radar', 'contrast_cards', 'toolbelt'].includes(section.type);
      const total = isScorable ? (section.questions?.length || section.pairs?.length || section.cards?.length || 0) : (section.slides?.length || section.cards?.length || 1);
      const answered = isScorable ? 0 : (section.type === 'story' ? 0 : 1);
      
      acc[section.id] = { answered, total, score: 0, isScorable };
      return acc;
    }, {})
  );

  const getEffectiveTheme = (currentIdx) => {
    const currentSection = APP_DATA.sections[currentIdx];
    if (currentIdx === 0 || currentIdx === APP_DATA.sections.length - 1) return currentSection.theme;
    
    const prevEffectiveTheme = getEffectiveTheme(currentIdx - 1);
    if (currentSection.theme === prevEffectiveTheme) {
      if (currentSection.altTheme) return currentSection.altTheme;
      const pairs = {
        'emerald': 'purple',
        'cyan': 'amber',
        'amber': 'indigo',
        'purple': 'emerald',
        'violet': 'cyan',
        'slate': 'sky',
        'indigo': 'emerald'
      };
      return pairs[currentSection.theme] || currentSection.theme;
    }
    return currentSection.theme;
  };

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
      const answered = isScorable ? 0 : (activeSection.type === 'story' ? 0 : 1);
      return {
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          answered: answered,
          score: isScorable ? 0 : 1
        }
      }
    });
  };

  useEffect(() => {
    const activeTabBtn = document.getElementById(`tab-${activeTab}`);
    const tabsContainer = document.getElementById('tabs-scroll-container');
    if (activeTabBtn && tabsContainer) {
      const containerRect = tabsContainer.getBoundingClientRect();
      const btnRect = activeTabBtn.getBoundingClientRect();
      
      const scrollPos = tabsContainer.scrollLeft + (btnRect.left - containerRect.left) - (containerRect.width / 2) + (btnRect.width / 2);
      
      tabsContainer.scrollTo({
        left: scrollPos,
        behavior: 'smooth'
      });
    }
  }, [activeTab]);

  const activeSectionIndex = APP_DATA.sections.findIndex(s => s.id === activeTab);
  const isLast = activeSectionIndex === APP_DATA.sections.length - 1;

  const scrollToContent = () => {
    // استخدمنا requestAnimationFrame لمنع الرعشة التي تحدث قبل إعادة رسم DOM
    requestAnimationFrame(() => {
        setTimeout(() => {
          const stickyTabs = document.getElementById('sticky-tabs-container');
          const contentArea = document.getElementById('main-content-area');
          if (contentArea) {
            const headerOffset = stickyTabs ? stickyTabs.offsetHeight : 80;
            const elementPosition = contentArea.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;
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

  const isAllComplete = APP_DATA.sections.every(s => {
    const p = progress[s.id];
    return p && p.total > 0 && p.answered >= p.total;
  });

  const totalScore = Object.values(progress).reduce((acc, p) => acc + p.score, 0);
  const maxScore = Object.values(progress).filter(p => p.isScorable).reduce((acc, p) => acc + p.total, 0);

  const [globalMessage, setGlobalMessage] = useState('');

  useEffect(() => {
    if (isAllComplete && !globalMessage) {
        const phrases = [
            "عمل رائع! لقد أتممت جميع الأقسام بنجاح.",
            "مجهود ممتاز! أنت في طريقك نحو التميز.",
            "أداء استثنائي! استمر في هذا الإبداع.",
            "أحسنت صنعاً! لقد أثبتّ جدارتك اليوم.",
            "نهاية موفقة لدرس مفيد! واصل تقدمك."
        ];
        setGlobalMessage(phrases[Math.floor(Math.random() * phrases.length)]);
    }
  }, [isAllComplete, globalMessage]);

  const handleStartOver = () => {
    const newResetKeys = {};
    APP_DATA.sections.forEach(s => {
      newResetKeys[s.id] = (resetKeys[s.id] || 0) + 1;
    });
    setResetKeys(newResetKeys);

    setProgress(APP_DATA.sections.reduce((acc, section) => {
      const isScorable = !['intro', 'story', 'golden_envelope', 'style_lab', 'radar', 'contrast_cards', 'toolbelt'].includes(section.type);
      const total = isScorable ? (section.questions?.length || section.pairs?.length || section.cards?.length || 0) : (section.slides?.length || section.cards?.length || 1);
      const answered = isScorable ? 0 : (section.type === 'story' ? 0 : 1);
      
      acc[section.id] = { answered, total, score: 0, isScorable };
      return acc;
    }, {}));
    
    setGlobalMessage('');
    setActiveTab(APP_DATA.sections[0].id);
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
        <div id="tabs-scroll-container" className="mx-auto w-max max-w-full overflow-x-auto px-4 no-scrollbar scroll-smooth">
            <div className="flex items-center gap-3 py-3 flex-nowrap">
              {APP_DATA.sections.map((section, idx) => {
                const isActive = activeTab === section.id;
                const isDone = progress[section.id]?.isScorable && progress[section.id].answered >= progress[section.id].total;
                const effectiveTheme = getEffectiveTheme(idx);
                const activeBg = (effectiveTheme === 'slate') ? 'bg-slate-500' : `bg-${effectiveTheme}-700`;
                const activeClass = isActive ? `${activeBg} text-white shadow-lg border-transparent` : "bg-white text-slate-600 border-slate-200";
                
                return (
                  <button key={section.id} id={`tab-${section.id}`} onClick={() => handleTabClick(section.id)} className={`shrink-0 whitespace-nowrap px-6 py-2 rounded-full font-semibold text-lg md:text-xl border-2 transition-all flex items-center justify-center gap-2 active:scale-95 ${activeClass}`}>
                    {section.title}
                    {isDone && !isActive && <span className="text-emerald-600">✓</span>}
                  </button>
                )
              })}
            </div>
        </div>
        {currentProgress?.isScorable && (
          <div className="w-full h-[4px] bg-slate-200">
            <div className={`h-full transition-all duration-500 ease-out bg-${getEffectiveTheme(activeSectionIndex)}-500`} style={{ width: `${progressPercent}%` }}></div>
          </div>
        )}
      </div>

      <main id="main-content-area" className="container mx-auto px-4 pb-8 max-w-4xl flex-grow min-h-[85vh]">
        <h1 className="text-center text-2xl md:text-3xl font-semibold text-slate-700 pt-6 mb-6 bg-transparent">{APP_DATA.pageTitle.split('|')[0]}</h1>
        
        <div id="section-content-wrapper" className="fade-in">
          {APP_DATA.sections.map((section) => {
            const isActive = activeTab === section.id;
            const secProgress = progress[section.id];
            return (
              <div key={`${section.id}-${resetKeys[section.id] || 0}`} className={isActive ? 'block' : 'hidden'}>
                <ErrorBoundary>
                  {section.type === 'intro' && <Intro sectionData={section} />}
                  {section.type === 'radar' && <Radar sectionData={section} />}
                  {section.type === 'style_lab' && <StyleLab sectionData={section} />}
                  {section.type === 'contrast_cards' && <ContrastCards sectionData={section} />}
                  {section.type === 'classify' && <Classify sectionData={section} progress={secProgress} onUpdateProgress={handleUpdateProgress} />}
                  {section.type === 'spotting' && <Spotting sectionData={section} progress={secProgress} onUpdateProgress={handleUpdateProgress} />}
                  {section.type === 'mcq' && <MCQ sectionData={section} progress={secProgress} onUpdateProgress={handleUpdateProgress} />}
                  {section.type === 'error_correction' && <ErrorCorrection sectionData={section} progress={secProgress} onUpdateProgress={handleUpdateProgress} />}
                  {section.type === 'hotspot' && <Hotspot sectionData={section} progress={secProgress} onUpdateProgress={handleUpdateProgress} />}
                  {section.type === 'tap_to_fill' && <TapToFill sectionData={section} progress={secProgress} onUpdateProgress={handleUpdateProgress} />}
                  {section.type === 'story' && <Story sectionData={section} progress={secProgress} onUpdateProgress={handleUpdateProgress} onNextSection={handleNextSection} isLastSection={isLast} />}
                  {section.type === 'flashcards' && <Flashcards sectionData={section} progress={secProgress} onUpdateProgress={handleUpdateProgress} />}
                  {section.type === 'sort' && <Sort sectionData={section} progress={secProgress} onUpdateProgress={handleUpdateProgress} />}
                  {section.type === 'matching' && <Matching sectionData={section} progress={secProgress} onUpdateProgress={handleUpdateProgress} />}
                  {section.type === 'meaning_cards' && <CardQuiz sectionData={section} progress={secProgress} onUpdateProgress={handleUpdateProgress} />}
                  {section.type === 'card_quiz' && <CardQuiz sectionData={section} progress={secProgress} onUpdateProgress={handleUpdateProgress} />}
                  {section.type === 'golden_envelope' && <GoldenEnvelope sectionData={section} />}
                </ErrorBoundary>
              </div>
            );
          })}
        </div>
        
        {activeSection.type !== 'golden_envelope' && (
          <SectionFooter 
            theme={getEffectiveTheme(activeSectionIndex)} 
            onNext={handleNextSection} 
            onReset={activeSection.type !== 'intro' ? handleResetSection : null}
            isLast={isLast}
            showNext={true} 
            isScorable={currentProgress.isScorable}
          />
        )}

        {isAllComplete && (
          <div className="mt-12 bg-gradient-to-br from-indigo-50 to-purple-50 p-8 md:p-10 rounded-[2.5rem] border-2 border-indigo-100 shadow-lg text-center fade-in">
             <Trophy className="w-20 h-20 mx-auto text-indigo-500 mb-6 drop-shadow-md" />
             <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4 leading-snug">{globalMessage}</h2>
             <div className="text-2xl md:text-3xl text-indigo-700 font-bold mb-10 bg-white inline-block px-6 py-3 rounded-2xl shadow-sm border border-indigo-50">
               النتيجة الإجمالية: {toArabicNum(totalScore)} من {toArabicNum(maxScore)}
             </div>
             <button onClick={handleStartOver} className="mx-auto px-8 md:px-12 py-4 md:py-5 rounded-full font-bold text-xl md:text-2xl text-white bg-indigo-600 md:hover:bg-indigo-700 shadow-md md:hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3">
                <RefreshCw className="w-6 h-6 md:w-8 md:h-8" /> ابدأ من جديد
             </button>
          </div>
        )}
      </main>

      <footer className="mt-auto py-8 bg-white border-t border-slate-200 text-center">
          <p className="text-slate-400 text-sm font-medium block w-full">{APP_DATA.copyright}</p>
      </footer>
    </div>
  )
}

export default LessonViewer;
