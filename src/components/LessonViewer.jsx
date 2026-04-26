import React, { useState, useEffect } from 'react';
import { Trophy, RefreshCw, Link2 } from 'lucide-react';
import { toArabicNum } from '../utils';
import { APP_CONFIG } from '../constants/appConfig';
import Header from './Header';
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
import Ordering from './activities/Ordering';
import Matching from './activities/Matching';
import SentenceBuilder from './activities/SentenceBuilder';
import MorphologyScale from './activities/MorphologyScale';
import TextHighlighter from './activities/TextHighlighter';

import SectionFooter from './ui/SectionFooter';
import ShareModal from './ui/ShareModal';
import ErrorBoundary from './ui/ErrorBoundary';

function LessonViewer({ APP_DATA, singleSectionId, lessonId }) {
  const isShareMode = !!singleSectionId;
  const [showShareModal, setShowShareModal] = useState(false);
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
      const isScorable = !['intro', 'story', 'golden_envelope', 'style_lab', 'radar', 'contrast_cards'].includes(section.type);
      const total = isScorable ? (section.questions?.length || section.pairs?.length || section.cards?.length || 0) : (section.slides?.length || section.cards?.length || 1);
      const answered = isScorable ? 0 : (section.type === 'story' ? 0 : 1);
      
      acc[section.id] = { answered, total, score: 0, isScorable };
      return acc;
    }, {})
  );

  const effectiveThemes = React.useMemo(() => {
    const themePalette = APP_CONFIG.themePalette;
    const themes = [];
    const pairs = {
      'emerald': 'violet',
      'amber': 'indigo',
      'violet': 'emerald',
      'indigo': 'amber',
      'blue': 'rose',
      'rose': 'blue',
      'orange': 'indigo',
      'slate': 'sky',
      'sky': 'indigo',
      'purple': 'emerald',
      'cyan': 'amber',
    };

    APP_DATA.sections.forEach((section, idx) => {
      const autoTheme = idx === 0 ? APP_CONFIG.firstSectionTheme : themePalette[(idx - 1) % themePalette.length];
      let sectionTheme = section.theme || autoTheme;

      if (idx > 0 && idx < APP_DATA.sections.length - 1) {
        if (sectionTheme === themes[idx - 1]) {
          sectionTheme = pairs[sectionTheme] || sectionTheme;
        }
      }
      themes.push(sectionTheme);
    });
    return themes;
  }, [APP_DATA.sections]);

  const getEffectiveTheme = (idx) => effectiveThemes[idx] || 'indigo';


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
      const isScorable = !['intro', 'story', 'golden_envelope', 'style_lab', 'radar', 'contrast_cards'].includes(activeSection.type);
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
            // باستخدام الهيدر الشفاف، يمكننا العودة للطريقة البسيطة والآمنة
            const safetyMargin = 2; // هامش أمان طفيف (2px)
            const headerOffset = (stickyTabs ? stickyTabs.offsetHeight : 60) + safetyMargin;
            
            contentArea.style.scrollMarginTop = `${headerOffset}px`;
            contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 50); // زيادة التأخير قليلاً لضمان استقرار DOM في الموبايل
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
      const isScorable = !['intro', 'story', 'golden_envelope', 'style_lab', 'radar', 'contrast_cards'].includes(section.type);
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
      <Header />

      {!isShareMode && (
        <div id="sticky-tabs-container" className="sticky top-0 z-50 transform-gpu bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] border-b border-slate-200/80">
          <div id="tabs-scroll-container" className="mx-auto w-max max-w-full overflow-x-auto px-3 md:px-4 no-scrollbar scroll-smooth">
              <div className="flex items-center gap-2 md:gap-2.5 py-2 flex-nowrap">
                {APP_DATA.sections.map((section, idx) => {
                  const isActive = activeTab === section.id;
                  const isDone = progress[section.id]?.isScorable && progress[section.id].answered >= progress[section.id].total;
                  const effectiveTheme = getEffectiveTheme(idx);
                  const isSlate = effectiveTheme === 'slate';

                  // Active: solid saturated color, elevated
                  // Inactive: subtle tint of section color for visual coherence
                  const activeBg = isSlate ? 'bg-slate-500' : `bg-${effectiveTheme}-500`;
                  const inactiveBg = isSlate ? 'bg-slate-50' : `bg-${effectiveTheme}-50`;
                  const inactiveText = isSlate ? 'text-slate-600' : `text-${effectiveTheme}-700`;
                  const inactiveBorder = isSlate ? 'border-slate-200' : `border-${effectiveTheme}-200/60`;

                  const activeClass = isActive 
                    ? `${activeBg} text-white shadow-lg shadow-${effectiveTheme}-500/25 border-transparent scale-[1.04]` 
                    : `${inactiveBg} ${inactiveText} ${inactiveBorder} md:hover:bg-${effectiveTheme}-100 md:hover:border-${effectiveTheme}-300/60 md:hover:scale-[1.02]`;
                  
                  return (
                    <button key={section.id} id={`tab-${section.id}`} onClick={() => handleTabClick(section.id)} className={`shrink-0 whitespace-nowrap px-5 md:px-6 py-1.5 md:py-2 rounded-full font-semibold text-[15px] md:text-lg border-2 transition-all duration-200 flex items-center justify-center gap-2 ${activeClass}`}>
                      {section.title}
                      {isDone && !isActive && <span className={`inline-block w-2 h-2 rounded-full bg-emerald-500`}></span>}
                    </button>
                  )
                })}
              </div>
          </div>
          {currentProgress?.isScorable && (
            <div className="w-full h-[3px] bg-slate-100">
              <div className={`h-full transition-all duration-500 ease-out rounded-full bg-${getEffectiveTheme(activeSectionIndex)}-500`} style={{ width: `${progressPercent}%` }}></div>
            </div>
          )}
        </div>
      )}

      <main id="main-content-area" className="container mx-auto px-4 pb-8 max-w-4xl flex-grow min-h-[85vh]">
        <div className="flex items-center justify-center gap-3 pt-6 mb-6 relative">
          <h1 className="text-center text-2xl md:text-3xl font-semibold text-slate-700 bg-transparent">{APP_DATA.pageTitle.split('|')[0]}</h1>
          {!isShareMode && lessonId && (
            <button
              onClick={() => setShowShareModal(true)}
              className="absolute left-0 w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-indigo-100 hover:text-indigo-500 transition-all active:scale-90"
              title="مشاركة هذا القسم"
            >
              <Link2 size={18} />
            </button>
          )}
        </div>
        
        <div id="section-content-wrapper" className="fade-in">
          {APP_DATA.sections.map((section, index) => {
            // In share mode, skip sections that don't match
            if (isShareMode && section.id !== singleSectionId) return null;
            const isActive = isShareMode ? true : (activeTab === section.id);
            const secProgress = progress[section.id];
            
            // Unified Theme System: Automatically assign a premium theme based on APP_CONFIG
            const themePalette = APP_CONFIG.themePalette;
            const autoTheme = index === 0 ? APP_CONFIG.firstSectionTheme : themePalette[(index - 1) % themePalette.length];
            
            // Override section theme if it's not specified or just to enforce global consistency
            const sectionWithTheme = { 
                ...section, 
                theme: section.theme || autoTheme 
            };

            return (
              <div key={`${section.id}-${resetKeys[section.id] || 0}`} className={isActive ? 'block' : 'hidden'}>
                <ErrorBoundary>
                  {sectionWithTheme.type === 'intro' && <Intro sectionData={sectionWithTheme} />}
                  {sectionWithTheme.type === 'radar' && <Radar sectionData={sectionWithTheme} />}
                  {sectionWithTheme.type === 'style_lab' && <StyleLab sectionData={sectionWithTheme} />}
                  {sectionWithTheme.type === 'contrast_cards' && <ContrastCards sectionData={sectionWithTheme} />}
                  {sectionWithTheme.type === 'classify' && <Classify sectionData={sectionWithTheme} progress={secProgress} onUpdateProgress={handleUpdateProgress} />}
                  {sectionWithTheme.type === 'spotting' && <Spotting sectionData={sectionWithTheme} progress={secProgress} onUpdateProgress={handleUpdateProgress} />}
                  {sectionWithTheme.type === 'mcq' && <MCQ sectionData={sectionWithTheme} progress={secProgress} onUpdateProgress={handleUpdateProgress} />}
                  {sectionWithTheme.type === 'error_correction' && <ErrorCorrection sectionData={sectionWithTheme} progress={secProgress} onUpdateProgress={handleUpdateProgress} />}
                  {sectionWithTheme.type === 'hotspot' && <Hotspot sectionData={sectionWithTheme} progress={secProgress} onUpdateProgress={handleUpdateProgress} />}
                  {sectionWithTheme.type === 'tap_to_fill' && <TapToFill sectionData={sectionWithTheme} progress={secProgress} onUpdateProgress={handleUpdateProgress} />}
                  {sectionWithTheme.type === 'story' && <Story sectionData={sectionWithTheme} progress={secProgress} onUpdateProgress={handleUpdateProgress} />}
                  {sectionWithTheme.type === 'flashcards' && <Flashcards sectionData={sectionWithTheme} progress={secProgress} onUpdateProgress={handleUpdateProgress} />}
                  {sectionWithTheme.type === 'sort' && <Sort sectionData={sectionWithTheme} progress={secProgress} onUpdateProgress={handleUpdateProgress} />}
                  {sectionWithTheme.type === 'ordering' && <Ordering sectionData={sectionWithTheme} progress={secProgress} onUpdateProgress={handleUpdateProgress} />}
                  {sectionWithTheme.type === 'matching' && <Matching sectionData={sectionWithTheme} progress={secProgress} onUpdateProgress={handleUpdateProgress} />}
                  {sectionWithTheme.type === 'sentence_builder' && <SentenceBuilder sectionData={sectionWithTheme} progress={secProgress} onUpdateProgress={handleUpdateProgress} />}
                  {sectionWithTheme.type === 'word_builder' && <SentenceBuilder sectionData={sectionWithTheme} progress={secProgress} onUpdateProgress={handleUpdateProgress} />}
                  {sectionWithTheme.type === 'morphology_scale' && <MorphologyScale sectionData={sectionWithTheme} progress={secProgress} onUpdateProgress={handleUpdateProgress} />}
                  {sectionWithTheme.type === 'text_highlighter' && <TextHighlighter sectionData={sectionWithTheme} progress={secProgress} onUpdateProgress={handleUpdateProgress} />}

                  {sectionWithTheme.type === 'golden_envelope' && <GoldenEnvelope sectionData={sectionWithTheme} />}
                </ErrorBoundary>
              </div>
            );
          })}
        </div>
        
        {!isShareMode && activeSection.type !== 'golden_envelope' && (
          <SectionFooter 
            theme={getEffectiveTheme(activeSectionIndex)} 
            onNext={handleNextSection} 
            onReset={activeSection.type !== 'intro' ? handleResetSection : null}
            isLast={isLast}
            showNext={true} 
            isScorable={currentProgress.isScorable}
          />
        )}
        {isShareMode && activeSection.type !== 'intro' && (
          <SectionFooter 
            theme={getEffectiveTheme(activeSectionIndex)} 
            onReset={handleResetSection}
            isLast={true}
            showNext={false} 
            isScorable={currentProgress.isScorable}
          />
        )}

        {!isShareMode && isAllComplete && (
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
          <a href={APP_CONFIG.youtubeLink} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors text-sm font-medium block w-full">
            {APP_DATA.copyright || APP_CONFIG.copyright}
          </a>
      </footer>

      {/* Share Modal */}
      {!isShareMode && lessonId && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          lessonId={lessonId}
          sectionId={activeTab}
          sectionTitle={activeSection.title}
        />
      )}
    </div>
  )
}

export default LessonViewer;
