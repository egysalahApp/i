import React, { useState, useEffect } from 'react';
import { Save, X, PlusCircle, Trash2 } from 'lucide-react';

const VisualIntroEditor = ({ section, onSave, onCancel }) => {
  // Initialize state with section data or defaults
  const [title, setTitle] = useState(section.title || '');
  const [description, setDescription] = useState(section.description || '');
  const [theme, setTheme] = useState(section.theme || 'sky');
  const [content, setContent] = useState(section.content || []);

  const handleCardChange = (index, field, value) => {
    const newContent = [...content];
    newContent[index][field] = value;
    setContent(newContent);
  };

  const addCard = () => {
    setContent([
      ...content,
      { icon: '📝', title: 'عنوان جديد', desc: 'وصف جديد', examples: '', theme: 'blue' }
    ]);
  };

  const removeCard = (index) => {
    const newContent = content.filter((_, i) => i !== index);
    setContent(newContent);
  };

  const moveCard = (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === content.length - 1)) return;
    const newContent = [...content];
    const targetIndex = index + direction;
    [newContent[index], newContent[targetIndex]] = [newContent[targetIndex], newContent[index]];
    setContent(newContent);
  };

  const handleSave = () => {
    const updatedSection = {
      ...section,
      title,
      description,
      theme,
      content
    };
    onSave(updatedSection);
  };

  const themes = ['sky', 'indigo', 'emerald', 'amber', 'rose', 'violet', 'blue'];

  return (
    <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm mt-4 animate-in fade-in slide-in-from-top-4 max-w-full">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-indigo-900">محرر المقدمة (واجهة مرئية)</h3>
          <p className="text-sm text-slate-500">عدل نصوص المقدمة والبطاقات بدون أكواد</p>
        </div>
        <button onClick={onCancel} className="text-slate-400 hover:text-rose-600 bg-slate-50 p-2 rounded-full border border-slate-200 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-6">
        {/* Main Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <label className="block text-slate-700 font-medium mb-2 text-sm">العنوان الرئيسي للمقدمة</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-700 font-medium mb-2 text-sm">اللون (Theme)</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              dir="ltr"
            >
              {themes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-slate-700 font-medium mb-2 text-sm">الوصف الافتتاحي</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none h-24"
            ></textarea>
          </div>
        </div>

        {/* Cards (Content) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-slate-800">البطاقات التفصيلية ({content.length})</h4>
            <button onClick={addCard} className="flex items-center gap-1 text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
              <PlusCircle size={16} />
              إضافة بطاقة
            </button>
          </div>

          <div className="space-y-4">
            {content.map((card, index) => (
              <div key={index} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative group">
                <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => moveCard(index, -1)} disabled={index === 0} className="text-slate-300 hover:text-indigo-600 disabled:opacity-0" title="تحريك لأعلى"><ArrowUp size={18} /></button>
                  <button onClick={() => moveCard(index, 1)} disabled={index === content.length - 1} className="text-slate-300 hover:text-indigo-600 disabled:opacity-0" title="تحريك لأسفل"><ArrowDown size={18} /></button>
                  <button 
                    onClick={() => removeCard(index)}
                    className="text-slate-300 hover:text-rose-500"
                    title="حذف البطاقة"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-1">
                     <label className="block text-slate-600 text-xs font-medium mb-1">إيموجي</label>
                     <input type="text" value={card.icon || ''} onChange={(e) => handleCardChange(index, 'icon', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-center text-xl" />
                  </div>
                  <div className="col-span-12 md:col-span-9">
                     <label className="block text-slate-600 text-xs font-medium mb-1">عنوان البطاقة</label>
                     <textarea value={card.title || ''} onChange={(e) => handleCardChange(index, 'title', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 font-bold h-12"></textarea>
                  </div>
                  <div className="col-span-12 md:col-span-2">
                     <label className="block text-slate-600 text-xs font-medium mb-1">اللون</label>
                     <select value={card.theme || 'blue'} onChange={(e) => handleCardChange(index, 'theme', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200" dir="ltr">
                        {themes.map(t => <option key={t} value={t}>{t}</option>)}
                     </select>
                  </div>
                  <div className="col-span-12">
                     <label className="block text-slate-600 text-xs font-medium mb-1">الشرح الأساسي</label>
                     <textarea value={card.desc || ''} onChange={(e) => handleCardChange(index, 'desc', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 h-24 text-sm leading-relaxed"></textarea>
                  </div>
                  <div className="col-span-12">
                     <label className="block text-slate-600 text-xs font-medium mb-1">الأمثلة أو التفاصيل</label>
                     <textarea value={card.examples || ''} onChange={(e) => handleCardChange(index, 'examples', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 h-24 text-sm leading-relaxed"></textarea>
                  </div>
                </div>
              </div>
            ))}
            
            {content.length === 0 && (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-500 text-sm">لا توجد بطاقات. اضغط على "إضافة بطاقة" للبدء.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
        <button onClick={onCancel} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">
          إلغاء التعديل
        </button>
        <button onClick={handleSave} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-lg font-bold shadow-sm transition-all active:scale-95">
          <Save size={18} />
          اعتماد التغييرات
        </button>
      </div>
    </div>
  );
};

export default VisualIntroEditor;
