import React, { useState } from 'react';
import { Save, X, PlusCircle, Trash2, ArrowUp, ArrowDown, Layout, RotateCw } from 'lucide-react';

const VisualFlashcardsEditor = ({ section, onSave, onCancel }) => {
  const [title, setTitle] = useState(section.title || '');
  const [description, setDescription] = useState(section.description || '');
  const [theme, setTheme] = useState(section.theme || 'violet');
  const [cards, setCards] = useState(section.cards || []);

  const handleCardChange = (index, field, value) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
  };

  const addCard = () => {
    setCards([...cards, { front: 'السؤال أو الكلمة', back: 'الإجابة أو الشرح' }]);
  };

  const removeCard = (index) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  const moveCard = (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === cards.length - 1)) return;
    const newCards = [...cards];
    const targetIndex = index + direction;
    [newCards[index], newCards[targetIndex]] = [newCards[targetIndex], newCards[index]];
    setCards(newCards);
  };

  const handleSave = () => {
    onSave({ ...section, title, description, theme, cards });
  };

  const themes = ['sky', 'indigo', 'emerald', 'amber', 'rose', 'violet', 'blue', 'purple'];

  return (
    <div className="bg-white p-6 rounded-xl border border-violet-100 shadow-sm mt-4 animate-in fade-in slide-in-from-top-4 max-w-full">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-violet-900 flex items-center gap-2">
            <RotateCw size={24} /> محرر البطاقات القلابة (Flashcards)
          </h3>
          <p className="text-sm text-slate-500">أنشئ بطاقات بوجهين للمراجعة والاستذكار</p>
        </div>
        <button onClick={onCancel} className="text-slate-400 hover:text-rose-600 bg-slate-50 p-2 rounded-full border border-slate-200 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <label className="block text-slate-700 font-medium mb-2 text-sm">عنوان النشاط</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none" />
          </div>
          <div>
            <label className="block text-slate-700 font-medium mb-2 text-sm">اللون الرئيسي</label>
            <select value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none" dir="ltr">
              {themes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-slate-700 font-medium mb-2 text-sm">وصف النشاط</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-violet-500 outline-none h-20"></textarea>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800">قائمة البطاقات ({cards.length})</h4>
            <button onClick={addCard} className="flex items-center gap-1 text-sm font-medium text-violet-600 bg-violet-50 px-3 py-1.5 rounded-lg hover:bg-violet-100 transition-colors">
              <PlusCircle size={16} /> إضافة بطاقة
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {cards.map((card, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm relative group hover:border-violet-200 transition-all flex flex-col gap-4">
                <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button onClick={() => moveCard(index, -1)} disabled={index === 0} className="bg-white/80 p-1 rounded border text-slate-400 hover:text-violet-600 disabled:opacity-0 shadow-sm"><ArrowUp size={18} /></button>
                  <button onClick={() => moveCard(index, 1)} disabled={index === cards.length - 1} className="bg-white/80 p-1 rounded border text-slate-400 hover:text-violet-600 disabled:opacity-0 shadow-sm"><ArrowDown size={18} /></button>
                  <button onClick={() => removeCard(index)} className="bg-white/80 p-1 rounded border text-slate-400 hover:text-rose-500 shadow-sm"><Trash2 size={18} /></button>
                </div>

                <div className="flex-grow space-y-4">
                  <div className="bg-violet-50/50 p-4 rounded-xl border border-violet-100">
                    <label className="block text-violet-700 text-xs font-bold mb-2 uppercase tracking-wider">الوجه الأمامي (Front)</label>
                    <textarea 
                      value={card.front} 
                      onChange={(e) => handleCardChange(index, 'front', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-white focus:border-violet-300 outline-none font-bold text-center text-lg h-24 shadow-sm"
                      placeholder="اكتب السؤال هنا..."
                    ></textarea>
                  </div>

                  <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                    <label className="block text-indigo-700 text-xs font-bold mb-2 uppercase tracking-wider">الوجه الخلفي (Back)</label>
                    <textarea 
                      value={card.back} 
                      onChange={(e) => handleCardChange(index, 'back', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-white focus:border-indigo-300 outline-none text-center h-24 shadow-sm"
                      placeholder="اكتب الإجابة هنا..."
                    ></textarea>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
        <button onClick={onCancel} className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">إلغاء</button>
        <button onClick={handleSave} className="bg-violet-600 hover:bg-violet-700 text-white px-10 py-2 rounded-xl font-bold shadow-md transition-all active:scale-95 flex items-center gap-2">
          <Save size={20} /> حفظ البطاقات
        </button>
      </div>
    </div>
  );
};

export default VisualFlashcardsEditor;
