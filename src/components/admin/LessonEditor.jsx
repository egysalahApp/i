import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Save, AlertCircle, Layout, Code, Trash2, ArrowUp, ArrowDown, Plus, FileJson, X } from 'lucide-react';
import RawSectionEditor from './RawSectionEditor';
import VisualIntroEditor from './VisualIntroEditor';
import VisualMcqEditor from './VisualMcqEditor';
import VisualStoryEditor from './VisualStoryEditor';
import VisualClassifyEditor from './VisualClassifyEditor';
import VisualFlashcardsEditor from './VisualFlashcardsEditor';
import VisualRadarEditor from './VisualRadarEditor';
import VisualStyleLabEditor from './VisualStyleLabEditor';
import VisualMatchingEditor from './VisualMatchingEditor';
import VisualHotspotEditor from './VisualHotspotEditor';
import VisualGoldenEnvelopeEditor from './VisualGoldenEnvelopeEditor';
import VisualSortEditor from './VisualSortEditor';
import VisualOrderingEditor from './VisualOrderingEditor';

import VisualContrastCardsEditor from './VisualContrastCardsEditor';
import VisualErrorCorrectionEditor from './VisualErrorCorrectionEditor';
import VisualSpottingEditor from './VisualSpottingEditor';
import VisualSentenceBuilderEditor from './VisualSentenceBuilderEditor';
import VisualMorphologyScaleEditor from './VisualMorphologyScaleEditor';
import VisualTextHighlighterEditor from './VisualTextHighlighterEditor';
import { validateLesson } from '../../lib/schemas';
import { APP_CONFIG } from '../../constants/appConfig';

const LessonEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Form State
  const [lessonId, setLessonId] = useState(isNew ? '' : id);
  const [pageTitle, setPageTitle] = useState('');
  const [headerTitle, setHeaderTitle] = useState('');
  const [headerSubtitle, setHeaderSubtitle] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [copyright, setCopyright] = useState('');
  const [sections, setSections] = useState([]);
  
  // UI State
  const [editingSectionIndex, setEditingSectionIndex] = useState(null);

  const [showImportModal, setShowImportModal] = useState(false);
  const [importJson, setImportJson] = useState('');

  useEffect(() => {
    if (!isNew) {
      fetchLesson();
    } else {
      document.title = "إضافة درس جديد | لوحة التحكم";
    }
  }, [id]);

  const fetchLesson = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      setError('تعذر تحميل الدرس');
    } else if (data) {
      document.title = `تعديل: ${data.page_title} | لوحة التحكم`;
      setPageTitle(data.page_title || '');
      setHeaderTitle(data.header_title || '');
      setHeaderSubtitle(data.header_subtitle || '');
      setYoutubeLink(data.youtube_link || '');
      setCopyright(data.copyright || '');
      // Ensure sections is always an array
      setSections(Array.isArray(data.sections) ? data.sections : []);
    }
    setLoading(false);
  };

  const handleSaveLesson = async (e) => {
    e.preventDefault();
    if (editingSectionIndex !== null) {
        alert("يرجى حفظ أو إغلاق محرر القسم المفتوح أولاً.");
        return;
    }
    
    setSaving(true);
    setError(null);

    // Validation
    if (!lessonId || lessonId.trim() === '') {
      setError('يرجى كتابة معرف الدرس (URL ID)');
      setSaving(false);
      return;
    }

    if (!/^[a-z0-9-]+$/.test(lessonId)) {
      setError('المعرف يجب أن يحتوي على حروف إنجليزية صغيرة وأرقام وعلامة (-) فقط');
      setSaving(false);
      return;
    }

    if (!pageTitle || pageTitle.trim() === '') {
      setError('يرجى كتابة عنوان الصفحة');
      setSaving(false);
      return;
    }

    const lessonData = {
      id: lessonId,
      page_title: pageTitle,
      header_title: headerTitle,
      header_subtitle: headerSubtitle,
      youtube_link: youtubeLink,
      copyright: copyright,
      sections: sections
    };

    let saveError;

    if (isNew) {
      const { error } = await supabase.from('lessons').insert([lessonData]);
      saveError = error;
    } else {
      const { error } = await supabase.from('lessons').update(lessonData).eq('id', lessonId);
      saveError = error;
    }

    if (saveError) {
      setError(saveError.message);
    } else {
      alert('تم حفظ الدرس بأكمله بنجاح!');
      if (isNew) {
        navigate('/admin');
      }
    }
    setSaving(false);
  };

  const saveSection = (updatedSection) => {
    const newSections = [...sections];
    newSections[editingSectionIndex] = updatedSection;
    setSections(newSections);
    setEditingSectionIndex(null);
  };

  const cancelEditSection = () => {
    setEditingSectionIndex(null);
  };

  const deleteSection = (index) => {
    if (window.confirm('هل أنت متأكد من حذف هذا القسم نهائياً؟')) {
      const newSections = sections.filter((_, i) => i !== index);
      setSections(newSections);
    }
  };

  const moveSection = (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === sections.length - 1)) return;
    const newSections = [...sections];
    const targetIndex = index + direction;
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    setSections(newSections);
  };

  const handleImportJson = () => {
    try {
      const data = JSON.parse(importJson);
      
      // Use Zod validation
      const validation = validateLesson(data);
      if (!validation.success) {
        const errorMsg = validation.errors.join('\n');
        alert('خطأ في بيانات الدرس:\n' + errorMsg);
        return;
      }
      
      const validatedData = validation.data;
      
      if (validatedData.id) setLessonId(validatedData.id);
      if (validatedData.pageTitle) setPageTitle(validatedData.pageTitle);
      if (validatedData.headerTitle) setHeaderTitle(validatedData.headerTitle);
      if (validatedData.headerSubtitle) setHeaderSubtitle(validatedData.headerSubtitle);
      if (validatedData.youtubeLink !== undefined) setYoutubeLink(validatedData.youtubeLink);
      if (validatedData.copyright) setCopyright(validatedData.copyright);
      if (validatedData.sections) setSections(validatedData.sections);
      
      setShowImportModal(false);
      setImportJson('');
      alert('تم استيراد بيانات الدرس بنجاح بعد التحقق من سلامتها!');
    } catch (err) {
      alert('خطأ في تنسيق الكود (JSON Syntax Error): ' + err.message);
    }
  };

  const addNewSection = (type) => {
    if (editingSectionIndex !== null) {
      alert('يرجى حفظ أو إغلاق المحرر المفتوح حالياً قبل إضافة قسم جديد.');
      return;
    }
    
    let newSection = {
      id: `section_${Date.now()}`,
      type: type,
      title: 'نشاط جديد',
      theme: 'sky',
      description: ''
    };

    // Initialize specific data structures for each type
    switch (type) {
      case 'intro':
        newSection.title = 'قبل أن نبدأ';
        newSection.content = [];
        break;
      case 'mcq':
        newSection.title = 'الضبط الصحيح';
        newSection.questions = [];
        break;
      case 'tap_to_fill':
        newSection.title = 'أكمل الجملة';
        newSection.questions = [];
        break;
      case 'story':
        newSection.title = 'قصة تعليمية';
        newSection.slides = [];
        break;
      case 'classify':
        newSection.title = 'صناديق التصنيف';
        newSection.categories = [];
        newSection.questions = [];
        break;
      case 'flashcards':
        newSection.title = 'بطاقات الذاكرة';
        newSection.cards = [];
        break;
      case 'radar':
        newSection.title = 'مخطط الرادار';
        newSection.mapData = { center: { title: '', text: '' }, branches: [] };
        break;
      case 'matching':
        newSection.title = 'نشاط التوصيل';
        newSection.pairs = [];
        break;
      case 'hotspot':
        newSection.title = 'النص التفاعلي';
        newSection.questions = [];
        break;
      case 'style_lab':
        newSection.title = 'مختبر الأسلوب';
        newSection.excerpts = [];
        break;
      case 'golden_envelope':
        newSection.title = 'أثرٌ يبقى';
        newSection.quote = '';
        newSection.summary = '';
        newSection.question = '';
        break;
      case 'sort':
        newSection.title = 'ترتيب الكلمات';
        newSection.questions = [];
        break;

      case 'contrast_cards':
        newSection.title = 'بطاقات المقارنة';
        newSection.pairs = [];
        break;
      case 'error_correction':
        newSection.title = 'تصويب الأخطاء';
        newSection.questions = [];
        break;
      case 'spotting':
        newSection.title = 'تحديد الكلمات';
        newSection.questions = [];
        break;
      case 'ordering':
        newSection.title = 'ترتيب الأحداث';
        newSection.questions = [];
        break;
      case 'sentence_builder':
      case 'word_builder':
        newSection.title = type === 'word_builder' ? 'بناء الكلمات' : 'بناء الجمل';
        newSection.questions = [];
        break;
      case 'morphology_scale':
        newSection.title = 'الميزان الصرفي';
        newSection.questions = [];
        break;
      case 'text_highlighter':
        newSection.title = 'صائد الكلمات';
        newSection.questions = [];
        break;
      default:
        break;
    }

    const updatedSections = [...sections, newSection];
    setSections(updatedSections);
    setEditingSectionIndex(updatedSections.length - 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-3 py-3 md:px-6 md:py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
          <Link to="/admin" className="shrink-0 text-slate-500 hover:text-slate-800 transition-colors bg-slate-100 hover:bg-slate-200 p-1.5 md:p-2 rounded-full">
            <ArrowRight size={18} />
          </Link>
          <h1 className="text-sm md:text-xl font-bold text-slate-800 truncate">
            {isNew ? 'إضافة درس' : `تعديل: ${pageTitle || id}`}
          </h1>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-colors bg-slate-50 hover:bg-indigo-50 px-2 md:px-3 py-1.5 rounded-lg text-[10px] md:text-sm font-bold border border-slate-100"
            title="استيراد JSON"
          >
            <FileJson size={16} />
            <span className="hidden sm:inline">استيراد JSON</span>
          </button>
          <button
            onClick={handleSaveLesson}
            disabled={saving || editingSectionIndex !== null}
            className={`bg-indigo-600 hover:bg-indigo-700 text-white px-3 md:px-6 py-1.5 md:py-2 rounded-xl font-bold shadow-md transition-all active:scale-95 flex items-center gap-1.5 text-xs md:text-base ${saving || editingSectionIndex !== null ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
          {saving ? (
             <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <Save size={16} />
              <span className="hidden xs:inline">حفظ الدرس</span>
              <span className="xs:hidden">حفظ</span>
            </>
          )}
        </button>
      </div>
    </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 md:p-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500">جاري التحميل...</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {error && (
              <div className="bg-rose-50 border-r-4 border-rose-500 p-4 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-rose-500 mt-0.5" size={20} />
                <p className="text-rose-700 font-medium">{error}</p>
              </div>
            )}

            {/* Basic Info Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
              <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">البيانات الأساسية</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-2 text-sm">معرف الدرس (URL بالإنجليزية)</label>
                  <input
                    type="text"
                    value={lessonId}
                    onChange={(e) => setLessonId(e.target.value)}
                    disabled={!isNew}
                    placeholder="مثال: esteara-lesson"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-100 disabled:text-slate-500"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-2 text-sm">عنوان الصفحة (للمتصفح)</label>
                  <input
                    type="text"
                    value={pageTitle}
                    onChange={(e) => setPageTitle(e.target.value)}
                    placeholder="مثال: درس الاستعارة | العربية السهلة"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Global Overrides */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
              <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                إعدادات إضافية <span className="text-xs font-normal text-slate-500">(اختياري - لتجاوز الإعدادات العامة)</span>
              </h2>
              <p className="text-xs text-slate-400 mb-4">اترك هذه الحقول فارغة لاستخدام الإعدادات الافتراضية للموقع.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-2 text-sm">عنوان الترويسة (Header Title)</label>
                  <input
                    type="text"
                    value={headerTitle}
                    onChange={(e) => setHeaderTitle(e.target.value)}
                    placeholder={`الافتراضي: ${APP_CONFIG.headerTitle}`}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-2 text-sm">العنوان الفرعي (Header Subtitle)</label>
                  <input
                    type="text"
                    value={headerSubtitle}
                    onChange={(e) => setHeaderSubtitle(e.target.value)}
                    placeholder={`الافتراضي: ${APP_CONFIG.headerSubtitle}`}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-2 text-sm">رابط اليوتيوب</label>
                  <input
                    type="text"
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    placeholder={`الافتراضي: ${APP_CONFIG.youtubeLink}`}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-2 text-sm">حقوق النشر (Footer Copyright)</label>
                  <input
                    type="text"
                    value={copyright}
                    onChange={(e) => setCopyright(e.target.value)}
                    placeholder={`الافتراضي: ${APP_CONFIG.copyright}`}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Sections List */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <span>أقسام وأنشطة الدرس ({sections.length})</span>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                   <button onClick={() => addNewSection('intro')} className="flex-1 sm:flex-none text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100 flex items-center justify-center gap-1">
                     <Plus size={14} /> مقدمة
                   </button>
                   
                   <div className="relative group flex-1 sm:flex-none">
                     <button className="w-full text-xs font-bold bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 flex items-center justify-center gap-1 border border-slate-200">
                       <Plus size={14} /> إضافة نشاط...
                     </button>
                     <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
                       <div className="max-h-60 overflow-y-auto">
                         <button onClick={() => addNewSection('mcq')} className="w-full text-right px-4 py-2 text-xs hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border-b border-slate-50">اختيار من متعدد</button>

                         <button onClick={() => addNewSection('tap_to_fill')} className="w-full text-right px-4 py-2 text-xs hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border-b border-slate-50">أكمل الجملة</button>
                         <button onClick={() => addNewSection('classify')} className="w-full text-right px-4 py-2 text-xs hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border-b border-slate-50">صناديق التصنيف</button>
                         <button onClick={() => addNewSection('radar')} className="w-full text-right px-4 py-2 text-xs hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border-b border-slate-50">الرادار (خريطة)</button>
                         <button onClick={() => addNewSection('matching')} className="w-full text-right px-4 py-2 text-xs hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border-b border-slate-50">توصيل الأزواج</button>
                         <button onClick={() => addNewSection('hotspot')} className="w-full text-right px-4 py-2 text-xs hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border-b border-slate-50">النص التفاعلي</button>
                         <button onClick={() => addNewSection('flashcards')} className="w-full text-right px-4 py-2 text-xs hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border-b border-slate-50">بطاقات الذاكرة</button>
                         <button onClick={() => addNewSection('sort')} className="w-full text-right px-4 py-2 text-xs hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border-b border-slate-50">ترتيب الكلمات</button>
                          <button onClick={() => addNewSection('story')} className="w-full text-right px-4 py-2 text-xs hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border-b border-slate-50">قصة تعليمية</button>
                          <button onClick={() => addNewSection('contrast_cards')} className="w-full text-right px-4 py-2 text-xs hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border-b border-slate-50">بطاقات المقارنة</button>
                          <button onClick={() => addNewSection('error_correction')} className="w-full text-right px-4 py-2 text-xs hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border-b border-slate-50">تصويب الأخطاء</button>
                          <button onClick={() => addNewSection('spotting')} className="w-full text-right px-4 py-2 text-xs hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border-b border-slate-50">تحديد الكلمات (Spotting)</button>
                          <button onClick={() => addNewSection('ordering')} className="w-full text-right px-4 py-2 text-xs hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border-b border-slate-50">ترتيب الأحداث</button>
                          <button onClick={() => addNewSection('style_lab')} className="w-full text-right px-4 py-2 text-xs hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border-b border-slate-50">مختبر الأسلوب</button>
                          <button onClick={() => addNewSection('sentence_builder')} className="w-full text-right px-4 py-2 text-xs hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border-b border-slate-50">بناء الجمل</button>
                          <button onClick={() => addNewSection('word_builder')} className="w-full text-right px-4 py-2 text-xs hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border-b border-slate-50">بناء الكلمات</button>
                          <button onClick={() => addNewSection('morphology_scale')} className="w-full text-right px-4 py-2 text-xs hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border-b border-slate-50">الميزان الصرفي</button>
                          <button onClick={() => addNewSection('text_highlighter')} className="w-full text-right px-4 py-2 text-xs hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border-b border-slate-50">صائد الكلمات</button>
                         <button onClick={() => addNewSection('golden_envelope')} className="w-full text-right px-4 py-2 text-xs hover:bg-indigo-50 text-slate-700 hover:text-indigo-600">الرسالة الذهبية</button>
                       </div>
                     </div>
                   </div>
                </div>
              </h2>
              
              <div className="space-y-3">
                {sections.map((section, index) => {
                  const isEditing = editingSectionIndex === index;
                  
                  return (
                    <div key={index}>
                      {/* Section Card (only shown if NOT editing this specific section) */}
                      {!isEditing && (
                        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors group">
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button onClick={() => moveSection(index, -1)} disabled={index === 0} className="text-slate-400 hover:text-indigo-600 disabled:opacity-20"><ArrowUp size={16} /></button>
                               <button onClick={() => moveSection(index, 1)} disabled={index === sections.length - 1} className="text-slate-400 hover:text-indigo-600 disabled:opacity-20"><ArrowDown size={16} /></button>
                            </div>
                            <div className="bg-white p-2 rounded-md border border-slate-200 text-indigo-500">
                              {section.type === 'intro' ? <Layout size={20} /> : <Code size={20} />}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800">{section.title || `نشاط: ${section.type}`}</h4>
                              <p className="text-xs text-slate-500 font-mono" dir="ltr">{index + 1}. type: {section.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                if (editingSectionIndex !== null && editingSectionIndex !== index) {
                                  alert('يرجى حفظ أو إغلاق المحرر المفتوح حالياً قبل الانتقال لتعديل قسم آخر.');
                                  return;
                                }
                                setEditingSectionIndex(index);
                              }}
                              className="text-sm font-medium bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-200 px-4 py-2 rounded-lg transition-colors"
                            >
                              {['intro', 'mcq', 'tap_to_fill', 'story', 'classify', 'flashcards', 'radar', 'style_lab', 'matching', 'hotspot', 'golden_envelope', 'sort', 'ordering', 'contrast_cards', 'error_correction', 'spotting', 'sentence_builder', 'word_builder', 'morphology_scale', 'text_highlighter'].includes(section.type) ? 'تعديل بالواجهة' : 'تعديل الكود'}
                            </button>
                            <button
                              onClick={() => deleteSection(index)}
                              className="p-2 text-slate-300 hover:text-rose-600 transition-colors"
                              title="حذف القسم"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Editor (only shown if IS editing this specific section) */}
                      {isEditing && section.type === 'intro' && (
                        <VisualIntroEditor 
                          section={section} 
                          onSave={saveSection} 
                          onCancel={cancelEditSection} 
                        />
                      )}

                      {isEditing && ['mcq', 'tap_to_fill'].includes(section.type) && (
                        <VisualMcqEditor 
                          section={section} 
                          onSave={saveSection} 
                          onCancel={cancelEditSection} 
                        />
                      )}

                      {isEditing && section.type === 'story' && (
                        <VisualStoryEditor 
                          section={section} 
                          onSave={saveSection} 
                          onCancel={cancelEditSection} 
                        />
                      )}

                      {isEditing && section.type === 'classify' && (
                        <VisualClassifyEditor 
                          section={section} 
                          onSave={saveSection} 
                          onCancel={cancelEditSection} 
                        />
                      )}

                      {isEditing && section.type === 'flashcards' && (
                        <VisualFlashcardsEditor 
                          section={section} 
                          onSave={saveSection} 
                          onCancel={cancelEditSection} 
                        />
                      )}

                      {isEditing && section.type === 'radar' && (
                        <VisualRadarEditor 
                          section={section} 
                          onSave={saveSection} 
                          onCancel={cancelEditSection} 
                        />
                      )}

                      {isEditing && section.type === 'style_lab' && (
                        <VisualStyleLabEditor 
                          section={section} 
                          onSave={saveSection} 
                          onCancel={cancelEditSection} 
                        />
                      )}

                      {isEditing && section.type === 'matching' && (
                        <VisualMatchingEditor 
                          section={section} 
                          onSave={saveSection} 
                          onCancel={cancelEditSection} 
                        />
                      )}

                      {isEditing && section.type === 'hotspot' && (
                        <VisualHotspotEditor 
                          section={section} 
                          onSave={saveSection} 
                          onCancel={cancelEditSection} 
                        />
                      )}

                      {isEditing && section.type === 'golden_envelope' && (
                        <VisualGoldenEnvelopeEditor 
                          section={section} 
                          onSave={saveSection} 
                          onCancel={cancelEditSection} 
                        />
                      )}

                      {isEditing && section.type === 'sort' && (
                        <VisualSortEditor 
                          section={section} 
                          onSave={saveSection} 
                          onCancel={cancelEditSection} 
                        />
                      )}

                      {isEditing && section.type === 'contrast_cards' && (
                        <VisualContrastCardsEditor 
                          section={section} 
                          onSave={saveSection} 
                          onCancel={cancelEditSection} 
                        />
                      )}

                      {isEditing && section.type === 'error_correction' && (
                        <VisualErrorCorrectionEditor 
                          section={section} 
                          onSave={saveSection} 
                          onCancel={cancelEditSection} 
                        />
                      )}

                      {isEditing && section.type === 'spotting' && (
                        <VisualSpottingEditor 
                          section={section} 
                          onSave={saveSection} 
                          onCancel={cancelEditSection} 
                        />
                      )}

                      {isEditing && section.type === 'ordering' && (
                        <VisualOrderingEditor 
                          section={section} 
                          onSave={saveSection} 
                          onCancel={cancelEditSection} 
                        />
                      )}
                      
                      {isEditing && ['sentence_builder', 'word_builder'].includes(section.type) && (
                        <VisualSentenceBuilderEditor 
                          section={section} 
                          onSave={saveSection} 
                          onCancel={cancelEditSection} 
                        />
                      )}

                      {isEditing && section.type === 'morphology_scale' && (
                        <VisualMorphologyScaleEditor 
                          section={section} 
                          onSave={saveSection} 
                          onCancel={cancelEditSection} 
                        />
                      )}

                      {isEditing && section.type === 'text_highlighter' && (
                        <VisualTextHighlighterEditor 
                          section={section} 
                          onSave={saveSection} 
                          onCancel={cancelEditSection} 
                        />
                      )}
                      
                      {isEditing && !['intro', 'mcq', 'tap_to_fill', 'story', 'classify', 'flashcards', 'radar', 'style_lab', 'matching', 'hotspot', 'golden_envelope', 'sort', 'ordering', 'contrast_cards', 'error_correction', 'spotting', 'sentence_builder', 'word_builder', 'morphology_scale', 'text_highlighter'].includes(section.type) && (
                        <RawSectionEditor 
                          section={section} 
                          onSave={saveSection} 
                          onCancel={cancelEditSection} 
                        />
                      )}
                    </div>
                  );
                })}
                
                {sections.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
                    <p className="text-slate-400">لا توجد أقسام في هذا الدرس بعد. ابدأ بإضافة مقدمة!</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </main>
      {/* Import JSON Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <FileJson className="text-indigo-600" /> استيراد درس من كود JSON
              </h3>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-500 mb-4">قم بلصق الكود الخاص بالدرس أدناه وسيتم ملء جميع البيانات تلقائياً.</p>
              <textarea
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                placeholder='{ "pageTitle": "...", "sections": [...] }'
                className="w-full h-80 p-4 font-mono text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
                dir="ltr"
              ></textarea>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowImportModal(false)} className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">إلغاء</button>
                <button 
                  onClick={handleImportJson}
                  disabled={!importJson.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-xl font-bold shadow-lg disabled:opacity-50"
                >
                  تطبيق البيانات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonEditor;
