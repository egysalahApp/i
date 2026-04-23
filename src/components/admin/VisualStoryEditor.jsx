import React, { useState } from 'react';
import { Save, X, PlusCircle, Trash2, ArrowUp, ArrowDown, BookOpen } from 'lucide-react';

const VisualStoryEditor = ({ section, onSave, onCancel }) => {
  const [title, setTitle] = useState(section.title || '');
  const [theme, setTheme] = useState(section.theme || 'emerald');
  const [slides, setSlides] = useState(section.slides || []);

  const handleSlideChange = (index, field, value) => {
    const newSlides = [...slides];
    newSlides[index][field] = value;
    setSlides(newSlides);
  };

  const addSlide = () => {
    setSlides([
      ...slides,
      { icon: '📝', title: 'عنوان الشريحة', text: 'اكتب نص الشريحة هنا...' }
    ]);
  };

  const removeSlide = (index) => {
    setSlides(slides.filter((_, i) => i !== index));
  };

  const moveSlide = (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === slides.length - 1)) return;
    const newSlides = [...slides];
    const targetIndex = index + direction;
    [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];
    setSlides(newSlides);
  };

  const handleSave = () => {
    onSave({ ...section, title, theme, slides });
  };

  const themes = ['sky', 'indigo', 'emerald', 'amber', 'rose', 'violet', 'blue', 'purple'];

  return (
    <div className="bg-white p-6 rounded-xl border border-emerald-100 shadow-sm mt-4 animate-in fade-in slide-in-from-top-4 max-w-full">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-emerald-900 flex items-center gap-2">
            <BookOpen size={24} /> محرر القصة / العرض التقديمي
          </h3>
          <p className="text-sm text-slate-500">نظم المحتوى في شرائح متتابعة لتقديم المادة العلمية</p>
        </div>
        <button onClick={onCancel} className="text-slate-400 hover:text-rose-600 bg-slate-50 p-2 rounded-full border border-slate-200 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <label className="block text-slate-700 font-medium mb-2 text-sm">عنوان القصة</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <div>
            <label className="block text-slate-700 font-medium mb-2 text-sm">اللون الرئيسي</label>
            <select value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none" dir="ltr">
              {themes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800">شرائح القصة ({slides.length})</h4>
            <button onClick={addSlide} className="flex items-center gap-1 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors">
              <PlusCircle size={16} /> إضافة شريحة
            </button>
          </div>

          {slides.map((slide, index) => (
            <div key={index} className="bg-white p-5 rounded-xl border-2 border-slate-100 shadow-sm relative group hover:border-emerald-200 transition-colors">
              <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => moveSlide(index, -1)} disabled={index === 0} className="text-slate-300 hover:text-emerald-600 disabled:opacity-0"><ArrowUp size={20} /></button>
                <button onClick={() => moveSlide(index, 1)} disabled={index === slides.length - 1} className="text-slate-300 hover:text-emerald-600 disabled:opacity-0"><ArrowDown size={20} /></button>
                <button onClick={() => removeSlide(index)} className="text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={20} /></button>
              </div>

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-1">
                   <label className="block text-slate-500 text-xs font-medium mb-1 text-center">إيموجي</label>
                   <input type="text" value={slide.icon || ''} onChange={(e) => handleSlideChange(index, 'icon', e.target.value)} className="w-full px-2 py-3 rounded-lg border border-slate-200 text-center text-2xl" />
                </div>
                <div className="col-span-12 md:col-span-11">
                   <label className="block text-slate-500 text-xs font-medium mb-1">عنوان الشريحة</label>
                   <textarea value={slide.title || ''} onChange={(e) => handleSlideChange(index, 'title', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 font-bold h-12"></textarea>
                </div>
                <div className="col-span-12">
                   <label className="block text-slate-500 text-xs font-medium mb-1">نص الشريحة (المحتوى)</label>
                   <textarea value={slide.text || ''} onChange={(e) => handleSlideChange(index, 'text', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 h-32 leading-relaxed text-lg"></textarea>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
        <button onClick={onCancel} className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">إلغاء</button>
        <button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-2 rounded-xl font-bold shadow-md transition-all active:scale-95">اعتماد التغييرات</button>
      </div>
    </div>
  );
};

export default VisualStoryEditor;
